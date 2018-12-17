<template>
  <div class="chart-hearder">
    <div class="chart-header-left"><i
        class="el-icon-arrow-left"
        @click="back"
      ><span>编辑图表</span></i></div>
    <div class="chart-header-right"><i class="el-icon-edit-outline"><span>保存</span></i></div>
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
  .chart-header-left {
    padding: 0 20px;
    i {
      font-size: 32px;
      vertical-align: middle;
      margin-right: 10px;
      cursor: pointer;
      span {
        font-size: 24px;
        vertical-align: middle;
        margin-left:50px;
        cursor:default
      }
    }
  }
  .chart-header-right {
    padding: 0 40px;
    i {
      font-size: 24px;
      vertical-align: middle;
      cursor: pointer;
      span {
        font-size: 16px;
        vertical-align: middle;
      }
    }
  }
}
</style>


