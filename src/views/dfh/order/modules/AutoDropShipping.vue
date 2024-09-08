<template>
  <div class="execution">
    <div style="color:#8392a7;">
      1、开启自动代发：在开启自动代发生效的的那一刻，平台新进来的订单都会由系统处理代发；<br>
      2、关闭自动代发：在开闭自动代发生效的那一刻，系统暂停提交代发订单，已经提交的代发订单将继续完成；
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
      <div style="margin-top: 5.5%;margin-left: 7%; margin-bottom: 1%;">
          <span style="margin-right: 5%;">收货人含有</span>
          <el-input style="width:250px;margin-right: 2%;" v-model="dataFrom.shrFilter" placeholder="只能数组和字母"></el-input>
          <span>的订单不自动代发&nbsp;<i class="el-icon-view el-icon-question el-icon-success" style="color:rgb(70, 180, 109);"></i></span>
      </div>
      <div style="margin-top: 1.5%;margin-left: 5%; margin-bottom: 1%;">
          <span style="margin-right: 5%;">收货地址含有</span>
          <el-input style="width:250px;margin-right: 2%;" v-model="dataFrom.shdzFilter" placeholder="只能数组和字母"></el-input>
          <span>的订单不自动代发&nbsp;<i class="el-icon-view el-icon-question el-icon-success" style="color:rgb(70, 180, 109);"></i></span>
      </div>
    </template>

  </div>
</template>

<script>
import {fetchList, getObj, addObj, putObj, delObj,getByUserId} from '@/api/dfh/autoconfig'

  export default {
    name: 'autoDropShipping',
    data() {
      return{
        dataFrom: {
          autoConfigType: '1',
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


