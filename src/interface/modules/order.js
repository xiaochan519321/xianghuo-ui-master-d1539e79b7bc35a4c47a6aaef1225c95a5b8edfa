import request from '@/router/axios'

export default {
    // 代发订单--获取订单状态筛选框列表数据
    getOrderStatus(query) {
        return request({
            url: '/admin/dict/type/dfh_order_status',
            method: 'get',
            params: query,
        });
    },
    // 获取抖店商品sku列表
    getOrderStatus(query) {
        return request({
            url: '/dfh/product/getProductSkuList',
            method: 'get',
            params: query,
        });
    },
    // 获取订单状态统计
    getOrderStatusCount(query) {
        return request({
            url: '/dfh/order/orderStatusCount',
            method: 'get',
            params: query,
        });
    },
    // 获取小红书订单状态统计
    getXhsOrderStatusCount(query) {
        return request({
            url: '/dfh/order/xhs/orderStatusCount',
            method: 'get',
            params: query,
        });
    },
}
