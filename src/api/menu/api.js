import request from '@/router/axios'

export function getExpiredShopNum() {
  return request({
    url: '/dfh/shop/getExpiredShopNum',
    method: 'get'
  })
}

export function getShippedOrderNum() {
  return request({
    url: '/dfh/order/getShippedOrderNum',
    method: 'get'
  })
}

export function getAfterSaleOrderNum() {
  return request({
    url: '/dfh/aftersale/getAfterSaleOrderNum',
    method: 'get'
  })
}