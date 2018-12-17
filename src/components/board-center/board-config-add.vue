/* 
 *侧边栏--新增
 */
<template>
    <div>
        <board-toast :config="moveData"  @handleClose="moveData.dialogVisible=false">
            <div class="border-add-btn" @click="customClick">自定义看板</div>
            <div class="border-add-btn" @click="majorClick">专业化模板报表</div>
        </board-toast>
        <custom-border ref="customBorder" @close="close" :baseData="baseData" @addSuccess="addSuccess"></custom-border>
        <major-border ref="majorBorder" :baseData="baseData"  @close="close" @addSuccess="addSuccess"></major-border>
    </div>
</template>
<script>
import customBorder from './customBorder'
import majorBorder from './majorBorder'
import { default as urls } from "../../api/urls/layout-center.js";
import { default as chartUrls } from "../../api/urls/chart-center.js";
export default {
    data () {
        return {
            moveData:{
                title:'添加看板',//弹窗标题
                dialogVisible:false,//弹窗显示
                width:'500px',//弹窗宽
            },
            currData:{},
            baseData:[]
        }
    },
    methods:{
        show(baseData,data){
            console.log(baseData,data)
            this.currData = data;
            this.baseData = baseData;
            // this.ruleForm.name = this.currData.name;
            this.moveData.dialogVisible = true;
        },
        customClick(){
            console.log(urls)
            this.$apis.fetchPost(urls.sideBar.search, {
                params: {},
                Vue: this
            }).then(res => {
                if (res.result) {
                    this.moveData.dialogVisible=false
                    this.$refs.customBorder.show(res.model)
                }
            });
        },
        addSuccess(){
            this.moveData.dialogVisible=false
            this.$parent.filterData();
        },
        close(){
            this.moveData.dialogVisible=true
        },
        majorClick(){
            this.$apis.fetchPost(chartUrls.pageUrl, {
                params: {},
                Vue: this
            }).then(res => {
                if (res.result) {
                    console.log(res)
                    this.moveData.dialogVisible=false
                    this.$refs.majorBorder.show(res.model.items)
                }
            });
        }
    },
    components:{
        customBorder,
        majorBorder
    }
}
</script>
<style scoped>
    .border-add-btn{
        width: 100%;
        background: rgb(38, 155, 233);
        height: 42px;
        line-height: 42px;
        margin-bottom:15px;
        color:#fff;
        border-radius: 3px;
        text-align: center;
        cursor: pointer;
    }
    .border-add-btn:hover{
        opacity: .8;
    }
    .border-add-btn:focus{
        opacity: .8;
    }
</style>

