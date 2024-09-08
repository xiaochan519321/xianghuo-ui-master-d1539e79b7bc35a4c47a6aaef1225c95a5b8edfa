export const tableOption = {
	"align": "center",
	"index": true,
  "height": "auto",//表格高度
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
      "search":true,
      
      width: 90
    },
    {
      label:'商品信息',
      prop:'product_info',
      slot:true,
      width: 250
    },
    {
      label:'商品规格',
      width: 100,
      prop:'spec'
    },
    {
      label:'应付',
      width: 100,
      slot:true,
      prop:'payAmount'
    },
    {
      label:'买家信息',
      prop:'buyer_info',
      width: 190,
      slot:true
    },
    {
      label:'退换信息',
      prop:'alteration_info',
      width: 190,
      slot:true
    },    
    {
      label:'申请原因',
      prop:'reasonText',
      width: 190
    },
    {
      label:'售后状态',
      prop:'aftersaleStatus',
      width: 190,
      dicUrl: '/admin/dict/type/aftersale_status',
      dicMethod: 'get',
    },
    {
      "prop": "status",
      "span": 12,
      "type": "select",
      "label": "平台代发状态",
      //"search": true,
      "dicUrl": '/admin/dict/type/dfh_status',
      "dicMethod": 'get',
      "width": 120,
      "searchLabelWidth":100,
    },
    {
      label:'采购代发订单信息',
      prop:'pdd_order_info',
      width: 260,
      slot:true,
    },
  
  ],
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
	"menuPosition": "right", //表单保存取消按钮位置
	"labelPosition": "right",
	"searchMenuSpan": 6,
	"emptyText": '暂时没有找到任何售后订单信息，同步一下订单试试',
	"searchShow": true, //首次加载是否显示搜索
	"dialogWidth": '55%',//弹出框的宽度
  "editBtn":false, // 行编辑按钮
  "delBtn":false, // 行删除钮
  "addBtn":false, // 新增按钮
}
