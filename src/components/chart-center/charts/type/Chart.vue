/* 
 *图表种类--Echart图表部分
 *联动在这里实现，通过eventHub.$on,.eventHub.$emit方式。
 */
<template>
  <div
    :id='id+"chart"'
    class="my-bi-chart"
  ></div>
</template>
<script>
// import echarts from "echarts";
import { default as $set } from "../../../../packages/index";
import { default as $linkSet } from "../../../../../static/link.js";
import { setTimeout } from "timers";
var echarts = require("echarts");
require("echarts-wordcloud");
require("echarts-liquidfill");
export default {
  data() {
    return {
      chart: null,
      key: null
    };
  },
  props: {
    id: {
      type: String,
      default() {
        return {};
      }
    },
    config: {
      required: true,
      type: Object,
      default: () => {
        return {};
      }
    },
    linkages: {
      required: true,
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  mounted() {
    this.init();
    if (this.linkages) {
      let arr = this.linkages.filter(v => v.toId == this.id); //筛选所有指向本图表的联动数据
      if (arr.length) {
        this.$root.eventHub.$on(this.id, param => {
          this.$parent.update(param);
        });
      }
    }
  },
  methods: {
    init() {
      this.chart = echarts.init(document.getElementById(this.id + "chart"));
      this.chart.off("click"); // 处理点击事件多次触发
      let option = $set[`${this.config.chart}`].setOption(
        this.config.settings,
        this.config.data
      );
      this.chart.clear(); //清空当前实例，会移除实例中所有的组件和图表
      this.chart.hideLoading(); //隐藏动画加载效果。
      this.chart.setOption(option);
      this.resize(this.chart);
      this.chart.on("click", param => {
        let obj = Object.create(null);
        if (this.linkages) {
          let arr = this.linkages.filter(v => v.fromId == this.id); //筛选从本图表出去的联动数据
          for (let i = 0; i < arr.length; i++) {
            // let obj = $linkSet.linkParam(arr[i].linkParam, this.config);//复杂版---从外部筛选参数，比较复杂，先不做
            console.log(param);
            if (
              this.config.chart == "line" ||
              this.config.chart == "bar" ||
              this.config.chart == "scatter"
            ) {
              obj[arr[i].linkParam] = param.data.x;
            } else {
              obj[arr[i].linkParam] = param.name;
            }
            //简化版---根据name来获取参数
            this.$root.eventHub.$emit(arr[i].toId, obj);
          }
        }
      });
    },
    //图表自适应容器宽高
    resize(chart) {
      let time = null;
      window.addEventListener("resize", () => {
        chart.resize();
      });

      $("#effect" + this.id + " > .vue-resizable-handle")
        .mousedown(function() {
          time = setInterval(function() {
            chart.resize();
          }, 100);
        })
        .mouseup(function() {
          clearInterval(time);
          chart.resize();
        });
    }
  },
  watch: {
    "config.settings": {
      //根据数据变动，重新渲染页面图表
      deep: true,
      handler() {
        if (this.id == "my") {
          //变更图表数据
          let option = $set[`${this.config.chart}`].setOption(
            this.config.settings,
            this.config.data
          );
          console.log(JSON.stringify(option));
          this.chart.clear(); //清空当前实例，会移除实例中所有的组件和图表
          this.chart.setOption(option);
        } else {
          if (this.config.settings.updateWay == "refresh") {
            //重新渲染图表
            this.init();
          } else {
            //变更图表数据
            let option = $set[`${this.config.chart}`].setOption(
              this.config.settings,
              this.config.data
            );
            this.chart.setOption(option);
          }
        }
      }
    }
  }
};
</script>
<style lang="less">
.my-bi-chart {
  position: absolute !important;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>

