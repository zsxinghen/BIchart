export default {
  getIsLoading: (state) => { //加载loading
    return state.isloading
  },
  getIsProgress: (state) => { //加载进度%
    return state.isProgress
  },
  getAccountInfo: (state) => { //公司信息
    return state.accountInfo
  },
  getCurrRouter: (state) => { //获取当前路由
    return state.currRouter
  },
  getCurrConfigs: (state) => { //获取图表配置信息
    return state.configs
  },
  getCurrNode: (state) => { //获取图表所属的看板节点
    return state.currNode
  },
  getCurrchartId: (state) => { //获取图表容器id
    return state.id
  },
  getBoardId: (state) => { //获取当前图表的配置信息
    return state.boardId
  }
}
