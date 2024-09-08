<template>
    <div class="shop-dialog-pay-components">
        <el-dialog-custom width="650px" :visible="visible_" @close="onClose">
            <div class="my-dialog-content">
                <div class="my-dialog-title">
                    <span>续费店铺扫码支付</span>
                    <i class="el-icon-close" @click.stop="onClose"></i>
                </div>
                <div class="my-dialog-main flex flex-col">
                    <div class="top">
                        <div class="flex justify-between cell mb20">
                            <span>开通账户：</span>
                            <span class="username" v-if="my">{{ my.username }}</span>
                        </div>
                        <div class="cell">
                            <span>续费店铺期限：</span>
                            <div class="tabs flex justify-between mt20">
                                <div
                                    :class="`tabs-item ${active === 0 && 'active'}`"
                                    @click.stop="onClickTabs(0)"
                                >
                                    <div class="lbox">
                                        <span>一个月</span>
                                    </div>
                                    <div class="rbox flex-1 ml17">
                                        <p class="price">
                                            <span>¥ 56</span>
                                        </p>
                                        <p class="date mt5">
                                            <span>1个店铺</span>
                                        </p>
                                    </div>
                                </div>
                                <div
                                    :class="`tabs-item ${active === 1 && 'active'}`"
                                    @click.stop="onClickTabs(1)"
                                >
                                    <div class="lbox">
                                        <span>半年</span>
                                    </div>
                                    <div class="rbox flex-1 ml17">
                                        <p class="price">
                                            <span>¥ 336</span>
                                        </p>
                                        <p class="date mt5">
                                            <span>1个店铺</span>
                                        </p>
                                    </div>
                                </div>
                                <div
                                    :class="`tabs-item ${active === 2 && 'active'}`"
                                    @click.stop="onClickTabs(2)"
                                >
                                    <div class="lbox">
                                        <span>一年</span>
                                    </div>
                                    <div class="rbox flex-1 ml17">
                                        <p class="price">
                                            <span>¥ 672</span>
                                        </p>
                                        <p class="date mt5">
                                            <span>1个店铺</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="cell mt20">
                            <span>店铺到期时间：{{ renewalShopPayData.expireTime }}</span>
                        </div>
                    </div>
                    <div class="bottom flex-1">
                        <p>
                            <span class="font-w-600">应付金额：</span>
                            <span class="amount">{{ amount }}</span>
                        </p>
                        <div class="code">
                            <div class="qr-code">
                                <template v-if="url">
                                    <qrcode :value="url" :options="options" />
                                    <div class="line"></div>
                                </template>
                            </div>
                            <div class="flex items-center mt12">
                                <div class="alipay flex items-center">
                                    <i class="iconfont icon-zhifubaozhifu"></i>
                                    <span>支付宝支付</span>
                                </div>
                                <span class="as">或</span>
                                <div class="wechat flex items-center">
                                    <i class="iconfont icon-weixinzhifu"></i>
                                    <span>微信支付</span>
                                </div>
                            </div>
                        </div>
                        <div class="bg"></div>
                    </div>
                </div>
            </div>
        </el-dialog-custom>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VueQrcode from "@chenfengyuan/vue-qrcode";
import ElDialogCustom from '@/components/base/ElDialogCustom';
import { debounce } from '@/scripts/utils/index';

export default {
    components: {
        ElDialogCustom,
        qrcode: VueQrcode,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        renewalShopPayData:{
            shopId: '',
            expireTime: ''
        }
    },
    data() {
        return {
            active: 0,
            validity: '',
            show: true,
            number: '',
            payOrderId: '',
            payGoodsOrderStatus: 0,
            timerID: null,
            url: '',
            options: {
                height: 144,
                width: 144,
            },
        };
    },
    computed: {
        ...mapGetters([
            'my',
        ]),
        visible_: {
            get() {
                return this.visible;
            },
            set(newVal) {
                return this.$emit('close');
            },
        },
        amount() {
            if (this.active === null) return Math.floor(56 * +this.number);
            return [56, 336, 672][this.active];
        },
        inpNum: {
            get: function () {
                return this.number;

            },
            set: function (newValue) {
                this.number = newValue.replace(/[^\d]/g, '');
            }
        }
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                this.getPayOrder();
            }
        }
    },
    mounted() {
        this.validity = this.$moment().add(30, 'days').format('YYYY-MM-DD HH:mm');
    },
    methods: {
        onClose() {
            this.visible_ = false;
            this.resetTimerAndOrderStatus();
        },
        async onClickTabs(index) {
            if (this.active !== index) {
                this.active = index;
                this.number = '';
                this.show = true;
                await this.resetTimerAndOrderStatus();
                this.getPayOrder();
            }
        },
        onClickCustom() {
            this.show = !this.show;
            if (!this.show) {
                this.active = null;
                this.number = '1';
                this.resetTimerAndOrderStatus();
                this.getPayOrder();
            } else if (this.show) {
                this.active = 0;
                this.number = '';
            }
        },
        /**
         * 生成支付订单
         */
        async getPayOrder() {
            try {
                const { data } = await this.$API.createPayOrder({
                    goodsType: '7',
                    number: this.active === null ? this.number : [1, 6, 12][this.active],
                    shopId: this.renewalShopPayData.shopId
                });
                this.url = data.params;
                this.payOrderId = data.goods.payOrderId;
                this.startTimer();

            } catch (error) {

            }
        },
        /**
         * 查询支付订单的支付状态
         */
        async getPayOrderStatus() {
            try {
                const { data: { data } } = await this.$API.getPayOrderStatus(this.payOrderId);
                this.payGoodsOrderStatus = +data.status;
            } catch (error) {

            }
        },
        /**
         * 定时器 支付状态轮询
         */
        startTimer() {
            clearInterval(this.timerID);
            let i = 0;
            this.timerID = setInterval(() => {
                // 订单生成(0),支付成功(1)
                switch (this.payGoodsOrderStatus) {
                    case 0:
                        this.getPayOrderStatus();
                        break;
                    case 1:
                        this.payGoodsOrderStatus = 1;
                        this.$message.success('支付成功');
                        this.onClose();
                        this.$emit('success');
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
         * 重置定时器以及相关状态
         */
        resetTimerAndOrderStatus() {
            clearInterval(this.timerID);
            this.payGoodsOrderStatus = 0;
        },
        /**
         * 自定义购买店铺数量
         */
        onInput() {
            this.number = this.number.replace(/[^\d]/g, '');
            this.initData();

        },
        initData: debounce(function () {
            this.resetTimerAndOrderStatus();
            this.getPayOrder();
        }),
    },
};
</script>

<style lang="scss" scoped>
.shop-dialog-pay-components {
    .my-dialog-content {
        .my-dialog-title {
            width: 100%;
            height: 54px;
            line-height: 54px;
            background: #4faaff;
            border-radius: 10px 10px 0px 0px;
            font-size: 16px;
            color: #ffffff;
            padding: 0 34px;
            box-sizing: border-box;
            position: relative;

            .el-icon-close {
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 22px;
                cursor: pointer;
            }
        }
        .my-dialog-main {
            width: 100%;
            height: 580px;
            color: #666666;
            background: #fff;
            .top {
                height: 240px;
                border-bottom: 1px solid #dedede;
                box-sizing: border-box;
                padding: 30px;
                font-size: 16px;
                .username {
                    color: #4faaff;
                    font-weight: 600;
                }
                .tabs {
                    .tabs-item {
                        width: 148px;
                        height: 59px;
                        background: #eef0f4;
                        border-radius: 2px;
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        user-select: none;
                        border: 2px solid #eef0f4;
                        box-sizing: border-box;

                        &.active {
                            border-color: #85bcfc;
                            position: relative;
                            overflow: hidden;
                            &::after {
                                content: "";
                                position: absolute;
                                width: 36px;
                                height: 37px;
                                bottom: -13px;
                                right: -13px;
                                background: url("/img/common/check.png")
                                    no-repeat;
                                background-size: cover;
                            }
                        }

                        .lbox {
                            color: #4f4f50;
                            font-weight: 600;
                            font-size: 14px;
                            padding-left: 16px;
                            box-sizing: border-box;
                        }
                        .rbox {
                            .price {
                                color: #f64041;
                                font-size: 18px;
                            }
                            .date {
                                font-size: 12px;
                                color: #a0a1a3;
                            }
                        }
                    }
                }

                .custom-btn {
                    width: 78px;
                    height: 23px;
                    background: #1890ff;
                    border-radius: 2px;
                    font-size: 12px;
                    color: #fff;
                }

                .input-box {
                    width: 120px;
                    height: 30px;
                    border-radius: 4px;
                    border: 1px solid #979797;
                    box-sizing: border-box;
                    padding: 0 10px;

                    &.disabled {
                        background: #eef0f4;
                        cursor: not-allowed;
                    }
                }
            }
            .bottom {
                padding: 30px;
                box-sizing: border-box;
                font-size: 18px;
                position: relative;

                .amount {
                    font-size: 30px;
                    font-weight: 600;
                    color: #fe3f40;
                    position: relative;
                    margin-left: 10px;

                    &::before {
                        content: "¥ ";
                        color: #fe3f40;
                        font-size: 18px;
                    }
                }

                .code {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .qr-code {
                        width: 146px;
                        height: 146px;
                        border: 1px solid #dedede;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;

                        .line {
                            pointer-events: none;
                            position: absolute;
                            width: 100%;
                            height: 39px;
                            background: url("/img/common/line.png") no-repeat;
                            animation: QRcode 1.2s infinite alternate;
                            -webkit-animation: QRcode 1.2s infinite alternate;
                            top: 0;
                            left: 0px;
                            z-index: 9;
                        }

                        @keyframes QRcode {
                            to {
                                top: 0px;
                            }
                            from {
                                top: 100px;
                            }
                        }
                    }
                    .alipay {
                        > i {
                            font-size: 28px;
                            color: #00a7ef;
                            transform: translateY(-2px);
                        }
                        > span {
                            font-size: 14px;
                            color: #00a7ef;
                        }
                    }
                    .as {
                        font-size: 14px;
                        color: #666666;
                        margin: 0 12px;
                    }
                    .wechat {
                        > i {
                            font-size: 28px;
                            color: #09bb07;
                            transform: translateY(-2px);
                        }
                        > span {
                            font-size: 14px;
                            color: #09bb07;
                        }
                    }
                }

                .bg {
                    width: 130px;
                    height: 169px;
                    position: absolute;
                    right: 36px;
                    bottom: 0;
                    background: url("/img/common/pay.png") no-repeat;
                    background-size: cover;
                }
            }
        }
    }
}
</style>
