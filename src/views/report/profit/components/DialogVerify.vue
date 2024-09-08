<template>
    <el-dialog
        class="profit-verify-dialog"
        title="报表校准"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        v-loading="dialogLoading"
        width="412px">
        <div class="tip">财务报表校准前，请先在订单代发、售后工作台中进行订单同步</div>
        <el-form ref="form" :model="form" :rules="rules" label-width="60px">
            <el-form-item label="店铺" prop="shopId">
                <el-select v-model="form.shopId" placeholder="请选择店铺" style="width: 100%;">
                    <el-option
                        v-for="(item, index) in shopList"
                        :key="index"
                        :label="item.shopName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间" prop="createTime">
                <el-date-picker
                    v-model="form.createTime"
                    type="date"
                    style="width: 100%;"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit" :loading="loading">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { profitDataVerfiy } from '@/api/report/profit'
export default {
    components: {},
    watch: {
        dialogVisible (val, oldVal) {
            if (!val) {
                this.form = {}
                this.$refs.form.resetFields()
            }
        }
    },
    data() {
        return {
            dialogVisible: false,
            dialogLoading: false,
            form: {
                shopId: '',
                createTime: ''
            },
            rules: {
                createTime: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ]
            },
            loading: false,
            shopList: [],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > (Date.now() - 86400000)
                },
            },
        }
    },
    computed: {},
    methods: {
        onSubmit () {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let params = {
                        shopId: this.form.shopId,
                        createTime: this.form.createTime
                    }
                    this.loading = true
                    try {
                        const { data } = await profitDataVerfiy(params)
                        console.log('data', data)
                        this.loading = false
                        this.$message.success('校准成功')
                        this.dialogVisible = false
                        this.$emit('success')
                    } catch (err) {
                        this.loading = false
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        showModel (list) {
            this.dialogVisible = true
            this.shopList = list
        }
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
    .profit-verify-dialog {
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
            .tip {
                color: red;
                margin-bottom: 20px;
                padding: 0 45px;
                line-height: 22px;
            }
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