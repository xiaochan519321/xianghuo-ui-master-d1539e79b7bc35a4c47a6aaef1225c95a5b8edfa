import request from '@/router/axios'

export function createGenerateLink(obj) {
  return request({
    url: '/dfh/promotionLink/generateLink',
    method: 'post',
    data: obj
  })
}

export function getList(query) {
  return request({
    url: '/dfh/promotionLink/getPage',
    method: 'get',
    params: query
  })
}

export function createRankSearch(obj) {
  return request({
    url: '/dfh/searchRanking/generate',
    method: 'post',
    data: obj
  })
}

export function getRankList(query) {
  return request({
    url: '/dfh/searchRanking/getPage',
    method: 'get',
    params: query
  })
}

export function getPointAmount(query) {
  return request({
    url: '/dfh/searchRanking/calculateTotalAmount',
    method: 'get',
    params: query
  })
}

// 罗盘搜索列表
export function getSearchList(query) {
  return request({
    url: '/dfh/searchSelection/getPage',
    method: 'get',
    params: query
  })
}

// 罗盘搜索结果列表
export function getSearchDetailList(query) {
  return request({
    url: '/dfh/selectionRecommend/getPage',
    method: 'get',
    params: query
  })
}

// 创建罗盘搜索
export function createSearchGenerate(query) {
  return request({
    url: '/dfh/searchSelection/generate',
    method: 'get',
    params: query
  })
}

// 选品罗盘消耗积分
export function getSearchPointAmount(query) {
  return request({
    url: '/dfh/searchSelection/calculateAmount',
    method: 'get',
    params: query
  })
}

