export const tableOption = {
    "align": "center",
    "index": true,
    "border": false,
    "column": [
        {
            "label": '店铺ID',
            "prop": 'id',
            "type": 'input',
            "display": false, //新增编辑是否显示
        },
        {
            "prop": "shopName",
            "span": 12,
            "type": "input",
            "label": "店铺名称",
            "search": false,
            "required": true,
            "rules": [{
                "message": "请输入店铺名称",
                "required": true
            }]
        },
        {
            "prop": "platformId",
            "span": 12,
            "type": "select",
            "label": "所属平台",
            // "dicUrl": '/admin/dict/type/platform_id',
            // "dicMethod": 'get',
            dicData: [
                {
                    label: '抖音店铺',
                    value: '1',
                }, {
                    label: '淘宝店铺',
                    value: '2',
                },
            ],
            "cascaderItem": [],
            "required": true,
            "search": false,
            "rules": [{
                "message": "请选择所属平台",
                "required": true
            }],
            "value": "1"
        },
        // {
        //     "prop": "userName",
        //     "span": 12,
        //     "type": "input",
        //     "label": "店铺登录邮箱",
        //     "addDisplay": false, //新增是否显示
        //     "required": true,
        //     "labelWidth": 120,
        //     "showColumn": false,
        //     "rules": [{
        //         type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']
        //     }]
        // },
        // {
        //     "prop": "password",
        //     "span": 12,
        //     "type": "input",
        //     "label": "店铺登录邮箱密码",
        //     "addDisplay": false, //新增是否显示
        //     "required": true,
        //     "labelWidth": 130,
        //     "showColumn": false,
        //     "type": 'password',
        //     "value": ''
        // },

        {
            "prop": "authStatus",
            "span": 12,
            "type": "select",
            "label": "授权状态",
            "search": false,
            // "dicUrl": '/admin/dict/type/shop_auth_status',
            // "dicMethod": 'get',
            "display": false, //新增编辑是否显示
            "required": true, //是否开启校验
            "cascaderItem": [],
            "showColumn": true, //表格中是否显示
            "slot": true
        },
        {
            "label": '授权有效期',
            "prop": 'authExpireTime',
            "type": 'datetime',
            "format": 'yyyy-MM-dd HH:mm:ss',
            "valueFormat": 'timestamp',
            renderHeader: (h, { column, $index }) => {
                return h('div',[
                    h('span', '授权有效期'),
                    h('el-tooltip', {
                        props: {
                            class: 'ml10',
                            content: '因官方规定默认授权有效期为七天，七天后需重新授权一次',
                            placement: 'bottom',
                            effect: 'light'
                        }
                    }, [
                        h('i', { class: 'el-icon-question ml5', style: {fontSize: '18px'} }, '')
                    ])
                ])
            },
            "display": false,
        },
        {
            "label": '店铺到期时间',
            "prop": 'expireTime',
            "type": 'datetime',
            "format": 'yyyy-MM-dd HH:mm:ss',
            "valueFormat": 'timestamp',
            "display": false,
        },
        // {
        //     "prop": "cookiesStatus",
        //     "span": 12,
        //     "type": "select",
        //     "label": "cookies状态",
        //     "search": true,
        //     "searchLabelWidth": 120,
        //     "dicUrl": '/admin/dict/type/shop_cookies_status',
        //     "dicMethod": 'get',
        //     "display": false, //新增编辑是否显示
        //     "required": true, //是否开启校验
        //     "cascaderItem": [],
        //     "showColumn": true //表格中是否显示
        // },
        {
            "prop": "remark",
            "span": 24,
            "type": "textarea",
            "label": "备注",
            "display": true,
            showColumn: false,
        },
        /* {
            "width": 150,
            "label": '创建时间',
            "prop": 'createTime',
            "type": 'datetime',
            "display": false,
            "sortable": true,//排序
            "format": 'yyyy-MM-dd HH:mm',
            "valueFormat": 'yyyy-MM-dd HH:mm:ss'
        }, */
        {
            "label": '',
            "prop": 'bind', //绑定
            "span": 24,
            "formslot": true,
            "showColumn": false //表格中是否显示
        },
    ],
    "gutter": 0,
    "stripe": false,
    "menuBtn": true,
    "emptyBtn": true,
    "emptyText": "清空",
    "menuAlign": "center",
    "submitBtn": true,
    "indexLabel": "序号",
    "labelWidth": 120,
    "submitText": "提交",
    "menuPosition": "right", //表单保存取消按钮位置
    "labelPosition": "right",
    "searchMenuSpan": 6,
    addBtn: false,
    "addBtnText": '新增店铺',
    "emptyText": '暂时没有找到任何授权的店铺信息',
    "searchShow": true, //首次加载是否显示搜索
    "dialogWidth": '55%',//弹出框的宽度
    "editBtn": false, // 行编辑按钮
    "delBtn": false, // 行删除按钮

    refreshBtn: false, // 隐藏刷新按钮
    columnBtn: false,
    searchBtn: false,
    // header: false,
}
