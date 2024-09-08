<template>
    <div class="config-dialog-guide">
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            title="采购&拍单模式调整通知"
            width="334px"
            center
            class="robot-dialog">
            <div class="tip mb20">拍单模式、采购模式设置已从“订单代发”调整至“代发设置”；</div>
            <div class="tip">默认拍单模式为普通模式，默认采购模式为代发，若需更改，请前往“代发设置”中更改；</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmit">立即前往</el-button> 
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
            dialogVisible: false
        }
    },
    computed: {},
    methods: {
        onSubmit () {
            this.loading = true
            this.dialogVisible = false
            window.localStorage.setItem('orderConfigGuide', 1)
            this.$router.push('/dfhConfig/index')
        },
        showModel (data) {
            this.dialogVisible = true
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
.config-dialog-guide {
    .robot-dialog {
        .el-dialog {
            border-radius: 10px;
            .el-dialog__header {
                padding: 15px 20px 15px;
                .el-dialog__title {
                    font-size: 15px;
                    font-weight: 500;
                }
            }
            .el-dialog__body {
                position: relative;
                text-align: center;
                padding: 20px;
                font-size: 13px;
                color: #333;
                text-align: left;
                line-height: 21px;
            }
        }
    }
}
</style>