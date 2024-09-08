<template>
    <div class="zfbpay-dialog-content">
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            title="支付宝支付"
            width="300px"
            class="robot-dialog">
            <div class="tip mb20">温馨提示：支付成功后系统会自动检测支付状态</div>
            <div class="img-box" v-loading="qrcodeLoading">
                <div v-if="errText">
                    <el-empty :image-size="80" :description="errText"></el-empty>
                </div>
                <qrcode v-else :value="imgUrl" :options="options"/>
            </div>
            <div class="tip-option" v-if="imgUrl">
                <p>1.打开手机直接用支付宝扫一扫支付即可</p>
                <p v-if="orderType == 'pdd'">2.如订单在风控审核中请更换新的支付宝账号</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit" :loading="loading">支付完成</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
export default {
    components: {
        qrcode: VueQrcode
    },
    data() {
        return {
            dialogVisible: false,
            loading: false,
            options: {
                height: 200,
                width: 200,
            },
            item: {},
            imgUrl: '',
            qrcodeLoading: false,
            errText: '',
            orderType: ''
        }
    },
    watch: {
        dialogVisible (val, oldVal) {
            if (!val) {
                this.imgUrl = ''
                this.errText = ''
                this.loading = false
            }
        },
    },
    computed: {},
    methods: {
        onSubmit () {
            this.loading = true
            this.$emit('success', this.item)
        },
        onClose () {
            this.dialogVisible = false
            this.loading = false
        },
        showEdit (data, type = 'pdd') {
            this.dialogVisible = true
            this.item = data
            this.imgUrl = data.pddPaymentUrl
            this.orderType = type
        },
        onClose () {
            this.dialogVisible = false
        },

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
.zfbpay-dialog-content {
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
                text-align: center;
                padding: 20px;
                font-size: 16px;
                color: #333;
                .img-box {
                    .el-loading-mask {
                        position: absolute;
                    }
                    .el-empty__description p {
                        font-size: 12px;
                        line-height: 20px;
                    }
                }
                .tip {
                    font-size: 12px;
                    color: #E6A23C;
                    font-weight: 500;
                }
                .count {
                    span {
                        color: red;
                        font-size: 20px;
                    }
                }
                .tip-option {
                    font-size: 12px;
                    text-align: left;
                    line-height: 20px;
                    color: red;
                }
            }
        }
    }
}
</style>