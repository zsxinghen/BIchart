<template>
  <div class="superLayout" >
    <grid-layout  v-if="config" 
      :layout="config.layout" 
      :col-num="100" 
      :row-height="config.rowHeight" 
      :is-draggable="isDraggable"
      :is-resizable="config.isResizable" 
      :vertical-compact="true" :margin="[10,10]" 
      :use-css-transforms="true">
      <grid-item class="effect" 
        :class="['effect'+item.i]" 
        :id="['effect'+item.i]" 
        :style="setBorderColor()"
        v-for="(item,index) in config.layout" 
        :x="item.x" 
        :y="item.y" 
        :w="item.w" 
        :h="item.h"
        :i="item.i" 
        :key="item.i"
        @resized ="resizedEvent"
        @moved = "movingEvent">
        <!-- 背景 -->
        <div class="bg" :style="`background:${setBackground(item)}`"  @mouseenter="setDraggable(true)"></div>
        <div class="grid-item-body" @mouseenter="setDraggable(false)">
          <slot :data="item"></slot>
        </div>
        <!--工具 -->

        <div class="toolbar" v-if="!isToolbar" @mousedown.stop @mousemove.stop @click.stop> 
          <el-popover
                placement="bottom-start"
                width="200"
                title="备注"
                trigger="click"
                v-model="item.boolen"
            >
          <div class="popover-word" style="word-wrap:break-word">{{item.config&&item.config.settings.remark||'无'}}</div>
          <svg class="icon" aria-hidden="true" slot="reference"   @click="handleClick(key,item,index,config)" v-for="key in tool" :key="key">
            <use :xlink:href="'#icon-'+key" ></use>
          </svg>
            </el-popover>
        </div>
      </grid-item>
    </grid-layout>
  </div>
</template>
<script>
import GridLayout from "./grid-layout/GridLayout";
import GridItem from "./grid-layout/GridItem";

export default {
  props: {
    config: {
      require: true
    },
    isToolbar: {
      default: false
    },
    tool: {
      default() {
        return [
          "111",
          "edit",
          "refresh",
          "details",
          "zoom",
          "liandong",
          "more"
        ];
      }
    }
  },
  data() {
    return {
      isDraggable: false
    };
  },
  mounted() {},
  methods: {
    setBackground(item) {
      // 判断是否设置背景颜色
      if (this.config.bgConfig && this.config.bgConfig.type == "bgColor") {
        if (
          item.config &&
          item.config.settings &&
          item.config.settings.backgroundColor
        ) {
          return item.config.settings.backgroundColor;
        } else {
          return this.config.bgConfig.color;
        }
      } else {
        if (
          item.config &&
          item.config.settings &&
          item.config.settings.backgroundColor
        ) {
          return item.config.settings.backgroundColor;
        } else {
          return "#ffffff";
        }
      }
    },
    // 图表边框色
    setBorderColor() {
      if (this.config.bgConfig&&this.config.bgConfig.borderColor) {
        return `box-shadow: 0px 1px 4px ${
          this.config.bgConfig.borderColor
        }, 0 0 40px rgba(0, 0, 0, 0.1) inset`;
      } else {
        return `box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset`;
      }
    },
    setDraggable(flag) {
      if (this.config.isDraggable) this.isDraggable = flag;
      else this.config.isDraggable = false;
    },
    resizedEvent(i, newH, newW, newHPx, newWPx) {
      this.$set(this.config, "flag", true);
      this.$emit("resized", i, newH, newW, newHPx, newWPx);
    },
    movingEvent(i, newX, newY) {
      this.$set(this.config, "flag", true);
      this.$emit("moved", i, newX, newY);
    },
    refreshLayoutItem() {
      //刷新
      this.$emit("refreshLayoutItem");
    },
    handleClick(method, data, index, config) {
      if (method) {
        this.$emit("handle" + method, data, index, config);
      }
    },
    addLine(data) {
      //添加行
      let line = this.config.line++;
      this.createdLine({ ...data, line });
    },
    createdLine(data) {
      let clearance = 0;
      let nextWidth = [];
      let remaCol = Math.floor((100 - data.all) / (data.span - data.ws.length));
      //创建行
      for (let i = 0; i < data.span; i++) {
        let width = data.ws[i] || remaCol;
        nextWidth.push(width);
        if (i > 0) {
          clearance += nextWidth[i - 1];
        }
        this.config.layout.push({
          x: clearance,
          y: data.line,
          w: width,
          h: 1,
          i: "_" + (new Date().getTime() + i) + "_",
          flag: true
        });
        console.log(this.config.layout);
      }
    },
    createdLayout(id) {
      //创建布局
      return {
        //布局位置
        layoutId: id,
        layout: [],
        line: 0, //行
        rowHeight: 200, //行高
        isDraggable: true, //是否支持推拽
        isResizable: true //是否支持改变大小
      };
    }
  },
  components: {
    GridLayout,
    GridItem
  }
};
</script>
<style lang="less">
.el-popper[x-placement^="bottom-start"] .popper__arrow {
  left: 56.5px !important;
}
.superLayout {
  width: 100%;

  .vue-grid-item.vue-grid-placeholder {
    background-color: #000;
  }
  .toolbar {
    cursor: auto;
    padding: 5px 5px;
    border-radius: 20px;
    line-height: 1;
    position: absolute;
    right: 0;
    top: 0;
    font-size: 12px;
    white-space: nowrap;
    svg {
      font-size: 14px;
      color: #b0b1c0;
      margin-left: 5px;
      cursor: pointer;
    }
    .icon-size {
      font-size: 16px;
    }
  }
}

.bg {
  background-color: rgb(255, 255, 255);
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: -1;
  left: 0;
}

// .myChart {
//   position: absolute;
//   top: 0;
//   bottom: 0;
//   width: 100%;
//   box-sizing: border-box;
// }
.effect {
  padding-top: 25px;
  box-sizing: border-box;
  background-color: white;
}
.grid-item-body {
  width: 100%;
  height: 100%;
  position: relative;
}

.effectActive {
  border: 3px solid #00c1ff;
}

.effect:after,
.effect:before {
  content: "";
  position: absolute;
  top: 50%;
  bottom: 0px;
  left: 20px;
  right: 20px;
  border-radius: 100px/10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  z-index: -2;
}
</style>
