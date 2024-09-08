<template>
  <div class="mod-config">
    <basic-container>
      <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button v-if="permissions.sysuserconfig_add" icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        </el-form-item>
      </el-form> -->

      <div class="avue-crud"> 
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><i class="el-icon-s-tools"></i> 基础配置 </span>
            <!-- <el-card class="box-card"> -->
              <el-form ref="form" :model="form" label-width="200px" :label-position="right">
                  <el-form-item label="新用户注册分佣模版" >
                    <el-select v-model="form.profitConfigId" placeholder="请选择分佣模板"  style=" min-width: 30%; max-width: 30%;">
                        <el-option
                              v-for="item in profitConfigList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="新用户注册赠送积分" >
                    <el-input-number v-model="form.giveIntegral" style="width:30%"></el-input-number>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                  </el-form-item>
              </el-form>
            <!-- </el-card> -->
          </el-tab-pane>
          <!-- <el-tab-pane label="消息中心">消息中心</el-tab-pane> -->
          <!-- <el-tab-pane label="角色管理">角色管理</el-tab-pane> -->
          <!-- <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane> -->
        </el-tabs>
      </div>

    </basic-container>
  </div>
</template>

<script>
  import {fetchList, delObj, getSysUserConfig, saveObj} from '@/api/admin/sysuserconfig'
  import TableForm from './sysuserconfig-form'
  import {mapGetters} from 'vuex'
  import {getProfitConfigList} from "@/api/admin/profitconfig"
  export default {
    data () {
      return {
          sysUserConfig: {},
          profitConfigList: [], 
          form : {
            profitConfigId: undefined,
            giveIntegral: undefined
          }
      }
    },
    components: {
      TableForm
    },
    created () {
      this.getData();
      
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      getData(){
        getSysUserConfig().then(res => {
          if(res.data.data != null){
            this.form = res.data.data;
          }
        });
        this.loadProfitConfigList();
      },
      loadProfitConfigList(){
        getProfitConfigList().then(res =>{
          this.profitConfigList.push({"name":"默认","id":null})
          this.profitConfigList = this.profitConfigList.concat(res.data.data);
        })
      },
      submitForm(formName){
          saveObj(this.form).then(res => {
               this.$notify({
                title: '成功',
                message: '保存成功!',
                type: 'success'
              });
          });
      }
    }
  }
</script>
