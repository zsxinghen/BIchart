<template>
<div class="table-wrapper">
  <table class="gridtable" :style="`border:1px solid ${config.td.borderColor}`">
    <thead>
      <tr>
        <th :style="`border:1px solid ${config.td.borderColor};font-size:${config.th.fontSize}px;font-family:${config.th.fontFamliy};
      color:${config.th.color};background:${config.thColor}`"
          v-for="(item,i) in columns" :key="i">{{item.label}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row,index) in data" :key="index">
        <td :style="`border:1px solid ${config.td.borderColor};font-size:${config.td.fontSize}px;font-family:${config.td.fontFamliy};
      color:${config.td.color};background:${config.tdColor}`"
          v-for="(cell,i) in columns" :align="cell.align"  :rowspan="row.rowSpanConfig.get(cell.prop)==null?1:row.rowSpanConfig.get(cell.prop)"
          :colspan="row.colSpanConfig.get(cell.prop)==null?1:row.colSpanConfig.get(cell.prop)" v-show="!((row.rowSpanConfig.get(cell.prop)!=null&&row.rowSpanConfig.get(cell.prop)==0)||(row.colSpanConfig.get(cell.prop)!=null&&row.colSpanConfig.get(cell.prop)==0))">
          {{ row[cell.prop]}}
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>
<script>
export default {
  props: {
    columns: {
      require: true,
      default() {
        return [];
      }
    },
    tableData: {
      require: true,
      default() {
        return [];
      }
    },
    rowspanConfig: {
      type: Array,
      default() {
        return [];
      }
    },
    colspanConfig: {
      type: Array,
      default() {
        return [];
      }
    },
    config: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    data() {
      return this.getData();
    }
  },
  data() {
    return {
      // rowspanConfig: ["marketName", "marketClassName"],
      // colspanConfig: ["col1-col2"],
      // columns: [
      //   {
      //     prop: "id",
      //     label: "ID",
      //     // width:'120px',
      //     align: "center"
      //   },
      //   {
      //     prop: "marketName",
      //     label: "市场名称",
      //     // width:'120px',
      //     align: "center"
      //   },
      //   {
      //     prop: "marketClassName",
      //     label: "市场分类",
      //     // width:'120px',
      //     align: "center"
      //   },
      //   {
      //     prop: "productClassName",
      //     label: "产品大类",
      //     // width:'120px',
      //     align: "center"
      //   }
      // ]
      // 				tableData: [{
      // 						id: 1,
      // 						marketName: '服装市场',
      // 						marketClassName: '男装',
      // 						productClassName: '西装',
      // 						col1: '1',
      // 						col2: '1'
      // 					},
      // 					{
      // 						id: 2,
      // 						marketName: '服装市场',
      // 						marketClassName: '男装',
      // 						productClassName: '皮衣',
      // 						col1: '1',
      // 						col2: '2'
      // 					},
      // 					{
      // 						id: 3,
      // 						marketName: '服装市场',
      // 						marketClassName: '女装',
      // 						productClassName: '皮衣',
      // 						col1: '1',
      // 						col2: '2'
      // 					},
      // 					{
      // 						id: 4,
      // 						marketName: '服装市场',
      // 						marketClassName: '女装',
      // 						productClassName: '群子',
      // 						col1: '1',
      // 						col2: '2'
      // 					}
      // 				]
    };
  },
  methods: {
    getData() {
      this.tableData.forEach((row, index) => {
        row.rowSpanConfig = new Map();
        row.colSpanConfig = new Map();
        this.rowSpanCompute(row, index);
        this.colSpanCompute(row);
      });
      return this.tableData;
    },
    colSpanCompute(row) {
      if (this.colspanConfig != null && this.colspanConfig.length > 0) {
        this.colspanConfig.forEach(fields => {
          let fieldArr = fields.split("-");
          let valueArr = [];
          fieldArr.forEach(field => {
            if (valueArr.indexOf(row[field]) == -1) valueArr.push(row[field]);
          });
          if (valueArr.length < 2) {
            fieldArr.forEach((field, index) => {
              if (index == 0) {
                row.colSpanConfig.set(field, fieldArr.length);
              } else {
                row.colSpanConfig.set(field, 0);
              }
            });
          } else {
            fieldArr.forEach((field, index) => {
              row.colSpanConfig.set(field, 1);
            });
          }
        });
      }
    },
    rowSpanCompute(row, index) {
      if (this.rowspanConfig != null && this.rowspanConfig.length > 0) {
        this.rowspanConfig.forEach(field => {
          if (index > 0) {
            let parentIndex = index - 1;
            if (row[field] == this.tableData[parentIndex][field]) {
              row.rowSpanConfig.set(field, 0);
              this.rowSpanParentCompute(parentIndex, field);
            } else {
              row.rowSpanConfig.set(field, 1);
            }
          } else {
            row.rowSpanConfig.set(field, 1);
          }
        });
      }
    },
    rowSpanParentCompute(rowIndex, field) {
      if (this.tableData[rowIndex].rowSpanConfig.get(field) == 0) {
        let parentRowIndex = rowIndex - 1;
        this.rowSpanParentCompute(parentRowIndex, field);
      } else {
        this.tableData[rowIndex].rowSpanConfig.set(
          field,
          this.tableData[rowIndex].rowSpanConfig.get(field) + 1
        );
      }
    }
  }
};
</script>

<style lang="less" scoped>
.mybtn {
  // margin: 10px 0px 0px 10px
}

.btn_right {
  float: right;
}

.gridtable {
  border-collapse: collapse;
  // position: absolute !important;
  // top: 0;
  // bottom: 0;
  position: relative;
  overflow: auto;
  height: 100%;
  width: 100%;
  thead {
    // position: sticky;
    // top: 0;
  }
  thead > tr {
    background: #eef1f6;
    height: 30px;
    line-height: 30px;
  }

  th,
  td {
    border: 1px solid #dfe6ec;
    font-size: 14px;
    font-weight: normal;
  }

  .w {
    width: 120px;
  }
  tbody {
    max-height: 100px;
    overflow: auto;
  }
  tbody > tr {
    height: 30px;
    line-height: 30px;

    &:hover {
      background: #eef1f6;
    }

    td {
      padding: 0 10px;
    }
  }
}

.hidden {
  display: none;
}

.table-wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
  /*滚动条样式*/
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: #F0F2F3;
  }
}
</style>
