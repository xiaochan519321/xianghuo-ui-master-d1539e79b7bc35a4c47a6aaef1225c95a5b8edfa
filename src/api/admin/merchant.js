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
    url: '/admin/merchant/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/merchant',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/merchant/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/merchant/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/merchant',
    method: 'put',
    data: obj
  })
}

export function checkMerchant(obj) {
  return request({
    url: '/admin/merchant/checkMerchant',
    method: 'put',
    data: obj
  })
}

export function presentIntegral(obj) {
  return request({
    url: '/admin/merchant/presentIntegral',
    method: 'put',
    data: obj
  })
}

export function retrieveIntegral(obj) {
  return request({
    url: '/admin/merchant/retrieveIntegral',
    method: 'put',
    data: obj
  })
}

export function updateMerchantProfitConfig(obj) {
  return request({
    url: '/admin/merchant/updateMerchantProfitConfig',
    method: 'put',
    data: obj
  })
}

export function updateAgentState(obj) {
  return request({
    url: '/admin/merchant/updateAgentState',
    method: 'post',
    data: obj
  })
}

export function updateIntegralSkipStatus(obj) {
  return request({
    url: '/admin/merchant/updateIntegralSkipStatus',
    method: 'post',
    data: obj
  })
}

export function getMerchantInfo(obj) {
  return request({
    url: '/admin/merchant/getMerchantInfo',
    method: 'get',
    data: obj
  })
}

export function getExportStatus(obj) {
  return request({
    url: '/admin/merchant/getExportStatus',
    method: 'get',
    params: obj
  })
}

export function exportMerchant(obj) {
  return request({
    url: '/admin/merchant/exportMerchant',
    method: 'post',
    data: obj,
    responseType: 'blob'
  })
}

export function getMarketCustomList(obj) {
    return request({
        url: '/admin/merchant/getSalesBDMerchantList1',
        method: 'get',
        params: obj
    })
}

export function getMerchantIntegral(obj) {
    return request({
        url: '/admin/integrallog/getMerchantIntegral',
        method: 'get',
        params: obj
    })
}

export function rechargeBalance(obj) {
    return request({
        url: '/admin/balance/rechargeBalance',
        method: 'post',
        data: obj
    })
}


export function exchangeCdk(obj){
  return request({
    url: '/admin/syscdkey/exchangeCdk',
    method: 'post',
    data: obj
  })
}