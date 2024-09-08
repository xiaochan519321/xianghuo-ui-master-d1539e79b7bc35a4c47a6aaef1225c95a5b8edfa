<template>
    <div class='market-workbench'>
        <div class="market-content flex">
            <div class="workbench-left flex-1">
                <div class="account-content flex">
                    <div class="account-info p20 text-center">
                        <div class="title">账户提现</div>
                        <div class="photo"></div>
                        <p class="py10">{{merchantName}}</p>
                        <el-button size="mini" type="primary" @click="onBalance">我要提现</el-button>
                    </div>
                    <div class="account-count flex-1">
                        <div class="title">
                            数据看板
                            <div class="refresh-btn">
                                <el-button type="primary" icon="el-icon-refresh-right" @click="loadDataBoard"></el-button>
                            </div>
                        </div>
                        <el-row class="count-row" v-loading="boardLoading">
                            <el-col :span="8" class="text-center">
                                <div class="info">
                                    <p>当前佣金</p>
                                    <span>¥ {{dataBoard.commission || 0}}</span>
                                </div>
                            </el-col>
                            <el-col :span="8" class="text-center">
                                <div class="info">
                                    <p>提现审核中</p>
                                    <span class="dispose-btn" @click="$router.push('/admin/sysenchashmentrecord/index')">{{dataBoard.infoCount || 0}}</span>
                                </div>
                            </el-col>
                            <el-col :span="8" class="text-center">
                                <div class="info no-border">
                                    <p>总收入</p>
                                    <span>¥ {{dataBoard.totalMoney || 0}}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div class="spread-content">
                    <div class="title">
                        推广信息
                        <div class="count-user">
                            总邀请人数：{{dataBoard.promoteNum}}人
                            <!-- <el-button class="view-all-btn" size="mini" type="primary" @click="$router.push('/market/customer')">查看全部</el-button> -->
                        </div>
                    </div>
                    <div class="spread-url">
                        销售专属推广链接：{{promoteUrl}}
                        <el-button type="text" style="padding: 0; margin-left: 10px;" v-clipboard:copy="promoteUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</el-button>
                    </div>
                </div>
                <!-- 积分充值记录 -->
                <div class="point-content">
                    <div class="header flex items-center">
                        <div class="title">积分充值记录<span>（单位：元）</span></div>
                        <div class="flex flex-1 justify-end">
                            <div class="dateRange">
                                <el-radio-group
                                    class="mr15"
                                    v-model="pointDateRange"
                                    size="small"
                                    @change="dateRangePointChange"
                                >
                                    <el-radio-button label="今日"></el-radio-button>
                                    <el-radio-button label="本周"></el-radio-button>
                                    <el-radio-button label="本月"></el-radio-button>
                                </el-radio-group>
                                <el-date-picker
                                    v-model="form.pointCreateTimeArr"
                                    @change="onPointChange"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions"
                                    style="width: 240px; padding-right: 0;"
                                    value-format="yyyy-MM-dd">
                                </el-date-picker>

                            </div>
                            <div class="refresh-btn ml10">
                                <el-button type="primary" icon="el-icon-refresh-right" @click="loadPointChart"></el-button>
                            </div>
                        </div>
                    </div>
                    <div class="detail" v-loading="pointLoading">
                        <areaChart ref="pointChart" />
                    </div>
                </div>
            </div>
            <div class="workbench-right">
                <div class="tips-content">
                    <div class="title">推荐说明</div>
                    <div class="items">
                        <div class="item">
                            <div class="desc">如何推荐</div>
                            <div class="detail">复制下面的专属推广链接，发送到电商群或者朋友，朋友打开注册登录网站视为邀请成功...</div>
                        </div>
                        <div class="item">
                            <div class="desc">什么时候有提成奖励</div>
                            <div class="detail">推荐下级用户成功支付进行付费，即可获取最高20%的提成...</div>
                        </div>
                        <div class="item">
                            <div class="desc">为什么推荐了没有成功</div>
                            <div class="detail">
                                <p>推荐如果没成功，一般是以下二种情况：</p>
                                <p>1、没有打开推广链接</p>
                                <p>2、已被其它人推荐，视为平台老用户，仅支持新用户</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="vips-content">
                    <div class="title">
                        会员开通使用情况
                        <span class="font13">统计总数：{{vipCount}}人</span>
                    </div>
                    <div class="detail p10" v-loading="vipLoading">
                        <pieChart ref="vipChart"/>
                    </div>
                </div>
            </div>
        </div>
        <DialogBalance ref="dialogBalance" @success="loadDataBoard"/>
    </div>
</template>

<script>
const HOURS = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
import areaChart from '@/components/charts/areaChart'
import pieChart from '@/components/charts/pieChart'
import DialogBalance from './modules/DialogBalance'
import { getPointChart, getVipChart, getDataBoard, getPopularize } from '@/api/admin/sales/workbench'
import { mapState } from 'vuex'
export default {
    components: {
        areaChart,
        pieChart,
        DialogBalance
    },
    data() {
        return {
            // 日期 筛选
            pointDateRange: '今日',
            pointDateVal: 0,
            form: {
                pointCreateTimeArr: null
            },
            dataBoard: {},
            pointLoading: false,
            vipLoading: false,
            boardLoading: false,
            vipCount: 0,
            // 曲线图主题色
            seriesTheme: [
                {key: 'userCount', theme: '#419eff', themeStart: 'rgba(65, 158, 255, 0.3)', themeEnd: 'rgba(65, 158, 255, 0.9)'},
                {key: 'amount', theme: '#24c2dc', themeStart: 'rgba(36, 194, 220, 0.3)', themeEnd: 'rgba(36, 194, 220, 0.9)'},
                {key: 'orderNum', theme: '#4141e9', themeStart: 'rgba(65, 65, 233, 0.3)', themeEnd: 'rgba(65, 65, 233, 0.9)'}
            ],
            choiceDate: null,
            pickerOptions: {
                onPick: ({ maxDate, minDate }) => {
                    // 把选择的第一个日期赋值给一个变量。
                    this.choiceDate = minDate.getTime()
                    // 如何你选择了两个日期了，就把那个变量置空
                    if (maxDate) this.choiceDate = ''
                },
                disabledDate: (time) => {
                    let self = this;
                    const now = Date.now()
                    if (self.choiceDate) {
                            // 7天的时间戳
                            const one = 30 * 24 * 3600 * 1000
                            // 当前日期 - one = 7天之前
                            const minTime = self.choiceDate - one
                            // 当前日期 + one = 7天之后
                            const maxTime = self.choiceDate + one > now ? now : self.choiceDate + one
                            return (
                                time.getTime() < minTime ||
                                time.getTime() > maxTime
                            )
                    } else {
                        return time.getTime() > now
                    }
                }
            }
        }
    },
    computed: {
        ...mapState({
            my: state => state.user.my
        }),
        merchantName () {
            try {
                return this.my.merchantName
            } catch (err) {
                console.log('err')
                return ''
            }
        },
        promoteUrl () {
            return `${window.location.origin}/#/login?promoteCode=${this.dataBoard.promoteCode}`
        },
    },
    methods: {
        // 提现
        onBalance () {
            this.$refs.dialogBalance.showEdit(this.dataBoard.commission, )
        },
        // 积分充值记录时间筛选
        dateRangePointChange (val) {
            let dateRange = 1;
            switch (val) {
                case '今日':
                    dateRange = 0;
                    break;
                case '本周':
                    dateRange = 1;
                    break;
                case '本月':
                    dateRange = 2;
                    break;
                case '选择日期':
                    dateRange = 3;
                    break;
            }
            this.pointDateRange = val
            this.pointDateVal = dateRange
            this.form.pointCreateTimeArr = null
            this.loadPointChart()
        },
        // 积分充值记录时间自定义
        onPointChange (val) {
            console.log('val', val)
            if (val) {
                this.pointDateRange = '选择日期'
                this.pointDateVal = 3
            } else {
                this.pointDateRange = '今日'
                this.pointDateVal = 0
            }
            this.loadPointChart()
        },
        fetchData () {
            this.loadDataBoard()
            this.loadPopular()
            this.loadPointChart()
            this.loadVipChart()
        },
        // 账户基础数据
        async loadDataBoard () {
            this.boardLoading = true
            const { data } = await getDataBoard()
            this.dataBoard = {
                ...this.dataBoard,
                ...data.data
            }
            this.boardLoading = false
        },
        // 推广信息
        async loadPopular () {
            const { data } = await getPopularize()
            this.dataBoard = {
                ...this.dataBoard,
                ...data.data
            }
        },
        // 积分充值记录
        async loadPointChart () {
            let today = false
            const params = {
                queryType: this.pointDateVal
            }
            if (this.form.pointCreateTimeArr) {
                params['startTime'] = `${this.form.pointCreateTimeArr[0]} 00:00:00`
                params['endTime'] = `${this.form.pointCreateTimeArr[1]} 23:59:59`
                today = this.form.pointCreateTimeArr[0] == this.form.pointCreateTimeArr[1]
            }
            this.pointLoading = true
            const { data } = await getPointChart(params)
            this.pointLoading = false
            console.log('initPointData', data)
            let xAxisData = this.pointDateVal == 0 || today ? HOURS : this.initXAxis(data.data)
            const legendData = ['充值商家数', '充值金额', '充值笔数']
            const option = {
                legendData: legendData,
                xAxisData: xAxisData,
                series: legendData.map((item, index) => {
                    return {
                        ...this.seriesTheme[index],
                        name: item,
                        values: data.data.map(value => value[this.seriesTheme[index].key])
                    }
                })
            }
            console.log('option', option)
            this.$refs.pointChart.initData(option)
        },
        // 会员开通情况
        async loadVipChart () {
            this.vipLoading = true
            const { data } = await getVipChart({})
            console.log('initVipData', data)
            const option = {
                legend: data.data.records.map(item => {return {name: item.memberName, icon: 'circle'} }),
                data: data.data.records.map(item => {return {name: item.memberName, value: item.memberNum || 0} }),
            }
            this.$refs.vipChart.initData(option)
            this.vipCount = data.data.total
            this.vipLoading = false
        },
        // 处理出曲线图x轴坐标出来
        initXAxis (items) {
            console.log('items', items)
            const data = items.map(item => {
                return item.createTime ? item.createTime.substr(5, 5) : '-'
            })
            console.log('items', data)
            return data
        },
        // 复制成功
        onCopy(e) {
            this.$message({
                message: '复制成功！',
                type: 'success'
            })
        },
        // 复制失败
        onError(e) {
            this.$message({
                message: '复制失败！',
                type: 'error'
            })
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.fetchData()
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>
<style lang="scss" scoped>
.market-workbench {
    position: relative;
    height: calc(100vh - 115px);
    overflow: scroll;
    padding: 0 5px 15px 15px;
    ::v-deep.el-radio-group {
        .el-radio-button {
            .el-radio-button__inner {
                border: 0;
                background-color: #F7F7F7;
            }
        }
        .el-radio-button.is-active {
            .el-radio-button__inner {
                background-color: rgb(70, 180, 109);
                border-color: rgb(70, 180, 109);
                -webkit-box-shadow: -1px 0 0 0 rgb(70, 180, 109);
                box-shadow: -1px 0 0 0 rgb(70, 180, 109);
            }
        }
    }
    &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: #999;
    }
    &::-webkit-scrollbar-track-piece {
        background-color: #f0f2f5;
    }
    .refresh-btn {
        .el-button {
            font-size: 20px;
            padding: 4px 6px;
        }
    }
    .market-content {
        min-width: 1240px;
    }
    .title {
        font-size: 16px;
        font-weight: 500;
        position: relative;
        color: #333;
        padding: 15px 20px;
        border-bottom: 1px solid #ededed;
    }
    .title:after {
        content: "";
        position: absolute;
        width: 4px;
        height: 17px;
        background: #3b7bff;
        top: 14px;
        left: 10px;
    }
    .workbench-left {
        .account-content {
            .account-info {
                width: 300px;
                background-color: #fff;
                border-radius: 5px;
                .title {
                    padding: 0;
                    padding-left: 10px;
                    position: absolute;
                    left: 30px;
                    top: 20px;
                    border: 0;
                }
                .title:after {
                    top: -1px;
                    left: 0;
                }
                .photo {
                    margin: 10px auto 0;
                    width: 60px;
                    height: 60px;
                    background: url('/img/user/avatar.png') no-repeat;
                    background-size: contain;
                }
            }
            .account-count {
                margin-left: 15px;
                background-color: #fff;
                border-radius: 5px;
                .title {
                    padding-right: 10px;
                    .refresh-btn {
                        float: right;
                        margin-top: -8px;
                    }
                }
                .count-row {
                    padding: 30px 20px;
                    box-sizing: border-box;
                    .info {
                        padding: 5px 0;
                        border-right: 1px solid #ededed;
                        p {
                            margin-bottom: 16px;
                        }
                        span {
                            color: #3b7bff;
                            font-family: Barlow;
                            font-size: 18px;
                        }
                        .dispose-btn {
                            cursor: pointer;
                        }
                        .dispose-btn:hover {
                            color: rgb(124, 189, 255);
                        }
                    }
                    .info.no-border {
                        border: 0;
                    }
                }
            }
        }
        .spread-content {
            margin: 15px 0;
            background-color: #fff;
            border-radius: 5px;
            .title {
                padding-right: 10px;
                .count-user {
                    font-size: 13px;
                    float: right;
                    .view-all-btn {
                        vertical-align: text-top;
                        margin-left: 10px;
                        transform: translateY(-6px);
                        padding-left: 10px;
                        padding-right: 10px;
                    }
                }
            }
            .spread-url {
                padding: 49px 20px;
            }
        }
        .point-content {
            background-color: #fff;
            border-radius: 5px;
            .header {
                padding-right: 10px;
                border-bottom: 1px solid #ededed;
                .title {
                    border: 0;
                }
            }
            .detail {
                padding: 20px;
                box-sizing: border-box;
                height: 350px;
                width: 100%;
            }
            ::v-deep.el-range-separator {
                width: 10%;
            }
        }
    }
    .workbench-right {
        width: 450px;
        border-radius: 5px;
        margin-left: 15px;
        .tips-content {
            background-color: #fff;
            border-radius: 5px;
            margin-bottom: 15px;
            .items {
                padding: 12px 20px;
                .item {
                    .desc {
                        margin-bottom: 12px;
                        color: #333;
                        font-weight: 500;
                    }
                    .detail {
                        background-color: #ededed;
                        border-radius: 5px;
                        padding: 9px 10px;
                        font-size: 13px;
                        box-sizing: border-box;
                        line-height: 20px;
                        margin-bottom: 12px;
                    }
                }
                .item:last-child {
                    .detail {
                        margin-bottom: 0;
                    }
                }
            }
        }
        .vips-content {
            background-color: #fff;
            border-radius: 5px;
            .title span {
                float: right;
                margin-top: 3px;
            }
            .detail {
                height: 350px;
            }
        }
    }
}
</style>