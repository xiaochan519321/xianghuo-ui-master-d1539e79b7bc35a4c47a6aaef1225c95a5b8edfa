<template>
    <div class="container" ref="main">
        <div class="header-container">
            <div class="header-top">
                <div class="header-content">
                    <div class="lbox">
                        <img class="img" :src="siteConfig.htLogo" />
                    </div>
                    <div class="rbox" v-if="active != 1">
                        <button class="login-btn" @click="activeTab = 'login'">登录</button>
                        <button class="register-btn ml18" @click="activeTab = 'register'">注册</button>
                    </div>
                </div>
            </div>
            <div class="header-login-wrap">
                <div class="lbox">
                    <div class="title">一键代发的智能化多店铺管理系统</div>
                    <div class="translations">
                        INTELLIGENT MULTI STORE MANAGEMENT SYSTEM FOR ONE CLICK
                        ORDER TAKING
                    </div>
                    <div class="advantage-wrap">
                        <div>
                            <span class="advantage">让你的店铺利润直接提升30%</span>
                            <i class="iconfont icon-downarrow"></i>
                            <button class="btn" @click="activeTab = 'register'" v-if="active != 1">现在开始</button>
                        </div>
                    </div>
                </div>
                <div class="rbox" v-if="active != 1">
                    <div class="login-weaper animated bounceInDown">
                        <!-- 重置密码 -->
                        <div class="reset" v-if="isResetPassword">
                            <reset-password @showLogin="isResetPassword = false"></reset-password>
                        </div>
                        <div class="login-and-register" v-else>
                            <div class="tabs">
                                <div class="nav-wrap">
                                    <div class="nav-scroll">
                                        <div
                                            class="active-bar"
                                            :style="
                                                ` transform: translateX(${
                                                    activeTab === 'register'
                                                        ? '44px'
                                                        : '254px'
                                                });`
                                            "
                                        ></div>
                                        <span
                                            :class="
                                                `${
                                                    activeTab === 'register'
                                                        ? 'active-tab'
                                                        : ''
                                                }`
                                            "
                                            @click="activeTab = 'register'"
                                        >注册</span>
                                        <span
                                            :class="
                                                `${
                                                    activeTab === 'login'
                                                        ? 'active-tab'
                                                        : ''
                                                }`
                                            "
                                            @click="activeTab = 'login'"
                                        >登录</span>
                                    </div>
                                </div>
                            </div>
                            <!-- 登录 -->
                            <div class="login-border" v-if="activeTab === 'login'">
                                <div class="login-main">
                                    <div class="tabs">
                                        <div class="nav-wrap">
                                            <div class="nav-scroll">
                                                <div
                                                    class="active-bar"
                                                    :style="
                                                        ` transform: translateX(${
                                                            loginMode === 'user'
                                                                ? '56px'
                                                                : '266px'
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
                                                >账户密码登录</span>
                                                <span
                                                    :class="
                                                        `${
                                                            loginMode === 'code'
                                                                ? 'active-tab'
                                                                : ''
                                                        }`
                                                    "
                                                    @click="loginMode = 'code'"
                                                >手机号登录</span>
                                            </div>
                                        </div>
                                    </div>
                                    <userLogin
                                        v-if="loginMode === 'user'"
                                        @handlerReset="isResetPassword = true"
                                    />
                                    <codeLogin v-if="loginMode === 'code'" />
                                </div>
                            </div>
                            <!-- 注册 -->
                            <register v-else></register>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <!-- 核心优势 -->
            <div class="advantages">
                <div class="title">
                    <img src="/img/index/advantages-title.png" />
                </div>
                <div class="advantages-box">
                    <div class="row">
                        <div class="cell">
                            <div class="img">
                                <img class="icon" src="/img/index/advantages1.png" />
                            </div>
                            <div class="text">全网首家全自动采购</div>
                            <div class="describe">无需准备采购账号，云端解决方案，秒级采购速度，实现全自动付款，自动同步物流发货，直接解放你的双手。</div>
                            <!-- <div class="describe">无需准备拼多多账号，云端解决方案，秒级采购速度，实现全自动付款，自动同步物流发货，直接解放你的双手。</div> -->
                        </div>
                        <div class="cell">
                            <div class="img">
                                <img class="icon" src="/img/index/advantages2.png" />
                            </div>
                            <div class="text">店铺利润提升30%</div>
                            <div class="describe">省钱利器，自动帮你领取平台优惠和进宝佣金，参与平台商品活动!让你采购利润直接上升30%。</div>
                        </div>

                        <div class="cell">
                            <div class="img">
                                <img class="icon" src="/img/index/advantages3.png" />
                            </div>
                            <div class="text">全面支持多店铺管理</div>
                            <div class="describe">可以同时管理多家店铺，为打单软件从业者贴身打造，同时可以开设子账号管理店铺订单。</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 核心功能 -->
            <div class="functionality">
                <div class="title">
                    <img class="img" src="/img/index/functionality-title.png" />
                </div>
                <div class="functionality-box">
                    <div class="row">
                        <div class="cell">
                            <div class="icon-wrap">
                                <i class="iconfont icon-analysis" />
                            </div>
                            <div class="text">数据统计分析</div>
                            <div class="describe">搭配实时数据看板，可以同时监控多个店铺，运营状况一目了然。</div>
                        </div>
                        <div class="cell">
                            <div class="icon-wrap">
                                <i class="iconfont icon-store" />
                            </div>
                            <div class="text">店铺/商品管理</div>
                            <div class="describe">批量管理线上商品、批量管理店铺、一键清理无流量、低质量商品。</div>
                        </div>
                        <div class="cell">
                            <div class="icon-wrap">
                                <i class="iconfont icon-decode" />
                            </div>
                            <!-- <div class="text">自动化解密</div> -->
                            <div class="text">自动化</div>
                            <!-- <div class="describe">自动化解密店铺订单，更加便捷的代发流程，没有解密之忧。</div> -->
                            <div class="describe">自动化店铺订单，更加便捷的代发流程</div>
                        </div>
                        <div class="cell">
                            <div class="icon-wrap">
                                <i class="iconfont icon-deliver" />
                            </div>
                            <div class="text">一键代发/自动发货</div>
                            <div class="describe">一键同步订单、一键批量采购代发。</div>
                        </div>
                        <div class="cell">
                            <div class="icon-wrap">
                                <i class="iconfont icon-service" />
                            </div>
                            <div class="text">优质服务</div>
                            <div class="describe">短时间内解决用户需求，提高用户体验。</div>
                        </div>
                        <div class="cell">
                            <div class="icon-wrap">
                                <i class="iconfont icon-living" />
                            </div>
                            <div class="text">数据大屏</div>
                            <div class="describe">可视化大屏主要作为商家查看订单采购实时数据，方便及时了解数据变动。</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 下载/评价 -->
            <div class="appraise">
                <div class="cell">
                    <div class="box">
                        <i class="iconfont icon-user" />
                        <div class="num ml10">10000</div>
                    </div>
                    <div class="text">用户</div>
                </div>
                <div class="cell">
                    <div class="box">
                        <i class="iconfont icon-download" />
                        <div class="num ml10">10000</div>
                    </div>
                    <div class="text">下载</div>
                </div>
                <div class="cell">
                    <div class="box">
                        <i class="iconfont icon-collect" />
                        <div class="num ml10">6000</div>
                    </div>
                    <div class="text">收藏</div>
                </div>
                <div class="cell">
                    <div class="box">
                        <i class="iconfont icon-like-fill" />
                        <div class="num ml10">13400</div>
                    </div>
                    <div class="text">好评</div>
                </div>
            </div>
            <!-- 数据案例 -->
            <div class="case">
                <div class="title">
                    <img class="img" src="/img/index/case-title.png" />
                </div>
                <div class="case-wrap">
                    <el-carousel
                        class="carousel"
                        height="800px"
                        direction="horizontal"
                        :autoplay="true"
                        arrow="always"
                    >
                        <el-carousel-item v-for="item in caseList" :key="item">
                            <img :src="item" />
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
            <!-- 为什么选择我们 -->
            <div class="vs">
                <div class="title">
                    <img class="img" src="/img/index/vs-title.png" />
                </div>
                <div class="vs-list">
                    <div class="contrast"></div>
                    <div class="lbox">
                        <span class="cell-title">{{ siteConfig.name }}ERP</span>
                        <!-- 更新速度 -->
                        <div class="cell">
                            <div class="left">
                                <i class="iconfont icon-update" />
                            </div>
                            <div class="right">
                                <div class="text">更新速度</div>
                                <div class="describe">
                                    <span>{{ siteConfig.name }}ERP</span>
                                    <span>为了让广大商家能拥有</span>
                                    <span class="highlight">更加良好更加先进的使用体验</span>
                                    <span>，在不断变化的市场中也在不断的升级进化，争取给广大商家提供更加便捷、高效的功能体验。</span>
                                </div>
                            </div>
                        </div>
                        <!-- 软件功能 -->
                        <div class="cell">
                            <div class="left">
                                <i class="iconfont icon-functionality" />
                            </div>
                            <div class="right">
                                <div class="text">软件功能</div>
                                <div class="describe">
                                    <!-- <span>
                                        {{
                                        siteConfig.name
                                        }}ERP功能集合全面，软件包含自动代发、自动解密、数据分析、店铺管理、站点活动推送等多样功能，
                                    </span> -->
                                    <span>
                                        {{
                                        siteConfig.name
                                        }}ERP功能集合全面，软件包含自动代发、数据分析、店铺管理、站点活动推送等多样功能，
                                    </span>
                                    <span class="highlight">真正的为商家服务，提高商家的利润。</span>
                                </div>
                            </div>
                        </div>
                        <!-- 用户体验 -->
                        <div class="cell">
                            <div class="left">
                                <i class="iconfont icon-experience" />
                            </div>
                            <div class="right">
                                <div class="text">用户体验</div>
                                <div class="describe">
                                    <span>{{ siteConfig.name }}ERP</span>
                                    <span class="highlight">软件服务中我们为商家做好了全面的使用指南视频</span>
                                    <span>，让用户能够快速上手了解软件操作，并且提供客服技术人员</span>
                                    <span class="highlight">全程跟踪服务，帮助用户解答软件疑问。</span>
                                </div>
                            </div>
                        </div>
                        <!-- 市场口碑 -->
                        <div class="cell">
                            <div class="left">
                                <i class="iconfont icon-reputation" />
                            </div>
                            <div class="right">
                                <div class="text">市场口碑</div>
                                <div class="describe">
                                    <span>{{ siteConfig.name }}ERP</span>
                                    <span>团队专注抖店市场许久，对打单软件市场有更加准确专业的判断，同时在软件内测运营过程中</span>
                                    <span class="highlight">
                                        超过99.85的用户对{{
                                        siteConfig.name
                                        }}ERP做出好评。
                                    </span>
                                </div>
                            </div>
                        </div>
                        <!-- 安全保护 -->
                        <div class="cell">
                            <div class="left">
                                <i class="iconfont icon-safety" />
                            </div>
                            <div class="right">
                                <div class="text">安全保护</div>
                                <div class="describe">
                                    <span>{{ siteConfig.name }}ERP有完善的</span>
                                    <span class="highlight">账户保护机制，对于用户隐私账户安全有非常高效的保障</span>
                                    <!-- <span>，缜密的卡密锁算法帮助用户保护隐私数据，让用户使用软件安心无忧。</span> -->
                                    <span>，缜密的算法帮助用户保护隐私数据，让用户使用软件安心无忧。</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rbox">
                        <span class="cell-title">其他软件</span>
                        <!-- 更新速度 -->
                        <div class="cell">
                            <div class="left">
                                <i class="iconfont icon-update" />
                            </div>
                            <div class="right">
                                <div class="text">更新速度</div>
                                <div class="describe">
                                    <span class="highlight">更新速度慢，且周期长</span>
                                    <span>，无法根据用户的实际使用体验优化软件功能，在高速发展的打单软件赛道中很难抓住一手的科技资源。</span>
                                </div>
                            </div>
                        </div>
                        <!-- 软件功能 -->
                        <div class="cell">
                            <div class="left">
                                <i class="iconfont icon-functionality" />
                            </div>
                            <div class="right">
                                <div class="text">软件功能</div>
                                <div class="describe">
                                    <span class="highlight">功能太过分散</span>
                                    <span>，部分功能还需要另行下载多个插件才能使用，并且功能不够全面，需要多个软件跳转才能完成整体操作，对刚入门用户信息不集中体验并不友好。</span>
                                </div>
                            </div>
                        </div>
                        <!-- 用户体验 -->
                        <div class="cell">
                            <div class="left">
                                <i class="iconfont icon-experience" />
                            </div>
                            <div class="right">
                                <div class="text">用户体验</div>
                                <div class="describe">
                                    <span>软件问题无法沟通理解，使用</span>
                                    <span class="highlight">门槛高，学习使用比较吃力</span>
                                    <span>，反馈问题无人跟进且处理时间长，对用户效益有很大损失。</span>
                                </div>
                            </div>
                        </div>
                        <!-- 市场口碑 -->
                        <div class="cell">
                            <div class="left">
                                <i class="iconfont icon-reputation" />
                            </div>
                            <div class="right">
                                <div class="text">市场口碑</div>
                                <div class="describe">
                                    <span>市场上打单软件软件</span>
                                    <span class="highlight">良莠不齐，鱼龙混杂</span>
                                    <span>，在打单软件这个大风口下催生出无数的ERP软件，对普通用户来说没有准确信息判断好坏很容易</span>
                                    <span class="highlight">错走一步，沦为“韭菜。</span>
                                </div>
                            </div>
                        </div>
                        <!-- 安全保护 -->
                        <div class="cell">
                            <div class="left">
                                <i class="iconfont icon-safety" />
                            </div>
                            <div class="right">
                                <div class="text">安全保护</div>
                                <div class="describe">
                                    <span>多家软件</span>
                                    <span class="highlight">用户资料泄露，滥用用户数据信息的新闻在市面上不断流传</span>
                                    <span>，用户在使用软件中不可避免的透露出个人隐私信息，而如何保护个人隐私信息却成为用户的头疼问题。</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 关于我们 -->
            <div class="about-us">
                <div class="lbox">
                    <div class="title">
                        <img class="img" src="/img/index/about-us-title.png" />
                    </div>
                    <div class="content">
                        <div class="text">我们的产品</div>
                        <!-- <div class="describe">
                            {{
                            siteConfig.name
                            }}是一家专门服务于抖店店群的代发系统，货源来自于拼多多为主，可多个店铺订单自动发给对应商家，提交售后订单，实时同步物流状态，批量解密并自动代发，全自动代发解放人工压力还节省采购成本，还是一家打单软件店群系统，提供店铺加盟合作让开店更简单，专注为客户提供店铺运营、商品管理和技术服务解决方案。
                        </div> -->
                        <div class="describe">
                            {{
                            siteConfig.name
                            }}是一家专门服务于抖店店群的代发系统，可多个店铺订单自动发给对应商家，提交售后订单，实时同步物流状态，批量自动代发，全自动代发解放人工压力还节省采购成本，还是一家打单软件店群系统，提供店铺加盟合作让开店更简单，专注为客户提供店铺运营、商品管理和技术服务解决方案。
                        </div>
                        <button class="btn" @click="scrollToTop">立即体验</button>
                    </div>
                </div>
                <div class="rbox">
                    <img class="img" src="/img/index/about-us-bg.png" />
                </div>
            </div>
            <!-- 入门指南 -->
            <!-- <div class="guide">
                <div class="title">{{ siteConfig.name }}快速入门指南</div>
                <div class="describe">
                    <div>观看视频教程，让你最短的时间内，对{{ siteConfig.name }}ERP使用方法和交互逻辑有一个直观的了解</div>
                    <div>并让你在使用软件时快速理解和使用各个功能板块</div>
                </div>
                <div class="video-wrap">
                    <video
                        class="video"
                        controls
                        preload="auto"
                    >
                        <source
                            src="https://img.turuijs.com/%E5%85%A8%E8%87%AA%E5%8A%A8%E4%BA%91%E6%8B%8D%E5%8D%95%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F.m4V"
                            type="video/mp4"
                        />
                        <source src="**.ogg" type="video/ogg" />--&gt; 您的浏览器暂不支持此视频
                    </video>
                </div>
                <button class="btn" @click="scrollToTop">立即体验</button>
            </div> -->
            <!-- 底部 -->
            <div class="footer">
                <div class="content">
                    <div class="lbox">
                        <img class="logo" :src="siteConfig.htLogo" />
                        <div class="tips">
                            <span>如果有任何问题，我们将为您解答</span>
                            <span>如果您需要任何帮助，我们将提供协助，请随时联系我们。</span>
                        </div>
                    </div>
                    <div class="cbox">
                        <div class="left-cell">
                            <div class="text">公司地址</div>
                            <div class="describe">{{ siteConfig.address }}</div>
                        </div>
                        <div class="right-cell">
                            <div class="cell">
                                <div class="text">服务时间</div>
                                <div class="describe">周一至周日 09:00～21:00</div>
                            </div>
                            <div class="cell">
                                <div class="text">咨询热线</div>
                                <div class="describe">{{ siteConfig.phone }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="rbox">
                        <div class="text">商务对接</div>
                        <div class="img-wrap">
                            <img class="QRCode" :src="siteConfig.contactQrcode" />
                        </div>
                    </div>
                </div>
                <div class="icp-wrap">
                    <div class="line"></div>
                    <div class="icp">
                        <a href="https://beian.miit.gov.cn/">{{ siteConfig.icp }}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import userLogin from './userlogin'
import codeLogin from './codelogin'
import resetPassword from './resetPassword'
import register from '../register/index'
import { mapGetters } from 'vuex'
import { getStore, setStore } from '@/util/store'
import topColor from '@/page/index/top/top-color'
import { getCallbackQuery } from '@/util/util'

export default {
    name: 'Login',
    components: {
        userLogin,
        codeLogin,
        topColor,
        register,
        resetPassword,
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
            scrollTop: 0,
        }
    },
    watch: {
        $route: {
            handler(val, oldVal) {
                console.log('val', val)
                const params = this.$route.query
                if (!this.validatenull(params.d_auth_code)) {
                    const loading = this.$loading({
                        lock: true,
                        text: `登录中,请稍后。。。`,
                        spinner: 'el-icon-loading'
                    })
                    // 授权店铺回调地址自动登录
                    this.$store.dispatch('LoginByShop', {code: params.d_auth_code})
                    .then(() => {
                        loading.close()
                        this.$store.dispatch("GetMenu", { type: true, id: null }).then(async res => {
                            if (res.length !== 0) {
                                await this.$router.$avueRouter.formatRoutes(res, true);
                                this.$router.push({ path: this.tagWel.value });
                            }
                        });
                    }).catch(() => {
                        loading.close()
                    })
                } else if (!this.validatenull(params.state) && !this.validatenull(params.code)) {
                    this.socialForm.state = params.state
                    this.socialForm.code = params.code

                    const loading = this.$loading({
                        lock: true,
                        text: `登录中,请稍后。。。`,
                        spinner: 'el-icon-loading'
                    })
                    this.$store.dispatch('LoginBySocial', this.socialForm)
                    .then(() => {
                        loading.close()
                        this.$router.push({ path: '/' })
                    }).catch(() => {
                        loading.close()
                    })
                }
            },
            immediate: true
        },
    },
    computed: {
        ...mapGetters(['tagWel', 'themeName', 'siteConfig'])
    },
    created() {
        const code = getCallbackQuery(window.location.href, 'code')
        const routeCode = this.$route.query.code
        // 抖店服务市场点击去使用的时候需要先校验店铺是否有授权
        if (code && !routeCode) {
            window.location.href = `${window.location.origin}/dfh/shop/authCallback/3?code=${code}`
        }
        this.watermark()
        this.active = getStore({ name: 'tenantId' });
        // 没有选择主题的情况下，默认为 theme-default
        if (!this.themeName) {
            document.body.className = 'theme-default';
        } else {
            document.body.className = this.themeName;
        }
        // if(location.href.indexOf("dppdf.cn") != -1){
        //   this.siteConfig.icp = "赣ICP备2022009579号-2";
        // }
    },
    mounted() {
        // this.$store.dispatch('GetSiteConfig', { type: true }).then(siteData => {
        //     // 分站信息
        //     console.log('siteData', siteData)
        //     this.insertService('https://tb.53kf.com/code/code/663503d0b7944b376451176586c976076/1')
        // })
    },
    methods: {
        handleCommand(command) {
            setStore({ name: 'tenantId', content: command })
        },
        watermark() {
            const text = ''
            const canvas = document.createElement('canvas')
            canvas.width = '500'
            canvas.height = '200'
            const ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, 200, 200) // 绘制之前画布清除
            ctx.font = '30px 黑体'
            ctx.rotate(-20 * Math.PI / 180) // 为了实现水印倾斜效果,旋转画布坐标系
            ctx.fillStyle = 'rgba(100,100,100,0.15)' // 画笔颜色
            ctx.fillText(text, -20, 200) // 书写的内容及位置
            ctx.rotate('20*Math.PI/180') // 坐标系还原,如果后续没有其他操作,这一步可以省略
            // 将canvas的内容转换为base64编码
            const data = canvas.toDataURL('image/png', 1) // 1表示质量(无损压缩)

            window.onload = () => {
                const background = 'url(' + data + ') repeat'
                var watermark = document.createElement('div')
                watermark.style.width = '100%'
                watermark.style.height = '100%'
                watermark.style.position = 'fixed'
                watermark.style.left = '0'
                watermark.style.top = '0'
                watermark.style.pointerEvents = 'none'
                watermark.style.background = background
                watermark.style.zIndex = '9999'
                document.body.append(watermark)
            }
        },
        /**
        * 滚动到头部
        */
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
// @import "@/styles/login.scss";

.container {
    height: 100%;
    overflow: hidden auto;
    position: relative;
    user-select: none;
    .header-top {
        background-color: rgba(49, 61, 87, 0.4);
        .header-content {
            display: flex;
            .lbox {
                display: flex;
                flex: 1 1 auto;
                padding: 6px 0 0 97px;
                .img {
                    height: 64px;
                }
            }
            .rbox {
                padding: 14px 265px 14px 0;
                .login-btn {
                    width: 108px;
                    height: 36px;
                    background: #3f9eff;
                    border-radius: 3px;
                    border: 0;
                    color: #fff;
                    font-size: 16px;
                    font-weight: 600;
                    line-height: 24px;
                }
                .register-btn {
                    width: 108px;
                    height: 36px;
                    border: 1px solid #dedede;
                    border-radius: 3px;
                    background: rgba(49, 61, 87, 0.7);
                    color: #fff;
                    font-size: 16px;
                    line-height: 24px;
                }
            }
        }
    }
    .header-container {
        position: relative;
        width: 100%;
        height: 931px;
        z-index: 1;
        background: url("/img/index/header-bg.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: top;
        background-color: #fff;

        .header-login-wrap {
            display: flex;
            .lbox {
                display: flex;
                flex-direction: column;
                padding-top: 235px;
                padding-bottom: 17px;
                margin: 0 auto;
                .title {
                    font-size: 60px;
                    font-weight: 600;
                    color: #ffffff;
                    line-height: 79px;
                }
                .translations {
                    height: 26px;
                    font-size: 18px;
                    font-weight: 600;
                    color: #ffffff;
                    line-height: 26px;
                    padding: 17px 0 66px 0;
                }
                .advantage-wrap {
                    .advantage {
                        font-size: 25px;
                        font-weight: 600;
                        color: #989ba6;
                        line-height: 36px;
                    }
                    .iconfont {
                        padding-left: 13px;
                        font-size: 28px;
                        font-weight: 600;
                        color: #989ba6;
                        line-height: 36px;
                    }
                    .btn {
                        margin-left: 51px;
                        width: 180px;
                        height: 60px;
                        background: #3f9eff;
                        border-radius: 3px;
                        font-size: 20px;
                        font-weight: 600;
                        color: #ffffff;
                        border: 0;
                    }
                }
            }
            .rbox {
                min-width: 497px;
                margin: 106px auto 0 auto;
                height: 570px;
                background: #ffffff;
                box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
                border-radius: 19px;
                .login-weaper {
                    box-shadow: unset;
                    border-radius: 19px;
                }
                .tabs {
                    margin: 45px 0 40px 0;
                    font-size: 20px;
                    font-weight: 600;
                    color: #6f6f6f;
                    line-height: 37px;
                    .nav-wrap {
                        border-bottom: 1px solid #979797;
                        .nav-scroll {
                            display: flex;
                            justify-content: space-around;
                            position: relative;
                            .active-tab {
                                color: #000000;
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
                            background-color: #46B46D;
                            width: 122px;
                            transition: transform 0.3s
                                cubic-bezier(0.645, 0.045, 0.355, 1);
                        }
                    }
                }
                .login-main {
                    .tabs {
                        margin: 0;
                        padding-bottom: 30px;
                        font-weight: 400;
                        font-size: 18px;
                        color: #666666;
                        line-height: 25px;
                        .nav-wrap {
                            border-bottom: 0;
                            .nav-scroll {
                                .active-tab {
                                    color: #46B46D;
                                }
                                .active-bar {
                                    width: 110px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .content {
        .advantages {
            background: url("/img/index/advantages-bg.png");
            background-repeat: no-repeat;
            background-size: cover;
            background-position: top;
            padding: 0 183px 77px 182px;
            .title {
                text-align: center;
                padding: 100px 0 40px 0;
            }
            .advantages-box {
                display: flex;
                align-items: center;
                justify-content: center;
                .row {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(400px, 500px));
                    gap: 30px;
                    height: 492px;
                    .cell {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        background: #ffffff;
                        box-shadow: 0px 4px 40px 0px rgba(43, 89, 255, 0.22);
                        border-radius: 10px;
                        .img {
                            display: flex;
                            align-items: flex-end;
                            padding: 70px 100px 35px 100px;
                        }
                        .text {
                            font-size: 20px;
                            line-height: 26px;
                            font-weight: 600;
                            color: #333333;
                        }
                        .describe {
                            font-size: 16px;
                            font-weight: 400;
                            color: #000b33;
                            line-height: 26px;
                            padding: 14px 66px 0 66px;
                        }
                    }
                }
            }
        }
        .functionality {
            .title {
                text-align: center;
                height: 165px;
                background: url("/img/index/functionality-bg.png");
                background-repeat: no-repeat;
                background-size: cover;
                background-position: top;
                .img {
                    padding-top: 62px;
                }
            }
            .functionality-box {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 16px 0 62px 0;
                .row {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(360px, 416px));
                    gap: 30px;
                    .cell {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        background: #ffffff;
                        border-radius: 10px;
                        border: 1px solid #e8ecfb;
                        box-shadow: 0px 4px 40px 0px rgba(43, 89, 255, 0.16);
                        height: 329px;
                        .icon-wrap {
                            width: 80px;
                            height: 80px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin: 50px 168px 28px 168px;
                            border-radius: 50%;
                            .iconfont {
                                font-size: 34px;
                            }
                        }
                        .text {
                            font-size: 20px;
                            line-height: 26px;
                            font-weight: 600;
                            color: #000b33;
                        }
                        .describe {
                            font-size: 16px;
                            font-weight: 400;
                            color: #000b33;
                            line-height: 26px;
                            padding: 15px 62px 78px 62px;
                        }

                        &:nth-child(1) {
                            .icon-wrap {
                                color: #fd4c5c;
                                background: rgba(253, 76, 92, 0.1);
                            }
                        }
                        &:nth-child(2) {
                            .icon-wrap {
                                color: #00bb98;
                                background: rgba(0, 187, 152, 0.1);
                            }
                        }
                        &:nth-child(3) {
                            .icon-wrap {
                                color: #377cfd;
                                background: rgba(55, 124, 253, 0.1);
                            }
                        }
                        &:nth-child(4) {
                            .icon-wrap {
                                color: #781bff;
                                background: rgba(120, 27, 255, 0.1);
                            }
                        }
                        &:nth-child(5) {
                            .icon-wrap {
                                color: #ffc83e;
                                background: rgba(255, 200, 62, 0.1);
                            }
                        }
                        &:nth-child(6) {
                            .icon-wrap {
                                color: #001c80;
                                background: rgba(0, 28, 128, 0.1);
                            }
                        }
                    }
                }
            }
        }
        .appraise {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            background: url("/img/index/appraise-bg.png");
            background-repeat: no-repeat;
            background-size: cover;
            background-position: top;
            height: 331px;
            .cell {
                .box {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .iconfont {
                        font-size: 36px;
                    }
                    .num {
                        position: relative;
                        font-size: 60px;
                        font-weight: 400;
                        color: #000000;
                        line-height: 72px;
                    }
                    .num::after {
                        content: "+";
                        position: absolute;
                        right: -28px;
                        top: -20px;
                        font-size: 40px;
                        font-weight: 500;
                    }
                }
                .text {
                    margin-top: 5px;
                    font-size: 26px;
                    font-weight: 600;
                    color: #000000;
                    line-height: 24px;
                    text-align: center;
                }

                &:nth-child(1) {
                    .iconfont {
                        color: #ffd460;
                    }
                }
                &:nth-child(2) {
                    .iconfont {
                        color: #f07b3f;
                    }
                }
                &:nth-child(3) {
                    .iconfont {
                        color: #ea5455;
                    }
                }
                &:nth-child(4) {
                    .iconfont {
                        color: #7884ff;
                    }
                }
            }
        }
        .case {
            background: url("/img/index/case-bg.png");
            background-repeat: no-repeat;
            background-size: cover;
            background-position: top;
            height: 931px;
            position: relative;

            .title {
                text-align: center;
                padding-top: 65px;
            }
            .case-wrap {
                padding-top: 35px;
                display: flex;
                justify-content: center;
                .carousel {
                    width: 1200px;
                    height: 800px;
                }
            }
        }
        .vs {
            background: url("/img/index/vs-bg.png");
            background-repeat: no-repeat;
            background-size: cover;
            background-position: top;
            height: 100%;
            position: relative;
            .title {
                text-align: center;
                padding-top: 95px;
                padding-bottom: 29px;
            }
            .vs-list {
                display: flex;
                justify-content: space-evenly;
                margin: 0 auto;
                width: 1314px;
                position: relative;
                .contrast {
                    position: absolute;
                    background: url("/img/index/vs.png");
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-position: top;
                    top: 31%;
                    left: 39%;
                    width: 275px;
                    height: 275px;
                }
                .cell-title {
                    display: inline-block;
                    text-align: center;
                    width: 282px;
                    height: 55px;
                    line-height: 55px;
                    background: #3f9eff;
                    border-radius: 6px;
                    font-size: 35px;
                    font-weight: 600;
                    color: #ffffff;
                    margin-bottom: 20px;
                    margin-left: 115px;
                }
                .cell {
                    display: flex;
                    padding-bottom: 72px;
                    margin-left: 115px;
                    .highlight {
                        color: #3f9eff;
                    }
                    .iconfont {
                        font-size: 40px;
                    }
                    .text {
                        font-size: 30px;
                        font-weight: 600;
                        color: #7c7d7f;
                        line-height: 42px;
                    }
                    .describe {
                        padding: 7px 111px 0 0;
                        font-size: 16px;
                        font-weight: 600;
                        color: #7c7d7f;
                        line-height: 22px;
                        min-height: 88px;
                    }
                    .right {
                        margin-left: 15px;
                    }
                }
                .lbox {
                    margin-right: 70px;
                    .iconfont {
                        color: #3f9eff;
                    }
                }
                .rbox {
                    .cell-title {
                        background: #7d7d7f;
                    }
                    .highlight {
                        color: #515a6c;
                    }
                }
            }
        }
        .about-us {
            display: flex;
            .lbox {
                width: 50%;
                .title {
                    text-align: center;
                    padding-top: 187px;
                    padding-bottom: 43px;
                }
                .content {
                    margin: 0 auto 118px auto;
                    width: 64%;
                    .text {
                        font-size: 30px;
                        font-weight: 400;
                        color: #000b33;
                        line-height: 54px;
                    }
                    .describe {
                        font-size: 16px;
                        font-weight: 400;
                        color: #000b33;
                        line-height: 26px;
                        padding-bottom: 109px;
                    }
                    .btn {
                        width: 216px;
                        height: 60px;
                        background: #3f9eff;
                        border-radius: 3px;
                        font-size: 20px;
                        font-weight: 600;
                        color: #ffffff;
                        border: 0;
                    }
                }
            }
            .rbox {
                padding-top: 97px;
            }
        }
        .guide {
            background: url("/img/index/guide-bg.png");
            background-repeat: no-repeat;
            background-size: cover;
            background-position: top;
            height: 1031px;
            position: relative;
            text-align: center;
            .title {
                text-align: center;
                font-size: 48px;
                font-weight: 600;
                color: #ffffff;
                line-height: 54px;
                padding: 116px 0 42px 0;
            }
            .describe {
                display: inline-block;
                width: 818px;
                font-size: 18px;
                font-weight: 600;
                color: #ffffff;
                line-height: 30px;
            }
            .video-wrap {
                display: flex;
                justify-content: center;
                padding: 43px 0 67px 0;
                .video {
                    width: 953px;
                    height: 495px;
                }
            }
            .btn {
                width: 290px;
                height: 75px;
                background: #3f9eff;
                border-radius: 10px;
                font-size: 30px;
                font-weight: 600;
                color: #ffffff;
                border: 0;
            }
        }
        .footer {
            padding-top: 119px;
            width: 1300px;
            height: 100%;
            margin: 0 auto;
            position: relative;
            .content {
                display: flex;
                flex: 1 1 0%;
                justify-content: space-between;
                padding-bottom: 50px;
                .lbox {
                    .logo {
                        height: 82px;
                    }
                    .tips {
                        display: flex;
                        flex-direction: column;
                        padding-top: 10px;
                        width: 318px;
                        font-size: 20px;
                        color: #000b33;
                        line-height: 26px;
                    }
                }
                .cbox {
                    display: flex;
                    .left-cell {
                        width: 320px;
                        .describe {
                            width: 226px;
                        }
                    }
                    .text {
                        font-size: 20px;
                        font-weight: 600;
                        color: #000b33;
                        line-height: 24px;
                        padding-bottom: 23px;
                    }
                    .describe {
                        font-size: 20px;
                        font-weight: 400;
                        color: #000b33;
                        line-height: 26px;
                        padding-bottom: 42px;
                    }
                }
                .rbox {
                    .text {
                        text-align: center;
                        font-size: 20px;
                        font-weight: 600;
                        color: #000b33;
                        line-height: 24px;
                        padding-bottom: 13px;
                    }
                    .img-wrap {
                        width: 158px;
                        height: 156px;
                        padding: 13px 14px;
                        border-radius: 9px;
                        background: #191717;
                    }
                    .QRCode {
                        width: 130px;
                        height: 130px;
                    }
                }
            }

            .icp-wrap {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                .line {
                    width: 100%;
                    border: 1px solid rgba(0, 11, 51, 0.15);
                }
                .icp {
                    padding: 18px 0 18px 0;
                    font-size: 20px;
                    font-weight: 600;
                    color: #000b33;
                    line-height: 26px;
                }
            }
        }
    }
    @media only screen and (min-width: 1025px) and (max-width: 1440px) {
        .header-container {
            height: 860px;
        }
        .header-login-wrap {
            .lbox {
                .title {
                    font-size: 40px !important;
                }
                .translations {
                    width: 420px;
                }
                .advantage-wrap {
                    .advantage {
                        font-size: 20px !important;
                    }
                    .btn {
                        width: 130px !important;
                        height: 53px !important;
                        font-size: 18px !important;
                    }
                }
            }
            .rbox {
                margin: 72px auto 0 auto !important;
                min-width: 457px;
                .login-weaper {
                    width: 450px;
                }
            }
        }
        .vs {
            .vs-list {
                .contrast {
                    left: 39% !important;
                }
            }
        }
        .about-us {
            .lbox {
                .content {
                    .describe {
                        padding-bottom: 39px !important;
                    }
                    margin: 0 auto 68px auto !important;
                }
            }
            .rbox {
                .img {
                    width: 86% !important;
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
    color: #46B46D;
}
::v-deep .el-tabs__item.is-active {
    color: #46B46D;
}
::v-deep .el-tabs__active-bar {
    background-color: #46B46D;
}
::v-deep .el-tabs__nav-wrap::after {
    background: #fff;
    color: #46B46D;
}

@media screen and (max-width: 1000px) {
    .container .header-container .header-login-wrap {
        .lbox .title {
            font-size: 30px !important;
        }
        .lbox .advantage-wrap .btn {
            margin-top: 30px;
        }
    }
    .container .content {
        .advantages .advantages-box .row {
            grid-template-columns: repeat(3, minmax(340px, 500px));
            height: 450px;
        }
        .functionality .functionality-box .row {
            grid-template-columns: repeat(3, minmax(330px, 416px));
        }
        .vs .vs-list {
            width: 1000px;
            .cell {
                margin-left: 80px;
                padding-bottom: 50px;
            }
            .contrast {
                left: 32% !important;
            }
        }
        .footer {
            width: 1000px;
            padding: 119px 30px 0;
        }
    }
}
</style>
