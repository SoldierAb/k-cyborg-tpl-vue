import DragContainer from "./src/DragContainer";

DragContainer.install = Vue => {
  Vue.component(DragContainer.name, DragContainer);
};

export default DragContainer;
