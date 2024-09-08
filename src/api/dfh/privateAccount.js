import request from '@/router/axios'

export function fetchList(query) {
    return request({
        url: '/dfh/pac/page',
        method: 'get',
        params: query
    })
}

export function getLoginCode(query) {
    return request({
        url: '/dfh/pac/getCode',
        method: 'get',
        params: query
    })
}

export function getAccountStatus(data) {
    return request({
        url: '/dfh/pac/getAccountStatus',
        method: 'post',
        data: data
    })
}

export function pddLogin(data) {
    return request({
        url: '/dfh/pac/saveLogin',
        method: 'post',
        data: data
    })
}

export function pddTodayMax(data) {
    return request({
        url: '/dfh/pac/editTodayMax',
        method: 'post',
        data: data
    })
}

export function switchPacStatus(data) {
    return request({
        url: '/dfh/pac/on_off',
        method: 'post',
        data: data
    })
}

export function deletePddAccount(data) {
    return request({
        url: '/dfh/pac/delete',
        method: 'post',
        data: data
    })
}

export function importTokens(data) {
    return request({
        url: '/dfh/pac/addTokens',
        method: 'post',
        data: data
    })
}

export function enableBatch(data) {
    return request({
        url: '/dfh/pac/enable_batch',
        method: 'post',
        data: data
    })
}

export function blockBatch(data) {
    return request({
        url: '/dfh/pac/block_batch',
        method: 'post',
        data: data
    })
}

export function updateUserMaxPlaceOrderCount(data) {
    return request({
        url: '/dfh/pac/updateUserMaxPlaceOrderCount',
        method: 'post',
        data: data
    })
}

// 获取个人号设置
export function getUserAccountConfig(query) {
    return request({
        url: '/dfh/accountConfig/getUserAccountConfig',
        method: 'get',
        params: query
    })
}

// 保存个人号设置
export function setUserAccountConfig(data) {
    return request({
        url: '/dfh/accountConfig/setUserAccountConfig',
        method: 'post',
        data: data
    })
}



