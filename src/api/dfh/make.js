import request from '@/router/axios'

export function fetchList(query) {
    return request({
        url: '/dfh/wellreceivedlog/page',
        method: 'get',
        params: query
    })
}



