/*
远程数据源配置
*/
<template>
  <div class="remote-data">
    <el-col :span="8">
      <el-form-item label="数据仓库：" label-width="100px" prop="wareHouseId">
        <el-select v-model="ruleForm.wareHouseId" placeholder="请选择" size="mini" @change="getModel(true)">
          <el-option v-for="item in options.warehouse" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="数据模型：" label-width="100px" prop="dataModelCode">
        <el-select v-model="ruleForm.ModelId" placeholder="请选择" size="mini" :disabled="!ruleForm.wareHouseId" @change="getVersion(true)">
          <el-option v-for="item in options.model" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="数据版本：" label-width="100px" prop="version">
        <el-select v-model="ruleForm.version" placeholder="请选择" size="mini" :disabled="!ruleForm.ModelId" @change="getList">
          <el-option v-for="item in options.version" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="数据列：" label-width="100px" prop="sourceType">
        <el-popover placement="top" trigger="click">
          <ul>
            <li v-for="(item) in options.list" :key="item.id" style="padding-left:20px">
              <el-checkbox v-model="item.isCheck" :label="item.alias">{{item.remark}}</el-checkbox>
            </li>
          </ul>
          <el-button type="primary" slot="reference" size="mini">数据列配置</el-button>
        </el-popover>
        <p>
          <el-tag v-for="(item,index) in options.list" :key="index" v-show="item.isCheck" style="margin-right:10px">{{item.remark}}</el-tag>
        </p>
      </el-form-item>
    </el-col>
    <!-- <el-col :span="24">
      <el-form-item label="数据排序：" label-width="100px" prop="sourceType">
        <el-radio v-model="value" label="1">正序</el-radio>
        <el-radio v-model="value" label="2">倒序</el-radio>
      </el-form-item>
    </el-col> -->
    <el-col :span="24">
      <el-form-item label="过滤规则：" label-width="100px" prop="sourceType">
        <div class="data-filter-content">
          <p v-for="(item,index) in findCondJson" :key="index">{{item}}</p>
       </div>
      </el-form-item>
      <div style="position:relative;margin-bottom:30px">
        <div style="right: 0px;position: absolute;">
          <el-button type="primary" size="mini" :disabled="isDisabled()" @click="ruleSetting">过滤规则配置</el-button>
          <el-button type="primary" size="mini" :disabled="isDisabled()" @click="previewData">数据预览</el-button>
        </div>
      </div>
    </el-col>
    <data-filter :dataConfig="config.dataConfig" :list="options.list"   ref="filter" :ruleForm="ruleForm" :config="config"></data-filter>
    <data-preview  ref="dataPreview"></data-preview>
  </div>
</template>
<script>
import { default as url } from "../../../api/urls/chart-center.js";
import dataFilter from "./filter.vue";
import dataPreview from "./dataPreview.vue";
export default {
  data() {
    return {
      value: "",
      findCondJson:[],
      options: {
        warehouse: [],
        model: [],
        version: [],
        list: [] //数据列
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
    },
    ruleForm: {
      type: Object,
      default: () => null
    }
  },
  mounted() {
    this.getHouse();
  },
  components: {
    dataFilter,
    dataPreview
  },
  methods: {
    // 获取仓库下拉
    getHouse() {
      this.$apis
        .fetchPost(url.getHouse, {
          params: null,
          Vue: this
        })
        .then(res => {
          if (res.result) {
            this.options.warehouse = res.model.map(v => {
              return {
                value: v.id,
                label: v.alias
              };
            });
          } else {
            this.$message({
              type: "warning",
              message: res.message
            });
          }
        });
    },
    // 获取数据模型下拉
    getModel(boolen) {
      this.$apis
        .fetchPost(url.getModel, {
          params: {
            wareHouseId: this.ruleForm.wareHouseId
          },
          Vue: this
        })
        .then(res => {
          if (res.result) {
            if (boolen) {
              if (this.$refs["ruleForm"]) {
                this.$refs["ruleForm"].resetFields();
              }
              this.ruleForm.ModelId = "";
              this.ruleForm.version = "";
              this.ruleForm.findCond = [
                {
                  prop: "",
                  symbol: "",
                  value: ""
                }
              ];
              this.ruleForm.findCondJson = [];
              this.options.list = [];
            }
            this.options.model = res.model.map(v => {
              return {
                value: v.id,
                label: v.alias,
                modelCode: v.modelCode
              };
            });
          } else {
            this.$message({
              type: "warning",
              message: res.message
            });
          }
        });
    },
    // 获取版本信息下拉
    getVersion(boolen) {
      let flag = this.options.model.findIndex(
        v => v.value == this.ruleForm.ModelId
      );
      if (flag != -1) {
        this.$set(
          this.ruleForm,
          "modelCode",
          this.options.model[flag].modelCode
        );
      }
      this.$apis
        .fetchPost(url.getVersion, {
          params: {
            modelId: this.ruleForm.ModelId
          },
          Vue: this
        })
        .then(res => {
          if (res.result) {
            if (boolen) {
              if (this.$refs["ruleForm"]) {
                this.$refs["ruleForm"].resetFields();
              }
              this.ruleForm.version = "";
              this.options.list = [];
              this.ruleForm.findCond = [
                {
                  prop: "",
                  symbol: "",
                  value: ""
                }
              ];
              this.ruleForm.findCondJson = [];
            }
            this.options.version = res.model.map(v => {
              return {
                value: v.versionNo,
                label: "V " + v.versionNo
              };
            });
          } else {
            this.$message({
              type: "warning",
              message: res.message
            });
          }
        });
    },
    // 获取数据列
    getList() {
      this.$apis
        .fetchPost(url.getDataList, {
          params: {
            version: this.ruleForm.version,
            dataModelCode: this.ruleForm.modelCode
          },
          Vue: this
        })
        .then(res => {
          if (res.result) {
            this.options.list = res.model.list;
          } else {
            this.$message({
              type: "warning",
              message: res.message
            });
          }
        });
    },
    // 过滤规则设置
    ruleSetting() {
      this.$refs.filter.show();
    },
    // 预览数据
    previewData() {
      let arr = this.options.list
        .filter(v => v.isCheck == true)
        .map(v => v.alias);
      let sqlObj = {};
      if (this.findCondJson && this.findCondJson.length > 0) {
        sqlObj = { findCondList: this.findCondJson };
      }
      let param = {
        findList: arr,
        version: this.ruleForm.version,
        dataModelCode: this.ruleForm.modelCode,
        ...sqlObj
      };
      if (this.ruleForm.findcond) {
        param["findcond"] = this.ruleForm.findcond;
      }
      this.$apis
        .fetchPostJson(url.findSql, {
          params: param,
          Vue: this
        })
        .then(res => {
          if (res.result) {
            // console.log(this.options.list);
            let list = this.options.list
              .filter(v => v.isCheck == true)
              .map(v => {
                return {
                  prop: v.alias,
                  label: v.remark
                };
              });
            this.$refs.dataPreview.show(list, [...res.model]);
          } else {
            this.$message({
              type: "warning",
              message: res.message
            });
          }
        });
    },
    isDisabled() {
      if (this.options.list) {
        let arr = this.options.list.filter(v => v.isCheck == true);
        if (arr.length > 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }
};
</script>
<style lang="less">
.remote-data {
  .data-filter-content {
    width: 100%;
    min-height: 200px;
    overflow-y: auto;
    box-sizing: border-box;
    word-break: break-all;
    margin-bottom: 20px;
    padding: 5px 10px;
    border: 1px solid #d1d3d5;
    p {
      height: 24px;
      line-height: 24px;
    }
  }
}
</style>
