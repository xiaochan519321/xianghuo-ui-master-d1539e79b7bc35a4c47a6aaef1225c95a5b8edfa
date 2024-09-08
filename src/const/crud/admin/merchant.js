
import moment from 'moment';
const nowDate = moment().format('YYYY-MM-DD HH:mm:ss')
export const tableOption = {
  border: true,
  index: true,
  indexLabel: "序号",
  stripe: true,
  menuAlign: "center",
  align: "center",
  searchMenuSpan: 6,
  selection:true,//开关多选
  reserveSelection: true,//保留上一页选择的数据
  editBtn:false, // 行编辑按钮
  delBtn:false, // 行删除钮
  addBtn:false, // 新增按钮
  defaultSort: {
    "prop":"createTime",
    "order":'descending'
  },
  column: [
    {
      type: "input",
      label: "id",
      prop: "id",
      span: 12,
      showColumn:false, //表格中是否显示
      display: false, //新增编辑是否显示
    },
    {
      type: "number",
      label: "不活跃天数",
      prop: "deadDays",
      span: 12,
      showColumn:false, //表格中是否显示
      display: false, //新增编辑是否显示
      search: true,
      searchLabelWidth: 90
    },
    {
      type: "input",
      label: "站点",
      prop: "siteName",
      span: 12,
      search: true
    },
    {
      type: "input",
      label: "商家备注",
      prop: "merchantName",
      span: 12,
      search: true
    },
    {
      type: "input",
      label: "登录账号",
      prop: "username",
      span: 12,
      search: true
    },
    {
      type: "input",
      label: "商家userId",
      prop: "userId",
      span: 12,
      showColumn:false, //表格中是否显示
      display: false, //新增编辑是否显示
    },
    {
      type: "input",
      label: "手机号",
      prop: "phone",
      span: 12,
      search: true
    },
    {
      type: "input",
      label: "剩余积分",
      prop: "integral",
      span: 12,
      sortable:true, //是否允许排序
    },
    {
      type: 'select',
      label: '会员状态',
      "dicData": [
        {
          label: '试用版',
          value: 'Trial'
        },
        {
          label: '个人版',
          value: 'regular'
        },
        {
          label: '旗舰版',
          value: 'personal'
        },
        {
          label: '团队版',
          value: 'team'
        },
        {
          label: '企业版',
          value: 'enterprise'
        },
       
      ],
      cascaderItem: [],
      span: 24,
      display: true,
      props: {
        label: 'label',
        value: 'value'
      },
      prop: 'rightName',
      search: true,
    },
    {
      type: 'select',
      label: '有无代理',
      dicData: [
        {
          label: '全部',
          value: undefined
        },
        {
          label: '无代理',
          value: 1
        },
        {
          label: '有代理',
          value: 2
        }
      ],
      cascaderItem: [],
      span: 24,
      display: true,
      props: {
        label: 'label',
        value: 'value'
      },
      prop: 'isSalesBinding',
      showColumn:false, //表格中是否显示
      display: false, //新增编辑是否显示
      search: true
    },
    {
      type: 'select',
      label: '有无邀请',
      dicData: [
        {
          label: '全部',
          value: undefined
        },
        {
          label: '有邀请',
          value: 1
        },
        {
          label: '无邀请',
          value: 2
        }
      ],
      cascaderItem: [],
      span: 24,
      display: true,
      props: {
        label: 'label',
        value: 'value'
      },
      prop: 'isOldBinding',
      showColumn:false, //表格中是否显示
      display: false, //新增编辑是否显示
      search: true
    },
    {
      type: "input",
      label: "会员过期时间",
      prop: "rightExpireTime",
      span: 12,
      border:true,
      sortable:true, //是否允许排序
      formatter:(val,value,label)=>{
        if(value < nowDate){
            return '已过期';
        }
        return value;
      }
    },
    {
      type: "input",
      label: "免积分拍单权益",
      prop: "integralSkipStatus",
      span: 12,
      formatter:(val,value,label)=>{
        if(value === 1){
          return '有';
        } else {
          return '-';
        }
      }
    },
    {
      type: "input",
      label: "免积分结束时间",
      prop: "integralSkipExpireTime",
      span: 12,
    },
    {
      label: '状态',
      prop: 'lockFlag',
      type: 'radio',
      search: true,
      slot: true,
      border:true,
      span: 24,
      rules: [{
        "required": true,
        "message": '请选择状态',
        "trigger": 'blur'
      }],
      dicData: [{
        "label": '有效',
        "value": '0'
      }, {
        "label": '锁定',
        "value": '9'
      }]
    },
    {
      type: "input",
      label: "面单余额",
      prop: "balance",
    },
    {
      type: 'select',
      label: '是否代理',
      dicData: [
        {
          label: '全部',
          value: undefined
        },
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        },
        {
          label: '是',
          value: 2
        }
      ],
      cascaderItem: [],
      span: 24,
      display: true,
      props: {
        label: 'label',
        value: 'value'
      },
      prop: 'agentStatus',
      search: true
    },
    {
      type: "input",
      label: "分佣模板名称",
      prop: "profitConfigName",
      span: 12,
      formatter:(val,value,label)=>{
        if(value == null){
            return '-';
        }
        return value;
    }
    },
    {
      type: "input",
      label: "上次登录时间",
      prop: "updateTime",
      span: 12,
      sortable:true, //是否允许排序
      order: 'descending',//默认排序方式  ascending：升序，descending：降序
      formatter:(val,value,label)=>{
        if(value == null){
            return '-';
        }
        return value;
    }
    },
    {
      type: "input",
      label: "注册时间",
      prop: "createTime",
      span: 12,
      sortable:true, //是否允许排序
      order: 'descending',//默认排序方式  ascending：升序，descending：降序
    }
  ]
}
