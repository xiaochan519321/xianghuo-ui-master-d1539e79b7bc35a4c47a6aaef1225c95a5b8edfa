<template>
    <div>
        <el-form
            ref="loginForm"
            :rules="loginRules"
            :model="loginForm"
            class="login-form"
            label-width="0"
        >
            <el-form-item prop="username">
                <el-input
                    v-model="loginForm.username"
                    placeholder="请输入用户名"
                    clearable
                    @keyup.enter.native="handleLogin"
                >
                    <i slot="prefix" class="icon-zhanghao"/>
                </el-input>
            </el-form-item>
            <el-form-item class="mt20" prop="password">
                <el-input
                    :type="passwordType"
                    v-model="loginForm.password"
                    clearable
                    placeholder="请输入密码"
                    @keyup.enter.native="handleLogin"
                >
                    <i
                        slot="suffix"
                        class="el-icon-view el-input__icon"
                        @click="showPassword"
                    />
                    <i slot="prefix" class="icon-mima"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <div class="remember flex justify-between items-center">
                    <div class="lbox">
                        <el-checkbox v-model="remember">
                            <span class="remember-text font16">记住账号</span>
                        </el-checkbox>
                    </div>
                    <div class="rbox">
                        <span class="forget" @click="reset">忘记密码</span>
                    </div>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button
                    size="small"
                    class="login-submit"
                    type="primary"
                    @click.native.prevent="handleLogin"
                    >登录</el-button
                >
            </el-form-item>
            <el-form-item prop="code">
                <Verify
                    @success="verifySuccess"
                    :mode="'pop'"
                    :captchaType="'blockPuzzle'"
                    :imgSize="{ width: '330px', height: '155px' }"
                    ref="verify"
                />
            </el-form-item>
        </el-form>
        <p style="font-size: 14px;color: #ABB4BE;text-align: center;margin: 10px 0;">
            没有账号？
            <span style="color: #47C085;cursor: pointer;" @click="register">立即注册</span>
        </p>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Verify from "@/components/verifition/Verify";
import { Encrypt, Decrypt } from '@/util/Crypto';

export default {
    name: "Userlogin",
    components: {
        Verify,
    },
    data() {
        return {
            // 登录方式
            activeName: 'user',
            socialForm: {
                code: "",
                state: "",
            },
            loginForm: {
                username: "",
                password: "",
                code: "",
                randomStr: "blockPuzzle",
            },
            remember: false,
            code: {
                src: undefined,
                len: 4,
            },
            loginRules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { min: 6, message: "密码长度最少为6位", trigger: "blur" },
                ],
            },
            passwordType: "password",
        };
    },
    computed: {
        ...mapGetters(["tagWel"]),
    },
    methods: {
        // 查看协议
        onViewAgreement () {
            this.$refs.dialogAgreement.showModel()
        },
        showPassword() {
            this.passwordType == ""
                ? (this.passwordType = "password")
                : (this.passwordType = "");
        },
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.$refs.verify.show();
                }
            });
        },
        async verifySuccess(params) {
            this.loginForm.code = params.captchaVerification;
            this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
                // 检查是否开启记住密码
                this.rememberAccount(this.loginForm);
                this.$store.dispatch("GetMenu", { type: true, id: null }).then(async res => {
                    if (res.length !== 0) {
                        await this.$router.$avueRouter.formatRoutes(res, true);
                        this.$router.push({ path: this.tagWel.value });
                    }
                });
            });

        },
        /**
         * 是否记住账户
         */
        rememberAccount(formData) {
            const keys = ['REMEMBER_KEY', 'USERNAME_KEY', 'PASSWORD_KEY'];
            if (this.remember) {
                this.$locStore.setStore({
                    name: keys[0],
                    content: true,
                });
                this.$locStore.setStore({
                    name: keys[1],
                    content: Encrypt(formData.username),
                });
                this.$locStore.setStore({
                    name: keys[2],
                    content: Encrypt(formData.password),
                });
            } else {
                this.$locStore.removeStore({ name: keys[0] });
                this.$locStore.removeStore({ name: keys[1] });
                this.$locStore.removeStore({ name: keys[2] });
            }
        },
        /**
         * 从本地存储localstorage获取用户账户信息
         */
        handleCancel() {
            const keys = ['REMEMBER_KEY', 'USERNAME_KEY', 'PASSWORD_KEY'];
            if (this.$locStore.getStore({ name: keys[0] })) this.remember = this.$locStore.getStore({ name: keys[0] });
            if (this.$locStore.getStore({ name: keys[1] })) this.loginForm.username = Decrypt(this.$locStore.getStore({ name: keys[1] }));
            if (this.$locStore.getStore({ name: keys[2] })) this.loginForm.password = Decrypt(this.$locStore.getStore({ name: keys[2] }));
        },
        // 重置密码
        reset() {
            this.$emit('handlerReset');
        },
        //注册
        register() {
            this.$emit('handlerRegister');
        }
    },

    mounted() {
        this.handleCancel();
    }
};
</script>

<style lang="scss" scoped>
.login-form {
    .agreement-box {
        color: #333;
        ::v-deep .el-checkbox {
            vertical-align: middle;
            .el-checkbox__label {
                color: #333;
            }
        }
        .text {
            color: #333;
            vertical-align: middle;
            font-size: 14px;
            cursor: pointer;
        }
        .text:hover {
            color: $themeColor;
        }
    }
}
.rememberText span{
    font-size: 13px;
    float: left;
}
</style>
