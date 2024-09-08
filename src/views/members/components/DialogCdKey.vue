<template>
    <div class="dialog-cd-key-components">
        <el-dialog-custom width="420px" :visible="visible_" @close="onClose">
            <div class="wrapper" v-if="visible_">
                <div class="header">
                    <p class="title">卡密兑换</p>
                    <i class="el-icon-close" @click.stop="onClose"></i>
                </div>
                <div class="content">
                    <el-form :model="formData" :rules="rules" ref="formData">
                        <el-form-item prop="cdKey">
                            <el-input
                                size="medium"
                                v-model="formData.cdKey"
                                placeholder="请输入卡密序列号兑换"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="mt20 flex justify-center">
                        <el-button class="confirm" @click.stop="onClickConfirm" :loading="loading">
                            <span>确定兑换</span>
                        </el-button>
                    </div>
                    <p class="mt20 desc">
                        <span>兑换后不可撤销，请谨慎操作</span>
                    </p>
                </div>
            </div>
        </el-dialog-custom>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ElDialogCustom from '@/components/base/ElDialogCustom';
import { useCdKey } from '@/api/syscdkey';

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
            formData: {
                cdKey: '',
            },
            rules: {
                cdKey: [
                    { required: true, message: '卡密序列号不能为空', trigger: 'blur' }
                ],
            },
            loading: false,
        };
    },
    computed: {
        ...mapGetters([

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
            this.loading = false;
            this.formData.cdKey = '';
            this.$refs.formData.resetFields();
        },
        /**
         * 兑换卡密
         */
        onClickConfirm() {
            this.$refs['formData'].validate(async (valid) => {
                if (valid) {
                    this.loading = true;
                    try {
                        const { data: { data } } = await useCdKey(this.formData);
                        this.$message.success('兑换成功');
                        this.onClose();
                        this.$emit('success');
                    } finally {
                        this.loading = false;
                    }
                }
            })
        },
    },
};
</script>

<style lang="scss" scoped>
.dialog-cd-key-components {
    .wrapper {
        width: 100%;
        background: #ffffff;
        position: relative;
        .header {
            width: 100%;
            height: 40px;
            background: #4ea1fe;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 26px;
            color: #fff;
            box-sizing: border-box;

            .title {
                font-size: 16px;
                font-weight: 600;
            }

            .el-icon-close {
                font-size: 20px;
                cursor: pointer;
            }
        }
        .content {
            padding: 26px;
            box-sizing: border-box;

            .confirm {
                width: 123px;
                height: 32px;
                background: #3f9eff;
                border-radius: 4px;
                color: #fff;
            }

            .desc {
                text-align: center;
                font-size: 12px;
                color: #4ea1fe;
            }
        }
    }
}
</style>
