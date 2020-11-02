import ImageUpload from "./src/ImageUpload";

ImageUpload.install = Vue => {
  Vue.component(ImageUpload.name, ImageUpload);
};

export default ImageUpload;
