import request from '@/router/axios'

export function fetchCustomerList(query) {
    return request({
      url: '/admin/merchant/getCustomerAgent',
      method: 'get',
      params: query
    })
  }