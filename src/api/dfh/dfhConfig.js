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


export function saveConfig(obj) {
  return request({
    url: '/dfh/dfhConfig',
    method: 'post',
    data: obj
  })
}

export function getConfig() {
  return request({
    url: '/dfh/dfhConfig',
    method: 'get'
  })
}

export function updateAccountOrderMode(params) {
  return request({
    url: '/dfh/dfhConfig/updateAccountOrderMode',
    method: 'get',
    params: params
  })
}


