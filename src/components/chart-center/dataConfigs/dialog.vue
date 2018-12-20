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
              <el-form-item label="" label-width="0" prop="domain">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入本地数据源，以json格式输入"
                  v-model="ruleForm.domain">
                </el-input>
              </el-form-item>
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
import { mapGetters } from "vuex";
import { default as urls } from "../../../api/urls/chart-center.js";
export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入数据集名称"));
      } else {
        callback();
      }
    };
    var validateDomain = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入数据"));
      } else {
        try {
          let jsonStr = JSON.parse(value);
          if (Array.isArray(jsonStr) || typeof jsonStr === "object") {
            callback();
          } else {
            callback(new Error("请输入正确的json"));
          }
        } catch (e) {
          callback(new Error("请输入正确的json"));
        }
      }
    };
    return {
      dialogConfig: {
        title: "数据源配置", //弹窗标题
        dialogVisible: false, //弹窗显示
        width: "800px", //弹窗宽
        btnData: ["cancel", "save"]
      },
      rules: {
        tableName: [
          {
            validator: validateName,
            trigger: "blur"
          }
        ],
        domain: [
          {
            validator: validateDomain,
            trigger: "blur"
          }
        ]
      },
      ruleForm: {
        sourceType: "local",
        tableName: "",
        domain: null
      }
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
    }
  },
  computed: {
    ...mapGetters(["getCurrConfigs", "getCurrNode", "getCurrchartId"])
  },
  mounted() {},
  methods: {
    show() {
      // 初始化数据
      this.ruleForm = JSON.parse(JSON.stringify(this.dataConfig));
      this.dialogConfig.dialogVisible = true;
    },
    close() {
      this.dialogConfig.dialogVisible = false;
    },
    save() {
      if (this.ruleForm.sourceType === "local") {
        //本地
        if (this.ruleForm.id || this.ruleForm.id === 0) {
          this.getLocalData(urls.updUrl, { id: this.ruleForm.id }); // 编辑本地数据源
        } else {
          this.getLocalData(urls.addUrl); // 新增本地数据源
        }
      } else {
        //远程
      }
    },
    getLocalData(url, obj = null) {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let param = {
            boardId: this.getCurrNode.id,
            reportId: this.getCurrchartId,
            value: this.ruleForm.tableName,
            domain: this.ruleForm.domain,
            ...obj
          };
          this.$apis
            .fetchPost(url, {
              params: param,
              Vue: this
            })
            .then(res => {
              if (res.result) {
                this.config.dataConfig.list = [];
                this.config.dataConfig.id = res.model.id;
                this.config.dataConfig.sourceType =this.ruleForm.sourceType;
                this.config.dataConfig.tableName = this.ruleForm.tableName;
                this.config.dataConfig.domain =this.ruleForm.domain;
                res.model.keyls.forEach(val => {
                  this.config.dataConfig.list.push({
                    name: val,
                    prop: val
                  });
                });
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
<style lang="less">
.el-textarea__inner {
  height: 300px !important;
  min-height: 300px !important;
  max-height: 300px !important;
  width: 100%;
  padding: 10px;
  // margin-bottom: 20px;
  border: 1px solid #d1d3d5;
  background: #fff;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
