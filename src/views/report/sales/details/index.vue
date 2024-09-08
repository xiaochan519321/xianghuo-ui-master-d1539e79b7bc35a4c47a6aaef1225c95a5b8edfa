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
  - Neither the name of the lzyq developer nor the names of its
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
        @current-change="currentChange">

        <template slot="amount" slot-scope="scope">
          <el-tag>{{ scope.row.amount / 100 }}</el-tag>
        </template>

        <template slot="product_info" slot-scope="scope" >
          <div>
            <div>订单ID：{{scope.row.orderId}}</div>
            <div>下单时间：{{formats(scope.row.createTime * 1000)}}</div>
            <div style="cursor:pointer;" @click="openPreview(scope.row.img)">
              <avue-avatar  style="background:#fff;" shape="square" :size="64" :src="scope.row.img" ></avue-avatar>
            </div>
            <div>
              商品ID：{{scope.row.productId}}<br>
              商品名称：{{scope.row.name}}
            </div>
          </div>
        </template>

        <template slot="payAmount" slot-scope="scope" >
          <div>{{(scope.row.payAmount / 100).toFixed(2)}}</div>
        </template>

        <template slot="pddMoney" slot-scope="scope" >
          <div>{{(scope.row.pddMoney / 100).toFixed(2)}}</div>
        </template>

        <template slot="spreadAmount" slot-scope="scope" >
          <div>{{((scope.row.payAmount - scope.row.pddMoney) / 100).toFixed(2)}}</div>
        </template>

      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { addObj, delObj, fetchList, putObj } from "@/api/report/sales/details";
import { tableOption } from "@/const/crud/report/sales/details";
import { mapGetters } from "vuex";
import TimeFormats from '@/util/TimeFormats'

export default {
  name: "purchaseDetails",
  props: {
    initShopId: {
      type: String,
      required: true
    },
    initStatisticsTime: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(
          this.permissions.generator_paygoodsorder_add,
          false
        ),
        delBtn: this.vaildData(
          this.permissions.generator_paygoodsorder_del,
          false
        ),
        editBtn: this.vaildData(
          this.permissions.generator_paygoodsorder_edit,
          false
        ),
      };
    },
  },
  methods: {
    formats(val){
      return new TimeFormats().convertTime('',val);
    },
    openPreview(img) {
      this.$ImagePreview([{url:img}]);
    },
    getList(page, params) {
      this.tableLoading = true;
      this.searchForm.shopId = this.initShopId;
      this.searchForm.createTimeArr = [this.initStatisticsTime, this.initStatisticsTime];
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize,
          },
          params,
          this.searchForm
        )
      )
        .then((response) => {
          this.tableData = response.data.data.records;
          this.page.total = response.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    searchChange(form, done) {
      this.searchForm = form;
      this.page.currentPage = 1;
      this.getList(this.page, form);
      done();
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    currentChange(current) {
      this.page.currentPage = current;
    },
    refreshChange() {
      this.getList(this.page);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
