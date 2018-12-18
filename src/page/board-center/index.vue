/*
*看板中心右边看板部分
*/
<template>
  <div class="board-center">
    <!-- {{configData}} -->
    <!-- 侧边栏 -->
    <sider-bar title="看板库" :urls="url" :prop="defaultProp" :currentNode="currentNode" :configData="configData" keyCode="layoutConfig" @currentChange="currentChange">
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
      <div class="board-display-body" >
        <div v-if="currentFile.reportType=='自定义'">
          <div class="board-display-header">
            <el-dropdown @command="handleCommand">
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
          </div>
          <div class="main-body" :style="{'background':setBg(),'opacity':configData.bgConfig.opacticy?configData.bgConfig.opacticy:1}">
            <div class="mai-header clearfix" style="padding-top:10px;">
              <div class="main-title" :style="setStyle('title')">{{configData.titleConfig.title.text?configData.titleConfig.title.text:''}}</div>
              <div class="sub-title" :style="setStyle('subTitle')">{{configData.titleConfig.subTitle.text?configData.titleConfig.subTitle.text:''}}</div>
            </div>
            <super-layout :config="configData" ref="superLayout" :isToolbar="false" @handleedit="handleEdit"></super-layout>
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
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import siderBar from "../../common/sider-bar";
import superLayout from "../../common/superLayout";
import boardConfigTitle from "../../components/board-center/board-config-title";
import boardConfigBackground from "../../components/board-center/board-config-background";
import boardConfigLayout from "../../components/board-center/board-config-layout";
import boardConfigParam from "../../components/board-center/board-config-param";
import { default as urls } from "../../api/urls/board-center.js";
import { default as layoutUrls } from "../../api/urls/layout-center.js";
export default {
  data() {
    return {
      currentFile: {
        id: -1
      },
      defaultProp: { children: "reports" },
      configData: {
        layout: [],
        rowHeight: 200,
        isDraggable: false,
        isResizable: false,
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
      url: null
    };
  },
  created() {
    this.url = urls;
  },
  methods: {
    ...mapMutations(["setCurrConfigs", "setCurrNode", "setCurrchartId"]),
    setBg() {
      if (this.configData.bgConfig.type == "null") {
        return "#fff";
      } else if (this.configData.bgConfig.type == "bgColor") {
        return this.configData.bgConfig.color;
      } else {
        return "url(" + this.configData.bgConfig.imageUrl + ")";
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
      console.log(data);
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
      this.setCurrNode(this.currentNode);
      this.setCurrchartId(data.i);
      this.$router.push("/chartCenter");
    }
  },
  components: {
    siderBar,
    superLayout,
    boardConfigTitle,
    boardConfigBackground,
    boardConfigLayout,
    boardConfigParam
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
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0px 2px 5px 0px rgba(24, 27, 45, 0.14);
      height: 100%;
      box-sizing: border-box;
      overflow: auto;
      display: flex;
      flex-direction: column;
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
    flex: 1;
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
