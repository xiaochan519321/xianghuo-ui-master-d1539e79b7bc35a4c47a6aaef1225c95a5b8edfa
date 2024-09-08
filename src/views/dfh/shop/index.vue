<template>
  <div class="dfh-shop-index-pages-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="店铺列表" name="first">
        <div class="wrapper">
          <div class="header">
            <div class="filter-box">
              <el-form inline :model="formData" ref="form">
                <el-form-item label="店铺名称：" prop="shopName">
                  <el-input
                    placeholder="请输入店铺名称"
                    v-model="formData.shopName"
                    style="width: 232px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="所属平台：" prop="platformId">
                  <el-select
                    v-model="formData.platformId"
                    placeholder="请选择"
                    style="width: 232px"
                    clearable
                  >
                    <el-option label="抖音店铺" value="1"></el-option>
                    <el-option label="淘宝店铺" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="授权状态：" prop="authStatus">
                  <el-select
                    v-model="formData.authStatus"
                    placeholder="请选择"
                    style="width: 232px"
                    clearable
                  >
                    <el-option label="已失效" value="0"></el-option>
                    <el-option label="已授权" value="1"></el-option>
                    <el-option label="待授权" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item style="margin-left: auto">
                  <el-button
                    type="primary"
                    style="width: 86px"
                    icon="el-icon-search"
                    @click.stop="onClickComfirm"
                  >
                    搜索
                  </el-button>
                  <el-button
                    style="width: 86px"
                    icon="el-icon-delete"
                    @click.stop="resetForm('form')"
                  >
                    清空
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="content">
            <avue-crud
              ref="crud"
              :page.sync="page"
              :data="tableData"
              :permission="permissionList"
              :table-loading="tableLoading"
              :option="tableOption"
              :headerCellClassName="
                () => {
                  return 'header-cell-bg-color';
                }
              "
              @on-load="getList"
              @size-change="sizeChange"
              @current-change="currentChange"
              @row-update="handleUpdate"
              @row-save="handleSave"
            >
              <template slot="menuLeft" slot-scope="{ size }">
                <div class="menu-left">
                  <el-button
                    icon="el-icon-plus"
                    type="primary"
                    :size="size"
                    @click.stop="onClickAdd"
                    style="width: 98px; margin: 0"
                  >
                    <span>新增店铺</span>
                  </el-button>
                  <div class="alert">
                    <i class="el-icon-warning" />
                    <span
                      >注意：在新增店铺之后，请在服务市场订购授权才能正常使用</span
                    >
                  </div>
                  <span style="color: red; font-size: 16px; margin-left: 6px"
                    >每次充值500元可增加一个店铺授权</span
                  >
                </div>
              </template>
              <template slot="menuRight">
                <p class="menu-right">
                  <span>当前可添加</span>
                  <span style="color: #eb5e12; margin: 0 6px; font-weight: bold"
                    >{{ openShopNum }}/{{ shopNum }}个店铺</span>
                </p>
              </template>
              <template slot-scope="{}" slot="bindForm">
                <el-tag size type="danger"
                  >注意：店铺名称必须和抖店店铺名完全一致否则授权失败；</el-tag
                >
              </template>
              <template slot="authStatus" slot-scope="{ row }">
                <el-tag
                  :type="
                    row.authStatus === '0'
                      ? 'danger'
                      : row.authStatus === '2'
                      ? ''
                      : 'success'
                  "
                >
                  <span>{{
                    row.authStatus === "0"
                      ? "已失效"
                      : row.authStatus === "2"
                      ? "待授权"
                      : "已授权"
                  }}</span>
                </el-tag>
              </template>
              <template slot="menu" slot-scope="{ row, index }">
                <span v-if="userInfo.identity != 'sub'">
                  <el-button
                    type="text"
                    size="small"
                    icon="el-icon-circle-plus"
                    @click.stop="renewalShop(row)"
                    v-if="row.expireTime != null"
                  >
                    <span>续费</span>
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    icon="el-icon-circle-plus"
                    @click.stop="renewalShop(row)"
                    v-else
                    disabled
                  >
                    <span>续费</span>
                  </el-button>
                </span>
                <el-button
                  type="text"
                  size="small"
                  icon="el-icon-s-promotion"
                  @click.stop="openAuth"
                >
                  <span>前往授权</span>
                </el-button>
                <el-button
                  v-if="permissions.dfh_shop_edit"
                  type="text"
                  size="small"
                  icon="el-icon-edit"
                  @click="showUpdate(row, index)"
                >
                  <span>编辑</span>
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  icon="el-icon-delete-solid"
                  @click.stop="removeShop(row)"
                >
                  <span>删除</span>
                </el-button>
              </template>
            </avue-crud>
          </div>
        </div>
        <dialog-verify
          :visible="visible"
          @close="visible = false"
        ></dialog-verify>
        <dialog-pay
          :visible="show"
          @close="show = false"
          @success="onSuccess"
        ></dialog-pay>
        <dialog-renewal-shop-pay
          :visible="renewalShopVisible"
          @close="renewalShopVisible = false"
          @success="onSuccess"
          :renewalShopPayData="renewalShopPayData"
        ></dialog-renewal-shop-pay>
        <DialogMarket ref="market" />
        <DialogReserve ref="dialogReserve" />
      </el-tab-pane>
      <el-tab-pane label="支付账号" name="second">
        <PayAccount></PayAccount>
      </el-tab-pane>
      <!-- <el-tab-pane label="代发个人账号" name="third">
        <PrivateAccount></PrivateAccount>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import { fetchList, addObj, putObj, delObj } from "@/api/dfh/shop";
import { codeObj } from '@/api/admin/promote-invite';
import { tableOption } from "@/const/crud/dfh/shop";
import { mapGetters, mapState } from "vuex";
import { getStore } from "@/util/store";
import DialogVerify from "./modules/DialogVerify";
import DialogPay from "./modules/DialogPay";
import DialogRenewalShopPay from "./modules/DialogRenewalShopPay";
import DialogMarket from "./modules/DialogMarket";
import DialogReserve from "./modules/DialogReserve";
import PayAccount from "./../payaccount"; //支付账号
import PrivateAccount from "./../privateAccount"; //代发个人账号

export default {
  name: "dfhshop",
  components: {
    DialogVerify,
    DialogPay,
    DialogRenewalShopPay,
    DialogMarket,
    DialogReserve,
    PayAccount,
    PrivateAccount
  },
  data() {
    return {
      show: false,
      visible: false,
      renewalShopVisible: false,
      activeName: 'first',
      formData: {
        shopName: "",
        platformId: "",
        authStatus: "",
      },
      renewalShopPayData: {
        shopId: "",
        expireTime: "",
      },
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,

      shopNum: 0,  // 拥有店铺权限数量
      openShopNum: 0,  //已用店铺权限数量
      shopAuthUrl: "", // 店铺授权链接
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      tenantId: (stateTenantId) => getStore({ name: "tenantId" }),
    }),
    ...mapGetters(["tag", "permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.dfh_shop_add, false),
        // delBtn: this.vaildData(this.permissions.dfh_shop_del, false),
        editBtn: this.vaildData(this.permissions.dfh_shop_edit, false),
      };
    },
  },
  mounted() {
    this.initData();
    this.fetchData();
  },
  methods: {
    handleClick(tab, event) {
        console.log(tab, event);
      },
    async initData() {
      try {
        const {
          data: { data },
        } = await this.$API.getShopAuthUrl();
        // console.log(data);
        this.shopAuthUrl = data;
        console.log("data", data);
      } catch (error) {}
    },
    async fetchData() {
      try {
          const { data: { data } } = await codeObj();
          console.log('data', data)
          this.openShopNum = data.openShopNum || 0;
          this.shopNum = data.shopNum || 0;
      } catch (error) {}
    },
    renewalShop(row) {
      this.renewalShopPayData.shopId = row.id;
      this.renewalShopPayData.expireTime = row.expireTime;
      this.renewalShopVisible = true;
    },
    openAuth() {
      console.log("shopAuthUr;", this.shopAuthUrl);
      if (this.shopAuthUrl.length > 1) {
        this.$refs.market.showEdit(this.shopAuthUrl);
      } else {
        if (window.electron) {
          // 发送到electron进行跳转
          window.electron.send({
            key: "chromeUrl",
            url: this.shopAuthUrl[0].authUrl,
          });
        } else {
          window.open(this.shopAuthUrl[0].authUrl);
        }
      }
    },
    getList(page, params) {
      const formData = {};
      for (const key in this.formData) {
        const row = this.formData[key];
        if (row) formData[key] = row;
      }
      this.tableLoading = true;
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize,
          },
          params,
          formData
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
    showUpdate(row, index) {
      row.password = undefined;
      for (let col of this.tableOption.column) {
        if (col.prop == "shopName") {
          col.disabled = true;
        }
      }
      this.$refs.crud.rowEdit(row, index);
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
      addObj(row)
        .then((data) => {
          this.$message.success("添加成功");
          this.fetchData();
          done();
          this.getList(this.page);
          // 第一次添加店铺引导用户授权
          this.$refs.dialogReserve.showEdit();
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
    /**
     * 重置form表单
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.onClickComfirm();
    },
    onClickComfirm() {
      this.page.currentPage = 1;
      this.getList(this.page);
    },
    onClickAdd() {
      if (this.openShopNum>=this.shopNum)
      return (this.visible = true);
      for (let col of this.tableOption.column) {
        if (col.prop == "shopName") {
          col.disabled = false;
        }
      }
      this.$refs.crud.rowAdd();
    },
    removeShop(row) {
      this.$confirm("此操作将删除该店铺, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delObj(row.id).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.fetchData();
          this.getList(this.page);
        });
      });
    },
    onSuccess() {
      this.fetchData();
    },
  },
};
</script>

<style lang="scss">
.dfh-shop-index-pages-container {
  .wrapper {
    .header {
      .filter-box {
        background: #ffffff;
        border-radius: 8px 8px 8px 8px;
        padding: 16px;
        ::v-deep .el-form {
          display: flex;
          align-items: center;
          .el-form-item {
            margin-bottom: 0px;
            margin-left: 10px;
          }
        }
      }
    }
    .content {
      margin-top: 16px;
      padding: 16px 16px 50px;
      background: #fff;
      border-radius: 8px;
      .menu-left {
        display: flex;
        align-items: center;
        .alert {
          width: 446px;
          height: 32px;
          background: #edf0ff;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid $themeColor;
          display: flex;
          align-items: center;
          margin-left: 10px;
          i {
            font-size: 16px;
            color: $themeColor;
            transform: rotate(180deg);
            margin-left: 16px;
            margin-right: 12px;
          }
          span {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.85);
          }
        }
      }
      .menu-right {
        font-size: 14px;
        color: #000000;
        line-height: 32px;
      }
    }
  }
}
.el-tabs__nav-wrap::after {
    background: none;
}
.el-tabs__active-bar {
    height: 4px;
    border-radius: 45px;
}
</style>
