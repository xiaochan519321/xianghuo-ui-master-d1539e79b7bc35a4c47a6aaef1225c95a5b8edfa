<template>
    <basic-container class='customer-page'>
        <div class="search-content">
            <el-form inline :model="formData" ref="form" size="mini">
                <el-form-item label="使用情况" prop="useStatus">
                    <el-select
                        @change="initGetList"
                        v-model="formData.useStatus"
                        placeholder="请选择用户近期使用情况"
                        style="width: 160px"
                        clearable
                    >
                        <el-option v-for="(item, index) in useStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户来源" prop="customerSource">
                    <el-select
                        @change="initGetList"
                        v-model="formData.customerSource"
                        placeholder="请选择客户来源类型"
                        style="width: 160px"
                        clearable
                    >
                        <el-option v-for="(item, index) in sourceList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="会员状态" prop="rightNameCode">
                    <el-select
                        @change="initGetList"
                        v-model="formData.rightNameCode"
                        placeholder="请选择客户会员状态"
                        style="width: 160px"
                        clearable
                    >
                        <el-option v-for="(item, index) in vipLvList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间" prop="createTimeArr">
                    <el-date-picker
                        v-model="formData.createTimeArr"
                        type="daterange"
                        align="right"
                        unlink-panels
                        @change="initGetList"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        style="width: 300px;"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="nameAndPhone">
                    <el-input type="text" v-model="formData.nameAndPhone" placeholder="请输入用户名/手机号" clearable></el-input>
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
                    prop="username"
                    label="登录账号"
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
                    prop="rightName"
                    label="会员状态"
                    min-width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="payNumbe"
                    label="充值笔数"
                    min-width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="orderLastTime"
                    label="最近下单时间"
                    min-width="150"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="orderCount"
                    label="销售订单量"
                    min-width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="pddOrderCount"
                    label="采购订单量"
                    min-width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="dayOrderCount"
                    label="日均单量"
                    min-width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="monthOrderCount"
                    label="近一月单量"
                    min-width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="noOrderDay"
                    label="未下单天数"
                    min-width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="integral"
                    label="积分余额"
                    min-width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="totalAmount"
                    label="累计充值"
                    min-width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="profitMoney"
                    label="带来佣金"
                    min-width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="状态"
                    min-width="100"
                    align="center">
                    <template slot-scope="{row}">
                        <el-tag :type="row.lockFlag == 9 ? 'warning' : ''" plain>{{row.lockFlag == 9 ? '锁定' : '有效'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="merchantName"
                    label="备注"
                    min-width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="注册时间"
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

import { getMarketCustomList } from '@/api/admin/merchant'
export default {
    components: {},
    data() {
        return {
            formData: {
                total: 0,
                current: 1,
                size: 20,
                createTimeArr: null,
                useStatus: null,
                customerSource: null,
                nameAndPhone: ''
            },
            useStatusList: [
                {label: '近7天未下单', value: 1},
                {label: '近7天有下单', value: 2},
                {label: '从未下单', value: 3},
            ],
            sourceList: [
                {label: '推广邀请', value: 1},
                {label: '分配', value: 2}
            ],
            vipLvList: [
                {label: '个人版', value: 'regular'},
                {label: '旗舰版', value: 'personal'},
                {label: '团队版', value: 'team'},
                {label: '企业版', value: 'enterprise'}
            ],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
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
            this.formData.createTimeArr = null
            this.initGetList()
        },
        async getList () {
            this.tableLoading = true
            const params = {...this.formData}
            if (params.createTimeArr != null) {
                params['createTimeStart'] = `${params.createTimeArr[0]} 00:00:00`
                params['createTimeEnd'] = `${params.createTimeArr[1]} 23:59:59`
            }
            const { data } = await getMarketCustomList(params)
            this.tableLoading = false
            this.formData.total = data.total
            this.tableData = data.records
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
    .customer-page {
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