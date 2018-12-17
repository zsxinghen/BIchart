<template>
  <div class="app">
    <!-- 头部 -->
    <board-hearder v-if="currRoute!=='chartCenter'"></board-hearder>
    <chart-hearder v-if="currRoute==='chartCenter'"></chart-hearder>
    <!-- 路由 -->
    <div class="router-view">
       <router-view/>
    </div>
    <!-- loading -->
    <loading></loading>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import boardHearder from "./common/board-hearder";
import chartHearder from "./common/chart-hearder";
export default {
  props: ["boardApi", "accountName", "accountEnglist", "appLogo"],
  data() {
    return {
      currRoute: ""
    };
  },
  created() {
    window.localStorage.setItem("boardApi", this.boardApi);
    this.setAccountInfo({
      accountName: this.accountName,
      accountEnglist: this.accountEnglist,
      appLogo: this.appLogo
    });
  },
  beforeMount() {
    this.$router.push("/chartCenter");
    this.currRoute = this.$route.name;
  },
  methods: {
    ...mapMutations(["setAccountInfo"])
  },
  watch: {
    $route(to, from) {
      this.currRoute = to.name;
    }
  },
  components: {
    boardHearder,
    chartHearder
  }
};
</script>

<style lang="less">
@import "./assets/less/reset.less";
@import url("./assets/font/iconfont.css");
.app {
  display: flex;
  flex-direction: column;
  height: 100%;
  .board-hearder {
    flex: 0 0 80px !important;
  }
  .chart-hearder {
    flex: 0 0 80px !important;
    background-color: #f0f2f3;
    box-shadow: 0px 3px 5px rgba(24, 27, 45, 0.2);
  }
  .router-view {
    flex: 1;
    margin-bottom: 10px;
    //  position: absolute;
    //  top: 80px;
    //  bottom: 10px;
    //  left: 0;
    //  width: 100%;

    & > div {
      height: 100%;
    }
  }
}
</style>
