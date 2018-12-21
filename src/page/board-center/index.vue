/*
*看板中心右边看板部分
*/
<template>
  <div class="board-center">
    <!-- 侧边栏 -->

    <sider-bar title="看板库" :urls="url" :prop="defaultProp" :currentNode="currentNode" :configData="configData" keyCode="layoutConfig"
      @currentChange="currentChange" ref="sidebar" @boardHandler="boardHandler">
      <el-dropdown>
        <span class="el-dropdown-link">
          <i class="iconfont icon-gengduo"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>看板授权</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </sider-bar>
    <!-- 布局展示 -->
    <div class="board-display">
      <div class="board-display-body">
        <div v-if="currentFile.reportType=='自定义'" style="height:100%;position:relative;">
          <div class="main-body" :style="{'background':setBg(),'background-size': 'cover','opacity':configData.bgConfig.opacticy?configData.bgConfig.opacticy:1}">
          </div>
          <div class="main-body">
             <el-dropdown @command="handleCommand" placement="bottom-end">
              <span class="el-dropdown-link">
                <i class="iconfont icon-shezhi"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="标题设置">标题设置</el-dropdown-item>
                <el-dropdown-item command="布局设置">布局设置</el-dropdown-item>
                <el-dropdown-item command="背景设置">背景设置</el-dropdown-item>
                <el-dropdown-item command="共享参数">共享参数</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div class="mai-header clearfix" style="padding-top:10px;">
              <div class="main-title" :style="setStyle('title')">{{configData.titleConfig.title.text?configData.titleConfig.title.text:''}}</div>
              <div class="sub-title" :style="setStyle('subTitle')">{{configData.titleConfig.subTitle.text?configData.titleConfig.subTitle.text:''}}</div>
            </div>
            <super-layout :config="configData" ref="superLayout" :isToolbar="false" @handleedit="handleEdit"
             @handlerefresh="handleRefresh" @handlezoom="handleZoom" @handledetails="handleDetails">
              <template slot-scope="{data}">
                <charts-view :id="data.i" :config="data.config" v-if="data.config" :ref="'myChart'+data.i"></charts-view>
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
    <!-- 共享参数 -->
    <board-config-param></board-config-param>
    <!-- 布局设置 -->
    <board-config-layout ref="layoutSet" :currentFile="currentFile" @layoutSuccess="layoutSuccess"></board-config-layout>
    <!-- 放大 -->
    <board-zoom-chart :zoomObj="zoomObj" v-if="zoomObj.isShow"></board-zoom-chart>
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
      }
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
      if (command == "背景设置") {
        this.bgconfig = { ...this.configData.bgConfig };
        this.$refs.bgSet.show();
      } else if (command == "布局设置") {
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
      } else if (command == "标题设置") {
        this.titleConfig = JSON.parse(
          JSON.stringify(this.configData.titleConfig)
        );
        this.$refs.titleSet.show();
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
     *把当前图表信息存入vuex
     */
    handleEdit(data, index) {
      this.setCurrConfigs(data);
      this.setCurrNode(JSON.parse(JSON.stringify(this.currentNode)));
      this.setCurrchartId(data.i);
      this.$router.push("/chartCenter");
    },
    handleRefresh(data, index) {
      data.config.data = null;
      this.$refs["myChart" + data.i].getData(true);
    },
    handleDetails(data, index) {
      data.boolen = true;
    },
    handleZoom(data, index) {
      this.zoomObj.config = data.config;
      this.zoomObj.i = data.i;
      this.zoomObj.isShow = true;
    },
    boardHandler(res, data) {
      this.$set(data, "layoutConfig", res.model.layoutConfig);
      this.$set(data, "layoutId", res.model.layoutId);
      this.configData.layout = JSON.parse(res.model.layoutConfig).layout;
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
    boardZoomChart
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
    height: 100%;
    width: 100%;
    position: absolute;
    background-size: cover !important;
    .el-dropdown {
      position: fixed;
      right: 20px;
      top: 100px;
    }
  }

  .main-title {
    height: 40px;
    line-height: 40px;
    padding: 0 5px;
  }

  .sub-title {
    height: 40px;
    line-height: 40px;
    padding: 0 5px;
  }
}
</style>
