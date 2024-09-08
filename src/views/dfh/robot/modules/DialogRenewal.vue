<template>
    <div class="robot-renewal-dialog-content">
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :title="title"
            width="300px"
            class="robot-dialog">
            <div class="tip mb20">续期三个月</div>
            <div class="count" v-if="payData.goods">应付金额：<span>¥{{payData.goods.amount / 100}}</span></div>
            <div class="img-box">
                <qrcode :value="payData.params" :options="options" />
            </div>
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
            count: 0,
            options: {
                height: 180,
                width: 180,
            },
            payData: {},
            title: '机器人续费'
        }
    },
    watch: {
        dialogVisible (val, oldVal) {
            if (!val) {
                this.$emit('close')
                this.title = '机器人续费'
            }
        },
    },
    computed: {},
    methods: {
        onClose () {
            this.dialogVisible = false
        },
        showEdit (data) {
            this.dialogVisible = true
            this.payData = data
            const robotIds = data.goods.robotIds.split(',')
            if (robotIds.length > 1) {
                this.title = `${this.title}（${robotIds.length}个）`
            } else {
                this.title = '机器人续费'
            }
        },
        onClose () {
            this.dialogVisible = false
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
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
}
</script>
<style lang="scss">
.robot-renewal-dialog-content {
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
                .count {
                    span {
                        color: red;
                        font-size: 20px;
                    }
                }
            }
        }
    }
}
</style>