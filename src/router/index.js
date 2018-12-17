import Vue from 'vue'
import Router from 'vue-router'

import layoutCenter from '../page/layout-center/index'
import boardCenter from '../page/board-center/index'
import chartCenter from '../page/chart-center/index'
import majorBorder from '../page/major-border/index'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'boardCenter',
      component: boardCenter
    },
    {
      path: '/layoutCenter',
      name: 'layoutCenter',
      component: layoutCenter
    },
    {
      path: '/chartCenter',
      name: 'chartCenter',
      component: chartCenter
    },
    {
      path: '/majorBorder',
      name: 'majorBorder',
      component: majorBorder
    }
  ]
})
