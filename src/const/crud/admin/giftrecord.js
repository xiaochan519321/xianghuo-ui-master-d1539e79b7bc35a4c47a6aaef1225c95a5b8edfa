export const tableOption = {
  "border": true,
  "index": true,
  "indexLabel": "序号",
  "stripe": true,
  "menuAlign": "center",
  "align": "center",
  "menu":false,
  "searchMenuSpan": 6,
  "column": [
    {
      "type": "input",
      "label": "手机号",
      "prop": "phone",
      "span": 12,
      "search": true
    },	  	  
    {
      type: 'select',
      label: '赠送类型',
      dicData: [
        {
          label: '个人版会员',
          value: '1'
        }
      ],
      cascaderItem: [],
      span: 24,
      display: true,
      props: {
        label: 'label',
        value: 'value'
      },
      prop: 'giftType'
    },
    {
      "type": "input",
      "label": "赠送天数",
      "prop": "giftDate",
      "span": 12
    },	  {
      "type": "input",
      "label": "创建时间",
      "prop": "createTime",
      "span": 12
    },	  
     {
      type: 'select',
      label: '赠送原因',
      dicData: [
        {
          label: '邀请活动',
          value: '1'
        }
      ],
      cascaderItem: [],
      span: 24,
      display: true,
      props: {
        label: 'label',
        value: 'value'
      },
      prop: 'giftReason'
    }  
  ]
}
