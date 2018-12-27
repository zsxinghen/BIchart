/* 
 *数据配置---数据规则配置
 */
<template>
    <board-toast :config="dialogConfig" @cancel="close" @save="save" class="data-rule-config">
          <!-- 设置筛选 -->
          <!-- 过滤规则显示 -->
          <ul>
              <li v-for="(item,index) in ruleForm.findCond" :key='index'>{{item}}</li>
          </ul>
    </board-toast>
</template>
<script>
export default {
  data() {
    return {
      dialogConfig: {
        title: "过滤规则配置", //弹窗标题
        dialogVisible: false, //弹窗显示
        width: "800px", //弹窗宽
        btnData: ["cancel", "save"],
        appendToBody: true
      },
      
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
  methods: {
    show() {
      this.dialogConfig.dialogVisible = true;
    },
    close() {
      this.dialogConfig.dialogVisible = false;
    },
    save() {
      this.dialogConfig.dialogVisible = false;
    }
  }
};
</script>
<style>
.data-rule-config{

}
</style>
