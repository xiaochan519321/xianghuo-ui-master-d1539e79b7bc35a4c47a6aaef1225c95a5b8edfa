import request from '@/router/axios'
export function pddUserList(obj) {
  return request({
    url: '/dfh/pdduser/userList',
    method: 'post',
    data: obj
  })
}
export function pddGetCode(phone) {
  return request({
    url: '/dfh/pdduser/sendCode/phone='+phone,
    method: 'get'
  })
}
export function pddLogin(phone,code) {
  return request({
    url: `/dfh/pdduser/loginPhone/phone=${phone}/code=${code}`,
    method: 'get'
  })
}
export function orderInfoForTime() {
  return request({
    url: '/dfh/lds/getOrderInfoForTime',
    method: 'get'
  })
}
export function getOrderInfo(obj) {
  return request({
    url: '/dfh/lds/getOrder',
    method: 'post',
    data: obj
  })
}