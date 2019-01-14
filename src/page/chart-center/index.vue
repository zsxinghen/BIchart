<template>
 <div style="display:flex ; flex-direction: column;height: 100%;">
    <chart-hearder :config="config" ></chart-hearder>
  <div class="chart-center">
    <!-- 左边  数据部分 -->
    <div class="main left">
      <div class="left-header">
        <p>工作表</p>
        <div><span>{{config.dataConfig.tableName||'请配置数据源'}}</span> <i
            class="iconfont icon-peizhishujuyuan"
            @click="showDataSource"
          ></i></div>
      </div>
      <div class="left-content">
        <ul>
          <li
            v-for="(item,index) in this.config.dataConfig.list"
            :key="index"
          >
            <p
              @dragstart="dragstart($event,item)"
              draggable="true"
            >
              <i class="el-icon-tickets"></i>
              <span>{{item.name}}</span>
            </p>
          </li>
        </ul>
      </div>
      <data-source
        ref="dataSource"
        :dataConfig="config.dataConfig"
        :config="config"
      ></data-source>
    </div>
    <!-- 中间  图表部分 -->
    <div class="main center">
      <div class="content-center">
        <div class="content header">
          <div class="content-top">
            <div
              class="dimension clearfix"
              @dragenter.prevent
              @dragover.prevent
              @drop.prevent="dragend($event,'dimension')"
            >
              <span class="dn-title">维度</span>
              <span
                class="dn-title-edit iconfont icon-bianji1"
                style="font-size:14px"
              ></span>
              <div
                class="left dn-item-grou"
                style="mardin-left: 60px;"
              >
                <p
                  class="dn-item left"
                  v-for="(item,index) in config.dataConfig.dimension"
                  :key="index"
                  @dragstart="dragstart($event,item,'dimension')"
                  draggable="true"
                >
                  <span>{{item.name}}</span>
                  <span
                    class="dn-item-close el-icon-circle-close"
                    @click="dimensionItemClose(item)"
                  ></span>
                </p>
              </div>
            </div>
            <div
              class="numberValue clearfix"
              @dragenter.prevent
              @dragover.prevent
              @drop.prevent="dragend($event,'numberValue')"
            >
              <span class="dn-title">数值</span>
              <span
                class="dn-title-edit iconfont icon-bianji1"
                style="font-size:14px"
              ></span>
              <div
                class="left dn-item-grou"
                style="mardin-left: 60px;"
              >
                <p
                  class="dn-item left"
                  v-for="(item,index) in config.dataConfig.numberValue"
                  :key="index"
                  @dragstart="dragstart($event,item,'numberValue')"
                  draggable="true"
                >
                  <span>{{item.name}}</span>
                  <span
                    class="dn-item-close el-icon-circle-close"
                    @click="numberValueItemClose(item)"
                  ></span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="content chart">
          <chart
            id="my"
            :config="config"
          ></chart>
        </div>
        <div class="content footer">
          <!-- <el-button type="text">事件配置</el-button>
          <el-button type="text">监听参数</el-button> -->
          <el-button type="text" @click="updateSetting">更新配置</el-button>
        </div>
      </div>
      <!-- 图表侧边栏 -->
      <!-- <div class="main aside">
                <ul v-if="chartTypes">
                  <li v-for="item in chartTypes" :key="item.type" :class="[{'active':chartType===item.type},{'disabled':item.disabled}]"
                    @click="setChartType(item)">
                    <el-tooltip class="item" effect="dark" :content="item.name" placement="left-start">
                      <i :class="'iconfont '+item.icon"></i>
                    </el-tooltip>
                  </li>
                </ul>
              </div> -->
    </div>
    <!-- 右边  配置部分 -->
    <div class="main right">
      <!-- 标题与数据更新方式 -->
      <configs
        :config="config"
        ref="config"
        v-show="config.type!='model'"
      ></configs>
    </div>
  </div>
  <update-setting ref="updateSetting" :config="config"></update-setting>
  </div>
</template>
<script>
import chart from "../../components/chart-center/charts/index.vue";
import configs from "../../components/chart-center/chartConfigs/index.vue";
import dataSource from "../../components/chart-center/dataConfigs/dialog.vue";
import updateSetting from "../../components/chart-center/dataConfigs/updateSetting.vue";
import chartHearder from "../../common/chart-hearder.vue";
import { types } from "../../../static/chartType.js";
import { mapGetters } from "vuex";
export default {
  name: "chartConfigPage",
  data() {
    return {
      chartTypes: [],
      chartType: "table",
      config: {
        data: null,
        chart: "table",
        type: "table",
        settings: {
          chart: "table",
          type: "table",
          title: {},
          remark: "",
          backgroundColor: null
        },
        dataConfig: {
          /* 弹窗数据部分 */
          sourceType: "local",
          tableName: "",
          domain: null,
          findCondJson: [],
          /* 左边列表部分
          name--显示名称 ，porp字段名
          */
          id: "",
          list: [
            // {
            //   name: "id",
            //   prop: "id"
            // },
            // {
            //   name: "11",
            //   prop: "name"
            // },
            // {
            //   name: "category",
            //   prop: "category"
            // },
            // {
            //   name: "444",
            //   prop: "name"
            // },
            // {
            //   name: "555",
            //   prop: "555"
            // }
          ],
          /* 中间头部配置部分 */
          dimension: [],
          numberValue: []
        }
      },
      node: null,
      type: ""
    };
  },
  components: {
    chart,
    configs,
    dataSource,
    chartHearder,
    updateSetting
  },
  computed: {
    ...mapGetters([
      "getCurrConfigs",
      "getCurrNode",
      "getCurrchartId",
      "getCurrentBackground"
    ])
  },
  created() {
    if (this.getCurrConfigs.config) {
      //已配置则赋值
      this.config = { ...this.getCurrConfigs.config };

      // debugger;
    } else {
      //未配置则初始化
      //根据看板背景设置图表背景
      if (this.getCurrentBackground) {
        this.config.settings.backgroundColor = this.getCurrentBackground;
      } else {
        this.config.settings.backgroundColor = "#ffffff";
      }
      console.log(
        this.getCurrentBackground,
        this.config.settings.backgroundColor
      );
    }
  },
  mounted() {},
  methods: {
    /*
     *设置数据源
     */
    showDataSource() {
      this.$refs.dataSource.show();
    },
    /*
     *设置数据并刷新图表
     */
    setChartData(boolen) {
      this.$set(this.config, "data", null);
      setTimeout(() => {
        this.$store.dispatch("getList", this);
        //   let json = [
        //     {
        //       id: "122",
        //       name: "113",
        //       category: "22",
        //       desc: "荷兰优质淡奶，奶香浓而不腻",
        //       address: "上海市普陀区真北路",
        //       shop: "王小虎夫妻店",
        //       shopId: "10333"
        //     },
        //     {
        //       id: "12987123",
        //       name: "好滋好味鸡蛋仔",
        //       category: "江浙小吃、小吃零食",
        //       desc: "荷兰优质淡奶，奶香浓而不腻",
        //       address: "上海市普陀区真北路",
        //       shop: "王小虎夫妻店",
        //       shopId: "10333"
        //     },
        //     {
        //       id: "12987125",
        //       name: "好滋好味鸡蛋仔",
        //       category: "江浙小吃、小吃零食",
        //       desc: "荷兰优质淡奶，奶香浓而不腻",
        //       address: "上海市普陀区真北路",
        //       shop: "王小虎夫妻店",
        //       shopId: "10333"
        //     },
        //     {
        //       id: "12987126",
        //       name: "好滋好味鸡蛋仔",
        //       category: "江浙小吃、小吃零食",
        //       desc: "荷兰优质淡奶，奶香浓而不腻",
        //       address: "上海市普陀区真北路",
        //       shop: "王小虎夫妻店",
        //       shopId: "10333"
        //     }
        //   ];
        //   let data = this.$setData.listData(
        //     this.config.chart,
        //     json,
        //     this.config.dataConfig.dimension,
        //     this.config.dataConfig.numberValue
        //   );
        //   this.$set(this.config, "data", data);
      }, 100);
      this.resetChartType();
    },
    resetChartType() {
      // 当数据不符合条件，图表重新选择为表格
      let arr = types(
        this.config.dataConfig.dimension,
        this.config.dataConfig.numberValue
      );
      let flag = arr.findIndex(val => this.config.chart == val.chart);
      if (flag != -1) {
        if (!arr[flag].isAble) {
          this.$refs.config.setType(arr[0]);
          this.$refs.config.chartType = "table";
        }
      }
    },
    /*
     *开始拖拽
     */
    dragstart(e, item, type = "") {
      this.node = JSON.parse(JSON.stringify(item));
      this.type = type;
    },
    /*
     *结束拖拽
     */
    dragend(e, type) {
      let flag = this.config.dataConfig[type].findIndex(
        v => v.name == this.node.name
      );
      if (flag == -1) {
        this.config.dataConfig[type].push(this.node);
        if (this.type) {
          let i = this.config.dataConfig[this.type].findIndex(
            v => v.name == this.node.name
          );
          this.config.dataConfig[this.type].splice(i, 1);
        }
        this.setChartData();
      }
    },
    /*
     *删除操作
     */
    dimensionItemClose(item) {
      let flag = this.config.dataConfig.dimension.findIndex(
        v => v.name == item.name
      );
      if (flag != -1) {
        this.config.dataConfig.dimension.splice(flag, 1);
        this.setChartData();
      }
    },
    numberValueItemClose(item) {
      let flag = this.config.dataConfig.numberValue.findIndex(
        v => v.name == item.name
      );
      if (flag != -1) {
        this.config.dataConfig.numberValue.splice(flag, 1);
        this.setChartData();
      }
    },
    updateSetting() {
      this.$refs.updateSetting.show();
    }
  }
};
</script>
<style lang="less">
@import url("../../assets/less/chartCenter.less");
@import url("../../assets/icon/iconfont/iconfont.css");
@import url("../../assets/icon/icon1/iconfont.css");
#div2,
.div1 ui li {
  width: 198px;
  height: 66px;
  padding: 10px;
  border: 1px solid #aaaaaa;
  user-select: none;
}
.chart-hearder {
  flex: 0 0 80px !important;
  background-color: #f0f2f3;
  margin-bottom: 10px;
  box-shadow: 0px 3px 5px rgba(24, 27, 45, 0.2);
}
</style>
