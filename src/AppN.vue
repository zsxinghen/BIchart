<template>
    <router-view></router-view>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  props: ["boardApi", "accountName", "accountEnglist", "appLogo", "boardId"],
  data() {
    return {
      currRoute: ""
    };
  },
  created() {
    window.localStorage.setItem("boardApi", this.boardApi);
    this.setBoardId(this.boardId);
  },
  beforeMount() {
    this.$router.push("/index");
    this.currRoute = this.$route.name;
  },
  methods: {
    ...mapMutations(["setBoardId"])
  },
  components: {}
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
