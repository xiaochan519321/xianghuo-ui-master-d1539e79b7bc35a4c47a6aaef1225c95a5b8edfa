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
    url: '/dfh/shop/page',
    method: 'get',
    params: query
  })
}

export function getAllShopList(query) {
  return request({
    url: '/dfh/shop/getAllList',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/dfh/shop',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/dfh/shop/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/dfh/shop/removeShop/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/dfh/shop',
    method: 'put',
    data: obj
  })
}

export function flagConfig(obj) {
  return request({
    url: '/dfh/shop/flagConfig',
    method: 'put',
    data: obj
  })
}

export function getAllList() {
  return request({
    url: '/dfh/shop/getAllList',
    method: 'get'
  })
}


export function loadMerchantInfo(params) {
    return request({
      url: '/dfh/shop/getByMerchant',
      method: 'get',
      params: params
    })
}

// 退出抖店登录
export function kuaidizsSignOut(data) {
    return request({
      url: `dfh/shop/kuaidizsSignOut/${data}`,
      method: 'get',
      params: {}
    })
}

// 登录抖店结果
export function doudian_login_status(id) {
    return request({
      url: 'dfh/shop/doudianLoginResult',
      method: 'get',
      params: {requestId: id}
    })
}

// 登录抖店
export function shop_doudian_login(obj) {
    return request({
        url: '/dfh/shop/doudianLogin',
        method: 'post',
        data: obj
    })
}

// 抖店手机号登录验证码
export function getDoudianLoginCode(obj) {
    return request({
        url: '/dfh/shop/sendActivationCode',
        method: 'post',
        data: obj
    })
}

// 抖店手机号登录
export function doudianMobileLogin(obj) {
    return request({
        url: '/dfh/shop/quickLogin',
        method: 'post',
        data: obj
    })
}

// 登录爱用交易
export function shopManagerLogin(obj) {
    return request({
        url: '/dfh/shop/aiyongLogin',
        method: 'post',
        data: obj
    })
}

//用户工作台数据
export function getWorkData(query) {
  return request({
    url: '/dfh/statistics/getWorkData',
    method: 'get',
    params: query
  })
}