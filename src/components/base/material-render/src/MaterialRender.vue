<template>
  <Component :is="item.name" v-bind="bindProperties">
    <template v-if="item.$slot">
      <template v-if="typeof item.$slot === 'object'">
        <component :is="item.$slot.name" v-bind="item.$slot.props">
          <template
            v-if="
              Array.isArray(item.$slot.children) && item.$slot.children.length
            "
          >
            <MaterialRender
              v-for="(child, index) in item.$slot.children"
              :item="child"
              :key="index"
            />
          </template>
        </component>
      </template>
      <template v-else>
        {{ item.$slot }}
        <!-- <a-button @click="clickTest">=== {{ reactiveCyborgData.name }}</a-button> -->
      </template>
    </template>
  </Component>
</template>

<style lang="less">
.material-render-container {
  position: relative;
  height: 100%;
}
</style>
<script>
import Inject from "@/mixins/inject";

export default {
  name: "MaterialRender",
  mixins: [Inject],
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  created() {},
  computed: {
    bindProperties() {
      // prop 绑定解析
      const { props } = this.item;
      const res = Object.keys(props).reduce((prev, key) => {
        let valItem = props[key];
        if (typeof valItem === "string" && valItem.startsWith("reactiveData")) {
          valItem = valItem
            .split(".")
            .slice(1)
            .reduce((obj, valKey) => {
              if (Object.prototype.hasOwnProperty.call(obj, valKey))
                return obj[valKey];
              return `'${valKey}'值获取失败，请检查'reactiveData'配置`;
            }, this.reactiveData);
        }
        prev[key] = valItem;
        return prev;
      }, {});
      return res;
    }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    clickTest() {
      this.dispatch("CyborgProvider", "set-property", {
        key: "type",
        value: "danger"
      });
      this.dispatch("CyborgProvider", "set-property", {
        key: "name",
        value: "modify name"
      });
    }
  }
};
</script>
