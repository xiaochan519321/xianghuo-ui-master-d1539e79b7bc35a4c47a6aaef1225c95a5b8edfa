import { categorys } from '../global/index';

export const tableOption = {
    "align": "center",
    "selection":true,
    selectionWidth: 60,
    "column": [
        {
            label: "商品信息",
            prop: "goodsInfo",
            slot: true,
            minWidth: 300
        },
        // {
        //     "width": 160,
        //     "prop": 'categoryDetail',
        //     "span": 24,
        //     "type": 'cascader',
        //     "label": '商品分类',
        //     "display": true,
        //     "cascaderIndex": 1,
        //     "showAllLevels": true,
        //     "searchCheckStrictly": true,
        //     'dicData': categorys,
        //     "separator": '/',
        //     "props": {
        //         "label": 'label',
        //         "value": 'value'
        //     },
        //     "slot": true,
        //     "search": false
        // },
        // {
        //     "width": 150,
        //     label: '上家对应商品链接',
        //     prop: 'purchaseUrl',
        //     slot: true
        // },
        {
            
            type: "input",
            label: "商品价格",
            prop: "discountPrice",
            span: 12,
            slot: true,
        },
        {
            minWidth: 150,
            label: '创建时间',
            prop: 'createTime',
            type: 'datetime',
            display: false,
            sortable: true,//排序
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm:ss'
        },
        {
            type: "select",
            label: "店铺",
            minWidth: 200,
            prop: "shopId",
            span: 12,
            slot: true,
            "props": {
                "label": "shopName",
                "value": "id"
            },
            "rules": [{
                "message": "必须选择会员套餐",
                "required": true
            }],
            "dicUrl": '/dfh/shop/getAllList',
            "dicMethod": 'get',
        },
        {
            minWidth: 150,
            label: '七天内有销量数',
            prop: 'count7',
        },
        {
            minWidth: 150,
            label: '操作',
            prop: 'purchaseUrl',
            slot: true
        },
    ],
    "gutter": 0,
    "border":true,
    "stripe": false,
    "menuBtn": true,
    "emptyBtn": true,
    "menuAlign": "center",
    "submitBtn": true,
    "labelWidth": 120,
    "submitText": "提交",
    "menuPosition": "right", //表单保存取消按钮位置
    "labelPosition": "right",
    "searchMenuSpan": 6,
    "emptyText": '暂时没有找到任何授权的店铺信息',
    "searchShow": true, //首次加载是否显示搜索
    "dialogWidth": '55%',//弹出框的宽度
    "editBtn": false, // 行编辑按钮
    "delBtn": false, // 行删除钮
    "addBtn": false, // 新增按钮
    "menu": false, //不显示操作
}
