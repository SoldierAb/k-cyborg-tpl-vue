<template>
  <div
    :class="containerClass"
    @dragover="handleDragover"
    @drop="handleDropMeterial"
  >
    <KDragItem
      v-for="item in comps"
      :active="active"
      :node-data="item"
      :key="item.id"
    >
      <template v-slot:comp-node="{ nodeData }">
        <MaterialRender :item="nodeData" />
      </template>
    </KDragItem>
  </div>
</template>

<style lang="less">
.drag-container {
  position: relative;
}
.cyborg-drag-container-box {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>

<script>
import MaterialRender from "@/components/base/material-render";
import { randomHash } from "@/utils";

export default {
  name: "KDragContainer",
  components: { MaterialRender },
  model: {
    prop: "active"
  },
  props: {
    panelIndex: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      default() {
        return 300;
      }
    },
    active: {
      type: Boolean,
      default() {
        return true;
      }
    },
    comps: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      stateTree: this.comps
    };
  },
  computed: {
    containerClass() {
      return this.active
        ? "drag-container drag-container-active"
        : "drag-container";
    }
  },
  watch: {
    comps: {
      handler() {
        this.initDataSource();
      }
    }
  },
  created() {
    this.$on("drag-item-click", this.handleDragItemClick);
    this.$on("set-current-node-active", this.setCurrentNodeActive);
    this.$on("handle-drop-regist", this.handleRegistMaterial);
    this.$on("set-drag-item-style", this.setDragItemStyle);

    this.initDataSource();
  },
  methods: {
    /**
     * @description 数据映射处理
     */
    initDataSource() {
      if (Array.isArray(this.comps) && this.comps.length) {
        this.stateTree = this.comps;
        this.setFlatTree();
      }
    },
    /**
     * @description 组件数组扁平化映射处理
     */
    setFlatTree() {
      let flatTree = [],
        markKey = 0;
      const toFlatTree = (node, parentNode, index) => {
        node.__compKey = markKey++;
        this.$set(node, "__active", false); // 设置响应式激活属性字段
        flatTree[node.__compKey] = {
          node, // 节点
          __index: index, // 当前所在父节点子集children索引
          __compKey: node.__compKey, // 节点key
          __panelIndex: this.panelIndex // 面板标识
        };
        if (parentNode) {
          flatTree[node.__compKey]["__parentCompKey"] = parentNode.__compKey;
          flatTree[parentNode.__compKey]["children"].push(node.__compKey);
        }
        if (Array.isArray(node["children"]) && node["children"].length) {
          flatTree[node.__compKey]["children"] = [];
          node["children"].forEach((child, index) =>
            toFlatTree(child, node, index)
          );
        }
      };
      this.stateTree.forEach((rootNode, index) =>
        toFlatTree(rootNode, null, index)
      );
      this.flatTree = flatTree;
    },

    /**
     * @description 激活当前节点
     */
    setCurrentNodeActive(nodeData) {
      const { __compKey } = nodeData;
      this.setAllNodesState("__active", false);
      const findNode = this.flatTree[__compKey];
      if (findNode) {
        this.$set(findNode.node, "__active", true);
      }
    },

    /**
     * @description 设置节点样式
     */
    setDragItemStyle({ style, nodeData: { __compKey } }) {
      const findNode = this.flatTree[__compKey];
      if (findNode) {
        const { style: originStyle } = findNode.node;
        this.$set(findNode.node, "style", { ...originStyle, ...style });
      }
    },

    /**
     * @description 更新节点属性
     */
    setAllNodesState(key, value) {
      this.flatTree
        // .filter(item => item.node[key])
        .map(item => item.node)
        .forEach(leaf => {
          this.$set(leaf, key, value);
        });
    },
    /**
     * @description  节点点击行为， 增、删、改
     */
    handleDragItemClick({ type, nodeData, ds }) {
      const actionMap = new Map()
        .set("add", () => {
          // 添加子集
          const { defaultDragItem } = this.defineData;

          const dgItem = {
            id: randomHash(),
            ...defaultDragItem
          };
          if (!nodeData["children"]) {
            this.$set(nodeData, "children", []);
          }
          nodeData["children"].push(dgItem);
          this.initDataSource(); // 节点集合变化后重新记录数据
        })
        .set("delete", () => {
          // 删除节点
          const { __compKey } = nodeData;
          const findNode = this.flatTree[__compKey];
          const { __index } = findNode;
          if (findNode && !isNaN(findNode.__parentCompKey)) {
            const parentNode = this.flatTree[findNode.__parentCompKey];
            parentNode.node["children"].splice(__index, 1);
          } else {
            this.stateTree.splice(__index, 1);
          }
          this.initDataSource(); // 节点集合变化后重新记录数据
        })
        .set("edit", () => {
          const { __compKey } = nodeData;
          const findNode = this.flatTree[__compKey];
          this.dispatch("EditPage", "edit-drag-item", {
            instance: findNode.node,
            ds
          });
        });
      const func = actionMap.get(type);
      func && func();
    },

    handleDragover(ev) {
      if (!this.active) return;
      ev.preventDefault();
    },

    /**
     * @description 面板物料拖拽注册
     */
    handleDropMeterial(ev) {
      const {
        active,
        panelIndex,
        defineData: {
          dataTransferType,
          autoFitBoxStyle,
          defaultZIndex,
          defaultBackground
        }
      } = this;

      if (!active) return;
      // 获取当前位置信息
      const { offsetX: left, offsetY: top } = ev || window.event;
      const style = {
        left,
        top,
        right: "",
        bottom: "",
        margin: "",
        zIndex: defaultZIndex,
        ...autoFitBoxStyle,
        ...defaultBackground
      };
      // 获取拖拽项目数据
      const dataContent = ev.dataTransfer.getData(dataTransferType);
      const dropData = JSON.parse(dataContent);
      const addItem = {
        id: randomHash(),
        style,
        ...dropData
      };
      this.dispatch("EditPage", "drop-add-act", { panelIndex, addItem });
    },

    /**
     * @description 物料注册操作
     */
    handleRegistMaterial({ dropData, nodeData }) {
      const { __compKey } = nodeData;
      const { node } = this.flatTree[__compKey];
      Object.keys(dropData).forEach(key => {
        node[key] = dropData[key];
      });
    }
  }
};
</script>
