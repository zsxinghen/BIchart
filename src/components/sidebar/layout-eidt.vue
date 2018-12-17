/* 
 *侧边栏--编辑
 */
<template>
    <board-toast :config="dialogConfig" @cancel="close" @save="save" v-if="dialogConfig.dialogVisible">
         <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="dialogConfig.labelName" prop="name">
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
        callback(new Error("请输入名称"));
      } else {
        callback();
      }
    };
    return {
      dialogConfig: {
        title: "修改布局名称", //弹窗标题
        dialogVisible: false, //弹窗显示
        width: "400px", //弹窗宽
        btnData: ["cancel", "save"],
        labelName: ""
      },
      baseData: [],
      rules: {
        name: [{ validator: validateName, trigger: "blur" }]
      },
      ruleForm: {
        name: "",
        id: ""
      },
      url: "",
      parentId: -1,
      config: null
    };
  },
  props: ["title"],
  mounted() {
    // this.dialogConfig.title = "编辑" + this.title;
  },
  methods: {
    show(baseData, url, data, titleText = "", id) {
      this.url = url;
      this.baseData = baseData;
      this.ruleForm.name = data.alias;
      this.parentId = id;
      this.config = data.config;
      this.ruleForm.id = data.id;
      if (this.title == "布局库") {
        this.dialogConfig.title =
          titleText == "编辑" ? "布局重命名" : "文件夹重命名";
        this.dialogConfig.labelName =
          titleText == "编辑" ? "布局名称" : "文件夹名称";
      } else {
        this.dialogConfig.title =
          titleText == "编辑" ? "看板重命名" : "文件夹重命名";
        this.dialogConfig.labelName =
          titleText == "编辑" ? "看板名称" : "文件夹名称";
      }
      this.dialogConfig.dialogVisible = true;
    },
    close() {
      this.dialogConfig.dialogVisible = false;
    },
    save() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let param = { alias: this.ruleForm.name, id: this.ruleForm.id };
          if (this.parentId != -1) {
            param.folderId = this.parentId;
            param.config = this.config;
          }
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
