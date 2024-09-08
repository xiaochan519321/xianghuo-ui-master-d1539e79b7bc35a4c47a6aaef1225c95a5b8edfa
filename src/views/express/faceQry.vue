<template>
  <div class="execution">
    <basic-container>
       <avue-crud
        ref="crud"
        :page.sync="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @current-change="currentChange"/>
    </basic-container>
  </div>
</template>

<script>
  import {faceList} from '@/api/admin/face'
  import {tableOption} from '@/const/crud/admin/faceQry'

  export default {
    name: 'faceQry',
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
    computed: {},
    methods: {
      getList(page, params) {
        this.tableLoading = true
        faceList(Object.assign({
          current: page.currentPage,
          size: page.pageSize,
          sts: -1
        }, params, this.searchForm)).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
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
<style scoped>
::v-deep .el-input--mini .el-input__icon {
    line-height: 28px;
    display: none !important;
}
</style>
