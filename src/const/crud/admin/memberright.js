export const tableOption = {
  "border": true,
  "index": true,
  "indexLabel": "序号",
  "menuAlign": "center",
  "align": "center",
  "searchMenuSpan": 6,
  "column": [
    {
      "type": "input",
      "label": "套餐名称",
      "prop": "name",
      "span": 12/* ,
      "search":true */
    },{
      "type": "input",
      "label": "套餐描述",
      "prop": "description",
      "span": 12
    },	  {
      "type": "input",
      "label": "店铺上限",
      "prop": "shopLimit",
      "span": 12
    },	  {
      "type": "input",
      "label": "子账号上限",
      "prop": "sonLimit",
      "span": 12
    },	  
    {
      "hide": false,
      "label": '图标',
      "prop": 'icon',
      "type": 'upload',
      "loadText": '图标上传中，请稍等',
      "propsHttp": {
        "home": 'http://bucket.damaijia.co/',
        "res": 'data'
      },
      "action": "/admin/sys-file/upload",
      "listType": 'picture-img',
    },
    {
      "prop": "sort",
      "span": 12,
      "type": "number",
      "controlsPosition":'',
      "label": "排序权重",
      "labelTip": '权重值越大越靠后',
      "display": true,
    },{
      "label": '显示状态',
      "prop": 'showFlag',
      "type": 'radio',
      "slot": true,
      "border": true,
      "rules": [{
        "required": true,
        "message": '请选择状态',
        "trigger": 'blur'
      }],
      "dicData": [{
        "label": '显示',
        "value": '0'
      }, {
        "label": '隐藏',
        "value": '9'
      }]
    }]
}
