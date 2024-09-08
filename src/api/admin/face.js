

import request from '@/router/axios'

//分页查询面单充值     
export function facePageList(query) {
  return request({
    url: '/admin/face/page',
    method: 'get',
    params: query
  })
}

//分页查询用户面单充值     
export function faceList(query) {
  return request({
    url: '/admin/face/qryinfo',
    method: 'get',
    params: query
  })
}

//分页查询面单充值明细   
export function faceDetailList(query) {
  return request({
    url: '/admin/facerechargedetail/page',
    method: 'get',
    params: query
  })
}