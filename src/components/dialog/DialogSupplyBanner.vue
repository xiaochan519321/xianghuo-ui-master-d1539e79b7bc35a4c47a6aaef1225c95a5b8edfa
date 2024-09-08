<template>
    <div class="supply-dialog-banner">
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            class="banner-dialog"
            width="700px">
            <div class="code-content">
                <img style="margin-left: 130px;" src="/img/board/bg_dash_agency_code.png" width="480" height="auto" alt="">
                <i class="close-dialog el-icon-error service-close-icon" @click="onClose"></i>
                <img class="qrcode" :src="serviceCode" width="192" height="192" alt="">
            </div>
            <!-- <template v-else>
                <img src="/img/bg_supply_banner.png" width="100%" height="auto" alt="">
                <i class="close-dialog el-icon-error" @click="onClose"></i>
                <div class="robot-btn" @click="onPay"></div>
            </template> -->
        </el-dialog>
    </div>
</template>

<script>
import { getServiceQrCode } from '@/api/info'
export default {
    components: {
    },
    watch: {
        dialogVisible (val, oldVal) {
            if (!val) {
                // this.$bus.$emit('supply-banner-dialog')
            }
        }
    },
    data() {
        return {
            dialogVisible: false,
            serviceCode: ''
        }
    },
    computed: {},
    methods: {
        onPay () {
            this.dialogVisible = false
        },
        onClose () {
            this.dialogVisible = false
            this.$emit('success')
        },
        async showEdit () {
            const { data } = await getServiceQrCode()
            if (data.data) {
                this.serviceCode = data.data
                this.dialogVisible = true
            }
            this.$store.commit('SET_SUPPLY_DIALOG', 1)
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {
    },
}
</script>
<style lang="scss">
.supply-dialog-banner {
    .banner-dialog {
        .el-dialog {
            background: none !important;
            box-shadow: none !important;
            .el-dialog__header {
                display: none;
            }
            .el-dialog__body {
                padding: 0;
                position: relative;
                .robot-btn {
                    position: absolute;
                    bottom: 0;
                    left: 176px;
                    width: 300px;
                    height: 80px;
                    cursor: pointer;
                }
                .code-content {
                    position: relative;
                    .qrcode {
                        position: absolute;
                        left: 275px;
                        top: 216px;
                    }
                }
            }
        }
    }
    .close-dialog {
        position: absolute;
        right: 8%;
        top: 27px;
        color: #fff;
        font-size: 50px !important;
        cursor: pointer;
        z-index: 20091;
        opacity: 0;
    }
    .service-close-icon {
        right: 18%;
    }
}
</style>