<template>
  <div class="execution">
    <basic-container>
      <avue-crud
        ref="crud"
        v-model="form"
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
        @row-save="handleSave"/>
    </basic-container>
  </div>
</template>

<script>
  import {agentinfoList,addObj,putObj} from '@/api/admin/agent'
  import {tableOption} from '@/const/crud/admin/agent'
  import {mapGetters} from 'vuex'

  export default {
    name: 'Agent',
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
        form: {},
        shopNum: "",
        subNum: "",
        leverId: "",
        sts: ""
      }
    },
    computed: {
      ...mapGetters(['permissions']),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permissions.sys_agent_add, false),
          editBtn: this.vaildData(this.permissions.sys_agent_upd, false)
        }
      }
    },
    watch: {
      "form.shopNum"(newVal,oldVal) {
        if (oldVal === undefined) {
          this.shopNum = newVal
        }
      },
      "form.subNum"(newVal,oldVal) {
        if (oldVal === undefined) {
          this.subNum = newVal
        }
      },
      "form.leverId"(newVal,oldVal) {
        if (oldVal === undefined) {
          this.leverId = newVal
          console.log(this.leverId,123)
        }
      },
      "form.sts"(newVal,oldVal) {
        if (oldVal === undefined) {
          this.sts = newVal
        }
      }
    },
    methods: {
      getList(page, params) {
        this.tableLoading = true
        agentinfoList(Object.assign({
          current: page.currentPage,
          size: page.pageSize,
          sts: -1,
          leverId: -1
        }, params, this.searchForm)).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      },
      handleSave: function (row, done, loading) {
        addObj(row).then(data => {
          this.$message.success('添加成功')
          done()
          this.getList(this.page)
        }).catch(() => {
          loading()
        })
      },
      handleUpdate: function (row, index, done, loading) {
        console.log(this.shopNum,row.shopNum)
        if(this.shopNum == row.shopNum) {
          delete row.shopNum
        }
        if(this.subNum == row.subNum) {
          delete row.subNum
        }
        if(this.leverId == row.leverId) {
          row.leverId = -1
        }
        if(this.sts == row.sts) {
          row.sts = -1
        }
        putObj(row).then(data => {
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
