<template>
    <div class='reserver-dialog'>
        <el-dialog title="订购服务应用" :visible.sync="reserveDialog" width="400px" top="20%" :close-on-click-modal="false">
            <div class="tip-content" v-if="siteConfig.id == 1">
                <img src="@/assets/ppjy.png" alt="">
                <p v-if="finish">尊敬的商家用户，为了保证店铺订单能够正常使用，请先立即订购派派交易代发，如已订购请点击前往授权</p>
                <p v-else>请确认是否已完成订购派派交易代发应用，点击订购成功可立即前往授权</p>
            </div>
            <div class="tip-content" v-if="siteConfig.id == 1810202544216821762">
                <img src="@/assets/ppjy.png" alt="">
                <p v-if="finish">尊敬的商家用户，为了保证店铺订单能够正常使用，请先立即订购极速交易代发，如已订购请点击前往授权</p>
                <p v-else>请确认是否已完成订购极速交易代发应用，点击订购成功可立即前往授权</p>
            </div>
            <div class="tip-content" v-if="siteConfig.id == 1810565944151515137">
                <img src="@/assets/jlds.png" alt="">
                <p v-if="finish">尊敬的商家用户，为了保证店铺订单能够正常使用，请先立即订购截流大师拍单代发，如已订购请点击前往授权</p>
                <p v-else>请确认是否已完成订购截流大师拍单代发应用，点击订购成功可立即前往授权</p>
            </div>
            <div class="tip-content" v-if="siteConfig.id == 1766060302561169409">
                <img src="@/assets/lm.png" alt="">
                <p v-if="finish">尊敬的商家用户，为了保证店铺订单能够正常使用，请先立即订购老梦一键下单代发，如已订购请点击前往授权</p>
                <p v-else>请确认是否已完成订购老梦一键下单代发应用，点击订购成功可立即前往授权</p>
            </div>
            <div class="tip-content" v-if="siteConfig.id == 1813891945346191362">
                <img src="@/assets/jjdf.png" alt="">
                <p v-if="finish">尊敬的商家用户，为了保证店铺订单能够正常使用，请先立即订购九九代发，如已订购请点击前往授权</p>
                <p v-else>请确认是否已完成订购九九代发代发应用，点击订购成功可立即前往授权</p>
            </div>
            <div class="tip-content" v-if="siteConfig.id == 1817835750357606401">
                <img src="@/assets/pd.jpg" alt="">
                <p v-if="finish">尊敬的商家用户，为了保证店铺订单能够正常使用，请先立即订购拍单交易代发，如已订购请点击前往授权</p>
                <p v-else>请确认是否已完成订购拍单交易代发应用，点击订购成功可立即前往授权</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <template v-if="!finish">
                    <el-button @click="onSubmit">重新订购</el-button>
                    <el-button type="primary" @click="onOpenAuth">订购完成</el-button>
                </template>
                <template v-else>
                    <el-button @click="onOpenAuth">前往授权</el-button>
                    <el-button type="primary" @click="onSubmit">立即订购</el-button>
                </template>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            reserveDialog: false,
            loading: false,
            finish: true
        }
    },
    methods: {
        onOpenAuth () {
            this.reserveDialog = false
            this.finish = true
            this.$parent.openAuth()
        },
        onSubmit () {
            this.finish = false
            const url = 'https://fuwu.jinritemai.com/detail?service_id=23394&searchKey=%E6%8A%96%E5%BA%97%E6%89%93%E5%8D%95%E5%8A%A9%E6%89%8B&btm_pre=a0254.b9825.c7579&btm_ppre=a0254.b7465.c4783&page_from=1ga7t57cl_b9825&pre_show_id=b0eb725a-78a4-4a29-a859-29277a59b746'
            if (window.electron) {
            // 发送到electron进行跳转
                window.electron.send({key: 'chromeUrl', url: url})
            } else {
                window.open(url)
            }
        },
        showEdit () {
            this.reserveDialog = true
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {
    },
}
</script>
<style lang="scss" scoped>
    .reserver-dialog {
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
                .tip-content {
                    display: flex;
                    align-items: center;
                    img {
                        width: 60px;
                        height: 60px;
                        margin-right: 15px;
                    }
                    p {
                        line-height: 20px;
                        color: #333;
                    }
                }
            }
        }
    }
</style>