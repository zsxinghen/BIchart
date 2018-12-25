/*
*看板中心右边看板部分
*/
<template>
  <div class="board-center">
    <!-- 侧边栏 -->
    <sider-bar title="看板库" :urls="url" :prop="defaultProp" :currentNode="currentNode" :configData="configData" keyCode="layoutConfig"
      @currentChange="currentChange" ref="sidebar" @boardHandler="boardHandler">
          <i class="iconfont icon-gengduo" :index='3'></i>
    </sider-bar>
    <!-- 布局展示 -->
    <div class="board-display">
      <div class="board-display-body">
        <div v-if="currentFile.reportType=='自定义'" style="height:100%;position:relative;">
          <div class="main-body" :style="{'background':setBg(),'height':'100%','background-size': 'cover','opacity':configData.bgConfig.opacticy?configData.bgConfig.opacticy:1}">
            <el-dropdown @command="handleCommand" placement="bottom-end">
              <span class="el-dropdown-link">
                <i class="iconfont icon-shezhi"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="标题设置">标题设置</el-dropdown-item>
                <el-dropdown-item command="布局设置">布局设置</el-dropdown-item>
                <el-dropdown-item command="背景设置">背景设置</el-dropdown-item>
                <!-- <el-dropdown-item command="图表联动">图表联动</el-dropdown-item> -->
                <el-dropdown-item command="看板授权">看板授权</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div class="mai-header clearfix" style="padding-top:10px;">
              <div class="main-title" :style="setStyle('title')">{{configData.titleConfig.title.text?configData.titleConfig.title.text:''}}</div>
              <div class="sub-title" :style="setStyle('subTitle')">{{configData.titleConfig.subTitle.text?configData.titleConfig.subTitle.text:''}}</div>
            </div>
            <super-layout :config="configData" ref="superLayout" :isToolbar="false" @handleedit="handleEdit"
              @handlerefresh="handleRefresh" @handlezoom="handleZoom" @handledetails="handleDetails" @handleliandong="handleLiandong" >
              <template slot-scope="{data}">
                <charts-view :id="data.i" :linkages="linkages"  :config="data.config" v-if="data.config" :ref="'myChart'+data.i"></charts-view>
              </template>
            </super-layout>
          </div>
        </div>
        <div v-if="currentFile.reportType=='专业模板'" style="height:100%">
          <iframe :src="currentFile.unzipPath" frameborder="0" style="width:100%;height:100%"></iframe>
        </div>
      </div>
    </div>
    <!-- 背景设置 -->
    <board-config-background ref="bgSet" :currentFile="currentFile" :bgconfig="bgconfig" @saveSuccess="saveSuccess"></board-config-background>
    <!-- 标题设置 -->
    <board-config-title ref="titleSet" :titleConfig="titleConfig" :currentFile="currentFile" @titleSuccess="titleSuccess"></board-config-title>
    <!-- 图表联动 -->
    <board-config-param ref="linkChart" :currentNode="currentNode"></board-config-param>
    <!-- 布局设置 -->
    <board-config-layout ref="layoutSet" :currentFile="currentFile" @layoutSuccess="layoutSuccess"></board-config-layout>
    <!-- 放大 -->
    <board-zoom-chart :zoomObj="zoomObj" v-if="zoomObj.isShow"></board-zoom-chart>
    <board-config-authorization ref="authorization"></board-config-authorization>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import siderBar from "../../common/sider-bar";
import superLayout from "../../common/superLayout";
import boardConfigTitle from "../../components/board-center/board-config-title";
import boardConfigBackground from "../../components/board-center/board-config-background";
import boardConfigLayout from "../../components/board-center/board-config-layout";
import boardConfigParam from "../../components/board-center/board-config-param";
import chartsView from "../../components/chart-center/charts/index.vue";
import boardZoomChart from "../../components/board-center/board-zoom-chart.vue";
import boardConfigAuthorization from "../../components/board-center/board-config-authorization.vue";
import { default as urls } from "../../api/urls/board-center.js";
import { default as layoutUrls } from "../../api/urls/layout-center.js";

export default {
  data() {
    return {
      currentFile: {
        id: -1
      },
      defaultProp: {
        children: "reports"
      },
      configData: {
        // flag: false,
        layout: [],
        rowHeight: 200,
        isDraggable: true,
        isResizable: true,
        line: 1,
        bgConfig: {
          type: "null",
          imageUrl: "",
          opacticy: 1
        },
        titleConfig: {
          title: {},
          subTitle: {}
        }
      },
      bgconfig: {},
      titleConfig: {
        title: {},
        subTitle: {}
      },
      currentNode: {
        config: [],
        id: undefined,
        folderId: undefined,
        alias: undefined
      },
      url: null,
      zoomObj: {
        config: null,
        id: "",
        isShow: false
      },
      linkages: null
    };
  },
  created() {
    this.url = urls;
  },
  computed: {
    ...mapGetters(["getCurrConfigs", "getCurrNode", "getCurrchartId"])
  },
  mounted() {
    this.$refs.sidebar.filterData(this.getCurrNode);
    // if (this.getCurrNode) {
    //   this.$nextTick(() => {
    //     this.currentNode = this.getCurrNode;
    //   });
    // }
  },
  methods: {
    ...mapMutations(["setCurrConfigs", "setCurrNode", "setCurrchartId"]),
    // 重新获取当前看板信息
    reGetBoard(data,id) {
       this.$refs.sidebar.getDesign({...data,reportType:"自定义"},id)
    },
    setBg() {
      if (this.configData.bgConfig.type == "null") {
        return "#fff";
      } else if (this.configData.bgConfig.type == "bgColor") {
        return this.configData.bgConfig.color;
      } else {
        return "url(" + this.configData.bgConfig.imageUrl + ") no-repeat";
      }
    },
    setStyle(type) {
      var str = "";
      if (this.configData.titleConfig[type].fontsize) {
        str =
          str +
          "font-size:" +
          this.configData.titleConfig[type].fontsize +
          "px;";
      } else {
        str = str + "font-size:12px";
      }
      if (this.configData.titleConfig[type].fontFamily) {
        str =
          str +
          "font-family:" +
          this.configData.titleConfig[type].fontFamily +
          ";";
      } else {
        str = str + "fontFamily:SimHei;";
      }
      if (this.configData.titleConfig[type].color) {
        str = str + "color:" + this.configData.titleConfig[type].color + ";";
      } else {
        str = str + "color:#000;";
      }
      if (
        this.configData.titleConfig[type].position == "left" ||
        this.configData.titleConfig[type].position == "right"
      ) {
        if (
          this.configData.titleConfig.title.position ===
          this.configData.titleConfig.subTitle.position
        ) {
          str =
            str +
            "text-align:" +
            this.configData.titleConfig.subTitle.position +
            ";";
        } else {
          str =
            str + "float:" + this.configData.titleConfig[type].position + ";";
        }
      } else {
        str = str + "text-align:center;";
      }
      if (this.configData.titleConfig[type].isShow) {
        str = str + "display:block;";
      } else {
        str = str + "display:none;";
      }
      return str;
    },
    handleCommand(command) {
      switch (command) {
        case "背景设置":
          this.bgconfig = { ...this.configData.bgConfig };
          this.$refs.bgSet.show();
          break;
        case "布局设置":
          this.$apis
            .fetchPost(layoutUrls.sideBar.search, {
              params: {},
              Vue: this
            })
            .then(res => {
              if (res.result) {
                this.$refs.layoutSet.show(res.model);
              }
            });
          break;
        case "标题设置":
          this.titleConfig = JSON.parse(
            JSON.stringify(this.configData.titleConfig)
          );
          this.$refs.titleSet.show();
          break;
        case "看板授权":
          this.handleAuthorization();
          break;
        default:
          break;
      }
    },
    currentChange(data) {
      this.currentFile = data;
    },
    saveSuccess(data) {
      this.currentFile.config = data.config;
      this.configData.bgConfig = JSON.parse(data.config).bgConfig;
    },
    layoutSuccess(data) {
      this.currentFile.layoutConfig = data;
      this.configData.layout = JSON.parse(data).layout;
    },
    titleSuccess(data) {
      console.log(JSON.parse(data.config).titleConfig);
      this.currentFile.config = data.config;
      this.configData.titleConfig = JSON.parse(data.config).titleConfig;
    },
    /*
     *编辑 -- 把当前图表信息存入vuex
     */
    handleEdit(data, index) {
      this.setCurrConfigs(data);
      this.setCurrNode(JSON.parse(JSON.stringify(this.currentNode)));
      this.setCurrchartId(data.i);
      this.$router.push("/chartCenter");
    },
    // 更新
    handleRefresh(data, index) {
      data.config.data = null;
      this.$refs["myChart" + data.i].getData(true);
    },
    handleDetails(data, index) {
      data.boolen = true;
    },
    // 放大
    handleZoom(data, index) {
      this.zoomObj.config = data.config;
      this.zoomObj.i = data.i;
      this.zoomObj.isShow = true;
    },
    // 联动数据筛选
    handleLiandong(data, index, config) {
      if (data.config.type != "chart") {
        this.$message({
          type: "info",
          message: "当前图表不支持联动"
        });
      } else {
        let arr = config.layout
          .map((val, idx) => {
            if (val.config) {
              return {
                id: val.i,
                toName: idx + 1 + "号图表--" + this.ChartName(val.config.chart),
                type: val.config.type,
                chart: val.config.chart,
                props: [
                  ...val.config.dataConfig.numberValue,
                  ...val.config.dataConfig.dimension
                ]
              };
            }
          })
          .filter(val => {
            if (val) {
              return val.type == "chart" && val.id !== data.i;
            }
          }); //初步获取被联动目标下拉列表
        let obj = {
          from: {
            id: data.i,
            type: data.config.chart,
            props: [
              ...data.config.dataConfig.numberValue,
              ...data.config.dataConfig.dimension
            ],
            index: index,
            name: index + 1 + "号图表--" + this.ChartName(data.config.chart)
          },
          toOption: arr
        };
        this.$refs.linkChart.show(obj, this.linkages);
      }
    },
    handleAuthorization(comman) {
      this.$refs.authorization.show();
    },
    boardHandler(res, data, id) {
      this.$set(data, "layoutConfig", res.model.layoutConfig);
      this.$set(data, "layoutId", res.model.layoutId);
      this.linkages = res.model.linkages;
      console.log(this.linkages)
      this.$set(
        data,
        "datasourceLocationValueDtos",
        res.model.datasourceLocationValueDtos
      );
      if (this.configData.flag) {
        //当布局变动时需要保存判断
        this.saveLayout(id, JSON.parse(JSON.stringify(this.configData)));
      }
      this.configData.layout = JSON.parse(res.model.layoutConfig).layout;
      this.configData.flag = false;
      res.model.datasourceLocationValueDtos.forEach(v => {
        let flag = this.configData.layout.findIndex(k => k.i === v.reportId);
        if (flag != -1) {
          this.configData.layout[flag].config = JSON.parse(
            v.picConfig.replace(/\$/g, "%")
          );
        }
      });
      this.configData.layout.forEach(v => {});
      if (res.model.config) {
        // 数据部分
        // this.configData.layout

        // 背景、标题部分
        this.$set(data, "config", res.model.config);
        if (JSON.parse(res.model.config).bgConfig) {
          this.configData.bgConfig = JSON.parse(res.model.config).bgConfig;
        } else {
          this.configData.bgConfig = {
            type: "null",
            opacticy: 1
          };
        }
        if (JSON.parse(res.model.config).titleConfig) {
          this.configData.titleConfig = JSON.parse(
            res.model.config
          ).titleConfig;
        } else {
          this.configData.titleConfig = {
            title: {},
            subTitle: {}
          };
        }
      } else {
        this.$set(
          data,
          "config",
          JSON.stringify({
            bgConfig: {
              type: "null",
              opacticy: 1
            },
            titleConfig: {
              title: {},
              subTitle: {}
            }
          })
        );
        this.configData.bgConfig = {
          type: "null",
          opacticy: 1
        };
        this.configData.titleConfig = {
          title: {},
          subTitle: {}
        };
      }
      // console.log(this.configData);
    },
    saveLayout(id, configData) {
      // console.log(this.currentNode.id,this.configData)
      this.$confirm("您看板布局进行了修改,需要保存吗?")
        .then(_ => {
          let arr = configData;
          arr.layout.forEach(v => {
            if (v.config) {
              delete v.config;
            }
          });
          delete arr.titleConfig;
          delete arr.subTitleConfig;
          let param = {
            reportId: id,
            layoutConfig: JSON.stringify(arr)
          };
          this.$apis
            .fetchPost(urls.sideBar.upd_layout, {
              params: param,
              Vue: this
            })
            .then(res => {
              if (res.result) {
                // this.$message({
                //   type: "success",
                //   message: res.message
                // });
              } else {
                this.$message({
                  type: "warning",
                  message: res.message
                });
              }
            });
        })
        .catch(_ => {});
    },
    ChartName(key) {
      let obj = {
        pie: "饼图",
        gauge: "仪表盘",
        funnel: "漏斗图",
        radar: "雷达图",
        bar: "柱状图",
        line: "折线图",
        scatter: "散点图",
        wordcloud: "字符云"
      };
      return obj[key];
    }
  },
  components: {
    siderBar,
    superLayout,
    boardConfigTitle,
    boardConfigBackground,
    boardConfigLayout,
    boardConfigParam,
    chartsView,
    boardZoomChart,
    boardConfigAuthorization
  }
};
</script>
<style lang="less">
.board-center {
  display: flex;
  justify-content: space-between;

  .board-display {
    flex: 1;
    padding: 10px 10px 0 0;
    height: 100%;
    box-sizing: border-box;

    .board-display-body {
      width: 100%;
      background-color: white;
      // padding: 10px 0;
      border-radius: 5px;
      box-shadow: 0px 2px 5px 0px rgba(24, 27, 45, 0.14);
      height: 100%;
      box-sizing: border-box;
      overflow: auto;
      // display: flex;
      // flex-direction: column;
      position: relative;

      .board-display-header {
        width: 100%;
        box-sizing: border-box;
        height: 32px;
      }

      .layout-display-body::-webkit-scrollbar {
        display: none;
      }
    }

    .boar-display-body::-webkit-scrollbar {
      display: none;
    }
  }

  .main-body {
    width: 100%;
    min-height: 100%;
    // position: absolute;
    background-size: cover !important;

    .el-dropdown {
      position: absolute;
      right: 20px;
      top: 20px;
    }
  }

  .main-title {
    height: 40px;
    line-height: 40px;
    padding: 0 5px;
    font-weight: 700;
  }

  .sub-title {
    height: 40px;
    line-height: 40px;
    padding: 0 5px;
    font-weight: 700;
  }
}
</style>
