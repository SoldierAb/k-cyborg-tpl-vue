import Vue from "vue";
import Emitter from "@/mixins/emitter";
import $talkie from "@/utils/talkie";
import defineData from "@/define";
import "@/registerServiceWorker";
import Inject from "@/mixins/inject"
import "./core";
import store from "./store";
import router from "./router";
import App from "%entry%";

import CyborgProvider from "@/components/base/cyborg-provider";
import DragContainer from "@/components/base/drag-container";
import DragItem from "@/components/base/drag-item";
import PanelContainer from "@/components/base/panel-container";
import PanelItem from "@/components/base/panel-item";
import PanelLayout from "@/components/base/panel-layout";

const baseAppConfig = require("./config.json");

Vue.use(CyborgProvider);
Vue.use(DragContainer);
Vue.use(DragItem);
Vue.use(PanelContainer);
Vue.use(PanelItem);
Vue.use(PanelLayout);

Vue.config.productionTip = false;

Vue.mixin({
  mixins: [Emitter, Inject],
  data() {
    return {
      baseAppConfig,
      defineData,
      publicPath: process.env.BASE_URL
    };
  },
  methods: {
    $talkie,
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
