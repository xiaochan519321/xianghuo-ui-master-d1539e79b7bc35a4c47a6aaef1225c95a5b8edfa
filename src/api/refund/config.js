import request from '@/router/axios'

export function fetchList(query) {
    return request({
        url: '/dfh/autoaftersalelog/page',
        method: 'get',
        params: query
    })
}

export function loadConfig(query) {
    return request({
        url: '/dfh/autoaftersaleconfig/getDfhAutoAfterSaleConfig',
        method: 'get',
        params: query
    })
}



export function setConfig(obj) {
    return request({
        url: '/dfh/autoaftersaleconfig/updateAutoAftersaleConfig',
        method: 'post',
        data: obj
    })
}
