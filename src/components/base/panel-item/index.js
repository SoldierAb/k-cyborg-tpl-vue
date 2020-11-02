import PanelItem from "./src/PanelItem";

PanelItem.install = Vue => {
  Vue.component(PanelItem.name, PanelItem);
};

export default PanelItem;
