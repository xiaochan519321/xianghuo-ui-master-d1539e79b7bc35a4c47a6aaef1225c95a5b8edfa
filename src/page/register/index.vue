<template>
    
    <div class="login-border" :style="activeName==='registerSucceed'?`padding: 16px 0 20px 0;`:''">
        <!-- <el-button
            plain
            @click="showSucceedMsg">
            不会自动关闭
        </el-button> -->
        <div class="login-main">
            <register v-if="activeName==='register'" @showSucceedPage="showSucceedMsg" />
            <!-- <registerSucceed v-else="activeName==='registerSucceed'" :phone="phone" /> -->
        </div>
    </div>
</template>
<script>
import { fetchList } from '@/api/admin/tenant'
import register from './register'
import registerSucceed from './registerSucceed'
import { mapGetters } from 'vuex'
import { getStore, setStore } from '@/util/store'
import { handleImg } from '@/util/util'

export default {
    name: 'Login',
    components: {
        register,
        registerSucceed,
    },
    data() {
        return {
            tenantList: [],
            active: '',
            phone: '',
            activeName: 'register',
            socialForm: {}
        }
    },
    watch: {
        $route: {
            handler() {
                const params = this.$route.query
                if (this.validatenull(params.state) && this.validatenull(params.code)) return

                this.socialForm.state = params.state
                this.socialForm.code = params.code

                const loading = this.$loading({
                    lock: true,
                    text: `登录中,请稍后。。。`,
                    spinner: 'el-icon-loading'
                })
                this.$store.dispatch('LoginBySocial', this.socialForm).then(
                    () => {
                        loading.close()
                        this.$router.push({ path: this.tagWel.value })
                    }).catch(() => {
                        loading.close()
                    })
            },
            immediate: true
        },
    },
    created() {
        this.watermark()
        this.getTenantList()
        this.active = getStore({ name: 'tenantId' })
    },
    mounted() {
    },
    computed: {
        ...mapGetters(['siteConfig', 'tagWel'])
    },
    methods: {
        handleCommand(command) {
            setStore({ name: 'tenantId', content: command })
        },
        getTenantList() {
            fetchList().then(response => {
                this.tenantList = response.data.data
            })
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
        showSucceedMsg() {
            this.$parent.showSucceedMsg();
        },
        /**
         * 切换到 注册成功页面
         */
        showSucceedPage(phone) {
            this.phone = phone;
            
            this.activeName = 'registerSucceed'; activeTab ='login'
        }
    }
}
</script>

<style lang="scss">
@import "@/styles/login.scss";
</style>
