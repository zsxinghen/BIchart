/*  
 *报表中心
 */
export default {
  // 本地数据源
  addUrl: '/app_bi/loc/val/add', //新增本地数据源
  updUrl: '/app_bi/loc/val/upd', //编辑本地数据源 ---保存配置信息
  delUrl: '/app_bi/loc/val/del', //删除本地数据源
  getListUrl: '/app_bi/loc/val/getByKey', //根据维度、数值获取表格数据
  // 远程数据源
  getHouse: "/app_bi/perm/getHouse", //仓库下拉
  getModel: "/app_bi/perm/getModel", //模型下拉
  getVersion: "/app_bi/perm/getVersion", //版本下拉
  getDataList: "/app_bi/perm/get", //获取数据列
  findSql:"/app_bi/perm/findSql", //数据预览
  addOrUpd:"/app_bi/loc/val/addOrUpd" //远程数据源保存
}
