<!--
  -    Copyright (c) 2018-2025, lzyq All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lzyq
  -->
<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        :page.sync="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <!-- @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"-->
        <template slot-scope="{type,size,row}" slot="menu">
          <el-button :size="size" :type="type" @click="showDetail(row)">查看详情</el-button>
        </template>
        <template slot="menuLeft" slot-scope="{size}">
          <el-button type="primary" :size="size" @click="dialogVisible = true">
            <i class="el-icon-sort"></i>
            同步售后订单
          </el-button>
        </template>
        <template slot="product_info" slot-scope="scope">
          <div>
            <div>订单ID：{{scope.row.orderId}}</div>
            <div>下单时间：{{formats(scope.row.createTime * 1000)}}</div>
            <div style="cursor:pointer;" @click="openPreview(scope.row.img)">
              <avue-avatar shape="square" :size="64" :src="scope.row.img"></avue-avatar>
            </div>
            <div>
              商品ID：{{scope.row.productId}}
              <br />
              商品名称：{{scope.row.name}}
            </div>
          </div>
        </template>
        <template slot="payAmount" slot-scope="scope">
          <div>{{scope.row.payAmount / 100}}</div>
        </template>
        <template slot="buyer_info" slot-scope="scope">
          <div>{{scope.row.encryptPostReceiver}}</div>
          <div>{{scope.row.encryptPostTel}}</div>
          <div>{{scope.row.province}} {{scope.row.city}} {{scope.row.town}} {{scope.row.street}}</div>
          <div>{{scope.row.encryptDetail}}</div>
        </template>
        <template slot="alteration_info" slot-scope="scope">
          <div>售后件数：{{scope.row.aftersaleNum}}</div>
          <div>退款金额：{{scope.row.refundAmount / 100}}</div>
        </template>
        <template slot="pdd_order_info" slot-scope="scope">
          <div>
            <div>采购商品ID：{{scope.row.pddGoodsId}}</div>
            <div>
              商品链接：
              <el-link
                :href="scope.row.pddPurchaseUrl"
                target="_blank"
                :underline="false"
                type="primary"
              >{{scope.row.pddPurchaseUrl == null? '':'查看'}}</el-link>
            </div>
            <div>采购店铺：{{scope.row.pddShopName}}</div>
            <div>商品规格： {{scope.row.pddOrderSku}}</div>
            <div>采购订单ID： {{scope.row.pddOrderId}}</div>
            <div>下单时间： {{scope.row.pddOrderTime}}</div>
          </div>
        </template>
      </avue-crud>
      <el-dialog title="同步售后订单" :visible.sync="dialogVisible" width="45%">
        <el-tag size="mini" type="primary">选择同步时间，确定后即可重新获取该时间段的售后订单数据；</el-tag>
        <span slot="footer" class="dialog-footer">
          <el-form>
            <el-row :gutter="30">
              <el-col :sm="24" :md="24" :lg="24" lable="1">
                <el-form-item label="选择同步日期">
                  <div style="float:left;">
                    <el-date-picker
                      v-model="syncOrderData.syncData"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :picker-options="syncOrderData.pickerOptions"
                    ></el-date-picker>&nbsp;
                    <el-time-picker
                      is-range
                      v-model="syncOrderData.syncTime"
                      range-separator="-"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      placeholder="选择时间范围"
                      format="HH:mm:ss"
                      value-format="HH:mm:ss"
                    ></el-time-picker>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button type="primary" @click="syncOrderStart">确 定</el-button>
          <el-button @click="dialogVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, syncAfterSalesOrder, detail } from '@/api/aftersales/doudian'
import { tableOption } from '@/const/crud/aftersales/doudian'
import { mapGetters } from 'vuex'
import TimeFormats from '@/util/TimeFormats'

export default {
  name: 'dfhproduct',
  data() {
    return {
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      purchaseUrlDialogVisible: false,

      dialogVisible: false,
      syncOrderData: {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          },]
        },
        syncData: '',
        syncTime: ["00:00:00", "23:59:59"]
      },
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.dfh_product_add, false),
        delBtn: this.vaildData(this.permissions.dfh_product_del, false),
        editBtn: this.vaildData(this.permissions.dfh_product_edit, false)
      };
    }
  },
  methods: {
    showDetail(row) {
      // 存储当前 row ，因为 售后详情接口没有返回
      this.$locStore.setStore({
        name: 'aftel_details',
        content: row,
        type: 'session',
      });
      // 售后详情 (非动态路由)
      this.$router.push({
        path: `/aftersales/doudian/aftelDetails`,
        query: { id: row.orderId }
      })
    },
    formats(val) {
      return new TimeFormats().convertTime('', val);
    },
    getRemainderTime(startTime) {
      var s1 = new Date(startTime.replace(/-/g, "/")),
        s2 = new Date(),
        runTime = parseInt((s2.getTime() - s1.getTime()) / 1000);
      var year = Math.floor(runTime / 86400 / 365);
      runTime = runTime % (86400 * 365);
      var month = Math.floor(runTime / 86400 / 30);
      runTime = runTime % (86400 * 30);
      var day = Math.floor(runTime / 86400);
      runTime = runTime % 86400;
      var hour = Math.floor(runTime / 3600);
      runTime = runTime % 3600;
      var minute = Math.floor(runTime / 60);
      runTime = runTime % 60;
      var second = runTime;
      // console.log(year,month,day,hour,minute,second);
      //return year+','+month+','+day+','+hour+','+minute+','+second;

      return day + ' 天 ' + hour + ' 时 ' + minute + ' 分 ';

    },
    syncOrderStart() { //开始同步订单
      if ('' == this.syncOrderData.syncData || null == this.syncOrderData.syncData || undefined == this.syncOrderData.syncData) {
        return this.$message.error('同步日期不能为空')
      }
      syncAfterSalesOrder(this.syncOrderData).then(data => {
        if (data.data.code == 0) {
          this.$message.success(data.data.msg)
          this.dialogVisible = false;
        } else {
          this.$message.error(data.data.msg)
        }
      }).catch(() => {
      });
    },
    getList(page, params) {
      this.tableLoading = true
      fetchList(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange(current) {
      this.page.currentPage = current
    },
    searchChange(form, done) {
      this.searchForm = form
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    },
    refreshChange() {
      this.getList(this.page)
    }
  }
}
</script>
