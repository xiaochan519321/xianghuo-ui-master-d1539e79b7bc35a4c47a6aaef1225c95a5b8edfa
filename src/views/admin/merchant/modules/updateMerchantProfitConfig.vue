<template>
  <div>
    <el-form :model="form" ref="checkForm" >
      <el-form-item label="分佣模板" :label-width="formLabelWidth">
        <el-select v-model="form.profitConfigId" placeholder="请选择分佣模板">
          <el-option
                v-for="item in profitConfigList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import {getProfitConfigList, bindProfitConfig} from "@/api/admin/profitconfig"
export default {
    data() {
      return {
        profitConfigList: [],
        form:{   
            profitConfigId: 0,
            id: 0
        }
      };
    },
    created() {
      this.initData()
    },
    methods: {
      initData(){
        getProfitConfigList().then(res => {
              console.log(res.data.data)
                this.profitConfigList = res.data.data;
                // console.log(this.profitConfigList)
         })
      },
      save(){
        console.log("........")
        var than = this;
        this.$refs['checkForm'].validate((valid) => {
          if (valid) {
            bindProfitConfig(than.form).then(data => {
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