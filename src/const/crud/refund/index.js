import {getShopList} from '@/api/refund/order'
var shopList = [];

getShopList().then(response => {
  response.data.data.forEach((item)=>{
    shopList.push({label:item.shopName,value:item.id});
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
  menu: false,
  editBtn: false, // 行编辑按钮
  delBtn: false, // 行删除钮
  addBtn: false, // 新增按钮addBtn:false
  column: [
    {
      label: '收件人姓名',
      searchLabelWidth: 110,
      prop: 'recieverName',
      search: true
    },
    {
      label: '收件人手机号',
      prop: 'mobile'
    },
    {
      label: '省',
      prop: 'receiverProvinc'
    },
    {
      label: '市',
      prop: 'receiverCity'
    },
    {
      label: '县(区)',
      prop: 'receiverDistrict'
    },
    {
      label: '乡镇(街道)',
      prop: 'receiverStreet'
    },
    {
      label: '详细地址',
      prop: 'receiverDetail',
      minWidth: 150,
    },
    {
      label: '店铺名称',
      type: 'select',
      prop: 'shopId',
      "dicData": shopList,
      rules: [{
        required: true,
        message: '请选择店铺名称',
        trigger: 'blur'
      }],
      search: true,
      showColumn:false //表格中是否显示
    },
    {
      label: '地址信息',
      prop: 'selectInfo',
      search: true,
      showColumn:false //表格中是否显示
    },
  ]
}
