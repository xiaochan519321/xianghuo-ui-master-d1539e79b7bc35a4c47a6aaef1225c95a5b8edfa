import Layout from '@/page/index/'

export default [{
    path: '/login',
    name: '登录页',
    component: () =>
        import(/* webpackChunkName: "page" */ '@/page/login/index'),
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/index',
    name: '首页',
    component: () =>
        import(/* webpackChunkName: "page" */ '@/page/login/index2'),
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
// 注册
{
    path: '/register',
    name: '注册页',
    component: () =>
        import(/* webpackChunkName: "page" */ '@/page/register/index'),
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/lock',
    name: '锁屏页',
    component: () =>
        import(/* webpackChunkName: "page" */ '@/page/lock/index'),
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/404',
    component: () =>
        import(/* webpackChunkName: "page" */ '@/components/error-page/404'),
    name: '404',
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: true
    }

},
{
    path: '/403',
    component: () =>
        import(/* webpackChunkName: "page" */ '@/components/error-page/403'),
    name: '403',
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/500',
    component: () =>
        import(/* webpackChunkName: "page" */ '@/components/error-page/500'),
    name: '500',
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/',
    name: '工作台',
    redirect: '/login'
},
{
    path: '/myiframe',
    component: Layout,
    redirect: '/myiframe',
    children: [{
        path: ':routerPath',
        name: 'iframe',
        component: () =>
            import(/* webpackChunkName: "page" */ '@/components/iframe/main'),
        props: true
    }]
},
{
    path: '*',
    redirect: '/404'
},
{
    path: '/authredirect',
    name: '授权页',
    component: () =>
        import(/* webpackChunkName: "page" */ '@/page/login/authredirect'),
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
}, {
    path: '/pdd',
    name: '登录页',
    component: () =>
        import(/* webpackChunkName: "page" */ '@/page/pdd/index'),
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
// 数据大屏
{
    path: '/liveDetail/index',
    name: '数据大屏',
    component: () =>
        import(/* webpackChunkName: "page" */ '@/views/liveDetail/index'),
    meta: {
        keepAlive: false,
        isTab: false,
        isAuth: false
    }
},
// 数据大屏 - 改版
{
    path: '/liveDetail/revision/index',
    name: '新数据大屏',
    component: () => import(/* webpackChunkName: "page" */ '@/views/liveDetail/revision/index'),
    meta: {
        keepAlive: false,
        isTab: false,
        isAuth: false
    }
},
// 供应链商品详情
{
    path: '/dfh/product/detail',
    name: '供应链商品详情',
    component: () => import(/* webpackChunkName: "page" */ '@/views/dfh/product/detail'),
    meta: {
        keepAlive: false,
        isTab: false,
        isAuth: true
    }
}
]
