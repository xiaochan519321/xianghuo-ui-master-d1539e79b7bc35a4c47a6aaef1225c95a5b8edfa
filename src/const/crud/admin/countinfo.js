

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
            "label": "分站ID",
            "prop": "id",
            "span": 12,
        },
        {
          "type": "input",
          "label": "网站名称",
          "prop": "name",
          "span": 12,
          "search": true
      },
      {
        "hide": false,
        "label": '网战logo',
        "prop": 'htLogo',
        "type": 'upload',
        "loadText": '图标上传中，请稍等',
        "propsHttp": {
          "home": 'http://bucket.damaijia.co/',
          "res": 'data'
        },
        "action": "/admin/sys-file/upload",
        "listType": 'picture-img',
      },
    //   {
    //     type: 'select',
    //     label: '身份',
    //     dicData: [
    //     //   {
    //     //     label: '个人版',
    //     //     value: '1'
    //     //   },
    //     // //   {
    //     // //     label: 'rightName',
    //     // //     value: 'rightId'
    //     // //   }
          
    //     //   {
    //     //     label: '旗舰版',
    //     //     value: '2'
    //     //   },
    //     //   {
    //     //     label: '团队版',
    //     //     value: '3'
    //     //   }
    //     //   ,
    //     //   {
    //     //     label: '企业版',
    //     //     value: '4'
    //     //   }
    //     ],
    //     cascaderItem: [],
    //     span: 24,
    //     display: true,
    //     props: {
    //       label: 'rightName',
    //       value: 'rightId'
    //     },
    //     prop: 'rightName',
    //     // "search": true
    //   },
      {
        "type": "input",
        "label": "网站域名",
        "prop": "domain",
        "span": 12
      },
      {
        "type": "input",
        "label": "用户总量",
        "prop": "userNum",
        "span": 12
      },
      {
        "type": "input",
        "label": "今日注册用户",
        "prop": "toDayUserNum",
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
        "label": "7天内未登录",
        "prop": "inactiveUserNum",
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
        "label": "站点余额",
        "prop": "balance",
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
        "label": "今日充值金额",
        "prop": "toDayAmount",
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
        "label": "本周充值金额",
        "prop": "weekAmount",
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
        "label": "本月充值金额",
        "prop": "monthAmount",
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
        "label": "本月成交订单",
        "prop": "orderNum",
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
  