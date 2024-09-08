import { isvalidatemobile } from "@/util/validate"

const validatePhone = (rule, value, callback) => {
    console.log('val', value)
    if (!value) {
        callback('手机号不能为空！')
    } else if (isvalidatemobile(value)[0]) {
        callback(isvalidatemobile(value)[1])
    } else {
        callback();
    }
};

const validateRate = (rule, value, callback) => {
    if (!value) {
        callback('分佣比例不能为空！')
    } else if (value > 100) {
        callback('分佣比例最高不能超过100%！')
    } else {
        callback();
    }
}

export const tableOption = {
  "border": true,
  "index": true,
  "indexLabel": "序号",
  "stripe": true,
  "menuAlign": "center",
  "align": "center",
  "searchMenuSpan": 4,
  "menuWidth": 250,
  "searchSize": 'mini',
  "dialogWidth": 450,
  "dialogClickModal": false,
  "addTitle": '添加销售人员',
  "editTitle": '编辑销售人员',
  "menuHeaderAlign":'center',
  "editBtn": false, // 行编辑按钮
  "delBtn": false, // 行删除钮
  "addBtn": false, // 新增按钮
  "selection":true,
  "column": [
    {
      "type": "input",
      "label": "用户名",
      "prop": "username",
      "span": 24,
      "required": true,
      "rules": [{
          "message": "请输入用户名",
          "required": true
      }]
    },
    {
      "type": "input",
      "label": "手机号/用户名",
      "prop": "userNameOrPhone",
      "searchLabelWidth": 110,
      "span": 12,
      "search": true,
      "searchSize": 'mini',
      "hide": true,
      "editDisabled": true,
      "addDisplay": false,
      "editDisplay": false,
    },
    {
      "label": "日期范围",
      "prop": "selectDate",
      "type": "datetime",
      "format":"yyyy-MM-dd",
      "valueFormat":"yyyy-MM-dd",
      "startPlaceholder": "日期开始",
      "endPlaceholder": "日期结束",
      "searchRange":true,
      "search": true,
      "searchSize": 'mini',
      "hide": true,
      "span": 12,
      "editDisabled": true,
      "addDisplay": false,
      "editDisplay": false,

    },
    {
      "type": "input",
      "label": "手机号",
      "prop": "phone",
      "span": 24,
      "minWidth": 120,
      "rules": [{
          "required": true,
          "trigger": "blur",
          "validator": validatePhone
      }]
    },
    {
      "type": "number",
      "label": "当前佣金",
      "prop": "commission",
      "span": 24,
      "editDisabled": true,
      "addDisplay": false,
      "editDisplay": false,
    },
    {
      "type": "password",
      "label": "密码",
      "prop": "password",
      "span": 24,
      "hide": true
    },
    {
      "type": "password",
      "label": "确认密码",
      "prop": "password2",
      "span": 24,
      "hide": true
    },
    {
      "type": "input",
      "label": "分佣比例",
      "prop": "profitRate",
      "append": '%',
      "span": 24,
      "controls": false,
      "rules": [{
          "required": true,
          "trigger": "blur",
          "validator": validateRate
      }],
      "formatter": (val, value, label) => {
        return (value || 0) + '%';
      }
    },
    {
      "type": "input",
      "label": "分配人数",
      "prop": "customerSum",
      "span": 24,
      "editDisabled": true,
      "addDisplay": false,
      "editDisplay": false,
    },
    {
      "type": "input",
      "label": "邀请人数",
      "prop": "promoteSum",
      "span": 24,
      "editDisabled": true,
      "addDisplay": false,
      "editDisplay": false,
    },
      {
      "type": "input",
      "label": "今日活跃",
      "prop": "activeCustomer",
      "span": 12,
      "editDisabled": true,
      "editDisplay": false,
      "addDisplay": false
    },
    {
      "type": "input",
      "label": "备注",
      "editDisabled": true,
      "addDisplay": false,
      "editDisplay": false,
      "prop": "merchantName",
      "span": 12,
    },
    {
      "type": "radio",
      "label": "状态",
      "prop": "lockFlag",
      "span": 24,
      "slot": true,
      "border":true,
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
      "label": "创建时间",
      "editDisabled": true,
      "addDisplay": false,
      "editDisplay": false,
      "prop": "createTime",
      "span": 12,
      "minWidth": 150
    },

  ]
}
