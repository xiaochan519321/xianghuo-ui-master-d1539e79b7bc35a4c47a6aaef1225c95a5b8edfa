import request from '@/router/axios'

export default {
    // 保存-修改采购链接
    savePurchaseUrl(data) {
        return request({
            url: '/dfh/purchaseUrl/savePurchaseUrl',
            method: 'post',
            data: data,
        });
    },
    // 关联商品规格
    bindProductSpecsRelevant(data) {
        return request({
            url: '/dfh/productSpecsRelevant/bindProductSpecsRelevant',
            method: 'post',
            data: data,
        });
    },
    autoBindProductSpecsRelevant(data){
        return request({
            url: '/dfh/productSpecsRelevant/autoBindProductSpecsRelevant',
            method: 'post',
            data: data,
        });
    },
    // 获取拼多多sku列表
    getPddProductSkuList(params) {
        return request({
            url: '/dfh/pddProductSku/getPddProductSkuList',
            method: 'get',
            params: params,
        });
    },
    // 获取商品规格关联信息列表
    getProductSpecsRelevantList(params) {
        return request({
            url: '/dfh/productSpecsRelevant/getProductSpecsRelevantList',
            method: 'get',
            params: params,
        });
    },
    // 同步商品规格
    syncPddProductSku(params) {
        return request({
            url: '/dfh/pddProductSku/syncPddProductSku',
            method: 'get',
            params: params,
        });
    },
}
