<template>
  <div class="execution">
    <el-form ref="dataForm" :model="dataForm" label-width="80px" :rules="rules" class="price-config-form" status-icon>
      <el-form-item label="旗色" prop="flagStar">
        <el-radio-group v-model="dataForm.flagStar" style="zoom: 1.1;">
          <el-radio :label="0"><i style="color:gray;" class="el-icon-s-flag"></i></el-radio>
          <el-radio :label="5"><i style="color:red;" class="el-icon-s-flag"></i></el-radio>
          <el-radio :label="4"><i style="color:orange;" class="el-icon-s-flag"></i></el-radio>
          <el-radio :label="3"><i style="color:green;" class="el-icon-s-flag"></i></el-radio>
          <el-radio :label="2"><i style="color:cyan;" class="el-icon-s-flag"></i></el-radio>
          <el-radio :label="1"><i style="color:purple;" class="el-icon-s-flag"></i></el-radio>
          <el-radio :label="9">无</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="flagRemark">
        <el-input v-model="dataForm.flagRemark" placeholder="备注内容，最大不得超过500个字符" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {flag} from '@/api/dfh/pdduser'

  export default {
    name: 'flag',
    data() {
      return{
        dataForm:{},
        rules: {
          flagStar: [
            { required: true, message: '请选择旗色', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      ok(){
        var than = this;
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            flag({"ids":than.dataForm.id,"dataForm":than.dataForm}).then(data => {
              than.$message.success('标记成功')
              than.$emit('ok');
              than.dataForm = {};
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
