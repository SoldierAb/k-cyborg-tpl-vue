<template>
  <div class="image-panel-container">
    <a-select v-model="modelValue" @change="handleBgChange">
      <a-select-option
        v-for="item in backgroundImages"
        :key="item"
        :value="item"
      >
        <div style="padding: 10px;">
          <img width="50" height="50" :src="item" />
        </div>
      </a-select-option>
      <a-select-option :value="``">
        <div style="padding: 10px;">
          <span>（空白）</span>
        </div>
      </a-select-option>
    </a-select>
  </div>
</template>

<style lang="less">
.image-panel-container {
  position: relative;
  display: inline-block;
}
</style>
<script>
export default {
  name: "image-panel",
  model: {
    prop: "defaultValue",
    event: "input"
  },
  props: {
    AppConfig: {},
    defaultValue: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    modelValue: {
      get() {
        return this.defaultValue;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    backgroundImages() {
      return this.AppConfig.static;
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    handleBgChange(val) {
      this.$emit("change", val);
    }
  }
};
</script>
