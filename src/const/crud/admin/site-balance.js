export const tabOption = {
    span: 24,
    decimals: 2,
    data: [
      {
        title: '站点余额',
        subtitle: '刷新',
        count: 0,
        color: 'rgb(70, 180, 109)',
        key: '元',
        click: function(item){
          parent.btnRefreshBalance.click()
        }
      }
    ]
  }
export const rechargeTabOption = {
    decimals: 2,
    data: [
        {
            title: '',
            count: '10000元',
            icon: 'icon-pay6zhifu',
            color: 'rgb(70, 180, 109)',
            click: function (item) {
                if (item.count && item.count.indexOf('元')) {
                    parent.balance.value = item.count.replaceAll('元', '')
                    parent.balance.readOnly = true
                    parent.btnRecharge.click()
                }
            }
        }, {
            title: '',
            count: '15000元',
            icon: 'icon-pay6zhifu',
            color: 'rgb(70, 180, 109)',
            click: function (item) {
                if (item.count && item.count.indexOf('元')) {
                    parent.balance.value = item.count.replaceAll('元', '')
                    parent.balance.readOnly = true
                    parent.btnRecharge.click()
                }
            }
        }, {
            title: '',
            count: '20000元',
            icon: 'icon-pay6zhifu',
            color: 'rgb(70, 180, 109)',
            click: function (item) {
                if (item.count && item.count.indexOf('元')) {
                    parent.balance.value = item.count.replaceAll('元', '')
                    parent.balance.readOnly = true
                    parent.btnRecharge.click()
                }
            }
        }, {
            title: '',
            count: '25000元',
            icon: 'icon-pay6zhifu',
            color: 'rgb(70, 180, 109)',
            click: function (item) {
                if (item.count && item.count.indexOf('元')) {
                    parent.balance.value = item.count.replaceAll('元', '')
                    parent.balance.readOnly = true
                    parent.btnRecharge.click()
                }
            }
        }, {
            title: '',
            count: '30000元',
            icon: 'icon-pay6zhifu',
            color: 'rgb(70, 180, 109)',
            click: function (item) {
                if (item.count && item.count.indexOf('元')) {
                    parent.balance.value = item.count.replaceAll('元', '')
                    parent.balance.readOnly = true
                    parent.btnRecharge.click()
                }
            }
        }, {
            title: '',
            count: '35000元',
            icon: 'icon-pay6zhifu',
            color: 'rgb(70, 180, 109)',
            click: function (item) {
                if (item.count && item.count.indexOf('元')) {
                    parent.balance.value = item.count.replaceAll('元', '')
                    parent.balance.readOnly = true
                    parent.btnRecharge.click()
                }
            }
        }/*, {
        title: '',
        count: '自定义',
        icon: 'icon-pay6zhifu',
        color: 'rgb(70, 180, 109)',
        click: function (item) {
          if (item.count && item.count.indexOf('元')) {
            parent.balance.value = ''
            parent.balance.readOnly = false
          }
        }
      }*/
    ]
}

export const tableOption = {
    menu: false, //不显示操作
    title: '站点余额流水记录',
    titleSize: 'h3',
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    header: false,
    menuAlign: 'center',
    searchMenuSpan: 4,
    editBtn: false,
    delBtn: false,
    align: 'center',
    addBtn: false,
    column: [{
        fixed: true,
        label: 'id',
        prop: 'id',
        span: 24,
        hide: true
    }, {
        type: 'select',
        label: '站点',
        prop: 'tenantId',
        search: true,
        showColumn: false, //表格中是否显示
        searchslot: true,
    }, {
        label: '支付单号',
        prop: 'payOrderId',
        search: true,
        span: 26
    }, {
        label: '变更类型',
        prop: 'recordType',
        type: 'select',
        border: true,
        search: true,
        span: 24,
        dicData: [{
            label: '充值',
            value: 1
        }, {
            label: '消耗',
            value: 2
        }, {
            label: '回收',
            value: 3
        }]
    }, {
        label: '支出类型',
        prop: 'spendingType',
        type: 'select',
        border: true,
        search: true,
        span: 24,
        dicData: [{
            label: '下单扣除',
            value: 0
        }, {
            label: '优惠卷扣除',
            value: 1,
        }, {
            label: '开通会员',
            value: 2,
        }, {
            label: '购买店铺',
            value: 3,
        }, {
            label: '续费店铺',
            value: 4
        }, {
            label: '生成卡密',
            value: 5
        }, {
            label: '积分充值',
            value: 6
        },{
            label: '赠送积分',
            value: 7
        }]
    }, {
        label: '变更金额（元）',
        prop: 'moneyStr',
        value: '',
        span: 24,

    }, {
        label: '剩余金额（元）',
        prop: 'balance',
        value: '',
        span: 24,

    }, {
        label: '备注',
        prop: 'remark',
        value: '',
        span: 24,

    }, {
        width: 180,
        label: '变更时间',
        prop: 'createTime',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        search: true,
        span: 24
    }]
}
