<template>
  <div class="execution">
    <el-form ref="checkForm" :model="checkForm" label-width="80px" :rules="rules" class="price-config-form" status-icon>
      <el-form-item label="用户名">
        <el-input v-model="checkForm.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="商家名称" prop="merchantName">
        <el-input v-model="checkForm.merchantName"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="lockFlag">
        <el-radio v-model="checkForm.lockFlag" label="0" border>有效</el-radio>
        <el-radio v-model="checkForm.lockFlag" label="9" border style="">锁定</el-radio>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {checkMerchant} from '@/api/admin/merchant'

  export default {
    name: 'checkMerchant',
    data() {
      return{
          checkForm:{},
          rules: {
            merchantName: [
              { required: true, message: '商家名称必填', trigger: 'blur' }
            ],
            lockFlag: [
              { required: true, message: '状态必填', trigger: 'blur' }
            ]
          }
      }
    },
    methods: {
      ok(){
        var than = this;
        this.$refs['checkForm'].validate((valid) => {
          if (valid) {
            checkMerchant(than.checkForm).then(data => {
                this.$message.success('保存成功')
                this.$emit('ok');
                than.checkForm = {};
            }).catch(() => {
                loading();
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>
