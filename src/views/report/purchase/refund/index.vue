<template>
    <div id="main" class="sales-profit-execution">
        <basic-container>
            <div class="header">
                <el-form inline :model="formData" ref="form">
                    <el-form-item label="店铺：" prop="shopId">
                        <el-select
                            @change="initGetList"
                            v-model="formData.shopId"
                            placeholder="请选择店铺"
                            style="width: 232px"
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
                    <el-form-item label="退款状态：" prop="pddActualRefundStatus">
                        <el-select
                            @change="initGetList"
                            v-model="formData.pddActualRefundStatus"
                            placeholder="请选择退款状态"
                            collapse-tags
                            style="width: 232px;"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in refundStatusOpt"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="createTimeArr" label="退款时间：" class="search-time-item">
                        <!-- <div slot="label">
                            <el-select v-model="formData.dateType" @change="initGetList">
                                <el-option label="退款时间" value="1"></el-option>
                                <el-option label="完成时间" value="2"></el-option>
                            </el-select>
                        </div> -->
                        <el-date-picker
                            v-model="formData.createTimeArr"
                            type="daterange"
                            align="right"
                            unlink-panels
                            @change="searchTimeChange"
                            :picker-options="pickerOptions"
                            style="width: 366px"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-delete" @click.stop="resetForm()">
                            清空
                        </el-button>
                        <el-button icon="el-icon-search" type="primary" @click.stop="initGetList">
                            搜索
                        </el-button>
                       
                    </el-form-item>
                    <el-form-item style="margin-left:  auto">
                        <el-button  @click.stop="exportOrder"
                            v-loading.fullscreen.lock="fullscreenLoading"
                            circle
                        >
                        <el-tooltip   content="下载" placement="top" >
                            <i class="el-icon-download"></i>
                        </el-tooltip>
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="content" v-loading="tableLoading">
                  <el-table
                    :data="tableData"
                    border
                    headerCellClassName="header-cell-bg-color"
                    style="width: 100%">
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        prop="shopName"
                        label="店铺名称"
                        min-width="150"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="refundTime"
                        label="采购退款时间"
                        min-width="150"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="productName"
                        label="商品信息"
                        min-width="150"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="orderId"
                        label="订单编号"
                        min-width="150"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="aftersaleId"
                        label="售后编号"
                        min-width="150"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="refundAmount"
                        label="采购退款金额"
                        min-width="100"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="purchaseItems"
                        label="采购退款商品件数"
                        min-width="120"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        label="退款状态"
                        min-width="100"
                        align="center">
                        <template slot-scope="{row}">
                            <span>{{refundStatusTem[row.pddActualRefundStatus]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="completeTime"
                        label="完成时间"
                        min-width="150"
                        align="center">
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

import TimeFormats from '@/util/TimeFormats'
import { fetchRefundList, fetchRefundExport } from "@/api/report/purchase/data";
export default {
    name: "profit",
    components: {
    },
    data() {
        return {
            tableData: [],
            fullscreenLoading: false,
            formData: {
                total: 0, // 总页数
                current: 1, // 当前页数
                size: 30, // 每页显示多少条
                dateType: '1',
                createTimeArr: [],
                statusArr: ''
            },
            tableLoading: false,
            shopList: [],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
            },
            refundStatusOpt: [
                {label: '未退款', value: 0},
                {label: '退款中', value: 1},
                {label: '退款成功', value: 2}
            ],
            refundStatusTem: {
                0: '未退款',
                1: '退款中',
                2: '退款成功'
            }
        }
    },
    computed: {
    },
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
        },
        searchTimeChange (val) {
            this.initGetList()
        },
        async getList () {
            this.tableLoading = true
            const { current, size, createTimeArr, shopId, dateType, pddActualRefundStatus } = this.formData
            const params = {
                current,
                size,
                shopId,
                dateType,
                pddActualRefundStatus
            }
            if (createTimeArr) {
                // 下单时间
                params.createTimeArr = [`${createTimeArr[0]} 00:00:00`, `${createTimeArr[1]} 23:59:59`]
            }
            const { data } = await fetchRefundList(params)
            this.tableLoading = false
            this.tableData = data.data.records || []
            this.formData.total = data.data.total || 0
        },
        resetForm () {
            this.formData = this.$options.data().formData;
            const today = this.$moment().subtract('days', 29).format('YYYY-MM-DD')
            const endDay = this.$moment().format('YYYY-MM-DD')
            this.formData.createTimeArr = [today, endDay]
            this.getList();
        },
        exportOrder () {
            const { current, size, createTimeArr, shopId, dateType, pddActualRefundStatus } = this.formData
            const params = {
                current,
                size,
                shopId,
                dateType,
                pddActualRefundStatus
            }
            if (createTimeArr) {
                // 下单时间
                params.createTimeArr = [`${createTimeArr[0]} 00:00:00`, `${createTimeArr[1]} 23:59:59`]
            }
            this.fullscreenLoading = true;
            fetchRefundExport(params).then(res => {
                this.fullscreenLoading = false;
                const type = 'application/gzip';
                const blob = new Blob([res.data], {type: type});
                const name = decodeURI(
                    res.headers['content-disposition'].split('=')[1]);
                if (window.navigator.msSaveBlob) {  //没有此判断的话，ie11下的导出没有效果
                    window.navigator.msSaveBlob(blob, name);
                } else {
                    const downloadElement = document.createElement('a');
                    const href = window.URL.createObjectURL(blob);
                    //后台再header中传文件名
                    downloadElement.href = href;
                    downloadElement.download = name;
                    document.body.appendChild(downloadElement);
                    downloadElement.click();
                    document.body.removeChild(downloadElement);// 下载完成移除元素
                }
                return Promise.resolve(true);
            }).catch(() => {
                this.fullscreenLoading = false;
            });
        },
    },
    created () {
        try {
            const today = this.$moment().subtract('days', 29).format('YYYY-MM-DD')
            const endDay = this.$moment().format('YYYY-MM-DD')
            this.formData.createTimeArr = [today, endDay]
            this.onLoadShop()
            this.getList()
        } catch (error) {

        }
    },
    mounted () {
    },
};
</script>

<style lang="scss" scoped>
.sales-profit-execution {
    background: #fff;
    border-radius: 12px;
    padding: 16px 16px 50px;
    margin-top: 16px;
    ::v-deep .el-form{
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 30px;
        .el-form-item {
            margin-bottom: 0px;
        }
    }
    ::v-deep.el-table {
        min-height: 330px;
    }
}
</style>

