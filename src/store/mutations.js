export default { 
  setLoading:(state,data)=>{//等待loding
    state.isloading = data
  },
  setIsProgress:(state,data)=>{//加载进度
    state.isProgress = data
  },
  setAccountInfo:(state,data)=>{//公司信息
    state.accountInfo = data
  },
  setCurrRouter:(state,data)=>{//设置当前路由
    state.currRouter = data;
  } 
}

