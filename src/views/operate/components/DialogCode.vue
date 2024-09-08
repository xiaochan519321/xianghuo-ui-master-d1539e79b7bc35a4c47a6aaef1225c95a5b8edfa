<template>
    <div class="operate-dialog-content">
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-press-escape="false"
            title=""
            width="220px"
            class="robot-dialog">
            <div class="img-box" v-if="codeValue">
                <qrcode :value="codeValue" :options="options" />
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
            options: {
                height: 200,
                width: 200,
            },
            codeValue: ''
        }
    },
    watch: {
        dialogVisible (val, oldVal) {
            if (!val) {
                this.codeValue = ''
                this.$emit('close')
            }
        },
    },
    computed: {},
    methods: {
        onClose () {
            this.dialogVisible = false
        },
        showModel (data) {
            this.dialogVisible = true
            this.codeValue = data
        },
        onClose () {
            this.dialogVisible = false
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
.operate-dialog-content {
    .robot-dialog {
        .el-dialog {
            border-radius: 10px;
            .el-dialog__header {
                padding-bottom: 20px;
            }
            .el-dialog__body {
                position: relative;
                text-align: center;
                padding: 5px;
            }
        }
    }
}
</style>