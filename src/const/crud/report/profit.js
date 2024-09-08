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
  "excelBtn":true,
  "column": [
    {
      "type": "select",
      "label": "店铺",
      "prop": "shopId",
      "span": 12,
      "props": {
        "label": "shopName",
        "value": "id"
      },
      "dicUrl": '/dfh/shop/getAllList',
      "dicMethod": 'get',
      "search":true,
      "searchLabelWidth": 50,
      "showColumn":true //表格中是否显示
    },
    {
      "prop": "createTimeArr",
      "span": 12,
      "type": "date",
      "label": "下单时间",
      //"searchValue": ['2021-10-21', '2021-10-22'],
      "format": "yyyy-MM-dd",
      "display": true,
      "valueFormat": "yyyy-MM-dd",
      "editDisabled": true,
      "addDisabled": true,
      "search": true,
      "searchRange": true,
      "showColumn":false //表格中是否显示
    },
    {
      "type": "datetime",
      "label": "统计时间",
      "prop": "statisticsTime",
      "span": 12,
      "showColumn": true, //表格中是否显示
      "display": false,    //新增编辑是否显示
      "search": false,      //搜索栏是否显示
      format: 'yyyy-MM-dd',
    },
    {
      "type": "input",
      "label": "采购订单数",
      "prop": "purchaseOrders",
      "span": 12,
      "search": false,
    },
    {
      "type": "input",
      "label": "销售金额(元)",
      "prop": "salesAmount",
      "span": 12,
      "search": false,
      slot: false,
      precision:2,
    },
    {
      "type": "input",
      "label": "销售客单价",
      "prop": "avgSalesAmount",
      "span": 12,
      "search": false,
      slot: false,
    },
    {
      "type": "input",
      "label": "采购金额",
      "prop": "purchaseAmount",
      "span": 12,
      slot: false,
    },
    {
      "type": "input",
      "label": "采购客单价",
      "prop": "avgPurchaseAmount",
      "span": 12,
      slot: false,
    },
    {
      "type": "input",
      "label": "消耗积分总额",
      "prop": "pointsUsed",
      "span": 12,
    },
    {
      "type": "input",
      "label": "采购优惠金额",
      "prop": "pddPromotionMoney",
      "span": 12,
      slot: false,
    },
    {
      "type": "input",
      "label": "商家优惠金额",
      "prop": "promotionShopAmount",
      "span": 12,
      slot: false,
    },
    {
      "type": "input",
      "label": "总优惠金额",
      "prop": "promotionAmount",
      "span": 12,
      slot: false,
      "showColumn": false //表格中是否显示
    },
    {
      "type": "input",
      "label": "利润",
      "prop": "profitAmount",
      "span": 12,
      slot: false,
    },
    {
      "type": "input",
      "label": "平均利润",
      "prop": "avgProfitAmount",
      "span": 12,
      slot: false,
    },
    {
      "type": "input",
      "label": "利润率",
      "prop": "profitMargin",
      "span": 12,
      slot: false,
    },
    ]
}
