import request from '@/router/axios'

export function getPointChart(query) {
    return request({
      url: '/dfh/statistics/getUserIntegralLogStatistics',
      method: 'get',
      params: query
    })
}

export function getVipChart(query) {
    return request({
      url: '/dfh/statistics/getUserMemberInfo',
      method: 'get',
      params: query
    })
}

export function getDataBoard(query) {
    return request({
      url: '/admin/promote/getDataBoard',
      method: 'get',
      params: query
    })
}

export function getPopularize(query) {
    return request({
      url: '/admin/promote/popularize',
      method: 'get',
      params: query
    })
}
