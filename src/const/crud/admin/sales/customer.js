export const tableOption = {
    "border": true,
    "index": true,
    "indexLabel": "序号",
    "stripe": true,
    "menuAlign": "center",
    "menuWidth": 120,
    "reserveSelection": true,//保留上一页选择的数据
    "rowKey": "merchantId",//设置行索引
    "align": "center",
    "height": 'auto',
    "menu": true,//控制表格右操作菜单显隐
    "searchMenuSpan": 6,
    "editBtn":false, // 行编辑按钮
    "delBtn":false, // 行删除钮
    "addBtn":false, // 新增按钮
    "selection": true,
    "column": [
      {
        ref: 'selectType',
        type: 'select',
        label: '绑定状态',
        dicData: [
          {
            label: '全部',
            value: 0
          },
          {
            label: '已绑定',
            value: 1
          },
          {
            label: '未绑定',
            value: 2
          }
        ],
        selectTypeItem: [],
        span: 12,
        display: true,
        props: {
          label: 'label',
          value: 'value'
        },
        prop: 'isSalesBinding',
        "showColumn":false, //表格中是否显示
        "searchSize": "mini",
        search: true
      },
      {
        "type": "input",
        "label": "商家UserId",
        "prop": "userId",
        "span": 12,
        "showColumn":false, //表格中是否显示
        "display": false, //新增编辑是否显示
      },
      {
        "type": "input",
        "label": "商家id",
        "prop": "merchantId",
        "span": 12,
        "showColumn":false, //表格中是否显示
        "display": false, //新增编辑是否显示
  
      },
      {
        "type": "input",
        "label": "用户名称",
        "prop": "username",
        "minWidth": 120,
        "span": 12,
        "showColumn":true, //表格中是否显示
        "display": false, //新增编辑是否显示
      },
      {
        "type": "input",
        "label": "商家名称",
        "minWidth": 120,
        "prop": "merchantName",
        "span": 12,
      },
      {
        "type": "input",
        "label": "电话姓名",
        "prop": "userNameOrPhone",
        "span": 12,
        "searchSize": "mini",
        "searchPlaceholder": '请输入电话号码或姓名',
        "showColumn":false, //表格中是否显示
        "display": false, //新增编辑是否显示
        search: true
      },
      {
        "type": "input",
        "label": "手机号",
        "minWidth": 120,
        "prop": "phone",
        "span": 12,
      },
      {
        "label": '状态',
        "prop": 'lockFlag',
        "type": 'radio',
        "searchSize": "mini",
        "search": true,
        "slot": true,
        "border":true,
        "span": 12,
        "rules": [{
          "required": true,
          "message": '请选择状态',
          "trigger": 'blur'
        }],
        "dicData": [{
          "label": '有效',
          "value": '0'
        }, {
          "label": '锁定',
          "value": '9'
        }]
      },
      {
        "type": "input",
        "label": "近一月充值",
        "prop": "monthMoney",
        "span": 12,
        formatter:(val,value,label)=>{
            if(value == null){
                return '0';
            }
            return value / 100;
        }
      },
      {
        "type": "input",
        "label": "上级销售",
        "minWidth": 100,
        "prop": "salesUserName",
        "span": 12,
      },
    ]
  }
  