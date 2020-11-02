<template>
  <div class="edit-container">
    <KPanelLayout>
      <!-- 主面板 -->
      <div ref="screenShot" slot="content" :style="originAppConfig.style">
        <KPanelItem
          v-for="(pp, index) in originAppConfig.dataPanels"
          :key="pp.panel"
          :panel="pp"
          :panel-index="index"
          :active="active"
          @get-current-panel="getCurrentPanel"
          @add-layout="addLayout"
          @del-layout="delLayout"
          @add-drag-item="addDragItem"
        >
          <KDragContainer
            v-model="active"
            :comps="pp.comps"
            :style="pp.style"
            :panel-index="index"
          />
        </KPanelItem>
      </div>
      <!-- 物料面板 -->
      <template slot="materials">
        <div class="global-bar">
          <a-button-group>
            <a-button @click="toggleActive">{{ activeText }}</a-button>
            <a-button @click="handleBundle('build')">打包</a-button>
            <a-button @click="handleImageSourceUpload">图片素材上传</a-button>
            <a-button @click="drawerShow = true">数据配置</a-button>
            <a-button @click="generateTpl">保存为模板</a-button>
            <!-- <a-button @click="handleEditConf">物料配置</a-button> -->
          </a-button-group>
        </div>
        <div class="materials-panel-box">
          <MaterialsPanel :active="active" :materials="materials" />
        </div>
      </template>
      <!-- 页面编辑面板 -->
      <template slot="properties">
        <div v-show="active">
          <EditPanel
            :app-config="originAppConfig"
            :current-panel="currentPanel"
            :current-drag-item="currentDragItem"
          />
        </div>
      </template>
    </KPanelLayout>
    <a-drawer
      closable
      title="数据配置编辑"
      placement="left"
      width="fit-content"
      :visible="drawerShow"
      @close="drawerShow = false"
    >
      <JsonEditor
        :json="originAppConfig"
        :height="boxHeight"
        @save="onConfigSave"
      />
    </a-drawer>
  </div>
</template>

<style lang="less">
.edit-container {
  position: relative;
  height: 100%;
  width: 100%;
  @global-bar-height: 40px;
  .global-bar {
    height: @global-bar-height;
  }
  .materials-panel-box {
    height: calc(~"100% - @{global-bar-height}");
    overflow: auto;
  }
}
</style>

<script>
import MaterialsPanel from "@/components/base/materials-panel";
import EditPanel from "@/components/base/edit-panel";
import JsonEditor from "@/components/json-editor";
import html2canvas from "html2canvas";

import materials from "../../__materials__/materials.json";
import { randomHash } from "@/utils";

export default {
  name: "EditPage",
  components: {
    MaterialsPanel,
    EditPanel,
    JsonEditor
  },
  data() {
    const { height } = document.body.getBoundingClientRect();
    const boxHeight = height - 140;
    return {
      boxHeight,
      materials,
      panel: 1,
      active: true,
      currentDragItem: null,
      currentPanel: null,
      drawerShow: false
    };
  },
  created() {
    this.$on("edit-drag-item", this.setCurrentDragItem);
    this.$on("drop-add-act", this.onDropAddAct);
    this.$on("set-current-node-pos", this.setPos);
    this.$on("select-tpl", this.onSelectTpl);
  },
  computed: {
    activeText() {
      return this.active ? "保存" : "编辑";
    }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    /**
     * @description 模板生成
     */
    generateTpl() {
      // 截图
      const { materials } = this;
      const opts = {
        logging: false,
        scale: 1,
        useCORS: true
      };
      const screenshot = this.$refs.screenShot;
      html2canvas(screenshot, opts).then(
        res => {
          const base64 = res.toDataURL("image/png", 1);
          const base64Data = base64.replace(/data:image\/png;base64,/, "");
          const tplInstance = {
            name: "test-pro-tpl",
            description: "测试截图描述",
            screenShot: "",
            tpl: this.originAppConfig
          };
          // 截图保存 public/screen-shots/...
          this.$talkie({
            action: "shot",
            data: {
              tplInstance,
              base64: base64Data,
              materials
            }
          });
        },
        err => {
          console.log(err);
          alert("截图失败，请重新尝试");
        }
      );
    },
    /**
     * @description 模板选择
     */
    onSelectTpl({ tpl }) {
      this.currentDragItem = this.currentPanel = null;
      this.onConfigSave(tpl);
    },
    /**
     * @description 配置编辑保存
     */
    onConfigSave(newConf) {
      // 配置文件写入
      Object.keys(newConf).forEach(key => {
        this.dispatch("CyborgProvider", "set-property", {
          key: `originAppConfig.${key}`,
          value: newConf[key]
        });
      });
      const { reactiveData } = newConf;
      Object.keys(reactiveData).forEach(key => {
        this.dispatch("CyborgProvider", "set-property", {
          key: `reactiveData.${key}`,
          value: reactiveData[key]
        });
      });
      // this.handleBundle("save");
    },

    /**
     * @description 图片素材上传
     */
    handleImageSourceUpload() {
      // 本地服务新增静态资源会刷新重新编译，需要先保存当前页面数据
      this.handleBundle("save");
      this.$talkie({ action: "upload" });
    },
    /**
     * @description 打包行为
     */
    handleBundle(action) {
      const { originAppConfig } = this;
      const emitData = {
        data: originAppConfig,
        action
      };
      console.log(emitData);
      this.$talkie(emitData);
    },
    toggleActive() {
      this.active = !this.active;
      if (!this.active) {
        this.handleBundle("save");
      }
    },
    setCurrentDragItem(nodeData) {
      this.currentDragItem = nodeData;
    },
    onDropAddAct({ panelIndex, addItem }) {
      this.addDragItem(panelIndex, addItem);
    },
    addDragItem(panelIndex, addItem) {
      const { defaultDragItem } = this.defineData;
      const panel = this.originAppConfig.dataPanels[panelIndex];
      const dgItem = addItem || {
        id: randomHash(),
        ...defaultDragItem
      };
      panel.comps.push(dgItem);
    },
    getCurrentPanel(panelIndex) {
      const instance = this.originAppConfig.dataPanels[panelIndex];
      this.currentPanel = {
        instance,
        panelIndex
      };
    },
    delLayout(index) {
      this.originAppConfig.dataPanels.splice(index, 1);
    },
    addLayout(pos, index) {
      const { defaultLayoutItem } = this.defineData;
      const defaultLayout = {
        panel: ++this.panel,
        ...defaultLayoutItem
      };
      if (index === -1) {
        return this.originAppConfig.dataPanels.unshift(defaultLayout);
      }
      this.originAppConfig.dataPanels.splice(index, 0, defaultLayout);
    },
    setPos(pos) {
      this.currentDragItem.ds && this.currentDragItem.ds.setPosition(pos);
    }
  }
};
</script>
