export const tableOption = {
  "border": true,
  "index": true,
  "indexLabel": "序号",
  "stripe": true,
  "menuAlign": "center",
  "align": "center",
  "searchMenuSpan": 6,
  "editBtn":true, // 行编辑按钮
  "editBtnText":'编辑状态',
  "addBtn":false, // 新增按钮
  "selection":true,
  "column": [
	  {
      "type": "input",
      "label": "ID",
      "prop": "id",
      "span": 12,
      "display": false //新增编辑是否显示
    },	  
    {
      "type": "input",
      "label": "采购账号",
      "prop": "pddUsername",
      "span": 12,
      "search":true,
      "searchLabelWidth":100,
      "editDisabled":true,//表单编辑时是否禁止
    },	  
    /* {
      "type": "input",
      "label": "会员到期时间",
      "prop": "pddExpTime",
      "span": 12
    }, */	  
    /* {
      "type": "input",
      "label": "拥有的优惠券数",
      "prop": "pddCouponNum",
      "span": 12
    }, */	  
    {
      "type": "input",
      "label": "系统下单数量",
      "prop": "orderNum",
      "span": 12,
      "display": false, //新增编辑是否显示
    },	
    
    {
      "type": "select",
      "label": "状态",
      "prop": "status",
      "span": 12,
      "search":true,
      "dicUrl": '/admin/dict/type/pdd_user_status',
      "dicMethod": 'get',
    },
    {
      "type": "input",
      "label": "标记",
      "prop": "flagStar",
      "span": 12,
      "slot":true,
      "display": false //新增编辑是否显示
    }, 
    {
      "label": '采购授权时间',
      "prop": 'lzCreateTime',
      "searchLabelWidth":120,
      "type": 'datetime',
      "format": 'yyyy-MM-dd HH:mm',
      "display": false, //新增编辑是否显示
      //"search": true,
      "searchRange": true,
    },
    {
      "label": '订单编号',
      "prop": 'orderId',
      "searchLabelWidth":120,
      "type": 'input',
      "display": false, //新增编辑是否显示
      "search": true,
      "showColumn":false //表格中是否显示
    }
    // {
    //   "type": "input",
    //   "label": "标记备注",
    //   "prop": "flagRemark",
    //   "span": 12,
    //   "display": false //新增编辑是否显示
    // }
  ]
}
