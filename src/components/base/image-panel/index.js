import ImagePanel from "./src/ImagePanel";

ImagePanel.install = Vue => {
  Vue.component(ImagePanel.name, ImagePanel);
};

export default ImagePanel;
