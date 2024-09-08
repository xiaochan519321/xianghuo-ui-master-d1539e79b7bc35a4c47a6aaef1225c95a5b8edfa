export const tableOption = {
    "align": "center",
    "index": true,
    "border": true,
    "column": [
    {
        "prop": "accessKeyId",
        "span": 12,
        "type": "input",
        "label": "accessKeyId",
        "rules": [{
            "message": "accessKeyId必须填写",
            "required": true
        }],
        "required": true
    },
    {
        "prop": "accessKeySecret",
        "span": 12,
        "type": "input",
        "label": "accessKeySecret",
        "rules": [{
            "message": "accessKeySecret必须填写",
            "required": true
        }],
        "required": true
    },
    {
        "prop": "templateCode",
        "span": 12,
        "type": "input",
        "label": "模板code",
        "rules": [{
            "message": "模板code必须填写",
            "required": true
        }],
        "required": true
    },
    {
        "prop": "signName",
        "span": 12,
        "type": "input",
        "label": "签名名称",
        "rules": [{
            "message": "签名名称必须填写",
            "required": true
        }],
        "required": true
    },
    {
        "prop": "channelId",
        "span": 12,
        "type": "select",
        "label": "短信渠道",
        "rules": [{
            "message": "请选择短信渠道",
            "required": true
        }],
		"dicUrl": '/admin/dict/type/sms_channel',
		"dicMethod": 'get',
        "display": true,
        "required": true,
        "cascaderItem": []
    },
    {
        "prop": "describe",
        "span": 12,
        "type": "input",
        "label": "描述"
    },],
    "gutter": 0,
    "stripe": true,
    "menuBtn": true,
    "emptyBtn": true,
    "emptyText": "清空",
    "menuAlign": "center",
    "submitBtn": true,
    "indexLabel": "序号",
    "labelWidth": 120,
    "submitText": "提交",
    "labelSuffix": "：",
    "menuPosition": "center",
    "labelPosition": "right",
    "searchMenuSpan": 6
}
