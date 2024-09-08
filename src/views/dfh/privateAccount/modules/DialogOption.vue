<template>
    <el-dialog
        class="privte-account-dialog"
        title="设定下单数量"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="412px">
        <el-form ref="form" :model="form" label-position="top">
            <el-form-item label="请输入每日下单数量" prop="count">
                <el-input-number style="width: 100%;" :min="1" size="medium" :controls="false" step-strictly placeholder="请输入个人号每日下单数量" v-model="form.count"></el-input-number>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit" :loading="loading">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { pddTodayMax } from '@/api/dfh/privateAccount'
export default {
    components: {},
    data() {
        return {
            dialogVisible: false,
            form: {
                count: 1
            },
            loading: false
        }
    },
    computed: {},
    methods: {
        async onSubmit () {
            this.loading = true
            try {
                const { data } = await pddTodayMax(this.form)
                this.loading = false
                if (data.code == 0) {
                    this.form = { count: 1, ids: '' }
                    this.dialogVisible = false
                    this.$message.success('设置成功')
                    this.$emit('success')
                }
            } catch (err) {
                this.loading = false
            }
        },
        showModel (ids) {
            this.dialogVisible = true
            this.form.ids = ids
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
    .privte-account-dialog {
        border-radius: 10px;
        ::v-deep .el-dialog__header {
            padding: 15px 20px 15px;
            border-bottom: 1px solid #ededed;
            .el-dialog__title {
                font-size: 15px;
                font-weight: 500;
            }
        }
        ::v-deep .el-dialog__body {
            .el-form {
                padding-left: 30px;
                padding-right: 40px;
                .el-input-number {
                    .el-input__inner {
                        text-align: left;
                    }
                }
            }
        }
    }
</style>