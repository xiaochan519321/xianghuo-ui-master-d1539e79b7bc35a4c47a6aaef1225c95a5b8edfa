<template>
    <div class="pddpay-dialog-content">
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :title="title"
            @close="onClose"
            width="330px"
            class="robot-dialog">
            <div class="pddpay-order-info text-left font14">
                <div class="mb15">选择支付方式：</div>
                <el-radio-group v-model="payModelType" @change="onPayModelChange">
                    <el-radio :label="1">QQ支付（推荐）</el-radio>
                    <el-radio :label="2">云闪付（推荐）</el-radio>
                    <el-radio :label="0">微信支付</el-radio>
                    <el-radio :label="3">支付宝支付</el-radio>
                </el-radio-group>
                <div class="mb15 mt10">当前订单号：{{curItem.parentOrderId}}</div>
                <div class="mb10">支付方式：{{payModelText[payModelType]}}</div>
            </div>
            <div class="img-box" v-loading="qrcodeLoading">
                <div v-if="curPayItem.errText">
                    <el-empty :image-size="80" :description="curPayItem.errText"></el-empty>
                </div>
                <qrcode v-else :value="curPayItem.imgUrl" :options="options"/>
            </div>
            <div class="tip-option mt5">
                <p>{{tips[payModelType]}}</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="onPass" v-if="!lastPay">跳过此单</el-button>
                <el-button type="primary" @click="onSubmit" :loading="loading" v-if="lastPay">支付完成</el-button>
                <el-button type="primary" @click="onNext" v-else>下一单</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { pddWxPay, detectioPddPay } from '@/api/dfh/order'
export default {
    components: {
        qrcode: VueQrcode
    },
    data() {
        return {
            dialogVisible: false,
            tips: {
                0: '用微信扫一扫支付, 如订单在风控审核中请更换微信账号',
                1: '暂不支持使用QQ扫一扫付款，只支持苹果原相机扫描二维码跳转QQ内支付',
                2: '只支持安卓下载百度APP和云闪付APP后,打开百度APP进行扫码(注意:非百度浏览器)',
                3: '用支付宝扫一扫支付即可，如订单在风控审核中请更换支付账号',
            },
            payModelText: {
                0: '微信支付',
                1: 'QQ支付',
                2: '云闪付',
                3: '支付宝支付'
            },
            loading: false,
            options: {
                height: 180,
                width: 180,
            },
            items: [],
            curPayItem: {
                imgUrl: '',
                errText: ''
            },
            curIndex: 0,
            payModelType: 1,
            qrcodeLoading: false
        }
    },
    watch: {
        dialogVisible (val, oldVal) {
            if (!val) {
                this.curPayItem = {
                    imgUrl: '',
                    errText: ''
                }
                this.curIndex = 0
                this.loading = false
            }
        },
    },
    computed: {
        title () {
            let res = '采购代发支付'
            if (this.items.length > 1) {
                res = `${res}（${this.curIndex + 1}/${this.items.length}）`
            }
            return res
        },
        lastPay () {
            return this.curIndex + 1 == this.items.length
        },
        curItem () {
            return this.items[this.curIndex] || {}
        }
    },
    methods: {
        onPayModelChange (val) {
            console.log('val', val)
            this.curPayItem = {}
            this.loadImg()
        },
        // 下一单
        onNext () {
            this.curPayItem = {}
            this.curIndex++
            this.loadImg()
            detectioPddPay({ ids: this.curItem.id, payType: this.payModelType }).then(res => {
                console.log('上报成功')
            })
        },
        // 跳过此单
        onPass () {
            this.curPayItem = {}
            this.curIndex++
            this.loadImg()
        },
        onSubmit () {
            detectioPddPay({ ids: this.curItem.id, payType: this.payModelType }).then(res => {
                console.log('上报成功')
            })
            this.onClose()
        },
        onClose () {
            this.dialogVisible = false
            this.loading = false
            this.$emit('success')
        },
        showModel (data) {
            console.log('data', data)
            this.dialogVisible = true
            this.items = data
            this.loadImg()
        },
        async loadImg () {
            if (this.payModelType == 3) {
                // 支付宝支付则不需要调接口获取二维码
                this.curPayItem.imgUrl = this.curItem.pddPaymentUrl
                return
            }
            this.qrcodeLoading = true
            try {
                const { data } = await pddWxPay({id: this.curItem.id, type: this.payModelType})
                this.qrcodeLoading = false
                this.curPayItem.imgUrl = data.data.paymentUrl
            } catch (err) {
                console.log('err', err)
                this.qrcodeLoading = false
                let error = err.toString()
                if (error.indexOf('status') > -1) {
                    // 超时
                    this.curPayItem.errText = '不可支付,请检查订单是否下单已超过24小时'
                } else {
                    error = error.replace('Error: ', '')
                    this.curPayItem.errText = error || '不可支付，请检查订单是否下单已超过24小时'
                }
            }
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
.pddpay-dialog-content {
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
                .pddpay-order-info {
                    .el-radio {
                        margin-bottom: 15px;
                        margin-right: 0;
                        width: 140px;
                    }
                }
                .img-box {
                    .el-loading-mask {
                        position: absolute;
                        background-color: #fff;
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