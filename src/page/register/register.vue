<template>
    <div>
        <el-form
            ref="loginForm"
            :rules="loginRules"
            :model="loginForm"
            class="login-form"
            status-icon
            label-width="0"
        >
            <el-form-item prop="userName">
                <el-input v-model="loginForm.userName" placeholder="请输入用户名">
                    <i slot="prefix" class="icon-zhanghao" />
                </el-input>
            </el-form-item>
            <el-form-item prop="passWord" class="mt20">
                <el-input
                    :type="passWordType"
                    v-model.trim="loginForm.passWord"
                    placeholder="请输入密码"
                >
                    <i
                        slot="suffix"
                        class="el-icon-view el-input__icon"
                        @click="showpassWord"
                    />
                    <i slot="prefix" class="icon-mima"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="phone" class="mt20">
                <el-input v-model="loginForm.phone" placeholder="请输入手机号码">
                    <i slot="prefix" class="icon-shouji" />
                </el-input>
            </el-form-item>
            <el-form-item prop="phoneCode" class="mt20">
                <div class="flex">
                    <el-input
                        v-model="loginForm.phoneCode"
                        placeholder="请输入验证码"
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
            <el-form-item prop="code">
                <Verify
                    @success="verifySuccess"
                    :mode="'pop'"
                    :captchaType="'blockPuzzle'"
                    :imgSize="{ width: '330px', height: '155px' }"
                    ref="verify"
                />
            </el-form-item>

            <div class="agreement-box mb20">
                <el-checkbox v-model="loginForm.agreementCheck" label="注册即代表阅读并同意"/>
                <span class="text" @click="onViewAgreement">《用户协议》</span>
            </div>
            <el-form-item>
                <el-button
                    type="primary"
                    size="small"
                    class="login-submit"
                    @click.native.prevent="handleLogin"
                    >注册</el-button
                >
            </el-form-item>
        </el-form>
        <DialogAgreement ref="dialogAgreement" />
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
import DialogAgreement from "@/components/dialog/DialogAgreement.vue";

export default {
    name: "Register",
    components: {
        Verify,
        DialogAgreement
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
        return {
            msgText: MSGINIT,
            msgTime: MSGTIME,
            msgKey: false,
            socialForm: {
                code: "",
                state: "",
            },
            loginForm: {
                userName: "",
                passWord: "",
                phone: '',
                phoneCode: '',
                invite: '' // 邀请码
            },
            checked: false,
            code: {
                src: undefined,
                len: 4,
            },
            loginRules: {
                phone: [
                    { required: true, trigger: "blur", validator: validatePhone }
                ],
                phoneCode: [{ required: true, trigger: "blur", validator: validateCode }],
                userName: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                ],
                passWord: [
					{ required: true, message: '请输入正确的密码', trigger: 'blur' },
					{ validator: validatePsdLogin, trigger: 'blur' }
                    // { required: true, message: "请输入密码", trigger: "blur" },
                    // { min: 6, message: "密码长度最少为6位", trigger: "blur" },
                ],
            },
            passWordType: "passWord",
        };
    },
    computed: {
        ...mapGetters(["tagWel"]),
    },
    watch: {
        $route: {
            handler(val, oldVal) {
                this.loginForm.invite = val.query.invite || ""
                console.log('123', val,this.loginForm.invite)
            },
            immediate: true
        },
    },
    methods: {
        // 查看协议
        onViewAgreement () {
            this.$refs.dialogAgreement.showModel()
        },
        handleSend() {
            // 判断是否可以发送（时间限制）
            if (this.msgKey) return;
            // 发送验证码
            this.$refs.loginForm.validateField("phone", (valid) => {
                if (!valid) {
                    // phone 字段验证通过后，弹出滑块验证
                    this.$refs.verify.show();
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
        showpassWord() {
            this.passWordType == ""
                ? (this.passWordType = "passWord")
                : (this.passWordType = "");
        },
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    if (!this.loginForm.agreementCheck) {
                        this.$message.warning("请先阅读并同意用户协议");
                        return
                    }
                    this.$axios({
                        method:'post',
                        url:'/admin/merchant/register',
                        data:JSON.stringify(this.loginForm),
                        headers:{
                            'Content-Type':'application/json;charset=utf-8'      //改这里就好了
                        }
                    }).then(res => {
                        this.$message.success("注册成功");
                        this.$emit('showSucceedPage', this.loginForm.phone);
                    })
                }
            });
        },
        /**
         * 滑动验证码，验证成功后
         */
        verifySuccess(params) {
            this.loginForm.code = params.captchaVerification;
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
        },
    },
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
</style>
