<template>
    <div>
        <basic-container>
            <div class="container">
                <div class="header">
                    <el-cascader
                        v-if="isAdmin"
                        class="mr15"
                        :options="sitesOptions"
                        :props="{ checkStrictly: true }"
                        placeholder="全部站点"
                        :show-all-levels="false"
                        filterable
                        clearable
                        @change="selectSite"
                    ></el-cascader>
                    <el-select
                        v-if="isAdmin"
                        class="mr15"
                        v-model="form.userId"
                        clearable
                        :disabled="form.tenantId===''"
                        @clear="fetchData"
                        @change="fetchData"
                        placeholder="全部商家"
                    >
                        <el-option
                            v-for="item in merchantOptions"
                            :key="item.userId"
                            :label="item.merchantName"
                            :value="item.userId"
                        ></el-option>
                    </el-select>
                    <el-select
                        v-if="isAdmin"
                        v-model="form.shopId"
                        clearable
                        :disabled="form.userId===''"
                        @clear="fetchData"
                        @change="fetchData"
                        placeholder="全部店铺"
                    >
                        <el-option
                            v-for="item in shopList"
                            :key="item.id"
                            :label="item.shopName"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                    <el-select
                        v-else
                        v-model="form.shopId"
                        clearable
                        @clear="fetchData"
                        @change="fetchData"
                        placeholder="全部店铺"
                    >
                        <el-option
                            v-for="item in shopList"
                            :key="item.id"
                            :label="item.shopName"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                    <div class="ml15">
                        <el-radio-group v-model="dateRange" size="medium" @change="dateRangeChange">
                            <el-radio-button label="今日"></el-radio-button>
                            <el-radio-button label="昨日"></el-radio-button>
                            <el-radio-button label="近七日"></el-radio-button>
                            <el-radio-button label="最近三十日"></el-radio-button>
                        </el-radio-group>
                    </div>
                    <!-- <div class="ml12">
                        <button class="btn" @click="fetchData">查询</button>
                    </div>-->
                    <div class="ml12">
                        <button class="btn" @click="resetData">重置</button>
                    </div>
                </div>
                <div class="content">
                    <div class="chart">
                        <shop-order-chart :loading="loading" ref="shopOrderChart"></shop-order-chart>
                    </div>
                    <div class="footer">
                        <!-- 店铺销售订单 -->
                        <div class="table" v-if="type===1">
                            <el-table v-loading="loading" :data="tableList" style="width: 100%">
                                <el-table-column width="240" prop="dealOrderNum" label="成交订单数"></el-table-column>
                                <!-- 店铺ID/名称 -->
                                <el-table-column width="240" label="店铺ID/名称">
                                    <div slot-scope="{ row }">
                                        <p v-if="row.shopId">{{row.shopId }}</p>
                                        <p>{{row.shopName }}</p>
                                    </div>
                                </el-table-column>
                                <!-- 下单人数 -->
                                <el-table-column>
                                    <template slot="header">
                                        下单人数
                                        <el-tooltip class="tooltip" effect="light" placement="top">
                                            <i class="tips iconfont icon-question-outline"></i>
                                            <div slot="content" class="tip-content">
                                                <p>下单人数根据订单的收货人手机号来区分，所选时间段内同一手机号数据去重</p>
                                            </div>
                                        </el-tooltip>
                                    </template>
                                    <div slot-scope="{ row }">
                                        <span>{{row.dealUserNum }}</span>
                                    </div>
                                </el-table-column>
                                <!-- 退款订单数 -->
                                <el-table-column>
                                    <template slot="header">
                                        退款订单数
                                        <el-tooltip class="tooltip" effect="light" placement="top">
                                            <i class="tips iconfont icon-question-outline"></i>
                                            <div slot="content" class="tip-content">
                                                <p>退款订单数为退款成功的销售订单数量</p>
                                            </div>
                                        </el-tooltip>
                                    </template>
                                    <div slot-scope="{ row }">
                                        <span>{{row.refundNum }}</span>
                                    </div>
                                </el-table-column>
                                <!-- 销售商品数 -->
                                <el-table-column>
                                    <template slot="header">
                                        销售商品数
                                        <el-tooltip class="tooltip" effect="light" placement="top">
                                            <i class="tips iconfont icon-question-outline"></i>
                                            <div slot="content" class="tip-content">
                                                <p>销售商品数为时间段内销售商品数量，同一sku商品不去重</p>
                                            </div>
                                        </el-tooltip>
                                    </template>
                                    <div slot-scope="{ row }">
                                        <span>{{row.saleProductNum }}</span>
                                    </div>
                                </el-table-column>
                                <!-- 销售金额 -->
                                <el-table-column>
                                    <template slot="header">
                                        销售金额
                                        <el-tooltip class="tooltip" effect="light" placement="top">
                                            <i class="tips iconfont icon-question-outline"></i>
                                            <div slot="content" class="tip-content">
                                                <p>销售金额为时间段内成交的订单金额；</p>
                                            </div>
                                        </el-tooltip>
                                    </template>
                                    <div slot-scope="{ row }">
                                        <span>{{row.sales |formatMoney}}</span>
                                    </div>
                                </el-table-column>
                            </el-table>
                        </div>
                        <!-- 店铺销售额 -->
                        <div class="table" v-else>
                            <el-table v-loading="loading" :data="tableList" style="width: 100%">
                                <el-table-column width="240" prop="statisticsDate" label="统计时间"></el-table-column>
                                <!-- 店铺ID/名称 -->
                                <el-table-column width="240" label="店铺ID/名称">
                                    <div slot-scope="{ row }">
                                        <p v-if="row.shopId">{{row.shopId }}</p>
                                        <p>{{row.shopName }}</p>
                                    </div>
                                </el-table-column>
                                <!-- 下单人数 -->
                                <el-table-column>
                                    <template slot="header">
                                        下单人数
                                        <el-tooltip class="tooltip" effect="light" placement="top">
                                            <i class="tips iconfont icon-question-outline"></i>
                                            <div slot="content" class="tip-content">
                                                <p>下单人数根据订单的收货人手机号来区分，所选时间段内同一手机号数据去重</p>
                                            </div>
                                        </el-tooltip>
                                    </template>
                                    <div slot-scope="{ row }">
                                        <span>{{row.dealUserNum }}</span>
                                    </div>
                                </el-table-column>
                                <el-table-column width="240" prop="dealOrderNum" label="成交订单数"></el-table-column>
                                <!-- 退款订单数 -->
                                <el-table-column>
                                    <template slot="header">
                                        退款订单数
                                        <el-tooltip class="tooltip" effect="light" placement="top">
                                            <i class="tips iconfont icon-question-outline"></i>
                                            <div slot="content" class="tip-content">
                                                <p>退款订单数为退款成功的销售订单数量</p>
                                            </div>
                                        </el-tooltip>
                                    </template>
                                    <div slot-scope="{ row }">
                                        <span>{{row.refundNum }}</span>
                                    </div>
                                </el-table-column>
                                <!-- 销售商品数 -->
                                <el-table-column>
                                    <template slot="header">
                                        销售商品数
                                        <el-tooltip class="tooltip" effect="light" placement="top">
                                            <i class="tips iconfont icon-question-outline"></i>
                                            <div slot="content" class="tip-content">
                                                <p>销售商品数为时间段内销售商品数量，同一sku商品不去重</p>
                                            </div>
                                        </el-tooltip>
                                    </template>
                                    <div slot-scope="{ row }">
                                        <span>{{row.saleProductNum }}</span>
                                    </div>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="pagination">
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="current"
                                :page-sizes="[10, 20, 100, 200,500]"
                                :page-size="size"
                                layout="total, sizes, prev, pager, next"
                                :total="total"
                            ></el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </basic-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ShopOrderChart from "../components/ShopOrderChart";

const HOURS = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
const MONTH = [
    '第1日', '第2日', '第3日', '第4日', '第5日', '第6日', '第7日', '第8日', '第9日', '第10日',
    '第11日', '第12日', '第13日', '第14日', '第15日', '第16日', '第17日', '第18日', '第19日', '第20日',
    '第21日', '第22日', '第23日', '第24日', '第25日', '第26日', '第27日', '第28日', '第29日', '第30日',
];

export default {
    components: {
        ShopOrderChart,
    },
    data() {
        return {
            loading: true,
            // 1 店铺销售订单 2 店铺销售额
            type: 1,
            // 是否管理员身份
            isAdmin: false,
            // 站点选项
            sitesOptions: [],
            // 商家下拉框
            merchantOptions: [],
            // 查询参数
            form: {
                // 店铺ID
                shopId: '',
                userId: '',
                searchDateRange: 3,
                tenantId: '', // 仅管理员登录时调用接口，后端才效验

            },
            current: 1,
            size: 10,
            total: 0,
            dateRange: '近七日',
            // 店铺列表
            shopList: [],
            // 环比销售订单
            chainOrderOptions: [
                { name: '今日对比昨日', value: 1 },
                { name: '昨日对比前日', value: 2 },
                { name: '近7日对比前7日', value: 3 },
                { name: '近30日对比前30日', value: 4 },
            ],
            tableList: [],
        };
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ]),
    },
    created() {

    },
    mounted() {
        if (this.userInfo.identity === 'admin') {
            this.isAdmin = true;
        }
        this.fetchData();
    },
    methods: {
        async fetchData() {
            this.loading = true;
            const type = +this.$route.query.type;
            this.type = type;
            const dateRange = this.form.searchDateRange;
            let days = [];
            const arr = [
                await this.$API.getShopList(this.form),
                await this.$API.getshopSales(this.form),
                await this.$API.getShopSaleDetail({
                    ...this.form, current: this.current,
                    size: this.size,
                }),
            ];

            if (this.isAdmin) {
                const data = {
                    ...this.form,
                    size: 30,
                }
                arr.push(
                    await this.$API.fetchSitesTree(),
                    await this.$API.fetchMerchantList(data));
            }
            Promise.all(arr).then(res => {
                // 店铺列表
                if (res[0]) {
                    this.shopList = res[0].data.data;
                }
                // 环比销售订单
                if (res[1]) {
                    const datas = res[1].data.data;
                    let seriesData = [];
                    if (type === 1) {
                        seriesData = datas.map(v => v.saleOrderNum);
                    } else {
                        seriesData = datas.map(v => v.sales || 0);
                    }
                    // 1 今日订单 2 昨日订单 3 近七天订单 4 近三十天订单
                    switch (dateRange) {
                        case 1:
                            days = HOURS;
                            break;
                        case 2:
                            days = HOURS;
                            break;
                        case 3:
                            days = datas.map(v => this.$moment(v.statisticsDate).format('MM-DD')).slice(0, 7);
                            break;
                        case 4:
                            days = datas.map(v => this.$moment(v.statisticsDate).format('MM-DD'));
                            break;
                    }
                    this.$refs.shopOrderChart.initData({
                        xAxisData: days,
                        seriesData: seriesData,
                        type: type,
                    });
                }
                //  订单列表
                if (res[2]) {
                    const datas = res[2].data.data;
                    this.tableList = datas.records;
                    this.total = datas.total;
                }
                // 管理员 获取 站点列表、商家列表
                if (this.isAdmin) {
                    // 站点列表
                    if (res[3]) {
                        const datas = res[3].data.data;
                        if (datas) {
                            this.sitesOptions = datas.map((v) => {
                                return this.sum(v);
                            });
                        }
                    }
                    const datas = res[4].data.data;
                    this.merchantOptions = datas.records;
                }
            });
            this.loading = false;
        },
        // 选择站点
        selectSite(val) {
            this.form.tenantId = val[val.length - 1];
            this.form.userId = '';
            this.form.shopId = '',
                this.fetchData();
        },
        // 遍历站点层级数据
        sum(e) {
            if (e.children) {
                return {
                    label: e.name,
                    value: e.id,
                    children: e.children.map(v => this.sum(v)),
                }
            } else {
                return {
                    label: e.name,
                    value: e.id,
                }
            }
        },
        // 日期筛选
        dateRangeChange(val) {
            let dateRange = 1;
            switch (val) {
                case '今日':
                    dateRange = 1;
                    break;
                case '昨日':
                    dateRange = 2;
                    break;
                case '近七日':
                    dateRange = 3;
                    break;
                case '最近三十日':
                    dateRange = 4;
                    break;
            }
            this.form.searchDateRange = dateRange;
            this.fetchData();
        },
        // 重置
        resetData() {
            this.form = {
                // 店铺ID
                shopId: '',
                userId: '',
                tenantId: '', // 仅管理员登录时调用接口，后端才效验
                searchDateRange: 3,
            };
            this.dateRange = '近七日';
            this.current = 1;
            this.size = 10;
            this.fetchData();
        },
        handleSizeChange(val) {
            this.size = val;
            this.fetchData();
        },
        handleCurrentChange(val) {
            this.current = val;
            this.fetchData();
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    .header {
        display: flex;
        align-items: center;
        padding: 20px 20px 30px 20px;
    }
    .content {
        .table {
            margin-top: 54px;
            .iconfont {
                color: rgba(0, 0, 0, 0.8);
            }
            & ::v-deep .el-table th.el-table__cell > .cell {
                padding: 12px 10px;
                background-color: #fff;
                font-size: 16px;
                font-weight: 600;
                color: rgba(0, 0, 0, 0.96);
                line-height: 29px;
                text-align: center;
            }

            & ::v-deep .el-table td,
            .el-table th {
                font-size: 16px;
                color: rgba(0, 0, 0, 0.96);
                line-height: 24px;
                padding: 12px 0;
                box-sizing: border-box;
                text-overflow: ellipsis;
                vertical-align: middle;
                position: relative;
                text-align: center;
            }
            .name {
                text-align: left !important;
            }
        }
        .pagination {
            margin-top: 20px;
            display: flex;
            flex-direction: row-reverse;
        }
    }

    .btn {
        width: 89px;
        height: 34px;
        background: $themeColor;
        border-radius: 5px;
        border: 0;
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
    }
}
</style>
