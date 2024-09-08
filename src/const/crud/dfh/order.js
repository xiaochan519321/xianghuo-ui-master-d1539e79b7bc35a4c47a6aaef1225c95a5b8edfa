export const tableOption = {
"height": "700px",//表格高度
  "index": true,
  "indexLabel": "序号",
  "menuAlign": "center",
  "align": "center",
  rowKey:'id',
  expand:true,
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
      "rules": [{
        "message": "必须选择会员套餐",
        "required": true
      }],
      "dicUrl": '/dfh/shop/getAllList',
      "dicMethod": 'get',
      "search":true
    },
    {
      label: '订单编号',
      prop: 'orderId',
      search:true,
      //searchTip:'抖店订单ID',
      showColumn:false //表格中是否显示
    },

    {
      "prop": "createTimeArr",
      "span": 12,
      "type": "date",
      "label": "下单时间",
      // "searchValue": ['2021-10-21', '2021-10-22'],
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
      label: '商品ID',
      prop: 'productId',
      search:true,
      showColumn:false //表格中是否显示
    },
    {
      "prop": "pddOrderTimeArr",
      "span": 12,
      "type": "date",
      "label": "采购下单时间",
      "format": "yyyy-MM-dd",
      "display": true,
      "valueFormat": "yyyy-MM-dd",
      "editDisabled": true,
      "addDisabled": true,
      "search": true,
      "searchRange": true,
      "searchLabelWidth":120,
      "showColumn":false //表格中是否显示
    },
    {
      "prop": "pddPayTimeArr",
      "span": 12,
      "type": "date",
      "label": "采购支付时间",
      "format": "yyyy-MM-dd",
      "display": true,
      "valueFormat": "yyyy-MM-dd",
      "editDisabled": true,
      "addDisabled": true,
      "search": true,
      "searchRange": true,
      "searchLabelWidth":120,
      "showColumn":false //表格中是否显示
    },
    {
      label:'商品信息',
      prop:'product_info',
      slot:true,
      width: 235
    },
    {
      label:'买家信息',
      prop:'buyer_info',
      width: 140,
      slot:true
    },
    {
      label:'商品下单规格',
      width: 100,
      slot:true,
      prop:'spec'
    },
    {
      label:'订单信息',
      prop:'order_money_info',
      width: 140,
      slot:true
    },
    {
      "prop": "orderStatus",
      "span": 12,
      "type": "select",
      "label": "订单状态",
      "search": true,
      "dicUrl": '/admin/dict/type/dfh_order_status',
      "dicMethod": 'get',
      "searchValue": '2'
    },
    {
      label:'商家备注',
      prop:'sellerWords',
      width: 80,
      slot:true,
      search:true
    },
    {
      label:'获取采购商品规格',
      prop:'get_pdd_product_spec',
      slot:true,
      width: 150
    },
    {
      label:'关联采购规格',
      prop:'relevance_pdd_product_spec',
      slot:true,
      width: 100,
    },
    // {
    //   label:'订单状态描述',
    //   prop:'orderStatusDesc'
    // },
    {
      "prop": "decryptStatus",
      "span": 12,
      "type": "select",
      "label": "解密状态",
      "search": true,
      "dicUrl": '/admin/dict/type/dfh_order_status',
      "dicMethod": 'get',
      dicData: [{
        label: '已解密',
        value: '1'
      }, {
        label: '未解密',
        value: '0'
      }, {
        label: '解密失败',
        value: '2'
      }],
      search:true,
      showColumn:false //表格中是否显示
    },

    /* {
      label: '商品名称',
      prop: 'name',
      search:true,
      showColumn:false //表格中是否显示
    }, */
    /* {
      label: '收货人',
      prop: 'encryptPostReceiver',
      search:true,
      showColumn:false //表格中是否显示
    },
    {
      label: '收货电话',
      prop: 'encryptPostTel',
      search:true,
      showColumn:false //表格中是否显示
    }, */
    {
      "type": "select",
      label: '是否关联采购链接',
      "searchLabelWidth":160,
      prop: 'isBindPddPurchaseUrl',
      rules: [{
        required: true,
        message: '是否关联采购链接',
        trigger: 'blur'
      }],
      dicData: [{
        label: '是',
        value: '0'
      }, {
        label: '否',
        value: '9'
      }],
      search:true,
      showColumn:false //表格中是否显示
    },
    {
      "type": "select",
      label: '是否绑定规格',
      "searchLabelWidth":150,
      prop: 'isBindPddSpec',
      rules: [{
        required: true,
        message: '是否绑定规格',
        trigger: 'blur'
      }],
      dicData: [{
        label: '是',
        value: '0'
      }, {
        label: '否',
        value: '9'
      }],
      search:true,
      showColumn:false //表格中是否显示
    },
    {
      "type": "select",
      "label": '商家是否备注',
      "searchLabelWidth":150,
      prop: 'sellerWordsIf',
      rules: [{
        required: true,
        message: '商家是否备注',
        trigger: 'blur'
      }],
      dicData: [{
        label: '是',
        value: '0'
      }, {
        label: '否',
        value: '9'
      }],
      search:true,
      showColumn:false //表格中是否显示
    },
    {
      "type": "select",
      "label": '买家是否留言',
      "searchLabelWidth":150,
      searchValue:"9",
      prop: 'buyerWords',
      rules: [{
        required: true,
        message: '买家是否留言',
        trigger: 'blur'
      }],
      dicData: [{
        label: '是',
        value: '0'
      }, {
        label: '否',
        value: '9'
      }],
      search:true,
      showColumn:false //表格中是否显示
    },
    {
      label:'代发失败原因',
      prop:'loseStatusHint',
      width: 70,
      "searchLabelWidth":100,
     // slot:true
     search:true,
     showColumn:false //表格中是否显示
    },
    {
      label:'发货失败原因',
      prop:'shippingErrorMsg',
      width: 70,
      "searchLabelWidth":100,
     // slot:true
     search:true,
     showColumn:false //表格中是否显示
    },
    {
      "prop": "status",
      "span": 12,
      "type": "select",
      "label": "平台状态",
      //"search": true,
      "dicUrl": '/admin/dict/type/dfh_status',
      "dicMethod": 'get',
      "width": 120,
      "searchLabelWidth":100,
      slot:true
    },
//     {
//       label:'拼多多订单信息',
//       prop:'pdd_order_info',
//       width: 260,
//       slot:true,
//     },
// /*     {
//       label:'代发补充地址',
//       prop:'supplement_address',
//       width: 190,
//       slot:true,
//     }, */
//     {
//       label:'支付信息',
//       prop:'pay_info',
//       width: 195,
//       slot:true,
//     },
//     {
//       label:'物流信息',
//       prop:'logistics_info',
//       width: 190,
//       slot:true,
//     },
    {
      label:'代发补充地址',
      prop:'dfbcdz',
      width: 140,
      slot:true,
    },
    {
      label:'已超时发货时间',
      prop:'csfhsj',
      width: 120,
      slot:true,
    },
    {
      label:'利润',
      prop:'profit',
      width: 100,
      slot:true,
    },
    /* {
      label:'订单标记',
      prop:'ddbj',
      width: 190,
      slot:true,
    }, */
  ],
    "selection":true,
    "gutter": 0,
    "menuBtn": true,
    "emptyBtn": true,
    "emptyText": "清空",
    "menuAlign": "center",
    "submitBtn": true,
    "indexLabel": "序号",
    "labelWidth": 120,
    "menuWidth": 200,
    "submitText": "提交",
    "menuPosition": "right", //表单保存取消按钮位置
    "labelPosition": "right",
    "searchIndex":3,
    "searchIcon":true,
    "searchShowBtn":false,
    "emptyText": '暂时没有找到任何订单信息',
    "searchMenuSpan": 6,
    "searchShow": true, //首次加载是否显示搜索
    "dialogWidth": '55%',//弹出框的宽度
    "editBtn":false, // 行编辑按钮
    "delBtn":false, // 行删除钮
    "addBtn":false, // 新增按钮
    "tip":false //不显示头部多选清空信息
    //"menu":false //不显示操作
}
