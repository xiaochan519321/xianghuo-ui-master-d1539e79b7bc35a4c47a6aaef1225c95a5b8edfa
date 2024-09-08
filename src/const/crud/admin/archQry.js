export const tableOption = {
  border: true,
  index: false,
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
      label: '订单号',
      prop: 'operateOrder',
      search: true
    },
    {
      label: '操作类型',
      prop: 'regType',
      type: 'select',
      "dicData": [
        {
          "label": '充值',
          "value": 1
        }, 
        {
          "label": '快递扣除',
          "value": 2
        },
        {
          "label": '物流短信',
          "value": 3
        },
        {
          "label": '无限制隐私号扣除',
          "value": 4
        },
        {
          "label": '返还点券',
          "value": 5
        }
      ],
      props: {
        label: 'label',
        value: 'value'
      },
      search: true
    },
    {
      label: '操作金额',
      prop: 'amount'
    },
    {
      label: '操作前金额',
      prop: 'beforeAmount'
    },
    {
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },
    {
      label: '开始时间',
      prop: 'startTime',
      type: "datetime",
      format:"yyyy-MM-dd HH:mm:ss",
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      search: true,
      searchSize: 'mini',
      showColumn: false //表格中是否显示
    },
    {
      label: '结束时间',
      prop: 'endTime',
      type: "datetime",
      format:"yyyy-MM-dd HH:mm:ss",
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      searchSize: 'mini',
      search: true,
      showColumn: false //表格中是否显示
    }
  ]
}

export const Option = {
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
      label: '点券详情编号',
      width: 210,
      searchLabelWidth: 110,
      searchSpan: 7,
      prop: 'detailId',
      search: true
    },
    {
      label: '操作类型',
      prop: 'regType',
      type: 'select',
      "dicData": [
        {
          "label": '充值',
          "value": 1
        }, 
        {
          "label": '快递扣除',
          "value": 2
        },
        {
          "label": '物流短信',
          "value": 3
        },
        {
          "label": '无限制隐私号扣除',
          "value": 4
        },
        {
          "label": '返还点券',
          "value": 5
        }
      ],
      props: {
        label: 'label',
        value: 'value'
      },
      search: true
    },
    {
      label: '操作金额',
      prop: 'amount'
    },
    {
      label: '操作前金额',
      prop: 'beforeAmount'
    },
    {
      label: '创建时间',
      width: 150,
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },
    {
      label: '开始时间',
      prop: 'startTime',
      type: "datetime",
      format:"yyyy-MM-dd HH:mm:ss",
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      search: true,
      searchSize: 'mini',
      showColumn: false //表格中是否显示
    },
    {
      label: '结束时间',
      prop: 'endTime',
      type: "datetime",
      format:"yyyy-MM-dd HH:mm:ss",
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      searchSize: 'mini',
      search: true,
      showColumn: false //表格中是否显示
    },
    {
      label: '操作单号',
      prop: 'operateOrder',
      width: 210,
      search: true,
    },
  ]
}
