<template>
    <div class='dialog-msg'>
        <el-dialog
            title="提示"
            :visible.sync="visible"
            width="412px"
            :show-close="false"
            :close-on-click-modal="false"
            >
            <span style="color: red;">亲~请截图找客服核实站点名称，核实无误再进行充值!</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onCloseModel" :disabled="disabled">
                    知道了
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
            disabled: true,
            time: 5,
            tag: ''
        }
    },
    computed: {},
    methods: {
        showEdit (tag) {
            this.visible = true
            this.tag = tag
            this.time = 5
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
        },
        onCloseModel () {
            this.visible = false
            this.$emit('success', this.tag)
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