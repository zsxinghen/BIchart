/*
*数据配置---数据预览
*/
<template>
  <board-toast :config="dialogConfig" @close="close"  class="data-rule-config">
    <div style="margin-bottom:20px">
      <el-table :data="tableData"  border :stripe="true" :height="500" style="overflow-y:auto">
        <el-table-column show-overflow-tooltip :prop="val.prop" :label="val.label" :min-width="60" v-for="(val,index) in columns" 
          :key="index" align="center" :resizable="true"></el-table-column>
      </el-table>
    </div>
  </board-toast>
</template>
<script>
  export default {
    data() {
      return {
        dialogConfig: {
          title: "数据预览", //弹窗标题
          dialogVisible: false, //弹窗显示
          width: "1000px", //弹窗宽
          btnData: ["close"],
          appendToBody: true
        },
        columns: [],
        tableData: []
      };
    },
    props: {
      dataConfig: {
        type: Object,
        default: () => null
      },
      config: {
        type: Object,
        default: () => null
      },
      ruleForm: {
        type: Object,
        default: () => null
      }
    },
    components: {},
    methods: {
      show(list, arr) {
        this.columns = list;
        this.tableData = arr;
        console.log(this.columns, this.tableData);
        this.dialogConfig.dialogVisible = true;
      },
      close() {
        this.dialogConfig.dialogVisible = false;
      }
    }
  };

</script>
