<template>
    <div class="container" ref="main">
        <div class="header-container">
            <div class="header-top">
                <div class="right" style="float: left;margin-top: 20px;">
                    <el-button type="primary" style="width: 106x; margin-left: 20px;" @click="onService">联系客服</el-button>
                    <el-button  type="primary" style="width: 121; margin-left: 20px;" @click="onDownClient">下载客户端</el-button>
                </div>
            </div>
            <div class="header-login-wrap">
                <div class="rbox">
                    <div style="width:100%;" v-if="siteConfig.id == 1">
                        <img src="@/assets/logo-img.png" style="margin:30px auto;display: block;"/>
                    </div>
                    <div style="width:100%; text-align:center;" v-if="siteConfig.id == 1810202544216821762">
                        <p class="topText">极速交易</p>
                    </div>
                    <div style="width:100%; text-align:center;" v-if="siteConfig.id == 1810565944151515137">
                        <p class="topText">
                            <img src="@/assets/jlds.png" style="width: 60px;height: 60px;"/>
                            截流大师拍单
                        </p>
                    </div>
                    <div style="width:100%; text-align:center;" v-if="siteConfig.id == 1766060302561169409">
                        <img src="@/assets/lm-logo.png" style="margin:30px auto;display: block;"/>
                    </div>
                    <div style="width:100%; text-align:center;" v-if="siteConfig.id == 1813891945346191362">
                        <img src="@/assets/jj-logo.png" style="margin:30px auto;display: block;"/>
                    </div>
                    <div style="width:100%; text-align:center;" v-if="siteConfig.id == 1817835750357606401">
                        <p class="topText">拍单交易</p>
                    </div>
                    <!-- 重置密码 -->
                    <div v-if="isResetPassword">
                        <reset-password @showLogin="isResetPassword = false"></reset-password>
                    </div>
                    <!-- 注册 -->
                    <div v-if="isRegisterPassword">
                        <register @loginShow="isRegisterPassword = false"></register>
                    </div>
                    <div class="login-and-register" v-else-if="!isResetPassword">
                        <!-- 登录 -->
                        <div class="login-main">
                            <div class="tabs">
                                <div class="nav-wrap">
                                    <div class="nav-scroll">
                                        <div
                                            class="active-bar"
                                            :style="
                                                ` transform: translateX(${
                                                    loginMode === 'user'
                                                        ? '50px'
                                                        : '195px'
                                                });`
                                            "
                                        ></div>
                                        <span
                                            :class="
                                                `${
                                                    loginMode === 'user'
                                                        ? 'active-tab'
                                                        : ''
                                                }`
                                            "
                                            @click="loginMode = 'user'"
                                        >账号登录</span>
                                        <span 
                                            style="margin-left: 80px;"
                                            :class="
                                                `${
                                                    loginMode === 'code'
                                                        ? 'active-tab'
                                                        : ''
                                                }`
                                            "
                                            @click="loginMode = 'code'"
                                        >短信登录</span>
                                    </div>
                                </div>
                            </div>
                            <userLogin
                                v-if="loginMode === 'user'"
                                @handlerRegister="isRegisterPassword = true"
                                @handlerReset="isResetPassword = true"
                            />
                            <codeLogin v-if="loginMode === 'code'" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <DialogCustom ref="DialogCustom" />
    </div>
</template>
<script>
import userLogin from './userlogin'
import codeLogin from './codelogin'
import resetPassword from './resetPassword'
import register from './register'
import { mapGetters } from 'vuex'
import { getStore, setStore } from '@/util/store'
import topColor from '@/page/index/top/top-color'
import { getCallbackQuery } from '@/util/util'
import DialogCustom from '@/components/dialog/DialogCustom'

export default {
    name: 'Login',
    components: {
        userLogin,
        codeLogin,
        topColor,
        register,
        resetPassword,
        DialogCustom
    },
    data() {
        return {
            site: {
                title: '',
                domain: undefined,
                freeDomain: undefined,
                htLogo: '',
                icon: '',
                icp: ''
            },
            tenantList: [],
            active: '',
            // 登录或者注册
            activeTab: 'login',
            // 账号密码登录 或者 手机验证码登录
            loginMode: 'user',
            socialForm: {},
            caseList: [
                '/img/index/case1.png',
            ],
            // 是否重置密码
            isResetPassword: false,
            //注册
            isRegisterPassword: false,
            scrollTop: 0,
            system: '',
            url: '' //图文教程
        }
    },
    watch: {
        $route: {
            handler(val, oldVal) {
                console.log('val', val)
                const params = this.$route.query
                // if (!this.validatenull(params.d_auth_code)) {
                //     const loading = this.$loading({
                //         lock: true,
                //         text: `登录中,请稍后。。。`,
                //         spinner: 'el-icon-loading'
                //     })
                //     // 授权店铺回调地址自动登录
                //     this.$store.dispatch('LoginByShop', {code: params.d_auth_code})
                //     .then(() => {
                //         loading.close()
                //         this.$store.dispatch("GetMenu", { type: true, id: null }).then(async res => {
                //             if (res.length !== 0) {
                //                 await this.$router.$avueRouter.formatRoutes(res, true);
                //                 this.$router.push({ path: this.tagWel.value });
                //             }
                //         });
                //     }).catch(() => {
                //         loading.close()
                //     })
                // } else if (!this.validatenull(params.state) && !this.validatenull(params.code)) {
                //     this.socialForm.state = params.state
                //     this.socialForm.code = params.code

                //     const loading = this.$loading({
                //         lock: true,
                //         text: `登录中,请稍后。。。`,
                //         spinner: 'el-icon-loading'
                //     })
                //     this.$store.dispatch('LoginBySocial', this.socialForm)
                //     .then(() => {
                //         loading.close()
                //         this.$router.push({ path: '/' })
                //     }).catch(() => {
                //         loading.close()
                //     })
                // }
            },
            immediate: true
        },
    },
    computed: {
        ...mapGetters(['tagWel', 'themeName', 'siteConfig']),
    },
    created() {
        const code = getCallbackQuery(window.location.href, 'code')
        const routeCode = this.$route.query.code
        // 抖店服务市场点击去使用的时候需要先校验店铺是否有授权
        if (code && !routeCode) {
            window.location.href = `${window.location.origin}/dfh/shop/authCallback/3?code=${code}`
        }
        this.active = getStore({ name: 'tenantId' });
        // 没有选择主题的情况下，默认为 theme-default
        if (!this.themeName) {
            document.body.className = 'theme-default';
        } else {
            document.body.className = this.themeName;
        }
    },
    mounted() {},
    methods: {
        onDownClient () {
            console.log('this.siteConfig.pcDownloadLink', this.siteConfig.pcDownloadLink)
            window.open(this.siteConfig.pcDownloadLink)
        },
        onService() {
            this.$refs.DialogCustom.show()
        },
        handleCommand(command) {
            setStore({ name: 'tenantId', content: command })
        },
        // 滚动到头部
        scrollToTop() {
            var timer = setInterval(() => {
                var backTop = this.$refs.main.scrollTop;
                var speedTop = backTop / 10;
                //修改当前视口的数值，产生向上活动的效果
                this.$refs.main.scrollTop = (backTop - speedTop);
                if (backTop == 0) {
                    //结束函数执行
                    clearInterval(timer);
                }
            }, 20);
        },

        showSucceedMsg() {
            this.$notify({
                title: '成功',
                message: '注册成功!',
                type: 'success'
            });
            this.activeTab = 'login'
        },
        // 插入在线客服
        insertService (src) {
            if (!src) {
                return
            }
            // 插入在线客服脚本
            let serviceScript = document.querySelector("script[data-type='serviceScript']")
            if (serviceScript) {
                // 如果存在该脚本，则展示浮窗
                // 右边浮窗
                const icon_module = document.getElementById('icon_module')
                if (icon_module) icon_module.style.display = 'block'
                // 底部在线联系
                const div_company_mini = document.getElementById('div_company_mini')
                if (div_company_mini) div_company_mini.style.display = 'block'
            } else {
                let _53code = document.createElement("script")
                _53code.setAttribute("data-type","serviceScript")
                _53code.src = src
                let s = document.getElementsByTagName("script")[0]
                s.parentNode.insertBefore(_53code, s)
            }
        }
    },
    beforeDestroy () {
        // 右边浮窗
        const icon_module = document.getElementById('icon_module')
        if (icon_module) icon_module.style.display = 'none'
        // 底部在线联系
        const div_company_mini = document.getElementById('div_company_mini')
        if (div_company_mini) div_company_mini.style.display = 'none'
    }
}
</script>

<style lang="scss" scoped="scoped">
.container {
    height: 100%;
    position: relative;
    .header-container {
        position: relative;
        width: 100%;
        min-height: 100vh;
        background-image: url(~@/assets/logo-bj.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        overflow: auto;
    
        .header-login-wrap {
            width: 400px;
            min-height: 350px;
            position: absolute;
            top: 15%;
            left: 55%;
            .rbox {
                width: 100%;
                padding: 10px 45px;
                height: 100%;
                background: #fff;
                box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
                .tabs {
                    font-size: 16px;
                    color: #A2A9AF;
                    line-height: 30px;
                    text-align: center;
                    .nav-wrap {
                        .nav-scroll {
                            position: relative;
                            .active-tab {
                                color: #0DC36E;
                            }
                        }
                        span {
                            padding-bottom: 20px;
                            cursor: pointer;
                        }
                        .active-bar {
                            position: absolute;
                            bottom: -2px;
                            left: 0;
                            height: 3px;
                            z-index: 1;
                            background: #0DC36E;
                            width: 65px;
                        }
                    }
                }
                .footer {
                    width: 100%;
                    font-size: 13px;
                    text-align: center;
                    color: #8998ac;
                }
                .topText {
                    width: 100%;
                    margin: 20px 0;
                    font-size: 33px;
                    color: #0DC36E;
                    font-weight: bold;
                }
            }
        }
    }
}
::v-deep .el-tabs__item {
    font-size: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 32px;
}
::v-deep .el-tabs__header {
    margin: 0;
}
::v-deep .el-tabs__item:hover {
    color: $themeColor;
}
::v-deep .el-tabs__item.is-active {
    color: $themeColor;
}
::v-deep .el-tabs__active-bar {
    background-color: $themeColor;
}
::v-deep .el-tabs__nav-wrap::after {
    background: #fff;
    color: $themeColor;
}
</style>
