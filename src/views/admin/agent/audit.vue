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
        @selection-change="selectionChange"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @current-change="currentChange">
        <template slot="menuLeft">
          <el-button size="small" @click="onsucObj">审核通过</el-button>
          <el-button size="small" @click="onfailObj">审核拒绝</el-button>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
  import {auditList,sucObj,failObj} from '@/api/admin/agent'
  import {tableOption} from '@/const/crud/admin/audit'

  export default {
    name: 'Tenant',
    data() {
      return {
        tableData: [],
        searchForm: {},
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20, // 每页显示多少条

        },
        tableLoading: false,
        tableOption: tableOption,
        scData: []
      }
    },
    methods: {
      getList(page, params) {
        this.tableLoading = true
        auditList(Object.assign({
          current: page.currentPage,
          size: page.pageSize,
          sts: -1,
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
      selectionChange(list){
        this.scData = list;
        console.log(this.scData,1234)
      },
      //批量审核通过
      onsucObj() {
        if (!this.scData.length) return this.$message.warning('请至少勾选一个用户进行操作')
        const ids = this.scData.map(item => item.examineId)
        console.log(ids,1236)
        const that = this
        const params = ids
        this.$confirm('是否确定将当前选中用户进行审核？', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async function () {
            const { data } = await sucObj(params)
            if (data.code == 0) {
                that.$message.success('操作成功')
                that.getList(that.page)
            }
        })
      },
      //批量审核拒绝
      onfailObj() {
        if (!this.scData.length) return this.$message.warning('请至少勾选一个用户进行操作')
        const ids = this.scData.map(item => item.examineId)
        console.log(ids,1236)
        const that = this
        const params = ids
        this.$confirm('是否确定将当前选中用户进行审核？', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async function () {
            const { data } = await failObj(params)
            if (data.code == 0) {
                that.$message.success('操作成功')
                that.getList(that.page)
            }
        })
      },
    }
  }
</script>
