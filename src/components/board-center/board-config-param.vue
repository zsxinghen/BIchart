/*
*看板中心--看板联动
*/
<template>
  <board-toast
    :config="dialogConfig"
    @close="close"
    v-if="dialogConfig.dialogVisible"
  >
    <div class="board-param-top">
      <el-form
        :model="formData"
        ref="formData"
        label-width="100px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="联动目标:">
              {{formData.fromName}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="被联动目标:">
              <el-select
                v-model="formData.toId"
                size="mini"
                placeholder="请选择"
                @change="setParamOption(formData.toId)"
              >
                <el-option
                  v-for="item in setOption()"
                  :key="item.id"
                  :label="item.toName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联动参数:">
              <el-select
                v-model="formData.linkParam"
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in option"
                  :key="item.prop"
                  :label="item.label"
                  :value="item.prop"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="position:relative;height: 40px;">
      <div style="position:absolute;top:0;right:0">
        <el-button
          type="primary"
          size="mini"
          v-show="type=='add'"
          @click.stop="add"
        >新增</el-button>
        <el-button
          size="mini"
          v-show="type=='add'"
          @click.stop="empty()"
        >清空</el-button>
        <el-button
          size="mini"
          v-show="type=='edit'"
          @click.stop="save"
        >保存</el-button>
      </div>
    </div>
    <div class="board-param-main">
      <el-table
        :data="tableData"
        stripe
        border
        max-height="500"
        style="width: 100%"
        @row-dblclick="rowClick"
      >
        <el-table-column
          prop="fromName"
          label="联动目标"
          width="180"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="toName"
          label="被联动目标"
          width="180"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="linkParam"
          label="联动参数"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="100"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="del(scope.row)"
              type="text"
              size="small"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </board-toast>
</template>
<script>
import { default as urls } from "../../api/urls/board-center.js";
export default {
  data() {
    return {
      dialogConfig: {
        title: "图表联动设置", //弹窗标题
        dialogVisible: false, //弹窗显示
        width: "800px", //弹窗宽
        btnData: ["close"]
      },
      boardChart: [], //看板中所有的图表
      option: [],
      fromObj: null,
      // tableData: [{}],
      type: "add",
      tableData: [],
      formData: {
        toId: "",
        linkParam: ""
      }
    };
  },
  props: {
    currentNode: {
      type: Object,
      default: () => null
    }
  },
  mounted() {},
  watch: {
    "dialogConfig.dialogVisible": {
      handler() {
        if (!this.dialogConfig.dialogVisible) {
          this.$parent.reGetBoard(this.currentNode, this.currentNode.id);
        }
      }
    }
  },
  methods: {
    show(obj, arr) {
      this.formData.fromId = obj.from.id;
      this.formData.fromName = obj.from.name;
      this.option = obj.from.props;

      this.boardChart = obj.toOption;
      this.dialogConfig.dialogVisible = true;
      this.tableData = arr.filter(v => v.fromId == obj.from.id);
      this.empty();
    },
    close() {
      this.dialogConfig.dialogVisible = false;
    },
    // 筛选被联动目标
    setOption() {
      let arr = this.boardChart.filter(v => {
        let flag = this.tableData.findIndex(k => v.id == k.toId);
        if (flag != -1) {
          return false;
        } else {
          return true;
        }
      });
      return arr;
    },
    //根据被联动目标情况获取被联动参数
    setParamOption(id) {
      let flag = this.boardChart.findIndex(v => v.id == id);
      if (flag != -1) {
        this.option = this.boardChart[flag].props;
      } else {
        this.option = [];
      }
    },
    // 删除
    del(row) {
      this.$apis
        .fetchPost(urls.sideBar.del_Link, {
          params: { id: row.id },
          Vue: this
        })
        .then(res => {
          if (res.result) {
            let i = this.tableData.findIndex(v => v.id == row.id);
            this.tableData.splice(i, 1);
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
    },
    // 新增部分
    add() {
      let flag = this.boardChart.findIndex(k => k.id == this.formData.toId);
      let param = {
        fromId: this.formData.fromId,
        fromName: this.formData.fromName,
        toId: this.formData.toId,
        toName: this.boardChart[flag].toName,
        boardId: this.currentNode.id,
        linkParam: this.formData.linkParam
      };
      this.$apis
        .fetchPost(urls.sideBar.add_Link, {
          params: param,
          Vue: this
        })
        .then(res => {
          if (res.result) {
            this.tableData.push(res.model);
            this.empty();
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
    },
    empty() {
      this.formData.toId = "";
      this.formData.linkParam = "";
      this.$forceUpdate();
      this.option = [];
    },
    // 编辑部分
    rowClick(row) {
      this.type = "edit";
      this.formData = {
        fromId: row.fromId,
        fromName: row.fromName,
        toId: row.toId,
        toName: row.toName,
        linkParam: row.linkParam,
        id: row.id
      };
    },
    save() {
      let flag = this.boardChart.findIndex(k => k.id == this.formData.toId);
      let param = {
        fromId: this.formData.fromId,
        fromName: this.formData.fromName,
        toId: this.formData.toId,
        toName: this.boardChart[flag].toName,
        boardId: this.currentNode.id,
        id: this.formData.id,
        linkParam: this.formData.linkParam
      };
      this.$apis
        .fetchPost(urls.sideBar.up_Link, {
          params: param,
          Vue: this
        })
        .then(res => {
          if (res.result) {
            let i = this.tableData.findIndex(v => v.id == param.id);
            this.tableData.splice(
              i,
              1,
              JSON.parse(JSON.stringify(this.formData))
            );
            this.empty();
            this.type = "add";
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
    }
  }
};
</script>
<style lang="less">
.board-param-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .el-form-item {
    margin-bottom: 0px;
  }
}

.board-param-main {
  margin-bottom: 20px;

  .el-table td {
    padding: 4px 0;
  }

  .el-table th {
    padding: 8px 0;
  }
}
</style>
