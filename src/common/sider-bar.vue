<template>
  <div class="sider-bar">
    <div class="sider-bar-body">
      <div class="sider-bar-head">
        <div class="sbh-title">
          {{title}}
        </div>
        <div class="sbh-operation">
          <el-input placeholder="请输入内容" v-model.trim="searchData" v-show="isSearch" @blur="searchEnterFun($event,'blur')"
            @keyup.enter.native="searchEnterFun($event,'keyup')" size="mini" style="width:100px">
          </el-input>
          <i class="iconfont icon-chaxun" @click="isSearch=!isSearch"></i>
          <i class="iconfont icon-xinzeng-" @click="addFile"></i>
          <slot></slot>
        </div>
      </div>
      <!-- 文件夹 -->
      <div class="sider-bar-empty" v-if="!sidbarData.length">{{emptyText}}</div>
      <div class="sider-bar-list" v-show="sidbarData.length">
        <div class="sbl-item" v-for="(data,index) in sidbarData" :key="data.id" @dragover.prevent @drop.prevent="dragend($event,data)"
          @dragenter.prevent="dragenter($event,data)" @dragleave.prevent="dragleave($event,data)">
          <div class="sbl-item-header">
            <div class="sbl-l-item-left" @click="setOpenState(data,index)">
              <i :class="setFileIcon(data)"></i>
              <span>{{data.alias}}</span>
            </div>
            <div class="sbl-l-item-right" v-show="openIndex==index&&data.isOpen" @click="operation($event,data,data,'file',data.id)">
              <i class="iconfont icon-xinzeng"></i>
              <i class="iconfont icon-bianji"></i>
              <i class="iconfont icon-shanchu"></i>
            </div>
          </div>
          <!-- 看板 -->
          <div class="sbl-items-list" v-show="data.isOpen">
            <div class="sbl-l-item" v-for="(item,$index) in data[prop.children]" :key="item.id" :class="{'active-bar':activeBar.id===item.id}"
              @drop.prevent="dragend($event,data,item)" @dragleave.prevent="dragleave($event,data,item,$index)"
              @dragenter.prevent="dragenter($event,data,item)">
              <div class="sbl-l-item-left" @click="setActiveBar(item)" draggable="true" @dragstart="dragstart($event,item,data)">
                <i class="iconfont icon-kanbanmiaoshu"></i>
                <span :title="item.alias">{{item.alias}}</span>
              </div>
              <div class="sbl-l-item-right" v-show="item.isActive" @click="operation($event,data.layouts,item,'',data.id)">
                <i class="iconfont icon-bianji"></i>
                <i class="iconfont icon-fuzhi"></i>
                <i class="iconfont icon-shanchu"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 布局相关 -->
    <layout-add-file ref="layoutAddFile" :title="title"></layout-add-file>
    <layout-add ref="layoutAdd"></layout-add>
    <layout-eidt ref="layoutEidt" :title="title"></layout-eidt>
    <board-add ref="boardAdd"></board-add>
  </div>
</template>
<script>
import layoutAddFile from "../components/sidebar/layout-addFile";
import layoutEidt from "../components/sidebar/layout-eidt";
import layoutAdd from "../components/sidebar/layout-add";
import boardAdd from "../components/board-center/board-config-add";
export default {
  data() {
    return {
      isSearch: false,
      searchData: "",
      openIndex: -1, //默认展开参数
      activeBar: {
        // isActive: false, //看板是否选中，
        // isOpen: false //文件夹是否展开
      },
      dragNode: {
        // 拖拽节点
        dragParentId: null, // 被拖拽父节点id
        dragData: null, //被拖拽点数据,
        lastParentId: null, // 拖拽经过的上一个节点
        dragParentNode: null // 被拖拽父节点
      },
      sidbarData: [
       
      ],
      emptyText: "暂无数据"
    };
  },
  props: {
    title: {
      type: String,
      default: () => "",
      require: false
    },
    urls: {
      type: Object,
      default: () => {},
      require: true
    },
    currentNode: {
      type: Object,
      default: () => {
        return{}
      },
      require: true
    },
    configData: {
      type: Object,
      default: () => {},
      require: true
    },
    prop:{
      default(){
        return {
          children:'layouts'
        }
      }
    }
  },

  mounted() {
    this.filterData();
  },
  methods: {
    /*
     *文件夹图标切换
     */
    setFileIcon(data) {
      return [
        {
          "iconfont icon-wenjianjia": data.isOpen == false || !data.isOpen,
          "iconfont icon-wenjianjia-zhankai": data.isOpen == true
        }
      ];
    },
    /*
     *isOpen  文件夹开关参数
     */
    setOpenState(data, index) {
      this.openIndex = index;
      if (data.isOpen) {
        this.$set(data, "isOpen", false);
      } else {
        this.$set(data, "isOpen", true);
      }
    },
    /*
     *isActive  看板选中参数
     */
    setActiveBar(data) {
      this.$set(this.activeBar, "isActive", false);
      this.activeBar = data;
      this.$set(data, "isActive", true);
      this.getDesign(data);
      this.$emit('currentChange',data)
    },
    /*
     *获取该文件夹详情
     */
    getDesign(data) {
        console.log(data,'------')
        this.$apis.fetchPost(this.urls.sideBar.search_layout, {
          params: {
            id: data.id
          },
          Vue: this
        }).then(res => {
          if (res.result) {
            console.log(res.model)
            
              if (this.title == "布局库") {
                this.$set(data, 'config', res.model.config);
                if (res.model.config) {
                  this.$set(this.currentNode,"config",JSON.parse(res.model.config));
                  this.configData.line = this.currentNode.config.line;
                  this.configData.layout = this.currentNode.config.layout;
                } else {
                  this.configData.line = 0;
                  this.configData.layout = [];
                }
              }else{
                if(data.reportType=='自定义'){
                  this.$set(data, 'layoutConfig', res.model.layoutConfig);
                  this.$set(data,'layoutId',res.model.layoutId)
                  this.configData.layout =JSON.parse(res.model.layoutConfig).layout;
                  if(res.model.config){
                    this.$set(data, 'config', res.model.config);
                    if(JSON.parse(res.model.config).bgConfig){
                      this.configData.bgConfig=JSON.parse(res.model.config).bgConfig
                    }else{
                      this.configData.bgConfig={
                        type:'null',
                        opacticy:1
                      }
                    }
                    if(JSON.parse(res.model.config).titleConfig){
                      this.configData.titleConfig=JSON.parse(res.model.config).titleConfig
                    }else{
                      this.configData.titleConfig={
                        title:{},
                        subTitle:{}
                      }
                    }
                  }else{
                    this.$set(data, 'config', JSON.stringify(
                        {
                          bgConfig:
                        {
                          type:'null',
                          opacticy:1
                        },
                        titleConfig:
                        {
                          title:{},
                          subTitle:{}
                        }
                      }));
                    this.configData.bgConfig={
                      type:'null',
                      opacticy:1
                    }
                    this.configData.titleConfig={
                      title:{},
                      subTitle:{}
                    }
                  }
                }else{
                  this.$set(data,'unzipPath',res.model.unzipPath)
                }
              }
              // 设置节点
              this.$set(this.currentNode, "alias", res.model.alias);
              this.$set(this.currentNode, "id", res.model.id);
              this.$set(this.currentNode, "folderId", res.model.folderId);
            
          }
        });
      
    },
    /*
     *按钮操作
     */
    operation($event, parent, data, type = "", id = -1) {
      let key = $event.target.classList[1];
      switch (key) {
        case "icon-xinzeng": //新增
          this.add(parent, data, id);
          break;
        case "icon-bianji": //编辑
          if (type) {
            this.editFile(parent, data);
          } else {
            this.edit(parent, data, id);
          }

          break;
        case "icon-fuzhi": //复制
          this.copy(data, id);
          break;
        case "icon-shanchu": //删除
          if (type) {
            this.remove(data.id, this.urls.sideBar.del_File);
          } else {
            this.remove(data.id, this.urls.sideBar.del_layout);
          }
          break;
        default:
          //不知道干嘛
          break;
      }
    },
    /*
     * 查询事件
     */
    searchEnterFun(e, type) {
      if (type == "blur") {
        //失去焦点
        this.filterData();
      } else {
        //当回车键按下
        var keyCode = window.event ? e.keyCode : e.which;
        if (keyCode == 13) {
          this.filterData();
        }
      }
    },
    /*
     * 布局中心-看板中心
     * 列表查询
     */
    filterData() {
      let param = this.searchData
        ? {
            alias: this.searchData
          }
        : {};
      this.emptyText = this.searchData ? "木有查到您需要的数据" : "暂无数据";

      this.$apis.fetchPost(this.urls.sideBar.search, {
        params: param,
        Vue: this
      }).then(res => {
        if (res.result) {
          let oldStatus = JSON.parse(JSON.stringify(this.sidbarData));

          res.model.forEach((val, i) => {
            let index = oldStatus.findIndex(v => v.id == val.id);
            if (index != -1) {
              res.model[i].isOpen = oldStatus[index].isOpen;
            }
          }); //设置文件夹查询之前开关状态
          this.sidbarData = res.model;
        } else {
          this.$message({
            type: "warning",
            message: res.message
          });
        }
      });
    },
    /*
     * 布局中心-看板中心
     * 文件夹 新增操作
     */
    addFile() {
      this.$refs.layoutAddFile.show(
        this.sidbarData,
        this.urls.sideBar.add_File
      );
    },
    /*
     * 布局中心-看板中心
     * 布局（看板） 新增操作
     */
    add(baseData, data, id) {
      if (this.title == "布局库") {
        this.$refs.layoutAdd.show(baseData, this.urls.sideBar.add_layout, id);
      } else {
        this.$refs.boardAdd.show(baseData, this.urls.sideBar.add_layout, id);
      }
    },
    /*
     * 布局中心-看板中心
     * 文件夹 编辑操作
     */
    editFile(baseData, data) {
      this.$refs.layoutEidt.show(baseData, this.urls.sideBar.edit_File, data);
    },
    /*
     * 布局中心-看板中心
     * 布局（看板） 编辑操作
     */
    edit(baseData, data, id) {
      this.$refs.layoutEidt.show(
        baseData,
        this.urls.sideBar.edit_layout,
        data,
        "编辑",
        id
      );
    },
    /*
     * 布局中心-看板中心
     * 布局（看板） 复制操作
     */
    copy(data, folderId) {
      var param={}
      if (this.title == "布局库") {
        param={
          alias: data.alias,
          folderId: folderId,
          config: data.config
        }
      }else{
        param={
          alias: data.alias,
          folderId: folderId,
          layoutId: data.layoutId,
          reportType:'自定义',
        }
      }
      this.$confirm("您正在进行复制操作，确定继续吗？")
        .then(_ => {
          this.$apis
            .fetchPost(this.urls.sideBar.add_layout, {
              params: param,
              Vue: this
            })
            .then(res => {
              if (res.result) {
                this.filterData();
                this.$message({
                  type: "success",
                  message: res.message
                });
              } else {
                this.$message({
                  type: "warning",
                  message: res.message
                });
              }
            });
        })
        .catch(_ => {});
    },
    /*
     * 布局中心-看板中心
     * 文件夹与布局（看板） 删除操作
     */
    remove(id, url) {
      this.$confirm("删除操作不可逆，确定删除吗？")
        .then(_ => {
          this.$apis
            .fetchPost(url, {
              params: {
                id: id
              },
              Vue: this
            })
            .then(res => {
              if (res.result) {
                this.configData.layout=[]
                this.$message({
                  type: "success",
                  message: res.message
                });
                this.filterData();
              } else {
                this.$message({
                  type: "warning",
                  message: res.message
                });
              }
            });
        })
        .catch(_ => {});
    },
    /*
     * 布局中心-看板中心
     * 文件夹与布局（看板） 移位保存操作
     */
    adjust(folderId, index) {
      console.log("插入的序号：" + index);
      let param = {
        id: this.dragNode.dragData.id,
        folderId: folderId,
        alias: this.dragNode.dragData.alias,
        config: this.dragNode.dragData.config
      };
      this.$apis
        .fetchPost(this.urls.sideBar.edit_layout, {
          params: param,
          Vue: this
        })
        .then(res => {
          if (res.result) {
            this.$message({
              type: "success",
              message: res.message
            });
            this.filterData();
          } else {
            this.$message({
              type: "warning",
              message: res.message
            });
          }
        });
    },
    /*
     *拖拽操作，默认只能拖拽看板节点到其他文件夹
     */
    dragstart(e, node, parent) {
      this.dragNode = {
        dragData: node, //保存被拖拽节点数据与父文件夹
        dragParentId: parent.id,
        lastParentId: parent.id,
        dragParentNode: parent
      };
    },
    // 拖拽进入中
    dragenter(e, parent, node) {
      if (
        e.target.className == "sbl-item-header" ||
        e.target.className == "sbl-l-item"
      ) {
        e.target.style["border-bottom"] = "1px solid #409eff"; //目标节点边框底色变色
      }
      if (this.dragNode.lastParentId != parent.id) {
        this.$set(parent, "isOpen", true); //展开文件夹
      }
    },
    // 拖拽离开目标节点
    dragleave(e, parent, node, $index) {
      if (
        e.target.className == "sbl-item-header" ||
        e.target.className == "sbl-l-item"
      ) {
        e.target.style["border-bottom"] = "1px solid #fff"; //目标节点边框底色恢复
      }
      this.dragNode.lastParentId = parent.id;
    },
    // 拖拽结束
    dragend(e, parent, node) {
      let i = this.dragNode.dragParentNode.layouts.findIndex(
        val => val.id == this.dragNode.dragData.id
      ); //找到旧节点
      if (e.target.className == "sbl-item-header") {
        if (i != -1) {
          this.dragNode.dragParentNode.layouts.splice(i, 1); //先删除旧节点
          this.adjust(parent.id, 1);
        }
        parent.layouts.unshift(this.dragNode.dragData); // 插入新节点
      } else if (e.target.className == "sbl-l-item" && node) {
        if (i != -1) {
          this.dragNode.dragParentNode.layouts.splice(i, 1);
        }
        let index = parent.layouts.findIndex(val => val.id == node.id); //先删除旧节点
        parent.layouts.splice(index + 1, 0, this.dragNode.dragData); // 插入新节点
        this.adjust(parent.id, index + 2);
      }
      e.target.style["border-bottom"] = "1px solid #ffffff00"; //目标节点边框底色恢复
    }
  },
  components: {
    layoutEidt,
    layoutAdd,
    layoutAddFile,
    boardAdd
  }
};
</script>
<style lang="less">
@import url("../assets/less/sidebar.less");
</style>
