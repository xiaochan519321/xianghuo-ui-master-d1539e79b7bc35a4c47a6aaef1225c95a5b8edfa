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
          <el-form-item label="卡密" prop="cdKey">
            <el-input :controls="false" :step="1" step-strictly v-model="presentForm.cdKey" ></el-input>
          </el-form-item>
        </el-form>
    </div>
  </template>
  
  <script>
    import { exchangeCdk } from '@/api/admin/merchant'
  
    export default {
      name: 'exchangeCdk',
      data() {
        return{
            presentForm:{}
        }
      },
      methods: {
        ok(){
          var than = this;
          if (undefined == this.presentForm.cdKey || 0 == this.presentForm.cdKey) {
            return this.$message.error('cdk 不能为空')
          }
          var postDat = {"userId": than.presentForm['userId'], "cdKey": this.presentForm.cdKey }
          exchangeCdk(postDat).then(data => {
            this.$message.success('卡密兑换成功')
            this.$emit('ok');
            than.presentForm = {};
          }).catch(() => {
              loading();
          });
        }
      }
    }
  </script>
  