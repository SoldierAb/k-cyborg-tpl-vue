<template>
  <div
    :ref="dragItemEl"
    :class="`k-drag-box-container ${active ? 'k-drag-box-active' : ''}`"
    :style="dragItemStyle"
    @mousedown.stop="setCurrentNodeActive"
  >
    <!-- 组件容器节点 -->
    <div
      class="k-drag-box-node"
      @dragover.stop="handleDragover"
      @drop.stop="handleRegistMaterial"
    >
      <slot name="comp-node" v-bind="{ nodeData, children }" />
      <KDragItem
        v-for="item in children"
        :key="item.id"
        :active="active"
        :node-data="item"
      >
        <template v-slot:comp-node="{ nodeData: node, children: childs }">
          <slot
            name="comp-node"
            v-bind="{ nodeData: node, children: childs }"
          />
        </template>
      </KDragItem>
    </div>
    <!-- 操作面板 -->
    <div class="setting-bar" v-show="active && nodeData.__active">
      <!-- <div class="setting-bar-icon drag-icon" :ref="dragItemDragEl"></div> -->
      <div
        class="setting-bar-icon add-icon"
        @click.stop="clickAction('add')"
      ></div>
      <div
        class="setting-bar-icon edit-icon"
        @click.stop="clickAction('edit')"
      ></div>
      <div
        class="setting-bar-icon delete-icon"
        @click.stop="clickAction('delete')"
      ></div>
    </div>
    <span class="node-id" v-if="active">id: {{ nodeData.id }}</span>
    <span
      class="resize-icon"
      :ref="dragItemResizeEl"
      v-show="active && nodeData.__active"
    ></span>
  </div>
</template>

<style lang="less">
.k-drag-box-container {
  .k-drag-box-node {
    height: 100%;
    width: 100%;
    position: relative;
  }
}
.k-drag-box-active {
  position: relative;
  border: 1px dashed @blue;
  &:hover {
    .setting-bar {
      display: flex;
    }
    .resize-icon {
      display: block;
    }
  }
  .setting-bar {
    cursor: pointer;
    display: flex;
    // display: none;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    top: 1 - @setting-bar-size;
    right: 0;
    height: @setting-bar-size;
    background: @primary;
    width: 4 * @icon-size + 8px;
    .setting-bar-icon {
      height: @icon-size;
      width: @icon-size;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      &:hover {
        background-color: @success;
      }
    }
    .drag-icon {
      background-image: url(../../../../assets/drag.png);
    }
    .add-icon {
      background-image: url(../../../../assets/add.png);
    }
    .edit-icon {
      background-image: url(../../../../assets/edit.png);
    }
    .delete-icon {
      background-image: url(../../../../assets/delete.png);
    }
  }
  .resize-icon {
    // display: none;
    position: absolute;
    right: 0;
    bottom: 0;
    width: 16px;
    height: 16px;
    background: url(./img/resize.png);
    background-repeat: no-repeat;
    background-position: -16px -16px;
  }
  .node-id {
    position: absolute;
    left: 0;
    bottom: -20px;
    font-size: 12px;
    color: black;
  }
  .resize-icon:hover {
    cursor: nwse-resize;
  }
}
</style>

<script>
import DragResize from "./util/drag-resize";
const { remUnit } = require("../../../../../postcss.config").plugins[
  "postcss-px2rem"
];

export default {
  name: "KDragItem",
  props: {
    active: {
      type: Boolean,
      default() {
        return true;
      }
    },
    nodeData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      ds: null,
      minWidth: 20,
      minHeight: 20
    };
  },
  computed: {
    dragItemEl() {
      return `el_${this.nodeData.__compKey}`;
    },
    dragItemDragEl() {
      return `drag_${this.nodeData.__compKey}`;
    },
    dragItemResizeEl() {
      return `resize_${this.nodeData.__compKey}`;
    },
    children() {
      return this.nodeData["children"];
    },
    dragItemStyle() {
      const _style = Object.keys(this.nodeData.style).map(key => {
        // 单位值添加
        let value = this.nodeData.style[key];
        value =
          typeof value === "string" || key === "zIndex"
            ? value
            : value / remUnit + "rem";
        // key 驼峰转换
        const _key = key.replace(/[A-Z]/g, (...args) => {
          const [matchCode] = args;
          return `-${matchCode.toLowerCase()}`;
        });
        return {
          [_key]: value
        };
      });
      return _style;
    }
  },
  watch: {
    active(val) {
      // 全局激活状态监听
      this.ds && this.ds[val ? "activate" : "unActivate"]();
    },
    "nodeData.__active"(val) {
      // 当前选择激活
      this.ds && this.ds[val ? "activate" : "unActivate"]();
    },
    "nodeData.style": {
      // 同步修改拖拽实例style
      deep: true,
      handler(style) {
        if (this.ds) {
          this.ds.style = style;
        }
      }
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.ds.unActivate();
  },
  methods: {
    /**
     * @description 初始化创建 drag-resize实例
     */
    init() {
      const {
        minWidth,
        minHeight,
        dragItemEl,
        // dragItemDragEl,
        dragItemResizeEl,
        active
      } = this;
      const el = this.$refs[dragItemEl];
      // const dragEl = this.$refs[dragItemDragEl];
      const resizeEl = this.$refs[dragItemResizeEl];
      const limitBox = this.$parent.$el;
      this.ds = new DragResize({
        el,
        dragEl: el,
        resizeEl,
        limitBox,
        minWidth,
        minHeight,
        setStyleDirectly: false
      });
      this.ds[active ? "activate" : "unActivate"]();
      this.ds.onDragStart = () => {
        console.log("start");
      };
      this.ds.onDrag = pos => {
        this.setStyle(pos);
      };
      this.ds.onDragEnd = pos => {
        this.setStyle(pos);
      };
      this.ds.onResizeStart = () => {
        console.log("resize start");
      };
      this.ds.onResize = style => {
        this.setStyle(style);
      };
      this.ds.onResizeEnd = pos => {
        this.setStyle(pos);
      };
      this.ds.onSetPosition = style => {
        this.setStyle(style);
      };
    },
    setStyle(style) {
      if (!this.active) return;
      // 子节点校准
      const { children } = this.nodeData;
      if (Array.isArray(children) && children.length) {
        // 当前节点缩小的最小尺寸限制
        const minWidth = children.reduce((prev, cur) => {
          return prev < cur.style.width ? cur.style.width : prev;
        }, 0);
        const minHeight = children.reduce((prev, cur) => {
          return prev < cur.style.height ? cur.style.height : prev;
        }, 0);
        style.width = style.width < minWidth ? minWidth : style.width;
        style.height = style.height < minHeight ? minHeight : style.height;
        // 子节点定位校准
        children.forEach(child => {
          const { left, top, width, height } = child.style;
          const childMaxLeft = style.width - width;
          const childMaxTop = style.height - height;
          const newChildStyle = {
            left: left < childMaxLeft ? left : childMaxLeft,
            top: top < childMaxTop ? top : childMaxTop,
            right: "",
            bottom: "",
            margin: ""
          };
          this.dispatch("KDragContainer", "set-drag-item-style", {
            style: newChildStyle,
            nodeData: child
          });
        });
      }
      this.dispatch("KDragContainer", "set-drag-item-style", {
        style,
        nodeData: this.nodeData
      });
    },
    clickAction(_type) {
      const { ds, nodeData } = this;
      this.dispatch("KDragContainer", "drag-item-click", {
        type: _type,
        nodeData,
        ds
      });
    },
    setCurrentNodeActive() {
      if (!this.active) return;
      const { ds, nodeData } = this;
      this.dispatch("KDragContainer", "set-current-node-active", this.nodeData);
      this.dispatch("KDragContainer", "drag-item-click", {
        type: "edit",
        nodeData,
        ds
      });
    },
    handleDragover(ev) {
      if (!this.active) return;
      ev.preventDefault();
    },
    handleRegistMaterial(ev) {
      if (!this.active) return;
      const {
        defineData: { dataTransferType }
      } = this;
      const dataContent = ev.dataTransfer.getData(dataTransferType);
      if (dataContent) {
        const data = JSON.parse(dataContent);
        this.dispatch("KDragContainer", "handle-drop-regist", {
          dropData: data,
          nodeData: this.nodeData
        });
      }
    }
  }
};
</script>
