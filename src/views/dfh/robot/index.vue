<template>
    <div class='robot-page' v-loading="renewalLoading">
        <basic-container>
            <div class="robot-content">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="购买云代发机器人" name="first">
                        <div class="pay-count pt20 pb30">
                            <div class="label mr50 pt10">购买数量：</div>
                            <div class="values">
                                <div class="item">
                                    <el-input-number :controls="false" :step="1" step-strictly :min="1" type="text" class="mr10" style="width: 80px;" v-model="formData.robot"></el-input-number> 个
                                </div>
                                <div class="item ml50">
                                    每日订单量
                                    <el-input-number :controls="false" :step="1" step-strictly :min="1" type="text" class="mx10" style="width: 80px;" v-model="formData.order" @input="onOrderInput"></el-input-number>
                                    单
                                </div>
                                <div class="tip mt20">每个云代发机器人一天可下单的数量在10单内，可输入全部店铺目前的日订单量，预估需要购买的代发机器人数量，<span style="color: red;">自购买机器人起，3天内生效。</span></div>
                                <el-button type="text" size="medium" @click="onExplain">云代发机器人操作说明</el-button>
                            </div>
                        </div>
                        <div class="pay-time py30">
                            <div class="label mr50 pt40">购买时长：</div>
                            <div class="values">
                                <div class="item text-center" :class="{active: balanceType == 3}" @click="balanceType = 3">
                                    <div class="title one-text">3个月</div>
                                    <i class="xiconfont xicon-uf_check"></i>
                                </div>
                                <div class="item text-center mx25" :class="{active: balanceType == 6}" @click="balanceType = 6">
                                    <div class="title one-text">6个月</div>
                                    <i class="xiconfont xicon-uf_check"></i>
                                </div>
                                <div class="item text-center" :class="{active: balanceType == 12}" @click="balanceType = 12">
                                    <div class="title one-text">12个月</div>
                                    <i class="xiconfont xicon-uf_check"></i>
                                </div>
                                <div class="tip mt20 lh22">
                                    <p>1、一个机器人，20元/月，3个月起售。</p>
                                    <p>2、可用天数按自然月计算，不足1个月按1个月计，无论您当月几号购买，到当月最后一天即算为一个月。</p>
                                    <p>3、可用天数=当前月剩余天数+后2个月的时长。</p>
                                    <p style="color: red;">4、机器人购买成功后，无法退款</p>
                                </div>
                            </div>
                        </div>
                        <div class="pay-type py30">
                            <div class="label mr50 pt40">支付方式：</div>
                            <div class="values">
                                <div class="item text-center" :class="{active: payType == 1}" @click="payType = 1">
                                    <div class="title one-text">聚合支付</div>
                                    <i class="xiconfont xicon-uf_check"></i>
                                </div>
                                <!-- <div class="item text-center mx25" :class="{active: payType == 2}" @click="payType = 2">
                                    <div class="title">余额</div>
                                    <div class="desc">当前可用：¥1000.00</div>
                                </div> -->
                                <div class="pay-button pt30 pl100">
                                    <el-button type="primary" size="medium" style="width: 220px;" @click="onPay">立即付款</el-button>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="云代发机器人" name="second">
                        <div class="robot-list">
                            <!-- <div class="count-row p30">
                                <div class="count-col text-center">
                                    <div class="title">100</div>
                                    <div class="desc">代发助手数量</div>
                                </div>
                                <div class="count-col text-center">
                                    <div class="title">¥45.00</div>
                                    <div class="desc">累计节省总金额</div>
                                </div>
                            </div> -->
                            <div class="lists">
                                <div class="event my20">
                                    <el-button type="primary" @click="onMutiBalance">立即续费</el-button>
                                    <el-button @click="loadList">刷新</el-button>
                                </div>
                                <el-table
                                    :data="tableData"
                                    size="medium"
                                    v-loading="tableloading"
                                    @selection-change="handleSelectionChange"
                                    style="width: 100%">
                                    <el-table-column
                                        type="selection"
                                        align="center"
                                        width="55">
                                    </el-table-column>
                                    <!-- <el-table-column
                                        type="index"
                                        label="代发助手编号"
                                        align="center"
                                        width="120">
                                    </el-table-column> -->
                                    <el-table-column
                                        label="代发助手编号"
                                        align="center"
                                        min-width="140">
                                        <template slot-scope="{row}">
                                            <span>{{robotCode(row.robotId)}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="validDay"
                                        label="可用天数"
                                        align="center"
                                        min-width="120">
                                    </el-table-column>
                                    <el-table-column
                                        prop="validTime"
                                        min-width="150"
                                        align="center"
                                        label="到期时间">
                                    </el-table-column>
                                    <!-- <el-table-column
                                        prop="autoRenewSwitch"
                                        min-width="120"
                                        align="center"
                                        label="自动续费状态">
                                        <template slot-scope="{row}">
                                            <el-switch v-model="row.autoRenewSwitch"></el-switch>
                                        </template>
                                    </el-table-column> -->
                                    <el-table-column
                                        prop="countHandleOrder"
                                        min-width="100"
                                        align="center"
                                        label="总下单次数">
                                    </el-table-column>
                                    <el-table-column
                                        prop="todayHandleOrder"
                                        min-width="100"
                                        align="center"
                                        label="当天下单次数">
                                    </el-table-column>
                                    <el-table-column
                                        prop="countReduction"
                                        min-width="120"
                                        align="center"
                                        label="累计节省金额">
                                    </el-table-column>
                                    <el-table-column
                                        prop="isAbnormal"
                                        min-width="150"
                                        align="center"
                                        label="当前状态">
                                        <template slot-scope="{row}">
                                            <span>{{row.isAbnormal == 1 ? '异常' : '正常'}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="isAbnormal"
                                        min-width="100"
                                        align="center"
                                        label="分配状态">
                                        <template slot-scope="{row}">
                                            <el-tag :type="row.bindingStatus == 1 ? 'success' : 'info'">{{row.bindingStatus == 1 ? '已分配' : '未分配'}}</el-tag>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="createTime"
                                        min-width="150"
                                        align="center"
                                        label="购买时间">
                                    </el-table-column>
                                    <!-- <el-table-column
                                        width="180"
                                        align="center"
                                        label="操作">
                                        <template slot-scope="{row}">
                                            <el-button type="text" @click="onBalance([row.id])">续费</el-button>
                                            <el-button type="text" @click="onRecord(row.id)">查看订单明细</el-button>
                                        </template>
                                    </el-table-column> -->
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
                            </div>
                            <div class="pagination pb30 mt30 flex flex-row-reverse" v-if="formData.total > 0">
                                <el-pagination
                                    background
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :current-page.sync="formData.current"
                                    :page-size="formData.size"
                                    :page-sizes="[10, 20, 50, 100, 200]"
                                    :total="formData.total"
                                    @current-change="onCurrentChange"
                                    @size-change="onSizeChange"
                                ></el-pagination>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </basic-container>
        <dialog-pay
            :loading="dialogPayLoading"
            :visible="visibleDialogPay"
            :data="payData"
            @close="dialogPayClose"
        ></dialog-pay>
        <DialogRenewal ref="renewalDialog" @close="dialogPayClose"/>
        <DialogTip ref="explainDialog"/>
    </div>
</template>

<script>

import DialogPay from "@/components/dialog/DialogPay"
import DialogRenewal from './modules/DialogRenewal'
import DialogTip from './modules/DialogTip'
import { fetchList } from '@/api/robot/index'
import { mapState } from 'vuex'
export default {
    components: {
        DialogPay,
        DialogRenewal,
        DialogTip
    },
    data() {
        return {
            activeName: 'first',
            balanceType: 3,
            payType: 1,
            tableData: [],
            multiple: [],
            formData: {
                size: 10,
                current: 1,
                total: 0
            },
            dialogPayLoading: false,
            visibleDialogPay: false,
            payData: {},
            payGoodsOrderStatus: 0,
            payOrderId: null,
            timerID: null,
            tableloading: false,
            renewalLoading: false
        }
    },
    computed: {
        ...mapState({
            robotExplain: state => state.user.robot_explain
        })
    },
    methods: {
        // 使用说明
        onExplain () {
            this.$refs.explainDialog.showModel()
        },
        robotCode (code) {
            const codeRes = code.substr(code.length - 6, 6)
            // var len = code.toString().length 
            // while(len < 6) {
            //     code = "0" + code
            //     len++
            // }
            return 'RCN_00' + codeRes
        },
        // 订单量输入
        onOrderInput (val) {
            if (typeof val === 'number' && val > 0) {
                const result = Math.ceil(val / 10)
                this.formData.robot = result
            }
        },
        // 表格选择
        handleSelectionChange(val) {
            this.multiple = val
        },
        // 查看订单明细
        onRecord (id) {
            this.$router.push('/dfh/robot/record?id=48')
        },
        // 续费
        async onBalance (ids) {
            this.renewalLoading = true
            try {
                const { data } = await this.$API.createPayOrder({
                    goodsType: 10,
                    robotIds: ids.join(','),
                    purchaseTime: 3
                });
                this.payOrderId = data.goods.payOrderId
                this.$refs.renewalDialog.showEdit(data)
                this.startTimer()
            } finally {
                this.renewalLoading = false
            }
        },
        async loadList () {
            this.tableloading = true
            const { data } = await fetchList(this.formData)
            this.tableloading = false
            console.log('data', data)
            this.tableData = data.data.records
            this.formData.total = data.data.total
        },
        // 批量续费
        onMutiBalance () {
            if (!this.multiple.length) return this.$message.warning('请至少勾选一个小助手进行操作')
            const ids = this.multiple.map(item => item.robotId)
            this.onBalance(ids)
        },
        // 购买小助手
        async onPay () {
            if (!this.formData.robot) return this.$message.warning('请先输入购买云代发机器人数量')
            this.visibleDialogPay = true
            this.dialogPayLoading = true
            try {
                const { data } = await this.$API.createPayOrder({
                    goodsType: 9,
                    number: this.formData.robot,
                    purchaseTime: this.balanceType
                });
                this.payData = data
                this.payOrderId = data.goods.payOrderId
                this.startTimer()
            } finally {
                this.dialogPayLoading = false;
            }
        },
        /**
         * 定时器 支付状态轮询
         */
        startTimer() {
            clearInterval(this.timerID);
            this.timerID = setInterval(() => {
                // 订单生成(0),支付成功(1)
                switch (this.payGoodsOrderStatus) {
                    case 0:
                        this.getPayOrderStatus();
                        break;
                    case 1:
                        this.$message.success('支付成功！')
                        this.visibleDialogPay = false
                        this.$refs.renewalDialog.onClose()
                        this.resetTimerAndOrderStatus()
                        this.formData = {}
                        this.loadList()
                        break;
                    case -1:
                        this.$message.error('支付失败，请刷新页面重试');
                        this.resetTimerAndOrderStatus();
                        break;
                    default:
                        break;
                }
            }, 2000);
        },
        /**
         * 获取 支付订单状态
         */
        async getPayOrderStatus() {
            const { payOrderId } = this;
            const { data } = await this.$API.getPayOrderStatus(payOrderId);
            this.payGoodsOrderStatus = +data.data.status;
            if (this.payGoodsOrderStatus === 1) this.$store.dispatch('GetMy');
        },
        /**
        * 重置定时器以及相关状态
        */
        resetTimerAndOrderStatus() {
            clearInterval(this.timerID);
            this.payGoodsOrderStatus = 0;
        },
        /**
        * 关闭 支付弹窗，销毁定时器
        */
        dialogPayClose() {
            this.visibleDialogPay = false;
            this.resetTimerAndOrderStatus();
        },
        /**
         * current 改变时会触发
         */
        onCurrentChange(page) {
            this.formData.current = page;
            this.loadList();
        },
        /**
         * pageSize 改变时会触发
         */
        onSizeChange(size) {
            this.formData.size = size;
            this.loadList();
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        if (!this.robotExplain) {
            this.$refs.explainDialog.showModel('timer')
            this.$store.commit('SET_ROBOT_EXPLAIN', 1)
        }
        this.loadList()
    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>

<style lang="scss" scoped>
.robot-page {
    .robot-content {
        .pay-count {
            padding-left: 15%;
            display: flex;
            border-bottom: 1px solid #ededed;
            .values {
                .item {
                    display: inline-block;
                }
                .tip {
                    color: #666;
                    font-size: 13px;
                }
            }
        }
        .pay-time, .pay-type {
            padding-left: 15%;
            display: flex;
            border-bottom: 1px solid #ededed;
            .values {
                .item {
                    display: inline-block;
                    width: 193px;
                    border-radius: 5px;
                    border: 1px solid #ededed;
                    cursor: pointer;
                    padding: 25px 50px;
                    position: relative;
                    .title {
                        color: #333;
                        font-size: 16px;
                        font-weight: 500;
                    }
                    .desc {
                        color: #666;
                        font-size: 13px;
                        margin-top: 10px;
                    }
                    .xiconfont {
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        font-size: 18px;
                        color: rgb(70, 180, 109);
                        display: none;
                    }
                }
                .one-text {
                    padding-top: 23px;
                    transform: translateY(-12px);
                }
                .item:hover {
                    border-color: $themeColor;
                }
                .item.active {
                    border-color: $themeColor;
                    .xiconfont {
                        display: block;
                    }
                }
                .tip {
                    color: #666;
                    font-size: 13px;
                }
            }
        }
        .pay-type {
            border: 0;
            .values {
                .item {
                    width: 193px;
                    height: 91px;
                    padding: 0;
                    padding-top: 25px;
                    box-sizing: border-box;
                }
                .one-text {
                    padding-top: 23px;
                    transform: translateY(-12px);
                }
            }
        }
        .robot-list {
            .count-row {
                box-sizing: border-box;
                border-radius: 5px;
                background-color: #ededed;
                border: 1px solid #ccc;
                .count-col {
                    display: inline-block;
                    color: #333;
                    padding: 0 30px;
                    .title {
                        font-size: 28px;
                        font-weight: 500;
                        margin-bottom: 15px;
                    }
                }
            }
            ::v-deep.el-table {
                min-height: 400px;
            }
        }
    }
}
</style>
