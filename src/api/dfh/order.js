/*
 *    Copyright (c) 2018-2025, lzyq All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lzyq
 */

import request from '@/router/axios'

export function fetchList(query) {
    return request({
      url: '/dfh/order/pages',
      method: 'get',
      params: query
    })
  }

export function fetchXhsList(query) {
    return request({
      url: '/dfh/order/xhs/pages',
      method: 'get',
      params: query
    })
}



export function getExportStatus(){
  return request({
    url: '/dfh/order/getExportStatus',
    method: 'get'
  })
}

export function exportOrder(data){
  return request({
    url: '/dfh/order/exportOrder',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

export function exportXhsOrder(data){
  return request({
    url: '/dfh/order/xhs/exportOrder',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

export function addObj(obj) {
  return request({
    url: '/dfh/order',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/dfh/order/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/dfh/order/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/dfh/order',
    method: 'put',
    data: obj
  })
}


export function syncOrder(obj) {
  return request({
    url: '/dfh/order/orderSync',
    method: 'post',
    data: obj
  })
}

export function decodeTakeInfo(obj) {
  return request({
    url: '/dfh/order/decodeTakeInfo',
    method: 'post',
    data: obj
  })
}

export function getPddProductSpec(query) {
  return request({
    url: '/dfh/order/getPddProductSpec',
    method: 'get',
    params: query
  })
}

export function getPddSpecByUrlId(query) {
  return request({
    url: '/dfh/order/getPddSpecByUrlId',
    method: 'get',
    params: query
  })
}

export function getPddProductSpecShow(query) {
  return request({
    url: '/dfh/order/getPddProductSpecShow',
    method: 'get',
    params: query
  })
}

export function cancelFilterOrder(obj) {
  return request({
    url: '/dfh/order/cancelFilterOrder',
    method: 'post',
    data: obj
  })
}

export function rebuy(obj) {
  return request({
    url: '/dfh/order/rebuy',
    method: 'post',
    data: obj
  })
}

export function saveFilterOrder(obj) {
  return request({
    url: '/dfh/order/saveFilterOrder',
    method: 'post',
    data: obj
  })
}

export function manualDropShipping(obj) {
  return request({
    url: '/dfh/order/manualDropShipping',
    method: 'post',
    data: obj
  })
}

export function manualShipping(obj) {
  return request({
    url: '/dfh/order/manualShipping',
    method: 'post',
    data: obj
  })
}

export function getOrderStatusCount() {
  return request({
    url: '/dfh/order/getOrderStatusCount',
    method: 'get'
  })
}

export function getOrderPddSkuById(query) {
  return request({
    url: '/dfh/order/getOrderPddSkuById',
    method: 'get',
    params: query
  })
}

export function getOrderPddSkuBySpec(query) {
  return request({
    url: '/dfh/order/getOrderPddSkuBySpec',
    method: 'get',
    params: query
  })
}

export function updateOrderPddSku(obj) {
  return request({
    url: '/dfh/order/updateOrderPddSku',
    method: 'put',
    data: obj
  })
}

export function getMerchantInfo() {
  return request({
    url: '/dfh/order/getMerchantInfo',
    method: 'get'
  })
}

export function cancelDropShipping(obj) {
  return request({
    url: '/dfh/order/cancelDropShipping',
    method: 'put',
    data: obj
  })
}

export function flagConfig(obj) {
  return request({
    url: '/dfh/order/flagConfig',
    method: 'put',
    data: obj
  })
}
export function repay(obj) {
  return request({
    url: '/dfh/order/repay',
    method: 'post',
    data: obj
  })
}
export function encrypt(obj) {
  return request({
    url: '/dfh/order/encrypt',
    method: 'post',
    data: obj
  })
}

export function editPddArea(obj) {
  return request({
    url: '/dfh/order/editPddArea',
    method: 'put',
    data: obj
  })
}

// 检测PDD支付状态
export function detectioPddPay(obj) {
  return request({
    url: '/dfh/order/detectioPddPay',
    method: 'post',
    data: obj
  })
}

// 检测1688，供应链支付状态
export function detectioAliPay(params) {
  return request({
    url: '/dfh/order/v1/get1688OrderPayStatus',
    method: 'get',
    params: params
  })
}



export function reloadPddPay(obj) {
  return request({
    url: '/dfh/order/pay_url',
    method: 'post',
    data: obj
  })
}

export function addOrderRemark(obj){
  return request({
    url: '/dfh/order/addOrderRemark',
    method: 'post',
    data: obj
  })
}

export function orderBatchDecryption(query) {
  return request({
    url: '/dfh/order/orderBatchDecryption',
    method: 'get',
    params: query
  })
}

export function updateOrderNum(query) {
  return request({
    url: '/dfh/order/updateOrderNum',
    method: 'get',
    params: query
  })
}

export function mutiUpdateOrderNum(obj) {
  return request({
    url: '/dfh/order/updateOrderPurchaseQuantity',
    method: 'post',
    data: obj
  })
}

export function updateOrderSkuId(obj) {
  return request({
    url: '/dfh/order/updateOrderSkuId',
    method: 'post',
    data: obj
  })
}

export function purchasingOrder(obj) {
  return request({
    url: '/dfh/order/purchasingOrder',
    method: 'post',
    data: obj
  })
}

export function pddWxPay(params) {
  return request({
    url: '/dfh/order/orderPrepay',
    method: 'get',
    params: params
  })
}

// 创建1688支付订单
export function get1688OrderDetails(obj) {
  return request({
    url: '/dfh/order/v1/get1688OrderDetails',
    method: 'get',
    params: obj,
  })
}

// 创建1688支付链接
export function create1688pay(obj) {
  return request({
    url: '/dfh/order/v1/toPay',
    method: 'get',
    params: obj,
  })
}

// 获取1688支付状态
export function get1688PayStatus(obj) {
  return request({
    url: '/dfh/order/v1/getAlibaba1688DfPayStatus',
    method: 'get',
    params: obj,
  })
}


// 查询1688订单物流
export function getOrderLogistics(obj) {
  return request({
    url: '/dfh/order/v1/getOrderLogistics',
    method: 'get',
    params: obj,
  })
}

// 代发订单发起退款申请
export function orderSupplyRefund(data) {
  return request({
    url: '/dfh/aftersale/v1/AfterSaleOrderId',
    method: 'post',
    data: data,
  })
}

// 查询风控订单是否需要提醒
export function checkOrderFengKong(obj) {
  return request({
    url: '/dfh/order/checkFengKong',
    method: 'get',
    params: obj,
  })
}

// 导入收货人信息订单
export function importOrderAddr(data) {
  return request({
    url: '/dfh/order/fileImportDecrypt',
    method: 'post',
    data: data,
  })
}

// 导入小红书信息订单
export function fileImportOrderInfo(data) {
  return request({
    url: '/dfh/order/fileImportOrderInfo',
    method: 'post',
    data: data,
  })
}
// 获取订单快递信息
export function getOrderTrackingInfo(id){
  return request({
    url: '/dfh/order/getOrderTrackingInfo',
    method: 'get',
    params: {"id":id},
  })
}

//发送其它平台物流
export function sendOutEx(query) {
  return request({
    url: '/dfh/order/sendOutEx',
    method: 'get',
    params: query
  })
}

//手动检测上家发货状态
export function manualCheckShipping(obj) {
  return request({
    url: '/dfh/order/manualCheckShipping',
    method: 'post',
    data: obj
  })
}

//无视上家发货
export function manualShippingNoUp(obj) {
  return request({
    url: '/dfh/order/manualShippingNoUp',
    method: 'post',
    data: obj
  })
}