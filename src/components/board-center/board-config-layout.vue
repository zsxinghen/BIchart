/*
*看板中心--看版布局
*/
<template>
    <div class="custom-border">
        <board-toast :config="customConfig" @cancel="cancel" @save="save" @handleClose="customConfig.dialogVisible=false">
            <div style="text-align:center;margin-bottom:20px;">
                 <el-form :model="form" ref="ruleForm" label-width="100px" :rules="rules">
                     <el-form-item label="布局方案" prop="value">
                         <el-select v-model="form.value" style="width:100%" placeholder="请选择" size="medium" @change="handleChange">
                            <el-option-group
                            v-for="list in modellist"
                            :key="list.id"
                            :label="list.alias">
                            <el-option
                                v-for="item in list.layouts"
                                :key="item.id"
                                :label="item.alias"
                                :value="item.id">
                            </el-option>
                            </el-option-group>
                        </el-select>
                     </el-form-item>
                 </el-form>
            </div>
            <div class="show-box no-scroll">
                <super-layout 
                    :config="configData" 
                    ref="superLayout" 
                    :isToolbar="false" 
                    :tool="[]" 
                >
                </super-layout>
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
                value:'',
            },
            rules:{
                value:[{ required: true, message: '请选择布局方案', trigger: 'change' }]
            },
            configData: {
                layout: [
                
                ],
                rowHeight: 50,
                isDraggable: false,
                isResizable: false,
                line: 1
            },
            customConfig:{
                title: "布局设置", 
                dialogVisible: false, 
                width: "400px", 
                btnData: ["cancel", "save"],
                list:[]
            },
            modellist:[]
        }
    },
    props:['currentFile'],
    methods:{
        show(data){
            this.form={
                value:this.currentFile.layoutId,
            };
            this.$apis.fetchPost(urls.sideBar.search_layout, {
                params: {
                    id: this.currentFile.layoutId
                },
                Vue: this
            }).then(res => {
                if (res.result) {
                    if(res.model.config)
                        this.configData.layout=JSON.parse(res.model.config).layout
                    else
                        this.configData.layout=[]
                }
            });
            this.modellist=data;
            this.customConfig.dialogVisible=true
        },
        cancel(){
            this.customConfig.dialogVisible=false;
            this.$emit("close")
        },
        save(){
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    var obj={...this.currentFile}
                    var params={id:obj.id,layoutConfig:JSON.stringify(this.configData),layoutId:this.form.value}
                    this.$apis.fetchPost(borderUrls.sideBar.edit_layout, {
                        params: params,
                        Vue: this
                    }).then(res => {
                        if (res.result) {
                            this.customConfig.dialogVisible=false
                            this.$emit('layoutSuccess',params.layoutConfig)
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleChange(id){
            if(!id)
                return 
            this.$apis.fetchPost(urls.sideBar.search_layout, {
                params: {
                    id: id
                },
                Vue: this
            }).then(res => {
                if (res.result) {
                    if(res.model.config)
                        this.configData.layout=JSON.parse(res.model.config).layout
                    else
                        this.configData.layout=[]
                }
            });
        }
    },
    components:{
        superLayout
    }
}
</script>
<style lang="less">
    .custom-border{
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
        }
    }
</style>
