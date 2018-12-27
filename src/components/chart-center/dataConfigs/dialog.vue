/*
本地数据源配置弹窗部分
*/
<template>
  <board-toast
    :config="dialogConfig"
    @cancel="close"
    @save="save"
    class="data-set-config"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
      style="margin-right:30px;margin-bottom:10px"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item
            label="数据源："
            label-width="100px"
            prop="sourceType"
          >
            <el-radio
              v-model="ruleForm.sourceType"
              label="local"
              @change="resetData"
            >本地</el-radio>
            <el-radio
              v-model="ruleForm.sourceType"
              label="remote"
              @change="resetData"
            >远程</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="数据集名称："
            label-width="100px"
            prop="tableName"
          >
            <el-input
              v-model="ruleForm.tableName"
              placeholder="数据集名称"
              size="mini"
            ></el-input>
          </el-form-item>
        </el-col>
        <keep-alive>
          <div v-if="ruleForm.sourceType=='local'">
            <el-col :span="24">
              <el-form-item
                label=""
                label-width="30px"
                prop="domain"
              >
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入本地数据源，以json格式输入"
                  v-model="ruleForm.domain"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </div>
        </keep-alive>
        <keep-alive>
          <!-- 远程数据源 -->
          <div v-if="ruleForm.sourceType=='remote'">
            <remote-data
              :dataConfig="config.dataConfig"
              ref="remoteData"
              :ruleForm="ruleForm"
              :config="config"
            ></remote-data>
          </div>
        </keep-alive>
      </el-row>
    </el-form>
    <!-- {{config.dataConfig}} -->
  </board-toast>
</template>
<script>
import { mapGetters } from "vuex";
import { default as urls } from "../../../api/urls/chart-center.js";
import remoteData from "./remoteData.vue";

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
        btnData: ["cancel", "save"],
        appendToBody: true
      },
      isSave: false,
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
  components: {
    remoteData
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
  watch: {
    "dialogConfig.dialogVisible"() {
      if (this.isSave) {
        let obj = JSON.parse(JSON.stringify(this.config));
        //当维度、数值变化时，初始化所有配置信息
        this.$set(this.config, "chart", "table");
        this.$set(this.config, "type", "table");
        this.$set(this.config, "settings", {
          chart: "table",
          type: "table",
          title: {},
          remark: "",
          dataZoom: {}
        });
        this.$set(this.config, "dataConfig", {
          ...obj.dataConfig
        });
        this.$set(this.config, "data", null);
        this.$set(this.config.dataConfig, "dimension", []);
        this.$set(this.config.dataConfig, "numberValue", []);
      }
    }
  },
  mounted() {},
  methods: {
    show() {
      // 初始化数据
      this.isSave = false;
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
          this.saveLocalData(urls.updUrl, {
            id: this.ruleForm.id
          }); // 编辑本地数据源
        } else {
          this.saveLocalData(urls.addUrl); // 新增本地数据源
        }
      } else {
        if (this.ruleForm.id || this.ruleForm.id === 0) {
          this.saveRemoteData({
            id: this.ruleForm.id
          }); // 编辑远程数据源
        } else {
          this.saveRemoteData(); // 新增本地数据源
        }
        //远程
      }
    },
    // 初始化数据
    resetData() {
      if (this.ruleForm.sourceType === "local") {
        // this.ruleForm.tableName = null;
        this.ruleForm.domain = null;
      } else {
        // this.ruleForm.tableName = null;
        this.ruleForm.wareHouseId = null;
        this.ruleForm.ModelId = null;
        this.ruleForm.modelCode = null;
        this.ruleForm.version = null;
        this.$refs.remoteData.options.list = null;
        this.ruleForm.findCond = null;
        this.ruleForm.findCondJson = null;
      }
    },
    // 保存本地数据源
    saveLocalData(url, obj = null) {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let param = {
            boardId: this.getCurrNode.id,
            reportId: this.getCurrchartId,
            type: "本地",
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
                this.config.dataConfig.sourceType = this.ruleForm.sourceType;
                this.config.dataConfig.tableName = this.ruleForm.tableName;
                this.config.dataConfig.domain = this.ruleForm.domain;
                res.model.keyls.forEach(val => {
                  this.config.dataConfig.list.push({
                    name: val,
                    prop: val
                  });
                });
                // 判断维度、数值字段是否变化，只要变化一个全部初始化
                this.isSave = this.checkChange([
                  ...this.config.dataConfig.list
                ]);
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
    },
    saveRemoteData(obj = null) {
      let arr = (arr = this.$refs.remoteData.options.list
        .filter(v => v.isCheck == true)
        .map(v => v.alias));
      let param = {
        boardId: this.getCurrNode.id,
        reportId: this.getCurrchartId,
        type: "远程",
        value: this.ruleForm.tableName,
        wareHouseId: this.ruleForm.wareHouseId,
        modelId: this.ruleForm.ModelId,
        dataModelCode: this.ruleForm.modelCode,
        version: this.ruleForm.version,
        findList: arr,
        ...obj
      };
      if (this.ruleForm.findCond) {
        param.findCond = this.ruleForm.findCond;
        param.findCondJson = this.ruleForm.findCondJson;
      }
      this.$apis
        .fetchPostJson(urls.addOrUpd, {
          params: param,
          Vue: this
        })
        .then(res => {
          if (res.result) {
            this.config.dataConfig.list = [];
            this.config.dataConfig.id = res.model.id;
            this.config.dataConfig.sourceType = this.ruleForm.sourceType;
            this.config.dataConfig.tableName = this.ruleForm.tableName;
            this.config.dataConfig.wareHouseId = this.ruleForm.wareHouseId;
            this.config.dataConfig.ModelId = this.ruleForm.ModelId;
            this.config.dataConfig.modelCode = this.ruleForm.modelCode;
            this.config.dataConfig.version = this.ruleForm.version;
            this.config.dataConfig.findList = this.$refs.remoteData.options.list;
            let list = this.$refs.remoteData.options.list
              .filter(v => v.isCheck == true)
              .map(v => {
                return {
                  prop: v.alias,
                  name: v.remark
                };
              });
            this.config.dataConfig.list = list;
            // 判断维度、数值字段是否变化，只要变化一个全部初始化
            this.isSave = this.checkChange([...this.config.dataConfig.list]);
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
    },
    // 确认维度、数值是否变化
    checkChange(list) {
      let dimension = [...this.config.dataConfig.dimension],
        numberValue = [...this.config.dataConfig.numberValue],
        flag = false;
      // 当list的没有dimension或numberValue中任何一个元素，返回ture;
      if (dimension.length > 0) {
        dimension.forEach(v => {
          let i = list.findIndex(k => k.prop == v.prop);
          if (i == -1) {
            flag = true;
          }
        });
      }
      if (numberValue.length > 0) {
        numberValue.forEach(v => {
          let i = list.findIndex(k => k.prop == v.prop);
          if (i == -1) {
            flag = true;
          }
        });
      }

      return flag;
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
.el-input--mini .el-input__inner {
  height: 28px !important;
  line-height: 28px;
}
.data-set-config {
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
