<template>
    <div class='private-page'>
        <basic-container>
            <div class="private-content">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="好评返现" name="first">
                        <div class="private-list">
                            <el-form inline :model="formData" ref="form" class="ddk-form">
                                <el-form-item label="抖店订单编号" prop="orderId" style="margin-right: 20px;">
                                    <el-input type="text" placeholder="请输入抖店订单号" v-model="formData.orderId" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="采购订单编号" prop="pddOrderId" style="margin-right: 20px;">
                                    <el-input type="text" placeholder="请输入采购订单编号" v-model="formData.pddOrderId" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="抖店商品ID" prop="productId" style="margin-right: 20px;">
                                    <el-input type="text" placeholder="请输入抖店商品ID" v-model="formData.productId" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="是否返现" prop="isCashback" style="margin-right: 20px;">
                                    <el-select
                                        @change="initGetList"
                                        v-model="formData.isCashback"
                                        placeholder="请选择是否已返现"
                                        style="width: 160px"
                                        clearable
                                    >
                                        <el-option label="全部" :value="''"></el-option>
                                        <el-option label="是" :value="1"></el-option>
                                        <el-option label="否" :value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="返现时间" prop="createTimeArr" style="margin-right: 20px;">
                                    <el-date-picker
                                        v-model="formData.createTimeArr"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :picker-options="pickerOptions"
                                        style="width: 230px;"
                                        value-format="yyyy-MM-dd"
                                    ></el-date-picker>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click.stop="loadList">
                                        <span>搜索</span>
                                    </el-button>
                                    <el-button @click.stop="resetForm('form')">
                                        <span>清空</span>
                                    </el-button>
                                </el-form-item>
                            </el-form>
                            <el-table
                                :data="tableData"
                                size="medium"
                                v-loading="tableloading"
                                style="width: 100%">
                                <el-table-column
                                    type="index"
                                    align="center"
                                    label="序号"
                                    width="55">
                                </el-table-column>
                                <el-table-column
                                    prop="orderId"
                                    label="抖店订单ID"
                                    align="center"
                                    min-width="180">
                                </el-table-column>
                                <el-table-column
                                    prop="productId"
                                    label="抖店商品ID"
                                    align="center"
                                    min-width="180">
                                </el-table-column>
                                <el-table-column
                                    prop="pddOrderId"
                                    label="采购订单ID"
                                    align="center"
                                    min-width="190">
                                </el-table-column>
                                <el-table-column
                                    prop="praiseTime"
                                    label="评论时间"
                                    align="center"
                                    min-width="150">
                                </el-table-column>
                                <el-table-column
                                    prop="positiveCommentsImg"
                                    label="好评截图"
                                    align="center"
                                    min-width="120">
                                    <template slot-scope="{row}">
                                        <el-image 
                                            v-if="row.screenshotJson"
                                            fit="cover"
                                            style="width: 64px; height: 64px; border-radius: 5px;"
                                            :src="row.screenshotJson"
                                            :preview-src-list="[row.screenshotJson]">
                                        </el-image>
                                        <div v-else>-</div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="handlingStatus"
                                    label="当前状态"
                                    align="center"
                                    min-width="130">
                                    <template slot-scope="{row}">
                                        <span>{{statusOpt[row.handlingStatus]}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="positiveCommentsJson"
                                    label="处理结果"
                                    align="center"
                                    min-width="200">
                                    <template slot-scope="{row}">
                                        <div>{{row.errorMsg || '-'}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="status"
                                    label="是否返现"
                                    min-width="100"
                                    align="center">
                                    <template slot-scope="{row}">
                                        <span>{{row.handlingStatus == 3 ? '是' : '否'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="cashbackTime"
                                    label="返现时间"
                                    align="center"
                                    min-width="150">
                                </el-table-column>
                                <el-table-column
                                    prop="cashbackAmount"
                                    label="返现金额"
                                    align="center"
                                    min-width="150">
                                    <template slot-scope="{row}">
                                        <span v-if="row.cashbackAmount && row.cashbackAmount > 0">{{((row.cashbackAmount || 0) / 100).toFixed(2)}}</span>
                                        <span v-else>-</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="integralCut"
                                    label="扣除积分"
                                    align="center"
                                    min-width="100">
                                </el-table-column>
                                <template slot="empty">
                                    <div class="empty my30">
                                        <el-empty
                                            description="暂时没有找到任何记录"
                                            :image-size="100"
                                            v-if="!tableData.length"
                                        ></el-empty>
                                    </div>
                                </template>
                            </el-table>
                            <div class="pagination pb30 mt30 flex flex-row-reverse" v-if="formData.total > 0">
                                <el-pagination
                                    background
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :current-page.sync="formData.current"
                                    :page-size="formData.size"
                                    :page-sizes="[20, 50, 100]"
                                    :total="formData.total"
                                    @current-change="onCurrentChange"
                                    @size-change="onSizeChange"
                                ></el-pagination>
                            </div>
                        </div>
                    </el-tab-pane>
                    <!-- <el-tab-pane label="领取优惠券" name="second">
                        <div class="token-list">
                            <el-form inline :model="tokenFormData" ref="tokenform" class="ddk-form">
                                <el-form-item label="PDD账号" prop="mobile">
                                    <el-input type="text" placeholder="请输入PDD账号" v-model="tokenFormData.mobile"></el-input>
                                </el-form-item>
                                <el-form-item label="账号状态" prop="status">
                                    <el-select
                                        @change="initGetList"
                                        v-model="tokenFormData.status"
                                        placeholder="请选择PDD账号状态"
                                        style="width: 160px"
                                        clearable
                                    >
                                        <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="创建时间" prop="createTimeArr">
                                    <el-date-picker
                                        v-model="tokenFormData.createTimeArr"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :picker-options="pickerOptions"
                                        style="width: 230px;"
                                        value-format="yyyy-MM-dd"
                                    ></el-date-picker>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click.stop="loadTokenList">
                                        <span>搜索</span>
                                    </el-button>
                                    <el-button @click.stop="resetForm('tokenform')">
                                        <span>清空</span>
                                    </el-button>
                                </el-form-item>
                                <div class="account-add mt10" style="float: right;">
                                    <span class="mr10">账号数量：{{tokenFormData.total || 0}}</span>
                                </div>
                                <div class="event-btn">
                                    <el-button type="primary" @click.stop="onTokenAdd">
                                        <span>添加Token号</span>
                                    </el-button>
                                    <el-dropdown class="ml10" @command="onBatchHandle">
                                        <el-button size="small">
                                            <span>批量操作</span>
                                            <i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item command="open">批量启动</el-dropdown-item>
                                            <el-dropdown-item command="close">批量禁用</el-dropdown-item>
                                            <el-dropdown-item command="setting">批量设置下单量</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </el-form>
                            <el-table
                                :data="tableTokenData"
                                size="medium"
                                v-loading="tableloading"
                                style="width: 100%">
                                <el-table-column
                                    type="selection"
                                    align="center"
                                    width="55">
                                </el-table-column>
                                <el-table-column
                                    prop="mobile"
                                    label="账号"
                                    align="center"
                                    min-width="120">
                                    <template slot-scope="{row}">
                                        <span>{{row.mobile || row.uid}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="token"
                                    label="Token"
                                    align="center"
                                    min-width="200">
                                </el-table-column>
                                <el-table-column
                                    prop="status"
                                    min-width="100"
                                    align="center">
                                    <template slot="header">
                                        <span>
                                            状态
                                            <el-tooltip class="item" effect="dark" placement="bottom">
                                                <div slot="content">在线为正常可进行拍单的账号<br/>离线为当前帐号已经掉线或异常，需重新上线</div>
                                                <i class="el-icon-question font16"></i>
                                            </el-tooltip>
                                        </span>
                                    </template>
                                    <template slot-scope="{row}">
                                        <span>{{statusOpt[row.status]}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="totalUseCount"
                                    min-width="120"
                                    sortable
                                    align="center"
                                    label="累计下单量">
                                </el-table-column>
                                <el-table-column
                                    prop="todayUseCount"
                                    min-width="120"
                                    sortable
                                    align="center"
                                    label="今日下单量">
                                </el-table-column>
                                <el-table-column
                                    prop="maxCount"
                                    min-width="140"
                                    align="center">
                                    <template slot="header">
                                        <span>
                                            账号最大下单量
                                            <el-tooltip class="item" effect="dark" placement="bottom">
                                                <div slot="content">代表帐号总共最多下单量，可根据设定下单数量进行调整</div>
                                                <i class="el-icon-question font16"></i>
                                            </el-tooltip>
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="pddAuditCount"
                                    min-width="120"
                                    align="center"
                                    label="今日风控订单">
                                </el-table-column>
                                <el-table-column
                                    prop="isAbnormal"
                                    min-width="100"
                                    align="center"
                                    label="是否可用">
                                    <template slot-scope="{row}">
                                        <el-switch
                                            v-model="row.disable"
                                            @change="onDisableChange($event, row)"
                                            :active-value="0"
                                            :inactive-value="1"
                                            active-color="rgb(70, 180, 109)">
                                        </el-switch>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="created"
                                    min-width="150"
                                    sortable
                                    align="center"
                                    label="首次创建时间">
                                </el-table-column>
                                <el-table-column
                                    fixed="right"
                                    label="操作"
                                    align="center"
                                    width="180">
                                    <template slot-scope="{row, $index}">
                                        <el-button type="text" :loading="row.getLoading" :disabled="row.getLoading" @click="onGetAccountStatus(row, $index)">检测状态</el-button>
                                        <el-button type="text" @click="onItemDel(row)">删除</el-button>
                                    </template>
                                </el-table-column>
                                <template slot="empty">
                                    <div class="empty my30">
                                        <el-empty
                                            description="暂时没有找到任何记录"
                                            :image-size="100"
                                            v-if="!tableTokenData.length"
                                        ></el-empty>
                                    </div>
                                </template>
                            </el-table>
                            <div class="pagination pb30 mt30 flex flex-row-reverse" v-if="tokenFormData.total > 0">
                                <el-pagination
                                    background
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :current-page.sync="tokenFormData.current"
                                    :page-size="tokenFormData.size"
                                    :page-sizes="[50, 100, 200]"
                                    :total="tokenFormData.total"
                                    @current-change="onCurrentChange"
                                    @size-change="onSizeChange"
                                ></el-pagination>
                            </div>
                        </div>
                    </el-tab-pane> -->
                </el-tabs>
            </div>
        </basic-container>
    </div>
</template>

<script>

import { fetchList } from '@/api/dfh/make'
export default {
    components: {
    },
    watch: {
        activeName (val, oldVal) {
        }
    },
    data() {
        return {
            tableData: [],
            formData: {
                type: 1,
                size: 20,
                current: 1,
                total: 0,
                createTimeArr: [],
                orderId: null,
                pddOrderId: null,
                productId: null
            },
            statusOpt: {
                0: '-',
                1: '已评论',
                2: '发送聊天',
                3: '已返现',
                4: '已失败',
                5: '-',
                6: '系统评论',
                7: '返现被拦截'
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
            },
            tokenFormData: {
                type: 2,
                size: 50,
                current: 1,
                total: 0,
                status: undefined,
                mobile: undefined,
                createTimeArr: []
            },
            tableTokenData: [],
            tableloading: false,
            activeName: 'first'
        }
    },
    computed: {
    },
    methods: {
        initGetList () {
            if (this.activeName === 'second') {
                this.tokenFormData.current = 1
            } else {
                this.formData.current = 1
            }
            this.loadList()
        },
        async loadList () {
            const params = {
                ...this.formData
            }
            if (this.formData.createTimeArr && this.formData.createTimeArr.length) {
                params['cashbackTimeStart'] = `${this.formData.createTimeArr[0]} 00:00:00`
                params['cashbackTimeEnd'] = `${this.formData.createTimeArr[1]} 23:59:59`
            }
            this.tableloading = true
            const { data } = await fetchList(params)
            this.tableloading = false
            this.tableData = (data.data.records || []).map(item => {
                return {
                    ...item,
                    positiveCommentsJson: JSON.parse(item.positiveCommentsJson)
                }
            })
            this.formData.total = data.data.total
            console.log('data', this.tableData)
        },
        onItemDel (row) {
            const { activeName } = this
            this.$confirm(`删除${activeName === 'second' ? 'token号' : '个人号'}后将无法继续使用该号进行拍单!`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data } = await deletePddAccount({id: row.id})
                this.$message.success('删除成功')
                if (activeName === 'second') {
                    this.loadTokenList()
                } else {
                    this.loadList()
                }
            }).catch(() => {   
            });
        },
        onItemLogin (row) {
            this.$refs.loginDialog.showModel(row.mobile)
        },
        /**
         * current 改变时会触发
         */
        onCurrentChange(page) {
            if (this.activeName === 'second') {
                // token模式
                this.tokenFormData.current = page;
                this.loadTokenList();
            } else {
                this.formData.current = page;
                this.loadList();
            }
        },
        /**
         * pageSize 改变时会触发
         */
        onSizeChange(size) {
            if (this.activeName === 'second') {
                // token模式
                this.tokenFormData.size = size;
                this.loadTokenList();
            } else {
                this.formData.size = size;
                this.loadList();
            }
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
            this.initGetList()
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.loadList()
    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>

<style lang="scss" scoped>
.private-page {
    .private-content {
        ::v-deep .el-form-item {
            .el-range-separator {
                width: 10%;
            }
        }
        ::v-deep.el-table {
            min-height: 400px;
        }
    }
}
</style>
