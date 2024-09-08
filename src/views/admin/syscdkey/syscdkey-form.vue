<template>
    <div class="syscdkey-form">
        <el-dialog
            width="600px"
            title="购买卡密"
            :close-on-click-modal="false"
            :visible.sync="visible_"
        >
            <el-form
                :model="dataForm"
                :rules="dataRule"
                ref="dataForm"
                @keyup.enter.native="dataFormSubmit()"
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
                <el-form-item label="卡密类型" prop="cdkeyType">
                    <el-select
                        style="width: 100%"
                        v-model="dataForm.cdkeyType"
                        placeholder="请选择卡密类型"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="购买数量" prop="buyNumber">
                    <el-input
                        :min="0"
                        type="number"
                        v-model="dataForm.buyNumber"
                        placeholder="请输入购买数量"
                    ></el-input>
                </el-form-item>
                <div class="tag-group price">
                    <el-tag>
                        <span>站点成本：{{ price }}元</span>
                    </el-tag>
                    <el-tag class="price-tip" type="danger"><span>购买卡密会扣除站点余额，请谨慎操作</span></el-tag>
                </div>
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
import { buyCdKey, calculatePrice } from '@/api/syscdkey';
import { debounce } from '@/scripts/utils/index';

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
                buyNumber: '',
                cdkeyType: '',
            },
            dataRule: {
                cdkeyType: [
                    { required: true, message: '请选择卡密类型', trigger: 'blur' }
                ],
                buyNumber: [
                    { required: true, message: '购买数量不能为空', trigger: 'blur' }
                ],
            },
            options: [
                {
                    value: 'REGULAR_MONTH',
                    label: '个人版一个月'
                }, {
                    value: 'REGULAR_QUARTER',
                    label: '个人版一季度'
                }, {
                    value: 'REGULAR_HALF_YEAR',
                    label: '个人版半年'
                },
                {
                    value: 'UITIMATE_YEAR',
                    label: '旗舰版一年'
                }, {
                    value: 'TEAM_YEAR',
                    label: '团队版一年'
                }, {
                    value: 'ENTERPRISE_YEAR',
                    label: '企业版一年'
                }
            ],
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
    watch: {
        dataForm: {
            handler(newVal) {
                if (newVal.buyNumber && newVal.cdkeyType) {
                    this.getPrices();
                }
            },
            deep: true,
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
            this.$refs['dataForm'].validate(async (valid) => {
                if (valid) {
                    this.loading = true;
                    try {
                        await buyCdKey(this.dataForm);
                        this.$message.success('购买成功');
                        this.onClose();
                        this.$emit('success');
                    } finally {
                        this.loading = false;
                    }
                }
            })
        },
		async getChildSiteList () {
			const { data } = await getChildSite()
			this.tenanList = data.data || []
		},
        /**
         * 获取价格
         */
        getPrices: debounce(async function () {
            if (this.dataForm.buyNumber === '0') return this.price = 0;
            if (!this.dataForm.buyNumber || !this.dataForm.cdkeyType) return this.price = 0;
            try {
                const { data: { data } } = await calculatePrice(this.dataForm);
                this.price = data;
            } catch (error) {

            }
        }, 1000),
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
