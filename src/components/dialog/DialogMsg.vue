<template>
    <div class='dialog-msg'>
        <el-dialog
            title="平台公告"
            :visible.sync="visible"
            width="412px"
            :close-on-click-modal="false"
            center>
            <span>尊敬的商家朋友：由于采购平台管控，导致市面上同类型的拍单软件一直<span class="tip">代发失败或出现大批量异常订单退款</span>。经过技术人员的研究我们已经找到突破口，我们会竭尽所能尽快让软件恢复正常，还大家一个健康的拍单生态</span>
            <div class="tip">【订单代发中列队缓慢，后台挂着即可】</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSuccess">知道了</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            visible: false
        }
    },
    computed: {},
    methods: {
        onSuccess () {
            this.visible = false
            this.$emit('success')
        },
        showEdit () {
            this.visible = true
            this.$store.commit('SET_WARN_MSG', 1)
        }
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
                padding: 10px 25px;
                line-height: 26px;
                .tip {
                    color: #F56C6C;
                }
            }
        }
    }
</style>