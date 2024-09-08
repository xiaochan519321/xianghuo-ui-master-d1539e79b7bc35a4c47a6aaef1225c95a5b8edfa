export const tableOption = {
    "height": "700px",//表格高度
    "index": true,
    "indexLabel": "序号",
    "menuAlign": "center",
    rowKey: 'id',
    expand: true,
    "column": [
        // 订单的头部信息 订单编号、下单时间、收货信息等...
        {
            label: '',
            prop: 'item_info',
            width: 1,
            slot: true
        },
        {
            label: '订单商品信息',
            prop: 'product_info',
            slot: true,
            minWidth: 200,
            "align": "center",
        },
        {
            label: '订单信息',
            prop: 'order_money_info',
            minWidth: 120,
            slot: true,
            "align": "center",
        },
        {
            label: '平台状态',
            prop: 'status',
            slot: true,
            "align": "center",
        },
        {
            label: '利润',
            prop: 'profit',
            slot: true,
            "align": "center",
        },
        {
            label: '关联采购商品规格',
            prop: 'relevance_pdd_product_spec',
            minWidth: 120,
            "align": "center",
            slot: true
        },
    ],
    "selection": true,
    "gutter": 0,
    "menuBtn": true,
    "emptyBtn": true,
    "submitBtn": true,
    "labelWidth": 120,
    "menuWidth": 200,
    "submitText": "提交",
    "menuPosition": "right", //表单保存取消按钮位置
    "labelPosition": "right",
    "searchIndex": 5,
    "searchIcon": false,
    "searchShowBtn": false,
    "emptyText": '暂时没有找到任何订单信息',
    "searchMenuSpan": 6,
    "searchShow": true, //首次加载是否显示搜索
    "dialogWidth": '55%',//弹出框的宽度
    "editBtn": false, // 行编辑按钮
    "delBtn": false, // 行删除钮
    "addBtn": false, // 新增按钮
    "tip": false, //不显示头部多选清空信息
    //"menu":false //不显示操作

    refreshBtn: false, // 隐藏刷新按钮
    columnBtn: false,
    searchBtn: false,
    header: false,
}
