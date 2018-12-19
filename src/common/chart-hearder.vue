<template>
  <div class="chart-hearder">
    <div class="chart-header-left"><i
        class="el-icon-arrow-left"
        @click="back"
      ><span>编辑图表</span></i></div>
    <div class="chart-header-right"><i class="iconfont icon-baocun" @click="save"><span>保存</span></i></div>
  </div>
</template>
<script>
import { default as urls } from "../api/urls/chart-center";
export default {
  data() {
    return {};
  },
  props: ["config"],
  methods: {
    back() {
      this.$router.push("/");
    },
    // 数值 figure;
    // 维度 veidoo;
    // 图表配置信息 picConfig
    save() {
      // let url=
      this.$apis
        .fetchPost(url, {
          params: param,
          Vue: this
        })
        .then(res => {
          if (res.result) {
            this.config.dataConfig.list = [];
            this.config.dataConfig.id = res.model.id;
            console.log(this.config.dataConfig, res.model);
            res.model.keyls.forEach(val => {
              this.config.dataConfig.list.push({
                name: val,
                prop: val
              });
            });
            this.close();
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


