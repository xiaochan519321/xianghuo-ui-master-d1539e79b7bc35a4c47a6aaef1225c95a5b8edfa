<template>
    <div class="container">
        <div class="header">
            <div class="top-box">
                <div class="left">
                    <el-radio-group v-model="type" @change="dateTypeChange">
                        <el-radio-button label="按付款日期"></el-radio-button>
                        <el-radio-button label="按采购日期"></el-radio-button>
                    </el-radio-group>
                    <div class="return-index">
                        <div class="btn">
                            <a @click="$router.go(-1)">
                                <i class="iconfont icon-back"></i>
                                <span class="text">返回首页</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="center">数据大屏</div>
                <div class="right">
                    <div>
                        <el-tooltip
                            :content="isFullScreen?'退出全屏':'全屏'"
                            effect="dark"
                            placement="bottom"
                        >
                            <button
                                :class="`btn mr18 ${isFullScreen?'selected':''}`"
                                @click="handleScreen"
                            >全屏</button>
                        </el-tooltip>
                    </div>
                    <el-radio-group v-model="dateRange" size="medium" @change="dateRangeChange">
                        <el-radio-button label="昨日"></el-radio-button>
                        <el-radio-button label="今日"></el-radio-button>
                        <el-radio-button label="近七日"></el-radio-button>
                        <el-radio-button label="最近三十日"></el-radio-button>
                    </el-radio-group>
                </div>
            </div>
            <div class="content-wrap relative" v-spin="loading">
                <div class="between-box">
                    <div class="lbox" v-show="!loading">
                        <span class="date">{{ currentDate }}</span>
                        <span class="time">{{currentTime}}</span>
                    </div>
                    <div class="rbox" v-show="!loading">
                        <span>{{countDownTime}}</span>
                        <span>后自动更新</span>
                    </div>
                </div>
                <el-row class="bottom-box" :gutter="50">
                    <el-col>
                        <div class="card" v-show="!loading">
                            <div class="left">
                                <span class="value">{{dataBoard.saleOrderNum}}</span>
                                <span class="text">总订单数</span>
                            </div>
                            <div class="right">
                                <i class="iconfont icon-jine"></i>
                            </div>
                        </div>
                    </el-col>
                    <el-col>
                        <div class="card" v-show="!loading">
                            <div class="left">
                                <span class="value">{{dataBoard.saleProductNum}}</span>
                                <span class="text">总采购数</span>
                            </div>
                            <div class="right">
                                <i class="iconfont icon-purchase-order-num"></i>
                            </div>
                        </div>
                    </el-col>
                    <el-col>
                        <div class="card" v-show="!loading">
                            <div class="left">
                                <span class="value">{{dataBoard.saleOrderNum}}</span>
                                <span class="text">总订单数</span>
                            </div>
                            <div class="right">
                                <i class="iconfont icon-jine"></i>
                            </div>
                        </div>
                    </el-col>
                    <el-col>
                        <div class="card" v-show="!loading">
                            <div class="left">
                                <span class="value">{{dataBoard.profitRate +'%'}}</span>
                                <span class="text">总利润率</span>
                            </div>
                            <div class="right">
                                <i class="iconfont icon-profit-rate"></i>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- 中间 -->
        <div class="content">
            <div class="lbox ranking" v-spin="loading">
                <div class="title">店铺今日单量排行</div>
                <div class="level-wrap" v-if="shopTopList.length > 0 ">
                    <div class="left item">
                        <span class="crown"></span>
                        <div class="text ellipsis-2">
                            <span>{{shopTopList[1].shopName}}</span>
                        </div>
                        <span class="value">{{shopTopList[1].saleOrderNum}}</span>
                    </div>
                    <div class="center item">
                        <span class="crown"></span>
                        <div class="text ellipsis-2">
                            <span>{{shopTopList[0].shopName}}</span>
                        </div>
                        <span class="value">{{shopTopList[0].saleOrderNum}}</span>
                    </div>
                    <div class="right item">
                        <span class="crown"></span>
                        <div class="text ellipsis-2">
                            <span>{{shopTopList[2].shopName}}</span>
                        </div>
                        <span class="value">{{shopTopList[2].saleOrderNum}}</span>
                    </div>
                </div>
                <div class="list" v-if="shopTopList.length > 0 ">
                    <template v-for="(item, index) in shopTopList">
                        <div class="cell" v-if="index>2" :key="index">
                            <span class="circle">{{index+1}}</span>
                            <div class="text ellipsis-2">
                                <span>{{item.shopName}}</span>
                            </div>
                            <div class="line-box">
                                <div
                                    class="line"
                                    :style="`width: ${ item.saleOrderNum ==='---' ? 0 : calculateWidth(shopTopList[0].saleOrderNum,item.saleOrderNum)}px`"
                                ></div>
                            </div>
                            <span class="value">{{item.saleOrderNum }}</span>
                        </div>
                    </template>
                </div>
            </div>
            <div class="cbox relative" v-spin="loading">
                <div class="header-wrap" v-show="!loading">
                    <div class="left">
                        <span class="img"></span>
                    </div>
                    <div class="right">
                        <span class="title">总成交额</span>
                        <count-to
                            :start-val="0"
                            :end-val="dataBoard.deal "
                            :duration="1000"
                            prefix="￥"
                            class="sum"
                        />
                    </div>
                </div>
                <div class="item-wrap" v-show="!loading">
                    <el-row class="row" :gutter="50">
                        <el-col>
                            <div class="item">
                                <div class="top-box">
                                    <span class="text">总销售金额</span>
                                    <i class="iconfont icon-amount"></i>
                                </div>
                                <div class="bottom-box">
                                    <span class="value">{{dataBoard.sales}}</span>
                                </div>
                            </div>
                        </el-col>
                        <el-col>
                            <div class="item">
                                <div class="top-box">
                                    <span class="text">总采购金额</span>
                                    <i class="iconfont icon-purchase-amount"></i>
                                </div>
                                <div class="bottom-box">
                                    <span class="value">{{dataBoard.purchase}}</span>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="row" :gutter="50">
                        <el-col>
                            <div class="item">
                                <div class="top-box">
                                    <span class="text">平台消耗积分</span>
                                    <i class="iconfont icon-integral"></i>
                                </div>
                                <div class="bottom-box">
                                    <span class="value">{{dataBoard.point}}</span>
                                </div>
                            </div>
                        </el-col>
                        <el-col>
                            <div class="item">
                                <div class="top-box">
                                    <span class="text">退款金额</span>
                                    <i class="iconfont icon-refund-amount"></i>
                                </div>
                                <div class="bottom-box">
                                    <span class="value">{{dataBoard.refunds}}</span>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="rbox relative" v-spin="loading">
                <div class="title">已采购</div>
                <div class="chart-wrap" v-show="!loading">
                    <my-charts ref="pieChart"></my-charts>
                </div>
            </div>
        </div>
        <!-- 底部 -->
        <div class="bottom">
            <div class="lbox ranking sale" v-spin="loading">
                <div class="title">销售商品排行</div>
                <div class="level-wrap" v-if="saleProductTopList.length > 0 ">
                    <div class="left item">
                        <span class="crown"></span>
                        <div class="text ellipsis-2">
                            <span>{{saleProductTopList[1].productName}}</span>
                        </div>
                        <span class="value">{{saleProductTopList[1].saleProductNum}}</span>
                    </div>
                    <div class="center item ellipsis-2">
                        <span class="crown"></span>
                        <div class="text ellipsis-2">
                            <span>{{saleProductTopList[0].productName}}</span>
                        </div>
                        <span class="value">{{saleProductTopList[0].saleProductNum}}</span>
                    </div>
                    <div class="right item">
                        <span class="crown"></span>
                        <div class="text ellipsis-2">
                            <span>{{saleProductTopList[2].productName}}</span>
                        </div>
                        <span class="value">{{saleProductTopList[2].saleProductNum}}</span>
                    </div>
                </div>
                <div class="list" v-if="saleProductTopList.length > 0 ">
                    <template v-for="(item, index) in saleProductTopList">
                        <div class="cell" v-if="index>2" :key="index">
                            <span class="circle">{{index+1}}</span>
                            <div class="text ellipsis-2">
                                <span>{{item.productName}}</span>
                            </div>
                            <div class="line-box">
                                <div
                                    class="line"
                                    :style="`width: ${ item.saleProductNum ==='---' ? 0 : calculateWidth(saleProductTopList[0].saleProductNum,item.saleProductNum)}px`"
                                ></div>
                            </div>
                            <span class="value">{{item.saleProductNum }}</span>
                        </div>
                    </template>
                </div>
            </div>
            <div class="rbox">
                <div class="title">订单总体走向</div>
                <div class="chart-wrap" v-spin="loading">
                    <my-charts ref="lineChart" :height="'400px'" v-show="!loading"></my-charts>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { fullscreenToggel, listenfullscreen } from '@/util/util';
import { parseTime } from '@/filters/';
import MyCharts from "@/components/charts/MyCharts";
import pieChartOptions from './const/PieChartOptions.js';
import lineChartOptions from './const/LineChartOptions.js';
import CountTo from 'vue-count-to';



const HOURS = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
const MONTH = [
    '第1日', '第2日', '第3日', '第4日', '第5日', '第6日', '第7日', '第8日', '第9日', '第10日',
    '第11日', '第12日', '第13日', '第14日', '第15日', '第16日', '第17日', '第18日', '第19日', '第20日',
    '第21日', '第22日', '第23日', '第24日', '第25日', '第26日', '第27日', '第28日', '第29日', '第30日',
];

export default {
    components: {
        MyCharts,
        CountTo
    },
    data() {
        return {
            loading: true,
            // loading: false,
            type: '按付款日期',
            dateRange: '今日',
            currentDate: parseTime(new Date(), '{y}年{m}月{d}日 星期{a}'),
            currentTime: parseTime(new Date(), '{h}:{i}:{s}'),
            form: {
                // 统计时间类型（1-付款日期【默认值】,2-采购日期）
                searchDateType: 1,
                // 统计时间范围（1-今天【默认值】,2-昨天,3-近七天,4-最近三十天）
                searchDateRange: 1,
            },
            // 实时数据 更新 倒计时 300秒 5分钟
            countDown: 10,
            countDownTime: '---',
            countDownIntervalID: '',
            dataBoard: {},
            // 店铺今日单量排行
            shopTopList: [],
            saleProductTopList: [],
        };
    },
    computed: {
        ...mapGetters([
            'isFullScreen',
        ]),
        calculateWidth() {
            // 进度条 最大值为 max 的 90%
            return (max, val) => {
                let num = 0;
                if (+max > 0 && +val > 0) {
                    const percentage = max * 0.90;
                    // 最大宽度（250px）/ 最大值的 90% =每个百分比对应的数值
                    const part = 250 / percentage;
                    num = Math.floor(val * part);
                }
                return num;
            }
        }
    },
    created() {

    },
    mounted() {
        this.fetchData();
        listenfullscreen(this.setScreen);
    },
    methods: {
        async fetchData() {
            this.loading = true;
            // 重置数据
            this.shopTopList = [];
            this.saleProductTopList = [];

            const params = this.form;
            const arr = [
                await this.$API.getRealTimeDataBoard(params),
                await this.$API.getStatisticsShopOrders(params),
                await this.$API.getStatisticsPurchaseRatio(params),
                await this.$API.getStatisticsOrderTrend(params),
                await this.$API.getHotSales(params),
            ];
            Promise.all(arr).then(res => {
                //  实时数据看板
                if (res[0]) {
                    const datas = res[0].data.data;
                    this.dataBoard = datas;
                }

                // 生成 空数据
                function createData(num, obj) {
                    const list = [];
                    for (let index = 0; index < num; index++) {
                        list.push(obj);
                    }
                    return list;
                }

                // 店铺单量排行
                if (res[1]) {
                    const datas = res[1].data.data;
                    if (datas.length < 10) {
                        const num = 10 - datas.length;
                        this.shopTopList = [
                            ...datas,
                            ...createData(num, {
                                shopName: '---',
                                saleOrderNum: '---',
                            })];
                    } else {
                        this.shopTopList = datas;
                    }

                }

                // 采购量比例
                if (res[2]) {
                    const datas = res[2].data.data;
                    const seriesData = [
                        {
                            name: '未采购',
                            value: datas.noPurchaseOrders,
                            label: {
                                color: '#5F91F6',
                                formatter: '{val|{c}} \n ({rate|{d}}%)',
                                rich: {
                                    val: {
                                        align: 'center',
                                    },
                                    rate: {
                                        align: 'center',
                                    }
                                }
                            },
                            labelLine: {
                                lineStyle: {
                                    color: '#5F91F6',
                                },
                                smooth: 0.2,
                                length: 10,
                                length2: 20,
                            },
                            itemStyle: {
                                color: '#5F91F6',
                                width: 55,
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                                },
                            },
                        },
                        {
                            name: '已采购',
                            value: datas.purchaseOrders,
                            label: {
                                color: '#64E0B5',
                                formatter: '{val|{c}} \n ({rate|{d}}%)',
                                rich: {
                                    val: {
                                        align: 'center',
                                    },
                                    rate: {
                                        align: 'center',
                                    }
                                }
                            },
                            labelLine: {
                                lineStyle: {
                                    color: '#64E0B5',
                                },
                                smooth: 0.2,
                                length: 10,
                                length2: 20,
                            },
                            itemStyle: {
                                color: '#64E0B5',
                                width: 55,
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                                },
                            },
                        },
                    ];
                    this.$refs.pieChart.initData(pieChartOptions(seriesData));
                }

                // 订单走向
                if (res[3]) {
                    const datas = res[3].data.data;
                    let days = HOURS;
                    switch (this.form.searchDateRange) {
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
                    const orders = datas.map(v => v.orders === null ? 0 : v.orders);
                    const purchaseOrders = datas.map(v => v.purchaseOrders === null ? 0 : v.purchaseOrders);
                    const returnOrders = datas.map(v => v.returnOrders === null ? 0 : v.returnOrders);
                    const shipmentOrders = datas.map(v => v.shipmentOrders === null ? 0 : v.shipmentOrders);
                    const statisticsDate = datas.map(v => v.statisticsDate);
                    this.$refs.lineChart.initData(
                        lineChartOptions({
                            days, orders, purchaseOrders, returnOrders, shipmentOrders, statisticsDate
                        }));
                }
                // 销售商品排行
                if (res[4]) {
                    const datas = res[4].data.data.records;
                    if (datas.length < 10) {
                        const num = 10 - datas.length;
                        this.saleProductTopList = [
                            ...datas,
                            ...createData(num, {
                                productName: '---',
                                saleProductNum: '---',
                            })];
                    } else {
                        this.saleProductTopList = datas;
                    }
                }
                this.getCurrentTime();
                this.countDown = 300;
                this.countdown();
            });
            this.loading = false;
        },
        // 定时器 获取当前时间
        getCurrentTime() {
            setInterval(() => {
                this.currentTime = parseTime(new Date(), '{h}:{i}:{s}');
            }, 1000);
        },
        // 实时数据 倒计时更新
        countdown() {
            clearInterval(this.countDownIntervalID);
            this.countDownIntervalID = setInterval(() => {
                this.countDown--;
                this.countDownTime = this.$moment(this.countDown * 1000).format('m分ss');
                if (this.countDown < 1) {
                    this.fetchData();
                    this.countDown = 300;
                    this.countDownTime = this.$moment(this.countDown * 1000).format('m分ss');

                }
            }, 1000);
        },
        handleScreen() {
            fullscreenToggel()
        },
        setScreen() {
            this.$store.commit('SET_FULLSCREEN')
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
        // 统计时间类型（1-付款日期【默认值】,2-采购日期）
        dateTypeChange(val) {
            let dateRange = 1;
            switch (val) {
                case '按付款日期':
                    dateRange = 1;
                    break;
                case '按采购日期':
                    dateRange = 2;
                    break;
            }
            this.form.searchDateType = dateRange;
            this.fetchData();
        },

    },
    beforeDestroy () {
        clearInterval(this.countDownIntervalID)
        this.countDownIntervalID = null
    }
};
</script>

<style lang="scss" scoped>
.container {
    background: #1d2642;
    height: 100vh;
    overflow-y: auto;
    .header {
        background: no-repeat url("/img/liveDetail/top.png");
        background-size: 100% 77px;
        .top-box {
            z-index: 1;
            display: flex;
            font-size: 12px;
            height: 77px;
            .left {
                display: flex;
                width: 25%;
                padding: 12px 0 0 28px;
                .return-index {
                    margin-left: 57px;
                    .btn {
                        position: relative;
                        width: 130px;
                        height: 33px;
                        cursor: pointer;
                        border-radius: 4px;
                        border: 1px solid #5f91f6;
                        font-size: 16px;
                        font-weight: 400;
                        line-height: 22px;
                    }
                    .iconfont {
                        position: absolute;
                        top: 6px;
                        left: 17px;
                        font-size: 22px;
                        color: #5f91f6;
                    }
                    .text {
                        display: inline-block;
                        color: #5f91f6;
                        margin: 6px 0 0 47px;
                    }
                }
            }
            .center {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50%;
                margin-top: 8px;
                font-size: 38px;
                color: #ffffff;
                line-height: 46px;
                letter-spacing: 24px;
            }
            .right {
                width: 25%;
                display: flex;
                justify-content: flex-end;
                padding: 10px 28px 0 0;
            }
            ::v-deep
                .el-radio-button__orig-radio:checked
                + .el-radio-button__inner {
                color: rgba(255, 255, 255, 0.7);
                background-color: #45537e;
                box-shadow: -1px 0 0 0 #45537e;
            }
            ::v-deep .el-radio-button__inner {
                color: rgba(255, 255, 255, 0.7);
                font-weight: 400;
                background: #2e395a;
                border: 1px solid #55638a;
            }
            ::v-deep .el-radio-button--medium .el-radio-button__inner {
                padding: 8px 10px;
            }
            .btn {
                width: 48px;
                height: 32px;
                background: #2e395a;
                border-radius: 4px;
                border: 1px solid #55638a;
                color: rgba(255, 255, 255, 0.7);
                font-weight: 400;
                line-height: 14px;
            }
            .selected {
                background: #45537e;
            }
        }
        .content-wrap {
            min-height: 196px;
            .between-box {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                color: #6bb1f1;
                min-height: 22px;
                .lbox {
                    display: flex;
                    align-items: flex-end;
                    font-size: 15px;
                    line-height: 21px;
                    padding-left: 220px;
                    .date {
                        color: rgba(255, 255, 255, 0.7);
                    }
                    .time {
                        margin-left: 10px;
                        font-size: 22px;
                        color: #6bb1f1;
                    }
                }
                .rbox {
                    padding-right: 50px;
                    font-size: 16px;
                    line-height: 22px;
                    letter-spacing: 1px;
                }
            }
            .bottom-box {
                display: flex;
                justify-content: space-evenly;
                padding: 0 30px;
                margin-top: 24px;
                .card {
                    display: flex;
                    height: 150px;
                    border-radius: 32px;
                    overflow: hidden;
                    .left {
                        display: flex;
                        flex-direction: column;
                        width: 50%;
                        padding-left: 32px;
                        .value {
                            padding-top: 35px;
                            font-size: 46px;
                            color: #ffffff;
                            line-height: 55px;
                            text-shadow: 0px 2px 2px rgba(103, 101, 255, 0.5);
                        }
                        .text {
                            padding-top: 3px;
                            font-size: 16px;
                            font-weight: 400;
                            color: #ffffff;
                            line-height: 22px;
                            text-shadow: 0px 2px 2px rgba(103, 101, 255, 0.5);
                        }
                    }
                    .right {
                        width: 50%;
                        display: flex;
                        justify-content: flex-end;
                        i {
                            padding: 26px 26px 0 0;
                            font-size: 28px;
                            color: #ffffff;
                        }
                    }
                }
                .el-col:nth-child(1) .card{
                    background: url("/img/liveDetail/1.png") no-repeat;
                    background-size: 100% 100%;
                }
                .el-col:nth-child(2) .card{
                    background: url("/img/liveDetail/2.png") no-repeat;
                    background-size: 100% 100%;
                }
                .el-col:nth-child(3) .card{
                    background: url("/img/liveDetail/3.png") no-repeat;
                    background-size: 100% 100%;
                }
                .el-col:nth-child(4) .card{
                    background: url("/img/liveDetail/4.png") no-repeat;
                    background-size: 100% 100%;
                }
            }
        }
    }
    .content {
        display: flex;
        margin: 30px 30px 0 32px;

        .cbox {
            display: flex;
            flex-direction: column;
            flex: 1 1 auto;
            margin-left: 30px;
            border-radius: 8px;
            background: no-repeat url("/img/liveDetail/center.png");
            .header-wrap {
                display: flex;
                .left {
                    padding: 30px 21px 15px 22px;
                    .img {
                        display: inline-block;
                        background: no-repeat url("/img/liveDetail/money.png");
                        background-size: 186px 186px;
                        width: 186px;
                        height: 186px;
                    }
                }
                .right {
                    display: flex;
                    flex: 1 1 auto;
                    flex-direction: column;
                    .title {
                        margin-top: 39px;
                        margin-left: 98px;
                        font-size: 32px;
                        color: #ffffff;
                        line-height: 37px;
                        letter-spacing: 14px;
                        min-width: 185px;
                    }
                    .sum {
                        margin-top: 54px;
                        font-size: 48px;
                        color: #ffec66;
                        line-height: 48px;
                        letter-spacing: 10px;
                    }
                }
            }
            .item-wrap {
                display: flex;
                flex: 1 1 auto;
                flex-direction: column;
                padding: 0 20px;
                .row {
                    display: flex;
                    flex: 1 1 auto;
                    justify-content: space-around;
                    .item {
                        display: flex;
                        flex-direction: column;
                        height: 150px;
                        background: linear-gradient(
                            1deg,
                            #3a4569 0%,
                            #59678f 100%
                        );
                        border-radius: 20px;
                        color: #ffffff;
                        overflow: hidden;
                        .top-box {
                            display: flex;
                            align-items: center;
                            position: relative;
                            .text {
                                padding: 29px 24px 0 24px;
                                font-size: 16px;
                                color: rgba(255, 255, 255, 0.6);
                                line-height: 22px;
                            }
                            .iconfont {
                                position: absolute;
                                top: 18px;
                                right: 24px;
                                font-size: 36px;
                            }
                        }
                        .bottom-box {
                            display: flex;
                            .value {
                                padding: 11px 0 0 18px;
                                font-size: 42px;
                                line-height: 50px;
                            }
                        }
                    }
                }
            }
        }
        .rbox {
            margin-left: 30px;
            width: 380px;
            height: 600px;
            background: #2e395a;
            border-radius: 20px;
            .title {
                padding: 30px 0 0 32px;
                font-size: 18px;
                color: #ffffff;
                line-height: 22px;
            }
        }
    }
    .bottom {
        display: flex;
        margin: 30px 30px 46px 32px;
        .lbox {
            width: 580px;
            height: 570px;
            background: #2e395a;
            border-radius: 20px;
        }
        .rbox {
            display: flex;
            flex: 1 1 auto;
            margin-left: 30px;
            height: 442px;
            background: #2e395a;
            border-radius: 20px;
            position: relative;
            .title {
                position: absolute;
                top: 30px;
                left: 32px;
                font-size: 18px;
                color: #ffffff;
                line-height: 22px;
            }
            .chart-wrap {
                padding-top: 40px;
                width: 100%;
                height: 400px;
            }
        }
    }

    .ranking {
        position: relative;
        width: 580px;
        height: 570px;
        background: #2e395a;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        .title {
            margin: 20px 0 0 32px;
            font-size: 18px;
            color: #ffffff;
            line-height: 22px;
        }
        .level-wrap {
            display: flex;
            justify-content: space-evenly;
            font-size: 14px;
            font-weight: 400;
            color: #ffffff;
            .text {
                text-align: center;
                margin-top: 8px;
                line-height: 22px;
            }
            .value {
                line-height: 19px;
            }
            .item {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                margin: 0 10px;
                flex: 1 1;
            }
            .left {
                .crown {
                    width: 59px;
                    height: 80px;
                    background: no-repeat url("/img/liveDetail/crown2.png");
                }
            }
            .center {
                .crown {
                    width: 95px;
                    height: 126px;
                    background: no-repeat url("/img/liveDetail/crown1.png");
                }
            }
            .right {
                .crown {
                    width: 58px;
                    height: 81px;
                    background: no-repeat url("/img/liveDetail/crown3.png");
                }
            }
        }
        .list {
            margin-left: 32px;
            .cell {
                display: flex;
                align-items: center;
                font-size: 12px;
                color: #fff;
                margin-top: 14px;
                .circle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 30px;
                    height: 30px;
                    box-shadow: 0px 0px 5px 0px rgba(255, 255, 255, 0.6);
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.5);
                    line-height: 14px;
                }
                .text {
                    width: 150px;
                    padding-left: 20px;
                    line-height: 17px;
                }
                .line-box {
                    width: 250px;
                    height: 17px;
                    width: 250px;
                    background: rgba(216, 216, 216, 0.05);
                    border-radius: 0px 100px 100px 0px;
                    margin: 0 13px 0 20px;
                    .line {
                        max-width: 100%;
                        height: 100%;
                        border-radius: 0px 100px 100px 0px;
                        background: linear-gradient(
                            270deg,
                            #71bcfd 0%,
                            #3187ff 100%
                        );
                    }
                }
            }
        }
    }
    // 销售商品排行 细节调整
    .sale {
        .level-wrap {
            .text {
                line-height: 18px;
            }
        }
        .list {
            .cell {
                margin-top: 10px;
            }
        }
    }
}
</style>
