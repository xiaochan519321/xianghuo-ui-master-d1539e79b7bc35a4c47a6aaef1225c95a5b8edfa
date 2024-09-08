<template>
  <div class="login-container flex items-center justify-center" id="App">
    <div class="wrapper">
      <div class="content">
        <div class="logo">
          <img src="https://funimg.pddpic.com/personal/login_footer.png" alt />
        </div>
        <div class="form">
          <div class="form-item">
            <div class="icon shouji">
              <img src="./images/shouji.png" alt />
            </div>
            <input
              v-model="formData.loginId"
              type="text"
              class="c-input"
              placeholder="手机号"
            />
          </div>
          <div class="form-item flex items-center">
            <div class="icon xinxi">
              <img src="./images/xinxi.png" alt />
            </div>
            <input
              v-model="formData.code"
              type="text"
              class="c-input flex-1"
              placeholder="验证码"
            />
            <button class="code" @click="onGetCode">
              <span>{{ msg }}</span>
            </button>
          </div>
          <div class="form-item">
            <button class="button confirm" @click.stop="onClickConfirm">
              <span>同意协议并登录</span>
            </button>
          </div>
          <div class="form-item">
            <button class="button cancel" @click="backUser">
              <span>返回</span>
            </button>
          </div>
        </div>
        <p class="desc">登录即表示同意 <strong>服务协议与隐私政策</strong></p>
      </div>
    </div>
  </div>
</template>

<script>
import {getCode,login} from '@/api/pdd/pdd';

export default {
  data() {
    return {
      formData: {
        loginId: "",
        etag: "",
        code: "",
        ip: "",
        verify_auth_token:"",
        proxyIp: "",
        proxyPort: ""
      },
      msg: "获取验证码",
      canClick: true,
      totalTime: 60,
    };
  },
  mounted() {
    this.formData.ip = returnCitySN.cip;
  },
  methods: {
    backUser(){
      this.$router.replace('/dfh/pdduser/index')
    },
    /**
     * 获取验证码
     */
    async onGetCode() {
      let than = this;
      if (this.formData.loginId === "") return;
      /* this.$confirm('是就是不是就不是否则收不到验证码', '您的账号是新注册的吗？', {
          confirmButtonText: '是',
          cancelButtonText: '不是',
          type: 'warning'
      }).then(() => {
        this.formData.ip = "";
        this.getCode();
      }).catch(() => {     
        this.formData.ip = returnCitySN.cip;   
        this.getCode();
      }); */
      this.getCode();
    },
    async getCode() {
      if (this.canClick) {
        await this.fetchCode();
        
        /* this.canClick = false;
        this.msg = `${this.totalTime}s`;
        const clock = setInterval(() => {
          this.totalTime--;
          this.msg = `${this.totalTime}s`;
          if (this.totalTime < 0) {
            clearInterval(clock);
            this.msg = "重新获取";
            this.totalTime = 60;
            this.canClick = true;
          }
        }, 1000); */
      }
    },
    /**
     * 发送获取验证码
     */
    fetchCode() {
      var than = this;
      const { formData } = this;
      var obj = {
        loginId: formData.loginId,
        ip: formData.ip,
        verify_auth_token: formData.verify_auth_token
      };
      getCode(obj).then(data => {
        if(data.data.status == 400){
          if(undefined != data.data.verify_auth_token) {
            formData.verify_auth_token = data.data.verify_auth_token;
            than.msg = "重新获取";
            const url = "https://mobile.pinduoduo.com/psnl_verification.html?VerifyAuthToken="+data.data.verify_auth_token
            if (window.electron) {
            // 发送到electron进行跳转
                window.electron.send({key: 'chromeUrl', url: url})
            } else {
                window.open(url)
            }
          }
        } else if (data.data.status == 500){
          this.$message.error('验证码发送失败请重试');
        }else{
          this.$message.success('验证码发送成功');
          formData.etag = data.data.data.etag;
          formData.proxyIp = data.data.data.proxyIp;
          formData.proxyPort = data.data.data.proxyPort;
        }
      }).catch(() => {
          loading();
      });
    },
    /**
     * 登录
     */
    onClickConfirm() {
      if ('' == this.formData.loginId || '' == this.formData.code) {
        return this.$message.error('手机号或验证码不能为空') 
      }
      login(this.formData).then(data => {
        this.$message.success('登录成功')
      }).catch(() => {
          this.tableLoading=false
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}

.flex-1 {
  flex: 1;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

button{
    border: 0;
    outline: none;
}

img{
    max-width: 100%;
    max-height: 100%;
}

.login-container {
  width: 100%;
  height: 100vh;
  background: rgba(240, 243, 247, 1);
  .wrapper {
    width: 1000px;
    height: 456px;
    background: url("./images/bg.png") no-repeat;
    background-size: cover;
    .content {
      width: 368px;
      margin: 0 auto;
      .logo {
        width: 256px;
        height: 130px;
        margin: 0 auto;
      }
      .desc{
        margin-top: 60px;
        text-align: center;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
      }
      .form {
        .form-item {
          margin-bottom: 24px;
          position: relative;
          .icon {
            position: absolute;
            &.shouji {
              left: 15px;
              top: 13px;
            }
            &.xinxi {
              left: 13px;
              top: 13px;
            }
          }
          .c-input {
            width: 100%;
            height: 40px;
            padding-left: 40px;
            box-sizing: border-box;
            border: 1px solid #d9d9d9;
          }
          .code {
            width: 102px;
            height: 40px;
            background: #ffffff;
            border-radius: 2px;
            border: 1px solid #d9d9d9;
            box-sizing: border-box;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
            margin-left: 8px;
          }
          .button {
            width: 100%;
            height: 40px;
            background: #ffffff;
            border-radius: 2px;
            font-size: 16px;
            cursor: pointer;
          }
          .confirm {
            background: #e02e24;
            color: #ffffff;
          }
          .cancel {
            color: #e02e24;
            border: 1px solid #e02e24;
            box-sizing: border-box;
          }
          .desc {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.45);
          }
        }
      }
    }
  }
}
</style>