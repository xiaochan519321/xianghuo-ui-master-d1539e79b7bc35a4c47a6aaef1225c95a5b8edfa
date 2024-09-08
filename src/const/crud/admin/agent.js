import {leverinfoList} from '@/api/admin/agent'

var leverList = [
  {
    "label": '全部',
    "value": '-1'
  },
];
leverinfoList(Object.assign({
  current: 1,
  size: 20,
  leverId: -1
})).then(response => {
  response.data.data.records.forEach((item)=>{
    leverList.push({label:item.leverName,value:item.leverId});
  })
}).catch(() => {})

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  searchMenuSpan: 6,
  align: 'center',
  editBtn: true, // 行编辑按钮
  delBtn: false, // 行删除钮
  addBtn: true, // 新增按钮addBtn:false
  column: [
    {
      label: '用户编号',
      prop: 'userId',
      search: true,
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '用户手机号',
      searchLabelWidth: 90,
      labelWidth: 100,
      width: 110,
      prop: 'phone',
      rules: [{
        required: true,
        message: '请输入用户手机号',
        trigger: 'blur'
      }],
      search: true,
      editDisplay: false,
      addDisplay: true
    },
    {
      label: '用户名',
      width: 110,
      prop: 'username',
      search: true,
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '上级手机号',
      prop: 'agentPhone',
      editDisplay: false,
      addDisplay: true,
      showColumn:false //表格中是否显示
    },
    {
      label: '级别编号',
      type: 'select',
      prop: 'leverId',
      "dicData": leverList,
      rules: [{
        required: true,
        message: '请选择级别编号',
        trigger: 'blur'
      }],
      search: true,
      editDisplay: true,
      addDisplay: true,
      showColumn:false //表格中是否显示
    },
    {
      label: '级别名称',
      prop: 'leverName',
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '上级编号',
      prop: 'agentId',
      search: true,
      editDisplay: true,
      addDisplay: false
    },
    {
      label: '状态',
      type: 'select',
      prop: 'sts',
      dicData: [
        {
          "label": '全部',
          "value": -1
        },
        {
          "label": '正常',
          "value": 1
        }, 
        {
          "label": '冻结',
          "value": 2
        }
      ],
      props: {
        label: 'label',
        value: 'value'
      },
      search: true,
      editDisabled: false,
      editDisplay: true,
      addDisplay: false
    },
    {
      label: '代理比例',
      prop: 'radio',
      rules: [{
        required: true,
        message: '请输入代理比例',
        trigger: 'blur'
      }],
      editDisabled: false,
      editDisplay: true,
      addDisplay: true,
      formatter:(val,value,label)=>{
        return value * 100+'%';
      }
    },
    {
      label: '拥有店铺权限数量',
      prop: 'shopNum',
      editDisplay: true,
      addDisplay: false,
      labelWidth: 150
    },
    {
      label: '已用店铺权限数量',
      prop: 'openShopNum',
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '拥有子账号权限数量',
      prop: 'subNum',
      editDisplay: true,
      addDisplay: false,
      labelWidth: 150
    },
    {
      label: '已用子账号权限数量',
      prop: 'openSubNum',
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '时间',
      width: 150,
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      prop: 'time',
      editDisplay: false,
      addDisplay: false
    },
    {
      label: '邀请码',
      prop: 'invite',
      search: true,
      editDisplay: false,
      addDisplay: false
    },
  ]
}
