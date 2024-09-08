import axios from 'axios'
import { serialize } from '@/util/util'
import { getStore } from '@/util/store'
import NProgress from 'nprogress' // progress bar
import errorCode from '@/const/errorCode'
import router from '@/router/router'
import { Message, MessageBox } from 'element-ui'
import 'nprogress/nprogress.css'
import qs from 'qs'
import store from '@/store' // progress bar style
// axios.defaults.baseURL = '/dfh/';
let logoutMsgBox = ''
axios.defaults.timeout = 30000
// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
// NProgress Configuration
NProgress.configure({
    showSpinner: false
})

// HTTPrequest拦截
axios.interceptors.request.use(config => {
    NProgress.start() // start progress bar
    const TENANT_ID = getStore({ name: 'tenantId' })
    const isToken = (config.headers || {}).isToken === false
    const token = store.getters.access_token
    const SECOND_PWD = sessionStorage.getItem(token + "_spwd")
    if (token && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + token// token
    }
    if (TENANT_ID) {
        config.headers['TENANT-ID'] = TENANT_ID // 租户ID
    }
    if (SECOND_PWD) {
	    config.headers['SECOND_PWD'] = SECOND_PWD // 二级密码
	}


    // headers中配置serialize为true开启序列化
    if (config.method === 'post' && config.headers.serialize) {
        config.data = serialize(config.data)
        delete config.data.serialize
    }

    if (config.method === 'get') {
        config.paramsSerializer = function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    }

    return config
}, error => {
    return Promise.reject(error)
})

// HTTPresponse拦截
axios.interceptors.response.use(res => {
    NProgress.done()
    const status = Number(res.status) || 200
    const message = res.data.msg || errorCode[status] || errorCode['default']
    // if (status === 401) {
    //     if (!logoutMsgBox) {
    //         logoutMsgBox = MessageBox.alert('用户登录凭证已过期，请重新登录', '温馨提示', {
    //             confirmButtonText: '重新登录',
    //             callback: action => {
    //                 store.dispatch('LogOut').then(() => {
    //                     router.push({ path: '/login' })
    //                     if (window.electron) {
    //                         // 向主进程传递消息
    //                         window.electron.ipcRenderer.send('close-win')
    //                         // 向渲染进程传递消息
    //                         window.electron.send({key: 'logout'})
    //                     }
    //                 })
    //                 logoutMsgBox = null
    //             }
    //         });
    //     }
    //     return
    // }
    
    // 此次截获错误信息判断该方法是否被拦截，需提供二级密码
	if (res.data.code === 50050 || res.data.msg === 'requiresSecondPwd') {
		return Promise.reject(res.data)
	}

    if (status !== 200 || res.data.code === 1) {
        Message({
            message: message,
            type: 'error'
        })
        return Promise.reject(new Error(message))
    }


    return res
}, error => {
    // 处理 503 网络异常
    if (error.response.status === 503) {
        Message({
            //message: error.response.data.msg,
            message: "正在更新程序，请您稍等片刻...",
            type: 'error'
        })
    }
    NProgress.done()
    return Promise.reject(new Error(error))
})

export default axios
