<template>
  <div class="chart-hearder">
    <div class="chart-header-left"><i
        class="el-icon-arrow-left"
        @click="back"
      ><span>编辑图表</span></i></div>
    <div class="chart-header-right"><i class="iconfont icon-baocun"><span>保存</span></i></div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    back() {
      this.$router.push("/");
    }
  }
};
</script>
<style lang="less">
.chart-hearder {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // box-shadow: 0px 3px 5px rgba(24, 27, 45, 0.2);
  .chart-header-left {
    flex: 1;
    padding: 0 20px;
    box-sizing: border-box;
    i {
      font-size: 32px;
      vertical-align: middle;
      margin-right: 10px;
      cursor: pointer;
      span {
        font-size: 24px;
        vertical-align: middle;
        margin-left: 50px;
        cursor: default;
      }
    }
  }
  .chart-header-right {
    padding: 0 40px;
    box-sizing: border-box;
    i {
      font-size: 20px;
      vertical-align: middle;
      cursor: pointer;
      span {
        font-size: 16px;
        margin-left: 5px;
        vertical-align: middle;
      }
    }
  }
}
</style>


