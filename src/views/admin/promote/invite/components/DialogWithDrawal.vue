<template>
    <div class="dialog-withdrawal-container">
        <el-dialog-custom width="520px" :visible="visible_" @close="onClose">
            <div class="content">
                <div class="my-dialog-title relative select-none">
                    <span>申请提现</span>
                    <i class="iconfont icon-shibai" @click.stop="onClose"></i>
                </div>
                <div class="my-dialog-content">
                    <div class="form-box pt20">
                        <div class="item-form flex items-center">
                            <div class="lbox">
                                <span>我的佣金：</span>
                            </div>
                            <div class="rbox flex-1 text-right">
                                <span v-if="my">￥{{ my.profitMoney }}元</span>
                            </div>
                        </div>
                        <div class="item-form flex items-center">
                            <div class="lbox">
                                <span>提现佣金：</span>
                            </div>
                            <div class="rbox flex-1">
                                <input
                                    v-model="form.money"
                                    class="form-input"
                                    type="text"
                                    placeholder="请输入提现佣金"
                                />
                            </div>
                        </div>
                        <div class="item-form flex items-center">
                            <div class="lbox">
                                <span>提现至：</span>
                            </div>
                            <div class="rbox flex-1 flex items-center flex-row-reverse">
                                <div class="flex items-center">
                                    <i class="iconfont icon-zhifubaozhifu font32"></i>
                                    <span class="font14 ml6">支付宝</span>
                                </div>
                            </div>
                        </div>
                        <div class="item-form flex items-center">
                            <div class="lbox">
                                <span>支付宝账号：</span>
                            </div>
                            <div class="rbox flex-1">
                                <input
                                    v-model="form.account"
                                    class="form-input"
                                    type="text"
                                    placeholder="请输入支付宝账号(手机号)"
                                />
                            </div>
                        </div>
                        <div class="item-form flex items-center">
                            <div class="lbox">
                                <span>支付宝姓名：</span>
                            </div>
                            <div class="rbox flex-1">
                                <input
                                    v-model="form.accountName"
                                    class="form-input"
                                    type="text"
                                    placeholder="请输入支付宝姓名"
                                />
                            </div>
                        </div>
                        <div class="item-form flex items-center">
                            <div class="lbox">
                                <span>短信验证：</span>
                            </div>
                            <div class="rbox flex-1 flex items-center">
                                <input
                                    v-model="form.smsCode"
                                    class="form-input"
                                    type="text"
                                    placeholder="请输入短信验证码"
                                />
                                <button class="get-code font12 ml10" @click.stop="onGetCode">
                                    <span>{{ message }}</span>
                                </button>
                            </div>
                        </div>
                        <p class="font12 desc">
                            <span>提现规则：填写支付宝账号和姓名必须一致，若有疑问请联系客服</span>
                        </p>
                        <div class="flex justify-center mt45">
                            <el-button
                                class="confirm"
                                @click.stop="onClickConfirm"
                                :loading="loading"
                            >
                                <span>提交</span>
                            </el-button>
                            <el-button class="cancel" @click.stop="onClickCancel">
                                <span>重置</span>
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog-custom>
        <dialog-result :visible="show" @close="show = false" ref="result"></dialog-result>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DialogResult from './DialogResult';
import { throttle } from '@/scripts/utils/index';
import { isPhone } from '@/scripts/utils/regular';
import ElDialogCustom from '@/components/base/ElDialogCustom';

export default {
    components: {
        ElDialogCustom,
        DialogResult,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            show: false,
            message: '获取验证码',
            isGetCode: true, // 记录是否获取过验证码
            canClick: true,
            totalTime: 60,
            form: {
                money: '',
                account: '',
                accountName: '',
                accountType: 1,
                smsCode: '',
            },
            loading: false,
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
         * 获取验证码
         */
        onGetCode: throttle(async function () {
            if (this.form.account === '') return this.$message.error('请先输入支付宝账号(手机号)');
            if (isPhone(this.form.account)) return this.$message.error('请输入正确的手机号码');
            try {
                const { data } = await this.$http.getSmsRegCode(this.form.account);
                if (this.canClick && data) {
                    this.isGetCode = true;
                    this.canClick = false;
                    this.message = `${this.totalTime}s`;
                    const clock = setInterval(() => {
                        this.totalTime--;
                        this.message = `${this.totalTime}s`;
                        if (this.totalTime < 0) {
                            clearInterval(clock);
                            this.message = '重新发送验证码';
                            this.totalTime = 120;
                            this.canClick = true;
                        }
                    }, 1000);
                }
            } catch (error) {

            }
        }),
        /**
         * 提交
         */
        onClickConfirm: throttle(async function () {
            if (this.form.money === '') return this.$message.error('请先输入提现佣金');
            if (this.form.account === '') return this.$message.error('请先输入支付宝账号(手机号)');
            if (isPhone(this.form.account)) return this.$message.error('请输入正确的手机号码');
            if (this.form.accountName === '') return this.$message.error('请先输入支付宝姓名');
            if (!this.isGetCode) return this.$message.error('请先获取短信验证码');
            if (this.form.smsCode === '') return this.$message.error('请先输入短信验证码');
            this.loading = true;
            try {
                const { form } = this;
                await this.$http.enchashment(form);
                this.$message.success('提现成功');
                await this.$store.dispatch('getMy');
                this.onClose();
            } catch (error) {
                this.$refs.result.message = error.msg;
                this.show = true;
            } finally {
                this.loading = false;
            }
        }),
        /**
         * 重置
         */
        onClickCancel() {
            this.form = this.$options.data().form;
        },
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
.dialog-withdrawal-container {
    & ::v-deep .el-dialog {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0);
    }
    .content {
        width: 520px;
        height: 620px;
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
        .my-dialog-title {
            width: 100%;
            height: 54px;
            background: $themeColor;
            font-size: 16px;
            color: #ffffff;
            text-align: center;
            line-height: 54px;
            .icon-shibai {
                right: 20px;
                font-size: 28px;
                cursor: pointer;
                position: absolute;
                top: 50%;
                -webkit-transform: translate3d(0, -50%, 0);
                transform: translate3d(0, -50%, 0);
            }
        }
        .my-dialog-content {
            padding: 0 28px;
            box-sizing: border-box;
            .form-box {
                .item-form {
                    height: 52px;
                    border-bottom: 1px solid #dedede;
                    box-sizing: border-box;
                    margin-bottom: 15px;
                    .rbox {
                        .form-input {
                            width: 100%;
                            height: 52px;
                            background: transparent;
                            text-align: right;
                        }
                        .get-code {
                            width: 120px;
                            height: 30px;
                            background: $themeColor;
                            border-radius: 4px;
                            box-sizing: border-box;
                        }
                        .icon-zhifubaozhifu {
                            color: rgba(0, 167, 239, 1);
                        }
                    }
                }
                .desc {
                    color: #e24582;
                }
                button {
                    border: 0;
                    color: #fff;
                    padding: 0;
                }
                .confirm {
                    width: 140px;
                    height: 34px;
                    background: $themeColor;
                    border-radius: 4px;
                }
                .cancel {
                    width: 100px;
                    height: 34px;
                    background: #d8d8d8;
                    color: #666666;
                    border-radius: 4px;
                    margin-left: 60px;
                }
            }
        }
    }
}
</style>
