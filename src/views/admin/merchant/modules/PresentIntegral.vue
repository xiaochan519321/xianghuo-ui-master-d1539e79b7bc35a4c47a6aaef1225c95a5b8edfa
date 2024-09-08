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

        <el-form-item label="当前积分" prop="merchantName">
          <el-input v-model="presentForm.integral" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="本次赠送" prop="merchantName">
          <el-input-number :min="1" size="medium" :controls="false" :step="1" step-strictly v-model="presentForm.presentIntegral" ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-tag type="danger">赠送积分会按比例扣除站点余额(10积分扣1元)，请谨慎操作</el-tag>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
  import {presentIntegral} from '@/api/admin/merchant'

  export default {
    name: 'presentIntegral',
    data() {
      return{
          presentForm:{}
      }
    },
    methods: {
      ok(){
        var than = this;
        if (undefined == this.presentForm.presentIntegral || 0 == this.presentForm.presentIntegral) {
          return this.$message.error('本次赠送积分不能为空或0')
        } else if(this.presentForm.presentIntegral > 100000) {
          return this.$message.error('一次赠送不能超过10万积分')
        }
        presentIntegral(than.presentForm).then(data => {
          this.$message.success('赠送成功成功')
          this.$emit('ok');
          than.presentForm = {};
        }).catch(() => {
            loading();
        });
      }
    }
  }
</script>
