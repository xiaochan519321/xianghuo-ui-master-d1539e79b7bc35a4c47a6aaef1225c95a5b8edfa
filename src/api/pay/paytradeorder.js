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

export function fetchList(query) {
  return request({
    url: '/pay/order/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/pay/order',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/pay/order/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/pay/order/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/pay/order',
    method: 'put',
    data: obj
  })
}
