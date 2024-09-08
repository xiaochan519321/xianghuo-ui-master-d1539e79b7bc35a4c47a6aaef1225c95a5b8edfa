import request from '@/router/axios'

export default {
    // 统计当前店铺特权
    getStatisticalShopPrivilege(query) {
        return request({
            url: '/admin/sysShopPrivilege/statisticalShopPrivilege',
            method: 'get',
            params: query,
        });
    },
}
