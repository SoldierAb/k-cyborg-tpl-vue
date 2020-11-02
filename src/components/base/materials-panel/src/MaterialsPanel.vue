<template>
  <div class="materials-container">
    <a-tabs default-active-key="1" tab-position="left">
      <a-tab-pane key="1" tab="模板">
        <ol class="tpl-box">
          <li
            class="tpl-item"
            v-for="tpl in tpls"
            :key="tpl.screenShot"
            @click="selectTpl(tpl)"
          >
            <div class="tpl-item-name">
              {{ tpl.name }}
            </div>
            <img width="200" height="300" :src="tpl.screenShot" />
          </li>
        </ol>
      </a-tab-pane>
      <a-tab-pane key="2" tab="物料">
        <div class="materials-item" v-for="key in Object.keys(libs)" :key="key">
          <h2>{{ key }}</h2>
          <ol>
            <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
              <li
                class="materials-comp"
                v-for="comp in libs[key]"
                :key="comp.name"
                :draggable="active"
                @dragstart="handleDragStart($event, comp, key)"
              >
                <a-form-model-item :label="comp.name">
                  <component :is="comp.name" v-bind="comp.props"></component>
                </a-form-model-item>
              </li>
            </a-form-model>
          </ol>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style lang="less">
.materials-container {
  position: relative;
  padding: 20px 0;
  height: 100%;
  .ant-tabs .ant-tabs-left-content {
    padding-left: 10px;
  }
  .tpl-box {
    list-style: none;
    overflow: auto;
    .tpl-item {
      width: fit-content;
      margin: 30px 0;
      padding: 20px;
      background: #f5f5f5;
    }
    .tpl-item-name {
      padding-bottom: 10px;
    }
  }
  .materials-comp {
    .ant-form-item {
      margin-bottom: 8px;
    }
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
<script>
export default {
  name: "MaterialsPanel",
  components: {},
  props: {
    active: {
      type: Boolean,
      default() {
        return true;
      }
    },
    materials: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 }
    };
  },
  computed: {
    libs() {
      const { libs = {} } = this.materials;
      return libs;
    },
    tpls() {
      const { tpls = {} } = this.materials;
      return tpls;
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    selectTpl(tplItem) {
      this.dispatch("EditPage", "select-tpl", tplItem);
    },
    handleDragStart(ev, comp, dep) {
      const {
        defineData: { dataTransferType }
      } = this;
      const dragData = {
        ...comp,
        dep
      };
      console.log("handleDragStart: ", dragData);
      ev.dataTransfer.setData(dataTransferType, JSON.stringify(dragData));
    }
  }
};
</script>
