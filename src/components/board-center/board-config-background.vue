/*
*看板中心--背景
*/
<template>
  <board-toast :config="dialogConfig" @cancel="close" @save="save" v-if="dialogConfig.dialogVisible" class="board-config-background">
    <el-form :model="bgconfig" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="背景设置:">
        <el-radio-group v-model="bgconfig.type">
          <el-radio label="null">无</el-radio>
          <el-radio label="bgColor">背景色</el-radio>
          <el-radio label="bgImage">背景图</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="bgconfig.type!='null'">
        <!-- <el-form-item label="透明度:" v-show="bgconfig.type=='bgColor'">
          <el-slider v-model="bgconfig.opacticy" :max="1" style="width:90%" :step="0.1">
          </el-slider>
        </el-form-item> -->
        <el-form-item label="背景色:" v-show="bgconfig.type=='bgColor'">
          <el-color-picker v-model="bgconfig.color" show-alpha></el-color-picker>
        </el-form-item>
        <el-form-item label="背景图:" v-show="bgconfig.type=='bgImage'">
          <el-upload class="avatar-uploader" action="http://122.225.78.66:8899/fileSystem/uploadFile" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="bgconfig.imageUrl" :src="bgconfig.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </div>
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
    show() {
      this.dialogConfig.dialogVisible = true;
    },
    close() {
      this.dialogConfig.dialogVisible = false;
    },
    handleAvatarSuccess(res, file) {
      console.log(res);
      this.$set(this.bgconfig, "imageUrl", res.fileUrl);
      // this.bgconfig.imageUrl = res.fileUrl
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传背景图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传背景图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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
          type: this.bgconfig.type
        };
      } else if (this.bgconfig.type == "bgColor") {
        params.config.bgConfig = {
          opacticy: this.bgconfig.opacticy,
          type: this.bgconfig.type,
          color: this.bgconfig.color
        };
      } else {
        params.config.bgConfig = {
          opacticy: this.bgconfig.opacticy,
          type: this.bgconfig.type,
          imageUrl: this.bgconfig.imageUrl
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
