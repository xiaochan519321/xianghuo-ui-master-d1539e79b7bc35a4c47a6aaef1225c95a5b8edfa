export const tableOption = {
  border: true,
  index: false,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  searchMenuSpan: 6,
  editBtn:false, // 行编辑按钮
  delBtn:false,  // 行删除钮
  addBtn:false,  // 新增按钮
  menuWidth: 100,
  column: [
    // {
    //   type: "select",
    //   label: "店铺",
    //   prop: "shopId",
    //   span: 12,
    //   props: {
    //     label: "shopName",
    //     value: "id"
    //   },
    //   searchSpan: 5,
    //   dicUrl: '/dfh/shop/getAllList',
    //   dicMethod: 'get',
    //   searchLabelWidth: 50,
    //   showColumn: true, //表格中是否显示
    //   searchslot: false
    // },
    {
      label: "日期",
      prop: "statisticsTime",
    },
    {
      label: "采购销售金额",
      prop: "purchaseSalesAmount",
    },
    {
      label: "销售订单量",
      prop: "salesCount",
    },
    {
      label: "采购实付金额",
      prop: "purchaseAmount",
    },
    {
      label: "采购优惠金额",
      prop: "purchaseCostAmount",
    },
    {
      label: "平台补贴",
      prop: "platformSubsidyFee",
    },
    {
      label: "利润",
      prop: "profitAmount",
    },
    {
      label: "利润率",
      prop: "avgProfitAmount",
      formatter:(val,value,label)=>{
        return value * 1+'%';
      }
    }
  ]
}
