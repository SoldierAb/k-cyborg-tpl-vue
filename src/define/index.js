const autoFitBoxStyle = {
  width: "fit-content",
  height: "fit-content"
};

const defaultZIndex = 999;

const defaultBackground = {
  backgroundImage: "",
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 100%"
};

export default {
  dataTransferType: "text/plain",
  EMIT_DATA_KEY: "EMIT_DATA_KEY:",
  autoFitBoxStyle,
  defaultZIndex,
  defaultBackground,
  defaultDragItem: {
    name: "",
    props: {},
    style: {
      width: 100,
      height: 100,
      zIndex: defaultZIndex,
      ...defaultBackground
    }
  },
  defaultLayoutItem: {
    comps: [],
    style: {
      height: "300px",
      ...defaultBackground
    }
  }
};
