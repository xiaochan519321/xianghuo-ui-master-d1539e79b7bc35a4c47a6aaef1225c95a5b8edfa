import request from '@/router/axios'

export default {
    // 获取店铺授权链接
    getShopAuthUrl(query) {
        return request({
            url: '/dfh/shop/getShopAuthUrl',
            method: 'get',
            params: query,
        });
    },
}
