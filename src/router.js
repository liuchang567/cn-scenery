
import Vue from 'vue'
import Router from 'vue-router'
 
//组件模块
import Layout from './view/Layout'
 
Vue.use(Router)
 
export default new Router({
  routes: [
    { path: '/',  name: 'layout', component: Layout }
  ]
})