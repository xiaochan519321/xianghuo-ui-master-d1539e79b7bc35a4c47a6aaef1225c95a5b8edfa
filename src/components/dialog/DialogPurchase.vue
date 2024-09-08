<template>
    <div class="purchase-dialog-content">
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="300px"
            class="purchase-dialog">
            <i class="close-dialog el-icon-error" @click="onClose" v-if="dialogVisible"></i>
            <div class="purchase-bg">
                <el-tooltip content="Bottom center" placement="bottom" effect="light">
                    <div slot="content">
                        <p>1.今日内已支付/包括之前的今日支付领取的优惠总额</p>
                        <p class="my5">2.重补后没有支付的不计算在内</p>
                        <p>3.退款的订单领劵金额不计算在内</p>
                    </div>
                    <span class="tip-item">说明</span>
                </el-tooltip>
                <div class="header">
                    <div class="icon" v-if="loading"><i class="el-icon-loading"></i></div>
                    <div class="count" v-else>{{count > 0 ? count.toFixed(1) : 0}}</div>
                    <div class="tip">- 今日预估已领取优惠券 - </div>
                </div>
                <div class="main">
                    <div class="tip">可将订单利润提升至</div>
                    <div class="count">50%</div>
                </div>
                <div class="footer">
                    <div class="btn-l" @click="dialogVisible = false">我知道了</div>
                    <div class="btn-r" @click="$router.push('/dfh/order/index'); dialogVisible = false">立即代发</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { fetchCount } from '@/api/report/purchase/data'
export default {
    components: {
    },
    data() {
        return {
            dialogVisible: false,
            loading: false,
            count: 0
        }
    },
    computed: {},
    methods: {
        onClose () {
            this.dialogVisible = false
        },
        showEdit () {
            this.dialogVisible = true
        },
        async loadPurchase () {
            this.loading = true
            const { data } = await fetchCount()
            this.count = data.data || 0
            this.loading = false
        }

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.$bus.$on('purchase-dialog', () => {
            this.dialogVisible = true
            this.loadPurchase()
        })
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {
        this.$bus.$off('purchase-dialog')
    },
}
</script>
<style lang="scss">
.purchase-dialog-content {
    .purchase-dialog {
        .el-dialog {
            background: none;
            box-shadow: none;
            .el-dialog__header {
                display: none;
            }
            .el-dialog__body {
                padding: 0;
                position: relative;
                .close-dialog {
                    position: absolute;
                    right: -20px;
                    top: -20px;
                    color: #fff;
                    font-size: 24px !important;
                    cursor: pointer;
                    z-index: 20091;
                }
                .purchase-bg {
                    width: 300px;
                    height: 375px;
                    position: relative;
                    background: url('/img/bg_purchase.png') no-repeat;
                    background-size: contain;
                    text-align: center;
                    .tip-item {
                        position: absolute;
                        right: 32px;
                        font-size: 12px;
                        color: #a6cefd;
                        top: 38px;
                    }
                    .header {
                        position: absolute;
                        left: 0;
                        right: 22px;
                        top: 105px;
                        color: #e78d6a;
                        .icon {
                            font-size: 28px;
                            margin-bottom: 26px;
                        }
                        .count {
                            font-size: 40px;
                            font-family: Barlow;
                        }
                        .tip {
                            font-size: 12px;
                            margin-top: 15px;
                        }
                    }
                    .main {
                        position: absolute;
                        left: 0;
                        right: 22px;
                        top: 220px;
                        color: #a6cefd;
                        .tip {
                            font-size: 16px;
                        }
                        .count {
                            color: #e7caa1;
                            font-size: 22px;
                            margin-top: 10px;;
                            font-family: Barlow;
                        }
                    }
                    .footer {
                        position: absolute;
                        left: 0;
                        right: 22px;
                        bottom: 44px;
                        .btn-l {
                            position: absolute;
                            left: 48px;
                            color: #8b8889;
                            font-weight: 600;
                            cursor: pointer;
                        }
                        .btn-r {
                            position: absolute;
                            right: 45px;
                            color: #224bb9;
                            font-weight: 600;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
}
</style>