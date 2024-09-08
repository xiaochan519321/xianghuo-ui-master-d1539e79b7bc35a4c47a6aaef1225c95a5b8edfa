import Vue from 'vue'
import VueRouter from 'vue-router'
import PageRouter from './page/'
import ViewsRouter from './views/'
import AvueRouter from './avue-router'
import Store from '../store/'
import { getCallbackQuery } from '@/util/util'
Vue.use(VueRouter)
//创建路由
export const createRouter = () => new VueRouter({
  //mode: 'history',  //去掉url中的#
  routes: [...PageRouter, ...ViewsRouter]
})

const Router = createRouter()
AvueRouter.install(Router, Store)
Router.$avueRouter.formatRoutes(Store.state.user.menu, true)
Router.beforeEach((to,from,next) => {
    // 为了处理抖店授权回调地址重定向问题
    // 抖店回调地址 -> http://xh.zhiboniu.cn/?code=dda42890-1bd5-4eec-bb70-d662172ee21d&state=8-1#/dfh/shop/index
    // 需要中转 -> /dfh/shop/authCallback/3?code=${code}&state=${state}`
    const routeQuery = to.query
    const code = getCallbackQuery(window.location.href, 'code')
    const state = getCallbackQuery(window.location.href, 'state')
    const location = window.location
    if (code && state && !routeQuery.code && !routeQuery.state) {
        // 判断是回调地址的时候再进行处理，回调地址中是获取不到路由参数routeQuery
        window.location.href = `${location.origin}/dfh/shop/authCallback/3?code=${code}&state=${state}`
    } else {
        next()
    }
})
// 重置路由
export function resetRouter () {
  const newRouter = createRouter()
  Router.matcher = newRouter.matcher
  AvueRouter.install(Router, Store)
}
export default Router
