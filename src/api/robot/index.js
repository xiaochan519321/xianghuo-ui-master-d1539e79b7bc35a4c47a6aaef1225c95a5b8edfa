import request from '@/router/axios'

export function fetchList(query) {
    return request({
        url: '/dfh/robot/page',
        method: 'get',
        params: query
    })
}

export function fetchRecordList(query) {
    return request({
        url: '/dfh/robot/page',
        method: 'get',
        params: query
    })
}
