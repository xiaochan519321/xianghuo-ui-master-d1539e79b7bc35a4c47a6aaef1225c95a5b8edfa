<template>
    <div class="syscdkey-form">
        <el-dialog
            width="512px"
            title="分站充值"
            :close-on-click-modal="false"
            :visible.sync="visible_"
        >
            <el-form
                :model="dataForm"
                :rules="dataRule"
                ref="dataForm"
                label-width="80px"
            >
                <el-form-item label="站点" prop="tenantId" v-if="tenanList.length">
                    <el-select
                        style="width: 100%"
                        v-model="dataForm.tenantId"
                        placeholder="请选择站点"
                    >
                        <el-option
                            v-for="item in tenanList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="充值金额" prop="money">
                    <el-input
                        :min="0"
                        type="number"
                        v-model="dataForm.money"
                        placeholder="请输入充值金额"
                    >
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                <el-input type="textarea" placeholder="请输入充值备注" rows="3" resize="none" :maxlength="30" v-model="dataForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="onClose">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit" :loading="loading">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getChildSite } from '@/api/admin/site'
import { giveSiteBalance } from "@/api/admin/site-balance";

const validateMoney = (rule, value, callback) => {
    if (value < 1) {
        callback(new Error("充值金额不能小于1元"))
    } else {
        callback();
    }
};

export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            dataForm: {
                tenantId: '',
                money: '',
            },
            dataRule: {
                money: [
                    { required: true, trigger: 'blur', validator: validateMoney }
                ],
            },
            loading: false,
            price: 0,
            tenanList: []
        }
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
    methods: {
        /**
         * 关闭弹窗
         */
        onClose() {
            this.visible_ = false;
            this.loading = false;
            this.dataForm = this.$options.data().dataForm;
            this.$refs.dataForm.resetFields();
        },
        /**
         * 表单提交
         */
        dataFormSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    const tenantName = this.tenanList.filter(item => {
                        return item.id == this.dataForm.tenantId
                    })[0].name
                    this.$confirm(`是否为${tenantName}充值${this.dataForm.money}元吗？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnClickModal: false,
                        type: 'warning'
                    }).then(async () => {
                        this.loading = true
                        try {
                            await giveSiteBalance(this.dataForm)
                            this.$message.success('充值成功')
                            this.onClose()
                            this.$emit('success')
                        } finally {
                            this.loading = false;
                        }
                    })
                }
            })
        },
		async getChildSiteList () {
			const { data } = await getChildSite()
			this.tenanList = data.data || []
		},
    },
    created () {
        this.getChildSiteList()
    },
}
</script>
<style lang="scss" scoped>
.syscdkey-form {
    .price {
        color: #ff0000;
        padding-left: 80px;
    }
    .price-tip {
        margin-left: 8px;
    }
}
</style>
