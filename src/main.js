import 'babel-polyfill'
import 'classlist-polyfill'
import Vue from 'vue'
import axios from './router/axios'
import VueAxios from 'vue-axios'
import App from './App'
import './permission' // 权限
import './error' // 日志
import './cache'//页面缓冲
import router from './router/router'
import store from './store'
import * as urls from '@/config/env'
import './styles/common.scss'
import * as filters from './filters' // 全局filter
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import AvueFormDesign from '@sscfaith/avue-form-design'
import basicContainer from './components/basic-container/main'
import locStore from './util/store'
import request from "@/router/axios";
// 后面 新增的 AIP，添加到全局
import mode from '@/interface/index';
import moment from 'moment';
import Directives from '@/directives/index';
import Bus from '@/scripts/helpers/Bus';
import './styles/iconfont/iconfont.css';
// 新手引导组件
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'

import './styles/element-cover.scss'
import './styles/avue-cover.scss'
//复制数据
import VueClipboard from 'vue-clipboard2'
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 全局引入 本地存储和会话存储 操作对象
Vue.prototype.$locStore = locStore

// 插件 json 展示
Vue.use(router)

Vue.use(AvueFormDesign);

// 挂载bus实例
Vue.prototype.$bus = Bus;

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

Vue.use(Directives);

window.axios = axios

Vue.prototype.$request = request;

// 后面 新增的 AIP，添加到全局
Vue.prototype.$API = mode;
// 挂载全局引导组件
Vue.prototype.$driver = new Driver({
    allowClose: false, //禁止点击外部关闭
    keyboardControl: false, // 禁止键盘esc关闭
    doneBtnText: '知道了', // 完成按钮标题
    closeBtnText: '关闭', // 关闭按钮标题
    stageBackground: '#fff', // 引导对话的背景色
    nextBtnText: '下一步', // 下一步按钮标题
    prevBtnText: '上一步', // 上一步按钮标题
})

// 挂载moment格式化日期js
Vue.prototype.$moment = moment;
Array.prototype.sum = function () {
    var sum = 0
    for (var i = 0; i < this.length; i++) {
      sum += parseInt(this[i])
    }
    return sum
}

Vue.use(VueAxios, axios)

Vue.use(ElementUI, {
    size: 'small',
    menuType: 'text'
})

Vue.use(AVUE, {
    size: 'small',
    menuType: 'text'
})
Vue.component('basicContainer', basicContainer)

// 加载相关url地址
Object.keys(urls).forEach(key => {
    Vue.prototype[key] = urls[key]
})

// 加载过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// 动态加载阿里云字体库
// iconfontVersion.forEach(ele => {
//     loadStyle(iconfontUrl.replace('$key', ele))
// })

// Vue.config.productionTip = false
Vue.config.productionTip = true

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
