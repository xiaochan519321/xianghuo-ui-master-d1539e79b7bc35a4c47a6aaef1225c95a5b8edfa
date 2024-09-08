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
  console.log(leverList)
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
  addBtn: false, // 新增按钮addBtn:false
  column: [
    {
      label: '级别名称',
      prop: 'leverName',
      editDisplay: true
    },
    {
      label: '最大比例',
      prop: 'leverMaxRatio',
      editDisabled: false,
      editDisplay: true,
      formatter:(val,value,label)=>{
        return value * 100+'%';
      }
    },
    {
      label: '级别名称',
      type: 'select',
      prop: 'leverId',
      "dicData": leverList,
      rules: [{
        required: true,
        message: '请选择级别名称',
        trigger: 'blur'
      }],
      search: true,
      editDisplay: false,
      showColumn: false //表格中是否显示
    },
    {
      label: '奖励店铺数量',
      prop: 'empowerShopNum',
      editDisplay: true,
      labelWidth: 150
    },
    {
      label: '奖励子账号数量',
      prop: 'empowerSubNum',
      editDisplay: true,
      labelWidth: 150
    },
    {
      label: '单次充值多少可获奖励',
      prop: 'rechargeMoney',
      editDisplay: true,
      labelWidth: 180
    },
    {
      label: '直推比例',
      prop: 'pushRatio',
      editDisabled: false,
      editDisplay: true,
      formatter:(val,value,label)=>{
        return value * 100+'%';
      }
    }
  ]
}
