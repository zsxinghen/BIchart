/* 
 *侧边栏--新增
 */
<template>
    <board-toast :config="moveData" @cancel="close" @save="save">
         <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="布局名称" prop="name">
                    <el-col :span="20">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-col>
                </el-form-item>
         </el-form>
    </board-toast>
</template>
<script>
export default {
    data () {
        var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入布局名称'));
        } else {
           if(value === this.currData.name){
               return callback();
           } 
           let index = this.baseData.findIndex(item=>{
                return item.name === value;
            })
            if(index!==-1){
                return callback(new Error('改文件夹下已存在该名称'));
            }
          callback();
        }
      };
        return {
            moveData:{
                title:'修改布局名称',//弹窗标题
                dialogVisible:false,//弹窗显示
                width:'500px',//弹窗宽
                btnData:['cancel','save']
            },
            currData:{},
            baseData:[],
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ]},
            ruleForm: {
                name: ''
                }   
        }
    },
    methods:{
        show(baseData,data){
            console.log(baseData,data)
            this.currData = data;
            this.baseData = baseData;
            this.ruleForm.name = this.currData.name;
            this.moveData.dialogVisible = true;
        },
        close(){
            this.moveData.dialogVisible = false;
        },
        save(){
          this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    
                  this.currData.name = this.ruleForm.name;
                  this.close();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>
