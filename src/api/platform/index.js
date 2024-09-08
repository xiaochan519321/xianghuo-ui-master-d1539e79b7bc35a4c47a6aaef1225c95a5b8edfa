import request from '@/router/axios'

//登录发送验证码
export function getSendCode(query) {
    return request({
        url: '/dfh/platform/sendcode',
        method: 'get',
        params: query
    })
}

//登录平台
export function platformLogin(data) {
    return request({
        url: '/dfh/platform/loginplatform',
        method: 'post',
        data: data
    })
}

//下线账号
export function platformExit(query) {
    return request({
        url: '/dfh/platform/exit',
        method: 'get',
        params: query
    })
}
//管理员删除账号
export function platformDel(query) {
    return request({
        url: '/dfh/platform/del',
        method: 'get',
        params: query
    })
}
//管理员查询账号
export function adminList(query) {
    return request({
      url: '/dfh/platform/page',
      method: 'get',
      params: query
    })
}

//用户查询账号
export function fetchList(query) {
    return request({
      url: '/dfh/platform/qryinfo',
      method: 'get',
      params: query
    })
}

//设置最大次数
export function updmax(query) {
    return request({
      url: ' /dfh/platform/updmax',
      method: 'get',
      params: query
    })
}

//全局设置最大次数
export function updallmax(query) {
    return request({
      url: '/dfh/platform/updallmax',
      method: 'get',
      params: query
    })
}