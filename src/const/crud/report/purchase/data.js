export const tableOption = {
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
  "menuWidth": 100,
  "column": [
    {
      "type": "select",
      "label": "店铺",
      "prop": "shopId",
      "span": 12,
      "searchSpan": 5,
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
      // "search":true,
      "searchLabelWidth": 50,
      "showColumn":true //表格中是否显示
    },
    {
      "prop": "createTimeArr",
      "span": 12,
      "searchSpan": 9,
      "type": "date",
      "label": "下单时间",
      "minWidth": 120,
      "format": "yyyy-MM-dd",
      "display": true,
      "valueFormat": "yyyy-MM-dd",
      "editDisabled": true,
      "addDisabled": true,
      // "search": true,
      "searchRange": true,
      "showColumn":false //表格中是否显示
    },
    {
      "prop": "statisticsTime",
      "span": 12,
      "type": "date",
      "label": "采购时间",
      "minWidth": 100,
      "format": "yyyy-MM-dd",
      "display": true,
      "valueFormat": "yyyy-MM-dd",
      "editDisabled": true,
      "addDisabled": true
    },

    // {
    //   "type": "input",
    //   "label": "采购销售金额",
    //   "prop": "purchaseSalesAmount",
    //   "span": 12,
    //   "search": false
    // },
    {
      "type": "input",
      "label": "采购金额",
      "prop": "purchaseAmount",
      "span": 12,
    },
    {
      "type": "input",
      "label": "采购订单数",
      "prop": "purchaseCount",
      "span": 12,
      "search": false
    },
    {
      "type": "input",
      "label": "采购商品数",
      "prop": "purchaseItems",
      "span": 12,
      "search": false
    },
    {
      "type": "input",
      "label": "优惠订单数",
      "prop": "discountedOrders",
      "span": 12
    },
    {
      "type": "input",
      "label": "采购总金额",
      "prop": "totalPurchaseAmount",
      "span": 12
    },
    {
      "type": "input",
      "label": "优惠金额",
      "prop": "purchaseCostAmount",
      "span": 12,
    },
    {
      "type": "input",
      "label": "使用积分",
      "prop": "points",
      "span": 12
    }
    ]
}
