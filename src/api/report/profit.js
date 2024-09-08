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
      url: '/dfh/report/profit/page',
      method: 'get',
      params: query
    })
  }

  export function fetchNewList(query) {
    return request({
        url: '/dfh/report/profit/getProfitList',
        method: 'get',
        params: query
    })
}

export function fetchCountList(query) {
  return request({
      url: '/dfh/report/profit/total',
      method: 'get',
      params: query
  })
}

export function fetchTotal(query) {
  return request({
    url: '/dfh/report/profit/total',
    method: 'get',
    params: query
  })
}

export function getProfitOption(query) {
  return request({
    url: '/dfh/report/profit/getOrderFilterRange',
    method: 'get',
    params: query
  })
}

export function getProfitData(query) {
  return request({
    // url: '/dfh/report/profit/getRealTimeProfitData',
    url: '/dfh/report/sales/data/getProfitStaisticsData',
    method: 'get',
    params: query
  })
}

export function exportProfitData() {
	return request({
	  url: '/dfh/report/profit/exportProfitData',
	  method: 'post',
	  responseType: 'blob'
	})
}

export function profitDataVerfiy(query) {
	return request({
	  url: '/dfh/report/profit/resynchronizeProfitData',
	  method: 'get',
      params: query
	})
}