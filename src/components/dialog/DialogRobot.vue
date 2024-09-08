<template>
    <div class="robot-dialog-content">
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            class="robot-dialog"
            width="700px">
            <img src="/img/bg_robot_banner.png" width="100%" height="auto" alt="">
            <i class="close-dialog el-icon-error" @click="onClose"></i>
            <div class="robot-btn" @click="onPay"></div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
            dialogVisible: false,
        }
    },
    computed: {},
    methods: {
        onPay () {
            this.dialogVisible = false
            this.$router.push('/dfh/robot/index')
        },
        onClose () {
            this.dialogVisible = false
            this.$emit('success')
        },
        showEdit () {
            this.dialogVisible = true
            this.$store.commit('SET_ROBOT_DIALOG', 1)
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
.robot-dialog-content {
    .robot-dialog {
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
                    left: 117px;
                    width: 300px;
                    height: 80px;
                    cursor: pointer;
                }
            }
        }
    }
    .close-dialog {
        position: absolute;
        right: 8%;
        top: 0;
        color: #fff;
        font-size: 24px !important;
        cursor: pointer;
        z-index: 20091;
    }
}
</style>