<template>
  <div class="execution">
    <div style="color:#8392a7;">
      1、开启自动发货：在开启自动发货生效的的那一刻，平台未发货的订单都会由系统加入发货队列，执行发货；<br>
      2、关闭自动发货：在开闭自动发货生效的那一刻，系统暂停自动提交未发货订单，已经提交的发货订单将继续完成发货；
    </div>
    <template>
      <div style="margin-top: 1.5%;margin-left: 5%; margin-bottom: 1%;">
          <span style="margin-right: 5%;"><font style="color:red">* </font>自动代发状态</span>
          <el-select v-model="dataFrom.status" placeholder="请选择" style="width:100px;">
            <el-option value="1" label="关闭"></el-option>
            <el-option value="0" label="开启"></el-option>
          </el-select>
          <span style="margin-left: 5%;">生效时间：<span style="color:rgb(70, 180, 109);">立刻生效</span></span>
      </div>
    </template>
    <template v-if="dataFrom.status === '0'">
      <div style="margin-top: 1.5%;margin-left: 9%; margin-bottom: 1%;">
        <span style="margin-right: 5%;"><font style="color:red">* </font>启动方案</span>
        <el-radio v-model="dataFrom.startType" label="1" border>立即开启</el-radio>
        <el-radio v-model="dataFrom.startType" label="2" border>定时开启</el-radio>
        <el-date-picker
          v-if="dataFrom.startType === '2'"
          v-model="dataFrom.startTime"
          type="datetime"
          format="yyyy-MM-dd hh:mm:ss"
          valueFormat="yyyy-MM-dd hh:mm:ss"
          placeholder="请选择日期时间">
        </el-date-picker>
      </div>
    </template>
    <template v-if="dataFrom.status === '0'">
      <div style="margin-top: 1.5%;margin-left: 9%; margin-bottom: 1%;">
          <span style="margin-right: 5%;"><font style="color:red">* </font>筛选条件</span>
          <el-select v-model="dataFrom.filters" placeholder="请选择" style="width:100px;">
            <el-option value="1" label="全部"></el-option>
          </el-select>
      </div>
    </template>

  </div>
</template>

<script>
import {fetchList, getObj, addObj, putObj, delObj,getByUserId} from '@/api/dfh/autoconfig'

  export default {
    name: 'autoShipping',
    data() {
      return{
        dataFrom: {
          autoConfigType: '2',
          status: '1',
          startType: '1',
          startTime: '',
          filters:'1',
          shrFilter:'',
          shdzFilter:''
        },

      }
    },
    methods: {
      ok() {
        if ('2' === this.dataFrom.startType) {
          if ('' === this.dataFrom.startTime || null === this.dataFrom.startTime) {
              return this.$message.error('定时开启日期时间不能为空');
          }
        }
        addObj(this.dataFrom).then(data => {
            this.$message.success('保存成功')
            this.$emit('ok');
        }).catch(() => {
            loading();
        });
      },
      getByUserId(){
        getByUserId(this.dataFrom.autoConfigType).then(data => {
          if (null != data.data.data) {
              this.dataFrom = data.data.data;
          }
        }).catch(() => {
            loading();
        });
      }
    },
    created(){
      this.getByUserId();
    }
  }
</script>

<style scoped>
 a{
} 
</style>

