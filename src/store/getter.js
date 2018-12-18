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
  getCurrConfigs: (state) => { //获取当前路由
    return state.configs
  },
}
