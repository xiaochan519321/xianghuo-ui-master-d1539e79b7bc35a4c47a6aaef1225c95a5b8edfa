<template>
  <div :class="{'avue--collapse':isCollapse}" class="avue-contail">
        <div class="avue-header">
            <!-- 顶部导航栏 -->
            <top/>
        </div>

        <div class="avue-layout">
            <div class="avue-left">
                <!-- 左侧导航栏 -->
                <sidebar/>
            </div>
            <div class="avue-main" style="overflow-y: auto;">
                <!-- 顶部标签卡 -->
                <tags v-if="false"/>
                <!-- 主体视图层 -->
                <div style="height:100%; padding: 16px 24px;" class="main-container" id="avue-view">
                    <keep-alive>
                        <router-view class="avue-view" v-if="$route.meta.keepAlive"/>
                    </keep-alive>
                    <router-view class="avue-view" v-if="!$route.meta.keepAlive"/>
                </div>
            </div>
        </div>
        <div class="avue-shade" @click="showCollapse"/>
        <!-- 右侧浮窗 -->
        <float-win v-if="false" />
        <!-- 视频窗口 -->
        <DialogVideo />
        <!-- 公告弹窗 -->
        <DialogMsg ref="dialogMsg" @success="onMsgSuccess"/>
        <!-- 机器人广告 -->
        <DialogRobot ref="dialogRobot" @success="onRobotSuccess"/>
        <!-- 积分不足弹窗 -->
        <DialogPoint/>
        <!-- 我的采购弹窗 -->
        <DialogPurchase/>
        <!-- 供应链广告 -->
        <!-- <DialogSupplyBanner ref="dialogSupplyBanner" @success="onSupplySuccess"/> -->
        <!-- 供应链联系人 -->
        <DialogSupplySaleWx />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import tags from './tags'
import top from './top/'
import sidebar from './sidebar/'
import admin from '@/util/admin'
import { getStore } from '@/util/store.js'
import * as SockJS from 'sockjs-client'
import Stomp from 'stomp-websocket'
import store from '@/store'
import FloatWin from '@/components/widget/floatWin'
import DialogVideo from '@/components/dialog/DialogVideo'
import DialogMsg from '@/components/dialog/DialogMsg'
import DialogPoint from '@/components/dialog/DialogPoint'
import DialogRobot from '@/components/dialog/DialogRobot'
import DialogPurchase from '@/components/dialog/DialogPurchase'
import DialogSupplyBanner from '@/components/dialog/DialogSupplyBanner'
import DialogSupplySaleWx from '@/components/dialog/DialogSupplySaleWx'

export default {
    name: 'Index',
    provide() {
        return {
            Index: this
        };
    },
    components: {
        top,
        tags,
        sidebar,
        FloatWin,
        DialogVideo,
        DialogMsg,
        DialogPoint,
        DialogRobot,
        DialogPurchase,
        DialogSupplyBanner,
        DialogSupplySaleWx
    },
    data() {
        return {
            // 刷新token锁
            refreshLock: false,
            // 刷新token的时间
            refreshTime: '',
            // 计时器
            timer: ''
        }
    },
    created() {
        // 实时检测刷新token
        this.refreshToken()
    },
    destroyed() {
        clearInterval(this.refreshTime)
        clearInterval(this.timer)
        /*
        * 默认关闭websocket，如需工作流通知，则开启
        * this.disconnect()
        */
    },
    mounted() {
        this.init()
        this.onSupply()
        // this.onRobot()
        // this.onMsg()
        /*
        * 默认关闭websocket，如需工作流通知，则开启
        * this.initWebSocket()
        */
    },
    computed: {
        ...mapState({
            warn_dialog: state => state.user.warn_dialog,
            robot_dialog: state => state.user.robot_dialog,
            supply_dialog: state => state.user.supply_dialog,
        }),
        ...mapGetters(['userInfo', 'isLock', 'isCollapse', 'website', 'expires_in']),
    },
    methods: {
        // 公告弹窗关闭回调
        onMsgSuccess () {
            this.$bus.$emit('point-dialog')
        },
        // 机器人广告弹窗关闭回调
        onRobotSuccess () {
            this.$bus.$emit('point-dialog')
        },
        onSupplySuccess () {
            this.$bus.$emit('point-dialog')
        },
        onMsg () {
            // 首次登录弹出公告
            if (!this.warn_dialog) {
                this.$refs.dialogMsg.showEdit()
            }
        },
        // 机器人广告，登录弹出
        onRobot () {
            if (!this.robot_dialog) {
                this.$refs.dialogRobot.showEdit()
            }
        },
        // 供应链广告
        onSupply () {
            if (!this.supply_dialog) {
                // this.$refs.dialogSupplyBanner.showEdit()
            }
        },
        showCollapse() {
            this.$store.commit('SET_COLLAPSE')
        },
        openMenu(item = {}) {
            this.$store.dispatch("GetMenu", {type: true, id: item.id}).then(data => {
                if (data.length !== 0) {
                this.$router.$avueRouter.formatRoutes(data, true);
                }
            });
        },
        // 屏幕检测
        init() {
            this.$store.commit('SET_SCREEN', admin.getScreen())
            window.onresize = () => {
                setTimeout(() => {
                this.$store.commit('SET_SCREEN', admin.getScreen())
                }, 0)
            }
        },
        // 实时检测刷新token
        refreshToken() {
            // this.refreshTime = setInterval(() => {
            //     const token = getStore({
            //     name: 'access_token',
            //     debug: true
            //     })
            //     if (this.validatenull(token)) {
            //     return
            //     }
            //     if (this.expires_in <= 1000 && !this.refreshLock) {
            //     this.refreshLock = true
            //     this.$store
            //         .dispatch('RefreshToken')
            //         .catch(() => {
            //         clearInterval(this.refreshTime)
            //         })
            //     this.refreshLock = false
            //     }
            //     this.$store.commit('SET_EXPIRES_IN', this.expires_in - 10)
            // }, 10000)
            this.refreshTime = setInterval(() => {
                // 定时刷新token
                console.log('refreshTime')
                this.$store.dispatch('RefreshToken')
            }, 1800000)
        },
        initWebSocket() {
            this.connection()
            const self = this
            // 断开重连机制,尝试发送消息,捕获异常发生时重连
            this.timer = setInterval(() => {
                try {
                self.stompClient.send('test')
                } catch (err) {
                console.log('断线了: ' + err)
                self.connection()
                }
            }, 5000)
        },
        connection() {
            const token = store.getters.access_token
            const TENANT_ID = getStore({name: 'tenantId'}) ? getStore({name: 'tenantId'}) : '1'
            const headers = {
                'TENANT-ID': TENANT_ID,
                'Authorization': 'Bearer ' + token
            }
            // 建立连接对象
            this.socket = new SockJS('/act/ws')// 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
            // 获取STOMP子协议的客户端对象
            this.stompClient = Stomp.over(this.socket)
            this.stompClient.debug = null
            // 向服务器发起websocket连接
            this.stompClient.connect(headers, () => {
                // 订阅通道  /task/租户ID/用户名称/remind
                let target = `/task/${TENANT_ID}/${this.userInfo.username}/remind`
                this.stompClient.subscribe(target, (msg) => { // 订阅服务端提供的某个topic;
                    this.$notify({
                        title: '协同提醒',
                        type: 'warning',
                        dangerouslyUseHTMLString: true,
                        message: msg.body + '任务，请及时处理',
                        offset: 60
                    })
                })
            }, (err) => {
                console.log(err)
            })
        },
        disconnect() {
            if (this.stompClient != null) {
                this.stompClient.disconnect()
                console.log('Disconnected')
            }
        }
    },
    destroyed () {
        clearInterval(this.refreshTime)
        this.refreshTime = null
    },
    }
</script>
<style lang="scss">
.main-container {
    &::-webkit-scrollbar {
        width: 0;
    }
}
</style>
