<template>
  <div class="user">
    <basic-container>
      <el-row :span="24">
        <el-col
          :xs="24"
          :sm="24"
          :md="5"
          class="user__tree">
          <avue-tree
            :option="treeOption"
            :data="treeData"
            @node-click="nodeClick">
            <span class="el-tree-node__label" slot-scope="{ node, data }">
              <el-tooltip class="item" effect="dark" content="无数据权限" placement="right-start" v-if="data.isLock">
                <span>{{node.label}}  <i class="el-icon-lock"></i></span>
              </el-tooltip>
              <span v-if="!data.isLock">{{node.label}}</span>
            </span>
          </avue-tree>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="19"
          class="user__main">
          <avue-crud
            ref="crud"
            :option="option"
            v-model="form"
            :page.sync="page"
            :table-loading="listLoading"
            :before-open="handleOpenBefore"
            :data="list"
            @on-load="getList"
            @search-change="searchChange"
            @refresh-change="refreshChange"
            @size-change="sizeChange"
            @current-change="currentChange"
            @row-update="update"
            @row-save="create">
            <template slot="menuLeft">
              <el-button
                v-if="sys_user_add"
                class="filter-item"
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="$refs.crud.rowAdd()">添加
              </el-button>
            </template>
            <template
              slot="username"
              slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
            <template
              slot="role"
              slot-scope="scope">
              <span
                v-for="(role,index) in scope.row.roleList"
                :key="index">
                <el-tag>{{ role.roleName }} </el-tag>&nbsp;&nbsp;
              </span>
            </template>
            <template
              slot="tenantId"
              slot-scope="scope">
              {{ scope.row.deptName }}
            </template>
            <template
              slot="lockFlag"
              slot-scope="scope">
              <el-tag>{{ scope.label }}</el-tag>
            </template>
            <template
              slot="menu"
              slot-scope="scope">
              <el-button
                v-if="sys_user_edit"
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row,scope.index)">编辑
              </el-button>
              <el-button
                v-if="sys_user_del"
                type="text"
                size="small"
                icon="el-icon-delete"
                @click="deletes(scope.row,scope.index)">删除
              </el-button>
              <el-button
                type="text"
                size="small"
                icon="el-icon-mobile"
                @click="handle(scope.row)">充值点券
              </el-button>
            </template>
            <template
              slot="tenantIdForm">
              <avue-input-tree
                v-model="form.tenantId"
                :node-click="getNodeData"
                :dic="treeDeptData"
                :props="defaultProps"
                placeholder="请选择所属站点"/>
            </template>
            <template
              slot="roleForm">
              <avue-select
                v-model="role"
                :dic="rolesOptions"
                :props="roleProps"
                :disabled="!roleFlag"
                multiple
                placeholder="请选择角色"/>
            </template>
          </avue-crud>
        </el-col>
      </el-row>
    </basic-container>
    <el-dialog title="充值点券" :visible.sync="dialogVisible" width="400px">
      <el-form :model="ruleForm" ref="ruleForm">
        <el-form-item label="金额" label-width="60px">
          <el-input v-model="ruleForm.amount"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="60px">
          <el-input v-model="ruleForm.annotation" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="onPay">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addObj, delObj, fetchList, putObj} from '@/api/admin/user';
import {deptRoleList} from '@/api/admin/role';
import {addTickets} from '@/api/admin/ticket';
import {fetchTree} from '@/api/admin/site';
import {tableOption} from '@/const/crud/admin/user';
import {mapGetters} from 'vuex';
export default {
  name: 'SysUser',
  data() {
    return {
      dialogVisible: false, //充值点券
      ruleForm: {
        userId: "",
        amount: "", //金额
        annotation: "" //备注
      },
      roleFlag: true,
      currentSiteId: '',
      searchForm: {},
      treeOption: {
        nodeKey: 'id',
        addBtn: false,
        menu: false,
        props: {
          label: 'name',
          value: 'id'
        }
      },
      treeData: [],
      option: tableOption,
      treeDeptData: [],
      checkedKeys: [],
      roleProps: {
        label: 'roleName',
        value: 'roleId'
      },
      defaultProps: {
        label: 'name',
        value: 'id'
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false// 是否倒序
      },
      list: [],
      listLoading: true,
      role: [],
      form: {},
      rolesOptions: []
    }
  },
  computed: {
    ...mapGetters([
      'permissions',
      'userInfo'
    ])
  },
  watch: {
    role() {
      this.form.role = this.role
      console.log(this.role,123)
    }
  },
  created() {
    this.sys_user_add = this.permissions['sys_user_add']
    this.sys_user_edit = this.permissions['sys_user_edit']
    this.sys_user_del = this.permissions['sys_user_del']
    this.init()
  },
  methods: {
    init() {
      this.currentSiteId = this.userInfo.tenantId
      fetchTree().then(response => {
        this.treeData = response.data.data
        if(this.treeData && this.treeData.length>0){
          this.currentSiteId = this.treeData[0].id
        }
      })
    },
    nodeClick(data) {
      this.page.page = 1
      this.currentSiteId = data.id
      this.getList(this.page, {tenantId: data.id})
    },
    getList(page, params) {
      this.listLoading = true
      this.searchForm.tenantId = this.currentSiteId
      fetchList(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {
        this.list = response.data.data.records
        this.page.total = response.data.data.total
        this.listLoading = false
      })
    },
    getNodeData(data) {
      this.currentSiteId = data.id
      deptRoleList(data.id).then(response => {
        this.rolesOptions = response.data.data
      })
    },
    searchChange(param, done) {
      this.searchForm = param
      this.page.currentPage = 1
      this.getList(this.page, param)
      done()
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange(current) {
      this.page.currentPage = current
    },
    refreshChange() {
      this.getList(this.page)
    },
    handleOpenBefore(show, type) {
      window.boxType = type
      // 查询部门树
      fetchTree().then(response => {
        this.treeDeptData = response.data.data
        if(this.treeDeptData && this.treeDeptData.length>0){
          // 查询角色列表
          deptRoleList(this.currentSiteId).then(response => {
            this.rolesOptions = response.data.data
          })
        }
      })
      this.form.tenantId = this.currentSiteId
      if (['edit', 'views'].includes(type)) {
        this.role = []
        for (let i = 0; i < this.form.roleList.length; i++) {
          this.role[i] = this.form.roleList[i].roleId
        }
      } else if (type === 'add') {
        this.role = []
        this.form.username = undefined
        this.form.phone = undefined
        this.form.password = undefined
      }
      show()
    },
    handleUpdate(row, index) {
      this.roleFlag = !(row.userId === this.userInfo.userId)
      this.$refs.crud.rowEdit(row, index)
      this.form.password = undefined
    },
    create(row, done, loading) {
      if (this.form.phone && this.form.phone.indexOf('*') > 0) {
        this.form.phone = undefined
      }
      const ids = this.form.role.map(e => e);
      if(ids.includes(1) || ids.includes(89) || ids.includes(93) || ids.includes(97) || ids.includes(99) || ids.includes(103)){
        this.form.identity = 'admin'
      } else {
        this.form.identity = 'merchant'
      }
      addObj(this.form).then((res) => {
        if(res.data.data == true) {
          this.$notify.success('创建成功')
        } else {
          this.$notify.success(res.data.data)
        }
        this.getList(this.page)
        done()
      }).catch(() => {
        loading()
      })
    },
    update(row, index, done, loading) {
      if (this.form.phone && this.form.phone.indexOf('*') > 0) {
        this.form.phone = undefined
      }
      const ids = this.form.role.map(e => e);
      if(ids.includes(1) || ids.includes(89) || ids.includes(93) || ids.includes(97) || ids.includes(99) || ids.includes(103)){
        this.form.identity = 'admin'
      } else {
        this.form.identity = 'merchant'
      }
      putObj(this.form).then((res) => {
        if(res.data.data == true) {
          this.$notify.success('修改成功')
        } else {
          this.$notify.success(res.data.data)
        }
        this.getList(this.page)
        done()
      }).catch(() => {
        loading()
      })
    },
    deletes(row, index) {
      this.$confirm('此操作将永久删除该用户(用户名:' + row.username + '), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        delObj(row.userId)
          .then(() => {
            this.list.splice(index, 1)
            this.$notify.success('删除成功')
          }).catch(() => {
          this.$notify.error('删除失败')
        })
      })
    },
    handle(row) {
      this.dialogVisible = true
      this.ruleForm.userId = row.userId
      this.ruleForm.amount = ""
    },
    onPay() {
      if(this.ruleForm.amount=="") return this.$notify.warning('充值金额必填！');
      addTickets(this.ruleForm).then(() => {
        this.$notify.success('充值成功')
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss">
.user {
  height: 100%;

  &__tree {
    padding-top: 3px;
    padding-right: 20px;
  }

  &__main {
    .el-card__body {
      padding-top: 0;
    }
  }
}
</style>


