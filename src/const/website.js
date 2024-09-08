export default {
    firstLoad: true,
    title: '',
    subtitle: '',
    htLogo: '',
    icon: '',
    copyright: '',
    // 图片域名
    imgDomain: "http://bucket.damaijia.co/",
    isFirstPage: true,// 配置首页不可关闭
    mainSiteFlag: true,
    key: 'lzyq', // 配置主键,目前用于存储
    whiteList: ['/login', '/register', '/404', '/401', '/lock', 'pdd'], // 配置无权限可以访问的页面
    whiteTagList: ['/login', '/register', '/404', '/401', '/lock'], // 配置不添加tags页面 （'/advanced-router/mutative-detail/*'——*为通配符）
    fistPage: {
        label: '工作台',
        value: '/dashboard/index',
        params: {},
        query: {},
        group: [],
        close: false
    },
    // 商务客服微信
    WXQrCode: '',
    // 配置菜单的属性
    menu: {
        props: {
            label: 'label',
            path: 'path',
            icon: 'icon',
            children: 'children'
        }
    }
}
