<template>
  <div class="execution">
    <el-form ref="allocationShopForm" :model="allocationShopForm" label-width="80px" class="price-config-form" status-icon>
      <el-form-item label="id">
        <el-input v-model="allocationShopForm.userId" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="allocationShopForm.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="分配店铺" prop="merchantName">
          <avue-select
            v-model="allocationShopForm.shopIds"
            :dic="shopOptions"
            :props="shopProps"
            multiple
            placeholder="请选择店铺"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getAllList} from '@/api/dfh/shop'
  import {getUserShopList, allocationShop} from '@/api/admin/usershop'

  export default {
    name: 'AllocationShop',
    data() {
      return{
        shopOptions:[],
        shopProps: {
          label: 'shopName',
          value: 'id'
        },
        allocationShopForm:{},
      }
    },
    methods: {
      init(userId) {
        getAllList().then(response => {
          this.shopOptions = response.data.data
        })
        getUserShopList(userId).then(response => {
          this.allocationShopForm.shopIds = response.data.data
        })
      },
      ok(){
        var than = this;
        this.$refs['allocationShopForm'].validate((valid) => {
          if (valid) {
            allocationShop(than.allocationShopForm).then(data => {
                this.$message.success('保存成功')
                this.$emit('ok');
                than.allocationShopForm = {};
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
