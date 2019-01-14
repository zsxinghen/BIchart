/*
*看板中心--边框色
*/
<template>
  <board-toast :config="dialogConfig" @cancel="close" @save="save" v-if="dialogConfig.dialogVisible" class="board-config-background">
    <el-form :model="bgconfig" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="边框类型:" >
        <el-radio-group v-model="bgconfig.borderType" @change="initBorder">
          <el-radio label="default">默认</el-radio>
          <el-radio label="custom">自定义</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="边框颜色:" v-if="bgconfig.borderType=='custom'">
        <el-color-picker v-model="bgconfig.borderColor" show-alpha></el-color-picker>
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
        title: "背景设置", //弹窗标题
        dialogVisible: false, //弹窗显示
        width: "400px", //弹窗宽
        btnData: ["cancel", "save"]
      }
    };
  },
  props: {
    bgconfig: {
      type: Object,
      default: () => {
        return {
          type: "null"
        };
      }
    },
    currentFile: {
      type: Object
    }
  },
  mounted() {},

  methods: {
    initBorder() {
      this.bgconfig.borderColor = "rgba(0, 0, 0, 0.3)";
    },
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
      console.log(params.config);
      if (this.bgconfig.type == "null") {
        params.config.bgConfig = {
          opacticy: this.bgconfig.opacticy,
          type: this.bgconfig.type,
          borderColor: this.bgconfig.borderColor,
          borderType: this.bgconfig.borderType
        };
      } else if (this.bgconfig.type == "bgColor") {
        params.config.bgConfig = {
          opacticy: this.bgconfig.opacticy,
          type: this.bgconfig.type,
          color: this.bgconfig.color,
          borderColor: this.bgconfig.borderColor,
          borderType: this.bgconfig.borderType
        };
      } else {
        params.config.bgConfig = {
          opacticy: this.bgconfig.opacticy,
          type: this.bgconfig.type,
          imageUrl: this.bgconfig.imageUrl,
          borderColor: this.bgconfig.borderColor,
          borderType: this.bgconfig.borderType
        };
      }
      params.config = JSON.stringify(params.config);
      this.$apis
        .fetchPost(urls.sideBar.edit_layout, {
          params: params,
          Vue: this
        })
        .then(res => {
          if (res.result) {
            this.close();
            this.$emit("saveSuccess", params);
          }
        });
    }
  }
};
</script>
<style lang="less">
.board-config-background {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    top: 10px;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .el-form {
    margin-bottom: 20px;
  }
}
</style>
