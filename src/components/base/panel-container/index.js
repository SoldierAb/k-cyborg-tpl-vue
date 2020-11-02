import PanelContainer from "./src/PanelContainer";

PanelContainer.install = Vue => {
  Vue.component(PanelContainer.name, PanelContainer);
};

export default PanelContainer;
