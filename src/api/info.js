import request from '@/router/axios'

export function getHistoryList(query) {
    return request({
        url: '/pay/goods/pageByUser',
        method: 'get',
        params: query
    })
}

// 根据uuID判断网站是否启动
export function getClientCheck(query) {
    return request({
        url: '/dfh/kuaipai/client/check',
        method: 'get',
        params: query
    })
}

// 连接心跳判断网站用户是否在线
export function getClientStatus(query) {
    return request({
        url: '/dfh/kuaipai/client/heartbeatStatus',
        method: 'get',
        params: query
    })
}

// 获取对应站点广告二维码
export function getServiceQrCode(query) {
    return request({
        url: '/dfh/qrCode/getCustomerServiceQrCodeImg',
        method: 'get',
        params: query
    })
}
