// 布局设置
<template>
  <div class="layout-setting">
    <div class="layout-setting-body">
      <div class="layout-setting-head">
        {{$t('layout.setting.title')}}
      </div>
      <!-- 行列设置 -->
      <div class="line-setting">
        <div class="line-setting-btn">
          <span>{{$t('layout.setting.theFirst')}}</span>
          {{line+1}}
          <span>{{$t('layout.setting.line')}}</span>
        </div>
        <div class="edit-line">
          <input v-model="fromData.span" v-number-input placeholder="请输入列数"></input>
        </div>
        <div class="line-setting-btn">
          <span>{{$t('layout.setting.column')}}</span>
        </div>
      </div>
      <!-- 列宽设置 -->
      <div class="line-setting">
        <div class="line-setting-btn">
          <span>{{$t('layout.setting.columnWidth')}}</span>
        </div>
        <div class="edit-line">
          <input v-model="fromData.width" placeholder="请按规程填写(50%,...)"></input>
        </div>
      </div>
      <!-- 保存 -->
      <!-- 添加 -->
      <div class="line-add">
           <el-button size="small" @click="addline">添加行</el-button>
      </div>
      <!-- <div class="line-save">
           <el-button type="primary" size="small" @click="save">保存</el-button>
      </div> -->
    </div>
  </div>
</template>
<script>
  export default {
    props:['line'],
    data() {
      return {
          fromData:{
            span:'',
            width:''
          }
      }
    },
    mounted() {

    },
    methods: {
       addline(){//添加行
          if(!this.fromData.span){
            this.setNotify('请输入列')
            return;
          }
          if(this.fromData.span>5){
            this.setNotify('每行列数不能超过5')
            return;
          }
          if(!this.fromData.width){
            this.setNotify('请输入列宽')
            return;
          }
          if(!/^(\d{1,3}%,{0,1}){1,5}$/.test(this.fromData.width)){
            this.setNotify('请检查列宽格式')
            return;
          }
          let data = this.ischenkData(this.fromData.width,this.fromData.span);
          if(!data){
            this.setNotify('您输入的数值不合理，请重新输入');
            return
          }
          this.$emit('addline',data);
          this.$emit('save')
       },
       setNotify(msg){
          this.$notify({
            title: '友情提示',
            message: msg,
            type: 'warning',
            duration:1500
          });
       },
       ischenkData(width,span){
        let data = width.replace(/(?:(\d{1,3})%,{0,1})/g,'$1,').split(',');
        let all = 0;
        let _data = [];
             data.forEach(item=>{
                if(item){
                  all += item-0;
                  _data.push(item-0);
                }
             }) 
        let diffe =  span-_data.length;
        if((all<=100&&diffe===0)||(all<100&&(100-all)/diffe>1)){
            return {
              all,
              ws:_data,
              span:span-0
            }
        }else{
          return false
        }     
       },
      //  save() {
      //    console.log(111)
      //   this.$emit('save')
      // }
    }
  }

</script>
<style lang="less">
  .layout-setting {
    width: 300px;
    padding: 10px 10px 0;
    height: 100%;
    box-sizing: border-box;

    .layout-setting-body {
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0px 2px 5px 0px rgba(24, 27, 45, 0.14);
      height: 100%;
      box-sizing: border-box;

      .layout-setting-head {
        color: #91929F;
        font-size: 14px;
      }

      .line-setting {
        display: flex;
        border: 1px solid #91929F;
        justify-content: space-between;
        margin-top: 10px;
      }
    }

    .edit-line {
      flex: 1;
      input {
        width: 100%;
        border: none;
        outline: none;
        padding: 3px 8px;
        box-sizing: border-box;
      }
    }

    .line-setting-btn {
      font-size: 12px;
      color: #91929F;
      line-height: 26px;
      width: 60px;
      text-align: center;
      box-sizing: border-box;
      &:last-child {
        border-left: 1px solid #91929F;
      }

      &:first-child {
        border-right: 1px solid #91929F;
      }
    }

    .line-add,.line-save{
      margin-top: 10px;
      .el-button{
        width: 100%;
      }
    }

  }

</style>
