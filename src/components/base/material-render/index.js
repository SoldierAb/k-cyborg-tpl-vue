import MaterialRender from "./src/MaterialRender";

MaterialRender.install = Vue => {
  Vue.component(MaterialRender.name, MaterialRender);
};

export default MaterialRender;
