import Layout from '@/page/index/'

export default [
    {
        path: '/info',
        component: Layout,
        redirect: '/info/index',
        children: [{
            path: 'index',
            name: '账户中心',
            component: () =>
                import(/* webpackChunkName: "page" */ '@/views/admin/user/info')
        }]
    },
    {
        path: '/activti',
        component: Layout,
        redirect: '/activti/detail',
        children: [{
            path: 'detail/:id',
            component: () =>
                import(/* webpackChunkName: "views" */ '@/views/activiti/detail')
        }]
    },
    // 售后管理 - 抖店售后工作台 - 售后详情
    {
        path: '/aftersales/doudian',
        component: Layout,
        redirect: '/aftersales/doudian/aftelDetails',
        children: [{
            path: 'aftelDetails',
            name: '售后详情',
            component: () =>
                import(/* webpackChunkName: "views" */ '@/views/aftersales/doudian/aftelDetails')
        }],
    },

    // 充值中心 - 积分充值
    {
        path: '/recharge',
        component: Layout,
        redirect: '/recharge/index',
        children: [{
            path: 'index',
            name: '积分充值',
            component: () =>
                import(/* webpackChunkName: "views" */ '@/views/recharge/index')
        }],
    },
    // 充值中心 - 面单充值
    {
        path: '/express',
        component: Layout,
        redirect: '/express/index',
        children: [{
            path: 'index',
            name: '面单充值',
            component: () =>
                import(/* webpackChunkName: "views" */ '@/views/express/index')
        }],
    },
    // 充值中心 - 点券充值
    {
        path: '/ticket',
        component: Layout,
        redirect: '/ticket/index',
        children: [{
            path: 'index',
            name: '点券充值',
            component: () =>
                import(/* webpackChunkName: "views" */ '@/views/ticket/index')
        }],
    },
    // 首页 环比销售订单统计 - 详情列表
    {
        path: '/dashboard',
        component: Layout,
        children: [{
            path: 'ringCompare',
            name: ' 环比销售订单统计',
            component: () =>
                import(/* webpackChunkName: "views" */ '@/views/dashboard/pages/ringCompare')
        }],
    },
    // 首页 热销商品 - 详情列表
    {
        path: '/dashboard',
        component: Layout,
        children: [{
            path: 'hotSalesDetail',
            name: ' 热销商品统计',
            component: () =>
                import(/* webpackChunkName: "views" */ '@/views/dashboard/pages/hotSalesDetail')
        }],
    },
    // 首页  店铺销售订单/店铺销售额 - 详情列表
    {
        path: '/dashboard',
        component: Layout,
        children: [{
            path: 'shopOrderDetail',
            name: ' 店铺数据详情列表',
            component: () =>
                import(/* webpackChunkName: "views" */ '@/views/dashboard/pages/shopOrderDetail')
        }],
    },
    // 首页  店铺销售订单/店铺销售额 - 详情列表
    {
        path: '/operate',
        component: Layout,
        children: [{
            path: 'compass/detail',
            name: '选品罗盘详情',
            component: () => import(/* webpackChunkName: "views" */ '@/views/operate/compass/detail'),
            meta: {
                keepAlive: false,
                isTab: false,
                isAuth: true
            }
        }],
    },
    // 首页  店铺销售订单/店铺销售额 - 详情列表
    {
        path: '/admin',
        component: Layout,
        children: [{
            path: 'expressSheet/index',
            name: '面单日志',
            component: () => import(/* webpackChunkName: "views" */ '@/views/admin/expressSheet/index'),
            meta: {
                keepAlive: false,
                isTab: true,
                isAuth: true
            }
        }],
    },
    {
        path: '/illegal',
        component: Layout,
        redirect: '/illegal/index',
        children: [{
            path: 'index',
            name: '筛选违规',
            component: () =>
                import(/* webpackChunkName: "views" */ '@/views/outTools/illegal/index')
        }],
    },
    {
        path: '/choose',
        component: Layout,
        redirect: '/choose/index',
        children: [{
            path: 'index',
            name: '同行竞品',
            component: () =>
                import(/* webpackChunkName: "views" */ '@/views/outTools/choose/index')
        }],
    },
]
