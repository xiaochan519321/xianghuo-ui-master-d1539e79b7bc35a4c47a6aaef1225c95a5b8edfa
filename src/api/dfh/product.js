import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/dfh/product/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/dfh/product',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/dfh/product/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/dfh/product/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/dfh/product',
    method: 'put',
    data: obj
  })
}

export function syncProduct() {
  return request({
    url: '/dfh/product/syncProduct',
    method: 'post'
  })
}

export function getPurchaseUrl(query) {
  return request({
    url: '/dfh/product/getPurchaseUrl',
    method: 'get',
    params: query
  })
}

export function syncPddSpec(query) {
  return request({
    url: '/dfh/product/syncPddSpec',
    method: 'get',
    params: query
  })
}
//更新sku
export function updatePddSpec(query) {
  return request({
    url: '/dfh/goodsCorrelation/get',
    method: 'get',
    params: query
  })
}

export function getPurchaseUrlAndSku(query) {
  return request({
    url: '/dfh/product/getPurchaseUrlAndSku',
    method: 'get',
    params: query
  })
}

export function savePurchaseUrl(obj,productId) {
  return request({
    url: '/dfh/product/savePurchaseUrl?productId='+productId,
    method: 'post',
    data: obj
  })
}

export function saveOrderPurchaseUrl(obj,orderId) {
  return request({
    url: '/dfh/product/saveOrderPurchaseUrl?orderId='+orderId,
    method: 'post',
    data: obj
  })
}


export function updatePurchaseUrl(obj) {
  return request({
    url: '/dfh/product/updatePurchaseUrl',
    method: 'put',
    data: obj
  })
}

export function editPurchaseUrl(obj) {
  return request({
    url: '/dfh/product/editPurchaseUrl',
    method: 'put',
    data: obj
  })
}

export function syncJtAllSpec(query) {
  return request({
    url: '/dfh/productSpecsRelevant/syncJtAllSpec',
    method: 'get',
    params: query
  })
}

export function batchIsolation(obj) {
  return request({
    url: '/dfh/product/isolationProduct',
    method: 'post',
    data: obj
  })
}

export function getPddSpecList(query) {
  return request({
    url: '/dfh/pddProductSku/getPddProductSkuListByGoodsId',
    method: 'get',
    params: query
  })
}

export function savePddWelfareGoods(obj) {
  return request({
    url: '/dfh/product/relevantPddWelfareGoods',
    method: 'post',
    data: obj
  })
}

export function cancelPddWelfareGoods(obj) {
  return request({
    url: '/dfh/product/cancelRelevantPddWelfareGoods',
    method: 'post',
    data: obj
  })
}

export function searchPlatformProduct(params) {
  return request({
    url: '/dfh/product/searchPlatformProduct',
    method: 'get',
    params: params
  })
}

export function getPlatformProductDetails(params) {
  return request({
    url: '/dfh/product/getPlatformProductDetails',
    method: 'get',
    params: params
  })
}

export function syncSupplierSpec(query) {
  return request({
    url: '/dfh/product/syncSpec',
    method: 'get',
    params: query
  })
}

export function sync1688DfSpec(query) {
  return request({
    url: '/dfh/product/sync1688DfSpec',
    method: 'get',
    params: query
  })
}

export function syncSpecTaote(query) {
  return request({
    url: '/dfh/product/syncSpecTaote',
    method: 'get',
    params: query
  })
}

export function getSupplyProductDetail(params) {
  return request({
      url: '/dfh/supplyProduct/getProductDetail',
      method: 'get',
      params: params
  })
}

export function getURLGoodsId(query) {
  return request({
    url: '/dfh/product/getURLGoodsId',
    method: 'get',
    params: query
  })
}