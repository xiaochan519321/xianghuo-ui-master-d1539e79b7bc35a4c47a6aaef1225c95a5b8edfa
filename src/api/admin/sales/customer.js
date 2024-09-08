import request from '@/router/axios'


export function getNotSalesMerchant(obj) {
    return request({
      url: '/admin/merchant/getNotSalesMerchant',
      method: 'post',
      params: obj
    })
  }

  export function getSalesBDMerchantList(obj) {
    return request({
      url: '/admin/merchant/getSalesBDMerchantList',
      method: 'post',
      params: obj
    })
  }

  export function binding(obj) {
    return request({
      url: '/admin/syssalesbinding/binding',
      method: 'post',
      data: obj
    })
  }

  export function delObj(merchantId) {
    return request({
      url: '/admin/syssalesbinding/delBinding?merchantId=' + merchantId,
      method: 'post'
    })
  }

  export function feathData(obj) {
    return request({
      url: '/admin/merchant/getCustomerMerchantPage',
      method: 'get',
      params: obj
    })
  }