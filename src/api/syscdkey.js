import request from '@/router/axios'

// 查询卡密列表
export function fetchList(query) {
    return request({
        url: '/admin/syscdkey/page',
        method: 'get',
        params: query
    })
}

// 购买卡密
export function buyCdKey(obj) {
    return request({
        url: '/admin/syscdkey/buyCdKey',
        method: 'post',
        data: obj
    })
}

// 使用卡密
export function useCdKey(obj) {
    return request({
        url: '/admin/syscdkey/useCdKey',
        method: 'post',
        data: obj
    })
}

// 计算价格
export function calculatePrice(obj) {
    return request({
        url: '/admin/syscdkey/calculatePrice',
        method: 'post',
        data: obj
    })
}
