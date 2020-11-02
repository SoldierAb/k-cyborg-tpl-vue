import JsonEditor from "./src/JsonEditor";

JsonEditor.install = Vue => {
  Vue.component(JsonEditor.name, JsonEditor);
};

export default JsonEditor;
