export const tableOption = {
    "dialogWidth": '55%',//弹出框的宽度
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
    "addBtnText": '新增支付宝账号',
    "emptyText": '暂时没有绑定过任何支付账号',
    "searchShow": true, //首次加载是否显示搜索
    "editBtn": true, // 行编辑按钮
    "lazy": false,//是否懒加载
    "column": [
        {
            "type": "radio",
            "label": "账号类型",
            "prop": "usertype",
            "span": 12,
            "dicData": [
                {
                    "label": '个人账号',
                    "value": '1'
                },
                {
                    "label": '企业账号',
                    "value": '2'
                }
            ],
            "rules": [{
                "message": "请选择账号类型",
                "required": true
            }],
        },
        {
            "type": "input",
            "searchLabelWidth": 90,
            "label": "支付宝账号",
            "prop": "username",
            "rules": [{
                "message": "请输入账号",
                "required": true
            }],
        },
        {
            "type": "password",
            "label": "支付密码",
            "prop": "payCode",
            "span": 12,
            "rules": [{
                "message": "请输入6位支付密码",
                "required": true
            }],
            "hide": true
        },
        {
            "type": "password",
            "label": "确认支付密码",
            "prop": "affirmPayCode",
            "span": 12,
            "rules": [{
                "message": "请输入6位支付密码",
                "required": true
            }],
            "hide": true
        },
        {
            "type": "input",
            "label": "绑定店铺",
            "prop": "shopName",
            "span": 12,
            "display": false, //新增编辑是否显示
            "align": "center",
            "slot": true
        },
        {
            "type": "input",
            "label": "绑定店铺ID",
            "prop": "shopId",
            "span": 12,
            "align": "center",
            "showColumn":false, //表格中是否显示
            "display": false, //新增编辑是否显示
        },
         {
            "type": "input",
            "label": "绑定ID",
            "prop": "bingdingId",
            "span": 12,
            "align": "center",
            "showColumn":false, //表格中是否显示
            "display": false, //新增编辑是否显示
        },
        {
            "type": "input",
            "label": "支付账号ID",
            "prop": "id",
            "span": 12,
            "showColumn":false, //表格中是否显示
            "display": false, //新增编辑是否显示
        },
        {
            "type": "textarea",
            "label": "备注",
            "prop": "remark",
            "align": "center",
            "span": 24
        },
        {
            "label": '状态',
            "prop": 'lockFlag',
            "type": 'radio',
            "slot": true,
            "border": true,
            "span": 24,
            "align": "left",
            "value": '0',
            "rules": [{
                "required": true,
                "message": '请选择状态',
                "trigger": 'blur'
            }],
            "dicData": [{
                "label": '正常',
                "value": '0'
            }, {
                "label": '异常',
                "value": '9'
            }]
        },
    ]
}
