<template>
  <div class="mod-config">
    <basic-container>
      <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button v-if="permissions.sysenchashmentrule_add" icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        </el-form-item>
      </el-form> -->

      <div class="avue-crud"> 
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><i class="el-icon-s-tools"></i> 提现规则 </span>
            <!-- <el-card class="box-card"> -->
              <el-form ref="form" :model="form" label-width="200px" :label-position="right">
                  <el-form-item label="最低提现金额" >
                  <el-input-number v-model="form.limitMoney" style="width:30%"></el-input-number>
                  </el-form-item>
                  <el-form-item label="每天最多提现次数" >
                    <el-input-number v-model="form.maxCount" style="width:30%"></el-input-number>
                  </el-form-item>
                  <el-form-item label="提现规则说明" >
                    <el-input v-model="form.description" style="width:30%"></el-input>
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
  import {fetchList, addObj} from '@/api/admin/sysenchashmentrule'
  import TableForm from './sysenchashmentrule-form'
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
          // sysUserConfig: {},
          fetchList: [], 
          form : {
            limitMoney: undefined,
            maxCount: undefined,
            description: undefined
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
        // getSysUserConfig().then(res => {
        //   this.form = res.data.data;
        // });
        this.loadProfitConfigList();
      },
      loadProfitConfigList(){
        fetchList().then(res =>{
          // this.fetchList.push({"name":"默认","id":null})
          // this.fetchList = this.fetchList.concat(res.data.data);
          this.form = res.data.data;
          //console.log("这是："+this.fetchList);
        })
      },
      submitForm(formName){
          addObj(this.form).then(res => {
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
