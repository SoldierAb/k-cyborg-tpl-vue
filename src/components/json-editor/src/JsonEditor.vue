<template>
  <div
    class="json-editor-container"
    :style="`min-height:${height}px;height:${height}px;width:${width}px`"
  >
    <div class="jsoneditor-box" ref="jsoneditor"></div>
    <div class="btn-box" v-show="options.mode === 'code'" @click="saveConfig">
      <div class="btn-instance save-btn"></div>
    </div>
    <!-- <div class="btn-box" v-show="options.mode ==='tree'" @click="setMode('code')">
      <div class="btn-instance edit-btn"></div>
    </div> -->
  </div>
</template>

<style lang="less">
.json-editor-container {
  position: relative;
  .jsoneditor-box {
    height: 100%;
  }
  .save-btn {
    background-image: url(../../../assets/save.png);
  }
  .edit-btn {
    background-image: url(../../../assets/edit.png);
  }
  .btn-box {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 230px;
    top: 6px;
    height: 26px;
    width: 26px;
    .btn-instance {
      height: 22px;
      width: 22px;
      background-size: 100% 100%;
    }
    &:hover {
      cursor: pointer;
      background-color: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 2px;
    }
  }
}
</style>
<script>
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.min.css";

export default {
  name: "json-editor",
  model: {
    prop: "json",
    event: "change"
  },
  props: {
    options: {
      type: Object,
      default() {
        return {
          mode: "code"
        };
      }
    },
    json: {
      type: Object || Array || Number || String || Boolean,
      default() {
        return {};
      }
    },
    width: {
      type: Number,
      default() {
        return 600;
      }
    },
    height: {
      type: Number,
      default() {
        return 600;
      }
    }
  },
  data() {
    return {
      editorInstance: null,
      optOnChange: null
    };
  },
  watch: {
    json: {
      deep: true,
      handler() {}
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.destoryInstance();
  },
  methods: {
    init() {
      const container = this.$refs.jsoneditor;
      const { onLocalChange: onChange, options, json } = this;
      this.optOnChange = options.onChange;
      const optInstance = {
        ...options,
        onChange
      };
      this.editorInstance = new JSONEditor(container, optInstance, json);
    },
    onLocalChange(...args) {
      try {
        const jsonContent = this.editorInstance.get();
        this.$emit("change", jsonContent);
        this.optOnChange(...args);
      } catch (error) {
        this.$emit("error", error);
      }
    },
    saveConfig() {
      this.$emit("save", this.editorInstance.get());
    },
    destoryInstance() {
      if (this.editorInstance) {
        this.editorInstance.destroy();
        this.editorInstance = null;
      }
    }
  }
};
</script>
