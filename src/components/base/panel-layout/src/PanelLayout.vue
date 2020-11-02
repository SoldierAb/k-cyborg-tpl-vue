<template>
  <div class="layout-container">
    <div class="layout-left">
      <div class="layout-header">
        <h1>物料选择</h1>
      </div>
      <div class="layout-content">
        <slot name="materials" />
      </div>
    </div>
    <div class="layout-panel">
      <div class="layout-header"></div>
      <div class="layout-instance-panel">
        <slot name="content" />
      </div>
      <div class="layout-footer">
        <slot />
      </div>
    </div>
    <div class="layout-right">
      <div class="layout-header">
        <h1>
          属性编辑
        </h1>
      </div>
      <div class="layout-content">
        <slot name="properties" />
      </div>
    </div>
  </div>
</template>

<style lang="less">
.layout-container {
  @left-width: 500px;
  @right-width: 600px;
  @header-height: 50px;
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 100%;
  .layout-header {
    height: @header-height;
  }
  .layout-content {
    height: calc(~"100% - @{header-height} - 40px");
    overflow: auto;
  }
  .layout-left {
    padding: 0 20px;
    height: 100%;
    width: @left-width;
    border-right: 1px dashed #ccc;
  }
  .layout-instance-panel {
    border: 1px dashed @secondary;
  }
  .layout-panel {
    width: @max-width;
    padding: 0 40px;
    background: #f3f4f5;
    height: 100%;
    overflow: auto;
  }
  .layout-right {
    height: 100%;
    padding: 0 20px;
    width: @right-width;
    border-left: 1px dashed #ccc;
  }
  .layout-footer {
    padding: 20px;
  }
}
</style>

<script>
export default {
  name: "KPanelLayout",
  props: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {}
};
</script>
