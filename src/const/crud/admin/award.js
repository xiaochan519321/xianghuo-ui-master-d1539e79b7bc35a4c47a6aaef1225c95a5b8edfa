

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  searchMenuSpan: 6,
  align: 'center',
  menu: false,
  editBtn: false, // 行编辑按钮
  delBtn: false, // 行删除钮
  addBtn: false, // 新增按钮addBtn:false
  column: [
    {
      label: '明细编号',
      prop: 'detailId',
      width: 180,
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '用户编号',
      prop: 'userId',
      editDisplay: false,
      addDisplay: false
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
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '比例',
      prop: 'radio',
      editDisplay: false,
      addDisplay: false,
      formatter:(val,value,label)=>{
        return value * 100+'%';
      }
    },
    {
      label: '操作金额',
      prop: 'amt',
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '操作前金额',
      prop: 'beforeAmt',
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '操作前积分',
      prop: 'beforeIntegral',
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '时间',
      prop: 'time',
      width: 150,
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '备注',
      prop: 'remarks',
      editDisplay: false,
      addDisplay: false
    }
  ]
}
