<template>
    <div class='float-window' v-drag>
        <div class="items">
            <div class="item service" @click.stop="onLoadService('service')">
                <div class="img"></div>
                <div class="text">商务客服</div>
              
            </div>
            <div class="item service" @click.stop="onLoadService('Notice')">
                        <div class="img"></div>
                        <div class="text">公告</div>
            </div>
            <div class="item service" @click.stop="onLoadService('impatient')">
                        <div class="img"></div>
                        <div class="text">宅急送</div>
            </div>
            <div class="item" @click.stop="onLoadVideo">
                        <div class="img"></div>
                        <div class="text">视频教程</div>
            </div>
            <!-- <div class="item purchase" @click.stop="onLoadPurchase">
                <div class="img"></div>
                <div class="text">今日采购</div>
            </div> -->
            <!-- <el-collapse-transition>
                <div v-show="show">
                    <div class="item down" @click.stop="onDownClient">
                        <div class="img"></div>
                        <div class="text">下载客户端</div>
                    </div>
                    <div class="item doc" @click.stop="">
                        <div class="img"></div>
                        <div class="text">我想了解</div>
                    </div>
                    <div class="item" @click.stop="onLoadVideo">
                        <div class="img"></div>
                        <div class="text">视频教程</div>
                    </div>

                    <div class="item guide" @click.stop="onLoadGuide">
                        <div class="img"></div>
                        <div class="text">新手引导</div>
                    </div>
                </div>
            </el-collapse-transition> -->
            <!-- <div class="status">
                <el-button type="text" @click.stop="show = !show">{{show ? '收起' : '展开'}}</el-button>
            </div> -->
        </div>
    </div>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            show: false
        }
    },
    computed: {},
    methods: {
        isDrag () {
            // 区分点击和拖拽
            const drag = document.querySelector(".float-window").getAttribute('drag-flag')
            console.log('drag', drag)
            return drag == 'true'
        },
        onLoadVideo () {
            if (this.isDrag()) return
            this.$bus.$emit('video-dialog')
            // window.open('https://1320550750.vod-qcloud.com/68269c9evodcq1320550750/a4995d5b3270835012738472431/Dog9FGxc5HYA.mp4')
            // console.log('open Video')
        },
        onLoadPurchase () {
            if (this.isDrag()) return
            this.$bus.$emit('purchase-dialog')
        },
        onDownClient () {
            if (this.isDrag()) return
            window.location.href = 'https://kuaipai-1304242234.cos.ap-guangzhou.myqcloud.com/%E5%BF%AB%E6%8B%8D%E5%AE%A2%E6%88%B7%E7%AB%AF_1.8.9.exe'
        },
        onLoadService (item) {
            if (this.isDrag()) return
            if(item === 'service') {
                this.$bus.$emit('wechat')
            } else if(item === 'impatient') {
                this.$bus.$emit('impatient')
            } else if(item === 'Notice') {
                this.$bus.$emit('Notice')
            }
        },
        onLoadGuide () {

        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>
<style lang="scss" scoped>
.float-window {
    position: fixed;
    right: 0;
    top: 200px;
    z-index: 2100;
    transform: translate(0, 0);
    user-select: none;
    will-change: transform;
    width: 76px;
    background-color: #fff;
    box-shadow: 1px 1px 10px rgba(0,0,0,0.3);
    border-radius: 5px;
    text-align: center;
    .items {
        .item {
            padding: 0 12px;
            box-sizing: border-box;
            cursor: pointer;
            .img {
                width: 30px;
                height: 30px;
                margin: 13px auto;
                background-repeat: no-repeat;
                background-image: url('/img/board/icon_float_video.png');
                background-size: contain;
            }
            .text {
                padding-bottom: 15px;
                border-bottom: 1px solid #ededed;
                font-size: 13px;
            }
        }
        .item.doc .img{
            background-image: url('/img/board/icon_float_doc.png');
        }
        .item.purchase .img{
            background-image: url('/img/board/icon_float_purchase.png');
        }
        .item.service .img{
            background-image: url('/img/board/icon_float_service.png');
        }
        .item.down .img{
            background-image: url('/img/board/icon_float_down.png');
        }
        .item.guide .img{
            background-image: url('/img/board/icon_float_guide.png');
        }
        .item:hover {
            .text {
                color: rgb(70, 180, 109);
            }
        }
        .status {
            margin: 9px 0;
        }
    }
}
</style>