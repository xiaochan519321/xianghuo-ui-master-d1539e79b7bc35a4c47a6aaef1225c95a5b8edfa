<template>
    <el-form
        ref="loginForm"
        :rules="loginRules"
        :model="loginForm"
        class="login-form"
        label-width="0"
    >
        <el-form-item prop="mobile">
            <el-input
                v-model="loginForm.mobile"
                clearable
                size="small"
                auto-complete="off"
                placeholder="请输入手机号码"
                @keyup.enter.native="handleLogin"
            >
                <i slot="prefix" class="icon-iphone" />
            </el-input>
        </el-form-item>
        <el-form-item prop="code">
            <div class="flex mt10">
                <el-input
                    v-model="loginForm.code"
                    clearable
                    size="small"
                    auto-complete="off"
                    placeholder="请输入验证码"
                    @keyup.enter.native="handleLogin"
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
        <el-form-item>
            <el-button
                size="small"
                type="primary"
                class="login-submit"
                @click.native.prevent="handleLogin"
                >登录</el-button
            >
        </el-form-item>
    </el-form>
</template>

<script>
const MSGINIT = "发送验证码",
    MSGSCUCCESS = "${time}秒后重发",
    MSGTIME = 60;
import { isvalidatemobile } from "@/util/validate";
import { mapGetters } from "vuex";
import request from "@/router/axios";
import { getCode } from "@/api/code";
import Verify from "@/components/verifition/Verify";
export default {
    name: "Codelogin",
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
        return {
            msgText: MSGINIT,
            msgTime: MSGTIME,
            msgKey: false,
            loginForm: {
                mobile: "",
                code: "",
                blockCode: "",
                randomStr: "blockPuzzle",
            },
            loginRules: {
                mobile: [{ required: true, trigger: "blur", validator: validatePhone }],
                code: [{ required: true, trigger: "blur", validator: validateCode }],
            },
        };
    },
    computed: {
        ...mapGetters(["tagWel"]),
    },
    methods: {
        handleSend() {
            // 判断是否可以发送（时间限制）
            if (this.msgKey) return;
            // 发送验证码
            this.$refs.loginForm.validateField("mobile", (valid) => {
                if (!valid) {
                    // mobile 字段验证通过后，弹出滑块验证
                    this.$refs.verify.show();
                }
            });
        },
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.$store.dispatch("LoginByPhone", this.loginForm).then(() => {
                        this.$store.dispatch("GetMenu", { type: true, id: null }).then(async res => {
                            if (res.length !== 0) {
                                await this.$router.$avueRouter.formatRoutes(res, true);
                                this.$router.push({ path: this.tagWel.value });
                            }
                        });
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
        /**
        * 滑动验证码，验证成功后
        */
        verifySuccess(params) {
            this.loginForm.blockCode = params.captchaVerification;
            request({
                url: "/admin/mobile/" + this.loginForm.mobile,
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

<style lang="scss" scoped="scoped"></style>
