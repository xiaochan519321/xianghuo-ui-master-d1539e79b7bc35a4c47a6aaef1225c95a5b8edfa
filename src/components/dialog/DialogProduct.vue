<template>
    <el-dialog
        title="批量同步商品规格"
        class="product-dialog"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="418px">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="登录账号" prop="username">
                <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="ruleForm.password"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm" :loading="loading">开始同步</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { syncJtAllSpec } from '@/api/dfh/product'
export default {
    components: {},
    watch: {
        $route: {
            handler(val, oldVal) {
                const params = this.$route.query
                if (params.code && params.code === 'jDg3dwayenvYIKOw5FiF') {
                    this.dialogVisible = true
                }
            },
            immediate: true
        },
    },
    data() {
        return {
            ruleForm: {},
            dialogVisible: false,
            loading: false,
            rules: {
                username: [
                    { required: true, message: '请输入登录账号', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' }
                ],
            }
        }
    },
    computed: {},
    methods: {
        submitForm() {
            console.log('router', this.$route)
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    this.loading = true
                    const { data } = await syncJtAllSpec(this.ruleForm)
                    if (data.code == 0) {
                        this.$message.success(data.msg)
                        this.$router.replace(this.$route.path)
                        this.dialogVisible = false
                    }
                    this.loading = false
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
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
.product-dialog {
    ::v-deep .el-dialog {
        border-radius: 8px;
    }
}
</style>