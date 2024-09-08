<template>
    <div class="execution interrallog-page">
        
        <basic-container>
            <div class="header">
                <el-form ref="form" :model="searchForm" inline>
                    <el-form-item label="创建时间：" v-if="false">
                        <el-date-picker
                            type="daterange"
                            style="width: 366px"
                            clearable
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="类型：">
                        <el-select v-model="searchForm.type" clearable style="width: 232px">
                            <el-option label="收入" value="1"></el-option>
                            <el-option label="支出" value="2"></el-option>
                            <el-option label="充值" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支出类型：">
                        <el-select v-model="searchForm.spendingType" clearable style="width: 232px">
                            <el-option label="下单扣除" :value="0"></el-option>
                            <el-option label="优惠卷扣除" :value="1"></el-option>
                            <el-option label="管理员回收" :value="2"></el-option>
                            <el-option label="过滤代发短信" :value="5"></el-option>
                            <el-option label="商品动销" :value="6"></el-option>
                            <el-option label="好评返现" :value="7"></el-option>
                            <el-option label="搜索排名" :value="8"></el-option>
                            <el-option label="选品罗盘" :value="9"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="收入类型：">
                        <el-select v-model="searchForm.incomeType" clearable style="width: 232px">
                            <el-option label="积分充值" :value="0"></el-option>
                            <el-option label="管理员赠送" :value="1"></el-option>
                            <el-option label="注册赠送" :value="2"></el-option>
                            <el-option label="退回积分" :value="3"></el-option>
                        </el-select>
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
                @row-update="handleUpdate"
                @row-save="handleSave"
                @row-del="rowDel"
            >
                <template slot="qmNum" slot-scope="scope">
                    <span>{{parseInt(scope.row.qcNum) + parseInt(scope.row.bdNum)}}</span>
                </template>
            </avue-crud>
        </basic-container>
    </div>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj } from '@/api/admin/integrallog'
import { tableOption } from '@/const/crud/admin/integrallog'
import { mapGetters } from 'vuex'

export default {
    name: 'sysintegrallog',
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
            tableOption: tableOption
        }
    },
    computed: {
        ...mapGetters(['permissions']),
        permissionList() {
            return {
                addBtn: this.vaildData(this.permissions.sys_integrallog_add, false),
                delBtn: this.vaildData(this.permissions.sys_integrallog_del, false),
                editBtn: this.vaildData(this.permissions.sys_integrallog_edit, false)
            };
        }
    },
    methods: {
        resetForm(formName) {
            // this.$refs[formName].resetFields();
            this.searchForm = this.$options.data().searchForm;
            this.onClickComfirm();
        },
        onClickComfirm() {
            this.page.currentPage = 1;
            this.getList(this.page);
        },
        getList(page, params) {
            this.tableLoading = true
            fetchList(Object.assign({
                current: page.currentPage,
                size: page.pageSize
            }, params, this.searchForm)).then(response => {
                this.tableData = response.data.data.records
                this.page.total = response.data.data.total
                this.tableLoading = false
            }).catch(() => {
                this.tableLoading = false
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
        handleUpdate: function (row, index, done, loading) {
            putObj(row).then(data => {
                this.$message.success('修改成功')
                done()
                this.getList(this.page)
            }).catch(() => {
                loading();
            });
        },
        handleSave: function (row, done, loading) {
            addObj(row).then(data => {
                this.$message.success('添加成功')
                done()
                this.getList(this.page)
            }).catch(() => {
                loading();
            });
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize
        },
        currentChange(current) {
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

<style lang="scss" scoped>
    .interrallog-page {
        ::v-deep .el-card__body {
            .el-collapse-item__wrap {
                padding: 0 20px;
                margin: 0 -20px 20px;
                border-bottom: 1px solid #eee;
            }
        }

        .header {
            background: #FFFFFF;
            border-radius: 8px 8px 8px 8px;
            padding: 16px;
            ::v-deep .el-form  {
                display: flex;
                align-items: center;
               
                .el-form-item {
                    margin: 0;
                    margin-left: 10px;
                    &:last-child {
                        margin-left: auto;
                    }
                }
            }
        }
        ::v-deep .avue-crud {
            width: 100%;
            margin: 20px 0px 0px;
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
    }
</style>
