<template>
  <div class="execution payaccount-page" v-loading="schemeLoading" element-loading-text="正在启动客户端，请稍后...">
    <basic-container>
      <div class="header">
        <el-form ref="form" :model="searchForm" inline>
          <el-form-item label="支付宝账号："> 
            <el-input placeholder="请输入账号" v-model="searchForm.username" clearable  style="width: 232px;"/>
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
            <el-button style="width: 86px;" icon="el-icon-delete"  @click.stop="resetForm('form')">
                清空
            </el-button>
          </el-form-item>
        </el-form>
      </div>
        <!-- <el-alert title="为了代发订单正常支付，请下载并安装客户端托管运行，未绑定默认用添加的支付账号付款" type="warning" show-icon :closable="false"></el-alert>
        <br /> -->
        <avue-crud
            ref="crud"
            :page.sync="page"
            :data="tableData"
            :permission="permissionList"
            :table-loading="tableLoading"
            :option="tableOption"
            :headerCellClassName="() => {return 'header-cell-bg-color'}"
            @on-load="getList"
            @search-change="searchChange"
            @refresh-change="refreshChange"
            @size-change="sizeChange"
            @current-change="currentChange"
            @row-update="handleUpdate"
            @row-save="handleSave"
            @row-del="rowDel"
        >
        <template slot-scope="{ row }" slot="shopName">
            <span>{{row.shopNames ? row.shopNames.join(',') : ''}}</span>
        </template>
        <template slot-scope="{ type, size, row }" slot="menu">
            <el-button
                ref="bindingBtn"
                :size="size"
                :type="type"
                @click="updatePayAccount(row)"
                icon="el-icon-plus"
                >绑定店铺</el-button
            >
        </template>
        <template slot="lockFlag" slot-scope="scope">
            <el-tag :type="scope.label == '异常' ? 'danger' : ''">{{
                scope.label
            }}</el-tag>
        </template>
      </avue-crud>
       <el-dialog
        :title="commonDialog.title"
        :visible.sync="commonDialog.dialogVisible"
        :append-to-body="true"
        :width="commonDialog.width">
        <span>
          <updatePayAccount
            v-if="commonDialog.tag === 'upcf'"
            ref="upcFForm"
            @ok="sonOK"
          />
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="ok">保 存</el-button>
          <el-button @click="commonDialog.dialogVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
    </basic-container>
    <scheme-dialog ref="scheme" @close="schemeLoading = false"/>
  </div>
</template>

<script>
import {
  fetchList,
  addObj,
  putObj,
  delObj,
} from "@/api/dfh/payaccount";
import { addBinding, delBinding } from "@/api/dfh/dfhpaybinding";
import { tableOption } from "@/const/crud/dfh/payaccount";
import updatePayAccount from "./modules/updatePayAccount";
import { mapGetters } from "vuex";
import schemeDialog from '@/components/scheme/scheme'
import { getClientStatus } from '@/api/info'

export default {
  components: {
    updatePayAccount,
    schemeDialog
  },
  name: "dfhpayaccount",
  data() {
    return {
      searchForm: {
        username: ''
      },
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
       commonDialog: {
        tag: "",
        title: "",
        width: "40%",
        dialogVisible: false,
      },
      schemeLoading: false,
      clientStatus: 0,
      timer: null
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.dfh_payaccount_add, false),
        delBtn: this.vaildData(this.permissions.dfh_payaccount_del, false),
        editBtn: this.vaildData(this.permissions.dfh_payaccount_edit, false),
        bindingBtn: this.vaildData(
          this.permissions.dfh_dfhpaybinding_add,
          false
        ),
        delBindingBtn: this.vaildData(
          this.permissions.dfh_dfhpaybinding_del,
          false
        ),
      };
    },
  },
  methods: {
    /**
     * 重置form表单
     */
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      this.searchForm = this.$options.data().searchForm;
      this.onClickComfirm();
    },
    onClickComfirm() {
        this.page.currentPage = 1;
        this.getList(this.page);
    },
    downloadAfterSale() {
        let number = 0
        if (this.clientStatus == 1) {
            window.location.href = 'kuaipai://client?router=dashboard'
        } else {
            this.$refs.scheme.schemeOpen(`kuaipai://client?router=dashboard`)
            this.schemeLoading = true
            this.timer = setInterval(async () => {
                const { data } = await getClientStatus()
                this.clientStatus = data.data
                if (data.data == 1 || number >= 12) {
                    clearInterval(this.timer)
                    this.timer = null
                    number = null
                    this.$refs.scheme.clearTimer()
                }
                number++
            }, 5000)
        }
    },
    // 检测客户端是否在线
    async onClientStatus () {
        const { data } = await getClientStatus()
        this.clientStatus = data.data
    },
    getList(page, params) {
      this.tableLoading = true;
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize,
          },
          params,
          this.searchForm
        )
      )
        .then((response) => {
          this.tableData = response.data.data.records;
          this.page.total = response.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    rowDel: function (row, index) {
      this.$confirm("是否确认删除当前支付账号，请确保支付中的订单已经取消否则会出现登录账号不一致!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delObj(row.id);
        })
        .then((data) => {
          this.$message.success("删除成功");
          this.getList(this.page);
        });
    },
    updatePayAccount(row) {
        this.commonDialog.width = "40%";
        this.commonDialog.tag = "upcf";
        this.commonDialog.title = "绑定店铺";
        this.commonDialog.dialogVisible = !this.commonDialog.dialogVisible;
        this.$nextTick(function () {
            this.$refs.upcFForm.form.id = row.id;
            this.$refs.upcFForm.form.shopIds = row.shopIds
        });
    },
    ok() {
      switch (this.commonDialog.tag) {
        case "upcf":
          this.$refs.upcFForm.addBinding();
          break;
      }
    },
    sonOK() {
      this.commonDialog.dialogVisible = !this.commonDialog.dialogVisible;
      this.getList(this.page);
    },
    handleUpdate: function (row, index, done, loading) {
      putObj(row)
        .then((data) => {
          this.$message.success("修改成功");
          done();
          this.getList(this.page);
        })
        .catch(() => {
          loading();
        });
    },
    handleSave: function (row, done, loading) {
      if (row.payCode != row.affirmPayCode) {
        loading();
        return this.$message.error("两次支付密码输入不相同请重新输入");
      }
      addObj(row)
        .then((data) => {
          this.$message.success("添加成功");
          done();
          this.getList(this.page);
        })
        .catch(() => {
          loading();
        });
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    currentChange(current) {
      this.page.currentPage = current;
    },
    searchChange(form, done) {
      this.searchForm = form;
      this.page.currentPage = 1;
      this.getList(this.page, form);
      done();
    },
    refreshChange() {
      this.getList(this.page);
    },
  },
  created () {
    this.onClientStatus()
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.timer = null
  }
};
</script>

<style lang="scss" scoped>
    .execution {
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
        ::v-deep .el-loading-mask {
            position: fixed;
        }
    }

</style>
