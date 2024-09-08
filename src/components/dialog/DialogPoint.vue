<template>
    <div class='dialog-msg'>
        <el-dialog
            title="积分不足提示"
            :visible.sync="visible"
            width="362px"
            :close-on-click-modal="false"
            :show-close="false"
            center>
            <template v-if="curPoint.identity == 'merchant'">
                <!-- 主账号 -->
                <span class="tip">检测到目前账号积分不足<span class="color">100</span>，请提前预充积分，避免损失下单领取的优惠金额</span>
            </template>
            <template v-else-if="curPoint.identity == 'children'">
                <!-- 子账号 -->
                <span class="tip">检测到目前账号积分不足<span class="color">100</span>，即将损失采购领取的优惠金额，请点击立即充值</span>
                
            </template>
            <span slot="footer" class="dialog-footer">
                <template v-if="curPoint.identity == 'merchant'">
                    <el-button @click="onCancel">取消</el-button>
                    <el-button type="primary" @click="onRouteLoad">立即充值</el-button>
                </template>
                <template v-else-if="curPoint.identity == 'children'">
                    <el-button type="primary" @click="visible = false">请登录主账号充值积分</el-button>
                </template>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getMerchantIntegral } from '@/api/admin/merchant'
export default {
    components: {},
    data() {
        return {
            visible: false,
            curPoint: {identity: 'children'}
        }
    },
    computed: {},
    methods: {
        // 放弃积分提示
        onCancel () {
            this.$confirm('确定要放弃此次机会吗?', '提示', {
                confirmButtonText: '立即充值',
                cancelButtonText: '放弃',
                type: 'warning'
            }).then(() => {
                this.onRouteLoad()
            }).catch(() => {
                this.visible = false
            })
        },
        onRouteLoad () {
            this.$router.push('/recharge/index')
            this.visible = false
        },
        onSuccess () {
            this.visible = false
            this.$emit('success')
        },
        async onLoadIntegral () {
            const { data } = await getMerchantIntegral()
            console.log('point', data)
            if (data.data) {
                this.curPoint = data.data
                this.$bus.$emit('update-point-count', data.data.integral || 0)
                this.visible = data.data.isTshi || false
            }
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.$bus.$on('point-dialog', () => {
            this.onLoadIntegral()
        })
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {
        this.$bus.$off('point-dialog')
    },
}
</script>
<style lang="scss" scoped>
    .dialog-msg {
        ::v-deep .el-dialog {
            border-radius: 10px;
            .el-dialog__body {
                line-height: 22px;
                .tip {
                    color: #333;
                    .color {
                        color: #00a7ef;
                    }
                }
            }
        }
    }
</style>