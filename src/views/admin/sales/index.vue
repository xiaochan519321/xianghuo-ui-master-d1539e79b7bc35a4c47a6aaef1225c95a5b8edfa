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
            <avue-crud ref="crud"
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
                    @selection-change="selectionChange"
                    @row-update="handleUpdate"
                    @row-save="handleSave"
                    @row-del="rowDel"
                >
                <template slot="lockFlag" slot-scope="{row}">
                    <el-tag :type="row.lockFlag == 9 ? 'warning' : ''">{{row.lockFlag == 9 ? '锁定' : '有效'}}</el-tag>
                </template>
                <template slot="menuLeft">
                    <el-button type="primary" size="small" @click="$refs.crud.rowAdd()">添加</el-button>
                    <el-button size="small" @click="onMutiOpen">批量启用</el-button>
                    <el-button size="small" @click="onMutiLock">批量锁定</el-button>
                </template>
                <template slot-scope="{type,size,row,index}" slot="menu">
                    <el-button :size="size" :type="type" @click="$refs.crud.rowEdit(row, index)">编辑</el-button>
                    <el-button :size="size" :type="type" v-clipboard:copy="copyUrl(row.promoteCode)" v-clipboard:success="onCopy" v-clipboard:error="onError">复制邀请链接</el-button>
                    <el-button :size="size" :type="type" @click="$refs.crud.rowDel(row, index)">删除</el-button>
                    <el-button :size="size" :type="type" @click="binding(row)">分配客户</el-button>
                </template>
            </avue-crud>
            
             <el-dialog :title="commonDialog.title" :visible.sync="commonDialog.dialogVisible" :width="commonDialog.width" class="sales-dialog-add" top="3vh" :close-on-click-modal="false">
                <binding ref="bdForm" @ok="sonOK" height="50vh"/>
                <span slot="footer" class="dialog-footer">
                    <!-- <el-button type="primary" @click="ok">保 存</el-button> -->
                    <el-button @click="commonDialog.dialogVisible = false">关 闭</el-button>
                </span>
            </el-dialog>
        </basic-container>
    </div>
</template>

<script>
    import {getSalesList, addObj, putObj, delObj, statusObj} from '@/api/admin/sales/sales'
    import {tableOption} from '@/const/crud/admin/sales/sales'
    import binding from '@/views/admin/customer/index'
    import {mapGetters} from 'vuex'

    export default {
        name: 'sales',
         components: {
            binding
        },
        data() {
            return {
                searchForm: {},
                tableData: [],
                page: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                tableLoading: false,
                tableOption: tableOption,
                commonDialog:{
                    title: '',
                    width: '70%',
                    dialogVisible: false
                },
                scData: [],
                datetime:'1398250549123'//时间戳例子
            }
        },
        computed: {
            ...mapGetters(['permissions']),
            permissionList() {
                return {
                    addBtn: this.vaildData(this.permissions.syssalesbinding_add, false),
                    delBtn: this.vaildData(this.permissions.giftrecord_del, false),
                    editBtn: this.vaildData(this.permissions.giftrecord_edit, false)
                };
            }
        },
        methods: {
            // 复制地址
            copyUrl (code) {
                return `${window.location.origin}/#/login?promoteCode=${code}`
            },
            // 复制成功
            onCopy(e) {
                this.$message({
                    message: '复制成功！',
                    type: 'success'
                })
            },
            // 复制失败
            onError(e) {
                this.$message({
                    message: '复制失败！',
                    type: 'error'
                })
            },
            // 批量启用
            onMutiOpen () {
                if (!this.scData.length) return this.$message.warning('请至少勾选一个销售人员进行操作')
                const ids = this.scData.map(item => item.merchantId)
                const that = this
                const params = {
                    merchantIds: ids,
                    lockFlag: 0
                }
                this.$confirm('是否确定将当前选中销售人员进行启动？', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async function () {
                    const { data } = await statusObj(params)
                    if (data.code == 0) {
                        that.$message.success('操作成功')
                        that.getList(that.page)
                    }
                })
            },
            onMutiLock () {
                if (!this.scData.length) return this.$message.warning('请至少勾选一个销售人员进行操作')
                const ids = this.scData.map(item => item.merchantId)
                const that = this
                const params = {
                    merchantIds: ids,
                    lockFlag: 9
                }
                this.$confirm('是否确定将当前选中销售人员进行锁定？', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async function () {
                    const { data } = await statusObj(params)
                    if (data.code == 0) {
                        that.$message.success('操作成功')
                        that.getList(that.page)
                    }
                })
            },
            getList(page, params) {
                this.tableLoading = true
                getSalesList(Object.assign({
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
            binding(row){
                console.log('row', row)
                this.commonDialog.width = '60%';
                this.commonDialog.title = `正在为${row.username}分配客户`;
                this.commonDialog.dialogVisible = !this.commonDialog.dialogVisible;
                this.$nextTick(function() {
                    this.$refs.bdForm.refreshTable()
                    this.$refs.bdForm.rowForm = row;
                    console.log(this.$refs.bdForm);
                });
            },
            sonOK(){
                this.commonDialog.dialogVisible = !this.commonDialog.dialogVisible;
                this.getList(this.page)
            },
            rowDel: function (row, index) {
                this.$confirm(`是否确认删除销售人员${row.username}, 一旦删除则不可恢复！`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    return delObj(row.userId)
                }).then(data => {
                    this.$message.success('删除成功')
                    this.getList(this.page)
                })
            },
            handleUpdate: function (row, index, done,loading) {
                putObj(row).then(data => {
                    this.$message.success('修改成功')
                    done()
                    this.getList(this.page)
                }).catch(() => {
                    loading();
                });
            },
            handleSave: function (row, done,loading) {
                addObj(row).then(data => {
                    this.$message.success('添加成功')
                    done()
                    this.getList(this.page)
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
            },
            selectionChange(list){
                this.scData = list;
            }
        }
    }
</script>

<style lang="scss" scoped>
.sales-dialog-add {
    ::v-deep.el-dialog .el-dialog__body {
        padding: 0;
        .el-card {
            box-shadow: none;
            .el-card__body {
                padding: 0;
            }
        }
    }
}
</style>