import Vue from 'vue'

export const displayOption = {
  span: 3,
  decimals: 2,
  data: [
    {
      title: '销售金额',
      count: 0,
      decimals: 2,
      icon: 'el-icon-plus'
    },
    {
      title: '销售优惠金额',
      count: 0,
      icon: 'el-icon-minus',
    },
    {
      title: '采购金额',
      count: 0,
      icon: 'el-icon-minus'
    },
    {
      title: '采购优惠金额',
      count: 0,
      icon: 'el-icon-plus'
    },
    {
      click: function (item) {
        Vue.prototype.$message.info(item.title + "：订单未使用优惠卷,采购销售订单*0.3元");
      },
      title: '平台扣去金额',
      count: 0,
      decimals: 0,
      icon: 'el-icon-minus'
    },
    {
      click: function (item) {
        Vue.prototype.$message.info(item.title + "：采购销售额+优惠-采购金额-积分扣除费用");
      },
      title: '利润',
      count: 0,
      icon: 'el-icon-check',
    },
    {
      click: function (item) {
        Vue.prototype.$message.info(item.title + "：利润/采购销售额*100%");
      },
      title: '利润率',
      count: 0,
      icon: 'el-icon-finished',
      decimals: 2,
    }
  ]
}
