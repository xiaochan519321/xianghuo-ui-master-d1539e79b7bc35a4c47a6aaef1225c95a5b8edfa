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
            <div>
            <avue-crud ref="crud"
             :row-class-name="tableRowClassName"
             :row-style="selectedHighlight"
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
                       @row-click="rowClick"
                       >
                <template slot="showFlag" slot-scope="scope">
                    <el-tag>{{ scope.label }}</el-tag>
                </template>
            </avue-crud>
            </div>
            <i class="el-icon-close" style="color:red;" v-if="showConfig" @click="hideConfig"></i>
            <el-collapse v-model="configPanel.activeName" accordion v-if="showConfig">
                <el-collapse-item title="价格配置" name="1" v-if="permissions.sys_memberrightprice_view">
                    <template slot="title">
                        价格配置 - {{configPanel.activeTitle}}<i class="header-icon el-icon-info"></i>
                    </template>
                    <PriceConfig ref="pCForm"/>
                </el-collapse-item>
                <!-- <el-collapse-item title="分站底价配置" name="2">
                    <template slot="title">
                        分站底价配置 - {{configPanel.activeTitle}}<i class="header-icon el-icon-info"></i>
                    </template>
                </el-collapse-item> -->
            </el-collapse>
        </basic-container>
    </div>
</template>

<script>
    import {fetchList, getObj, addObj, putObj, delObj} from '@/api/admin/memberright'
    import {tableOption} from '@/const/crud/admin/memberright'
    import {mapGetters} from 'vuex'
    import PriceConfig from './modules/PriceConfig'

    export default {
        name: 'sysmemberright',
        components: {
            PriceConfig
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
                showConfig: false, //是否显示配置
                configPanel: {
                    activeName: '1',
                    activeTitle: ''
                },

            }
        },
        computed: {
            ...mapGetters(['permissions']),
            permissionList() {
                return {
                    addBtn: this.vaildData(this.permissions.sys_memberright_add, false),
                    delBtn: this.vaildData(this.permissions.sys_memberright_del, false),
                    editBtn: this.vaildData(this.permissions.sys_memberright_edit, false)
                };
            }
        },
        methods: {
            hideConfig() {
                this.showConfig = false;
            },
            rowClick(row) {
                this.configPanel.activeTitle = row.name;
                this.showConfig = true;
                this.$nextTick(function() {
                    this.$refs.pCForm.row = row;
                });                
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
                this.page.currentPage = 1
                this.getList(this.page, form)
                done()
            },
            refreshChange() {
                this.getList(this.page)
            }
        }
    }
</script>