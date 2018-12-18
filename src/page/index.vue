// 报表预览展示部分
<template>
      <div>
         <super-layout 
               v-if="currLayoutData&&reportWatConfig&&dataconfig"
                :config="currLayoutData" 
                :dataconfig="dataconfig"
                :isToolbar="true"
                :reportWatConfig="reportWatConfig"
                :isChartsShow="true" ></super-layout>
      </div>
</template>
<script>
// import { searchBirReport } from "../api/watchCenter";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      watchName: "",
      currLayoutData: null,
      dataconfig: null,
      reportWatConfig: null,
      RepertList: [],
      title: ""
    };
  },
  computed: {
    // ...mapGetters(["getRepertId"])
  },
  mounted() {
    // searchBirReport().then(data => {
    //   if (data.result) {
    //     data.model.forEach(element => {
    //       this.RepertList = this.RepertList.concat(element.repertName);
    //     });
    //     for (let i = 0; i < this.RepertList.length; i++) {
    //       console.log(this.RepertList[i].id, this.getRepertId, i);
    //       if (this.RepertList[i].id == this.getRepertId) {
    //         this.currLayoutData = this.RepertList[i].layout
    //           ? JSON.parse(this.RepertList[i].layout)
    //           : null;
    //         this.dataconfig = this.RepertList[i].dataconfig
    //           ? JSON.parse(this.RepertList[i].dataconfig)
    //           : null;
    //         this.reportWatConfig = this.RepertList[i].reportWatConfig
    //           ? JSON.parse(
    //               this.RepertList[i].reportWatConfig.replace(/@/g, "%")
    //             )
    //           : null;
    //         break;
    //       }
    //     }
    //     this.watchName = data.model[0].folderName.folderName;
    //   }
    // });
  }
};
</script>
 
<style lang="less">
</style>
