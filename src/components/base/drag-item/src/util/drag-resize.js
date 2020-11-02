import { Event, throttle } from "./index";

export default class DragResize {
  constructor({
    el,
    limitBox,
    dragEl,
    resizeEl,
    minWidth = 0,
    minHeight = 0,
    setStyleDirectly = true,
    unit = "px" // 预留参数--待完善
  }) {
    this.el = el;
    this.limitBox = limitBox;
    this.dragEl = dragEl;
    this.resizeEl = resizeEl;
    this.minWidth = minWidth;
    this.minHeight = minHeight;
    this.setStyleDirectly = setStyleDirectly;
    this.unit = unit;
    this.init();
  }

  /**
   *
   * @description 初始化
   * @memberof DragResize
   */
  init() {
    const {
      offsetLeft: left,
      offsetTop: top,
      right,
      bottom,
      margin,
      zIndex
    } = this.el.style;

    const { clientWidth: width, clientHeight: height } = this.el;

    this.style = {
      // 设置初始位置
      left,
      top,
      right,
      bottom,
      margin,
      zIndex,
      // 初始化获取宽高
      width,
      height
    };

    this.draggable = false;
    this.resizable = false;

    this.currentPosition = "auto";

    this.drag();
    this.resize();
  }

  /**
   * @description 激活
   *
   * @memberof DragResize
   */
  activate() {
    this.draggable = true;
    this.resizable = true;
    this.dragEl.style.cursor = "move";
    this.resizeEl.style.cursor = "nwse-resize";
  }

  /**
   * @description 禁用
   *
   * @memberof DragResize
   */
  unActivate() {
    this.draggable = false;
    this.resizable = false;
    this.dragEl.style.cursor = "";
    this.resizeEl.style.cursor = "";
  }

  /**
   * @description 监听回调
   *
   * @param {*} fn
   * @returns
   * @memberof DragResize
   */
  _on(fn) {
    return (...args) => {
      fn && fn.apply(this, args);
    };
  }

  /**
   * @description 直接设置节点样式
   *
   * @param {*} key
   * @memberof DragResize
   */
  setElProperties() {
    const { style } = this;
    Object.keys(style).forEach(key => {
      let value = style[key];
      if (typeof value !== "undefined") {
        if (this.setStyleDirectly) {
          value = typeof value === "number" ? value + this.unit : value;
          this.el.style[key] = value;
        }
      }
    });
  }

  setStyleProperty(key, value) {
    if (this.setStyleDirectly) {
      value = typeof value === "number" ? value + this.unit : value;
      this.style[key] = this.el.style[key] = value;
    }
    return this.style;
  }

  /**
   * @description 基础布局方位提供
   *
   * @param {*} position
   * @memberof DragResize
   */
  setPosition(position) {
    const positionMap = new Map()
      .set("top-left", () => {
        this.style.left = this.style.top = 0;
        this.style.right = this.style.bottom = this.style.margin = "";
      })
      .set("top-center", () => {
        this.style.right = this.style.left = this.style.top = 0;
        this.style.bottom = "";
        this.style.margin = "auto";
      })
      .set("top-right", () => {
        this.style.right = this.style.top = 0;
        this.style.left = this.style.bottom = this.style.margin = "";
      })
      .set("left-center", () => {
        this.style.left = this.style.bottom = this.style.top = 0;
        this.style.right = "";
        this.style.margin = "auto";
      })
      .set("left-right-center", () => {
        const { offsetTop } = this.el;
        this.style.top = offsetTop;
        this.style.right = this.style.left = 0;
        this.style.bottom = "";
        this.style.margin = "auto";
      })
      .set("top-bottom-center", () => {
        const { offsetLeft } = this.el;
        this.style.left = offsetLeft;
        this.style.right = "";
        this.style.top = this.style.bottom = 0;
        this.style.margin = "auto";
      })
      .set("center", () => {
        this.style.right = this.style.left = this.style.bottom = this.style.top = 0;
        this.style.margin = "auto";
      })
      .set("right-center", () => {
        this.style.right = this.style.bottom = this.style.top = 0;
        this.style.left = "";
        this.style.margin = "auto";
      })
      .set("bottom-left", () => {
        this.style.left = this.style.bottom = 0;
        this.style.right = this.style.top = this.style.margin = "";
      })
      .set("bottom-center", () => {
        this.style.right = this.style.left = this.style.bottom = 0;
        this.style.top = "";
        this.style.margin = "auto";
      })
      .set("bottom-right", () => {
        this.style.right = this.style.bottom = 0;
        this.style.left = this.style.top = this.style.margin = "";
      })
      .set("auto", () => {
        const { offsetLeft, offsetTop } = this.el;
        this.style.left = offsetLeft;
        this.style.top = offsetTop;
        this.style.margin = this.style.right = this.style.bottom = "";
      });
    // 禁用布局拖拽
    // this.draggable = position === "auto";
    this.currentPosition = position;
    // 设置当前布局方案
    positionMap.get(position)();
    this._on(this.onSetPosition)(this.style);
    this.setElProperties();
  }

  /**
   * @description 拖拽
   *
   * @memberof DragResize
   */
  drag() {
    const { el, dragEl, limitBox } = this;
    el.style.position = "absolute";
    // dragEl.style.cursor = "move";

    const _drag_bind = ev => {
      if (!this.draggable) return;

      this.setPosition((this.currentPosition = "auto"));

      this._on(this.onDragStart)();

      const { offsetLeft, offsetTop, clientHeight, clientWidth } = el;

      // 初始化方位
      this.style.left = offsetLeft;
      this.style.top = offsetTop;

      const {
        clientWidth: boxWidth,
        clientHeight: boxHeight
        // scrollHeight,
        // scrollWidth
      } = limitBox;

      const minLeft = 0;
      const minTop = 0;
      // const maxLeft = (scrollWidth || boxWidth) - clientWidth;
      // const maxTop = (scrollHeight || boxHeight) - clientHeight;
      const maxLeft = boxWidth - clientWidth;
      const maxTop = boxHeight - clientHeight;

      const e = ev || window.event;
      const posLeft = e.clientX - offsetLeft;
      const posTop = e.clientY - offsetTop;

      const _drag_cb = event => {
        const _e = event || window.event;
        let _left = _e.clientX - posLeft;
        let _top = _e.clientY - posTop;
        this.style.left =
          _left <= minLeft ? minLeft : _left >= maxLeft ? maxLeft : _left;
        this.style.top =
          _top <= minTop ? minTop : _top >= maxTop ? maxTop : _top;
        // 设置坐标
        this.setElProperties();
        // 回调
        this._on(this.onDrag)(this.style);
      };

      const _del_move = () => {
        Event.del(document, "mousemove", _drag_cb);
        Event.del(document, "mouseup", _del_move);
        dragEl.style.cursor = "";
        this._on(this.onDragEnd)(this.style);
      };

      Event.add(document, "mousemove", _drag_cb);

      Event.add(document, "mouseup", _del_move);

      return false;
    };

    Event.add(dragEl, "mousedown", _drag_bind);
  }

  /**
   * @description 尺寸设置
   *
   * @memberof DragResize
   */
  resize() {
    const { el, resizeEl, minWidth, minHeight, limitBox } = this;
    // resizeEl.style.cursor = "nwse-resize";

    const _resize_bind = ev => {
      if (!this.resizable) return;

      this._on(this.onResizeStart)();

      const { offsetLeft, offsetTop, clientHeight, clientWidth } = el;

      const {
        clientWidth: boxWidth,
        clientHeight: boxHeight
        // scrollHeight,
        // scrollWidth
      } = limitBox;

      // const parentHeight = scrollHeight || boxHeight;
      // const parentWidth = scrollWidth || boxWidth;
      const parentHeight = boxHeight;
      const parentWidth = boxWidth;

      const isLeftOrRightCenter =
        this.currentPosition === "right-center" ||
        this.currentPosition === "left-center" ||
        this.currentPosition === "center";
      const isTopOrBottomCenter =
        this.currentPosition === "top-center" ||
        this.currentPosition === "bottom-center" ||
        this.currentPosition === "center";

      const maxWidth = isTopOrBottomCenter
        ? parentWidth
        : parentWidth - offsetLeft;
      const maxHeight = isLeftOrRightCenter
        ? parentHeight
        : parentHeight - offsetTop;

      const e = ev || window.event;
      const posLeft = e.clientX;
      const posTop = e.clientY;

      const _resize_cb = throttle(event => {
        const _e = event || window.event;
        const disX = _e.clientX - posLeft;
        const disY = _e.clientY - posTop;
        let _width = clientWidth + disX;
        let _height = clientHeight + disY;
        // 设置尺寸
        this.style.width =
          _width <= minWidth
            ? minWidth
            : _width <= maxWidth
            ? _width
            : maxWidth;
        this.style.height =
          _height <= minHeight
            ? minHeight
            : _height <= maxHeight
            ? _height
            : maxHeight;
        this.setElProperties();
        // 回调
        this._on(this.onResize)(this.style);
      }, 80);

      const _del_move = () => {
        Event.del(document, "mousemove", _resize_cb);
        Event.del(document, "mouseup", _del_move);
        resizeEl.style.cursor = "";
        this._on(this.onResizeEnd)(this.style);
      };

      Event.add(document, "mousemove", _resize_cb);

      Event.add(document, "mouseup", _del_move);

      ev.preventDefault();
      ev.stopPropagation();

      return false;
    };

    Event.add(resizeEl, "mousedown", _resize_bind);
  }
}
