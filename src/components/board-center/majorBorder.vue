/*
*看板中心--专业模版新增
*/
<template>
    <div class="major-border">
        <board-toast :config="customConfig" @cancel="cancel" @save="save" @handleClose="customConfig.dialogVisible=false">
            <div style="text-align:center;margin-bottom:20px;">
                 <el-form :model="form" ref="ruleForm" label-width="100px" :rules="rules">
                     <el-form-item label="看板名称" prop="name">
                         <el-input v-model="form.name" placeholder="请输入看板名称"></el-input>
                     </el-form-item>
                     <el-form-item label="专业模板" prop="value">
                         <el-select v-model="form.value" style="width:100%" placeholder="请选择" size="medium" @change="handleChange">
                            <el-option
                                v-for="item in modellist"
                                :key="item.id"
                                :label="item.alias"
                                :value="item.id">
                            </el-option>
                        </el-select>
                     </el-form-item>
                 </el-form>
            </div>
            <div class="show-box no-scroll">
                <img :src="currentTemUrl" />
            </div>
        </board-toast>
    </div>
</template>
<script>
import { default as urls } from "../../api/urls/layout-center.js";
import { default as borderUrls } from "../../api/urls/board-center.js";
import superLayout from '../../common/superLayout.vue'
export default {
    data(){
        return {
            form:{
                name:'',
                value:'',
            },
            rules:{
                name:[{ required: true, message: '请选输入看板名称', trigger: 'blur' }],
                value:[{ required: true, message: '请选择模板方案', trigger: 'change' }]
            },
            customConfig:{
                title: "看板设置", 
                dialogVisible: false, 
                width: "400px", 
                btnData: ["cancel", "save"],
                list:[]
            },
            modellist:[],
            currentTemUrl:''
        }
    },
    props:['baseData'],
    methods:{
        show(data){
            this.form={
                name:'',
                value:'',
            };
            console.log(data)
            this.modellist=data;
            this.customConfig.dialogVisible=true
        },
        cancel(){
            this.customConfig.dialogVisible=false;
            this.$emit("close")
        },
        save(){
            console.log('1111')
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.$apis.fetchPost(borderUrls.sideBar.add_layout, {
                        params: {
                            templateId:this.form.value,
                            alias:this.form.name,
                            reportType:'专业模板',
                            folderId:this.baseData.id,
                            templateUrl:this.form.templateUrl
                        },
                        Vue: this
                    }).then(res => {
                        if (res.result) {
                            this.customConfig.dialogVisible=false;
                            this.$emit('addSuccess')
                            this.$message({
                                type: "success",
                                message: res.message
                            });
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleChange(id){
            if(!id){
                this.currentTemUrl=''
                this.form.templateUrl=''
                return false
            }
                
            var index=this.modellist.findIndex(val=>val.id==id)
            console.log(this.modellist[index])
            this.form.templateUrl=this.modellist[index].templatePath;
            this.currentTemUrl=this.modellist[index].pic
        }
    },
    components:{
        superLayout
    }
}
</script>
<style lang="less">
    .major-border{
        .el-input__inner{
            border: none;
            border-bottom: 1px solid #c0c4cc;
            border-radius: 0px;
        }
        .show-box{
            width: 100%;
            height: 200px;
            overflow: auto;
            border:1px solid #c0c4cc;
            margin: 20px 0;
            position: relative;
            img{
                width: 100%;
                position: absolute;
                top: 50%;
                transform: translate(0,-50%)
            }
        }
    }
</style>
