<template>
    <div class='login-dialog'>
        <el-dialog
            title="店铺账号托管"
            :visible.sync="loginDialog"
            width="412px"
            top="20%"
            v-loading.fullscreen.lock="loading"
            element-loading-text="正在登录中，请稍后..."
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form :model="form" label-position="right" label-width="80px" size="small">
                <el-tabs v-model="form.type">
                    <el-tab-pane label="邮箱登录" name="1">
                        <el-form-item label="平台账号">
                            <el-input v-model="form.emailAccount" size="small" placeholder="请输入抖店平台账号"></el-input>
                        </el-form-item>
                        <el-form-item label="平台密码">
                            <el-input v-model="form.password" :type="passwordType" size="small" placeholder="请输入抖店平台密码">
                                <i
                                    slot="suffix"
                                    class="el-icon-view el-input__icon"
                                    @click="showPassword"
                                ></i>
                            </el-input>
                        </el-form-item>
                        <p class="tip-desc">若登录时提示“为保证账号安全，请选择其他登录方式”，请使用手机登录托管</p>
                    </el-tab-pane>
                    <el-tab-pane label="手机登录" name="2">
                        <el-form-item label="手机账号">
                            <el-input v-model="form.account" size="small" placeholder="请输入抖店平台手机号码"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" class="code-form-item">
                            <el-input v-model="form.code" size="small" placeholder="请输入验证码"></el-input>
                            <el-button type="text" size="small" class="code-btn" @click="onHandleCode" :loading="codeLoading" :disabled="inputting">{{inputting ? time + 'S' : '发送验证码'}}</el-button>
                        </el-form-item>
                        <p class="tip-desc red">使用手机登录会存在过期的情况，重新使用手机登录即可</p>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="loginDialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="onSubmit" :loading="loading" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { shop_doudian_login, doudian_login_status, getDoudianLoginCode, doudianMobileLogin } from '@/api/dfh/shop'
export default {
    components: {},
    data() {
        return {
            loginDialog: false,
            loading: false,
            form: {
                type: '1'
            },
            rotationCount: 0,
            passwordType: 'password',
            timer: null,
            codeLoading: false,
            codeTimer: null,
            time: 59,
            inputting: false
        }
    },
    computed: {
    },
    methods: {
        showPassword() {
            this.passwordType == ""
                ? (this.passwordType = "password")
                : (this.passwordType = "");
        },
        showEdit () {
            this.loginDialog = true
        },
        onLoadStatus (id) {
            this.tiemr = setTimeout(async () => {
                const { data } = await doudian_login_status(id)
                if (data.code == 0) {
                    this.rotationCount = 0
                    this.$message.success('登录成功')
                    this.loading = false
                    this.loginDialog = false
                    this.$emit('success')
                    this.onClearTimer()
                    this.form = {
                        type: '1'
                    }
                } else if (this.rotationCount < 12 && data.code != 1) {
                    this.rotationCount++
                    this.onLoadStatus(id)
                } else {
                    this.loading = false
                    this.$message.error(data.msg || '登录超时')
                    this.onClearTimer()
                }
            }, 5000)
        },
        onClearTimer () {
            this.timer = null
            this.codeTimer = null
            clearTimeout(this.timer)
            clearTimeout(this.codeTimer)
            this.rotationCount = 0
        },
        async onSubmit () {
            if (this.form.type == 1) this.handleEmailLogin()
            else this.handlePhoneLogin()
        },
        // 邮箱登录
        async handleEmailLogin () {
            const params = {
                account: this.form.emailAccount,
                password: this.form.password,
                ip: '113.65.32.222'
            }
            if (!params.account || !params.password) {
                this.$message.warning('请先填写邮箱密码')
                return
            }
            this.loading = true
            const { data } = await shop_doudian_login(params)
            this.onLoadStatus(data.data)
        },
        // 手机号登录
        async handlePhoneLogin () {
            const params = {
                account: this.form.account,
                code: this.form.code
            }
            if (!params.account || !params.code) {
                this.$message.warning('请先填写手机号验证码')
                return
            }
            this.loading = true
            try {
                const { data } = await doudianMobileLogin(params)
                this.$message.success('登录成功')
                this.loginDialog = false
                this.loading = false
                this.inputting = false
                this.time = 59
                this.$emit('success')
                this.onClearTimer()
                this.form = {
                    type: '1'
                }
            } catch (err) {
                this.loading = false
            }
        },
        // 获取验证码
        async onHandleCode () {
            this.codeLoading = true
            try {
                const { data } = await getDoudianLoginCode({account: this.form.account})
                this.codeLoading = false
                console.log('data', data)
                this.$message.success('发送成功，请注意查收短信！')
                this.inputting = true
                this.codeTimer = setInterval(() => {
                    this.time--
                    if (this.time === 0) {
                        clearInterval(this.codeTimer)
                        this.inputting = false
                        this.time = 59
                    }
                }, 1000)
            } catch (error) {
                this.codeLoading = false
            }
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {
        this.onClearTimer()
    },
}
</script>
<style lang="scss">
    .login-dialog {
        .el-dialog {
            border-radius: 10px;
            .el-dialog__header {
                padding: 15px 20px 15px;
                text-align: left;
                border-bottom: 1px solid #ededed;
                .el-dialog__title {
                    font-size: 15px;
                    font-weight: 500;
                }
            }
            .el-dialog__body {
                text-align: left;
                padding: 15px 30px;
                .tip-desc {
                    font-size: 13px;
                    line-height: 22px;
                }
                .tip-desc.red {
                    color: red;
                }
                .el-tabs__header {
                    margin-bottom: 30px;
                }
                .message {
                    color: #333;
                    margin-bottom: 30px;
                }
                .el-button {
                    font-size: 14px;
                    font-weight: 600;
                    padding: 10px 36px;
                }
                .tip {
                    text-align: right;
                    color: rgb(70, 180, 109);
                    font-size: 12px;
                    cursor: pointer;
                    font-weight: 500;
                    margin-top: 30px;
                }
                p {
                    text-align: left;
                    margin-bottom: 15px;
                }
                .el-tabs__nav-wrap::after {
                    display: none;
                }
                .code-form-item {
                    position: relative;
                    .code-btn {
                        position: absolute;
                        right: 0;
                        top: 0;
                        padding: 9px 10px 10px;
                        font-weight: 500;
                    }
                }
            }
        }
    }
</style>