<template>
  <div class="panel-container">
    <KPanelItem
      v-for="(con, index) in containers"
      :key="con.panel"
      :panel="con"
      :panel-index="index"
      :active="active"
    >
      <KDragContainer
        :active="active"
        :panel-index="index"
        :comps="con.comps"
        :style="con.style"
      />
    </KPanelItem>
  </div>
</template>

<style lang="less">
.panel-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>

<script>
export default {
  name: "KPanelContainer",
  props: {
    containers: {
      type: Array,
      required: true
    },
    active: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
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
