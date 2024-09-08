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
  - Neither the name of thelayq.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lzyq
  -->

<template>
  <div class="execution">
    <basic-container >
      <avue-crud ref="crud"
                 v-model="profitRuleForm"
                 :page.sync="page"
                 :data="tableData"
                 :permission="permissionList"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 :before-close="beforeClose"
                 @on-load="getList"
                 @search-change="searchChange"
                 @refresh-change="refreshChange"
                 @size-change="sizeChange"
                 @current-change="currentChange"
                 @row-update="handleSave"
                 @row-save="handleSave"
                 @row-del="rowDel">

        <template slot-scope="scope" slot="menuLeft">
          <el-button v-if="permissions.member_profitconfig_add && tableData.length<10" type="primary"
                     @click="handleAdd">新 增
          </el-button>
        </template>
        <template slot-scope="{ row, type, size }" slot="menu">
          <el-button
            v-if="permissions.member_profitconfig_add"
            @click="handleAllotMember(row)"
            icon="el-icon-user"
            :size="size"
            :type="type">分配用户
          </el-button>
          <el-button
            @click="handleUsedMember(row)"
            icon="el-icon-view"
            :size="size"
            :type="type">查看已分配用户
          </el-button>
        </template>
        <template
          slot="nameForm"
          slot-scope="scope">
          <el-input type="text" v-model="profitRuleForm.name"  placeholder="请输入配置名称" />
        </template>
        <template
          slot="cardSwitchForm"
          slot-scope="scope">
          <div>
            <el-switch
              v-model="profitRuleForm.cardSwitch" :active-value="1" :inactive-value="0">
            </el-switch>
            <span style="margin-left: 5px;">{{(profitRuleForm.cardSwitch===1 ? '开启' : '关闭')}}</span>
          </div>
        </template>
        <template
          slot="profitSwitchForm"
          slot-scope="scope">
          <div>
            <el-switch
              v-model="profitRuleForm.profitSwitch" :active-value="1" :inactive-value="0">
            </el-switch>
            <span style="margin-left: 5px;">{{(profitRuleForm.profitSwitch===1 ? '开启' : '关闭')}}</span>
          </div>
        </template>
        <template slot="agentProfitRateHeader" slot-scope="{column}">
          {{column.label}}(%)
        </template>
        <template
          slot="agentProfitRateForm"
          slot-scope="scope">
          <el-input type="number" v-model="profitRuleForm.agentProfitRate" placeholder="请输入一级代理商分佣比率"  >
            <template slot="append">%</template>
          </el-input>
        </template>
        <template slot="sonProfitRateHeader" slot-scope="{column}">
          {{column.label}}(%)
        </template>
        <template
          slot="sonProfitRateForm"
          slot-scope="scope">
          <el-input type="number" v-model="profitRuleForm.sonProfitRate" :disabled="profitRuleForm.profitType!==2" placeholder="请输入二级用户分佣比率" >
            <template slot="append">%</template>
          </el-input>
        </template>
        <template slot="secondProfitRateHeader" slot-scope="{column}">
          {{column.label}}(%)
        </template>
        <template
          slot="secondProfitRateForm"
          slot-scope="scope">
          <el-input type="number" v-model="profitRuleForm.secondProfitRate" placeholder="请输入二级用户分佣比率" >
            <template slot="append">%</template>
          </el-input>
        </template>

      </avue-crud>
      <el-dialog
        title="分配用户"
        :visible.sync="allotMemberDialogVisible"
        width="75%"
      >
        <avue-crud ref="allotMemberCrud"
                   :page.sync="allotMemberPage"
                   :data="allotMemberTableData"
                   :table-loading="tableLoading"
                   :option="allotMemberTableOption"
                   @selection-change="selectionChange"
                   @search-change="allotMemberSearchChange"
                   @refresh-change="allotMemberRefreshChange"
                   @size-change="allotMemberSizeChange"
                   @current-change="allotMemberCurrentChange">

        </avue-crud>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="allotMemberDialogVisible = false">关 闭</el-button>
                    <el-button type="primary" @click="saveAllotMember">提 交</el-button>
                </span>
      </el-dialog>
      <el-dialog
        title="已分配用户"
        :visible.sync="usedMemberDialogVisible"
        width="75%"
      >
        <avue-crud ref="usedMemberCrud"
                   :page.sync="usedMemberPage"
                   :data="usedMemberTableData"
                   :table-loading="tableLoading"
                   :option="usedMemberTableOption"
                   @search-change="usedMemberSearchChange"
                   @refresh-change="usedMemberRefreshChange"
                   @size-change="usedMemberSizeChange"
                   @current-change="usedMemberCurrentChange"
                   @row-del="delMember">

        </avue-crud>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="usedMemberDialogVisible = false">关 闭</el-button>
                </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {putObj, fetchList,saveProfit,addProfitConfig,delProfitConfig,memberList} from '@/api/admin/promote-config'
import {tableOption,memberTableOption} from '@/const/crud/admin/promote-config'
import {saveMemberProfit, delMemberProfit} from '@/api/admin/profit-user'

export default {
  data() {
    return {
      combo:[],
      tipMoney: 0,
      profitEditStatus: false,
      configEditStatus: false,
      ruleForm: {
        freeDay: 0,
        comboNumber: 0,
        inviterProfitDay: 0,
        agentProfitDay: 0,
        agentInviteesProfitDay: 0,
        inviteesProfitDay: 0,
        comboId: 1,
        yxComboId: -1
      },
      switchOption: [{
        label: '关闭',
        value: 0
      }, {
        label: '开启',
        value: 1
      }],
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      profitTypeFlag: false,
      profitRuleForm: {
        name: undefined,
        cardSwitch: 1,
        profitType: 3,
        profitSwitch: 1,
        profitRate: undefined,
        agentProfitRate: undefined,
        sonProfitRate: undefined,
        secondProfitRate: undefined
      },
      allotMemberTableData: [],
      usedMemberTableData: [],
      currentProfitId: undefined,
      allotMemberTableOption: memberTableOption,
      usedMemberTableOption: memberTableOption,
      allotMemberDialogVisible: false,
      usedMemberDialogVisible: false,
      profitForm:{
        userIds:[],
        profitId:undefined
      },
      allotMemberPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [5,10,15,20],
      },
      usedMemberPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [5,10,15,20],
      },
      rules: {

      },
    };
  },
  created() {
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
        return {
        };
    }
  },
  methods: {
    handleAdd: function () {
      this.$refs.crud.rowAdd()
    },
    selectionChange(list){
      let me = this;
      if(!list || list.length === 0) {
        // 未选中
        me.profitForm.userIds = null
      } else if(list && list.length > 0){
        let userIds = [];
        for (let i = 0; i < list.length; i++) {
          userIds.push(list[i].userId)
        }
        me.profitForm.userIds = userIds
      }

    },
    saveAllotMember(){
      let me = this;
      this.profitForm.profitId = this.currentProfitId
      let tip = !me.profitForm.userIds || me.profitForm.userIds.length===0 ? '您未选择用户，点击确定所有用户均会生效' : ('您已选择'+me.profitForm.userIds.length+'个用户，点击确定后生效')
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        saveMemberProfit(this.profitForm).then(data => {
          if(data.data.code!==0){
            this.$message.error(data.data.msg)
            return
          }
          this.profitForm.userIds=[];
          this.profitForm.profitId = undefined;
          this.$refs.allotMemberCrud.toggleSelection();
          this.allotMemberDialogVisible = !this.allotMemberDialogVisible
          me.$message.success('操作成功')
          me.getList(this.page)
          done()
        }).catch(() => {
          this.tableLoading=false
        });
      }).catch(action  => {

      })

    },
    handleAllotMember: function (row) {
      this.allotMemberTableOption.selection = true
      this.allotMemberTableOption.menu = false
      for (let i = 0; i < this.allotMemberTableOption.column.length; i++) {
        if(this.allotMemberTableOption.column[i].prop === 'profitName'){
          this.allotMemberTableOption.column[i].search = true
          break
        }
      }
      this.allotMemberDialogVisible = !this.allotMemberDialogVisible
      this.currentProfitId = row.id
      this.allotMemberList(this.allotMemberPage,{});
    },
    handleUsedMember: function (row) {
      this.allotMemberTableOption.selection = false
      this.allotMemberTableOption.menu = true
      for (let i = 0; i < this.usedMemberTableOption.column.length; i++) {
        if(this.usedMemberTableOption.column[i].prop === 'profitName'){
          this.usedMemberTableOption.column[i].search = false
          break
        }
      }
      this.usedMemberDialogVisible = !this.usedMemberDialogVisible
      this.currentProfitId = row.id
      this.usedMemberList(this.usedMemberPage,{profitId:this.currentProfitId});
    },
    beforeClose(done,type){
      this.profitRuleForm = {
        id: undefined,
        name: undefined,
        cardSwitch: 1,
        profitType: 2,
        profitSwitch: 0,
        profitRate: undefined,
        agentProfitRate: undefined,
        sonProfitRate: undefined,
        secondProfitRate: undefined
      }
      done();

    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return false;
        }
        putObj(this.ruleForm).then(res => {
            if(res.data.code!==0){
              this.$message.error(res.data.msg)
              return
            }
            this.$message.success('保存成功')
            this.configEditStatus = false
            //done()
        }).catch(() => {
            loading();
        });
      });
    },
    allotMemberSizeChange(pageSize){
      this.allotMemberPage.pageSize = pageSize
      this.allotMemberList(this.allotMemberPage,{profitId:this.currentProfitId});
    },
    allotMemberCurrentChange(current){
      this.allotMemberPage.currentPage = current
      this.allotMemberList(this.allotMemberPage,{profitId:this.currentProfitId});
    },
    allotMemberSearchChange(form, done) {
      this.allotMemberPage.currentPage = 1
      form.profitId = this.currentProfitId
      this.allotMemberList(this.allotMemberPage,form);
      done()
    },
    allotMemberRefreshChange() {
      this.allotMemberList(this.allotMemberPage,{profitId:this.currentProfitId});
    },
    usedMemberSizeChange(pageSize){
      this.usedMemberPage.pageSize = pageSize
      this.usedMemberList(this.usedMemberPage,{profitId:this.currentProfitId});
    },
    usedMemberCurrentChange(current){
      this.usedMemberPage.currentPage = current
      this.usedMemberList(this.usedMemberPage,{profitId:this.currentProfitId});
    },
    usedMemberSearchChange(form, done) {
      this.usedMemberPage.currentPage = 1
      form.profitId = this.currentProfitId
      this.usedMemberList(this.usedMemberPage,form);
      done()
    },
    usedMemberRefreshChange() {
      this.usedMemberList(this.usedMemberPage,{profitId:this.currentProfitId});
    },
    allotMemberList(page, params) {
      this.$refs.allotMemberCrud ? this.$refs.allotMemberCrud.toggleSelection() : undefined;
      this.tableLoading = true
      params.profitId = null
      memberList(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, params )).then(response => {
        this.allotMemberTableData = response.data.data.records
        this.allotMemberPage.total = response.data.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading=false
      })
    },
    usedMemberList(page, params) {
      this.tableLoading = true
      memberList(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, params )).then(response => {
        this.usedMemberTableData = response.data.data.records
        this.usedMemberPage.total = response.data.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading=false
      })
    },
    getList(page, params) {
      this.tableLoading = true
      fetchList(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm )).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading=false
      })
    },
    delMember: function (row, index) {
      this.$confirm('确认要移除' + row.phone+'分佣配置', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delMemberProfit(row.profitUserId)
      }).then(data => {
        if(data.data.code!==0){
          this.$message.error(data.data.msg)
          return
        }
        this.$message.success('删除成功')
        this.usedMemberList(this.usedMemberPage,{profitId:this.currentProfitId});
      })
    },
    rowDel: function (row, index) {
      this.$confirm('是否确认删除' + row.name+'配置', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delProfitConfig(row.id)
      }).then(data => {
        if(data.data.code!==0){
          this.$message.error(data.data.msg)
          return
        }
        this.$message.success('删除成功')
        this.getList(this.page)
      })
    },
    handleSave: function (row, done,loading) {

      addProfitConfig(row).then(data => {
        if(data.data.code!==0){
          this.$message.error(data.data.msg)
          return
        }
        this.$message.success('操作成功')
        this.getList(this.page)
        done()

      }).catch(() => {
        loading();
      });
    },
    sizeChange(pageSize){
      this.page.pageSize = pageSize
    },
    currentChange(current){
      this.page.currentPage = current
    },
    searchChange(form, done) {
      this.searchForm = form
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    },
    refreshChange() {
      this.getList(this.page)
    }

  },
};
</script>
<style lang="scss">
@import "@/styles/info.scss";
</style>
