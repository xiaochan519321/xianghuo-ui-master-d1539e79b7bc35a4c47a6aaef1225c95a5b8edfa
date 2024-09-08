

import request from '@/router/axios'

//分页查询代理信息
export function agentinfoList(query) {
  return request({
    url: '/admin/agentinfo/page',
    method: 'get',
    params: query
  })
}
//添加代理信息
export function addObj(obj) {
  return request({
    url: '/admin/agentinfo/add',
    method: 'post',
    data: obj
  })
}
//更改代理信息
export function putObj(obj) {
  return request({
    url: '/admin/agentinfo/upd',
    method: 'post',
    data: obj
  })
}

//分页查询代理级别
export function leverinfoList(query) {
  return request({
    url: '/admin/lever/page',
    method: 'get',
    params: query
  })
}
//更改代理级别
export function updleverObj(obj) {
  return request({
    url: '/admin/lever/upd',
    method: 'post',
    data: obj
  })
}

//分页查询代理奖励
export function rewarddetailList(query) {
  return request({
    url: '/admin/rewarddetail/page',
    method: 'get',
    params: query
  })
}

//分页查询当前用户奖励信息
export function awardList(query) {
  return request({
    url: '/admin/rewarddetail/qryinfo',
    method: 'get',
    params: query
  })
}

//分页查询代理审核     
export function auditList(query) {
  return request({
    url: '/admin/agentexamine/page',
    method: 'get',
    params: query
  })
}
//代理审核通过
export function sucObj(obj) {
  return request({
    url: '/admin/agentexamine/suc',
    method: 'post',
    data: obj
  })
}
//代理审核拒绝
export function failObj(obj) {
  return request({
    url: '/admin/agentexamine/fail',
    method: 'post',
    data: obj
  })
}