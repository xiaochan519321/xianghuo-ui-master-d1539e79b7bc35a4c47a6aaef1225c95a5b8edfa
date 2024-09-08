<template>
    <div class="avue-top">
        <tags />
        <div class="top-bar__right flex items-center" id="top-bar__right">
            <div class="top-button yellow" @click.stop="onLoadVideo" v-if="siteConfig.id == 1 || siteConfig.id == 1810565944151515137">
                <span>视频讲解</span>
            </div>
            <div class="top-button purple" @click.stop="goTutorial" v-if="siteConfig.id == 1 || siteConfig.id == 1810565944151515137">
                <span>图文教程</span>
            </div>
            <div class="top-button blue" @click.stop="onLoadService('service')">
                <span>在线客服</span>
            </div>
            <el-tooltip v-show="showTheme && false " effect="dark" content="特色主题" placement="bottom">
                <div class="top-bar__item top-bar__item--show">
                    <top-theme />
                </div>
            </el-tooltip>
            <el-tooltip
                v-if="showFullScreen && false"
                :content="isFullScreen?'退出全屏':'全屏'"
                effect="dark"
                placement="bottom"
            >
                <div class="top-bar__item">
                    <i
                        :class="isFullScreen?'icon-zuixiaohua':'icon-quanpingzuidahua'"
                        @click="handleScreen"
                    />
                </div>
            </el-tooltip>

            <router-link to="/info/index">
                <el-tooltip effect="dark" content="用户头像" placement="bottom">
                    <img class="top-bar__img" src="/img/user/avatar.png" />
                </el-tooltip>
            </router-link>

            <el-dropdown>
                <router-link to="/info/index">
                    <span class="el-dropdown-link top-bar-username">
                        {{ userInfo.username }}
                        <i class="el-icon-arrow-down el-icon--right" />
                    </span>
                </router-link>
                <el-dropdown-menu slot="dropdown">
                    <router-link to="/info/index">
                        <el-dropdown-item divided>个人信息</el-dropdown-item>
                    </router-link>
                    <!-- <el-dropdown-item divided @click.native="$refs.seting.open()">界面设置</el-dropdown-item> -->
                    <el-dropdown-item divided @click.native="logout">退出系统</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <dialog-notice-check
            ref="dialogNoticeCheck"
            :visible="visible"
            @close="visible=false"
            @update="getUnreadNoticeData"
        />
        <dialog-custom ref="DialogCustom" />
        <!-- <top-theme ref="seting"></top-theme> -->
    </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import tags from '../tags'
import { fullscreenToggel, handleImg, listenfullscreen } from '@/util/util'
import { getConfig } from '@/api/dfh/dfhConfig'
import topTheme from './top-theme'
import topColor from './top-color'
import DialogNoticeCheck from '@/components/dialog/DialogNoticeCheck'
import DialogCustom from '@/components/dialog/DialogCustom'

export default {
    name: 'Top',
    components: {
        tags,
        topTheme,
        topColor,
        DialogNoticeCheck,
        DialogCustom
    },
    filters: {},
    data() {
        return {
            search: '',
            unreadNum: null,
            visible: false,
            isVisibleService: false,
            pointCount: null,
            orderConfig: {},
            countLoading: false,
            videoUrl: "", //视频讲解
            url: "" //图文教程
        }
    },
    computed: {
        ...mapState({
            showDebug: state => state.common.showDebug,
            showTheme: state => state.common.showTheme,
            showLock: state => state.common.showLock,
            showFullScreen: state => state.common.showFullScreen,
            showCollapse: state => state.common.showCollapse,
            showMenu: state => state.common.showMenu,
            showColor: state => state.common.showColor,
            userInfo: state => state.user.userInfo,
        }),
        ...mapGetters([
            'siteConfig',
            'website',
            'userInfo',
            'isFullScreen',
            'tagWel',
            'tagList',
            'isCollapse',
            'tag',
            'logsLen',
            'logsFlag',
            'menu',
            'my',
        ])
    },
    watch: {
        menu(val, oldVal) {
            if (val && val.length > 0) {
                this.getMenuList();
            }
        }
    },
    created () {

    },
    mounted() {
        listenfullscreen(this.setScreen);
        // 获取未读通知数
        this.getUnreadNoticeData();
        if (this.menu) this.getMenuList();
        // 获取用户信息
        this.$store.dispatch('GetMy')
    },
    methods: {
        //视频讲解
        onLoadVideo() {
            this.$bus.$emit('video-dialog')
        },
        //图文教程
        goTutorial() {
            this.url = 'https://docs.qq.com/doc/p/51b6dd2d94a2d337c75877663bea8c16f728a5a6'
            if (window.electron) {
                // 发送到electron进行跳转
                window.electron.send({key: 'chromeUrl', url: this.url})
            } else {
                window.open(this.url)
            }
        },
        //在线客服
        onLoadService() {
            // this.$bus.$emit('wechat')
            this.$refs.DialogCustom.show()
        },
        reloadExpress () {
            if (this.countLoading) return
            this.countLoading = true
            this.$store.dispatch('GetMy')
            setTimeout(() => {
                this.countLoading = false
            }, 1500)
        },
        // 获取代发设置
        async onOrderConfig () {
            const { data } = await getConfig()
            this.orderConfig = data.data
        },
        // 面单余额详情
        onExpressLog () {
            this.$router.push('/admin/expressSheet/index')
        },
        // 获取未读通知数
        getUnreadNoticeData() {
            this.$API.getUnreadNotice().then(datas => {
                const data = datas.data;
                this.$refs.dialogNoticeCheck.initData(data.data);
                const sum = data.data.reduce((acc, val) => acc + val.unreadNum, 0);
                this.unreadNum = sum ? sum : null;
            });
        },
        showDialog() {
            this.visible = true;
            this.getUnreadNoticeData();
        },
        handleScreen() {
            fullscreenToggel()
        },
        setCollapse() {
            this.$store.commit('SET_COLLAPSE')
        },
        setScreen() {
            this.$store.commit('SET_FULLSCREEN')
        },
        logout() {
            this.$confirm('是否退出系统, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('LogOut').then(() => {
                    this.website.firstLoad = true
                    this.$router.push({ path: '/login' })
                    // 向electron传递消息
                    if (window.electron) {
                        // 向主进程传递消息
                        window.electron.ipcRenderer.send('close-win')
                        // 向渲染进程传递消息
                        window.electron.send({key: 'logout'})
                    }
                })
            })
        },
        querySearch(queryString, cb) {
            var menuList = this.menuList;
            var results = queryString ? this.fuzzyQuery(menuList, queryString) : menuList;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        /**
         * 使用indexof方法实现模糊查询
         * @param  {Array}  list     进行查询的数组
         * @param  {String} keyWord  查询的关键词
         * @return {Array}           查询的结果
         */
        fuzzyQuery(list, keyWord) {
            var arr = [];
            for (var i = 0; i < list.length; i++) {
                if (list[i].value.indexOf(keyWord) >= 0) {
                    arr.push(list[i]);
                }
            }
            return arr;
        },
        // 获取菜单数据
        getMenuList() {
            const list = [];
            this.menu.forEach(item => {
                if (item.children && item.children.length) {
                    item.children.map(item => {
                        list.push({
                            value: item.name,
                            path: item.path,
                        });
                    });
                } else {
                    list.push({
                        value: item.name,
                        path: item.path,
                    });
                }
            });
            this.menuList = list;
        },
        // 路由跳转到某个页面
        handleSelect(item) {
            const currentRouter = this.$route.path;
            if (currentRouter !== item.path) {
                this.$router.push({
                    path: item.path
                });
            }
            this.search = null;
        },
        /**
         * 商务客服
         */
        clickService() {
            this.$bus.$emit('wechat');
        }
    },
    beforeDestroy () {
        this.$bus.$off('update-point-count')
        this.$bus.$off('update-express-count')
    },
}
</script>

<style lang="scss" scoped>
.top-bar__right {
    .service {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 28px;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        width: 110px;
        height: 30px;
        background: #4fa1fe;
        border-radius: 3px;
        &:hover {
            opacity: 0.9;
        }
    }
    .client-item:hover {
        span {
            color: #3d3d3d;
        }
    }
    .top-button {
        width: 94px;
        height: 32px;
        background: #F3EFFF;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #946FFD;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        cursor: pointer;
        font-size: 14px;
        &.yellow {
            color: #fff;
            background: rgb(70, 180, 109);
            border: 1px solid rgb(70, 180, 109);
            opacity: 0.55;
        }
        &.purple {
            color: #fff;
            background: rgb(70, 180, 109);
            border: 1px solid rgb(70, 180, 109);
            opacity: 0.85;
        }
        &.blue {
            color: #fff;
            background: rgb(70, 180, 109);
            border: 1px solid rgb(70, 180, 109);
        }
    }
    .search {
        width: 264px;
        height: 32px;
        position: relative;
        .inline-input {
            display: flex;
            align-items: center;
            ::v-deep .el-input__inner {
                border: 1px solid #D9D9D9;
                border-radius: 16px;
                padding-right: 64px;
                color: #31373D;
                &::placeholder {
                    color: #31373D;
                }
            }
            ::v-deep .el-input__suffix {
                right: 40px !important;
            }
            
        }
        .right {
            position: absolute;
            right: 0px;
            top: 0;
            width: 32px;
            height: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-left: 1px solid #D9D9D9;
            .icon-search {
                height: 32px;
                font-size: 12px;
                color: #ADADAD;
                line-height: 32px;
                transform: translateX(-2px);
            }
        }
        


    }
    .notice {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 36px;
        height: 64px;
        margin: 0 32px;
        .iconfont {
            color: rgba(0, 0, 0, 0.65);
            font-size: 20px;
            font-weight: bold;
            color: #31373D;
        }
        ::v-deep .el-badge__content.is-fixed {
            top: 20px;
            right: 10px;
        }
    }

    .integral {
        font-size: 18px;
        font-weight: 600;
        color: #1890ff;
        font-family: Barlow;
        ::v-deep .el-loading-mask {
            left: -4px;
            .el-loading-spinner {
                margin-top: -32px;
            }
        }
    }
    .integral-desc {
        font-size: 12px;
        color: #999999;
    }

    .recharge {
        width: 60px;
        height: 30px;
        background: #ffffff;
        border-radius: 15px;
        border: 1px solid #1890ff;
        font-size: 12px;
        color: #1890ff;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            background: #1890ff;
            color: #fff;
        }
    }
}
</style>
