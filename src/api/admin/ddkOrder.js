import request from '@/router/axios'

export function fetchList(query) {
    return request({
        url: '/dfh/order/siteDdkOrderList',
        method: 'get',
        params: query
    })
}

export function fetchCountList(query) {
    return request({
        url: '/dfh/order/siteDdkOrderListStatistical',
        method: 'get',
        params: query
    })
}

export function fetchWithdrawList(query) {
    return request({
        url: '/admin/syssitewithdrawrecord/page',
        method: 'get',
        params: query
    })
}

export function fetchExportList(data) {
    return request({
        url: '/dfh/order/exportSiteDdkOrderData',
        method: 'post',
        data: data,
        responseType: 'blob'
    })
}

export function applyWithdrawal(obj) {
    return request({
        url: '/admin/syssitewithdrawrecord/applyWithdrawal',
        method: 'post',
        data: obj
    })
}

export function auditWithdrawal(obj) {
    return request({
        url: '/admin/syssitewithdrawrecord/auditWithdrawal',
        method: 'post',
        data: obj
    })
}
