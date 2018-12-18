/* 报表数据部分 */
import {
  default as $apis
} from "../src/api/public.js";
/* 获取数据 */



/* 处理数据 */
export default {
  listData(type, tableData, dimension, numberValue) {
    let data = null;
    switch (type) {
      case 'table':
        data = this.setTableData(tableData, dimension, numberValue);
        break;
      case 'card':
        data = this.setCardData(tableData, dimension, numberValue);
        break;
      case 'gauge':
        data = this.setCardData(tableData, dimension, numberValue);
        break;
      case 'pie':
        data = this.setPieData(tableData, dimension, numberValue);
        break;
      case 'sunburst':
        break;
      case 'funnel':
        break;
      case 'radar':
        break;
      case 'line':
        break;
      case 'scatter':
        break;
      case 'bar':
        break;
      case 'wordcloud':
        break;
      default:
        break;
    }
    return data
  },
  setTableData(data, dimension, numberValue) {
    let arr1 = dimension.map(val => {
      return {
        label: val.name,
        prop: val.name
      }
    })
    let arr2 = numberValue.map(val => {
      return {
        label: val.name,
        prop: val.name
      }
    })
    let arr = Array.from(new Set([...arr1, ...arr2]));
    return {
      columns: arr,
      tableData: data
    }
  },
  setCardData(tableData, dimension, numberValue) {
    return [{
      name: numberValue[0].name,
      value: tableData[0][numberValue[0].name]
    }]
  },
  setPieData(tableData, dimension, numberValue) {

  }
}
