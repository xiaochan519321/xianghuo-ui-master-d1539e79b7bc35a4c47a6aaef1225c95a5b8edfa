<template>
  <div>
    <el-form :model="loginForm" ref="loginForm"  class="login">
      <el-form-item>
        <div class="user">登录</div>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input
          v-if="Object.getOwnPropertyNames(this.userInfo).length === 1"
          v-model="loginForm.phone"
          placeholder="请输入手机号码"
        >
          <i slot="prefix" class="el-input__icon el-icon-mobile"></i>
        </el-input>
        <el-input
          v-else
          v-model="this.userInfo.loginId"
          placeholder="请输入手机号码"
        >
          <i slot="prefix" class="el-input__icon el-icon-mobile"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" class="code">
        <el-input v-model="loginForm.code" placeholder="验证码">
          <i slot="prefix" class="el-input__icon el-icon-lock"></i>
        </el-input>
        <el-button
          class="code-item"
          plain
          :disabled="isCounting"
          @click="sendVerificationCode"
        >
          {{ isCounting ? `${countDown} 秒后重发` : "发送验证码" }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <div class="login-form" @click="login()">登录</div>
      </el-form-item>
      <el-form-item>
        <div class="login-return" @click="returnBtn()">返回</div>
      </el-form-item>
      <el-form-item>
        <div class="policy">
          <el-checkbox v-model="radio" style="margin-right: 10px">
            同意
          </el-checkbox>
          <span style="color: #0f6df6">服务协议和隐私政策</span>
        </div>
      </el-form-item>
    </el-form>
    <!-- <div>
      <div :style="style">
        <div class="login-form" @click="login()">登录</div>
      </div>
      <div :style="style">
        <div class="login-return">返回</div>
      </div>
      <div class="policy" :style="style">
        <el-checkbox v-model="radio" style="margin-right: 10px">
          同意
        </el-checkbox>
        <span style="color: #0f6df6">服务协议和隐私政策</span>
      </div>
    </div> -->
  </div>
</template>

<script>
import { pddGetCode, pddLogin } from "../../../api/pdduser";
export default {
  props: {
    userInfo: {
      type: Object,
    },
  },
  data() {
    return {
      isCounting: false,
      countDown: 60,
      radio: false,
      phone: "",
      timer: null,
      loginForm: {
        phone: "",
        code: "",
      },
      rules: {
        phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      //   style: {
      //     display: "flex",
      //     justifyContent: "center",
      //     marginBottom: "10px",
      //   },
    };
  },
  methods: {
    // 获取验证码
    async sendVerificationCode() {
      if (this.loginForm.phone === "" && this.userInfo.loginId == undefined) {
        this.$message.error('请输入手机号');
        return;
      }
      this.isCounting = true;
      this.timer = setInterval(() => {
        if (this.countDown > 0) {
          this.countDown--;
        } else {
          this.isCounting = false;
          this.countDown = 60;
          clearInterval(this.timer);
        }
      }, 1000);
      if (this.userInfo) {
        this.phone = this.userInfo.loginId;
      }
      if (Object.getOwnPropertyNames(this.userInfo).length === 1) {
        this.phone = this.loginForm.phone;
      }
      // const params = {
      //   phone: this.phone,
      // };
      const res = await pddGetCode(this.phone);
      console.log(res, "验证码");
      if (res.data.data.code === 200) {
        this.$message({
          showClose: true,
          message: res.data.data.msg,
          type: "success",
        });
      }
    },
    // 清除定时器
    clearTimer() {
      this.isCounting = false;
      this.countDown = 60;
      this.loginForm.phone = '';
      this.loginForm.code = '';
      this.radio = false
      clearInterval(this.timer);
    },
    // 登陆
    async login() {
      if (this.loginForm.phone === "" && this.userInfo.loginId == undefined) {
        this.$message.error('请输入手机号');
        return;
      }
      if (this.loginForm.code === "") {
        this.$message.error('请输入验证码');
        return;
      }
      if (!this.radio) {
        this.$message({
          message: "请勾选服务协议和隐私政策",
          type: "warning",
        });
        return;
      }
      if (this.userInfo) {
        this.phone = this.userInfo.loginId;
      }
      if (Object.getOwnPropertyNames(this.userInfo).length === 1) {
        this.phone = this.loginForm.phone;
      }
      // const params = {
      //   pohone:this.phone,
      //   code:this.loginForm.code
      // }
      const res = await pddLogin(this.phone, this.loginForm.code);
      console.log(res, "登录成功");
    },
    // 返回
    returnBtn() {
      this.$emit("returnHandler");
    },
  },
};
</script>

<style lang='scss' scoped>
.login {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .user {
    color: #000;
    font-size: 16px;
    font-weight: 700;
    text-align: center;
  }
  .el-input {
    width: 300px;
  }
}
.login-form,
.login-return {
  width: 280px;
  height: 40px;
  background-color: #e62626;
  text-align: center;
  border-radius: 5px;
  line-height: 40px;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}
.login-return {
  background-color: #fff;
  color: #e62626;
  border: 1px solid #e62626;
}
.code {
  position: relative;
  .code-item {
    position: absolute;
    top: 0;
    right: 0;
    margin: 8px 2px 0 0;
    width: 80px;
    height: 22px;
    border: none;
    line-height: 4px;
    padding-left: 10px;
    font-size: 12px;
    border-radius: 3px;
    cursor: pointer;
  }
}
.policy {
  width: 280px;
  font-weight: 700;
}
</style>