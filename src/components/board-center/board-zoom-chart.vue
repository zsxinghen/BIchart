
/*
*看板中心--放大
*/
<template>
  <div class="board-zoom-mask">
    <el-dialog :visible.sync="zoomObj.isShow" :show-close='false' :fullscreen="true" width="30%">
      <i style="position: absolute;right: 24px;z-index: 100;top: 16px;" class="iconfont icon-enlarge-02"
        @click="zoomObj.isShow=false"></i>
      <charts-view :id="zoomObj.i+'zoom'" :config="zoomObj.config" v-if="zoomObj.config" :ref="'myZoomChart'"></charts-view>
    </el-dialog>
  </div>
</template>
<script>
import chartsView from "../chart-center/charts/index.vue";
export default {
  data() {
    return {};
  },
  props: ["zoomObj"],
  components: {
    chartsView
  }
};
</script>
<style lang="less">
.board-zoom-mask {
  position: absolute;
  background: red;
  height: 100%;
  width: 100%;

  .el-dialog__header {
    border-bottom: none;
    padding: 0;
  }

  .el-dialog__body {
    height: 100%;
    padding: 0;
  }
}
</style>
