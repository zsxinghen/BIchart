<template>
  <div :class="'my-chart '+ id">
    <component
      :is="`my-${config.type}`"
      :config="config"
      :id="id"
      v-if="config.data"
    >
    </component>
    <loading v-else-if="!config.data"></loading>
  </div>
</template>
<script>
import myCard from "./type/Card.vue";
import myMap from "./type/Map.vue";
import myTable from "./type/Table.vue";
import myChart from "./type/Chart.vue";
import loading from "./Loading";
export default {
  data() {
    return {
      times: null
    };
  },
  props: ["id", "config"],
  components: {
    myCard,
    myMap,
    myTable,
    myChart,
    loading
  },
  created() {
    this.config.data = null;
  },
  beforeMount() {
    this.getData();
  },
  mounted() {},
  methods: {
    getData(boolen) {
      this.config.data = null;
      if (boolen) {
        this.$forceUpdate();
      }
      if (this.config.dataConfig.list.length) {
        if (this.id == "my") {
          //报表中心配置部分
          this.update();
        } else {
          //看板中心部分
          if (
            !this.config.updateSet ||
            this.config.updateSet.updateWay == "no"
          ) {
            //当不设置或不更新时
            this.update();
          } else if (this.config.updateSet.updateWay == "nomal") {
            //  普通更新
            if (this.config.updateSet.rate) {
              this.update();
              this.times = setInterval(() => {
                this.update();
              }, this.config.updateSet.rate * 1000);
            }
          } else if (this.config.updateSet.updateWay == "timing") {
            // 定时更新
            if (this.config.updateSet.time) {
              this.update();
              this.times = setInterval(() => {
                let time = this.update();
                if (time == this.config.updateSet.time) {
                  this.update();
                }
              }, 1000);
            }
          }
        }
      }
    },
    update() {
      this.config.data = null;
      this.$forceUpdate();
      setTimeout(() => {
        this.$store.dispatch("getList", this);
      }, 100);
    },
    current() {
      var now = new Date();

      var year = now.getFullYear(); //年
      var month = now.getMonth() + 1; //月
      var day = now.getDate(); //日

      var hh = now.getHours(); //时
      var mm = now.getMinutes(); //分
      var ss = now.getSeconds(); //秒
      var clock = "";
      // var clock = year + "-";

      // if (month < 10) clock += "0";

      // clock += month + "-";

      // if (day < 10) clock += "0";

      // clock += day + " ";

      if (hh < 10) clock += "0";

      clock += hh + ":";
      if (mm < 10) clock += "0";
      clock += mm + ":";

      if (ss < 10) clock += "0";
      clock += ss;
      return clock;
    }
  },
  beforeDestroy() {
    clearInterval(times);
  }
};
</script>
<style lang="less">
.my-chart {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
