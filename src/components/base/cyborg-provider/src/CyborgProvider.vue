<script>
import Vue from "vue";
import { ConfigProvider } from "ant-design-vue";

export default {
  name: "CyborgProvider",
  mixins: [ConfigProvider],
  data() {
    return {};
  },
  provide() {
    const _self = this;
    this._reactiveConfig = new Vue({
      data() {
        return {
          ..._self.$props,
          originAppConfig: _self.baseAppConfig,
          reactiveData: _self.baseAppConfig.reactiveData,
          getPrefixCls: _self.getPrefixCls,
          renderEmpty: _self.renderEmptyComponent
          // add reactive data below
          // testObj:{
          //   name:'Kobe',
          // },
        };
      }
    });
    const {
      _data: { reactiveData, originAppConfig }
    } = this._reactiveConfig;
    return {
      reactiveData,
      originAppConfig
    };
  },
  created() {
    this.$on("set-property", this.setProperty);
  },
  methods: {
    recalc() {
      const docEl = document.documentElement;
      const clientWidth = docEl.clientWidth > 750 ? 750 : docEl.clientWidth;
      if (!clientWidth) return;
      this._reactiveConfig._data.baseFontSize = clientWidth / 10;
      docEl.style.fontSize = this._reactiveConfig._data.baseFontSize + "px";
      return this._reactiveConfig._data.baseFontSize;
    },
    initFontSize(doc, win) {
      if (!doc.addEventListener) return;
      const resizeEvt =
        "orientationchange" in window ? "orientationchange" : "resize";
      win.addEventListener(resizeEvt, this.recalc, false);
      doc.addEventListener("DOMContentLoaded", this.recalc, false);
    },
    setProperty({ key, value }) {
      const allKeys = key.split(".");
      const { length: allKeysLen } = allKeys;
      allKeys.reduce((prev, key, index) => {
        if (allKeysLen - 1 === index) prev[key] = value;
        return prev[key];
      }, this._reactiveConfig._data);
      // if (
      //   Object.prototype.hasOwnProperty.call(this._reactiveConfig._data, key)
      // ) {
      // }
    }
  }
};
</script>
