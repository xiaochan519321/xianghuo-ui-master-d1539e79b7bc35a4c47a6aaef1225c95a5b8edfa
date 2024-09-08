`<!--
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
    <div class="app-container calendar-list-container">
        <basic-container>
            <el-row :span="24" type="flex" justify="center">
                <el-col>
                    <el-card
                        shadow="always"
                        style="border-radius: 4px;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
                    >
                        <div>
                            <el-row :span="24">
                                <el-col :xs="4" :sm="4" :md="4">
                                    <avue-data-tabs :option="tabOption"></avue-data-tabs>
                                </el-col>
                                <el-col :xs="20" :sm="20" :md="20">
                                    <avue-data-box :option="rechargeTabOption"></avue-data-box>
                                    <el-form
                                        style="display: none;"
                                        :inline="true"
                                        ref="form"
                                        :rules="rules"
                                        :model="form"
                                    >
                                        <el-form-item label="充值金额" prop="balance">
                                            <el-input
                                                id="balance"
                                                type="number"
                                                :min="0.01"
                                                v-model="form.balance"
                                                placeholder="请输入充值金额"
                                            >
                                                <template slot="append">元</template>
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button
                                                id="btnRecharge"
                                                type="primary"
                                                @click="recharge"
                                                style="background-color: rgb(117, 56, 199);border-color: rgb(117, 56, 199);"
                                            >立即充值</el-button>
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :xs="24" :sm="24" :md="24">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span class="mr10">站点余额流水记录</span>
                            <el-button type="primary" @click="dialogBalance = true" v-if="permissions.sys_site_give_balance">分站充值</el-button>
                        </div>
                        <avue-crud
                            ref="crud"
                            :option="option"
                            :page.sync="page"
                            :table-loading="listLoading"
                            :before-open="handleOpenBefore"
                            :data="list"
                            @on-load="getList"
                            @search-change="searchChange"
                            @size-change="sizeChange"
                            @current-change="currentChange"
                        >
                            <template slot="tenantIdSearch">
                                <div>
                                    <el-cascader
                                        :options="sitesOptions"
                                        :props="{ checkStrictly: true }"
                                        placeholder="全部站点"
                                        :show-all-levels="false"
                                        filterable
                                        clearable
                                        @change="selectSite"
                                    ></el-cascader>
                                </div>
                            </template>

                            <template slot="menu" slot-scope="scope">
                                <el-button
                                    v-if="balance_btn_del"
                                    type="text"
                                    size="small"
                                    icon="el-icon-delete"
                                    @click="deletes(scope.row,scope.index)"
                                >删除</el-button>
                            </template>
                        </avue-crud>
                    </el-card>
                </el-col>
            </el-row>
        </basic-container>
        <el-dialog
            title="扫码支付"
            class="qrcode-dialog"
            :visible.sync="dialogVisible"
            width="30%"
            center
            :close-on-click-modal="false"
            :before-close="stopPay"
        >
            <div class="block" style="text-align: center">
                <qrcode :value="qrcodeSrc" :options="qrcodeOptions" />
                <div>
                    <a href="javascript:void(0);" @click="refreshQrcode">
                        <i class="el-icon-refresh"></i>
                    </a>
                    <span>请用微信或支付宝APP扫码支付</span>
                </div>
            </div>
        </el-dialog>
        <DialogBalance :visible="dialogBalance" @close="dialogBalance = false; refreshChange()"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from "@/store";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { fetchList, delObj } from "@/api/admin/site-balance";
import { getCurrentSite, fetchTree } from "@/api/admin/site";
import { recharge, getRechargePayStatus } from "@/api/pay/paygoodsorder";
import { tableOption, tabOption, rechargeTabOption } from "@/const/crud/admin/site-balance";
import DialogBalance from './components/DialogBalance'

export default {
    name: 'sitebalance',
    data() {
        return {
            methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
            headers: {
                Authorization: "Bearer " + store.getters.access_token,
            },
            rules: {
                balance: [
                    { required: true, message: '请输入充值金额', trigger: 'blur' },
                ]
            },
            searchForm: {
            },
            searchTenantId: "",
            dialogVisible: false,
            dialogBalance: false,
            option: tableOption,
            tabOption: tabOption,
            qrcodeOptions: {
                height: 300,
                width: 300,
            },
            rechargeTabOption: rechargeTabOption,
            labelPosition: 'right',
            listLoading: false,
            list: [],
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 20, // 每页显示多少条,
                isAsc: false// 是否倒序
            },
            form: {
                balance: ''
            },
            payGoodsOrder: {
                goodsType: 5,
                amount: 0
            },
            currentId: 0,
            balance_btn_edit: false,
            balance_btn_del: false,
            timer: undefined,
            qrcodeTimer: undefined,
            qrcodeSrc: '',
            // 站点选项
            sitesOptions: [],
        }
    },
    created() {
        this.getSite()
        // 站点选项
        this.getSiteTree()
        this.balance_btn_edit = this.permissions['site_balance_add']
        this.balance_btn_del = this.permissions['site_balance_del']
    },
    components: {
        qrcode: VueQrcode,
        DialogBalance
    },
    computed: {
        ...mapGetters([
            'elements',
            'userInfo',
            'permissions'
        ])
    },
    methods: {
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
        searchChange(param, done) {
            this.searchForm = param
            this.searchForm.tenantId = this.searchTenantId
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
            show()
        },
        getSite() {
            getCurrentSite().then((req) => {
                this.tabOption.data[0].count = req.data.data.balance;
            }).catch(() => {
                this.$notify.error('服务异常')
            })
        },
        getSiteTree() {
            // 站点选项
            fetchTree().then((res) => {
                const datas = res.data.data;
                if (datas) {
                    this.sitesOptions = datas.map((v) => {
                        return this.sum(v);
                    });
                }
            }).catch(() => {
                this.$notify.error('服务异常')
            })
        },
        // 遍历站点层级数据
        sum(e) {
            if (e.children) {
                return {
                    label: e.name,
                    value: e.id,
                    children: e.children.map(v => this.sum(v)),
                }
            } else {
                return {
                    label: e.name,
                    value: e.id,
                }
            }
        },
        // 选择站点
        selectSite(val) {
            this.searchTenantId = val[val.length - 1];
        },
        recharge() {
            this.form.balance = parent.balance.value
            if (!this.form.balance || this.form.balance < 0.01) {
                this.$notify.error('充值金额不能小于0.01元')
                return
            }
            this.$refs.form.validate((valid) => {
                if (!valid) return
                this.payGoodsOrder.amount = this.form.balance
                this.refreshQrcode()

            })
        },
        refreshQrcode() {
            if (this.qrcodeTimer) {
                clearInterval(this.qrcodeTimer)
            }
            if (this.timer) {
                clearInterval(this.timer)
            }
            recharge(this.payGoodsOrder)
                .then((req) => {
                    if (req.data.code != 0) {
                        this.$notify.error('服务异常')
                        return
                    }
                    this.qrcodeSrc = req.data.data.params
                    this.dialogVisible = true

                    this.timer = setInterval(() => {
                        // 在这里发送请求获取数据
                        this.getPayStatus(req.data.data.goods.payOrderId)
                    }, 2000)

                    this.qrcodeTimer = setInterval(() => {
                        // 在这里发送请求获取数据
                        this.refreshQrcode()
                    }, 600000)
                }).catch((e) => {
                    console.log(e)
                    this.$notify.error('服务异常')
                })
        },
        getPayStatus(payOrderId) {
            getRechargePayStatus(payOrderId).then((req) => {
                if (req.data.code != 0) {
                    clearInterval(this.timer)
                    this.$notify.error(req.data.msg)
                    clearInterval(this.timer)
                    this.dialogVisible = false
                    return
                } else if (req.data.data.status !== '0') {
                    clearInterval(this.timer)
                    this.$notify.success('支付成功')
                    this.dialogVisible = false
                    this.refresh()
                    return
                }

            }).catch(() => {
                this.$notify.error('服务异常')
                clearInterval(this.timer)
                this.dialogVisible = false
            })
        },
        stopPay(done) {
            if (this.qrcodeTimer) {
                clearInterval(this.qrcodeTimer)
            }
            if (this.timer) {
                clearInterval(this.timer)
            }
            done();
        },
        refresh() {
            this.getSite()
            this.refreshChange()
        },
        deletes(row, index) {
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
            ).then(() => {
                delObj(row.id)
                    .then((req) => {
                        if (req.data.code != 0) {
                            this.$notify.error(req.data.msg)
                            return
                        }
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

<style >
.qrcode-dialog .el-dialog {
    border-radius: 20px !important;
}
.qrcode-dialog .el-dialog .el-dialog__body {
    padding-top: 0px !important;
}
</style>
