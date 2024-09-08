<template>
    <el-dialog
        class="agree-dialog"
        title="处理提现申请"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="512px">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="是否同意：">
                <el-radio-group v-model="form.auditStatus">
                    <el-radio :label="1">同意申请</el-radio>
                    <el-radio :label="3 ">拒绝申请</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="审核备注：" prop="auditRemark">
                <el-input type="textarea" :rows="3" resize="none" v-model="form.auditRemark" placeholder="请输入审核备注"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit" :loading="loading">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { auditWithdrawal } from '@/api/admin/ddkOrder'
export default {
    components: {},
    data() {
        return {
            dialogVisible: false,
            form: {
                auditStatus: 1
            },
            loading: false
        }
    },
    computed: {},
    methods: {
        async onSubmit () {
            this.loading = true
            try {
                const { data } = await auditWithdrawal(this.form)
                this.loading = false
                if (data.code == 0) {
                    this.form = { auditStatus: 1 }
                    this.dialogVisible = false
                    this.$message.success(data.msg)
                    this.$emit('success')
                }
            } catch (err) {
                this.loading = false
            }
        },
        showEdit (item) {
            this.dialogVisible = true
            this.form.id = item.id
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
    .agree-dialog {
        border-radius: 10px;
        ::v-deep .el-dialog__header {
            padding: 15px 20px 15px;
            border-bottom: 1px solid #ededed;
            .el-dialog__title {
                font-size: 15px;
                font-weight: 500;
            }
        }
        ::v-deep .el-dialog__body {
            .el-form {
                padding-left: 30px;
                padding-right: 40px;
                .uploader-content {
                    .has-img {
                        height: 86px;
                        display: inline-block;
                        position: relative;
                        border-radius: 6px;
                        outline: 2px solid rgb(70, 180, 109) !important;
                        overflow: hidden;
                        .img-event {
                            opacity: 0;
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            background-color: #00000090;
                            color: #fff;
                            line-height: 26px;
                            display: flex;
                            align-items: center;
                            text-align: center;
                            i {
                                flex: 1;
                                cursor: pointer;
                            }
                        }
                    }
                    .has-img:hover {
                        .img-event {
                            opacity: 1;
                            transition: all 0.5s;
                        }
                    }
                    .avatar-uploader {
                        display: inline-block;
                        .el-upload {
                            height: 86px;
                            .avatar-uploader-icon {
                                width: 86px !important;
                                height: 86px !important;
                                line-height: 86px !important;
                            }
                        }
                    }
                    .uploader-example {
                        display: inline-block;
                        vertical-align: top;
                        .title {
                            vertical-align: top;
                            margin: 0 20px;
                        }
                        .el-image {
                            border: 1px solid #ededed;
                            border-radius: 6px;
                        }
                    }
                }
                .evidence-tip {
                    color: #898B8E;
                    font-size: 12px;
                    line-height: 18px;
                    font-weight: 500;
                    margin-right: -30px;
                    .title {
                        font-weight: 600;
                    }
                }
            }
        }
    }
</style>