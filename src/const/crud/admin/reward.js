

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
      label: '明细编号',
      prop: 'detailId',
      width: 210,
      search: true
    },
    {
      label: '用户编号',
      prop: 'userId',
      search: true
    },
    {
      label: '类型',
      prop: 'type',
      type: 'select',
      "dicData": [
        {
          "label": '全部',
          "value": -1
        },
        {
          "label": '直推奖励',
          "value": 1
        }, 
        {
          "label": '代理奖励',
          "value": 2
        }
      ],
      props: {
        label: 'label',
        value: 'value'
      },
      search: true
    },
    {
      label: '比例',
      prop: 'radio',
      width: 80,
      editDisplay: false,
      addDisplay: false,
      formatter:(val,value,label)=>{
        return value * 100+'%';
      }
    },
    {
      label: '操作金额',
      prop: 'amt'
    },
    {
      label: '操作前金额',
      prop: 'beforeAmt'
    },
    {
      label: '操作前积分',
      prop: 'beforeIntegral'
    },
    {
      label: '时间',
      prop: 'time',
      width: 150,
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
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
    },
    {
      label: '操作单号',
      prop: 'operateOrder',
      width: 210,
      search: true
    },
    {
      label: '备注',
      prop: 'remarks'
    }
  ]
}
