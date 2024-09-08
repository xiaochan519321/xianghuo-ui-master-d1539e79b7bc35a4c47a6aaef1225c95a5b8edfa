import request from '@/router/axios'

export function fetchList(query) {
    return request({
        url: '/dfh/purchaseAccount/getPage',
        method: 'get',
        params: query
    })
}

export function getAuthUrl(query) {
    return request({
        url: '/dfh/purchaseAccount/getAuthUrl',
        method: 'get',
        params: query
    })
}

export function fetchDelete(data) {
    return request({
        url: '/dfh/purchaseAccount/delete',
        method: 'post',
        data: data
    })
}
