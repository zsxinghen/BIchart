/*
*看板中心--标题配置
*/
<template>
  <board-toast :config="dialogConfig" @cancel="close" @save="save" v-if="dialogConfig.dialogVisible">
    <el-form :model="titleConfig" ref="ruleForm" label-width="100px" class="demo-ruleForm" size="samll">
      <h1>主标题</h1>
      <el-form-item label="标题">
        <el-col :span="20">
          <el-input v-model.trim="titleConfig.title.text" ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="字号">
        <el-col :span="20">
          <el-input-number v-model="titleConfig.title.fontsize"  controls-position="right" :controls="false" :max="32" :min="12"></el-input-number>&nbsp;&nbsp;px
        </el-col>
      </el-form-item>
      <el-form-item label="字体">
        <el-col :span="20">
          <el-select v-model="titleConfig.title.fontFamily" placeholder="请选择">
            <el-option v-for="(item,index) in options" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="字体颜色">
        <el-col :span="20">
          <el-color-picker v-model="titleConfig.title.color" show-alpha></el-color-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="位置">
        <el-col :span="20">
          <el-radio-group v-model="titleConfig.title.position">
            <el-radio label="left">左对齐</el-radio>
            <el-radio label="center">居中</el-radio>
            <el-radio label="right">右对齐</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item label="是否显示">
        <el-col :span="20">
          <el-checkbox v-model="titleConfig.title.isShow">显示</el-checkbox>
        </el-col>
      </el-form-item>
      <h1>副标题</h1>
      <el-form-item label="标题">
        <el-col :span="20">
          <el-input v-model.trim="titleConfig.subTitle.text" ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="字号">
        <el-col :span="20">
          <el-input-number v-model="titleConfig.subTitle.fontsize"  controls-position="right" :controls="false" :max="32" :min="12"></el-input-number>&nbsp;&nbsp;px
        </el-col>
      </el-form-item>
      <el-form-item label="字体">
        <el-col :span="20">
          <el-select v-model="titleConfig.subTitle.fontFamily" placeholder="请选择">
            <el-option v-for="(item,index) in options" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="字体颜色">
        <el-col :span="20">
          <el-color-picker v-model="titleConfig.subTitle.color" show-alpha></el-color-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="位置">
        <el-col :span="20">
          <el-radio-group v-model="titleConfig.subTitle.position">
            <el-radio label="left">左对齐</el-radio>
            <el-radio label="center">居中</el-radio>
            <el-radio label="right">右对齐</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item label="是否显示">
        <el-col :span="20">
          <el-checkbox v-model="titleConfig.subTitle.isShow">显示</el-checkbox>
        </el-col>
      </el-form-item>
    </el-form>
  </board-toast>
</template>
<script>
import { default as urls } from "../../api/urls/board-center.js";
export default {
  data() {
    return {
      dialogConfig: {
        title: "标题设置", //弹窗标题
        dialogVisible: false, //弹窗显示
        width: "500px", //弹窗宽
        btnData: ["cancel", "save"]
      },
      options:['FangSong','Microsoft JhengHei','SimHei','	SimSun']
    };
  },
  props: {
    titleConfig: {
      type: Object,
      default: () => {
        return{}
      }
    },
    currentFile:{
      require:true
    }
  },
  mounted() {
      
  },
  methods: {
    show() {
      this.dialogConfig.dialogVisible = true;
    },
    close() {
      this.dialogConfig.dialogVisible = false;
    },
    save() {
      var obj={...this.currentFile}
      var params={id:obj.id,config:obj.config}
      params.config= JSON.parse(params.config)
      params.config.titleConfig=this.titleConfig
      params.config=JSON.stringify(params.config)
       console.log(params)
      this.$apis.fetchPost(urls.sideBar.edit_layout, {
        params: params,
        Vue: this
      }).then(res => {
        if (res.result) {
            this.close()
            this.$emit('titleSuccess',params)
        }
      });
    }
  }
};
</script>
