import request from '@/router/axios'

//推广列表
export function fetchList(query) {
    return request({
        url: '/admin/agentinfo/qrylist',
        method: 'get',
        params: query
    })
}

// 我要推广统计
export function count() {
    return request({
        url: '/admin/promote/getPromoteCount',
        method: 'get'
    })
}

// 邀请码
export function codeObj() {
    return request({
        url: '/admin/agentinfo/qryinfo',
        method: 'get'
    })
}

//用户发起代理审核
export function addAuditObj() {
    return request({
      url: '/admin/agentexamine/add',
      method: 'post'
    })
}
//用户查询代理审核状态 
export function getAudit() {
    return request({
        url: '/admin/agentexamine/qrysts',
        method: 'get'
    })
}
