<!--
 * @Descripttion: 
 * @Author: 朱天杰
 * @Date: 2022-04-18 13:52:46
-->
<template>
    <div class="execution">
        <el-form ref="presentForm" :model="presentForm" label-width="80px" class="price-config-form" status-icon>
          <el-form-item label="商家名称" prop="merchantName">
            <el-input v-model="presentForm.merchantName" :disabled="true"></el-input>
          </el-form-item>
  
          <el-form-item label="当前余额" prop="balance">
            <el-input v-model="presentForm.balance" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="充值单量" prop="number">
            <el-input-number size="medium" :controls="false" :step="1" step-strictly v-model="presentForm.number"></el-input-number>
          </el-form-item>
        </el-form>
    </div>
  </template>
  
  <script>
    import { rechargeBalance } from '@/api/admin/merchant'
  
    export default {
      name: 'rechargeBalance',
      data() {
        return{
            presentForm:{}
        }
      },
      methods: {
        ok(){
          var than = this;
          if (undefined == this.presentForm.number || 0 == this.presentForm.number) {
            return this.$message.error('本次充值面单不能为空或0')
          } else if(this.presentForm.number > 100000) {
            return this.$message.error('一次充值不能超过10万')
          }
          rechargeBalance(than.presentForm).then(data => {
            this.$message.success('充值成功成功')
            this.$emit('ok');
            than.presentForm = {};
          }).catch(() => {
              loading();
          });
        }
      }
    }
  </script>
  