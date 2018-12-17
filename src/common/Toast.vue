      /* toastData:{
          title:'啦啦啦',//弹窗标题
          dialogVisible:true,//弹窗显示
          width:'600px',//弹窗宽
          btnData:[{
            name:'确定',//按钮名
            method:'dialogSuer',//回调函数
            bgColor:'dialog-bule'//按钮背景
          },{
            name:'确定并继续',
            method:'savaAgain',
            bgColor:'dialog-deep-blue'
          }]
      }*/
<template>
    <el-dialog class="poc-toast" :title="config.title" :visible.sync="config.dialogVisible" :close-on-click-modal="false" :append-to-body="config.appendToBody" :width="config.width" @close="callBack('handleClose')">
        <!-- 内容   主题内容自定义部分-->
        <slot></slot>
        <!-- 按钮组 -->
        <div class="btn-group" v-if="config.btnData&&config.btnData.length>0">
          <template v-for="item in config.btnData">
            <button size="mini" v-if="item==='sure'" class="dialog-bule" @click="callBack('sure')">{{$t("toastBtn.sure")}}</button>
             <button size="mini" v-else-if="item==='cancel'" class="dialog-white" @click="callBack('cancel')">{{$t("toastBtn.cancel")}}</button>
            <button size="mini" v-else-if="item==='close'" class="dialog-white" @click="callBack('close')">{{$t("toastBtn.close")}}</button>
            <button size="mini" v-else-if="item==='save'" class="dialog-bule" @click="callBack('save')">{{$t("toastBtn.save")}}</button>
            <button size="mini" v-else-if="item==='moveUp'" class="dialog-bule" @click="callBack('moveUp')">{{$t("toastBtn.moveUp")}}</button>
            <button size="mini" v-else-if="item==='moveDown'" class="dialog-bule" @click="callBack('moveDown')">{{$t("toastBtn.moveDown")}}</button>
          </template>
        </div>
    </el-dialog>
</template>
<script>
export default {
  props: ["config"],
  methods: {
    callBack(method) {
      this.$emit(method);
    }
  }
};
</script>
<style lang="less">
.poc-toast{

}
.dialog-bule,
.dialog-white {
  width: 80px;
  height: 36px;
  box-sizing: border-box;
  font-size: 14px;
  outline: none;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}
.dialog-white {
  background-color: white;
  color: #5c6466;
  border: 1px solid #cccdd0;
}
.dialog-bule {
  background-color: #267afc;
  color: #ffffff;
  margin-left: 36px;
}
.btn-group {
  float: left;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
}
.el-dialog__body {
  overflow: hidden;
  padding: 20px;
}
.el-dialog__header {
  border-bottom: 1px solid #efefef;
  padding: 10px 20px 5px;
}
.el-dialog__title {
  font-size: 16px;
  color: #2d3132;
}
.el-dialog__headerbtn{
  top:14px
}
</style>

