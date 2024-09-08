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

export function getObj() {
  return request({
    url: '/admin/config',
    method: 'get'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/config',
    method: 'put',
    data: obj
  })
}
export function initMemberConfig(obj) {
  return request({
    url: '/admin/config',
    method: 'post',
    data: obj
  })
}

export function getByComboCode(comboCode,tenantId) {
  return request({
    url: '/admin/config/getByComboCode/'+comboCode+'/'+tenantId,
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: '/admin/profitconfig/page',
    method: 'get',
    params: query
  })
}

export function memberList(query) {
  return request({
    url: '/admin/profituser/page',
    method: 'get',
    params: query
  })
}

export function getProfitConfig(obj) {
  return request({
    url: '/admin/profitconfig'+ (!obj ? '': ('?profitType='+obj)),
    method: 'get'
  })
}

export function addProfitConfig(obj) {
  return request({
    url: '/admin/profitconfig',
    method: 'post',
    data: obj
  })
}
export function saveProfit(obj) {
  return request({
    url: '/admin/profitconfig/saveProfit',
    method: 'post',
    data: obj
  })
}
export function delProfitConfig(id) {
  return request({
    url: '/admin/profitconfig/' + id,
    method: 'delete'
  })
}
