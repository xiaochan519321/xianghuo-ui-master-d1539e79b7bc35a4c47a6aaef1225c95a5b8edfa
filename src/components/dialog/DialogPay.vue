<template>
    <div class="container">
        <el-dialog :visible.sync="visible_" width="530px" :show-close="false">
            <div
                class="body-wrap"
                v-loading="loading"
                element-loading-text="加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
            >
                <div class="title" slot="title">
                    <i class="iconfont icon-close2" @click="handleClose"></i>
                </div>
                <div class="centent">
                    <div class="text-center price mb20" v-if="tenantId == 1">请核实站点</div>
                    <div class="img-box">
                        <qrcode :value="data.params" :options="options" />
                    </div>
                    <div class="price-box">
                        <span class="font18">应付金额：</span>
                        <span v-if="data.goods" class="price">{{data.goods.amount /100}}</span>
                        <span class="font18">元</span>
                    </div>
                    <div class="pay-box flex items-center mt10">
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
                    <div class="tips">
                        <span class="highlight">请扫码充值哦</span>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { getStore } from '@/util/store'

export default {
    components: {
        qrcode: VueQrcode,
    },
    props: {
        data: {
            type: Object,
            default: () => { },
        },
        visible: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            form: {
                price: null,
            },
            options: {
                height: 180,
                width: 180,
            },
            tenantId: 0
        };
    },
    computed: {
        visible_: {
            get() {
                return this.visible;
            },
            set(newVal) {
                return this.$emit('close');
            }
        }
    },
    created() {

    },
    mounted() {
        this.tenantId = getStore({name: 'tenantId'})
    },
    methods: {
        handleClose() {
            this.$emit('close');
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    &::v-deep .el-dialog {
        height: 536px;
        background: #2e2727;
        border-radius: 8px;
    }
    &::v-deep .el-dialog__header {
        padding: 0;
    }
    &::v-deep .el-dialog__body {
        padding: 0;
        height: 100%;
    }
    .title {
        display: flex;
        flex-direction: row-reverse;
        .iconfont {
            color: #dbdbdb;
            font-size: 40px;
            cursor: pointer;
            margin-top: 20px;
            margin-right: 20px;
        }
    }
    .body-wrap {
        height: 100%;
    }
    .centent {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        position: relative;
        & ::v-deep .el-icon-close:before {
            font-size: 25px;
            position: absolute;
            left: 10px;
        }
        .price-box {
            display: inline-block;
            margin-top: 30px;
            color: #fff;
        }
        .price {
            font-size: 30px;
            font-weight: 500;
            color: #ee0c0c;
        }
        .pay-box {
            .alipay {
                > i {
                    font-size: 34px;
                    color: #00a7ef;
                    transform: translateY(-2px);
                }
                > span {
                    font-size: 16px;
                    color: #00a7ef;
                }
            }
            .as {
                font-size: 16px;
                color: #ffffff;
                margin: 0 12px;
            }
            .wechat {
                > i {
                    font-size: 34px;
                    color: #09bb07;
                    transform: translateY(-2px);
                }
                > span {
                    font-size: 16px;
                    color: #09bb07;
                }
            }
        }

        .tips {
            margin-top: 15px;
            font-size: 20px;
            font-weight: 600;
            color: $themeColor;
        }
        .img-box {
            width: 210px;
            height: 210px;
            padding: 15px;
            border: 1px solid #bbb6b6;
            border-radius: 10px;
        }
    }
}
</style>
