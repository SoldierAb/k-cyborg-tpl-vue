<template>
  <div class="app-container">
    <CyborgProvider>
      <router-view />
    </CyborgProvider>
  </div>
</template>

<style lang="less">
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
.app-container {
  position: relative;
  height: 100%;
}
</style>

<script>
export default {
  name: "app",
  components: {},
  data() {
    return {};
  },
  created() {},
  computed: {},
  mounted() {},
  beforeDestroy() {},
  methods: {}
};
</script>
