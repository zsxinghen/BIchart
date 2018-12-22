<template>
  <board-toast :config="dialogConfig" @close="close" v-if="dialogConfig.dialogVisible">
    <div class="board-authorization-top">
      <div>
        <el-input size="mini" style="width:300px" placeholder="请输入人员姓名（编号）查询"></el-input>
      </div>
      <div>
        <el-button type="primary" size="mini" @click.stop="add">添加人员</el-button>
        <el-button size="mini" @click.stop="remove">移除人员</el-button>
      </div>
    </div>
    <div class="board-authorization-main">
      <el-table :data="tableData" stripe border align="center" max-height="500" header-align="center" style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="date" label="部门名称" width="180">
        </el-table-column>
        <el-table-column prop="name" label="人员" width="180">
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
  export default {
    data() {
      return {
        dialogConfig: {
          title: "看板授权维护", //弹窗标题
          dialogVisible: false, //弹窗显示
          width: "800px", //弹窗宽
          btnData: ["close"]
        },
        tableData: [{}]
      };
    },
    mounted() {},
    methods: {
      show() {
        this.dialogConfig.dialogVisible = true;
      },
      close() {
        this.dialogConfig.dialogVisible = false;
      },
      add() {},
      remove() {}
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
