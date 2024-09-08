<template>
    <div class="container">
        <div class="header">
            <div class="top-box">
                <div class="left">
                    <div class="return-index">
                        <div class="btn">
                            <router-link to="/dashboard/index">
                                <i class="iconfont icon-back"></i>
                                <span class="text">返回首页</span>
                            </router-link>
                        </div>
                        <div class="rbox" v-if="!loading">
                            <span>{{countDownTime}}</span>
                            <span>后自动更新</span>
                        </div>
                    </div>
                </div>
                <div class="center">数据大屏</div>
                <div class="right">
                    <div class="lbox" v-if="!loading">
                        <span class="date">{{ currentDate }}</span>
                        <span class="time">{{currentTime}}</span>
                    </div>
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
                </div>
            </div>
            <div class="content-wrap relative" v-spin="loading">
                <div class="title">今日实时概况</div>
                <el-row class="bottom-box" :gutter="50">
                    <el-col :span="6">
                        <div class="card" v-if="!loading">
                            <div class="left">
                                <count-to
                                    :start-val="Number(oldDataBoard.todayShopNum || 0)"
                                    :end-val="Number(dataBoard.todayShopNum || 0)"
                                    :duration="1000"
                                    class="value"
                                />
                                <span class="text">新增店铺数</span>
                            </div>
                            <div class="right">
                                <p class="all-shop">总店铺数: {{dataBoard.allShopNum || 0}}</p>
                                <i class="iconfont icon-jine"></i>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="card" v-if="!loading">
                            <div class="left">
                                <count-to
                                    :start-val="Number(oldDataBoard.salesItems || 0)"
                                    :end-val="Number(dataBoard.salesItems || 0)"
                                    :duration="1000"
                                    class="value"
                                />
                                <span class="text">销售商品数</span>
                            </div>
                            <div class="right">
                                <i class="iconfont icon-purchase-order-num"></i>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="card" v-if="!loading">
                            <div class="left">
                                <count-to
                                    :start-val="Number(oldDataBoard.purchaseItems || 0)"
                                    :end-val="Number(dataBoard.purchaseItems || 0)"
                                    :duration="1000"
                                    class="value"
                                />
                                <span class="text">采购商品数</span>
                            </div>
                            <div class="right">
                                <i class="iconfont icon-jine"></i>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="card" v-if="!loading">
                            <div class="left">
                                <count-to
                                    :start-val="Number(oldDataBoard.todayIntegral || 0)"
                                    :end-val="Number(dataBoard.todayIntegral || 0)"
                                    :duration="1000"
                                    class="value"
                                />
                                <span class="text">积分</span>
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
        <div class="main-middle">
            <div class="left">
                <div class="row">
                    <div class="title">今日销售订单统计</div>
                    <div class="count" v-spin="loading">
                        <div class="text" v-if="!loading">
                            <div class="tip">已累加销售订单数</div>
                            <div class="num">
                                <count-to
                                    :start-val="Number(oldDataBoard.todaySalesCount || 0)"
                                    :end-val="Number(dataBoard.todaySalesCount || 0)"
                                    :duration="1000"
                                />
                                <i class="top-icon"></i>
                            </div>
                            <div class="desc">采购订单数：{{Number(dataBoard.todayPurchaseCount || 0)}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="center" ref="middleCenterBox">
                <div class="row" v-spin="loading">
                    <el-row :gutter="100" class="header-row" v-if="!loading">
                        <el-col :span="12">
                            <div class="item">
                                <div class="main">
                                    <div class="title">销售金额（元）</div>
                                    <count-to
                                        :start-val="Number(oldDataBoard.salesAmount || 0)"
                                        :end-val="Number(dataBoard.salesAmount || 0)"
                                        :duration="1000"
                                        class="count"
                                    />
                                </div>
                                <i class="iconfont icon-amount"></i>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="item">
                                <div class="main">
                                    <div class="title">采购金额（元）</div>
                                    <count-to
                                        :start-val="Number(oldDataBoard.purchaseAmount || 0)"
                                        :end-val="Number(dataBoard.purchaseAmount || 0)"
                                        :duration="1000"
                                        class="count"
                                    />
                                </div>
                                <i class="iconfont icon-purchase-amount"></i>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="50" class="footer-row" v-if="!loading">
                        <el-col :span="8">
                            <div class="item">
                                <div class="main">
                                    <div class="title">销售退款金额（元）</div>
                                    <count-to
                                        :start-val="Number(oldDataBoard.salesRefundAmount || 0)"
                                        :end-val="Number(dataBoard.salesRefundAmount || 0)"
                                        :duration="1000"
                                        class="count"
                                    />
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="item">
                                <div class="main">
                                    <div class="title">采购退款金额（元）</div>
                                    <count-to
                                        :start-val="Number(oldDataBoard.purchaseRefundAmount || 0)"
                                        :end-val="Number(dataBoard.purchaseRefundAmount || 0)"
                                        :duration="1000"
                                        class="count"
                                    />
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="item">
                                <div class="main">
                                    <div class="title">领券节省金额（元）</div>
                                    <count-to
                                        :start-val="Number(oldDataBoard.purchaseCostAmount || 0)"
                                        :end-val="Number(dataBoard.purchaseCostAmount || 0)"
                                        :duration="1000"
                                        class="count"
                                    />
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="right">
                <div class="row" v-spin="loading">
                    <div class="title">热销商品今日排行榜</div>
                    <div v-if="!loading">
                        <div class="table-title">
                            <div class="index">名次</div>
                            <div class="col">店铺名称</div>
                            <div class="col">商品销量</div>
                            <div class="col">销售金额</div>
                        </div>
                        <div class="items" :style="{height: `${middleHeight}px`}" v-if="!loading && goodsRankingList.length">
                            <vue-seamless-scroll :data="goodsRankingList" :class-option="seamlessScrollOption">
                                <div class="item" v-for="(item, index) in goodsRankingList" :key="index">
                                    <div class="index">{{index + 1}}</div>
                                    <div class="shopname col">{{item.shopName}}</div>
                                    <div class="col">{{item.productNum}}</div>
                                    <div class="col">{{item.salesAmount}}</div>
                                </div>
                            </vue-seamless-scroll>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 底部 -->
        <div class="main-bottom">
            <div class="bottom-chart">
                <div class="title">平台近一月订单走势</div>
                <div class="chart-wrap" v-spin="loading">
                    <my-charts ref="lineChart" :height="chartHeight" v-if="!loading"></my-charts>
                </div>
            </div>
        </div>
        <DialogFireWork ref="fire" />
        <audio ref="audio" src="/audio/fire_audio.mp3"></audio>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { fullscreenToggel, listenfullscreen } from '@/util/util';
import { parseTime } from '@/filters/';
import MyCharts from "@/components/charts/MyCharts";
import lineChartOptions from '../const/LineRevisionChart';
import CountTo from 'vue-count-to';
import vueSeamlessScroll from "vue-seamless-scroll";
import DialogFireWork from '@/components/dialog/DialogFireWork'



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
        CountTo,
        vueSeamlessScroll,
        DialogFireWork
    },
    data() {
        return {
            loading: true,
            // loading: false,
            type: '按付款日期',
            dateRange: '近七日',
            currentDate: parseTime(new Date(), '{y}年{m}月{d}日 星期{a}'),
            currentTime: parseTime(new Date(), '{h}:{i}:{s}'),
            form: {
                // 统计时间类型（1-付款日期【默认值】,2-采购日期）
                searchDateType: 1,
                // 统计时间范围（1-今天【默认值】,2-昨天,3-近七天,4-最近三十天）
                searchDateRange: 4,
            },
            // 实时数据 更新 倒计时 300秒 5分钟
            countDown: 10,
            countDownTime: '---',
            countDownIntervalID: '',
            oldDataBoard: {},
            dataBoard: {},
            // 店铺今日单量排行
            shopTopList: [],
            saleProductTopList: [],
            goodsRankingList: [],
            seamlessScrollOption: {
                step: 0.5, // 数值越大速度滚动越快
                limitMoveNum: 7, // 开始无缝滚动的数据量 this.dataList.length
                hoverStop: true, // 是否开启鼠标悬停stop
                direction: 1, // 0向下 1向上 2向左 3向右
                openWatch: true, // 开启数据实时监控刷新dom
                singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
                singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
                waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
            },
            middleHeight: 200,
            lineOption: {},
            chartHeight: '100%',
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
        // 为了处理热销商品排行列表无缝滚动无法计算高度的问题
        this.middleHeight = this.$refs.middleCenterBox.clientHeight - 107
        this.fetchData(true)
        listenfullscreen(this.setScreen)
    },
    methods: {
        async fetchData(loading = false) {
            this.loading = loading;
            // 重置数据
            this.shopTopList = [];
            this.saleProductTopList = [];

            const params = this.form;
            const arr = [
                await this.$API.getTodayRealTimeData(),
                await this.$API.getHotProductNum(),
                await this.$API.getOrderInfoForTime(),
            ];
            Promise.all(arr).then(res => {
                //  实时数据看板
                if (res[0]) {
                    const datas = res[0].data.data
                    console.log('datas', datas)
                    this.oldDataBoard = this.dataBoard
                    this.dataBoard = datas
                    this.onFireWork()
                }
                //  热销商品排行
                if (res[1]) {
                    const datas = res[1].data.data
                    console.log('shops', datas)
                    this.goodsRankingList = datas || []
                }
                //  近一月订单走势
                if (res[2]) {
                    const datas = res[2].data.data
                    const shops = []
                    const orders = []
                    const purchaseOrders = []
                    const days = []
                    // let days = HOURS;
                    // switch (this.form.searchDateRange) {
                    //     case 1:
                    //         days = HOURS;
                    //         break;
                    //     case 2:
                    //         days = HOURS;
                    //         break;
                    //     case 3:
                    //         days = datas.map(v => this.$moment(v.statisticsDate).format('MM-DD')).slice(0, 7);
                    //         break;
                    //     case 4:
                    //         days = datas.map(v => this.$moment(v.statisticsDate).format('MM-DD'));
                    //         break;
                    // }
                    datas.forEach(item => {
                        shops.push(item.shopNum || 0)
                        orders.push(item.salesCount || 0)
                        purchaseOrders.push(item.purchaseCount || 0)
                        days.push(this.$moment(item.createTime).format('MM-DD'))
                    })
                    this.lineOption = {days, shops, orders, purchaseOrders}
                    this.$refs.lineChart.initData(
                        lineChartOptions(this.lineOption)
                    )
                }
                this.getCurrentTime();
                this.countDown = 60;
                this.countdown();
            });
            this.loading = false;
        },
        // 是否需要放烟花
        onFireWork () {
            const oldCount = this.oldDataBoard.todaySalesCount || 0
            const count = this.dataBoard.todaySalesCount || 0
            // 向下取整记录每一次获取数据是否与久数据不是同个等级（每5万一个等级）
            if (oldCount > 0) {
                const oldLv = Math.floor(oldCount / 50000)
                const newLv = Math.floor(count / 50000)
                console.log('oldLv', oldLv)
                console.log('newLv', newLv)
                if (newLv > oldLv) {
                    this.$refs.fire.start()
                    this.$refs.audio.play()
                }
            }
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
                this.countDownTime = this.$moment(this.countDown * 1000).format('m分ss秒');
                if (this.countDown < 1) {
                    this.fetchData()
                    this.countDown = 60;
                    this.countDownTime = this.$moment(this.countDown * 1000).format('m分ss秒');

                }
            }, 1000);
        },
        handleScreen() {
            fullscreenToggel()
            this.$nextTick(() => {
                this.$refs.lineChart.initData(lineChartOptions(this.lineOption))
            })
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
    display: flex;
    flex-direction: column;
    position: relative;
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
                        display: inline-block;
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
                    .rbox {
                        font-size: 16px;
                        letter-spacing: 1px;
                        color: #6bb1f1;
                        margin-left: 20px;
                        display: inline-block;
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
                .lbox {
                    display: flex;
                    font-size: 15px;
                    line-height: 21px;
                    margin-right: 28px;
                    padding-top: 7px;
                }
                .date {
                    color: rgba(255, 255, 255, 0.7);
                }
                .time {
                    margin-left: 10px;
                    font-size: 22px;
                    color: #6bb1f1;
                }
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
            padding: 0 25px;
            min-height: 166px;
            .title {
                color: #fff;
                font-size: 16px;
                font-weight: 500;
                margin: 15px 10px 0;
            }
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
                margin-top: 20px;
                .card {
                    display: flex;
                    height: 130px;
                    border-radius: 32px;
                    overflow: hidden;
                    .left {
                        display: flex;
                        flex-direction: column;
                        width: 50%;
                        padding-left: 32px;
                        .value {
                            padding-top: 20px;
                            font-size: 46px;
                            font-family: Barlow;
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
                        .all-shop {
                            color: #fff;
                            padding-top: 34px;
                            padding-right: 10px;
                            font-size: 16px;
                        }
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
    .main-middle {
        margin-top: 25px;
        color: #fff;
        display: flex;
        .left,.right {
            flex-basis: 25%;
            padding: 0 25px;
            .row {
                background-color: #2e395a;
                border-radius: 10px;
                padding: 20px;
                height: 100%;
            }
        }
        .left {
            .title {
                font-size: 16px;
                font-weight: 500;
            }
            .count {
                margin: 25px 0;
                background: linear-gradient(0, #3a4569 0%, #59678f 100%);
                text-align: center;
                border-radius: 5px;
                line-height: 55px;
                width: 100%;
                padding-bottom: 70%;
                height: 0;
                position: relative;
                .text {
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    transform: translateY(-50%);
                    .num {
                        font-size: 46px;
                        font-family: Barlow;
                        position: relative;
                        display: inline-block;
                        .top-icon {
                            position: absolute;
                            width: 40px;
                            height: 40px;
                            right: -60px;
                            background: url('/img/liveDetail/icon_top.png') no-repeat;
                            background-size: contain;
                            top: 50%;
                            transform: translateY(-50%);
                        }
                    }
                }
            }
        }
        .center {
            flex: 1;
            padding: 0 25px;
            .row {
                background: url("/img/liveDetail/center.png") no-repeat;
                background-size: 110%;
                border-radius: 10px;
                padding: 30px 40px;
                box-sizing: border-box;
                height: 100%;
                .header-row {
                    margin-bottom: 50px;
                }
                .item {
                    background: linear-gradient(0, #3a4569 0%, #59678f 100%);
                    height: 0;
                    border-radius: 10px;
                    padding-bottom: 45%;
                    position: relative;
                    .iconfont {
                        position: absolute;
                        right: 40px;
                        top: 30px;
                        font-size: 38px;
                    }
                    .main {
                        position: absolute;
                        left: 25px;
                        top: 45%;
                        transform: translateY(-50%);
                        line-height: 52px;
                        .title {
                            font-size: 16px;
                        }
                        .count {
                            font-size: 46px;
                            font-family: Barlow;
                        }
                    }
                }
                .footer-row {
                    .item .main {
                        line-height: 36px;
                        .count {
                            font-size: 36px;
                        }
                    }
                }
            }
        }
        .right {
            .title {
                font-size: 16px;
                font-weight: 500;
                margin-bottom: 20px;
            }
            .table-title {
                display: flex;
                align-items: center;
                border-bottom: 1px solid #fff;
                text-align: center;
                line-height: 30px;
                .index {
                    flex-basis: 50px;
                }
                .col {
                    flex: 1;
                }
            }
            .items {
                padding-top: 10px;
                height: 200px;
                overflow: hidden;
                .item {
                    display: flex;
                    align-items: center;
                    text-align: center;
                    line-height: 35px;
                    .index {
                        flex-basis: 50px;
                    }
                    .shopname {
                        display: -webkit-box;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                    }
                    .col {
                        flex: 1;
                    }
                }
            }
        }
        // .left {
        //     background-color: #2e395a;
        //     border-radius: 10px;
        //     padding: 20px;
        //     .title {
        //         font-size: 16px;
        //         font-weight: 500;
        //     }
        //     .count {
        //         margin: 25px 0;
        //         background: linear-gradient(0, #3a4569 0%, #59678f 100%);
        //         text-align: center;
        //         border-radius: 5px;
        //         line-height: 55px;
        //         width: 100%;
        //         padding-bottom: 70%;
        //         height: 0;
        //         position: relative;
        //         .text {
        //             position: absolute;
        //             top: 50%;
        //             left: 0;
        //             right: 0;
        //             transform: translateY(-50%);
        //             .num {
        //                 font-size: 46px;
        //                 font-family: Barlow;
        //             }
        //         }
        //     }
        // }
        // .center {
        //     background: url("/img/liveDetail/center.png") no-repeat;
        //     background-size: cover;
        //     border-radius: 10px;
        //     padding: 25px;
        //     box-sizing: border-box;
        // }
        // .right {
        //     background-color: #2e395a;
        //     border-radius: 10px;
        //     padding: 20px;
        //     box-sizing: border-box;
        // }
    }
    .main-bottom {
        padding: 25px;
        flex: 1;
        position: relative;
        .bottom-chart {
            height: 100%;
            background-color: #2e395a;
            color: #fff;
            padding: 20px;
            border-radius: 10px;
        }
        .title {
            position: absolute;
            left: 50px;
            top: 50px;
            font-size: 16px;
            color: #fff;
            font-weight: 500;
        }
        .chart-wrap {
            height: 100%;
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
