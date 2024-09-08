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
 * Neither the name of the lzyq developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lzyq
 */

import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/user/page',
    method: 'get',
    params: query
  })
}

export function fetchSubList(query) {
  return request({
    url: '/admin/user/sub/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/user',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/user',
    method: 'put',
    data: obj
  })
}

export function getDetails(obj) {
  return request({
    url: '/admin/user/details/' + obj,
    method: 'get'
  })
}

// 更改个人信息
export function editInfo(obj) {
  return request({
    url: '/admin/user/edit',
    method: 'put',
    data: obj
  })
}

// 修改二级密码
export function updateSecondPassword(obj) {
    return request({
      url: '/admin/user/updateSecondPassword',
      method: 'put',
      data: obj
    })
}
  
// 切换二级密保标识状态
export function changeOpenSpwdFlag(obj) {
    return request({
      url: '/admin/user/changeOpenSpwdFlag',
      method: 'put',
      data: obj
    })
}
  
// 验证二级密码
export function checkSecondPassword(query) {
    return request({
      url: '/admin/user/checkSecondPassword',
      method: 'get',
      params: query
    })
}

// 获取用户信息
export function getUserInfo() {
    return request({
      url: '/admin/user/info',
      method: 'get'
    })
}
