
// 积分充值相关接口
import request from '@/router/axios'

export default {
    // 创建支付订单
    createPayOrder(obj) {
        return request({
            url: '/pay/goods/merge/buy',
            method: 'post',
            params: obj,
        })
    },
    // 获取订单支付状态
    getPayOrderStatus(id) {
        return request({
            url: '/pay/goods/merge/getPayOrderStatus?payOrderId=' + id,
            method: 'get'
        })
    },
    // 获取充值记录列表
    getPageByUser(query) {
        return request({
            url: '/pay/goods/pageByUser',
            method: 'get',
            params: query
        })
    },
    // 创建1688支付订单
    create1688PayOrder(obj) {
        return request({
            url: '/pay/goods/alibaba1688OrderToPay',
            method: 'post',
            params: obj,
        })
    },
}
