export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  menuAlign: 'center',
  searchMenuSpan: 6,
  "menu":false,
  "editBtn":false, // 行编辑按钮
  "delBtn":false, // 行删除钮
  "addBtn":false, // 新增按钮addBtn:false
  align: 'center',
  column: [
    {
      label: '用户编号',
      width: 80,
      prop: 'userId',
      search: true,
    },
    {
      label: '用户名',
      width: 120,
      prop: 'username',
      search: true,
    },
    {
      label: '手机号',
      width: 100,
      prop: 'phone',
      search: true,
    },
    {
      label: '站点名称',
      width: 130,
      prop: 'tenantName',
      search: true
    },
    {
      label: '点券充值单号',
      width: 230,
      searchLabelWidth: 110,
      searchSpan: 7,
      prop: 'ticketsId',
      search: true,
    },
    {
      label: '支付宝单号',
      width: 230,
      searchLabelWidth: 110,
      searchSpan: 7,
      prop: 'zfbId',
      search: true,
    },
    {
      label: '状态',
      prop: 'state',
      type: 'select',
      "dicData": [
        {
          "label": '待付款',
          "value": 1
        }, 
        {
          "label": '支付成功',
          "value": 2
        },
        {
          "label": '已取消',
          "value": 3
        }
      ],
      props: {
        label: 'label',
        value: 'value'
      },
      search: true
    },
    {
      label: '金额',
      prop: 'amount',
    },
    {
      label: '操作类型',
      prop: 'operation',
      type: 'select',
      "dicData": [
        {
          "label": '支付充值',
          "value": 1
        }, 
        {
          "label": '手动增加',
          "value": 2
        }
      ],
      props: {
        label: 'label',
        value: 'value'
      }
    },
    {
      label: '备注',
      prop: 'annotation',
    },
    {
      label: '创建时间',
      width: 150,
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
    },
    {
      label: '开始时间',
      prop: 'startTime',
      type: "datetime",
      format:"yyyy-MM-dd HH:mm:ss",
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      search: true,
      searchSize: 'mini',
      showColumn:false //表格中是否显示
    },
    {
      label: '结束时间',
      prop: 'endTime',
      type: "datetime",
      format:"yyyy-MM-dd HH:mm:ss",
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      searchSize: 'mini',
      search: true,
      showColumn:false //表格中是否显示
    }
  ]
}
