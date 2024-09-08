import request from '@/router/axios'
export function fetchList(query) {
    return request({
        url: '/dfh/report/sales/data/getSalesOrderList',
        method: 'get',
        params: query
    })
}

export function fetchRefundList(query) {
    return request({
        url: '/dfh/report/sales/data/getSalesRefundOrderList',
        method: 'get',
        params: query
    })
}

export function fetchExport(data) {
    return request({
        url: '/dfh/report/sales/data/exportSalesData',
        method: 'post',
        data: data,
        responseType: 'blob'
    })
}

export function fetchRefundExport(data) {
    return request({
        url: '/dfh/report/sales/data/exportSalesRefundData',
        method: 'post',
        data: data,
        responseType: 'blob'
    })
}
