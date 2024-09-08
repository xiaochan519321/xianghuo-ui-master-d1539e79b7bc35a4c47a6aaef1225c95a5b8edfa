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
      search: true
    },
    {
      label: '用户名',
      prop: 'username',
      search: true
    },
    {
      label: '手机号',
      prop: 'phone',
      search: true
    },
    {
      label: '站点名称',
      prop: 'name',
      search: true
    },
    {
      label: '积分充值单号',
      width: 230,
      searchLabelWidth: 110,
      searchSpan: 7,
      prop: 'faceId',
      search: true
    },
    {
      label: '支付宝单号',
      width: 230,
      searchLabelWidth: 110,
      searchSpan: 7,
      prop: 'zfbId',
      search: true
    },
    {
      label: '状态',
      prop: 'sts',
      type: 'select',
      "dicData": [
        {
          "label": '全部',
          "value": -1
        },
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
      prop: 'amt'
    },
    {
      label: '时间',
      width: 150,
      prop: 'time',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },
    {
      label: '开始时间',
      prop: 'startTime',
      type: "datetime",
      format:"yyyy-MM-dd HH:mm:ss",
      valueFormat: 'yyyyMMddHHmmss',
      search: true,
      searchSize: 'mini',
      showColumn:false //表格中是否显示
    },
    {
      label: '结束时间',
      prop: 'endTime',
      type: "datetime",
      format:"yyyy-MM-dd HH:mm:ss",
      valueFormat: 'yyyyMMddHHmmss',
      searchSize: 'mini',
      search: true,
      showColumn:false //表格中是否显示
    }
  ]
}
