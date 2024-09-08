<template>
    <div class='dialog-msg'>
        <el-dialog
            title="云代发机器人操作说明"
            :visible.sync="visible"
            width="452px"
            :show-close="false"
            :close-on-click-modal="false"
            >
            <p>1、云代发机器人会在到期前一周提示，如有需要请及时续费。云代发机器人一旦失效，将无法恢复。</p>
            <p class="mt20">2、建议用户使用没被风控过的或新的支付宝/微信/QQ钱包去使用云代发机器人，避免支付影响机器人下单。</p>
            <p class="mt20">3、如使用云代发机器有被退单的情况，请切换支付方式重新支付即可。</p>
            <p class="mt20">4、微信扫码支付需要关掉WIFI。</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onCloseModel" :disabled="disabled">
                    我知道了
                    <span v-if="disabled">( {{time}}S )</span>
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            visible: false,
            disabled: false,
            time: 10
        }
    },
    computed: {},
    methods: {
        showModel (timer = false) {
            this.visible = true
            if (timer) {
                this.time = 10
                this.disabled = true
                let timer = setInterval(() => {
                    if (this.time > 0) {
                        this.time--
                    } else {
                        clearInterval(timer)
                        timer = null
                        this.disabled = false
                    }
                }, 1000)
            }
        },
        onCloseModel () {
            this.visible = false
            this.$emit('success')
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>
<style lang="scss" scoped>
    .dialog-msg {
        ::v-deep .el-dialog {
            border-radius: 10px;
            .el-dialog__body {
                line-height: 22px;
                .tip {
                    color: #F56C6C;
                }
            }
        }
    }
</style>