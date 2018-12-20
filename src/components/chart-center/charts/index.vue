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
    return {};
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
    this.config.data = null;
    if (this.config.dataConfig.list.length){
      setTimeout(() => {
        this.$store.dispatch("getList", this);
      }, 100);
    }
  },
  mounted() {
    console.log("mounted", this.config.data);
  },
  methods: {},
  watch: {
    "config.data": {
      deep: true,
      handler() {
        console.log(111, this);
      }
    }
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

