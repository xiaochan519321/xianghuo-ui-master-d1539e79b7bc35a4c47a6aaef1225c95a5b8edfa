<template>
  <div class="user child-user-page">
    <basic-container>
      <div class="header">
        <el-form ref="form" :model="searchForm" inline>
          <el-form-item label="用户名："> 
            <el-input placeholder="请输入用户名" v-model="searchForm.username" clearable  style="width: 232px;"/>
          </el-form-item>
          <el-form-item>
            <el-button
                type="primary"
                style="width: 86px;"
                icon="el-icon-search"
                @click.stop="onClickComfirm"
            >
                搜索
            </el-button>
            <el-button style="width: 86px;" icon="el-icon-delete" @click.stop="resetForm('form')">
                清空
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <avue-crud
        ref="crud"
        :option="option"
        v-model="form"
        :page.sync="page"
        :table-loading="listLoading"
        :before-open="handleOpenBefore"
        :data="list"
        :headerCellClassName="() => {return 'header-cell-bg-color'}"
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
            @click.stop="onClickAdd">新增
          </el-button>
        </template>
        <template slot="menuRight">
          <p class="menu-right">
            <span>当前可添加</span>
            <span style="color: #eb5e12; margin: 0 6px; font-weight: bold"
              >{{openSubNum}}/{{subNum}}个子账号</span>
          </p>
        </template>
        <template
          slot="username"
          slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
        <template
          slot="shopIds"
          slot-scope="scope">
              <span>{{scope.row.shopNames ? scope.row.shopNames.join(',') : ''}}</span>
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
          slot="deptId"
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
        </template>
        <template slot="deptIdForm">
          <avue-input-tree
            v-model="form.deptId"
            :node-click="getNodeData"
            :dic="treeDeptData"
            :props="defaultProps"
            placeholder="请选择所属部门"/>
        </template>
        <template slot="roleForm">
          <avue-select
            v-model="role"
            :dic="rolesOptions"
            :props="roleProps"
            multiple
            placeholder="请选择角色"/>
        </template>
        <template slot="shopIdsForm">
          <avue-select
            v-model="shop"
            :dic="shopOptions"
            :props="shopProps"
            multiple
            placeholder="请选择店铺"/>
        </template>
        <template slot="shopIdsType" slot-scope="{item}">
            <span>{{ item }}</span>
        </template>
      </avue-crud>
    </basic-container>

    <el-dialog :title="commonDialog.title" :visible.sync="commonDialog.dialogVisible" :width="commonDialog.width">
      <span>
        <AllocationShop ref="allocationShopForm"/>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="allocationShopSave">保 存</el-button>
        <el-button @click="commonDialog.dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
import {delObj, putObj} from '@/api/admin/user'
import { codeObj } from '@/api/admin/promote-invite';
import {addObj, fetchList} from '@/api/admin/sub/user'
import {deptRoleList} from '@/api/admin/sub/role'
import {fetchTree} from '@/api/admin/dept'
import {tableOption} from '@/const/crud/admin/sub/user'
import {mapGetters} from 'vuex'
import AllocationShop from "./modules/AllocationShop";
import {getAllList} from '@/api/dfh/shop'

export default {
  name: 'SysSubUser',
  components: {
    AllocationShop
  },
  data() {
    return {
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
      rolesOptions: [],
      commonDialog:{
        title: '',
        width: '40%',
        dialogVisible: false
      },
      shop: [],
      shopOptions: [],
      shopProps: {
        label: 'shopName',
        value: 'id'
      },
      subNum: 0,  //拥有子账号权限数量
      openSubNum: 0  //已用子账号权限数量

    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
    // role() {
    //   this.form.role = this.role
    // },
    shop() {
      this.form.shopIds = this.shop
    }
  },
  created() {
    this.sys_user_add = this.permissions['sys_sub']
    this.sys_user_edit = this.permissions['sys_sub']
    this.sys_user_del = this.permissions['sys_sub']
    this.init()
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const { data: { data } } = await codeObj();
        console.log('data', data)
        this.subNum = data.subNum || 0; //拥有子账号权限数量
        this.openSubNum = data.openSubNum || 0; //已用子账号权限数量
      } catch (error) {}
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      this.searchForm = this.$options.data().searchForm;
      this.onClickComfirm();
    },
    onClickComfirm() {
      this.page.currentPage = 1;
      this.getList(this.page);
    },
    allocationShopSave(){
      this.$refs.allocationShopForm.ok();
      this.commonDialog.dialogVisible = !this.commonDialog.dialogVisible;
      this.getList(this.page)
    },
    allocationShop(row){
      // 分配店铺
      this.commonDialog.width = '40%';
      this.commonDialog.title = '分配店铺';
      this.commonDialog.dialogVisible = !this.commonDialog.dialogVisible;
      this.$nextTick(function() {
        this.$refs.allocationShopForm.init(row.userId);
        this.$refs.allocationShopForm.allocationShopForm = row;
      });
    },
    init() {
      fetchTree().then(response => {
        this.treeData = response.data.data
      })
      getAllList().then(response => {
        this.shopOptions = response.data.data.map(item => {
            return {...item, shopName: item.payUsername ? `${item.shopName}（${item.payUsername}）` : item.shopName}
        })
      })
    },
    nodeClick(data) {
      this.page.page = 1
      this.getList(this.page, {deptId: data.id})
    },
    getList(page, params) {
      this.listLoading = true
      fetchList(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {
        this.list = response.data.data.records
        this.page.total = response.data.data.total
        this.listLoading = false
      })
    },
    getNodeData() {
      deptRoleList().then(response => {
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
      })
      // 查询角色列表
      deptRoleList().then(response => {
        this.rolesOptions = response.data.data
      })

      if (['edit', 'views'].includes(type)) {
        this.role = []
		    this.shop = this.form.shopIds
        for (let i = 0; i < this.form.roleList.length; i++) {
          this.role[i] = this.form.roleList[i].roleId
        }
      } else if (type === 'add') {
        this.role = []
        this.shop = []
        this.form.username = undefined
        this.form.phone = undefined
        this.form.password = undefined
      }
      show()
    },
    handleUpdate(row, index) {
      this.$refs.crud.rowEdit(row, index)
      this.form.password = undefined
    },
    onClickAdd() {
      if (this.openSubNum<this.subNum) {
        this.$refs.crud.rowAdd();
      } else {
        this.$message.warning('不支持添加子账号')
      }
    },
    create(row, done, loading) {
      if (this.form.phone && this.form.phone.indexOf('*') > 0) {
        this.form.phone = undefined
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
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  background: #FFFFFF;
    border-radius: 8px 8px 8px 8px;
    padding: 16px;
    ::v-deep .el-form  {
        display: flex;
        align-items: center;
        .el-form-item {
            margin: 0;
            &:last-child {
              margin-left: auto;
            }
        }
    }
}
::v-deep .avue-crud {
  margin: 16px 0px 0px;
  background: #fff;
  border-radius: 8px;
  padding: 16px 16px 50px;
  .avue-crud__menu {
    
    margin: 0;
    .avue-crud__left {
      .el-button {
        margin: 0;
      }
    }
  }
  .el-table {
    margin-top: 16px;
  }
}
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
  ::v-deep .avue-form__group .el-col:nth-child(1) {
	  padding-left: 0 !important;
	  .el-form-item__label {
		  text-align: left;
	  }
  }
}
.child-user-page {
    ::v-deep .el-card__body {
        .el-collapse-item__wrap {
            padding: 0 20px;
            margin: 0 -20px 20px;
            border-bottom: 1px solid #eee;
        }
        .avue-crud__menu {
            margin-bottom: 10px;
        }
    }
}
.menu-right {
  font-size: 14px;
  color: #000000;
  line-height: 32px;
  margin-bottom: 10px;
}

</style>


