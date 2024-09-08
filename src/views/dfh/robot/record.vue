<template>
    <div class='record-page'>
        <basic-container>
            <div class="header mb20">
                <el-form inline :model="formData" ref="form" class="mt20">
                    <el-form-item label="店铺" prop="shopId">
                        <el-select
                            @change="initGetList"
                            v-model="formData.shopId"
                            placeholder="请选择店铺"
                            style="width: 200px"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in shopList"
                                :key="index"
                                :label="item.shopName"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="createTimeArr" class="search-time-item">
                        <div slot="label">
                            <el-input readonly value="采购时间"></el-input>
                            <!-- <el-select v-model="formData.timeType" @change="initGetList">
                                <el-option label="下单时间" value="1"></el-option>
                                <el-option label="采购时间" value="2"></el-option>
                            </el-select> -->
                        </div>
                        <el-date-picker
                            v-model="formData.createTimeArr"
                            type="daterange"
                            align="right"
                            unlink-panels
                            @change="searchTimeChange"
                            :picker-options="pickerOptions"
                            style="width: 280px"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click.stop="initGetList">
                            <span>搜索</span>
                        </el-button>
                        <el-button plain @click.stop="resetForm()">
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
                        prop="shopName"
                        label="店铺"
                        min-width="150"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="statisticsTime"
                        label="采购时间"
                        min-width="150"
                        align="center">
                    </el-table-column>
					<el-table-column
					    prop="address"
					    label="销售商品信息"
					    min-width="150"
					    align="center">
					</el-table-column>
					<el-table-column
					    prop="salesCount"
					    label="销售订单号"
					    min-width="150"
					    align="center">
					</el-table-column>
					<el-table-column
					    prop="salesCount"
					    label="采购订单号"
					    min-width="150"
					    align="center">
					</el-table-column>
                    <el-table-column
                        prop="address"
                        label="采购金额(元)"
                        min-width="120"
                        align="center">
                        <!-- <template slot-scope="{row}">
                            {{row.salesAmount | rounding}}
                        </template> -->
                    </el-table-column>
					<el-table-column
                        prop="address"
					    label="采购商品件数"
                        min-width="120"
					    align="center">
					</el-table-column>
                    <el-table-column
                        prop="address"
                        label="采购总金额(元)"
                        min-width="150"
                        align="center">
                        <template slot-scope="{row}">
                            {{row.avgSalesAmount | rounding}}
                        </template>
                    </el-table-column>
					<el-table-column
                        prop="address"
					    label="优惠金额(元)"
					    min-width="120"
					    align="center">
					    <!-- <template slot-scope="{row}">
					        {{row.purchaseAmount | rounding}}
					    </template> -->
					</el-table-column>
                    <template slot="empty">
                        <div class="empty">
                            <el-empty
                                description="暂时没有找到任何记录"
                                :image-size="100"
                                v-if="!tableData.length"
                            ></el-empty>
                        </div>
                    </template>
                </el-table>
            </div>
            <div class="pagination pt10 pb20 flex flex-row-reverse" v-if="formData.total > 0">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :current-page.sync="formData.current"
                    :page-size="formData.size"
                    :page-sizes="[30, 50, 100]"
                    :total="formData.total"
                    @current-change="onCurrentChange"
                    @size-change="onSizeChange"
                ></el-pagination>
            </div>
        </basic-container>
    </div>
</template>

<script>

import { fetchRecordList } from '@/api/robot/index'
export default {
    components: {},
    data() {
        return {
            tableData: [],
            shopList: [],
            formData: {
                total: 0, // 总页数
                current: 1, // 当前页数
                size: 30, // 每页显示多少条
                createTimeArr: [],
            },
            tableLoading: false,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
            },
            id: 0
        }
    },
    computed: {},
    methods: {
        async onLoadShop () {
            const { data: { data } } = await this.$API.getShopList()
            this.shopList = data
        },
        onCurrentChange(page) {
            this.formData.current = page
            this.getList();
        },
        onSizeChange(size) {
            this.formData.size = size
            this.getList();
        },
        initGetList() {
            this.formData.current = 1;
            this.getList()
            this.fetchCountList()
        },
        searchTimeChange (val) {
            console.log('value', val)
            this.profitCycle = '5'
            this.initGetList()
        },
        async getList () {
            this.tableLoading = true
            const { current, size, createTimeArr, shopId } = this.formData
            const params = {
                current,
                size,
                shopId
            }
            if (createTimeArr) {
                // 下单时间
                params.createTimeArr = [`${createTimeArr[0]} 00:00:00`, `${createTimeArr[1]} 23:59:59`]
            }
            const { data } = await fetchRecordList(params)
            console.log('getList', data)
            this.tableLoading = false
            this.tableData = data.data.records || []
            this.formData.total = data.data.total || 0
        },
        resetForm () {
            this.$refs.form.resetFields()
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.id = this.$route.query.id
        console.log('id', this.id)
        try {
            const today = this.$moment().format('YYYY-MM-DD')
            this.formData.createTimeArr = [today, today]
            this.onLoadShop()
            // this.getList()
        } catch (error) {

        }
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>
<style lang="scss" scoped>
.record-page {
    ::v-deep.el-form {
        .search-time-item {
            .el-form-item__label {
                padding: 0;
                .el-select {
                    width: 100px;
                    transform: translateY(-1px);
                }
                .el-input {
                    width: 85px;
                    transform: translateY(-1px);
                }
                .el-input__inner {
                    background-color: #f5f8fc;
                    color: #999;
                    border-right: 0;
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
                .el-input__inner:hover {
                    border-color: #DCDFE6 !important;
                }
                .el-input__inner:focus {
                    border-color: #DCDFE6 !important;
                }
            }
            .el-range-separator {
                width: 10%;
            }
            .el-form-item__content {
                .el-input__inner {
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                }

            }
        }
    }
    ::v-deep.el-table {
        min-height: 600px;
    }
}
</style>