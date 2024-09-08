<template>
    <div class="dialog-withdrawal-result-container">
        <el-dialog-custom width="380px" :visible="visible_" @close="onClose">
            <div class="my-dialog-content flex flex-col items-center">
                <div class="errors">
                    <img src="/img/pay/errors.png" alt />
                </div>
                <p class="col-333333 font24 mt25 mb19 text-center">
                    <span>提交失败</span>
                </p>
                <p class="font14 col-333333 text-center desc mb29">
                    <span>{{ message }}</span>
                    <!-- <span>您当前的佣金不满</span>
                    <span class="col-ff0000">{{ amount }}元，</span>
                    <span>暂时不能提现，请达到</span>
                    <span class="col-ff0000">{{ amount }}元</span>
                    <span>以上再申请提现</span>-->
                </p>
                <button style="background: #4fa1fe;" class="confirm" @click.stop="onClose">
                    <span class="font16 col-w">我知道了</span>
                </button>
            </div>
            <div class="flex justify-center w-full mt20 col-w">
                <i class="iconfont icon-no cursor-pointer font28" @click.stop="onClose"></i>
            </div>
        </el-dialog-custom>
    </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { mapGetters } from 'vuex';
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
        return {
            message: '',
        };
    },
    computed: {
        ...mapGetters([
            'my',
        ]),
        visible_: {
            get() {
                return this.visible;
            },
            set(newVal) {
                return this.$emit('close');
            },
        },
    },
    methods: {
        /**
         * 关闭弹窗
         */
        onClose() {
            this.visible_ = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.dialog-withdrawal-result-container {
    & ::v-deep .el-dialog {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0);
    }
    .my-dialog-content {
        width: 380px;
        height: 340px;
        background: #ffffff;
        border-radius: 10px;
        padding: 10px 19px;
        box-sizing: border-box;
        .col-333333 {
            color: #333333;
        }
        .col-ff0000 {
            color: #ff0000;
        }
        .errors {
            width: 133px;
            height: 121px;
        }
        .desc {
            line-height: 24px;
        }
        .confirm {
            width: 200px;
            height: 38px;
            background: #4836e2;
            border-radius: 19px;
            box-sizing: border-box;
        }
    }
}
</style>
