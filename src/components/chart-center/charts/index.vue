<template>
  <div :class="'my-chart '+ id">
    <component :is="`my-${config.type}`" :config="config" :id="id" v-if="config.data">
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
          setTimeout(() => {
            this.$store.dispatch("getList", this);
          }, 100);
        } else {
          //看板中心部分
          if (
            !this.config.updateSet ||
            this.config.updateSet.updateWay == "no"
          ) {
            //当不设置或不更新时
            setTimeout(() => {
              this.$store.dispatch("getList", this);
            }, 100);
          } else if (this.config.updateSet.updateWay == "nomal") {
            //  普通更新
            if (this.config.updateSet.rate) {
              setTimeout(() => {
                this.$store.dispatch("getList", this);
              }, 100);
              this.times = setInterval(() => {
                this.config.data = null;
                this.$forceUpdate();
                setTimeout(() => {
                  this.$store.dispatch("getList", this);
                }, 100);
              }, this.config.updateSet.rate * 1000);
            }
          } else if (this.config.updateSet.updateWay == "timing") {
            // 定时更新
            if (this.config.updateSet.time) {
              setTimeout(() => {
                this.$store.dispatch("getList", this);
              }, 100);
              this.times = setInterval(() => {
                let time = new Date();
                if (time == this.config.updateSet.time) {
                  this.config.data = null;
                  this.$forceUpdate();
                  setTimeout(() => {
                    this.$store.dispatch("getList", this);
                  }, 100);
                }
              }, 1000);
            }
          }
        }
      }
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
