<template>
    <div class='dialog-private-login'>
        <el-dialog
            title="登录采购账号"
            :visible.sync="visible"
            width="452px"
            :close-on-click-modal="false"
            >
            <el-form
                ref="loginForm"
                :rules="loginRules"
                :model="loginForm"
                class="login-form"
                status-icon
                label-width="0"
            >
                <el-form-item prop="mobile">
                    <el-input
                        v-model="loginForm.mobile"
                        size="small"
                        auto-complete="off"
                        placeholder="请输入手机号码"
                    >
                        <i slot="prefix" class="icon-iphone" />
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <div class="flex mt10">
                        <el-input
                            v-model="loginForm.code"
                            size="small"
                            auto-complete="off"
                            placeholder="请输入验证码"
                        >
                            <i slot="prefix" class="icon-yanzhengma2" />
                        </el-input>
                        <div class="msg-box" :class="codeDisable ? 'disable' : ''" @click="handleSend" v-loading="codeLoading" element-loading-customClass="code-loading-icon">
                            <span v-if="inputting">{{time}}S后重新获取</span>
                            <span class="msg-text" v-else>{{msgText}}</span>
                        </div>
                    </div>
                </el-form-item>
                <div class="tip">* 建议添加之前常用的采购账号，效果更加稳定</div>
                <el-form-item class="pt20">
                    <el-button size="medium" type="primary" style="width: 100%; line-height: 24px;" @click.native.prevent="handleLogin" :loading="saveLoading">立即登录</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button size="medium" style="width: 100%; line-height: 24px;" @click="onCloseModel">返回</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { getLoginCode, pddLogin } from '@/api/dfh/privateAccount'
import { isvalidatemobile } from "@/util/validate"
export default {
    components: {},
    data() {
        const validatePhone = (rule, value, callback) => {
            if (isvalidatemobile(value)[0]) {
                callback(new Error(isvalidatemobile(value)[1]))
            } else {
                callback()
            }
        }
        return {
            visible: false,
            inputting: false,
            time: 59,
            timer: null,
            loginForm: {
                mobile: ''
            },
            loginRules: {
                mobile: [{ required: true, trigger: "blur", validator: validatePhone }],
                code: [{ required: true, trigger: "blur", message: '请输入验证码' }],
            },
            msgText: '发送验证码',
            codeLoading: false,
            saveLoading: false
        }
    },
    computed: {
        codeDisable () {
            let disable = true
            if (this.loginForm.mobile && !isvalidatemobile(this.loginForm.mobile)[0] && !this.inputting && !this.codeLoading) {
                console.log('mobile', this.loginForm.mobile)
                disable = false
            }
            return disable
        },
    },
    methods: {
        async handleSend () {
            if (this.codeDisable) return
            console.log('msgKey')
            this.codeLoading = true
            try {
                const { data } = await getLoginCode({mobile: this.loginForm.mobile})
                this.codeLoading = false
                if (data.code == 0) {
                    this.inputting = true
                    this.timer = setInterval(() => {
                        this.time--
                        if (this.time === 0) {
                            clearInterval(this.timer)
                            this.inputting = false
                            this.time = 59
                        }
                    }, 1000)
                }
            } catch (error) {
                this.codeLoading = false
            }
        },
        handleLogin () {
            this.$refs.loginForm.validate(async (valid) => {
                if (valid) {
                    this.saveLoading = true
                    try {
                        const { data } = await pddLogin(this.loginForm)
                        this.saveLoading = false
                        this.$message.success('登录成功')
                        this.$emit('success')
                        this.onCloseModel()
                    } catch (err) {
                        this.saveLoading = false
                    }
                    
                }
            });
        },
        showModel (mobile) {
            this.visible = true
            if (mobile) {
                this.loginForm.mobile = mobile
            }
        },
        onCloseModel () {
            this.visible = false
            this.loginForm = {}
            this.time = 59
            clearInterval(this.timer)
            this.timer = null
            this.inputting = false
            this.codeLoading = false
        },
        onLoadCode () {
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
        this.timer = null
        clearInterval(this.timer)
    },
}
</script>
<style lang="scss" scoped>
    .dialog-private-login {
        ::v-deep .el-dialog {
            border-radius: 10px;
            .el-dialog__header {
                text-align: center;
            }
            .el-dialog__body {
                line-height: 22px;
                .login-form {
                    .tip {
                        font-size: 12px;
                        color: #E6A23C;
                    }
                    .el-input {
                        flex: 1;
                        input {
                            height: 46px;
                            border-radius: 5px;
                        }
                    }
                    .el-input__inner {
                        font-size: 14px;
                    }
                    .msg-box {
                        border-radius: 5px;
                        flex-basis: 120px;
                        padding: 0 10px;
                        cursor: pointer;
                        .msg-text {
                            font-size: 14px;
                        }
                        .el-loading-spinner {
                            margin-top: -12px;
                        }
                        .el-loading-spinner .circular {
                            width: 24px;
                            height: 24px;
                        }
                    }
                    .msg-box.disable {
                        cursor: no-drop;
                        background-color: #f7f7f7;
                        color: #c6c6c6;
                    }
                    .msg-box:hover {
                        background-color: #436BFF;
                        color: #fff;
                    }
                    .msg-box.disable:hover {
                        background-color: #f7f7f7;
                        color: #c6c6c6;
                    }
                }
            }
        }
    }
</style>