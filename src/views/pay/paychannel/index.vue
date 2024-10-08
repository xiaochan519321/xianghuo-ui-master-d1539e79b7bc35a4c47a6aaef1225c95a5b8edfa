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
  - Neither the name of thelayq.com developer nor the names of its
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
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"/>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj
} from '@/api/pay/paychannel'
import {
  tableOption
} from '@/const/crud/pay/paychannel'
import {
  mapGetters
} from 'vuex'

export default {
  name: 'Paychannel',
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
      tableOption: tableOption
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.pay_paychannel_add, false),
        delBtn: this.vaildData(this.permissions.pay_paychannel_del, false),
        editBtn: this.vaildData(this.permissions.pay_paychannel_edit, false)
      }
    }
  },
  methods: {
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
    rowDel: function(row, index) {
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delObj(row.id)
      }).then(data => {
        this.$message.success('删除成功')
        this.getList(this.page)
      })
    },
    handleUpdate: function(row, index, done, loading) {
      if (row.appId && row.appId.indexOf('*') > 0) {
          row.appId = undefined
      }
      if (row.channelMchId && row.channelMchId.indexOf('*') > 0) {
          row.channelMchId = undefined
      }
      putObj(row).then(data => {
        this.$message.success('修改成功')
        done()
        this.getList(this.page)
      }).catch(() => {
        loading()
      })
    },
    handleSave: function(row, done, loading) {
      addObj(row).then(data => {
        done()
        if(data.data.code!=0){
          this.$message.error(data.data.msg)
          return
        }
        this.$message.success('添加成功')
        this.getList(this.page)
      }).catch(() => {
        loading()
      })
    },
    searchChange(form, done) {
      this.searchForm = form
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    },
    sizeChange(pageSize){
      this.page.pageSize = pageSize
    },
    currentChange(current){
      this.page.currentPage = current
    },
    refreshChange() {
      this.getList(this.page)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
