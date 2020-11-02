export const randomHash = () => {
  return "xxyxyxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const isNumberRic = value => {
  return value && typeof parseFloat(value) === "number" && !isNaN(value);
};

export const Download = (url, name) => {
  const target = document.createElement("a");
  target.href = url;
  target.download = name;
  const event = document.createEvent("MouseEvents");
  event.initEvent("click", true, true);
  target.dispatchEvent(event);
};
