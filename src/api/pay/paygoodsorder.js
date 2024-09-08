import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/pay/goods/page',
    method: 'get',
    params: query
  })
}

export function recharge(obj) {
  return request({
    url: '/pay/goods/merge/recharge',
    method: 'post',
    data: obj
  })
}

export function getRechargePayStatus(id) {
  return request({
    url: '/pay/goods/getRechargePayStatus?payOrderId=' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/pay/goods',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/pay/goods/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/pay/goods/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/pay/goods',
    method: 'put',
    data: obj
  })
}

export function rechargeGoodsList(query) {
  return request({
    url: '/pay/goods/getUserRechargeRecordPage',
    method: 'get',
    params: query
  })
}

//充值积分
export function placePay(amt) {
  return request({
    url: '/pay/alipay/place?amt' + '=' + amt + '&' + 'type' + '=' + 1,
    method: 'post'
  })
}
//充值点券
export function ticketPay(amt) {
  return request({
    url: '/pay/alipay/place?amt' + '=' + amt + '&' + 'type' + '=' + 2,
    method: 'post'
  })
}