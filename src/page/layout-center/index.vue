<template>
  <div class="layout-center">
    <!-- 侧边栏 -->
    <sider-bar title="布局库" :urls="url" ref="sidebar" :currentNode="currentNode" :configData="configData">
      <i class="iconfont icon-gengduo" :index='3'></i>
    </sider-bar>
    <!-- 布局展示 -->
    <div class="layout-display">
      <div class="layout-display-body">
        <super-layout 
          :config="configData" 
          ref="superLayout" 
          :isToolbar="false" 
          :tool="['delete']" 
          @handledelete="handleDel"
          @resized="layoutChange"
          @moved="layoutChange"
        >
          <!-- <template slot-scope="scope">
            { {scope.data}}
          </template> -->
        </super-layout>
      </div>
    </div>
    <!-- 布局设置 -->
    <layout-setting @addline="addline" :line="configData.line" @save="save"></layout-setting>
  </div>
</template>
<script>
import siderBar from "../../common/sider-bar";
import layoutSetting from "../../components/layout-center/layout-setting";
import superLayout from "../../common/superLayout";
import { default as urls } from "../../api/urls/layout-center.js";
export default {
  data() {
    return {
      url: null,
      configData: {
        layout: [],
        rowHeight: 200,
        isDraggable: true,
        isResizable: true,
        line: 1
      },
      currentNode: {
        config: [],
        id: undefined,
        folderId: undefined,
        alias: undefined
      }
    };
  },
  created() {
    this.url = urls;
  },
  mounted(){
    this.$refs.sidebar.filterData();
  },
  methods: {
    addline(data) {
      this.$refs.superLayout.addLine(data);
    },
    setCurrentLine() {
      var max = -1;
      for (let d of this.configData.layout) {
        if (d.y > max) {
          max = d.y;
        }
      }
      this.configData.line = max + 1;
    },
    layoutChange() {
      this.setCurrentLine();
      this.save();
    },
    handleDel(data, index) {
      this.configData.layout.splice(index, 1);
      this.setCurrentLine();
      this.save();
    },
    save() {
      let obj = {
        line: this.configData.line,
        layout: this.configData.layout
      };

      let param = {
        id: this.currentNode.id,
        folderId: this.currentNode.folderId,
        alias: this.currentNode.alias,
        config: JSON.stringify(obj)
      };
      console.log(param);
      this.$apis
        .fetchPost(this.url.sideBar.edit_layout, {
          params: param,
          Vue: this
        })
        .then(res => {
          if (res.result) {
            this.$message({
              type: "success",
              message: res.message
            });
          } else {
            this.$message({
              type: "warning",
              message: res.message
            });
          }
        });
    }
  },
  components: {
    siderBar,
    layoutSetting,
    superLayout
  }
};
</script>
<style lang="less">
.layout-center {
  display: flex;
  justify-content: space-between;

  .side-bar {
  }

  .layout-display {
    flex: 1;
    padding: 10px 0 0;
    height: 100%;
    box-sizing: border-box;

    .layout-display-body {
      width: 100%;
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0px 2px 5px 0px rgba(24, 27, 45, 0.14);
      height: 100%;
      box-sizing: border-box;
      overflow: auto;

      .bolayoutard-display-header {
        width: 100%;
        box-sizing: border-box;
      }

      .layout-display-body::-webkit-scrollbar {
        display: none;
      }
    }

    .layout-display-body::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
