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
                       @row-update="handleUpdate"
                       @row-save="handleSave"
                       @row-del="rowDel"
                       @selection-change="selectionChange">
                <template slot="menuLeft" slot-scope="{size}">
                    <el-button 
                        v-if="permissions.dfh_product_add" 
                        type="primary" 
                        :size="size"  
                        @click="userInsert">
                        <i class="el-icon-plus"></i>
                        账号录入
                    </el-button>
                    <el-button
                        :size="size"
                        @click="batchFlag">
                        <i class="el-icon-s-flag"></i>
                        批量标记
                    </el-button>
                </template>
                <template slot="menu" slot-scope="{type,size,row}">
                    <el-button icon="el-icon-s-flag" :size="size" :type="type" @click="flag(row)">标记</el-button>
                </template>
                <template slot="flagStar" slot-scope="{type,size,row}">
                    <i v-if="row.flagStar == '0'" style="color:gray;" class="el-icon-s-flag"></i>
                    <i v-if="row.flagStar == '1'" style="color:purple;" class="el-icon-s-flag"></i>
                    <i v-if="row.flagStar == '2'" style="color:cyan;" class="el-icon-s-flag"></i>
                    <i v-if="row.flagStar == '3'" style="color:green;" class="el-icon-s-flag"></i>
                    <i v-if="row.flagStar == '4'" style="color:orange;" class="el-icon-s-flag"></i>
                    <i v-if="row.flagStar == '5'" style="color:red;" class="el-icon-s-flag"></i>
                    <div>{{row.flagRemark}}</div>
                </template>
                <template slot="search" slot-scope="{row,size}">
                    <span style="padding-left: 10px">
                        <el-radio-group v-model="flagStar" style="zoom: 1;">
                            <el-radio :label="0"><i style="color:gray;" class="el-icon-s-flag"></i></el-radio>
                            <el-radio :label="5"><i style="color:red;" class="el-icon-s-flag"></i></el-radio>
                            <el-radio :label="4"><i style="color:orange;" class="el-icon-s-flag"></i></el-radio>
                            <el-radio :label="3"><i style="color:green;" class="el-icon-s-flag"></i></el-radio>
                            <el-radio :label="2"><i style="color:cyan;" class="el-icon-s-flag"></i></el-radio>
                            <el-radio :label="1"><i style="color:purple;" class="el-icon-s-flag"></i></el-radio>
                            <el-radio :label="9">无</el-radio>
                        </el-radio-group>
                       <i class="el-icon-circle-close" style="cursor:pointer;" @click="flagStar = undefined" ></i>
                    </span>
                </template>
            </avue-crud>
            <el-dialog :title="commonDialog.title" :visible.sync="commonDialog.dialogVisible" :width="commonDialog.width">
                <span>
                    <Flag v-if="commonDialog.tag === 'f'" ref="fForm" @ok="sonOK"/>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="ok">保 存</el-button>
                    <el-button @click="commonDialog.dialogVisible = false">关 闭</el-button>
                </span>
            </el-dialog>
        </basic-container>
    </div>
</template>

<script>
    import {fetchList, getObj, addObj, putObj, delObj} from '@/api/dfh/pdduser'
    import {tableOption} from '@/const/crud/dfh/pdduser'
    import {mapGetters} from 'vuex'
    import Flag from './modules/Flag'

    export default {
        name: 'dfhpdduser',
        components: {
            Flag
        },
        data() {
            return {
                flagStar:undefined,
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
                    tag: '',
                    title: '',
                    width: '40%',
                    dialogVisible: false
                },
                scData: []
            }
        },
        computed: {
            ...mapGetters(['permissions']),
            permissionList() {
                return {
                    addBtn: this.vaildData(this.permissions.dfh_pdduser_add, false),
                    delBtn: this.vaildData(this.permissions.dfh_pdduser_del, false),
                    editBtn: this.vaildData(this.permissions.dfh_pdduser_edit, false)
                };
            }
        },
        methods: {
            batchFlag() {
                if (this.scData.length < 1) {
                    return this.$message.error('请至少勾选一订单条进行操作')
                }
                if (this.scData.length > 20) {
                    return this.$message.error('一次最多只能标记20条')
                }
                var idsArr = new Array()
                for (var i = 0;i < this.scData.length;i++) {
                    idsArr.push(this.scData[i].id)
                }
                var ids = idsArr.join(",")
                var row = {}
                row.id = ids
                this.flag(row)
                
            },
            flag(row) {
                this.commonDialog.width = '45%';
                this.commonDialog.tag = 'f';
                this.commonDialog.title = '标记';
                this.commonDialog.dialogVisible = !this.commonDialog.dialogVisible;
                this.$nextTick(function() { 
                    var newRow = {};
                    newRow.id = row.id;
                    newRow.flagStar = parseInt(row.flagStar);
                    newRow.flagRemark = row.flagRemark;
                    this.$refs.fForm.dataForm = newRow;
                });
            },
            ok() {
                switch (this.commonDialog.tag) {
                    case 'f':
                        this.$refs.fForm.ok();
                        break;
                }
            },
            sonOK(){
                this.commonDialog.dialogVisible = !this.commonDialog.dialogVisible;
                this.getList(this.page)
            },
            userInsert(){
                this.$router.replace('/pdd')
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
            rowDel: function (row, index) {
                this.$confirm('是否确认删除ID为' + row.id, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    return delObj(row.id)
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
                this.searchForm.flagStar = this.flagStar
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

<style scoped>
.el-radio {
    color: #606266;
    font-weight: 500;
    cursor: pointer;
    margin-right: 10px;
}
</style>