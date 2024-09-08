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
                v-if="sys_role_add"
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
              {{ scope.row.tenantId }}
            </template>
            <template
              slot="tenantIdForm">
              <avue-input-tree
                v-model="form.tenantId"
                :dic="treeDeptData"
                :props="defaultProps"
                placeholder="请选择所属站点"/>
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
                v-if="sys_role_edit"
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row,scope.index)">编辑
              </el-button>
              <el-button
                v-if="sys_role_del"
                type="text"
                size="small"
                icon="el-icon-delete"
                @click="deletes(scope.row,scope.index)">删除
              </el-button>
              <el-button
                v-if="sys_role_perm"
                type="text"
                size="small"
                icon="el-icon-plus"
                @click="handlePermission(scope.row,scope.index)">权限
              </el-button>
            </template>
          </avue-crud>
        </el-col>
      </el-row>
    </basic-container>
    <el-dialog
      :visible.sync="dialogPermissionVisible"
      :close-on-click-modal="false"
      title="分配权限">
      <div class="dialog-main-tree">
        <el-tree
          ref="menuTree"
          :data="treeMenuData"
          :default-checked-keys="checkedKeys"
          :check-strictly="false"
          :props="defaultProps"
          :filter-node-method="filterNode"
          class="filter-tree"
          node-key="id"
          highlight-current
          show-checkbox/>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="updatePermession(roleId)">更 新
        </el-button>
        <el-button
          type="default"
          size="small"
          @click="cancel()">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import {addObj, delObj, fetchList, fetchRoleTree, permissionUpd, putObj} from '@/api/admin/role';
import {fetchTree} from '@/api/admin/site';
import { fetchRoleMenuTree } from '@/api/admin/menu'
import {tableOption} from '@/const/crud/admin/role';
import {mapGetters} from 'vuex';

export default {
  name: 'SysRole',
  data() {
    return {
      roleFlag: true,
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
      treeMenuData: [],
      treeData: [],
      option: tableOption,
      treeDeptData: [],
      checkedKeys: [],
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
      roleId: undefined,
      roleCode: undefined,
      dialogPermissionVisible: false,
      sys_role_add: false,
      sys_role_edit: false,
      sys_role_del: false,
      sys_role_perm: false,
      currentTenantId: "",
      rolesOptions: []
    }
  },
  computed: {
    ...mapGetters([
      'permissions',
      'userInfo'
    ])
  },
  created() {
    this.sys_role_add = this.permissions['sys_role_add']
    this.sys_role_edit = this.permissions['sys_role_edit']
    this.sys_role_del = this.permissions['sys_role_del']
    this.sys_role_perm = this.permissions['sys_role_perm']
    this.init()
  },
  methods: {
    init() {
      this.currentTenantId = this.userInfo.tenantId
      fetchTree().then(response => {
        this.treeData = response.data.data
      })
    },
    nodeClick(data) {
      this.currentTenantId = data.id
      this.page.page = 1
      this.getList(this.page, {tenantId: data.id})
    },
    getList(page, params) {
      this.listLoading = true
      fetchList(Object.assign({
        tenantId: this.currentTenantId,
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {
        this.list = response.data.data.records
        this.page.total = response.data.data.total
        this.listLoading = false
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
      })
      show()
    },
    cancel () {
      this.dialogPermissionVisible = false;
    },
    handleUpdate(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    handlePermission(row) {
      fetchRoleTree(row.roleId)
        .then(response => {
          this.checkedKeys = response.data.data
          return fetchRoleMenuTree()
        })
        .then(response => {
          this.treeMenuData = response.data.data
          // 解析出所有的太监节点
          this.checkedKeys = this.resolveAllEunuchNodeId(this.treeMenuData, this.checkedKeys, [])
          this.dialogPermissionVisible = true
          this.roleId = row.roleId
          this.roleCode = row.roleCode
        })
    },
    /**
     * 解析出所有的太监节点id
     * @param json 待解析的json串
     * @param idArr 原始节点数组
     * @param temp 临时存放节点id的数组
     * @return 太监节点id数组
     */
    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp)
        } else {
          temp.push(idArr.filter(id => id === item.id))
        }
      }
      return temp
    },
    create(row, done, loading) {

      addObj(this.form).then(() => {
        this.getList(this.page)
        done()
        this.$notify.success('创建成功')
      }).catch(() => {
        loading()
      })
    },
    update(row, index, done, loading) {

      putObj(this.form).then(() => {
        this.getList(this.page)
        done()
        this.$notify.success('修改成功')
      }).catch(() => {
        loading()
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    updatePermession (roleId) {
      this.menuIds = ''
      this.menuIds = this.$refs.menuTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.menuTree.getHalfCheckedKeys().join(','))
      permissionUpd(roleId, this.menuIds).then(() => {
        this.dialogPermissionVisible = false
        this.$notify.success('修改成功')
      })
    },

    deletes(row, index) {
      this.$confirm('是否确认删除名称为"' + row.roleName + '"' + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        delObj(row.roleId)
          .then(() => {
            this.getList(this.page)
            this.$notify.success('删除成功')
          }).catch(() => {
          this.$notify.error('删除失败')
        })
      })
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

