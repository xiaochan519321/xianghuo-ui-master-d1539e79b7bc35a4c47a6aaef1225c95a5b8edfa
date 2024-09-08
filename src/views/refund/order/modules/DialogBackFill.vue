<template>
    <el-dialog
        class="backFill-dialog"
        title="回填采购物流单号"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="512px">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" v-loading="dialogLoading">
            <el-form-item label="物流单号：" prop="returnLogisticsCode">
                <el-input type="text" :placeholder="`请填写回填的物流单号`" v-model="form.returnLogisticsCode"></el-input>
            </el-form-item>
            <el-form-item label="物流公司：" prop="company">
                <el-select v-model="form.company" placeholder="请选择对应物流公司" style="width: 100%;">
                    <el-option v-for="(item, index) in companyList" :key="index" :label="item.company || item.companyName" :value="item.company || item.companyName"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit" :loading="loading">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { getCompanyList, saveBackfill, get1688RefundOptions } from '@/api/refund/order'
export default {
    components: {},
    watch: {
    },
    data() {
        return {
            dialogVisible: false,
            dialogLoading: false,
            form: {},
            codeList: [],
            rules: {
                company: [
                    { required: true, message: '请选择对应的物流公司', trigger: 'change' }
                ],
                returnLogisticsCode: [
                    { required: true, message: '请填写物流单号', trigger: 'blur' }
                ]
            },
            loading: false,
            companyList: [],
            item: {}
        }
    },
    computed: {},
    methods: {
        onSubmit () {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    this.loading = true
                    const params = {
                        ...this.form,
                        ddShippingCompanyDTO: {
                            company: this.form.company
                        }
                    }
                    try {
                        // 供应链订单需多传companyCode
                        if (this.item.platform == 1) {
                            const companyCode = this.companyList.filter(item => item.companyName == this.form.company)[0].companyNo
                            params['ddShippingCompanyDTO']['companyCode'] = companyCode
                        }
                        console.log('params', params)
                        const { data } = await saveBackfill(params)
                        this.loading = false
                        if (data.code == 0) {
                            this.dialogVisible = false
                            this.$message.success(data.msg)
                            this.$emit('success')
                        }
                    } catch (err) {
                        this.loading = false
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        showEdit (item) {
            this.dialogVisible = true
            console.log('item', item)
            this.item = item
            this.form = {
                aftersaleId: item.aftersaleId,
                returnLogisticsCode: item.returnLogisticsCode || '',
            }
            if (item.platform == 1) {
                // 供应链回填
                this.loadSupplyCompany()
            } else {
                this.loadCompanyList()
            }
        },
        // PDD回填物流公司列表
        async loadCompanyList () {
            this.dialogLoading = true
            const { data } = await getCompanyList({current: 1, size: 99})
            this.companyList = data.data || []
            this.handleSetCompanyName('company')
            this.dialogLoading = false
        },
        // 供应链回填物流公司列表
        async loadSupplyCompany () {
            this.dialogLoading = true
            const { data } = await get1688RefundOptions()
            console.log('get1688RefundOptions', data)
            this.companyList = data.data.logistics || []
            this.handleSetCompanyName('companyName')
            this.dialogLoading = false
        },
        handleSetCompanyName (companyKey) {
            let companyName = ''
            if (this.item.returnLogisticsCompanyName) {
                const companySub = this.item.returnLogisticsCompanyName.substr(0, 2)
                this.companyList.forEach(com => {
                    if (com[companyKey].indexOf(companySub) > -1) {
                        companyName = com.company
                    }
                })
                this.$set(this.form, 'company', companyName)
            }
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
    .backFill-dialog {
        border-radius: 10px;
        ::v-deep .el-loading-mask {
            position: absolute !important;
        }
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