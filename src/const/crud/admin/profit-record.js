/*
 * @Descripttion: 
 * @Author: 朱天杰
 * @Date: 2022-04-18 13:52:46
 */
export const tableOption = {
  "menu": false, //不显示操作
  "border": false,
  "index": true,
  "indexLabel": "序号",
  "stripe": false,
  "menuAlign": "center",
  "align": "center",
  "searchMenuSpan": 4,
  searchIcon:true,
  searchShowBtn:false,
  searchShow: true, //首次加载是否显示搜索
  "column": [
	  {
      "type": "input",
      "label": "消费用户",
      "prop": "memberPhone",
      "search": true,
      "span": 12
    },	  {
      "type": "input",
      "label": "代理用户",
      "prop": "agentPhone",
      "search": true,
      "span": 12
    },	  {
      "type": "select",
      "label": "代理类型",
      "prop": "agentType",
      "search": false,
      showColumn:false, //表格中是否显示
      "span": 12,
      "dicData": [{
        "label": "一级代理",
        "value": 1
      },
        {
          "label": "二级代理",
          "value": 2
        },
        {
          "label": "一级代理子账号",
          "value": 3
        },
        {
          "label": "普通用户",
          "value": 4
        }]
    },	  {
      "type": "input",
      "label": "消费金额(元)",
      "prop": "money",
      "span": 12
    },	  {
      "type": "select",
      "label": "分佣类型",
      "prop": "profitType",
      "search": false,
      showColumn:false, //表格中是否显示
      "span": 12,
      "dicData": [{
        "label": "传统二级",
        "value": 1
      },
        {
          "label": "三级无限分佣",
          "value": 2
        },
        {
          "label": "直推",
          "value": 3
        }]
    },	  {
      "type": "input",
      "label": "分佣比率(%)",
      "prop": "profitRate",
      "span": 12
    },	  {
      "type": "input",
      "label": "佣金(元)",
      "prop": "profitMoney",
      "span": 12
    },	  {
      "label": "创建时间",
      "prop": "createTime",
      "span": 12,
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    }]
}
