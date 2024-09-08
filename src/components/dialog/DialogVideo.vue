<template>
    <div class="video-dialog-content">
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            class="video-dialog"
            width="50%">
            <video-player
                class="video-player vjs-custom-skin"
                ref="videoPlayer"
                :playsinline="true"
                :options="playerOptions">
            </video-player>
        </el-dialog>
        <i class="close-dialog el-icon-error" @click="onClose" v-if="dialogVisible"></i>
    </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
export default {
    components: {
        videoPlayer
    },
    data() {
        return {
            dialogVisible: false,
            playerOptions: {
                playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
                autoplay: false, // 如果为true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 是否视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{
                    type: "video/mp4", // 类型
                    src: 'https://client-1304242234.cos.ap-guangzhou.myqcloud.com/1/study.mkv' // url地址
                }],
                poster: '', // 封面地址
                notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: true, // 当前时间和持续时间的分隔符
                    durationDisplay: true, // 显示持续时间
                    remainingTimeDisplay: false, // 是否显示剩余时间功能
                    fullscreenToggle: true // 是否显示全屏按钮
                }
            }
        }
    },
    computed: {},
    methods: {
        onClose () {
            this.dialogVisible = false
            this.$refs.videoPlayer.player.pause()
            this.$nextTick(() => {
                this.$refs.videoPlayer.player.src('https://client-1304242234.cos.ap-guangzhou.myqcloud.com/1/study.mkv')
            })
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.$bus.$on('video-dialog', () => {
            this.dialogVisible = true
            this.$nextTick(() => {
                this.$refs.videoPlayer.player.play()
            })
        })
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {},
    //生命周期 - 销毁完成
    destroyed() {
        this.$bus.$off('video-dialog')
    },
}
</script>
<style lang="scss">
.video-dialog-content {
    .video-dialog {
        .el-dialog {
            .el-dialog__header {
                display: none;
            }
            .el-dialog__body {
                padding: 0;
                position: relative;
            }
        }
    }
    .close-dialog {
        position: absolute;
        right: 23%;
        top: 12%;
        color: #fff;
        font-size: 24px !important;
        cursor: pointer;
        z-index: 20091;
    }
}
</style>