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
 * Neither the name of thelayq.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lzyq
 */

import request from '@/router/axios'

export function fetchTree(query) {
  return request({
    url: '/admin/site/tree',
    method: 'get',
    params: query
  })
}

export function fetchList(query) {
  return request({
    url: '/admin/site/page',
    method: 'get',
    params: query
  })
}
export function getChildSite() {
  return request({
    url: '/admin/site/getChildSite',
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/site',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/site/' + id,
    method: 'get'
  })
}
export function getCurrentSite() {
  return request({
    url: '/admin/site',
    method: 'get'
  })
}
export function findSysSite() {
  return request({
    url: '/admin/site/findSysSite',
    method: 'post'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/site/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/site',
    method: 'put',
    data: obj
  })
}

export function initBalance(obj) {
  return request({
    url: '/admin/site/initSiteBalance',
    method: 'post',
    data: obj
  })
}
export function getCountInfo(query) {
  return request({
    url: '/admin/site/getCountInfo',
    method: 'get',
    params: query
  })
}
export function getAllCountInfo(obj) {
  return request({
    url: '/admin/site/getAllCountInfo',
    method: 'post',
    data: obj
  })
}

export function getTradeOrderList(query) {
  return request({
    url: '/pay/order/pages',
    method: 'get',
    params: query
  })
}

export function exportOrderList(data) {
    return request({
      url: '/pay/order/exportPayTradeOrder',
      method: 'post',
      data: data,
      responseType: 'blob'
    })
}

