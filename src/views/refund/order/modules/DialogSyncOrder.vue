<template>
    <div class="dialog-sync-order-components">
        <el-dialog title="同步订单" :visible.sync="visible_" width="50%">
            <el-tag size="mini" type="primary">选择同步时间，确定后即可重新获取该时间段的订单数据；</el-tag>
            <div class="mt30">
                <div class="form-box">
                    <!-- <div class="flex items-center mb15">
                        <div class="label">
                            <span class="mr10">同步商品ID</span>
                        </div>
                        <el-input
                            v-model="formData.product"
                            placeholder="输入商品ID即可同步指定商品"
                            style="width:350px;"
                        ></el-input>
                    </div> -->
                    <div class="flex items-center mb15">
                        <div class="label">
                            <span style="color: #F56C6C;margin-right: 4px;">*</span>
                            <span class="mr10">选择同步店铺</span>
                        </div>
                        <el-select v-model="formData.shopIds" placeholder="请选择" style="width:350px;" multiple collapse-tags>
                            <el-option
                                v-for="item in data"
                                :key="item.id"
                                :label="item.shopName"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                        <el-checkbox v-model="allShop" @change="onAllCheck" class="ml10" style="color: #a2a2a2;">全部店铺</el-checkbox>
                    </div>
                    <div class="flex items-center">
                        <div class="label">
                            <span style="color: #F56C6C;margin-right: 4px;">*</span>
                            <span class="mr10">选择同步日期</span>
                        </div>
                        <el-date-picker
                            v-model="formData.syncData"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                        ></el-date-picker>
                        <el-time-picker
                            class="ml10"
                            is-range
                            v-model="formData.syncTime"
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            format="HH:mm:ss"
                            value-format="HH:mm:ss"
                        ></el-time-picker>
                    </div>
                </div>
                <div class="flex flex-row-reverse">
                    <el-button type="primary" @click="onClickConfirm" :loading="loading">
                        <span>开始同步</span>
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { syncOrder } from '@/api/refund/order'

export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        data: {
            type: Array,
            default: () => [],
        },
    },
    watch: {
        allCheckShop (val, oldVal) {
            this.allShop = val
        }
    },
    data() {
        return {
            formData: {
                shopIds: [],
                syncData: '',
                syncTime: ["00:00:00", "23:59:59"]
            },
            allShop: false,
            pickerOptions: {
                disabledDate(time) {
                    const now = Date.now()
                    return time.getTime() > now || time.getTime() < now - 7776000000
                },
                shortcuts: [
                    {
                        text: '今天',
                        onClick(picker) {
                            const end = new Date();
                            picker.$emit('pick', [end, end]);
                        }
                    },
                    {
                        text: '昨天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            end.setTime(end.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近2天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ],
            },
            loading: false,
        };
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
        allCheckShop () {
            return this.formData.shopIds.length === this.data.length
        }
    },
    methods: {
        /**
         * 同步订单
         */
        async onClickConfirm() {
            if (!this.formData.shopIds.length) return this.$message.error('请选择需要同步的店铺')
            if (!this.formData.syncData) return this.$message.error('同步日期不能为空')
            this.loading = true
            const params = {
                shopIds: this.formData.shopIds,
                startTime: `${this.formData.syncData[0]} ${this.formData.syncTime[0]}`,
                endTime: `${this.formData.syncData[1]} ${this.formData.syncTime[1]}`
            }
            try {
                const { data } = await syncOrder(params)
                this.$message.success('同步成功')
                this.$emit('success')
                this.visible_ = false
            } finally {
                this.loading = false
            }
        },
        onAllCheck (val) {
            if (val) {
                this.formData.shopIds = this.data.map(item => item.id)
            } else {
                this.formData.shopIds = []
            }
        }
    },
};
</script>

<style lang="scss" scoped>
.dialog-sync-order-components {
    .form-box {
        height: 150px;
        .label {
            min-width: 110px;
            text-align: right;
        }
    }
}
</style>
