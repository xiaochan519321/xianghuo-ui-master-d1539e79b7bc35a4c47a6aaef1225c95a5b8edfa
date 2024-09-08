export const tableOption = {
    "border": true,
    "index": true,
    "indexLabel": "序号",
    "stripe": false,
    "menuAlign": "center",
    "align": "center",
    "searchMenuSpan": 6,
    "editBtn": false, // 行编辑按钮
    "delBtn": false, // 行删除钮
    "addBtn": false, // 新增按钮
    "menu": false,
    "excelBtn": true,
    "column": [
        {
            "type": "input",
            "label": "所属订单ID",
            "width": 180,
            "prop": "orderId",
            "span": 8
        },
        {
            "type": "input",
            "label": "采购订单ID",
            "width": 180,
            "prop": "outerOrderId",
            "span": 8
        },
        {
            "prop": "type",
            "span": 8,
            "type": "select",
            "label": "类型",
            // "search": true,
            "width": 80,
            "dicData": [{
                "label": '收入',
                "value": '1'
            }, {
                "label": '支出',
                "value": '2'
            }, {
                "label": '充值',
                "value": '3'
            }],
        }, {
            "prop": "spendingType",
            "span": 8,
            "type": "select",
            "label": "支出类型",
            // "search": true,
            "dicData": [{
                "label": '下单扣除',
                "value": 0
            }, {
                "label": '优惠卷扣除',
                "value": 1
            }, {
                "label": '管理员回收',
                "value": 2
            }, {
                "label": '过滤代发短信',
                "value": 5
            }, {
                "label": '商品动销',
                "value": 6
            }, {
                "label": '好评返现',
                "value": 7
            }, {
                "label": '搜索排名',
                "value": 8
            }, {
                "label": '选品罗盘',
                "value": 9
            }],
        },
        {
            "prop": "incomeType",
            "span": 8,
            "type": "select",
            "label": "收入类型",
            // "search": true,
            "dicData": [{
                "label": '积分充值',
                "value": 0
            }, {
                "label": '管理员赠送',
                "value": 1
            },
            {
                "label": '注册赠送',
                "value": 2
            },
            {
                "label": '退回积分',
                "value": 3
            }
        ],
        },
        {
            "type": "input",
            "label": "变更前积分",
            "prop": "qcNum",
            "width": 100,
            "span": 12
        },
        {
            "type": "input",
            "label": "变更积分",
            "prop": "bdNum",
            "width": 100,
            "span": 12
        },
        {
            "type": "input",
            "label": "变更后积分",
            "prop": "qmNum",
            "width": 100,
            "span": 12
        },
        {
            "prop": "createTime",
            "span": 12,
            "type": "date",
            "label": "创建时间",
            "format": "yyyy-MM-dd HH:mm:ss",
            "display": true,
            "valueFormat": "yyyy-MM-dd HH:mm:ss",
            "editDisabled": true,
            "addDisabled": true,
            "width": 150
        },
        {
            "type": "input",
            "label": "赠送人",
            "prop": "zsrUsername",
            "span": 12
        }]
}
