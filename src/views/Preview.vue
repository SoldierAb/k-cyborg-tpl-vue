<template>
  <div class="preview-container" :style="originAppConfig.style">
    <KPanelContainer :containers="originAppConfig.dataPanels" />
  </div>
</template>

<style lang="less">
.preview-container {
  position: relative;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  max-width: @max-width;
  margin: auto;
}
</style>

<script>
export default {
  name: "Preview",
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
