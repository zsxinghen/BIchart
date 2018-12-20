<template>
  <div class="chart-hearder">
    <div class="chart-header-left"><i
        class="el-icon-arrow-left"
        @click="back"
      ><span>编辑图表</span></i></div>
    <div class="chart-header-right"><i
        class="iconfont icon-baocun"
        @click="save"
      ><span>保存</span></i></div>
  </div>
</template>
<script>
import { default as urls } from "../api/urls/chart-center";
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  props: ["config"],
  computed: {
    ...mapGetters(["getCurrConfigs", "getCurrNode", "getCurrchartId"])
  },
  methods: {
    back() {
      this.$router.push("/");
    },
    // 数值 figure;
    // 维度 veidoo;
    // 图表配置信息 picConfig
    save() {
      // 本地数据
      let param = {
        boardId: this.getCurrNode.id, //看板id
        reportId: this.getCurrchartId, //报表的id
        value: this.config.dataConfig.tableName,
        domain: this.config.dataConfig.domain,
        figure: JSON.stringify(this.config.dataConfig.numberValue), //数值
        veidoo: JSON.stringify(this.config.dataConfig.dimension), //维度
        picConfig: JSON.stringify(this.config).replace(/\%/g, "$"), //报表配置信息
        id: this.config.dataConfig.id //数据源id
      };
      this.$apis
        .fetchPost(urls.updUrl, {
          params: param,
          Vue: this
        })
        .then(res => {
          if (res.result) {
            this.$message({
              type: "success",
              message: "保存成功"
            });
          } else {
            this.$message({
              type: "warning",
              message: "保存失败"
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


