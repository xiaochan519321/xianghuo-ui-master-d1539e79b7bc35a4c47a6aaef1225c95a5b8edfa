export const tableOption = {
  border: true,
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  addBtn:false,
  searchMenuPosition: "left",
  align: "center",
  searchMenuSpan: 6,
  labelWidth: 180,
  dialogClickModal: false,
  column: [{
      fixed: true,
      label: '模板名称',
      prop: 'name',
      formslot: true,
      span: 12,
      search: false,
      row:true,
      rules: [{
        message: "请填写模板名称",
        required: true,
        trigger: 'blur'
      }]
    },{
      type: "select",
      label: "推广分佣开关",
      prop: "profitSwitch",
      value: 1,
      formslot: true,
      span: 12,
      row:true,
      dicData: [{
        label: '开启',
        value: 1
      }, {
        label: '关闭',
        value: 0
      }],
    }, /*{
      type: "select",
      label: "卡密功能开关",
      prop: "cardSwitch",
      value:1,
      formslot: true,
      row:true,
      dicData: [{
        label: '关闭',
        value: 0
      }, {
        label: '开启',
        value: 1
      }]
    }, {
      type: "select",
      label: "分佣模式",
      prop: "profitType",
      row:true,
      span: 12,
      search: true,
      dicData: [/!*{
        label: '传统二级分佣',
        value: '1'
      }, *!/{
        label: '三级无限分佣',
        value: 2
      }],
      rules: [{
        message: "请选择分佣模式",
        required: true,
        trigger: 'blur'
      }]
    }, */{
      precision:2,
      controlsPosition:'',
      formslot: true,
      row:true,
      append:'%',
      type:'number',
      label: "一级代理分佣比率",
      prop: "agentProfitRate",
      span: 12,
      headerslot:true,
      rules: [{
        message: "请填写一级代理分佣比率",
        required: true,
        trigger: 'blur'
      }]
    }, /*{
      precision:2,
      controlsPosition:'',
      append:'%',
      formslot: true,
      row:true,
      headerslot:true,
      minWidth: 100,
      type:'number',
      label: "一级代理子账号分佣比率",
      prop: "sonProfitRate",
      span: 12,
      rules: [{
        message: "请填写一级代理子账号分佣比率",
        required: true,
        trigger: 'blur'
      }]
    },  {
      precision:2,
      controlsPosition:'',
      formslot: true,
      row:true,
      headerslot:true,
      append:'%',
      type:'number',
      label: "二级代理分佣比率",
      prop: "secondProfitRate",
      span: 12,
      rules: [{
        message: "请填写二级代理分佣比率",
        required: true,
        trigger: 'blur'
      }]
    },*/   {
      label: "创建时间",
      prop: "createTime",
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      search: false,
      addDisplay: false,
      editDisplay: false
    }]
}

export const memberTableOption = {
  border: true,
  index: true,
  indexLabel: "序号",
  stripe: true,
  searchMenuPosition: "left",
  align: "center",
  searchMenuSpan: 6,
  labelWidth: 180,
  menu:false,
  delBtn:true,
  addBtn:false,
  editBtn:false,
  reserveSelection:true,
  selection:false,
  column: [
    {
      "prop": "username",
      "span": 12,
      "type": "input",
      "label": "用户名",
    }, {
      "prop": "phone",
      "span": 12,
      "type": "input",
      "label": "手机号",
      "rules": [{
        "message": "手机号必须填写",
        "required": true
      }],
      "pattern": "",
      "required": true,
      "maxlength": 11,
      "search": true,
      "editDisplay": true,
      "editDisabled": true
    },{
      "prop": "profitName",
      "span": 12,
      "type": "input",
      "label": "分佣模板",
      "search": true
    },/*{
      "prop": "comboId",
      "span": 12,
      "type": "select",
      "label": "会员套餐",
      "value":1,
      "search": true,
      "props": {
        "label": "name",
        "value": "id"
      },
      "dicUrl": '/member/combo/findAllList',
      "dicMethod": 'get',
      "display": true,
      "required": true,
      "cascaderItem": []
    }*/]
}
