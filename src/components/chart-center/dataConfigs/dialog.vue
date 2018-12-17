/*
数据源配置弹窗部分
*/
<template>
  <board-toast :config="dialogConfig" @cancel="close" @save="save">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="数据源：" label-width="70px" prop="sourceType">
            <el-radio v-model="ruleForm.sourceType" label="local">本地</el-radio>
            <el-radio v-model="ruleForm.sourceType" label="Remote">远程</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据集名称：" label-width="100px" prop="tableName">
            <el-input v-model="ruleForm.tableName" placeholder="数据集名称" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <keep-alive>
          <div v-if="ruleForm.sourceType=='local'">
            <el-col :span="24">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入本地数据源，以json格式输入" v-model="ruleForm.content">
              </el-input>
            </el-col>
          </div>
        </keep-alive>
        <div>
          <!-- 远程数据源 -->
        </div>
      </el-row>
    </el-form>
  </board-toast>
</template>
<script>
export default {
  data() {
    return {
      dialogConfig: {
        title: "数据源配置", //弹窗标题
        dialogVisible: false, //弹窗显示
        width: "800px", //弹窗宽
        btnData: ["cancel", "save"]
      },
      rules: {
        //   name: [{
        //     validator: validateName,
        //     trigger: "blur"
        //   }]
      },
      ruleForm: {
        sourceType: "local",
        tableName: "",
        content: null
      }
    };
  },
  props: {
    dataConfig: {
      type: Object,
      default: () => null
    }
  },
  mounted() {},
  methods: {
    show() {
      this.ruleForm = JSON.parse(JSON.stringify(this.dataConfig));
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
<style lang="less">
.el-textarea__inner {
  height: 300px !important;
  min-height: 300px !important;
  max-height: 300px !important;
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #d1d3d5;
  background: #fff;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
