<template>
  <board-toast :config="dialogConfig" @cancel="close" @save="save" class="update-setting">
    <el-form :model="updateSet" style="padding-left:100px;margin-bottom:20px">
      <el-form-item label="更新方式:">
        <el-radio v-model="updateSet.updateWay" label="no">不更新</el-radio>
        <el-radio v-model="updateSet.updateWay" label="nomal">普通更新</el-radio>
        <el-radio v-model="updateSet.updateWay" label="timing">定时更新</el-radio>
      </el-form-item>
      <el-form-item label="更新频率:" v-show="updateSet.updateWay=='nomal'">
        <!-- 5秒到1天范围 -->
        <el-input-number v-model="updateSet.rate" size="mini" controls-position="right" :controls="false" :min="5" :max="86400"></el-input-number>&nbsp;&nbsp;秒
      </el-form-item>
      <el-form-item label="更新时间:" v-show="updateSet.updateWay=='timing'">
        <el-time-picker v-model="updateSet.time" value-format='HH:mm:ss' size="mini" placeholder="任意时间点">
        </el-time-picker>
      </el-form-item>
    </el-form>
  </board-toast>
</template>
<script>
export default {
  data() {
    return {
      dialogConfig: {
        title: "更新配置", //弹窗标题
        dialogVisible: false, //弹窗显示
        width: "600px", //弹窗宽
        btnData: ["cancel", "save"]
      },
      updateSet: {
        updateWay: "no"
      }
    };
  },
  props:['config'],
  methods: {
    show() {
      // 初始化数据
      //   this.ruleForm = JSON.parse(JSON.stringify(this.dataConfig));
      if (this.config.updateSet) {
        this.updateSet = JSON.parse(JSON.stringify(this.config.updateSet));
      }
      this.dialogConfig.dialogVisible = true;
    },
    close() {
      this.dialogConfig.dialogVisible = false;
    },
    save() {
      this.config.updateSet = JSON.parse(JSON.stringify(this.updateSet));
      this.dialogConfig.dialogVisible = false;
    }
  }
};
</script>
<style lang="less">
.update-setting {
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>

