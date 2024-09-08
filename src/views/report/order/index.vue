<template>
  <div class="execution">
    <basic-container>
      <div class="header">
          <el-radio-group v-model="active">
            <el-radio-button label="first">销售数据</el-radio-button>
            <el-radio-button label="second">采购数据</el-radio-button>
            <el-radio-button label="third">销售退款数据</el-radio-button>
            <el-radio-button label="fourth">采购退款数据</el-radio-button>
        </el-radio-group>
      </div>
      <el-tabs v-model="active" v-if="false">
        <el-tab-pane label="销售数据" name="first"></el-tab-pane>
        <el-tab-pane label="采购数据" name="second"></el-tab-pane>
        <el-tab-pane label="销售退款数据" name="third"></el-tab-pane>
        <el-tab-pane label="采购退款数据" name="fourth"></el-tab-pane>
      </el-tabs>
      <div v-if="active == 'first'"><SalesData></SalesData></div>
      <div v-else-if="active == 'second'"><PurchaseData></PurchaseData></div>
      <div v-else-if="active == 'third'"><SalesRefundData></SalesRefundData></div>
      <div v-else-if="active == 'fourth'"><PurchaseRefundData></PurchaseRefundData></div>
    </basic-container>
  </div>
</template>
<script>

import SalesData from '@/views/report/sales/data/index';
import SalesRefundData from '@/views/report/sales/refund/index';
import PurchaseData from '@/views/report/purchase/data/index';
import PurchaseRefundData from '@/views/report/purchase/refund/index';
export default {
    name: "orderReport",
    data() {
      return {
        active: 'first'
      }
    },
    methods: {},
    components: {
      PurchaseData,
      SalesData,
      SalesRefundData,
      PurchaseRefundData
    }
};


</script>

<style lang="scss" scoped>
.header {
  padding: 16px 0px 16px 16px;
  background: #fff;
  border-radius: 12px;
  ::v-deep .el-radio-group {
            .el-radio-button  {
                .el-radio-button__inner {
                    padding-left: 8px;
                    padding-right: 8px;
                }
            }
        }
}
</style>
