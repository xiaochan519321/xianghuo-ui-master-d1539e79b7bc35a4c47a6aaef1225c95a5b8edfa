import request from '@/router/axios'

export function fetchList(query) {
    return request({
        url: '/dfh/aftersale/getAfterSaleLists',
        method: 'get',
        params: query
    })
}

export function syncOrder(obj) {
    return request({
        url: '/dfh/aftersale/afterSaleSync',
        method: 'post',
        data: obj
    })
}

export function syncAddress(obj) {
    return request({
        url: '/dfh/dfhreturnaddress/afterSaleSync',
        method: 'post',
        data: obj
    })
}
export function awaitAddress(obj) {
    return request({
        url: '/dfh/dfhreturnaddress/syncAfterSale',
        method: 'post',
        data: obj
    })
}

export function addressList(query) {
    return request({
        url: '/dfh/dfhreturnaddress/getReturnAddress',
        method: 'get',
        params: query
    })
}

export function rejectCodeList(query) {
    return request({
        url: '/dfh/dfhrejectreasoncode/page',
        method: 'get',
        params: query
    })
}

export function refundOperate(obj) {
    return request({
        url: '/dfh/aftersale/doudanAfterSaleOperate',
        method: 'post',
        data: obj
    })
}

export function refundNewAddr(obj) {
    return request({
        url: '/dfh/dfhreturnaddress/AddressAdd',
        method: 'post',
        data: obj
    })
}

export function getOrderStatusCount(query) {
    return request({
        url: '/dfh/aftersale/getCountAfterSale',
        method: 'get',
        params: query
    })
}

export function getCompanyList(query) {
    return request({
        url: '/dfh/shippingcompany/getShippingCompanyList',
        method: 'get',
        params: query
    })
}

export function saveBackfill(obj) {
    return request({
        url: '/dfh/aftersale/backfillLogistics',
        method: 'post',
        data: obj
    })
}

// 获取店铺列表
export function getShopList(query) {
    return request({
        url: '/dfh/shop/getAllList',
        method: 'get',
        params: query,
    })
}

// 发起抖店售后
export function AfterSaleOperateDouDian(obj) {
    return request({
        url: '/dfh/aftersale/AfterSaleOperateDouDian',
        method: 'post',
        data: obj
    })
}

// 供应链订单售后接口

export function getRefundReasonList(obj) {
    return request({
        url: '/dfh/aftersale/getRefundReasonList',
        method: 'post',
        data: obj
    })
}

export function afterSaleOperate1688(obj) {
    return request({
        url: '/dfh/aftersale/v1/AfterSaleOperate',
        method: 'post',
        data: obj
    })
}

export function get1688RefundOptions(obj) {
    return request({
        url: '/dfh/aftersale/getOptions',
        method: 'get',
        params: obj
    })
}
