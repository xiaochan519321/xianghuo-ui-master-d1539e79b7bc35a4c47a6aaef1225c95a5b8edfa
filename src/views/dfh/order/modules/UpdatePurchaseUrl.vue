<template>
  <div class="execution">
    <div class="table_c" style="background-color: #eef5ff;height: 50px;width: 100%;line-height: 50px;font-weight: 700;">
        <div class="cell" style="display: inline-block;text-align: left;width: 540px; margin-left: 50px;">采购链接</div>
        <div class="cell" style="display: inline-block;text-align: left;width: 120px; margin-left: 50px;">提示信息</div>
    </div>
    <br>
    <template v-for="(item,index) in puData">
        <el-row :gutter="30" >
          <el-col :sm="1" :md="1" :lg="1">
            <template>
              <input type="radio" name="girl" :value="item.id"  :id="item.id" :checked="item.isChecked" >
            </template>
          </el-col>
          <el-col :sm="17" :md="17" :lg="17">
            <el-input v-if="ifEdit" v-model="item.purchaseUrl" @blur="onEditPurchaseUrl(item.id,item.purchaseUrl)" type="text" clearable placeholder="请输入采购链接" />
              <span v-else>{{item.purchaseUrl}}</span>
          </el-col>
          <el-col :sm="3" :md="3" :lg="3">
            <el-tag size="mini" type="primary">{{item.hintInfo}}</el-tag>
          </el-col>
          <el-col :sm="2" :md="2" :lg="2">
            <el-button @click="editRows()" type="primary" circle><i class="el-icon-edit"></i></el-button>
          </el-col>
        </el-row>
        <br>
    </template>
  </div>
</template>

<script>
  import {getPurchaseUrlAndSku,updatePurchaseUrl,editPurchaseUrl} from '@/api/dfh/product'

  export default {
    name: 'updateSku',
    data() {
      return{
          rowId:'',
          puData: [],
          timestamp: '',
          checkedValue:'',
          ifEdit:false
      }
    },
    watch: {
      timestamp: 'getPddProductSpecShows'
    },
    methods: {
      getPddProductSpecShows(){
        this.ifEdit=false;
        let than = this;
        getPurchaseUrlAndSku({"id":this.rowId}).then(data => {
            than.puData = data.data.data;
        }).catch(() => {
          
        })
      },
      ok(){
        var value = this.getRadioBoxValue("girl");
        updatePurchaseUrl({"purchaseUrlId":value,"id":this.rowId}).then(data => {
            this.$message.success('保存成功')
            this.$emit('ok');
        }).catch(() => {
            loading();
        });
      },
      getRadioBoxValue(radioName){
        var obj = document.getElementsByName(radioName);
        for(var i=0; i<obj.length;i++){
          if(obj[i].checked){ 
            return obj[i].value; 
          } 
        }
        return "undefined"; 
      },
      editRows() {
        this.ifEdit = true
      },
      onEditPurchaseUrl(purchaseUrlId,purchaseUrl) {
        this.ifEdit = false
        editPurchaseUrl({"purchaseUrlId":purchaseUrlId,"purchaseUrl":purchaseUrl}).then(data => {
            this.$message.success('编辑成功')
        }).catch(() => {
            loading();
        });
      }
    }
  }
</script>

<style scoped>

</style>

