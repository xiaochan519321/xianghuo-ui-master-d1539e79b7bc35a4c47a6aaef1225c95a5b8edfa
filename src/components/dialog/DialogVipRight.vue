<template>
    <el-dialog
        class="vip-right-dialog"
        title="尊敬的商家朋友您好"
        :visible.sync="dialogVisible"
        width="300px"
        :close-on-click-modal="false"
        center>
        <div>您的拍单会员（{{rightName}}）还有<span class="weight"> {{expireDay}} </span>小时后到期，请您尽快续费，避免影响到拍单功能的正常使用</div>
        <div class="image">
            <img src="/img/icon-server.png" />
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="medium" @click="$router.push('/members/index')">续费会员</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
    components: {},
    data() {
        return {
            dialogVisible: false
        }
    },
    watch: {
        expireDay: {
            handler (val, oldVal) {
                console.log('this.expireDay', val)
                if (val > 0 && val <= 48) {
                    this.dialogVisible = true
                }
            },
            immediate: true
        }
    },
    computed: {
        ...mapState({
            my: state => state.user.my
        }),
        rightName () {
            try {
                return this.my.memberRight.name
            } catch (err) {
                return ''
            }
        },
        // 会员还有多少小时到期
        expireDay () {
            const now = Date.now()
            const rightTime = this.$moment(this.my.rightExpireTime)
            try {
                return this.$moment(rightTime).diff(now, 'hours')
            } catch (error) {
                return null
            }
        },
    },
    methods: {

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
    .vip-right-dialog {
        ::v-deep .el-dialog {
            border-radius: 8px;
            .el-dialog__header {
                text-align: left;
                padding-top: 14px;
                .el-dialog__title {
                    font-size: 16px;
                    font-weight: 600;
                }
                .el-dialog__headerbtn {
                    top: 15px;
                    .el-icon-close {
                        font-weight: 600;
                        color: #333;
                    }
                }
            }
            .el-dialog__body {
                padding: 10px 20px;
                line-height: 22px;
                color: #333;
                .weight {
                    color: #000;
                    font-size: 16px;
                    font-weight: 600;
                }
                .xicon-fuwu {
                    font-size: 40px;
                }
                .image {
                    text-align: center;
                    img {
                        width: 100px;
                        height: 100px;
                    }
                }
            }
        }
    }
</style>