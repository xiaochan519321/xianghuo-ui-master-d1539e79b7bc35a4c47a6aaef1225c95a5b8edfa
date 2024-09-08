<template>
    <div class="order-muti-pay-dialog">
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            title="订单信息"
            width="300px"
            class="robot-dialog">
            <div class="order-pay-content" v-loading="loading">
                <div class="flex mb15">
                    <div class="flex-1 col-g font-w-500">已选订单</div>
                    <div class="text-right">{{orderInfo.orderNum || 1}}单</div>
                </div>
                <div class="flex mb15">
                    <div class="flex-1 col-g font-w-500">订单金额</div>
                    <div class="text-right">¥ {{orderInfo.pddMoney || 0}}</div>
                </div>
                <div class="flex mb15">
                    <div class="flex-1 col-g font-w-500">优惠金额</div>
                    <div class="text-right">- {{orderInfo.promotion_money || 0}}</div>
                </div>
                <div class="flex mb15">
                    <div class="flex-1 col-g font-w-500">运费总计</div>
                    <div class="text-right">¥ {{orderInfo.platform_freight || 0}}</div>
                </div>
                <div class="flex mb15">
                    <div class="flex-1 col-g font-w-500">合计</div>
                    <div class="text-right color-red">¥ {{orderInfo.totalAmount || 0}}</div>
                </div>
                <!-- <div class="count" v-if="payData.goods">应付金额：<span>¥{{payData.goods.amount / 100}}</span></div> -->
                <div class="pt10">扫码支付</div>
                <div class="img-box text-center" v-if="payData.params">
                    <qrcode :value="payData.params" :options="options" />
                </div>
                <el-empty v-else description="获取支付二维码失败，请刷新重试" :image-size="150"></el-empty>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { get1688OrderDetails } from '@/api/dfh/order'
export default {
    components: {
        qrcode: VueQrcode
    },
    data() {
        return {
            dialogVisible: false,
            loading: false,
            count: 0,
            options: {
                height: 220,
                width: 220,
            },
            payData: {},
            timerID: null,
            payGoodsOrderStatus: 0,
            orderInfo: {}
        }
    },
    watch: {
        dialogVisible (val, oldVal) {
            if (!val) {
                this.$emit('close')
                this.resetTimerAndOrderStatus()
            }
        },
    },
    computed: {},
    methods: {
        onClose () {
            this.dialogVisible = false
        },
        showModel (ids) {
            this.dialogVisible = true
            this.onBalance(ids)
        },
        // 供应链订单支付
        async onBalance (ids) {
            this.loading = true
            const params = {
                orderIds: ids
            }
            const arr = [
                this.$API.create1688PayOrder({...params, goodsType: 11, purchaseTime: 3}),
                get1688OrderDetails(params)
            ]
            await Promise.all(arr).then(res => {
                // 支付信息
                if (res[0]) {
                    const { data } = res[0]
                    this.payData = data
                    this.startTimer()
                }
                // 批量订单详情
                if (res[1]) {
                    const { data } = res[1].data
                    this.orderInfo = data
                }
            }).catch(err => {
                console.log('err,', err)
                this.loading = false
            })
            this.loading = false
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
                        this.$emit('success')
                        this.dialogVisible = false
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
            const { payOrderId } = this.payData.goods;
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
        }

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
}
</script>
<style lang="scss">
.order-muti-pay-dialog {
    .robot-dialog {
        .el-dialog {
            border-radius: 10px;
            .el-dialog__header {
                padding: 15px 20px 15px;
                border-bottom: 1px solid #ededed;
                .el-dialog__title {
                    font-size: 15px;
                    font-weight: 500;
                }
            }
            .el-dialog__body {
                position: relative;
                padding: 20px 30px;
                font-size: 14px;
                color: #333;
                .order-pay-content {
                    .el-loading-mask {
                        position: absolute;
                    }
                }
            }
        }
    }
}
</style>