<template>
    <el-dialog
        class="purchase-dispose-dialog"
        title="供应商售后"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        v-loading="dialogLoading"
        width="512px">
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
            <el-form-item label="售后类型：">
                <el-radio-group v-model="form.afterSaleType">
                    <el-radio label="2" :disabled="form.afterSaleType != 2">未发货仅退款</el-radio>
                    <el-radio label="1" :disabled="form.afterSaleType != 1">已发货仅退款</el-radio>
                    <el-radio label="0" :disabled="form.afterSaleType != 0">退货退款</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="货物状态：" prop="alibabaGoodsStatusEnum">
                <el-radio-group v-model="form.alibabaGoodsStatusEnum" @change="onStatusChange">
                    <el-radio label="REFUNDWAITSELLERSEND">等待发货</el-radio>
                    <el-radio label="REFUNDWAITBUYERRECEIVE">等待买家收货</el-radio>
                    <el-radio label="REFUNDBUYERRECEIVED">买家已收货</el-radio>
                    <el-radio label="AFTERSALEBUYERNOTRECEIVED">买家未收货，但已确认收货</el-radio>
                    <el-radio label="AFTERSALEBUYERRECEIVED">买家已收货，但已确认收货</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="申请原因：" prop="reasonId" key="reasonId" v-if="form.alibabaGoodsStatusEnum">
                <el-select v-model="form.reasonId" placeholder="请选择拒绝类型" style="width: 300px;">
                    <el-option v-for="(item, index) in reasonList" :key="index" :label="item.name" :value="item.id"></el-option>
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
import { getRefundReasonList, afterSaleOperate1688 } from '@/api/refund/order'
import store from "@/store"
export default {
    components: {},
    watch: {
        dialogVisible (val, oldVal) {
            if (!val) {
                this.form = {
                    type: 201
                }
                this.rejectItem = {}
                this.evidenceUrl = ''
                this.$refs.form.resetFields()
            }
        }
    },
    data() {
        return {
            dialogVisible: false,
            dialogLoading: false,
            form: {},
            rules: {
                alibabaGoodsStatusEnum: [
                    { required: true, message: '请选择货物状态', trigger: 'change' }
                ],
                reasonId: [
                    { required: true, message: '请选择申请原因', trigger: 'blur' }
                ],
            },
            loading: false,
            item: {},
            reasonList: []
        }
    },
    computed: {},
    methods: {
        async onStatusChange (val) {
            const params = {
                goodsStatus: val,
                orderId: this.item.pddOrderId
            }
            if (val) {
                this.dialogLoading = true
                try {
                    const { data } = await getRefundReasonList(params)
                    console.log('data', data)
                    this.reasonList = data.data || []
                    this.dialogLoading = false
                    this.$set(this.from, 'reasonId', '')
                } catch (err) {
                    this.dialogLoading = false
                }
            }
        },
        onSubmit () {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    this.loading = true
                    try {
                        const { data } = await afterSaleOperate1688(this.form)
                        if (data.code == 0) {
                            this.form = {}
                            this.loading = false
                            this.dialogVisible = false
                            this.$message.success('操作成功')
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
        showModel (item) {
            this.dialogVisible = true
            this.item = item
            this.form = {
                afterSaleType: item.aftersaleType,
                afterSaleId: item.aftersaleId
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
    .purchase-dispose-dialog {
        border-radius: 10px;
        ::v-deep .el-loading-mask {
            position: absolute;
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
                .el-radio {
                    margin-bottom: 15px;
                }
            }
        }
    }
</style>