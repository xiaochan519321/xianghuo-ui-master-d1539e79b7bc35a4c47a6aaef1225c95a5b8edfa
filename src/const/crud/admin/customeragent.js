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
            "label": "用户名",
            "prop": "userName",
            "span": 12,
            "search": true
        },
        {
          "type": "input",
          "label": "备注名",
          "prop": "merchantName",
          "span": 12,
          "search": true
      },
      {
        "type": "input",
        "label": "手机号",
        "prop": "phone",
        "span": 12,
        "search": true
      },	  	  
      {
        type: 'select',
        label: '身份',
        dicData: [
        //   {
        //     label: '个人版',
        //     value: '1'
        //   },
        // //   {
        // //     label: 'rightName',
        // //     value: 'rightId'
        // //   }
          
        //   {
        //     label: '旗舰版',
        //     value: '2'
        //   },
        //   {
        //     label: '团队版',
        //     value: '3'
        //   }
        //   ,
        //   {
        //     label: '企业版',
        //     value: '4'
        //   }
        ],
        cascaderItem: [],
        span: 24,
        display: true,
        props: {
          label: 'rightName',
          value: 'rightId'
        },
        prop: 'rightName',
        // "search": true
      },
      {
        "type": "input",
        "label": "7天登录次数",
        "prop": "weekLogonSum",
        "span": 12
      },
      {
        "type": "input",
        "label": "最近登陆时间",
        "prop": "updateTime",
        "span": 12
      },
      {
        "type": "input",
        "label": "消费金额（当天）",
        "prop": "nowMoney",
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
        "label": "消费金额（7天内）",
        "prop": "weekMoney",
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
        "label": "消费金额（一月内）",
        "prop": "monthMoney",
        "span": 12
        ,formatter:(val,value,label)=>{
            if(value == null){
                return '0';
            }
            return value / 100;
        }
      },
      {
        "type": "input",
        "label": "完成订单数",
        "prop": "ouderNum",
        "span": 12,
        formatter:(val,value,label)=>{
          if(value == null){
              return '0';
          }
          return value;
      }
      },
      {
        "type": "input",
        "label": "剩余积分",
        "prop": "integral",
        "span": 12,
        formatter:(val,value,label)=>{
            if(value == null){
                return '0';
            }
            return value;
        }
      },
     {
        "type": "input",
        "label": "创建时间",
        "prop": "createTime",
        "span": 12
      },
       
    ]
  }
  