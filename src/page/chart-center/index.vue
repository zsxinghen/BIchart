<template>
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
        <div class="content footer"></div>
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
        :chartArr="chartArr"
        :config="config"
        ref="config"
        v-show="config.type!='model'"
      ></configs>
    </div>
  </div>
</template>
<script>
import chart from "../../components/chart-center/charts/index.vue";
import configs from "../../components/chart-center/chartConfigs/index.vue";
import { types } from "../../../static/chartType.js";
import dataSource from "../../components/chart-center/dataConfigs/dialog.vue";
export default {
  name: "chartConfigPage",
  data() {
    return {
      chartTypes: [],
      chartArr: [],
      chartType: "table",
      config: {
        data: null,
        chart: "table",
        type: "table",
        settings: {
          chart: "table",
          type: "table",
          title: {}
        },
        dataConfig: {
          /* 弹窗数据部分 */
          sourceType: "local",
          tableName: "",
          content: null,
          /* 左边列表部分 */
          list: [
            {
              name: "1111111111111"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            },
            {
              name: "111112222222222"
            }
          ],
          /* 中间头部配置部分 */
          dimension: [{ name: "1111" }],
          numberValue: [{ name: "1111" }]
        }
      },
      node: null,
      type: ""
    };
  },
  components: {
    chart,
    configs,
    dataSource
  },
  created() {
    this.chartArr = types;
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
    setChartData() {
      this.$set(this.config, "data", null);
      setTimeout(() => {
        this.$set(this.config, "data", null);
      }, 100);
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
    }
  }
  /**
   *   监听并刷新图表
   */
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
</style>
