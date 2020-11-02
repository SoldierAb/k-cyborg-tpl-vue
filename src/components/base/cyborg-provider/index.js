import CyborgProvider from "./src/CyborgProvider";

CyborgProvider.install = Vue => {
  Vue.component(CyborgProvider.name, CyborgProvider);
};

export default CyborgProvider;
