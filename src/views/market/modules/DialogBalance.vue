<template>
    <el-dialog
        class="balance-dialog"
        title="申请提现"
        :visible.sync="dialogVisible"
        width="370px"
        :close-on-click-modal="false">
        <el-form :model="formData" ref="form" label-width="90px" label-position="left">
            <el-form-item label="我的佣金">
                <el-input v-model="amount" readonly>
                    <span slot="append">元</span>
                </el-input>
            </el-form-item>
            <el-form-item label="提现佣金" prop="money">
                <el-input v-model="formData.money" placeholder="请输入提现佣金">
                    <span slot="append">元</span>
                </el-input>
            </el-form-item>
            <el-form-item label="提现至" prop="shopId">
                <div class="flex items-center">
                    <div class="flex-1 text-right icon-zfb"></div>
                    <div class="pl5 pr15" style="color: #cac8c8;">支付宝</div>
                </div>
            </el-form-item>
            <el-form-item label="支付宝账号" prop="account">
                <el-input v-model="formData.account" placeholder="请输入支付宝账号"></el-input>
            </el-form-item>
            <el-form-item label="支付宝姓名" prop="accountName">
                <el-input v-model="formData.accountName" placeholder="请输入支付宝姓名"></el-input>
            </el-form-item>
            <!-- <el-form-item label="短信验证码" prop="shopId">
                <div class="flex items-center ver-code">
                    <el-input class="flex-1" v-model="formData.balance" placeholder="请输入短信验证码"></el-input>
                    <el-button size="mini">获取验证码</el-button>
                </div>
            </el-form-item> -->
        </el-form>
        <div class="tip">
            提现规则：填写支付宝账号和姓名必须一致若有疑问，请联系客服
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="onReset">重 置</el-button>
            <el-button type="primary" @click="onSubmit" :loading="loading">提 交</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { addObj } from "@/api/admin/sysenchashmentrecord"
export default {
    components: {},
    data() {
        return {
            dialogVisible: false,
            loading: false,
            formData: {
                accountType: 0,
                type: 0
            },
            amount: 0
        }
    },
    computed: {
    },
    methods: {
        showEdit (amount) {
            this.dialogVisible = true
            this.amount = amount || 0
        },
        onReset () {
            this.$refs.form.resetFields()
        },
        async onSubmit () {
            const params = {
                ...this.formData
            }
            if (!params.money ||  params.money <= 0) return this.$message.warning('请输入正确的提现佣金！')
            this.loading = true
            try {
                const { data } = await addObj(params)
                this.loading = false
                if (data.code == 0) {
                    this.$message.success('提交申请成功，请耐心等待审核')
                    this.dialogVisible = false
                    this.formData = {
                        accountType: 0,
                        type: 0
                    }
                    this.$emit('success')
                }
            } catch (err) {
                this.loading = false
            }
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
    .balance-dialog {
        ::v-deep .el-dialog {
            border-radius: 8px;
            .el-dialog__header {
                text-align: left;
                border-bottom: 1px solid #ededed;
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
                padding: 10px 20px 20px;
                .el-form-item {
                    position: relative;
                    border-bottom: 1px solid #ededed;
                    margin-bottom: 0;
                    .el-form-item__label {
                        margin: 5px 0;
                    }
                    .el-form-item__content {
                        padding-top: 5px;
                    }
                    .el-input {
                        .el-input__inner {
                            border: 0;
                            text-align: right;
                        }
                        .el-input-group__append {
                            padding: 0;
                            border: 0;
                            background: none;
                            color: #333;
                            padding-right: 5px;
                        }
                    }
                    .icon-zfb {
                        width: 30px;
                        height: 30px;
                        background: url('/img/pay/icon_zfb.png') no-repeat right;
                        background-size: contain;
                    }
                }
                .el-form-item:hover {
                    border-color: rgb(70, 180, 109);
                }
                .tip {
                    color: red;
                    font-size: 13px;
                    margin-top: 15px;
                    line-height: 22px;
                }
            }
        }
    }
</style>