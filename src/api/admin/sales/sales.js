import request from '@/router/axios'

export function getSalesList(query) {
    return request({
      url: '/admin/agent/user/getAgentUserPage',
      method: 'get',
      params: query
    })
}

export function addObj(obj) {
    return request({
        url: '/admin/agent/user/createAgentUser',
        method: 'post',
        data: obj
    })
}

export function putObj(obj) {
    return request({
        url: '/admin/agent/user/updateAgentUser',
        method: 'post',
        data: obj
    })
}

export function delObj(id) {
    return request({
        url: '/admin/agent/user/' + id,
        method: 'delete'
    })
}

export function statusObj(obj) {
    return request({
        url: '/admin/agent/user/lockAgentUser',
        method: 'post',
        data: obj
    })
}

