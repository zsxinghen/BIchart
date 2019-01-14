<template>
    <div class="major-border">
        <div class="major-header">
            <el-input placeholder="请输入内容" v-model="value" class="input-with-select" style="width:500px">
                <el-button slot="append" icon="el-icon-search" @click="getList()"></el-button>
            </el-input>
            <el-button class="uploadBtn" type="primary" @click="upload">上传报表</el-button>
        </div>
        <div class="major-main">
            <el-row :gutter="20">
                <el-col class="flame-box" v-for="item in list" :span="6">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>{{item.alias}}</span>
                        </div>
                        <div class="flame-box-con">
                            <img :src="item.pic" alt="">
                        </div>
                    </el-card>
                    <!-- <div>
                    
                    </div> -->
                    <span class="cover">
                        <span class="preview" @click="handlePictureCardPreview(item.pic)">
                            <i class="el-icon-zoom-in"></i>
                        </span>
                        <span class="delete" @click="handleRemove(item.id)">
                            <i class="el-icon-delete"></i>
                        </span>
                    </span>
                </el-col>
            </el-row>
        </div>
        <board-toast :config="config" @save="submitUpload" @cancel="config.dialogVisible=false"  @handleClose="config.dialogVisible=false">
             <el-form :model="form" ref="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
                <el-form-item label="模板名称" prop="alias">
                    <el-input v-model="form.alias" placeholder="" style="width:220px"></el-input>
                </el-form-item>
                <el-form-item label="模板文件" prop="templatePath">
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        :on-success="handleSuccess"
                        :limit="1"
                        action="http://122.225.78.66:8899/fileSystem/uploadFile"
                        :auto-upload="false"
                        >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
                        <div slot="tip" class="el-upload__tip">请上传zip文件，且必须包含html文件与图片</div>
                    </el-upload>
                </el-form-item>
             </el-form>
        </board-toast>
        <el-dialog :visible.sync="dialogVisible" title="查看详情">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
import { default as urls } from "../../api/urls/major-border.js";
export default {
    data(){
        return{
            value:'',
            list:[],
            config:{
                title:'专业看板维护',//弹窗标题
                dialogVisible:false,//弹窗显示
                width:'500px',//弹窗宽
                btnData: ["cancel", "save"]
            },
            rules:{
                alias:[
                    { required: true, message: '请输入模板名称', trigger: 'blur' }
                ]
            },
            form:{
                alias:'',
                templatePath:''
            },
            dialogVisible:false,
            dialogImageUrl:''
        }
    },
    mounted(){
        this.getList()
    },
    methods:{
        getList(){
            this.$apis.fetchPost(urls.pageUrl, {
                params: {
                    alias:this.value
                },
                Vue: this
            }).then(res => {
                if (res.result) {
                    this.list=res.model.items
                }
            });
        },
        submitUpload(){
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.$refs.upload.submit();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        upload(){
            this.config.dialogVisible=true
        },
        handleSuccess(res){
            this.form.templatePath=res.fileUrl;
            this.$apis.fetchPost(urls.addTemplateUrl, {
                params: {
                    ...this.form
                },
                Vue: this
            }).then(res => {
                if (res.result) {
                    this.getList()
                    this.config.dialogVisible=false;
                    this.$refs.upload.clearFiles()
                }
            });
        },
        handlePictureCardPreview(url) {
            this.dialogImageUrl =url;
            this.dialogVisible = true;
        },
        handleRemove(id){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$apis.fetchPost(urls.delUrl, {
                    params: {
                       id:id
                    },
                    Vue: this
                }).then(res => {
                    if (res.result) {
                        this.getList()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
    }
}
</script>

<style lang="less">
    .major-border{
        .major-header{
            text-align: center;
            line-height: 100px;
            height: 100px;
            position: relative;
            .uploadBtn{
                position: absolute;
                right:10px;
                top: 25px;
            }
        }
        .major-main{
            width:1200px;
            margin:20px auto;
            .flame-box{
                box-sizing: border-box;
                .flame-box-con{
                    height: 250px;
                    position: relative;
                    img{
                        width: 100%;
                        position: absolute;
                        top: 50%;
                        transform: translate(0,-50%)
                    }
                }
                
                position: relative;
                overflow: hidden;
                &:hover .cover{
                    opacity: 1;
                    span{
                        display: inline-block;
                    }
                }
                .cover{
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    cursor: default;
                    text-align: center;
                    color: #fff;
                    opacity: 0;
                    font-size: 20px;
                    background-color: rgba(0,0,0,.5);
                    transition: opacity .3s;
                    line-height: 350px;
                    .preview{
                        display: none;
                        cursor: pointer;
                    }
                    .delete{
                        position: static;
                        font-size: inherit;
                        color: inherit;
                        margin-left: 15px; 
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>

