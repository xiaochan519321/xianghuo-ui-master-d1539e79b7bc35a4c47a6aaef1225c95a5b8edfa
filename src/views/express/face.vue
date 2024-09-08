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
        @current-change="currentChange">
          <template slot="menuLeft">
              <span style="color: red; font-size: 14px; margin-left: 6px"
                >总金额：{{ resultSum }}</span
              >
          </template>
       </avue-crud>
    </basic-container>
  </div>
</template>

<script>
  import {facePageList} from '@/api/admin/face'
  import {tableOption} from '@/const/crud/admin/face'

  export default {
    name: 'Face',
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
        tableOption: tableOption,
        resultSum: ""
      }
    },
    methods: {
      getList(page, params) {
        this.tableLoading = true
        facePageList(Object.assign({
          current: page.currentPage,
          size: page.pageSize,
          sts: -1
        }, params, this.searchForm)).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.resultSum = response.data.resultSum
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
