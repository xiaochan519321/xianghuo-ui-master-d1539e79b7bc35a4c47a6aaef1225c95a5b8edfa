/*
 * @Descripttion: 
 * @Author: 朱天杰
 * @Date: 2022-04-18 13:52:46
 */
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
      "dicUrl": '/dfh/shop/getAllList',
      "dicMethod": 'get',
      "search":false,
      "searchslot": false,
    },
    {
      label:'商品信息',
      prop:'product_info',
      slot:true,
      width: 250
    },
    {
      "type": "input",
      "label": "商品数",
      "prop": "itemNum",
      "span": 12,
      "search": false
    },
    {
      "type": "input",
      "label": "抖店实付",
      "prop": "payAmount",
      "span": 12,
      "search": false,
      slot: true,
    },
    {
      "type": "input",
      "label": "消耗积分",
      "prop": "pointsUsed",
      "span": 12
    },
    {
      "type": "input",
      "label": "采购优惠卷金额",
      "prop": "pddPromotionMoney",
      "span": 12,
      slot: true,
    },
    {
      "type": "input",
      "label": "实付金额",
      "prop": "pddMondy",
      "span": 12,
      slot: true,
    }
    ]
}
