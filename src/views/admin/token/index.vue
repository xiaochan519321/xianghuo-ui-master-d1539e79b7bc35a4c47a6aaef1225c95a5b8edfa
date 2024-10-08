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
        :table-loading="tableLoading"
        :option="tableOption"
        :permission="permissionList"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-del="handleDel"
      >
        <template slot="id" slot-scope="scope">
          <span v-if="scope.row.user_info">{{ scope.row.user_info.id }}</span>
        </template>
        <template slot="username" slot-scope="scope">
          <span v-if="scope.row.user_info">{{ scope.row.user_info.username }}</span>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { delObj, fetchList } from "@/api/admin/token";
import { tableOption } from "@/const/crud/admin/token";
import { mapGetters } from "vuex";

export default {
  name: "Token",
  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
    };
  },
  created() {},
  mounted: function () {},
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        delBtn: this.vaildData(this.permissions.sys_token_del, false),
      };
    },
  },
  methods: {
    getList(page, params) {
      this.tableLoading = true;
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize,
          },
          params
        )
      ).then((response) => {
        this.tableData = response.data.data.records;
        this.page.total = response.data.data.total;
        this.tableLoading = false;
      });
    },
    handleDel: function (row, index) {
      var _this = this;
      this.$confirm("是否强制" + row.access_token + "下线?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delObj(row.access_token);
        })
        .then(() => {
          _this.$message.success("强制下线成功");
          this.getList(this.page);
        });
    },
    refreshChange() {
      this.getList(this.page);
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    currentChange(current) {
      this.page.currentPage = current;
    },
    searchChange(params, done) {
      this.page.currentPage = 1;
      this.getList(this.page, params);
      done();
    },
  },
};
</script>
