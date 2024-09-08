<template>
    <div class='withdrawal-page'>
        <basic-container>
            <div class="balance">
                <div class="title">我的余额</div>
                <el-row :gutter="50" class="title-row">
                    <el-col :span="12">
                        <div class="title-col">
                            <div class="tip">站点利润余额（元）</div>
                            <div class="count">
                                <p class="mt36">
                                    ¥ 0
                                    <!-- <el-button type="primary" size="mini" class="balance-btn" @click="onBalance">去提现</el-button> -->
                                </p>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="title-col">
                            <div class="tip">多多进宝可提现佣金（元）</div>
                            <div class="count">
                                <p class="my20">¥ {{balanceAmount}}<el-button v-if="balanceAmount" type="primary" size="mini" class="balance-btn" @click="onBalance">去提现</el-button></p>
                                <div class="freeze">
                                    ( 已冻结佣金：{{orderCount.frozenAmount | rounding}} )
                                    <el-tooltip class="formula-tooltip" effect="light" placement="bottom-end">
                                        <i class="tips iconfont icon-wenhao font20" style="vertical-align: text-top; color: #333;"></i>
                                        <div slot="content" class="tip-content">
                                            <p>多多已冻结的佣金不可提现的有个审核期，一般要</p>
                                            <p class="mt5">审核通过一般要45-60个工作日将现金打款到账</p>
                                        </div>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="mt20 text-right">
                <el-form inline :model="formData" ref="form">
                    <el-form-item label="提现状态：" prop="accountType">
                        <el-select
                            @change="initGetList"
                            v-model="formData.accountType"
                            placeholder="请选择提现状态"
                            style="width: 160px"
                            clearable
                        >
                            <el-option label="未审核" value="0"></el-option>
                            <el-option label="审核成功" value="1"></el-option>
                            <el-option label="审核失败" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="提现类型：" prop="auditStatus">
                        <el-select
                            @change="initGetList"
                            v-model="formData.auditStatus"
                            placeholder="请选择提现类型"
                            style="width: 160px"
                            clearable
                        >
                            <el-option label="支付宝" value="0"></el-option>
                            <el-option label="微信" value="1"></el-option>
                            <el-option label="银行卡" value="2"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="申请时间" prop="createTimeArr">
                        <el-date-picker
                            v-model="formData.createTimeArr"
                            type="daterange"
                            align="right"
                            unlink-panels
                            @change="initGetList"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click.stop="initGetList">
                            <span>搜索</span>
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="record" v-loading="tableLoading">
                <div class="title mb20">提现记录</div>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        label="提现信息"
                        align="center">
                        <template slot-scope="{row}">
                            <span>{{row.tenantName}}, </span>
                            <span>{{row.accountName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="account"
                        label="提现收款账号"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        label="提现金额（元）"
                        align="center">
                        <template slot-scope="{row}">
                            <span>{{row.money ? row.money / 100 : '-'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="提现状态"
                        align="center">
                        <template slot-scope="{row}">
                            <span>{{auditStatusList[row.auditStatus]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="提现方式"
                        align="center">
                        <template slot-scope="{row}">
                            <span>{{accountTypeList[row.accountType]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="类型"
                        align="center">
                        <template slot-scope="{row}">
                            <span>{{typeList[row.type]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="申请时间"
                        min-width="100"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="auditRemark"
                        label="审核备注"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="option"
                        v-if="permissions.admin_syssitewithdrawrecord_edit"
                        label="操作"
                        align="center">
                        <template slot-scope="{row}">
                            <el-button type="primary" v-if="row.auditStatus == 0" @click="onDispose(row)">处理申请</el-button>
                        </template>
                    </el-table-column>
                    <template slot="empty">
                        <div class="empty">
                            <el-empty
                                description="暂时没有找到任何记录"
                                :image-size="100"
                                v-if="!tableData.length"
                            ></el-empty>
                        </div>
                    </template>
                </el-table>
                <div class="pagination pt10 pb20 flex flex-row-reverse" v-if="formData.total > 0">
                    <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page.sync="formData.current"
                        :page-size="formData.size"
                        :page-sizes="[30, 50, 100]"
                        :total="formData.total"
                        @current-change="onCurrentChange"
                        @size-change="onSizeChange"
                    ></el-pagination>
                </div>
            </div>
        </basic-container>
        <dialog-balance ref="dialogBalance" @success="initGetList"/>
        <dialog-dispose ref="dialogDispose" @success="initGetList"/>
    </div>
</template>

<script>
import { fetchWithdrawList, fetchCountList } from '@/api/admin/ddkOrder'
import DialogBalance from '@/components/dialog/DialogBalance'
import DialogDispose from './modules/DialogDispose'
import { mapState, mapGetters } from 'vuex'
export default {
    components: {
        DialogBalance,
        DialogDispose
    },
    filters: {
        rounding (val) {
            if (val == 0 || !val) {
                return 0
            }
            return val / 100
        }
    },
    data() {
        return {
            formData: {
                total: 0,
                current: 1,
                size: 30
            },
            shopList: [],
            orderCount: {},
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
            },
            tableData: [],
            tableLoading: false,
            auditStatusList: {
                '0': '未审核',
                '1': '审核成功',
                '3': '审核失败',
            },
            accountTypeList: {
                '0': '支付宝',
                '1': '微信',
                '2': '银行卡',
            },
            typeList: {
                '0': '多多佣金',
                '1': '站点利润'
            }
        }
    },
    computed: {
        ...mapState({
            siteConfig: state => state.user.siteConfig
        }),
        ...mapGetters(['permissions']),
        balanceAmount () {
            try {
                return this.siteConfig.ddkSettledFeeAmt > 0 ? this.siteConfig.ddkSettledFeeAmt / 100 : 0
            } catch (err) {
                return 0
            }
        }
    },
    methods: {
        onDispose (item) {
            this.$refs.dialogDispose.showEdit(item)
        },
        initGetList () {
            this.formData.current = 1
            this.getList()
        },
        onCurrentChange(page) {
            this.formData.current = page
            this.getList()
        },
        onSizeChange(size) {
            this.formData.size = size
            this.getList()
        },
        async getList () {
            const params = {
                ...this.formData
            }
            if (params.createTimeArr) {
                params['startTime'] = `${params.createTimeArr[0]} 00:00:00`
                params['endTime'] = `${params.createTimeArr[1]} 23:59:59`
            }
            this.tableLoading = true
            const { data } = await fetchWithdrawList(params)
            this.tableData = data.data.records
            this.formData.total = data.data.total
            this.tableLoading = false
        },
        // 去提现
        onBalance () {
            if (!this.balanceAmount) return this.$message.warning('暂无可提现佣金!')
            this.$refs.dialogBalance.showEdit(this.balanceAmount)
        },
        async getCountList () {
            const { data } = await fetchCountList()
            this.orderCount = data.data || {}
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.getList()
        this.getCountList()
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>
<style lang="scss" scoped>
.withdrawal-page {
    ::v-deep.el-range-separator {
        width: 10%;
    }
    .balance {
        .title {
            font-size: 16px;
            font-weight: 500;
        }
        .title-row {
            padding: 20px 0;
            text-align: center;
            .title-col {
                border-radius: 5px;
                border: 1px solid #ededed;
                .tip {
                    line-height: 46px;
                    border-bottom: 1px solid #ededed;
                    font-weight: 500;
                }
                .count {
                    padding-top: 0.1px;
                    height: 108px;
                    p {
                        position: relative;
                        display: inline-block;
                        font-size: 34px;
                        color: rgb(70, 180, 109);
                        font-family: Barlow;
                        .balance-btn {
                            position: absolute;
                            top: 12%;
                            right: -90px;
                        }
                    }
                    .freeze {
                        color: red;
                    }
                }
            }
        }
    }
    .record {
        margin-top: -10px;
        .title {
            font-size: 16px;
            font-weight: 500;
        }
        ::v-deep.el-table {
            min-height: 330px;
        }
    }
}
</style>