import MaterialsPanel from "./src/MaterialsPanel";

MaterialsPanel.install = Vue => {
  Vue.component(MaterialsPanel.name, MaterialsPanel);
};

export default MaterialsPanel;
