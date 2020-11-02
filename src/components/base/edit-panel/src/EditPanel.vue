<template>
  <div class="edit-panel-container">
    <div class="properties-bar">
      <h2>全局属性</h2>
      <a-form-model :label-col="{ span: 5 }" :wrapper-col="wrapperCol">
        <a-form-model-item label="背景设置">
          <ImagePanel :app-config="AppConfig" v-model="bgImage" />
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="properties-bar" v-if="currentPanel">
      <h2>Panel - {{ currentPanel.panelIndex }} 面板属性</h2>
      <div>
        <a-form-model
          :model="currentPanel.instance"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item
            v-for="key in Object.keys(currentPanel.instance.style)"
            :key="key"
            :label="key"
          >
            <a-input v-model="currentPanel.instance.style[key]" />
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <div class="properties-bar" v-if="currentDragItem">
      <h2>DragItem - {{ currentDragItem.instance.id }} 属性</h2>
      <div class="property-box-item">
        <h3>位置设置</h3>
        <div class="position-box">
          <table class="position-table">
            <tr v-for="(item, index) in positionMap" :key="index">
              <td
                v-for="pos in item"
                @click="setPos(pos.value)"
                :key="pos.value"
              >
                <a-button>
                  {{ pos.label }}
                </a-button>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="property-box-item">
        <h3>物料属性：</h3>
        <a-form-model
          :model="currentDragItem.instance"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="注册物料：">
            <a-input v-model="currentDragItem.instance.name" allow-clear />
          </a-form-model-item>
          <a-form-model-item
            v-for="key in Object.keys(currentDragItem.instance.props)"
            :key="key"
            :label="key"
          >
            <a-input
              v-model="currentDragItem.instance.props[key]"
              allow-clear
            />
          </a-form-model-item>
        </a-form-model>
      </div>
      <div class="property-box-item">
        <h3>样式属性:</h3>
        <div>
          <a-form-model
            :model="currentDragItem.instance.style"
            :label-col="{ span: 5 }"
            :wrapper-col="wrapperCol"
          >
            <a-form-model-item label="背景图">
              <ImagePanel :app-config="AppConfig" v-model="bgInstanceImage" />
            </a-form-model-item>
            <a-form-model-item
              v-for="key in Object.keys(currentDragItem.instance.style).filter(
                key => !key.includes('background')
              )"
              :key="key"
              :label="key"
            >
              <a-input
                @input="onStyleChange($event, key)"
                :value="currentDragItem.instance.style[key]"
              />
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.edit-panel-container {
  position: relative;
  height: 100%;
  overflow: auto;
  .property-box-item {
    padding: 10px 0;
  }
  .position-box {
    border: 1px solid #dcdcdc;
    padding: 10px;
    width: fit-content;
  }
  .position-table {
    table-layout: fixed;
    text-align: center;
    td {
      padding: 4px 0;
    }
  }
  .properties-bar {
    border-bottom: 1px solid @secondary;
    padding: 20px;
    .ant-select {
      min-width: 100px;
    }
    .ant-select-selection--single {
      height: 70px;
    }
  }
}
</style>

<script>
import ImagePanel from "@/components/base/image-panel";
import { isNumberRic } from "@/utils";

export default {
  name: "EditPanel",
  components: {
    ImagePanel
  },
  props: {
    AppConfig: {
      type: Object,
      default() {
        return {};
      }
    },
    currentPanel: {
      type: Object
    },
    currentDragItem: {
      type: Object
    },
    unit: {
      type: String,
      default() {
        return "px";
      }
    }
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      positionMap: [
        [
          {
            label: "左上角",
            value: "top-left"
          },
          {
            label: "顶部居中",
            value: "top-center"
          },
          {
            label: "右上角",
            value: "top-right"
          }
        ],
        [
          {
            label: "靠左上下居中",
            value: "left-center"
          },
          {
            label: "居中",
            value: "center"
          },
          {
            label: "靠右上下居中",
            value: "right-center"
          }
        ],
        [
          {
            label: "左下角",
            value: "bottom-left"
          },
          {
            label: "底部居中",
            value: "bottom-center"
          },
          {
            label: "右下角",
            value: "bottom-right"
          }
        ],
        [
          {
            label: "左右居中",
            value: "left-right-center"
          },
          {
            label: "上下居中",
            value: "top-bottom-center"
          }
        ]
      ]
    };
  },
  computed: {
    bgInstanceImage: {
      get() {
        return this.currentDragItem.instance.style.backgroundImage.replace(
          /url\(|\)/g,
          ""
        );
      },
      set(val) {
        this.currentDragItem.instance.style.backgroundImage = `url(${val})`;
      }
    },
    bgImage: {
      get() {
        return this.AppConfig.style.backgroundImage.replace(/url\(|\)/g, "");
      },
      set(val) {
        this.AppConfig.style.backgroundImage = `url(${val})`;
      }
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    onStyleChange(ev, key) {
      const {
        target: { value }
      } = ev;
      const useVal = isNumberRic(value) ? parseFloat(value) : value || "";
      this.$set(this.currentDragItem.instance.style, key, useVal);
    },
    setPos(pos) {
      this.dispatch("EditPage", "set-current-node-pos", pos);
    }
  }
};
</script>
