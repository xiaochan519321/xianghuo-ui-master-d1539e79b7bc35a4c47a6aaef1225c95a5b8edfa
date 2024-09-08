<template>
    <div class='dialog-sales'>
        <el-dialog title="销售单自动售后设置" :visible.sync="salesDialog" width="550px" top="10%" :close-on-click-modal="false">
            <div class="tip-title">自动售后订单范围</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px">
                <el-form-item label="生效店铺" prop="shopId" class="check-shop">
                    <el-select v-model="ruleForm.shopId" placeholder="请选择生效店铺" clearable style="width: 280px;" multiple collapse-tags>
                        <el-option
                            v-for="(item, index) in shopList"
                            :key="index"
                            :label="item.shopName"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                    <el-checkbox v-model="allShop" @change="onAllCheck">全部店铺</el-checkbox>
                </el-form-item>
                <el-form-item label="售后创建时间" prop="orderTime">
                    <el-date-picker
                        v-model="ruleForm.orderTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        :picker-options="pickerOptions"
                        :default-time="['00:00:00', '23:59:59']"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="售后类型" prop="aftersaleType">
                    <el-checkbox-group v-model="ruleForm.aftersaleType">
                        <el-checkbox label="2">未发货仅退款（已代发）</el-checkbox>
                        <el-checkbox label="1">已发货仅退款（已代发）</el-checkbox>
                        <el-checkbox label="0">退货退款（已代发）</el-checkbox>
                    </el-checkbox-group>
                    <p class="type-tip">仅支持在本平台已代发产生售后的订单</p>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="salesDialog = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { setConfig } from '@/api/refund/config'
export default {
    components: {},
    watch: {
        allCheckShop (val, oldVal) {
            this.allShop = val
        }
    },
    data() {
        const that = this
        return {
            salesDialog: false,
            ruleForm: {
                shopId: [],
                aftersaleType: [],
                orderTime: []
            },
            shopList: [],
            rules: {
                shopId: [
                    { type: 'array', required: true, message: '请至少选择一个店铺', trigger: 'change' }
                ],
                orderTime: [
                    { required: true, message: '请选择订单创建时间', trigger: 'change' }
                ]
            },
            allShop: false,
            loading: false,
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        const time = new Date()
                        const resTime = `${that.$moment(time).format('YYYY-MM-DD')} 00:00:00`
                        picker.$emit('pick', [`${resTime} 00:00:00`, `${resTime} 23:59:59`])
                    }
                },{
                    text: '昨天',
                    onClick(picker) {
                        const time = new Date();
                        time.setTime(start.getTime() - 3600 * 1000 * 24);
                        const resTime = `${that.$moment(time).format('YYYY-MM-DD')} 00:00:00`
                        picker.$emit('pick', [`${resTime} 00:00:00`, `${resTime} 23:59:59`])
                    }
                },{
                    text: '最近三天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                        const resStart = `${that.$moment(start).format('YYYY-MM-DD')} 00:00:00`
                        const resEnd = `${that.$moment(end).format('YYYY-MM-DD')} 23:59:59`
                        picker.$emit('pick', [resStart, resEnd])
                    }
                },{
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
                        const resStart = `${that.$moment(start).format('YYYY-MM-DD')} 00:00:00`
                        const resEnd = `${that.$moment(end).format('YYYY-MM-DD')} 23:59:59`
                        picker.$emit('pick', [resStart, resEnd])
                    }
                }]
            },
            configItem: {}
        }
    },
    computed: {
        allCheckShop () {
            return this.ruleForm.shopId.length === this.shopList.length
        },
    },
    methods: {
        onAllCheck (val) {
            if (val) {
                this.ruleForm.shopId = this.shopList.map(item => item.id)
            } else {
                this.ruleForm.shopId = []
            }
        },
        showEdit (item) {
            console.log('item', item)
            this.ruleForm = {
                ...this.ruleForm,
                ...item
            }
            if (item.orderTimeStart) {
                this.ruleForm.orderTime = [item.orderTimeStart, item.orderTimeEnd]
            }
            if (item.aftersaleType) {
                this.ruleForm.aftersaleType = item.aftersaleType.split(',')
            }
            if (item.shopId) {
                this.ruleForm.shopId = item.shopId.split(',')
            }
            console.log('ruleForm', this.ruleForm)
            this.salesDialog = true
        },
        onSubmit () {
            this.$refs['ruleForm'].validate(async (valid) => {
                if (valid) {
                    this.loading = true
                    const params = {
                        ...this.ruleForm,
                        shopId: this.ruleForm.shopId.join(','),
                        aftersaleType: this.ruleForm.aftersaleType.join(','),
                        orderTimeStart: this.ruleForm.orderTime[0],
                        orderTimeEnd: this.ruleForm.orderTime[1]
                    }
                    try {
                        const { data } = await setConfig(params)
                        this.loading = false
                        if (data.code == 0) {
                            this.ruleForm = {
                                shopId: [],
                                aftersaleType: [],
                                orderTime: []
                            }
                            this.salesDialog = false
                            this.$message.success('设置成功')
                            this.$emit('success')
                        }
                    } catch (err) {
                        this.loading = false
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        async loadShopList () {
            const { data: { data } } = await this.$API.getShopList()
            this.shopList = data || []
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.loadShopList()
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>
<style lang="scss" scoped>
    .dialog-sales {
        ::v-deep .el-dialog {
            border-radius: 10px;
            .el-dialog__header {
                padding: 15px 20px 15px;
                border-bottom: 1px solid #ededed;
                .el-dialog__title {
                    font-size: 17px;
                    font-weight: 500;
                }
            }
            .el-dialog__body {
                padding: 20px;
                .tip-title {
                    padding-left: 30px;
                    font-size: 16px;
                    color: #333;
                    margin-bottom: 20px;
                    position: relative;
                }
                .tip-title::before {
                    content: '';
                    position: absolute;
                    left: 15px;
                    height: 100%;
                    width: 5px;
                    border-radius: 5px;
                    background-color: rgb(70, 180, 109);
                }
                .check-shop {
                    .el-checkbox {
                        margin-left: 15px;
                    }
                    .el-checkbox__label {
                        color: #8998ac;
                    }
                }
                .el-checkbox-group {
                    .el-checkbox {
                        display: block;
                    }
                }
                .type-tip {
                    font-size: 12px;
                    color: red;
                }
            }
        }
    }
</style>