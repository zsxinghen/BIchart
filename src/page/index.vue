// 报表预览展示部分
<template>
      <div class="board-display-body">
        <div v-if="currentFile.reportType=='自定义'" style="height:100%">
          <div class="main-body" :style="{'background':setBg(),'background-size': 'cover','opacity':configData.bgConfig.opacticy?configData.bgConfig.opacticy:1}">
          </div>
           <div class="main-body" >  <div class="mai-header clearfix" style="padding-top:10px;">
              <div class="main-title" :style="setStyle('title')">{{configData.titleConfig.title.text?configData.titleConfig.title.text:''}}</div>
              <div class="sub-title" :style="setStyle('subTitle')">{{configData.titleConfig.subTitle.text?configData.titleConfig.subTitle.text:''}}</div>
            </div>
            <super-layout :config="configData" ref="superLayout" :isToolbar="true">
              <template slot-scope="{data}">
                <charts-view :id="data.i" :config="data.config" v-if="data.config"></charts-view>
              </template>
            </super-layout>
          </div>
        </div>
        <div v-if="currentFile.reportType=='专业模板'" style="height:100%">
          <iframe :src="currentFile.unzipPath" frameborder="0" style="width:100%;height:100%"></iframe>
        </div>
      </div>
</template>
<script>
import { mapGetters } from "vuex";
import superLayout from "../common/superLayout";
import urls from "../api/urls/board-center.js";
import chartsView from "../components/chart-center/charts/index.vue";
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
      }
    };
  },
  components: {
    superLayout,
    chartsView
  },
  computed: {
    ...mapGetters(["getBoardId"])
  },
  beforeMount() {
    this.getDesign();
  },
  mounted() {},
  methods: {
    // 根据看板id获取数据
    getDesign() {
      this.$apis
        .fetchPost(urls.sideBar.search_layout, {
          params: {
            id: this.getBoardId
          },
          Vue: this
        })
        .then(res => {
          if (res.result) {
            this.$set(this.currentFile, "reportType", res.model.reportType);
            if (res.model.reportType == "自定义") {
              this.boardHandler(res);
            } else {
              this.$set(this.currentFile, "unzipPath", res.model.unzipPath);
            }
          }
        });
    },
    // 设置自定义看板数据
    boardHandler(res, data) {
      // this.$set(data, "layoutConfig", res.model.layoutConfig);
      // this.$set(data, "layoutId", res.model.layoutId);
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
        // this.$set(data, "config", res.model.config);
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
    }
  }
};
</script>

<style lang="less">
.board-display-body {
  width: 100%;
  background-color: white;
  // padding: 10px;
  border-radius: 5px;
  // box-shadow: 0px 2px 5px 0px rgba(24, 27, 45, 0.14);
  min-height: 100vh;
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

.main-body {
  // flex: 1;
  height: 100%;
  width: 100%;
  position: absolute;
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
</style>
