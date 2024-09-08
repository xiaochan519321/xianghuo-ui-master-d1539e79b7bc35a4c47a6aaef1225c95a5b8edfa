<template>
    <div class="reset-password">
        <!-- <div class="header">
            <img class="img" :src="siteConfig.htLogo" />
            <span class="title">重置密码</span>
        </div> -->
        <el-form
            ref="loginForm"
            :rules="loginRules"
            :model="loginForm"
            class="login-form"
            label-width="0"
        >
            <el-form-item prop="phone">
                <el-input
                    v-model="loginForm.phone"
                    placeholder="请输入手机号码"
                    clearable
                >
                    <i slot="prefix" class="icon-shouji" />
                </el-input>
            </el-form-item>

            <el-form-item prop="phoneCode" class="mt20">
                <div class="flex">
                    <el-input
                        v-model="loginForm.phoneCode"
                        placeholder="请输入验证码"
                        clearable
                    >
                        <i slot="prefix" class="icon-yanzhengma2" />
                    </el-input>
                    <div class="msg-box" @click="handleSend">
                        <span :class="[{ display: msgKey }]" class="msg-text">{{
                            msgText
                        }}</span>
                    </div>
                </div>
            </el-form-item>
            <el-form-item prop="password" class="mt20">
                <el-input
                    :type="passwordType"
                    v-model.trim="loginForm.password"
                    placeholder="请输入密码"
                    clearable
                >
                    <i
                        slot="suffix"
                        class="el-icon-view el-input__icon"
                        @click="showPassword(1)"
                    />
                    <i slot="prefix" class="icon-mima"></i>
                </el-input>
            </el-form-item>

            <el-form-item prop="newpassword1" class="mt20">
                <el-input
                    :type="newpasswordType"
                    v-model.trim="loginForm.newpassword1"
                    placeholder="请再次输入密码"
                    clearable
                >
                    <i
                        slot="suffix"
                        class="el-icon-view el-input__icon"
                        @click="showPassword(2)"
                    />
                    <i slot="prefix" class="icon-mima"></i>
                </el-input>
            </el-form-item>

            <el-form-item>
                <div class="operation-text">
                    <span>记得密码，</span>
                    <span class="login-btn" @click="showLogin">立即登录</span>
                </div>
                <el-button
                    type="primary"
                    size="small"
                    class="login-submit"
                    @click.native.prevent="handleLogin"
                    >修改密码</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
const MSGINIT = "发送验证码",
    MSGSCUCCESS = "${time}秒后重发",
    MSGTIME = 60;
import { isvalidatemobile } from "@/util/validate";
import { mapGetters } from "vuex";
import Verify from "@/components/verifition/Verify";
import { validatePsdLogin } from "@/util/validate";

export default {
    name: "Register",
    components: {
        Verify,
    },
    data() {
        const validatePhone = (rule, value, callback) => {
            if (isvalidatemobile(value)[0]) {
                callback(new Error(isvalidatemobile(value)[1]));
            } else {
                callback();
            }
        };
        const validateCode = (rule, value, callback) => {
            if (value.length != 4) {
                callback(new Error("请输入4位数的验证码"));
            } else {
                callback();
            }
        };
        const validateConfirmPassword = (rule, value, callback) => {
            if (value === '' || this.loginForm.password !== value) {
                callback(new Error('两次密码不一致'));
            } else {
                callback();
            }
        };
        return {
            msgText: MSGINIT,
            msgTime: MSGTIME,
            msgKey: false,
            loginForm: {
                password: "",
                newpassword1: "",
                phone: '',
                phoneCode: '',
            },
            checked: false,
            loginRules: {
                phone: [
                    { required: true, trigger: "blur", validator: validatePhone }
                ],
                phoneCode: [{ required: true, trigger: "blur", validator: validateCode }],
                password: [
					{ required: true, message: '请输入正确的密码', trigger: 'blur' },
					{ validator: validatePsdLogin, trigger: 'blur' }
                ],
                newpassword1: [
					{ required: true, message: '请输入正确的密码', trigger: 'blur' },
					{ validator: validatePsdLogin, trigger: 'blur' }
                ],
            },
            passwordType: "password",
            newpasswordType: "password",
        };
    },
    computed: {
        ...mapGetters(["tagWel", 'siteConfig']),
    },
    methods: {
        handleSend() {
            // 判断是否可以发送（时间限制）
            if (this.msgKey) return;
            // 发送验证码
            this.$refs.loginForm.validateField("phone", (valid) => {
                if (!valid) {
                    this.$request({
                        url: "/admin/merchant/sendSmsRegCode/" + this.loginForm.phone,
                        method: "get",
                    }).then((response) => {
                        if (response.data.data) {
                            this.$message.success("验证码发送成功");
                            this.timeCacl();
                        } else {
                            this.$message.error(response.data.msg);
                        }
                    });
                }
            });
        },
        timeCacl() {
            // 计时避免重复发送
            this.msgText = MSGSCUCCESS.replace("${time}", this.msgTime);
            this.msgKey = true;
            const time = setInterval(() => {
                this.msgTime--;
                this.msgText = MSGSCUCCESS.replace("${time}", this.msgTime);
                if (this.msgTime === 0) {
                    this.msgTime = MSGTIME;
                    this.msgText = MSGINIT;
                    this.msgKey = false;
                    clearInterval(time);
                }
            }, 1000);
        },
        showPassword(val) {
            switch (val) {
                case 1:
                    this.passwordType == ""
                        ? (this.passwordType = "password")
                        : (this.passwordType = "");
                    break;
                case 2:
                    this.newpasswordType == ""
                        ? (this.newpasswordType = "password")
                        : (this.newpasswordType = "");
                    break;
                default:
                    break;
            }
        },
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // 表单验证通过后，弹出滑块验证
                    this.$API.updatePassword(this.loginForm).then((response) => {
                        if (response.data.code === 0) {
                            this.$message.success("修改密码成功");
                            this.$emit('showLogin');
                        } else {
                            this.$message.error(response.data.msg);
                        }
                    });
                }
            });
        },
        /**
         * 切换回登录页
         */
        showLogin() {
            this.$emit('showLogin');
        },
    },
};
</script>

<style lang="scss" scoped="scoped">
.reset-password {
    .header {
        padding-top: 34px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .img {
        height: 82px;
    }
    .title {
        padding-top: 7px;
        font-size: 18px;
        font-weight: 600;
        color: #413d3d;
        line-height: 25px;
    }
    .operation-text {
        font-size: 14px;
        font-weight: 400;
        color: #333;
        line-height: 20px;
        text-align: center;
        padding-bottom: 16px;
        .login-btn {
            color: rgb(70, 180, 109);
            cursor: pointer;
        }
    }
}
</style>
