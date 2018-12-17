/* 
 *侧边栏--新增文件夹
 */
<template>
    <board-toast :config="dialogConfig" @cancel="close" @save="save" v-if="dialogConfig.dialogVisible">
         <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="文件名称" prop="name">
                    <el-col :span="20">
                        <el-input v-model.trim="ruleForm.name" size="mini"></el-input>
                    </el-col>
                </el-form-item>
         </el-form>
    </board-toast>
</template>
<script>
export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入文件名称"));
      } else {
        let index = this.baseData.findIndex(item => item.alias === value);
        if (index !== -1) {
          callback(new Error("改文件夹下已存在该名称"));
        } else {
          callback();
        }
      }
    };
    return {
      dialogConfig: {
        title: "修改布局名称", //弹窗标题
        dialogVisible: false, //弹窗显示
        width: "400px", //弹窗宽
        btnData: ["cancel", "save"]
      },
      baseData: [],
      rules: {
        name: [{ validator: validateName, trigger: "blur" }]
      },
      ruleForm: {
        name: ""
      },
      url: ""
    };
  },
  props: ["title"],
  mounted() {},
  methods: {
    show(baseData, url) {
      this.dialogConfig.title = "新增" + this.title;
      this.ruleForm.name = "";
      this.url = url;
      this.baseData = baseData;
      this.dialogConfig.dialogVisible = true;
    },
    close() {
      this.dialogConfig.dialogVisible = false;
    },
    save() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let param = { alias: this.ruleForm.name };
          this.$apis
            .fetchPost(this.url, {
              params: param,
              Vue: this
            })
            .then(res => {
              if (res.result) {
                this.$parent.filterData();
                this.close();
                this.$message({
                  type: "success",
                  message: res.message
                });
              } else {
                this.$message({
                  type: "warning",
                  message: res.message
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
