

import request from '@/router/axios'

//分页查询充值点券   
export function ticketPageList(query) {
  return request({
    url: '/admin/tickets/page',
    method: 'get',
    params: query
  })
}

//查询充值点券总金额     
export function sumTickets(query) {
  return request({
    url: '/admin/tickets/sumTickets',
    method: 'get',
    params: query
  })
}

//分页查询充值点券明细   
export function ticketDetailList(query) {
  return request({
    url: '/admin/tickets/detail/page',
    method: 'get',
    params: query
  })
}
//管理员充值点券
export function addTickets(obj) {
  return request({
    url: '/admin/tickets/addTickets',
    method: 'post',
    data: obj
  })
}