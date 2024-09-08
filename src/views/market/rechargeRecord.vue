<template>
    <basic-container class='rechange-record-page'>
        <div class="search-content">
            <el-form inline :model="formData" ref="form" size="mini">
                <el-form-item label="充值类型" prop="goodsType">
                    <el-select
                        @change="initGetList"
                        v-model="formData.goodsType"
                        placeholder="请选择充值类型"
                        style="width: 160px"
                        clearable
                    >
                        <el-option v-for="(item, index) in sourceList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="充值状态" prop="firstCharge">
                    <el-select
                        @change="initGetList"
                        v-model="formData.firstCharge"
                        placeholder="请选择充值状态"
                        style="width: 160px"
                        clearable
                    >
                        <el-option v-for="(item, index) in firstChargeList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单状态" prop="status">
                    <el-select
                        @change="initGetList"
                        v-model="formData.status"
                        placeholder="请选择订单状态"
                        style="width: 160px"
                        clearable
                    >
                        <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="phone">
                    <el-input type="text" v-model="formData.phone" placeholder="请输入用户名/手机号" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click.stop="initGetList">
                        <span>搜索</span>
                    </el-button>
                    <el-button @click.stop="resetForm">
                        <span>清空</span>
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content" v-loading="tableLoading">
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="payOrderId"
                    label="充值单号"
                    min-width="180"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="用户名"
                    min-width="120"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="手机号"
                    min-width="120"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="充值类型"
                    min-width="100"
                    align="center">
                    <template slot-scope="{row}">
                        <span>{{typeOption[row.goodsType]}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="充值金额"
                    min-width="100"
                    align="center">
                    <template slot-scope="{row}">
                        <el-button type="text">{{row.amount / 100}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    label="订单状态"
                    min-width="150"
                    align="center">
                    <template slot-scope="{row}">
                        {{statusOption[row.status]}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="支付方式"
                    min-width="100"
                    align="center">
                    <template slot-scope="{ row }">
                        <span v-if="row.payChannel == 'wxpay'">微信支付</span>
                        <span v-else-if="row.payChannel == 'alipay'">支付宝支付</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="body"
                    label="备注"
                    min-width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="paySuccTime"
                    label="充值时间"
                    min-width="150"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    min-width="150"
                    align="center">
                </el-table-column>
                <template slot="empty">
                    <div class="empty my30">
                        <el-empty
                            description="暂时没有找到任何记录"
                            :image-size="100"
                            v-if="!tableData.length"
                        ></el-empty>
                    </div>
                </template>
            </el-table>
        </div>
        <div class="pagination pt10 flex flex-row-reverse" v-if="formData.total > 0">
            <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :current-page.sync="formData.current"
                :page-size="formData.size"
                :page-sizes="[20, 50, 100]"
                :total="formData.total"
                @current-change="onCurrentChange"
                @size-change="onSizeChange"
            ></el-pagination>
        </div>
    </basic-container>
</template>

<script>

import { rechargeGoodsList } from '@/api/pay/paygoodsorder'
export default {
    components: {},
    data() {
        return {
            formData: {
                total: 0,
                current: 1,
                size: 20,
                goodsType: null,
                status: null,
                phone: '',
                firstCharge: null
            },
            sourceList: [
                {label: '积分充值', value: 1},
                {label: '开通会员', value: 2},
                {label: '站点余额充值', value: 5},
                {label: '购买店铺数量', value: 6},
                {label: '续费店铺', value: 7}
            ],
            firstChargeList: [
                {label: '首充', value: 1},
                {label: '非首充', value: 0}
            ],
            typeOption: {
                '1': '积分充值',
                '2': '开通会员',
                '5': '站点余额充值',
                '6': '购买店铺数量',
                '7': '续费店铺'
            },
            statusList: [
                {label: '待支付', value: 0},
                {label: '支付完成', value: 1},
                {label: '支付失败', value: -1}
            ],
            statusOption: {
                '0': '待支付',
                '1': '支付成功',
                '-1': '支付失败',
            },
            tableLoading: false,
            tableData: []
        }
    },
    computed: {},
    methods: {
        onCurrentChange(page) {
            this.formData.current = page
            this.getList()
        },
        onSizeChange(size) {
            this.formData.size = size
            this.getList()
        },
        initGetList () {
            this.formData.current = 1
            this.getList()
        },
        resetForm () {
            this.$refs.form.resetFields()
        },
        async getList () {
            this.tableLoading = true
            const params = {...this.formData}
            const { data } = await rechargeGoodsList(params)
            console.log('data', data)
            this.tableLoading = false
            this.formData.total = data.data.total
            this.tableData = data.data.records
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.getList()
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>
<style lang="scss" scoped>
    .rechange-record-page {
        .search-content {
            ::v-deep.el-range-separator {
                width: 10%;
            }
        }
        .content {
            ::v-deep.el-table {
                min-height: 600px;
            }
        }
    }
</style>