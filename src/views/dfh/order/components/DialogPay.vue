<template>
    <div class="wxpay-dialog-content">
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            :title="title"
            width="300px"
            class="robot-dialog">
            <div class="img-box" v-loading="qrcodeLoading">
                <div v-if="errText">
                    <el-empty :image-size="80" :description="errText"></el-empty>
                </div>
                <qrcode v-else :value="imgUrl" :options="options"/>
            </div>
            <div class="tip-option">
                <p v-for="(item, index) in tips" :key="index">{{item}}</p>
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
import { pddWxPay } from '@/api/dfh/order'
export default {
    components: {
        qrcode: VueQrcode
    },
    data() {
        return {
            dialogVisible: false,
            title: '',
            tips: [],
            loading: false,
            options: {
                height: 180,
                width: 180,
            },
            item: {},
            imgUrl: '',
            qrcodeLoading: false,
            errText: ''
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
        showEdit (data) {
            this.dialogVisible = true
            this.item = data
            this.loadImg()
            switch (data.payModelType) {
                case 0:
                    // 微信支付
                    this.title = '微信支付'
                    this.tips = ['1.打开手机直接用微信扫一扫支付即可, 如订单在风控审核中请更换微信账号', '2.支付成功后系统会自动检测支付状态']
                break;
                case 1:
                    // QQ
                    this.title = 'QQ支付'
                    this.tips = ['1.暂不支持使用QQ扫一扫识别支付,只支持苹果手机使用原相机扫描二维码跳转QQ内支付', '2.支付成功后系统会自动检测支付状态']
                break;
                case 2:
                    // 云闪付
                    this.title = '云闪付'
                    this.tips = ['1.只支持安卓手机,下载百度APP和云闪付APP后,打开百度APP进行扫码支付(注意:非百度浏览器)', '2.支付成功后系统会自动检测支付状态']
                break;
            }
        },
        async loadImg () {
            this.qrcodeLoading = true
            try {
                const { data } = await pddWxPay({id: this.item.id, type: this.item.payModelType})
                this.qrcodeLoading = false
                this.imgUrl = data.data.paymentUrl
            } catch (err) {
                console.log('err', err)
                this.qrcodeLoading = false
                let error = err.toString()
                if (error.indexOf('status') > -1) {
                    // 超时
                    this.errText = '不可支付,请检查订单是否下单已超过24小时'
                } else {
                    error = error.replace('Error: ', '')
                    this.errText = error || '不可支付，请检查订单是否下单已超过24小时'
                }
            }
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
.wxpay-dialog-content {
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