/*
*看板中心--标题配置
*/
<template>
  <board-toast :config="dialogConfig" @cancel="close" @save="save" v-if="dialogConfig.dialogVisible" class="board-title-config">
    <el-form :model="titleConfig" ref="ruleForm" label-width="100px" class="demo-ruleForm" size="samll">
      <h1>主标题</h1>
      <el-form-item label="标题:">
        <el-col :span="20">
          <el-input v-model.trim="titleConfig.title.text" size="mini"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="字号:">
        <el-col :span="20">
          <el-select v-model="titleConfig.title.fontsize" placeholder="请选择" size="mini">
            <el-option v-for="item in option.fontSize" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="字体:">
        <el-col :span="20">
          <el-select v-model="titleConfig.title.fontFamily" size="mini" placeholder="请选择">
            <el-option v-for="(item,index) in options" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="字体颜色:">
        <el-col :span="20">
          <el-color-picker v-model="titleConfig.title.color" size="mini" show-alpha></el-color-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="位置:">
        <el-col :span="20">
          <el-radio-group v-model="titleConfig.title.position" size="mini">
            <el-radio label="left">左对齐</el-radio>
            <el-radio label="center">居中</el-radio>
            <el-radio label="right">右对齐</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="是否显示:">
        <el-col :span="20">
          <el-checkbox v-model="titleConfig.title.isShow">显示</el-checkbox>
        </el-col>
      </el-form-item> -->
      <h1>副标题</h1>
      <el-form-item label="标题:">
        <el-col :span="20">
          <el-input v-model.trim="titleConfig.subTitle.text" size="mini"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="字号:">
        <el-col :span="20">
          <el-select v-model="titleConfig.subTitle.fontsize" placeholder="请选择" size="mini">
            <el-option v-for="item in option.fontSize" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="字体:">
        <el-col :span="20">
          <el-select v-model="titleConfig.subTitle.fontFamily" size="mini" placeholder="请选择">
            <el-option v-for="(item,index) in options" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="字体颜色:">
        <el-col :span="20">
          <el-color-picker v-model="titleConfig.subTitle.color" size="mini" show-alpha></el-color-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="位置:">
        <el-col :span="20">
          <el-radio-group v-model="titleConfig.subTitle.position" size="mini">
            <el-radio label="left">左对齐</el-radio>
            <el-radio label="center">居中</el-radio>
            <el-radio label="right">右对齐</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="是否显示:">
        <el-col :span="20">
          <el-checkbox v-model="titleConfig.subTitle.isShow">显示</el-checkbox>
        </el-col>
      </el-form-item> -->
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
      options: ["FangSong", "Microsoft JhengHei", "SimHei", "	SimSun"],
      option: {
        fontSize: [
          {
            name: "12px",
            value: 12
          },
          {
            name: "14px",
            value: 14
          },
          {
            name: "16px",
            value: 16
          },
          {
            name: "18px",
            value: 18
          },
          {
            name: "20px",
            value: 20
          },
          {
            name: "22px",
            value: 22
          },
          {
            name: "24px",
            value: 24
          },
          {
            name: "26px",
            value: 26
          },
          {
            name: "28px",
            value: 28
          },
          {
            name: "30px",
            value: 30
          },
          {
            name: "35px",
            value: 35
          },
          {
            name: "40px",
            value: 40
          },
          {
            name: "45px",
            value: 45
          },
          {
            name: "50px",
            value: 50
          }
        ]
      }
    };
  },
  props: {
    titleConfig: {
      type: Object,
      default: () => {
        return {};
      }
    },
    currentFile: {
      require: true
    }
  },
  mounted() {},
  methods: {
    show() {
      this.dialogConfig.dialogVisible = true;
    },
    close() {
      this.dialogConfig.dialogVisible = false;
    },
    save() {
      var obj = { ...this.currentFile };
      var params = {
        id: obj.id,
        config: obj.config
      };
      params.config = JSON.parse(params.config);
      params.config.titleConfig = this.titleConfig;
      params.config = JSON.stringify(params.config);
      console.log(params);
      this.$apis
        .fetchPost(urls.sideBar.edit_layout, {
          params: params,
          Vue: this
        })
        .then(res => {
          if (res.result) {
            this.close();
            this.$emit("titleSuccess", params);
          }
        });
    }
  }
};
</script>
<style lang="less">
.board-title-config {
  .el-form-item {
    margin-bottom: 0px;
  }

  .el-color-picker--mini {
    vertical-align: middle;
  }

  h1 {
    margin-left: 25px;
    margin-bottom: 10px;
    font-size: 18px;
  }

  h1:before {
    content: " ";
    border: 2px solid #000;
    margin-right: 10px;
  }

  .el-form {
    margin-bottom: 20px;
  }
}
</style>
