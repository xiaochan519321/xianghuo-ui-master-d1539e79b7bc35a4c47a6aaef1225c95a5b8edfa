import request from '@/router/axios'

export function signFetchList(query) {
  return request({
    url: '/dfh/dfhordersign/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/dfh/dfhordersign',
    method: 'post',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/dfh/dfhordersign/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/dfh/dfhordersign',
    method: 'put',
    data: obj
  })
}

export function bindObj(params) {
  return request({
    url: '/dfh/dfhordersign/bindingOrderSign',
    method: 'get',
    params: params
  })
}

