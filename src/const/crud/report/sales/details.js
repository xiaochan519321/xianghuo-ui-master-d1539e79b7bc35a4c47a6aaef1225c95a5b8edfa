export const tableOption = {
  "menu": false, //不显示操作
  "border": true,
  "index": true,
  "indexLabel": "序号",
  "stripe": true,
  "menuAlign": "center",
  "align": "center",
  "searchMenuSpan": 6,
  "editBtn":false, // 行编辑按钮
  "delBtn":false,  // 行删除钮
  "addBtn":false,  // 新增按钮
  "column": [
    {
      "type": "input",
      "label": "订单ID",
      "prop": "orderId",
      "span": 12,
      "showColumn": false, //表格中是否显示
      "display": false,    //新增编辑是否显示
      "search": true,      //搜索栏是否显示,
    },
    {
      "type": "input",
      "label": "商品ID",
      "prop": "productId",
      "span": 12,
      "showColumn": false, //表格中是否显示
      "display": false,    //新增编辑是否显示
      "search": true,      //搜索栏是否显示,
    },
    {
      "type": "date",
      "label": "订单时间",
      "prop": "createTime",
      "span": 12,
      "search": false,
      "format": "yyyy-MM-dd HH:mm:ss",
      "display": true,
      "valueFormat": "yyyy-MM-dd HH:mm:ss",
      "showColumn": false, //表格中是否显示
    },
    {
      "type": "select",
      "label": "店铺",
      "prop": "shopId",
      "span": 12,
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
      "search":false,
      "searchslot": false,
    },
    {
      label:'销售商品',
      prop:'product_info',
      slot:true,
      width: 250
    },
    {
      "type": "input",
      "label": "销售商品数",
      "prop": "itemNum",
      "span": 12,
      "search": false
    },
    {
      "type": "select",
      "label": "订单状态",
      "prop": "orderStatus",
      "span": 12,
      "search": true,
      "dicUrl": '/admin/dict/type/dfh_order_status',
      "dicMethod": 'get',
    },
    {
      "type": "input",
      "label": "销售金额",
      "prop": "payAmount",
      "span": 12,
      slot: true,
    },
    {
      "type": "input",
      "label": "采购金额",
      "prop": "pddMoney",
      "span": 12,
      slot: true,
    },
    {
      "type": "input",
      "label": "差价",
      "prop": "spreadAmount",
      "span": 12,
      slot: true,
    }
    ]
}
