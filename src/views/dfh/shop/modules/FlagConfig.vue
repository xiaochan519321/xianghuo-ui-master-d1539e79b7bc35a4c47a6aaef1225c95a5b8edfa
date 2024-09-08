<template>
  <div class="execution">
    <el-form ref="dataForm" :model="dataForm" label-width="80px" :rules="rules" class="price-config-form" status-icon>
      <el-form-item label="默认旗色" prop="flagStar">
        <el-radio-group v-model="dataForm.flagStar" style="zoom: 1.1;">
          <el-radio :label="0"><i style="color:gray;" class="el-icon-s-flag"></i></el-radio>
          <el-radio :label="5"><i style="color:red;" class="el-icon-s-flag"></i></el-radio>
          <el-radio :label="4"><i style="color:orange;" class="el-icon-s-flag"></i></el-radio>
          <el-radio :label="3"><i style="color:green;" class="el-icon-s-flag"></i></el-radio>
          <el-radio :label="2"><i style="color:cyan;" class="el-icon-s-flag"></i></el-radio>
          <el-radio :label="1"><i style="color:purple;" class="el-icon-s-flag"></i></el-radio>
          <el-radio :label="9">不插旗</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="默认备注" prop="flagRemark">
        <el-input v-model="dataForm.flagRemark" placeholder="备注内容，最大不得超过500个字符" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-switch v-model="dataForm.flagStatus" active-text="开启" inactive-text="关闭" active-value="0" inactive-value="9"></el-switch>
      </el-form-item>
       <el-form-item label="">
        <el-tag type="danger">注意：该配置用于代发成功的订单自动标旗配置；</el-tag>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {flagConfig} from '@/api/dfh/shop'

  export default {
    name: 'flagConfig',
    data() {
      return{
        dataForm:{},
        rules: {
          flagRemark: [
            { required: true, message: '备注必填', trigger: 'blur' }
          ],
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
            flagConfig(than.dataForm).then(data => {
              than.$message.success('保存成功')
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
