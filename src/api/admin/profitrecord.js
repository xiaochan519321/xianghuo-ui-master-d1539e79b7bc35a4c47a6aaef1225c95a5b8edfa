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
    url: '/admin/profitrecord/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/profitrecord',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/profitrecord/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/profitrecord/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/profitrecord',
    method: 'put',
    data: obj
  })
}

export function exportList(data) {
  return request({
    url: '/admin/profitrecord/exportProfitRecords',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}


