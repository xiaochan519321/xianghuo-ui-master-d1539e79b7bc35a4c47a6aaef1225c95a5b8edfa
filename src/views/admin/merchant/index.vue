<!--
  -    Copyright (c) 2018-2025, lzyq All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lzyq
  -->
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
        @sort-change="sortChange"
      >
        <!--添加导出按钮-->
        <template slot="searchMenu">
          <el-button
            type="primary"
            size="small"
            @click.stop="exportMerchant"
            style="margin-left: 10px"
            v-loading.fullscreen.lock="fullscreenLoading"
          >
            <span>导出订单</span>
          </el-button>
          <!-- <el-button :size="size" @click="searchSubmit(row)">导出</el-button> -->
        </template>
        <!--自定义样式-->
        <template slot="lockFlag" slot-scope="scope">
          <el-tag :type="scope.label == '锁定' ? 'danger' : ''">{{
            scope.label
          }}</el-tag>
        </template>
        <template slot="rightExpireTime" slot-scope="scope">
          <el-tag
            :type="scope.row.rightExpireTime | filters('judgeTimeType')"
            >{{ scope.row.rightExpireTime | filters("judgeTimeValue") }}</el-tag
          >
        </template>
        <template slot-scope="{ type, size, row }" slot="menu">
          <el-button
            :size="size"
            :type="type"
            @click="checkMerchant(row)"
            icon="el-icon-edit-outline"
            >备注</el-button
          >
          <el-button
            :size="size"
            :type="type"
            @click="presentIntegral(row)"
            icon="el-icon-news"
            >赠送积分</el-button
          >
          <el-button
            v-if="permissions.sys_merchant_retrieveIntegral"
            :size="size"
            :type="type"
            @click="recycleIntegral(row)"
            icon="el-icon-takeaway-box"
            >回收积分</el-button
          >
          <el-button
            :size="size"
            :type="type"
            @click="updateMerchantProfitConfig(row)"
            v-if="row.agentStatus == null || row.agentStatus == 0"
            icon="el-icon-plus"
            >成为代理</el-button
          >
          <el-button
            :size="size"
            :type="type"
            @click="updateAgentState(row, 0)"
            v-if="row.agentStatus == 1 || row.agentStatus == 2"
            icon="el-icon-minus"
            >取消代理</el-button
          >
          <el-button
            :size="size"
            :type="type"
            @click="updateIntegralSkipStatus(row, 1)"
            v-if="row.integralSkipStatus == null || row.integralSkipStatus == 0"
            icon="el-icon-plus"
            >开通免积分拍单权益</el-button
          >
          <el-button
            :size="size"
            :type="type"
            @click="updateIntegralSkipStatus(row, 0)"
            v-if="row.integralSkipStatus == 1"
            icon="el-icon-minus"
            >取消免积分拍单权益</el-button
          >
          <el-button
            v-if="permissions.sys_merchant_recharge_balance"
            :size="size"
            :type="type"
            @click="onRechargeBalance(row)"
            icon="el-icon-mobile"
            >充值面单</el-button
          >
          <el-button
            v-if="permissions.generator_syscdkey_add"
            :size="size"
            :type="type"
            @click="exchangeCdk(row)"
            icon="el-icon-mobile"
            >兑换卡密</el-button
          >
        </template>
      </avue-crud>
      <el-dialog
        :title="commonDialog.title"
        :visible.sync="commonDialog.dialogVisible"
        :width="commonDialog.width"
      >
        <span>
          <CheckMerchant
            v-if="commonDialog.tag === 'ss'"
            ref="sHForm"
            @ok="sonOK"
          />
          <PresentIntegral
            v-if="commonDialog.tag === 'pi'"
            ref="pIForm"
            @ok="sonOK"
          />
          <RecycleIntegral
            v-if="commonDialog.tag === 'ri'"
            ref="rIForm"
            @ok="sonOK"
          />
          <updateMerchantProfitConfig
            v-if="commonDialog.tag === 'upcf'"
            ref="upcFForm"
            @ok="sonOK"
          />
          <rechargeBalance
            v-if="commonDialog.tag === 'rb'"
            ref="rbForm"
            @ok="sonOK"
          />
          <exchangeCdk
           v-if="commonDialog.tag === 'cdk'"
            ref="cdkForm"
            @ok="sonOK"
          />
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="ok">保 存</el-button>
          <el-button @click="commonDialog.dialogVisible = false"
            >关 闭</el-button
          >
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  updateAgentState,
  updateIntegralSkipStatus,
  exportMerchant,
  getExportStatus,
} from "@/api/admin/merchant";
import { tableOption } from "@/const/crud/admin/merchant";
import CheckMerchant from "./modules/CheckMerchant";
import PresentIntegral from "./modules/PresentIntegral";
import RechargeBalance from "./modules/RechargeBalance";
import RecycleIntegral from "./modules/RecycleIntegral";
import updateMerchantProfitConfig from "./modules/updateMerchantProfitConfig";
import ExchangeCdk from "./modules/ExchangeCdk.vue";
import { mapGetters } from "vuex";

export default {
  name: "merchant",
  components: {
    CheckMerchant,
    PresentIntegral,
    RechargeBalance,
    RecycleIntegral,
    updateMerchantProfitConfig,
    ExchangeCdk
  },
  data() {
    return {
      searchForm: {
        sortColumn: 'createTime',
        sortType: 'descending'
      },
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      commonDialog: {
        tag: "",
        title: "",
        width: "40%",
        dialogVisible: false,
      },
      fullscreenLoading: false
       
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.sys_merchant_add, false),
        delBtn: this.vaildData(this.permissions.sys_merchant_del, false),
        editBtn: this.vaildData(this.permissions.sys_merchant_edit, false),
      };
    },
  },
  methods: {
    checkMerchant(row) {
      this.commonDialog.width = "40%";
      this.commonDialog.tag = "ss";
      this.commonDialog.title = "备注";
      this.commonDialog.dialogVisible = !this.commonDialog.dialogVisible;
      this.$nextTick(function () {
        this.$refs.sHForm.checkForm = row;
      });
    },
    presentIntegral(row) {
      this.commonDialog.width = "40%";
      this.commonDialog.tag = "pi";
      this.commonDialog.title = "赠送积分";
      this.commonDialog.dialogVisible = !this.commonDialog.dialogVisible;
      this.$nextTick(function () {
        this.$refs.pIForm.presentForm = row;
      });
    },
    exchangeCdk(row){
        this.commonDialog.width = "40%";
      this.commonDialog.tag = "cdk";
      this.commonDialog.title = "兑换卡密";
      this.commonDialog.dialogVisible = !this.commonDialog.dialogVisible;
      this.$nextTick(function () {
        this.$refs.cdkForm.presentForm = row;
      });
    },
    // 充值面单
    onRechargeBalance (row) {
      this.commonDialog.width = "40%";
      this.commonDialog.tag = "rb";
      this.commonDialog.title = "充值面单";
      this.commonDialog.dialogVisible = !this.commonDialog.dialogVisible;
      this.$nextTick(function () {
        this.$refs.rbForm.presentForm = row;
      });
    },
    recycleIntegral (row) {
      this.commonDialog.width = "512px"
      this.commonDialog.tag = "ri";
      this.commonDialog.title = "回收积分";
      this.commonDialog.dialogVisible = !this.commonDialog.dialogVisible;
      this.$nextTick(function () {
        this.$refs.rIForm.presentForm = {...row, presentIntegral: 1}
      });
    },
    updateMerchantProfitConfig(row) {
      this.commonDialog.width = "40%";
      this.commonDialog.tag = "upcf";
      this.commonDialog.title = "绑定分佣模板";
      this.commonDialog.dialogVisible = !this.commonDialog.dialogVisible;
      this.$nextTick(function () {
        this.$refs.upcFForm.form.id = row.merchantId;
        this.$refs.upcFForm.form.profitConfigId = row.profitConfigId;
      });
    },
    updateAgentState(row, stauts) {
      const h = this.$createElement;
      let message = "确定让" + row.phone + "用户成为代理商吗?";
      if (stauts == 0) {
        message = "确定取消" + row.phone + "用户代理商身份吗?";
      }
      this.$msgbox({
        type: "warning",
        title: "消息",
        message: h("p", null, [h("span", null, message)]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            updateAgentState({ id: row.merchantId, agentState: stauts }).then((res) => {
              instance.confirmButtonLoading = false;
              this.$message({
                type: "success",
                message: "操作成功!",
              });
              done();
              this.getList(this.page);
            });
          } else {
            done();
          }
        },
      });
    },
    updateIntegralSkipStatus(row, stauts) {
      const h = this.$createElement;
      let message = "确定恢复" + row.phone + "的免积分拍单权益吗?";
      if (stauts == 0) {
        message = "确定取消" + row.phone + "的免积分拍单权益吗？取消后立即生效，并且商家再次充值也不会恢复权益！";
      }
      this.$msgbox({
        type: "warning",
        title: "消息",
        message: h("p", null, [h("span", null, message)]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            updateIntegralSkipStatus({ id: row.merchantId, integralSkipStatus: stauts }).then((res) => {
              instance.confirmButtonLoading = false;
              this.$message({
                type: "success",
                message: "操作成功!",
              });
              done();
              this.getList(this.page);
            });
          } else {
            done();
          }
        },
      });
    },

    ok() {
      switch (this.commonDialog.tag) {
        case "ss":
          this.$refs.sHForm.ok();
          break;
        case "pi":
          this.$refs.pIForm.ok();
          break;
        case "ri":
          this.$refs.rIForm.ok();
          break;
        case "upcf":
          this.$refs.upcFForm.save();
          break;
        case "rb":
          this.$refs.rbForm.ok();
          break;
        case "cdk":
          this.$refs.cdkForm.ok();
          break;
      }
    },
    sonOK() {
      this.commonDialog.dialogVisible = !this.commonDialog.dialogVisible;
      this.getList(this.page);
    },

    sortChange(val) {
      //排序
      this.page.orderBy = val;
      let params = {
        sortColumn: val.prop,
        sortType: val.order,
      };
      this.getList(this.page, params);
      //this.$message.success(JSON.stringify(val));
    },

    getList(page, params) {
      this.tableLoading = true;
      fetchList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize,
          },
          this.searchForm,
          params
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

    exportMerchant() {
      if (this.$refs.crud.tableSelect.length == 0) {
        this.$message.error("未选择需要绑定的商户,将默认将当前所有数据导出");
        const formData = {};
        for (const key in this.searchForm) {
          //获取查询列表
          const row = this.searchForm[key];
          if (row) formData[key] = row;
        }
        this.outInfo(formData);
      } else {
        let params = {
          selectMerchantUserIds: [],
        };
        this.$refs.crud.tableSelect.forEach((item) => {
          params.selectMerchantUserIds.push(item.userId);
        });
        this.outInfo(params);
      }
    },

    outInfo(formData) {
      getExportStatus().then((res) => {
        this.fullscreenLoading = true;
        exportMerchant(formData)
          .then((res) => {
            this.fullscreenLoading = false;
            const type = "application/gzip";
            const blob = new Blob([res.data], { type: type });
            const name = decodeURI(
              res.headers["content-disposition"].split("=")[1]
            );
            if (window.navigator.msSaveBlob) {
              //没有此判断的话，ie11下的导出没有效果
              window.navigator.msSaveBlob(blob, name);
            } else {
              const downloadElement = document.createElement("a");
              const href = window.URL.createObjectURL(blob);
              //后台再header中传文件名
              downloadElement.href = href;
              downloadElement.download = name;
              document.body.appendChild(downloadElement);
              downloadElement.click();
              document.body.removeChild(downloadElement); // 下载完成移除元素
            }
            return Promise.resolve(true);
          })
          .catch(() => {
            this.fullscreenLoading = false;
          });
      });
    },

    rowDel: function (row, index) {
      this.$confirm("是否确认删除ID为" + row.id, "提示", {
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
      if(form.deadDays<0){
        this.$message.error("不存在负参数！");
        done();
      }
      this.getList(this.page, form);
      done();
    },
    refreshChange() {
      this.getList(this.page);
    },
  },
  filters: {
    //判定过期时间与当前时间的大小
    judgeTimeType(row) {
      // console.log(row+"type");
      let time = new Date(row.rightExpireTime);
      let now = new Date();
      if (time < now) {
        return availableType(0);
      } else {
        return availableType(1);
      }
    },
    //判定过期时间与当前时间的大小
    judgeTimeValue(row) {
      // console.log(row);
      let time = new Date(row.rightExpireTime);
      let now = new Date();
      if (time < now) {
        return availableValue(0);
      } else {
        return availableValue(1);
      }
    },

    availableType(status) {
      // available el-tag类型转换
      const statusMap = { 1: "success", 0: "danger" };
      return statusMap[status];
    },
    // available 状态值显示转换
    availableValue(status) {
      const statusMap = { 1: "有效", 0: "锁定" };
      return statusMap[status];
    },
  },
};
</script>