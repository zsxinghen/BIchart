import Vue from 'vue'
import Vuex from 'Vuex'
import getters from './getter'
import mutations from './mutations'
import actions from './action'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isloading:false,//等待loding
        isProgress:{show:false,text:'0%'},//加载进度
        accountInfo:{},//公司信息
        currRouter:1//当前路由
    },
    actions,
    mutations,
    getters
})