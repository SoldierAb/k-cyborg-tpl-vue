<template>
  <div class="panel-item-container">
    <div :class="activePanelItemClass">
      <slot />
      <!-- 拖拽面板项操作按钮 -->
      <!-- <div class="drag-item-btns-box" v-if="active">
        <div
          class="drag-item-layout-btn drag-item-layout-btn-top"
          @click.stop="addLayout('top', panelIndex - 1)"
        >
          +
        </div>
        <div
          class="drag-item-layout-btn drag-item-layout-btn-bottom"
          @click.stop="addLayout('bottom', panelIndex + 1)"
        >
          +
        </div>
      </div> -->
      <div class="panel-item-setting-bar" v-show="active">
        <div
          class="panel-item-setting-bar-icon add-layout-icon"
          @click.stop="addLayout('top', panelIndex - 1)"
        ></div>
        <div
          class="panel-item-setting-bar-icon add-icon"
          @click.stop="addDragItem"
        ></div>
        <div
          class="panel-item-setting-bar-icon edit-icon"
          @click.stop="getCurrentPanel"
        ></div>
        <div
          class="panel-item-setting-bar-icon delete-icon"
          @click.stop="delLayout(panelIndex)"
        ></div>
        <div
          class="panel-item-setting-bar-icon add-layout-icon"
          @click.stop="addLayout('bottom', panelIndex + 1)"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.panel-item-box-active {
  &:hover {
    border: 1px solid @primary;
    z-index: 99999;
    .drag-item-layout-btn {
      display: flex;
    }
  }
}
.panel-item-box {
  position: relative;
  &:hover {
    .panel-item-setting-bar {
      display: flex;
    }
  }
  .panel-item-setting-bar {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    top: calc(~"50% - @{setting-bar-size}");
    right: 1 - @setting-bar-size;
    width: @setting-bar-size;
    // height: 3 * @icon-size + 8px;
    background: @primary;
    .panel-item-setting-bar-icon {
      height: @icon-size;
      width: @icon-size;
      margin: 4px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      &:hover {
        background-color: @success;
      }
    }
    .add-layout-icon {
      background-image: url(../../../../assets/add-layout.png);
    }
    .add-icon {
      background-image: url(../../../../assets/add.png);
    }
    .edit-icon {
      background-image: url(../../../../assets/edit.png);
    }
    .delete-icon {
      background-image: url(../../../../assets/delete.png);
    }
  }
  .drag-item-layout-btn {
    position: absolute;
    width: 40px;
    height: 40px;
    display: none;
    align-items: center;
    justify-content: center;
    background: @primary;
    color: @white;
    z-index: 9999;
    font-size: 24px;
    font-weight: 200;
    margin: auto;
    border-radius: 50%;
    box-shadow: 0 0 10px #ccc;
    &:hover {
      background: @success;
    }
  }
  .drag-item-layout-btn-top {
    left: 0;
    right: 0;
    top: -20px;
  }
  .drag-item-layout-btn-bottom {
    left: 0;
    right: 0;
    bottom: -20px;
  }
  .drag-item-layout-btn-right {
    top: 0;
    bottom: 0;
    right: -20px;
  }
}
</style>

<script>
export default {
  name: "KPanelItem",
  props: {
    panelIndex: {
      type: Number,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    activePanelItemClass() {
      return this.active
        ? "panel-item-box panel-item-box-active"
        : "panel-item-box";
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    addDragItem() {
      this.$emit("add-drag-item", this.panelIndex);
    },
    getCurrentPanel() {
      this.$emit("get-current-panel", this.panelIndex);
    },
    addLayout(pos, panelIndex) {
      this.$emit("add-layout", pos, panelIndex);
    },
    delLayout(panelIndex) {
      this.$emit("del-layout", panelIndex);
    }
  }
};
</script>
