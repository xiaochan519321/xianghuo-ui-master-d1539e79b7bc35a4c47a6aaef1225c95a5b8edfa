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

export function getMenu(id) {
  return request({
    url: '/admin/menu',
    params: {parentId: id},
    method: 'get'
  })
}
export function getCurrentTenantMenu() {
  return request({
    url: '/admin/menu',
    method: 'get'
  })
}

export function getTopMenu() {
  return request({
    url: '/admin/menu',
    params: {type: 'top'},
    method: 'get'
  })
}

export function fetchMenuTree(lazy, parentId) {
  return request({
    url: '/admin/menu/tree',
    method: 'get',
    params: {lazy: lazy, parentId: parentId}
  })
}

export function fetchRoleMenuTree() {
  return request({
    url: '/admin/menu/roleTree',
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/menu',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/menu',
    method: 'put',
    data: obj
  })
}
