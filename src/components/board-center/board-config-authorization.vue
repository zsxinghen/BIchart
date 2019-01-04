/* 
 *看板中心--看板授权
 */
<template>
  <board-toast :config="dialogConfig" @close="close" v-if="dialogConfig.dialogVisible">
    <div class="board-authorization-top">
      <div>
        <el-select v-model="userId" style="width:300px" placeholder="请选择待添加人员" size="mini">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
      
      </div>
      <div>
        <el-button type="primary" size="mini" @click.stop="add(userId)">添加人员</el-button>
        <el-button size="mini" @click.stop="remove">移除人员</el-button>
      </div>
    </div>
    <div class="board-authorization-main">
      <el-table :data="tableData" stripe border align="center" max-height="500"
       @selection-change="handleSelectionChange" header-align="center" style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="orgName" label="部门名称" width="180">
        </el-table-column>
        <el-table-column prop="empName" label="人员" width="180">
        </el-table-column>
        <el-table-column label="看板权限">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isView">浏览</el-checkbox>
            <el-checkbox v-model="scope.row.isDesisn">设计</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">保存授权</el-button>
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
        title: "看板授权维护", //弹窗标题
        dialogVisible: false, //弹窗显示
        width: "800px", //弹窗宽
        btnData: ["close"]
      },
      userId: "",
      options: [],
      tableData: [],
      selectRows: []
    };
  },
  props: ["board","currentNode"],
  watch: {
    "dialogConfig.dialogVisible": {
      handler() {
        if (!this.dialogConfig.dialogVisible) {
          this.$parent.reGetBoard(this.board, this.board.id);
        }
      }
    }
  },
  mounted() {
    this.getOption();
  },
  methods: {
    show() {
      this.dialogConfig.dialogVisible = true;
      this.getList();
    },
    getList() {
      this.$apis
        .fetchPost(urls.sideBar.get_grant, {
          params: { folderId: this.board.id },
          Vue: this
        })
        .then(res => {
          if (res.result) {
            res.model.forEach((v, i) => {
              res.model[i].isView = v.isView ? true : false;
              res.model[i].isDesisn = v.isDesisn ? true : false;
            });
            this.tableData = res.model;
          } else {
            this.$message({
              type: "warning",
              message: res.message
            });
          }
        });
    },
    close() {
      this.dialogConfig.dialogVisible = false;
    },
    add(id) {
      if (!id) {
        this.$message({
          type: "warning",
          message: "请选择待添加人员"
        });
      } else {
        let param = {
          folderId: this.board.id,
          userId: id,
          isView: 0,
          isDesisn: 0
        };
        this.$apis
          .fetchPost(urls.sideBar.add_grant, {
            params: param,
            Vue: this
          })
          .then(res => {
            if (res.result) {
              this.getList();
              this.userId = "";
            } else {
              this.$message({
                type: "warning",
                message: res.message
              });
            }
          });
      }
    },
    handleClick(row) {
      let param = {
        folderId: row.folderId,
        userId: row.userId,
        isView: row.isView ? 1 : 0,
        isDesisn: row.isDesisn ? 1 : 0,
        id: row.id
      };
      this.$apis
        .fetchPost(urls.sideBar.upd_grant, {
          params: param,
          Vue: this
        })
        .then(res => {
          if (res.result) {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.getList();
          } else {
            this.$message({
              type: "warning",
              message: res.message
            });
          }
        });
    },
    handleSelectionChange(rows) {
      this.selectRows = rows;
    },
    remove() {
      let str = this.selectRows.map(v => v.id).join(",");
      this.$apis
        .fetchPost(urls.sideBar.del_grant, {
          params: { ids: str },
          Vue: this
        })
        .then(res => {
          if (res.result) {
            this.getList();
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
    getOption() {
      this.$apis
        .fetchPost(urls.sideBar.getEmp_grant, {
          params: null,
          Vue: this
        })
        .then(res => {
          if (res.result) {
            if (res.model.length) {
              let arr = res.model.map(v => {
                return {
                  label: v.orgName + "   " + v.empName,
                  value: v.userId
                };
              });
              this.options = arr;
            }
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
.board-authorization-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.board-authorization-main {
  margin-bottom: 20px;

  .el-table td {
    padding: 4px 0;
  }

  .el-table th {
    padding: 8px 0;
  }
}
</style>
