
// 首页 相关接口
import request from '@/router/axios'

export default {
    // 实时数据看板
    getRealTimeDataBoard(query) {
        return request({
            url: '/dfh/statistics/realTimeDataBoardNew',
            method: 'get',
            params: query,
        });
    },
    // 账号积分统计
    getAccountPoints() {
        return request({
            url: '/dfh/statistics/points',
            method: 'get',
        });
    },
    // 获取店铺列表
    getShopList(query) {
        return request({
            url: '/dfh/shop/getAllList',
            method: 'get',
            params: query,
        });
    },
    // 环比销售订单统计
    getChainOrder(query) {
        return request({
            url: '/dfh/statistics/chainOrder',
            method: 'get',
            params: query,
        });
    },
    // 环比销售订单统计详情列表
    getChainOrderDetail(query) {
        return request({
            url: '/dfh/statistics/chainOrderDetail',
            method: 'get',
            params: query,
        });
    },
    // 热销商品
    getHotSales(query) {
        return request({
            url: '/dfh/statistics/hotSales',
            method: 'get',
            params: query,
        });
    },
    // 热销商品统计详情列表数据
    getHotSalesDetail(query) {
        return request({
            url: '/dfh/statistics/hotSalesDetail',
            method: 'get',
            params: query,
        });
    },
    // 店铺销售订单统计
    getShopOrder(query) {
        return request({
            url: '/dfh/statistics/shopOrder',
            method: 'get',
            params: query,
        });
    },
    // 店铺销售额统计
    getShopSale(query) {
        return request({
            url: '/dfh/statistics/shopSale',
            method: 'get',
            params: query,
        });
    },
    // 店铺销售订单统计、店铺销售额统计 合并返回
    getshopSales(query) {
        return request({
            url: '/dfh/statistics/shopSales',
            method: 'get',
            params: query,
        });
    },
    // 店铺销售订单- 销售额统计详情列表数据
    getShopSaleDetail(query) {
        return request({
            url: '/dfh/statistics/shopSaleDetail',
            method: 'get',
            params: query,
        });
    },
    // 今日待办统计
    getAgencyCount(query) {
        return request({
            url: '/dfh/statistics/getAgencyCount',
            method: 'get',
            params: query,
        });
    },
    // 实时数据看版售后部分
    getRealTimeRefundDataBoard(query) {
        return request({
            url: '/dfh/statistics/realTimeDataBoardAfterSale',
            method: 'get',
            params: query,
        });
    },
    // 获取站点层级
    fetchSitesTree(query) {
        return request({
            url: '/admin/site/tree',
            method: 'get',
            params: query
        })
    },
    // 获取某个站点下面的商家列表
    fetchMerchantList(query) {
        return request({
            url: '/admin/merchant/page',
            method: 'get',
            params: query
        })
    },
    // 获取站点下面的商家列表(主站，系统管理员可用)
    systemMerchantList(query) {
        return request({
            url: '/admin/merchant/getMerchantList',
            method: 'get',
            params: query
        })
    },
    // 导出站点数据
    exportDashboard(data) {
        return request({
          url: '/dfh/statistics/exportRealTimeDate',
          method: 'post',
          data: data,
          responseType: 'blob'
        })
    },
    // 管理端积分充值记录情况图表
    getInitPointData (query) {
        return request({
            url: '/dfh/statistics/getIntegralLogForTime',
            method: 'get',
            params: query
        })
    },
    // 管理端会员开通情况图表
    getInitVipData (query) {
        return request({
            url: '/dfh/statistics/getAllMemberInfo',
            method: 'get',
            params: query
        })
    },
    // 管理端订单统计图表
    getAdminOrderInfo (query) {
        return request({
            url: '/dfh/statistics/getOrderInfoForTime',
            method: 'get',
            params: query
        })
    },

    // 数据大屏相关接口

    // 数据大屏 店铺单量排行
    getStatisticsShopOrders(query) {
        return request({
            url: 'dfh/statistics/shopOrders',
            method: 'get',
            params: query,
        });
    },
    // 数据大屏 采购量比例
    getStatisticsPurchaseRatio(query) {
        return request({
            url: 'dfh/statistics/purchaseRatio',
            method: 'get',
            params: query,
        });
    },
    // 数据大屏 订单走向
    getStatisticsOrderTrend(query) {
        return request({
            url: 'dfh/statistics/orderTrend',
            method: 'get',
            params: query,
        });
    },
    // 数据大屏 基础数据面板
    getTodayRealTimeData(query) {
        return request({
            url: '/dfh/lds/getTodayRealTimeData',
            method: 'get',
            params: query,
        });
    },
    // 数据大屏 热销商品排行
    getHotProductNum(query) {
        return request({
            url: '/dfh/lds/getHotProductNum',
            method: 'get',
            params: query,
        });
    },
    // 数据大屏 近一月订单走势
    getOrderInfoForTime(query) {
        return request({
            url: '/dfh/lds/getOrderInfoForTime',
            method: 'get',
            params: query,
        });
    },
}
