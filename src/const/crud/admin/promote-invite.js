export const tableOption = {
  "menu": false, //不显示操作
  "border": true,
  "index": true,
  "indexLabel": "序号",
  "stripe": true,
  "menuAlign": "center",
  "align": "center",
  "searchMenuSpan": 6,
  "column": [
	  {
      "type": "input",
      "label": "主键ID",
      "prop": "id",
      "span": 12,
      "showColumn":false //表格中是否显示
    },	  {
      "type": "input",
      "label": "站点ID",
      "prop": "tenantId",
      "span": 12,
      "showColumn":false //表格中是否显示
    },	  {
      "type": "input",
      "label": "老用户ID",
      "prop": "oldUserId",
      "span": 12,
      "showColumn":false //表格中是否显示
    },	  {
      "type": "input",
      "label": "新用户ID",
      "prop": "userId",
      "span": 12,
      "showColumn":false //表格中是否显示
    },	  {
      "type": "input",
      "label": "手机号",
      "prop": "phone",
      "span": 12
    },	  {
      "type": "input",
      "label": "状态",
      "prop": "lockFlag",
      "span": 12,
      dicData: [{
        label: '有效',
        value: '0'
      }, {
        label: '锁定',
        value: '9'
      }]
    },	  {
      "type": "input",
      "label": "创建时间",
      "prop": "createTime",
      "span": 12
    }  ]
}
