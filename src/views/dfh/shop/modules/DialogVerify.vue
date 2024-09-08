<template>
    <div class="shop-dialog-verify-components">
        <el-dialog-custom width="500px" :visible="visible_" @close="onClose">
            <div class="my-dialog-content">
                <div class="my-dialog-title">
                    <span>通知</span>
                </div>
                <div class="my-dialog-main">
                    <p class="desc">
                        <span>很抱歉，您的新增权限不足，请充值500奖励权限。</span>
                    </p>
                    <div class="my-dialog-footer flex justify-center">
                        <el-button class="cancel" @click.stop="onClose">
                            <span>取消</span>
                        </el-button>
                        <el-button class="confirm" @click.stop="onClickConfirm">
                            <span>去充值</span>
                        </el-button>
                    </div>
                </div>
            </div>
        </el-dialog-custom>
    </div>
</template>

<script>
import ElDialogCustom from '@/components/base/ElDialogCustom';
export default {
    components: {
        ElDialogCustom,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {};
    },
    computed: {
        visible_: {
            get() {
                return this.visible;
            },
            set(newVal) {
                return this.$emit('close');
            },
        },
    },
    created() {},
    mounted() {},
    methods: {
        onClose() {
            this.visible_ = false;
        },
        onClickConfirm() {
            this.$router.push('/recharge/index')
        },
    },
};
</script>

<style lang="scss" scoped>
.shop-dialog-verify-components {
    .my-dialog-content {
        .my-dialog-title {
            width: 100%;
            height: 54px;
            line-height: 54px;
            background: #4faaff;
            border-radius: 10px 10px 0px 0px;
            font-size: 16px;
            color: #ffffff;
            padding: 0 34px;
            box-sizing: border-box;
            position: relative;

            .el-icon-close {
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 22px;
                cursor: pointer;
            }
        }
        .my-dialog-main {
            width: 100%;
            height: 220px;
            padding: 30px;
            background: #fff;
            box-sizing: border-box;
            .desc {
                text-align: center;
                color: #f77877;
                font-size: 18px;
                margin-top: 30px;
                margin-bottom: 58px;
            }
            .my-dialog-footer {
                > button {
                    width: 130px;
                    height: 34px;
                    padding: 0;
                    border-radius: 4px;
                    color: #fff;
                    font-size: 14px;
                    border: 1px solid transparent;
                    box-sizing: border-box;
                    font-weight: 600;
                }
                .cancel {
                    background: #d8d8d8;
                    color: #666666;
                    margin-right: 94px;

                    &:hover {
                        background: rgba(216, 216, 216, 0.8);
                    }
                }
                .confirm {
                    background: #4faaff;

                    &:hover {
                        background: rgba(79, 161, 254, 0.8);
                    }
                }
            }
        }
    }
}
</style>
