export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  searchMenuSpan:6,
  editBtn: false,
  delBtn: false,
  align: 'center',
  addBtn: false,
  column: [{
    fixed: true,
    label: 'id',
    prop: 'userId',
    span: 24,
    hide: true,
    editDisabled: true,
    addDisplay: false
  }, 
  {
    fixed: true,
    label: '用户名',
    prop: 'username',
    editDisabled: true,
    slot: true,
    search: true,
    span: 24,
    rules: [
      {
        required: true,
        message: '请输入用户名'
      },
      {
        min: 3,
        max: 20,
        message: '长度在 3 到 20 个字符',
        trigger: 'blur'
      }
    ]
  }, 
  {
    label: '密码',
    prop: 'password',
    type: 'password',
    value: '',
    hide: true,
    span: 24,
    rules: [{
      pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/,
      message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 8 - 30位',
      trigger: 'blur'
    }]
  }, 
  {
    label: '所属站点',
    prop: 'tenantId',
    formslot: true,
    slot: true,
    span: 24,
    hide: true,
    rules: [{
      required: true,
      message: '请选择站点',
      trigger: 'change'
    }]
  }, 
  {
    label: '手机号',
    prop: 'phone',
    value: '',
    search: true,
    span: 24,
    rules: [{
      required: true,
      min: 11,
      max: 11,
      message: '长度在 11 个字符',
      trigger: 'blur'
    }]
  }, 
  {
    label: '上级ID',
    prop: 'agentId',
    value: '',
    hide: true,
    search: false,
    span: 24
  }, 
  {
    label: '上级代理',
    prop: 'agentName',
    value: '',
    search: true,
    span: 24
  }, 
  {
    label: '角色',
    prop: 'role',
    formslot: true,
    slot: true,
    overHidden: true,
    span: 24,
    rules: [{
      required: true,
      message: '请选择角色',
      trigger: 'blur'
    }]
  }, 
  {
    label: '状态',
    prop: 'lockFlag',
    type: 'radio',
    slot: true,
    border:true,
    span: 24,
    rules: [{
      required: true,
      message: '请选择状态',
      trigger: 'blur'
    }],
    dicData: [{
      label: '有效',
      value: '0'
    }, {
      label: '锁定',
      value: '9'
    }]
  }, 
  {
    width: 180,
    label: '创建时间',
    prop: 'createTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    editDisabled: true,
    addDisplay: false,
    span: 24
  }]
}
