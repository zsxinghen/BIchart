/* 报表数据部分 */
import {
  default as $apis
} from "../api/public.js";
import {
  default as urls
} from "../api/urls/chart-center.js";
export default {
  /* 
  根据条件获取报表的数据
  注：所有的联动、变更表格数据都通过这个接口
   */
  getList: ({
    commit
  }, this_) => {
    let arr = this_.config.dataConfig.dimension
      .concat(this_.config.dataConfig.numberValue)
      .map(val => val.prop); //去合并维度、数值组合数组
    let param = {
      id: this_.config.dataConfig.id,
      keyls: Array.from(new Set([...arr])) //去重
    };
    this_.$apis
      .fetchPostJson(urls.getListUrl, {
        params: param,
        Vue: this_
      })
      .then(res => {
        let newArr = null;
        if (res.result) {

          newArr = res.model.maps.map(val => JSON.parse(val))
          this_.$message({
            type: "success",
            message: res.message
          });
        } else {
          this_.$message({
            type: "warning",
            message: res.message
          });
        }
        // 根据图表类型获取指定格式数据
        let data = this_.$setData.listData(
          this_.config.chart,
          newArr,
          this_.config.dataConfig.dimension,
          this_.config.dataConfig.numberValue
        )
        this_.$set(this_.config, "data", data);
      })
  }
}
