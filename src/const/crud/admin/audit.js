import {leverinfoList} from '@/api/admin/agent'

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  selection:true,//开关多选
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
      label: '用户编号',
      prop: 'userId',
      search: true,
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '手机号',
      prop: 'phone',
      search: true,
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '用户名',
      prop: 'username',
      search: true,
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '状态',
      prop: 'sts',
      type: "select",
      "dicData": [
        {
          "label": '全部',
          "value": -1
        },
        {
          "label": '审核中',
          "value": 1
        }, 
        {
          "label": '审核成功',
          "value": 2
        },
        {
          "label": '审核失败',
          "value": 3
        }
      ],
      props: {
        label: 'label',
        value: 'value'
      },
      search: true,
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '时间',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      prop: 'time',
      editDisplay: false,
      addDisplay: false
    }
  ]
}
