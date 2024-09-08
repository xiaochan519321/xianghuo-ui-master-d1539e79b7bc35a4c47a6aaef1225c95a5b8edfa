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
        @row-update="handleUpdate"/>
    </basic-container>
  </div>
</template>

<script>
  import {leverinfoList,updleverObj} from '@/api/admin/agent'
  import {tableOption} from '@/const/crud/admin/lever'
  import {mapGetters} from 'vuex'

  export default {
    name: 'Tenant',
    data() {
      return {
        tableData: [],
        searchForm: {},
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
          editBtn: this.vaildData(this.permissions.sys_lever_upd, false)
        }
      }
    },
    methods: {
      getList(page, params) {
        this.tableLoading = true
        leverinfoList(Object.assign({
          current: page.currentPage,
          size: page.pageSize,
          leverId: -1
        }, params, this.searchForm)).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      },
      handleUpdate: function (row, index, done, loading) {
        updleverObj(row).then(data => {
          this.$message.success('修改成功')
          done()
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
      refreshChange() {
        this.getList(this.page)
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize
      },
      currentChange(current) {
        this.page.currentPage = current
      },
    }
  }
</script>
