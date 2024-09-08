<template>
    <div class='scheme-dialog'>
        <el-dialog title="客户端" :visible.sync="schemeDialog" width="512px" top="20%">
            <div class="message">{{desc}}</div>
            <el-button type="primary" round @click="onDown">下载最新客户端</el-button>
            <div class="tip" @click="schemeDialog = false; tipDialog = true;">已安装仍无法打开？</div>
        </el-dialog>
        <el-dialog title="尝试以下方法" :visible.sync="tipDialog" width="512px" top="20%" @close="schemeDialog = true">
            <p>方法1. 直接打开客户端进行操作</p>
            <p>方法2. 确认您的浏览器是否为最新版本并刷新页面</p>
            <el-button type="primary" round @click="tipDialog = false">我知道了</el-button>
        </el-dialog>
    </div>
</template>

<script>
import { getClientCheck } from '@/api/info'
export default {
    components: {},
    data() {
        return {
            timer: null,
            schemeDialog: false,
            desc: '请下载客户端进行处理',
            tipDialog: false
        }
    },
    computed: {
        guid () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            })
        }
    },
    methods: {
        // 下载客户端
        onDown () {
            window.location.href = 'https://kuaipai-1304242234.cos.ap-guangzhou.myqcloud.com/%E5%BF%AB%E6%8B%8D%E5%AE%A2%E6%88%B7%E7%AB%AF_1.6.3.exe'
        },
        schemeOpen (url) {
            // 判断传进来的url是否有带参数
            if (url.indexOf('?') > -1) {
                url = `${url}&browserId=${this.guid}`
            } else {
                url = `${url}?browserId=${this.guid}`
            }
            window.location.href = url
            this.timer = setTimeout(() => {
                this.schemeDialog = true
                clearTimeout(this.timer)
                this.timer = null
                this.$emit('close')
            }, 16000)
            // 开始检测
            setTimeout(() => {
                this.checkClient()
            }, 1000)
        },
        // 检测客户端是否已经打开
        async checkClient () {
            const { data: { data } } = await getClientCheck({browserId: this.guid})
            console.log('data', data)
            if (data.status != 2 && this.timer) {
                setTimeout(() => {
                    this.checkClient()
                }, 2000)
            } else if (data.status == 2) {
                this.clearTimer()
            }
        },
        clearTimer () {
            console.log('close')
            clearTimeout(this.timer)
            this.schemeDialog = false
            this.timer = null
            this.$emit('close')
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {
        document.removeEventListener('visibilitychange', this.clearTimer)
        document.removeEventListener('pagehide', this.clearTimer)
        document.removeEventListener('pageshow', this.clearTimer)
    },
}
</script>
<style lang="scss" scoped>
    .scheme-dialog {
        ::v-deep .el-dialog {
            border-radius: 10px;
            .el-dialog__header {
                padding: 15px 20px 15px;
                border-bottom: 1px solid #ededed;
                .el-dialog__title {
                    font-size: 15px;
                    font-weight: 500;
                }
            }
            .el-dialog__body {
                text-align: center;
                .message {
                    color: #333;
                    margin-bottom: 30px;
                }
                .el-button {
                    font-size: 14px;
                    font-weight: 600;
                    padding: 10px 36px;
                }
                .tip {
                    text-align: right;
                    color: rgb(70, 180, 109);
                    font-size: 12px;
                    cursor: pointer;
                    font-weight: 500;
                    margin-top: 30px;
                }
                p {
                    text-align: left;
                    margin-bottom: 15px;
                }
            }
        }
    }
</style>