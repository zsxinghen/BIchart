<template>
  <div class="config-common">
    <div class="config box">
      <div class="config-title">图表标题</div>
      <el-input
        v-model="config.settings.title.text"
        :disabled="config.type=='card'"
        placeholder="未命名图表名称"
      ></el-input>
    </div>
    <div class="config box">
      <div class="config-title">图表备注</div>
      <el-input
        v-model="config.settings.remark"
        placeholder="请输入图表备注"
      ></el-input>
    </div>
    <div class="config chart">
      <div class="config-title">图表类型</div>
      <ul class="clearfix">
        <li
          v-for="item in imgType(config.dataConfig.dimension,config.dataConfig.numberValue)"
          :key="item.chart"
          :class="[
        {'active':chartType===item.chart},
        {'':chartType!==item.chart}]"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="item.name"
            placement="top-start"
          >
            <!-- <div>{{item.content1}}</div><div>{{item.content2}}</div> -->
            <i
              :class="'iconfont '+item.icon"
              v-if="item.isAble"
              @click.stop="setType(item,$event)"
            ></i>
            <i
              :class="'iconfont '+item.icon"
              v-if="!item.isAble"
              class="disabled"
            ></i>
          </el-tooltip>
        </li>
      </ul>
    </div>
    <div class="config collapse">
      <el-collapse
        v-model="activeName"
        accordion
      >
        <el-collapse-item
          title="基础样式"
          name="1"
        >
          <basic-config :config="config.settings"></basic-config>
        </el-collapse-item>
        <el-collapse-item
          title="样式配置"
          name="2"
        >
          <style-config :config="config.settings"></style-config>
        </el-collapse-item>
        <el-collapse-item
          title="组件配置"
          name="3"
        >
          <plugin-config :config="config"></plugin-config>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 图表配置内容 -->
    <!-- <div class="config bottom">
   
      </div> -->
  </div>

</template>
<script>
import BasicConfig from "./configs/BasicConfig.vue";
import StyleConfig from "./configs/StyleConfig.vue";
import PluginConfig from "./configs/PluginConfig.vue";
import { default as defaultConfig } from "../../../packages/indexConfig.js";
import { default as data } from "../../../packages/indexData.js";
import { types } from "../../../../static/chartType.js";
export default {
  name: "configCommon",
  data() {
    return {
      chartType: "table",
      activeName: "1",
      imgType: {}
    };
  },
  components: {
    BasicConfig,
    StyleConfig,
    PluginConfig
  },
  props: {
    config: {
      required: true,
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  beforeMount() {
    this.$set(
      this.config,
      "settings",
      Object.assign({}, defaultConfig[`config_${this.config.chart}`])
    );
  },
  created() {
    this.imgType = types;
  },
  mounted() {
    this.setCollapseHeight();
    window.onresize = () => {
      this.setCollapseHeight();
    };
  },
  updated() {},
  methods: {
    setCollapseHeight() {
      // let height = document.getElementsByClassName("el-collapse")[0]
      //   .clientHeight;
      // let arr = document.querySelectorAll(".el-collapse-item__content");
      // arr.forEach(element => {
      //   element.style.height = height - 154 + "px";
      // });
    },
    setType(item) {
      this.$set(this.config, "type", item.type);
      this.$set(this.config, "chart", item.chart);
      this.$set(this.config, "isAxis", item.isAxis);
      this.$set(this.config, "isVisualMap", item.isVisualMap);
      this.chartType = item.chart;
      this.$set(
        this.config,
        "settings",
        Object.assign({}, defaultConfig[`config_${this.config.chart}`])
      );
      this.setData();
      // this.$set(
      //   this.config,
      //   "data",
      //   data[`data_${this.config.settings.chart}`]
      // );
    },
    setData() {
      this.$set(this.config, "data", null);
      setTimeout(() => {
        // this.$store.dispatch("getList", this);
        let json = [
          {
            id: "12987122",
            name: "好滋好味鸡蛋仔",
            category: "江浙小吃、小吃零食",
            desc: "荷兰优质淡奶，奶香浓而不腻",
            address: "上海市普陀区真北路",
            shop: "王小虎夫妻店",
            shopId: "10333"
          },
          {
            id: "12987123",
            name: "好滋好味鸡蛋仔",
            category: "江浙小吃、小吃零食",
            desc: "荷兰优质淡奶，奶香浓而不腻",
            address: "上海市普陀区真北路",
            shop: "王小虎夫妻店",
            shopId: "10333"
          },
          {
            id: "12987125",
            name: "好滋好味鸡蛋仔2",
            category: "江浙小吃、小吃零食",
            desc: "荷兰优质淡奶，奶香浓而不腻",
            address: "上海市普陀区真北路",
            shop: "王小虎夫妻店",
            shopId: "10333"
          },
          {
            id: "12987126",
            name: "好滋好味鸡蛋仔3",
            category: "江浙小吃、小吃零食",
            desc: "荷兰优质淡奶，奶香浓而不腻",
            address: "上海市普陀区真北路",
            shop: "王小虎夫妻店",
            shopId: "10333"
          }
        ];
        let data = this.$setData.listData(
          this.config.chart,
          json,
          this.config.dataConfig.dimension,
          this.config.dataConfig.numberValue
        );
        this.$set(this.config, "data", data);
      }, 100);
    }
  }
};
</script>
