<template>
  <div class="execution">
      <el-form ref="presentForm" :model="presentForm" label-width="80px" class="price-config-form" status-icon>
        <el-form-item label="商家名称" prop="merchantName">
          <el-input v-model="presentForm.merchantName" readonly></el-input>
        </el-form-item>

        <el-form-item label="当前积分" prop="merchantName">
          <el-input v-model="presentForm.integral" readonly></el-input>
        </el-form-item>
        <el-form-item label="本次回收" prop="merchantName">
          <el-input-number :min="10" size="medium" :controls="false" :step="10" step-strictly v-model="presentForm.presentIntegral"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-tag type="danger">回收积分需输入10 的倍数, 系统自动四舍五入</el-tag>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
  import { retrieveIntegral } from '@/api/admin/merchant'

  export default {
    name: 'presentIntegral',
    data() {
      return{
          presentForm:{}
      }
    },
    methods: {
        ok(){
            const params = {integral: this.presentForm.presentIntegral, userId: this.presentForm.userId}
            var than = this;
            if (this.presentForm.presentIntegral > this.presentForm.integral) {
                return this.$message.warning('一次回收不能超过当前商家积分')
                }
                retrieveIntegral(params).then(data => {
                this.$message.success('回收成功')
                this.$emit('ok');
                than.presentForm = {};
                }).catch(() => {
                    loading();
                });
            }
        }
  }
</script>
