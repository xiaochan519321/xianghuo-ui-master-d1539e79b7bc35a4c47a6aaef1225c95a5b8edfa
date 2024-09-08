<template>
    <div>
        <div class="dashboard-contailer" v-if="isAdmin">
            <!-- 管理员端 -->
            <div class="admin-content">
                <!-- 数据看板统计 -->
                <div class="count-content">
                    <div class="title">
                        数据看板统计
                        <el-button type="primary" style="float: right;" @click="fetchisAdminData">刷新</el-button>
                    </div>
                    <el-row class="count-items">
                        <el-col :span="3">
                            <div class="count-item manage flex items-center">
                                <div class="count-icon"></div>
                                <div class="info text-center">
                                    <div class="count">{{adminData.board.saleOrderNum || 0}}</div>
                                    <p>今天拍单</p>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="3">
                            <div class="count-item manage flex items-center">
                                <div class="count-icon"></div>
                                <div class="info text-center">
                                    <div class="count">{{adminData.board.sales || 0}}</div>
                                    <p>今天销售</p>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="3">
                            <div class="count-item future flex items-center">
                                <div class="count-icon"></div>
                                <div class="info text-center">
                                    <div class="count">{{adminData.board.userNum || 0}}</div>
                                    <p>总商家数</p>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="3">
                            <div class="count-item delivery flex items-center">
                                <div class="count-icon"></div>
                                <div class="info text-center">
                                    <div class="count">{{adminData.board.userNum || 0}}</div>
                                    <p>总店铺数</p>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="3">
                            <div class="count-item manage flex items-center">
                                <div class="count-icon"></div>
                                <div class="info text-center">
                                    <div class="count">{{adminData.board.totalOrderNum || 0}}</div>
                                    <p>总订单量</p>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="3">
                            <div class="count-item timeout flex items-center">
                                <div class="count-icon"></div>
                                <div class="info text-center">
                                    <div class="count">{{adminData.board.totalProfit || 0}}</div>
                                    <p>
                                        总利润
                                        <el-tooltip class="formula-tooltip" effect="light" placement="bottom-start">
                                            <i class="tips iconfont icon-wenhao font18" style="vertical-align: bottom;"></i>
                                            <div slot="content" class="tip-content">
                                                <p>站点后台用户充值金额 - 站点充值金额 = 总利润</p>
                                            </div>
                                        </el-tooltip>
                                    </p>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="3">
                            <div class="count-item recharge flex items-center">
                                <div class="count-icon"></div>
                                <div class="info text-center">
                                    <div class="count">{{adminData.board.totalAmount || 0}}</div>
                                    <p>总充值</p>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="3">
                            <div class="count-item balance flex items-center">
                                <div class="count-icon"></div>
                                <div class="info text-center">
                                    <div class="count">{{adminData.board.balance || 0}}</div>
                                    <p>站点余额</p>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <!-- 积分充值记录 -->
                <div class="point-content flex">
                    <div class="point-left flex-1">
                        <div class="header flex items-center px20 py10">
                            <div class="title">积分充值记录<span>（单位：元）</span></div>
                            <div class="flex flex-1 justify-end">
                                <div class="dateRange">
                                    <el-radio-group
                                        class="mr15"
                                        v-model="adminForm.pointDateRange"
                                        size="small"
                                        @change="dateRangePointChange"
                                    >
                                        <el-radio-button label="今日"></el-radio-button>
                                        <el-radio-button label="本周"></el-radio-button>
                                        <el-radio-button label="本月"></el-radio-button>
                                    </el-radio-group>
									<el-date-picker
										v-model="adminForm.pointCreateTimeArr"
                                        @change="onAdminPointChange"
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
                                    <el-button type="primary" icon="el-icon-refresh-right" @click="initPointData"></el-button>
                                </div>
                            </div>
                        </div>
                        <div class="detail" v-loading="adminLoading.point">
                            <areaChart ref="pointChart" />
                        </div>
                    </div>
                    <div class="point-right">
                        <div class="header flex items-center py18 px20">
                            <div class="title flex-1">会员开通使用情况</div>
                            <div class="font13">统计总数：{{adminData.vipCount}}人</div>
                        </div>
                        <div class="detail p10" v-loading="adminLoading.vip">
                            <pieChart ref="vipChart"/>
                        </div>
                    </div>
                </div>
                <!-- 订单统计 -->
                <div class="order-content mt15">
                    <div class="header flex items-center px20 py10">
                        <div class="title">
                            订单统计<span>（单位：单）</span>
                            <el-cascader
                                :options="sitesOptions"
                                :props="{ checkStrictly: true }"
                                placeholder="全部站点"
                                :show-all-levels="false"
                                filterable
                                clearable
                                @change="selectSite">
                            </el-cascader>
                            <el-select
                                class="ml15"
                                v-model="form.userId"
                                clearable
                                :disabled="form.tenantId == ''"
                                @change="onMerchantChange"
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
                                class="ml15"
                                v-model="form.shopId"
                                :disabled="form.userId == ''"
                                clearable
                                @change="initOrderData"
                                placeholder="全部店铺"
                            >
                                <el-option
                                    v-for="item in shopList"
                                    :key="item.id"
                                    :label="item.shopName"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </div>
                        <div class="flex flex-1 justify-end">
                            <div class="dateRange">
                                <el-radio-group
                                    class="mr15"
                                    v-model="adminForm.orderDateRange"
                                    size="small"
                                    @change="dateRangeOrderChange"
                                >
                                    <el-radio-button label="今日"></el-radio-button>
                                    <el-radio-button label="本周"></el-radio-button>
                                    <el-radio-button label="本月"></el-radio-button>
                                </el-radio-group>
                                <el-date-picker
                                    v-model="adminForm.orderCreateTimeArr"
                                    @change="onAdminOrderChange"
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
                                <el-button type="primary" icon="el-icon-refresh-right" @click="initOrderData"></el-button>
                            </div>
                        </div>
                    </div>
                    <div class="detail p20" v-loading="adminLoading.order">
                        <areaChart ref="orderChart" />
                    </div>
                </div>
            </div>
        </div>
        <div class="dashboard-container-business" v-else>
            <div id="admin-content">
                <!-- 数据看板统计 -->
                <div class="count-content">
                    <div class="userarea">
                        <div class="user">
                            <img class="avatar" src="/img/user/avatar.png" />
                            <div class="name" style="margin: 20px 30px;"> 
                                <div>{{ userData.username }}</div>
                                <div>{{ userData.merchantName }}</div>
                            </div>
                            <el-button type="primary" class="button"  @click="$router.push('/recharge/index')">充值积分</el-button>
                            <el-button type="primary" class="button"  @click="$router.push('/ticket/index')">充值点券</el-button>
                        </div>
                    </div>
                    <div class="top" style="margin-top: 30px;">
                        <div class="title">数据看板</div>
                        <span class="shopCount">店铺数量：({{shopList.length}})</span>
                        <el-select
                            v-model="shopId"
                            clearable
                            collapse-tags
                            style="width: 200px;margin-left: 20px;float: left;"
                            @change="onShopIdChange"
                            placeholder="全部店铺"
                        >
                            <el-option
                                v-for="item in shopList"
                                :key="item.id"
                                :label="item.shopName"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                        <!-- <div class="titleTime">销售金额开始统计时间</div> -->
                        <div class="right">
                            <el-date-picker
                                style="width: 350px;"
                                v-model="timeRange"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                            <el-radio-group
                                style="margin-left:5px;height: 32px;"
                                size="small"
                                v-model="dateRangeTime"
                                @change="dateRangeChange"
                            >
                                <el-radio-button label="实时" style="height: 33px;"></el-radio-button>
                                <el-radio-button label="7日" style="height: 33px;"></el-radio-button>
                                <el-radio-button label="30日" style="height: 33px;"></el-radio-button>
                            </el-radio-group>
                            <!-- <el-button icon="el-icon-download" style="margin-left:5px;background:rgb(70, 180, 109);color:#fff;border:none;">
                                <span>导出订单</span>
                            </el-button> -->
                        </div>
                    </div>
                    <div class="count-items">
                        <ul class="count-item">
                            <li class="count-icon" style="border-left:4px solid rgb(214,148,140);">
                                <div class="count">{{ sum1 || 0}}</div>
                                <p>已拍订单数</p>
                            </li>
                            <li class="count-icon" style="border-left:4px solid rgb(221,138,189);">
                                <div class="count">{{ sum2.toFixed(2) || 0}}</div>
                                <p>抖店实收金额</p>
                            </li>
                            <li class="count-icon" style="border-left:4px solid rgb(166,182,118);">
                                <div class="count">{{ sum3.toFixed(2) || 0}}</div>
                                <p>采购实付金额</p>
                            </li>
                            <li class="count-icon" style="border-left:4px solid rgb(93,79,165);">
                                <div class="count">{{ sum4.toFixed(2) || 0}}</div>
                                <p>平台补贴</p>
                            </li>
                            <li class="count-icon" style="border-left:4px solid rgb(235,158,92);">
                                <div class="count">{{ sum5.toFixed(2) || 0}}</div>
                                <p>预估利润额</p>
                            </li>
                            <li class="count-icon" style="border-left:4px solid rgb(92,144,202);">
                                <div class="count">{{ sum6 || 0}}</div>
                                <p>预估利润率</p>
                            </li>
                        </ul>
                    </div>
                    <div style="float: left;">
                        <el-checkbox-group style="margin-top: 20px;" @change="checkChange" v-model="checkList">
                            <el-checkbox label="已拍订单数"></el-checkbox>
                            <el-checkbox label="抖店实收金额"></el-checkbox>
                            <el-checkbox label="采购实付金额"></el-checkbox>
                            <el-checkbox label="平台补贴"></el-checkbox>
                            <el-checkbox label="预估利润额"></el-checkbox>
                            <el-checkbox label="预估利润率"></el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div id="main" style="float:left;height:450px; width:100%;margin-top:50px;"></div>
                    <el-table
                        :data="tableData"
                        :header-cell-style="{background:'#F8F9FB',color:'#000'}"
                        style="float:left;width: 100%;margin-top:30px;">
                        <el-table-column label="采购日期">
                            <template slot-scope="scope">
                                {{ formattedDate(scope.row.time) }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="alreadyOrderNumTotal"
                            label="已拍订单数">
                        </el-table-column>
                        <el-table-column label="抖店实收金额">
                            <template slot-scope="scope">
                                {{ (scope.row.actualCollectAmtTotal/100).toFixed(2) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="采购实付金额">
                            <template slot-scope="scope">
                                {{ (scope.row.purchasePayAmtTotal/100).toFixed(2) }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="subsidyAmtTotal"
                            label="平台补贴">
                            <template slot-scope="scope">
                                {{ (scope.row.subsidyAmtTotal/100).toFixed(2) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="预估利润额">
                            <template slot-scope="scope">
                                {{ ((scope.row.actualCollectAmtTotal - scope.row.purchasePayAmtTotal)/100).toFixed(2) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="预估利润率">
                            <template slot-scope="scope">
                                {{ (((scope.row.actualCollectAmtTotal - scope.row.purchasePayAmtTotal)/100) / (scope.row.purchasePayAmtTotal/100) * 100).toFixed(2) +'%'}}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapState } from "vuex";
import { loadMerchantInfo, getWorkData } from '@/api/dfh/shop'
import areaChart from '@/components/charts/areaChart'
import pieChart from '@/components/charts/pieChart'
import { debounce } from '@/scripts/utils/index';
import { getStore } from '@/util/store'

const HOURS = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
export default {
    name: 'dashboard',
    components: {
        areaChart,
        pieChart,
    },
    data() {
        return {
            //统计图列表
            List1: [],
            List2: [],
            List3: [],
            List4: [],
            List5: [],
            List6: [],
            dataList: [],
            checkList: ['已拍订单数','抖店实收金额','采购实付金额','平台补贴','预估利润额','预估利润率'],
            newArr:[],
            //数据列表
            tableData: [],
            //合计
            sum1:0,
            sum2:0,
            sum3:0,
            sum4:0,
            sum5:0,
            sum6:0,
            // 店铺列表
            shopList: [],
            userData: {},
            timeRange: [],
            shopId: '', //店铺编号
            beginTime: this.formatDate(new Date().setHours(0, 0, 0, 0)), // 开始
            endTime: this.formatDate(new Date()), // 结束
            dateRangeTime: '实时',

            fullscreenLoading: false,
            loading: true,
            openDialog: false,
            dateRangeLoading: false,
            // 是否管理员身份
            isAdmin: false,
            // 首次加载，面板数据为 今日，其他 日期范围，默认近七天
            firstLoading: true,
            // 站点选项
            sitesOptions: [],
            // 商家下拉框
            merchantOptions: [],
            // 查询参数
            form: {
                // 店铺ID
                userId: '',
                shopId: '',
                tenantId: '',
                selectDate: '',
            },

            // 管理端传参
            adminForm: {
                pointDateRange: '今日',
                pointDateVal: 1,
                orderDateRange: '今日',
                orderDateVal: 1,
                pointCreateTimeArr: null,
                orderCreateTimeArr: null
            },
            adminLoading: {
                board: false,
                point: false,
                vip: false,
                order: false
            },
            adminData: {
                board: {},
                vipCount: 0
            },
            // 曲线图主题色
            seriesTheme: [
                {key: 'shopNum', theme: '#419eff', themeStart: 'rgba(65, 158, 255, 0.3)', themeEnd: 'rgba(65, 158, 255, 0.9)'},
                {key: 'totalAmount', theme: '#24c2dc', themeStart: 'rgba(36, 194, 220, 0.3)', themeEnd: 'rgba(36, 194, 220, 0.9)'},
                {key: 'orderNum', theme: '#4141e9', themeStart: 'rgba(65, 65, 233, 0.3)', themeEnd: 'rgba(65, 65, 233, 0.9)'}
            ],
            orderSeriesTheme: [
                {key: 'salesCount', theme: '#419eff', themeStart: 'rgba(65, 158, 255, 0.3)', themeEnd: 'rgba(65, 158, 255, 0.9)'},
                {key: 'purchaseCount', theme: '#24c2dc', themeStart: 'rgba(36, 194, 220, 0.3)', themeEnd: 'rgba(36, 194, 220, 0.9)'},
                {key: 'salesAmount', theme: '#4141e9', themeStart: 'rgba(65, 65, 233, 0.3)', themeEnd: 'rgba(65, 65, 233, 0.9)'},
                {key: 'purchaseAmount', theme: '#0b00a9', themeStart: 'rgba(11, 0, 169, 0.3)', themeEnd: 'rgba(11, 0, 169, 0.9)'}
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
            },
            updateTIme: '',
            tenantId: 0
        }
    },
    created () {
        this.loadShopList();
    },
    watch: {
      timeRange(newRange) {
        if (newRange && newRange.length === 2) {
            this.dateRangeTime = ''
            this.beginTime =  this.$moment(newRange[0]).format('YYYY-MM-DD HH:mm:ss')
            this.endTime = this.$moment(newRange[1]).format('YYYY-MM-DD HH:mm:ss')
        } else if(!newRange&&this.dateRangeTime==''){
            this.beginTime  = ''
            this.endTime = ''
        }
        console.log(this.beginTime,this.endTime,234567)
        this.getWorkData();
      }
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
            my: state => state.user.my
        }),
        ...mapGetters([
            'userInfo',
            'isCollapse',
            'permissions',
            'siteConfig'
        ]),
    },
    methods: {
        //商家端接口
        formattedDate(val) {
            const year = val.substring(0, 4);
            const month = val.substring(4, 6);
            const day = val.substring(6, 8);
            return `${year}-${month}-${day}`;
        },
        formatFixed(val){
            return val.toFixed(2);
        },
        checkChange(val){
            this.checkList = val;
            this.getMain()
        },
        //商家端统计图
        getMain(){
            var myChart = this.$echarts.init(document.getElementById('main'));
            if(this.checkList.length>0){
                this.checkList.forEach((item,index,arr)=>{
                    this.newArr = [];
                    if(this.checkList.indexOf('已拍订单数')!=-1){
                        this.newArr.push(
                            {
                                name: '已拍订单数',
                                type:'line',
                                smooth:true,
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                data:this.List1
                            }
                        )
                    }
                    if(this.checkList.indexOf('抖店实收金额')!=-1){
                        this.newArr.push(
                            {
                                name: '抖店实收金额',
                                type:'line',
                                smooth:true,
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                data:this.List2
                            }
                        )
                    }
                    if(this.checkList.indexOf('采购实付金额')!=-1){
                        this.newArr.push(
                            {
                                name: '采购实付金额',
                                type:'line',
                                smooth:true,
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                data:this.List3
                            }
                        )
                    }
                    if(this.checkList.indexOf('平台补贴')!=-1){
                        this.newArr.push(
                            {
                                name: '平台补贴',
                                type:'line',
                                smooth:true,
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                data:this.List4
                            }
                        )
                    }
                    if(this.checkList.indexOf('预估利润额')!=-1){
                        this.newArr.push(
                            {
                                name: '预估利润额',
                                type:'line',
                                smooth:true,
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                data:this.List5
                            }
                        )
                    }
                    if(this.checkList.indexOf('预估利润率')!=-1){
                        this.newArr.push(
                            {
                                name: '预估利润率',
                                type:'line',
                                smooth:true,
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                data:this.List6
                            }
                        )
                    }
                })
                console.log(this.newArr,321)
            }
            // 图表使用-------------------
            var option = {
                tooltip : {
                    trigger: 'axis',
                    formatter: function (params) {
                        console.log(params,12345);
                        if (params.length > 0) {
                            var result = params[0].name + "<br>";
                            
                            params.forEach(function (item) {
                                if (item.seriesName != "预估利润率") {
                                    result +=
                                    item.marker +
                                    " " +
                                    item.seriesName +
                                    " : " +
                                    item.value +
                                    "</br>";
                                } else if (item.seriesName == "预估利润率") {
                                    result +=
                                    item.marker +
                                    " " +
                                    item.seriesName +
                                    " : " +
                                    item.value +
                                    "%</br>";
                                }
                            });
                            return result;
                        }
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : this.dataList
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : this.newArr
            };
            myChart.setOption(option,true);
        },
        getWorkData() {
            getWorkData({
                shopIds: this.shopId,
                beginTime: this.beginTime,
                endTime: this.endTime
            }).then(response => {
                this.tableData = response.data.data;
                this.sum1 = this.tableData.reduce((prev, curr) => {
                    return prev + curr.alreadyOrderNumTotal
                }, 0)
                this.sum2 = this.tableData.reduce((prev, curr) => {
                    return prev + (curr.actualCollectAmtTotal/100)
                }, 0)
                this.sum3 = this.tableData.reduce((prev, curr) => {
                    return prev + (curr.purchasePayAmtTotal/100)
                }, 0)
                this.sum4 = this.tableData.reduce((prev, curr) => {
                    return prev + (curr.subsidyAmtTotal/100)
                }, 0)
                this.sum5 = this.tableData.reduce((prev, curr) => {
                    return prev + ((curr.actualCollectAmtTotal - curr.purchasePayAmtTotal)/100)
                }, 0)
                if(this.tableData.length>0&&this.sum5>0&&this.sum3>0){
                    this.sum6 = ((this.sum5/this.sum3) * 100).toFixed(2) +'%'
                } else {
                    this.sum6 = 0
                }
                this.List1 = [];
                this.List2 = [];
                this.List3 = [];
                this.List4 = [];
                this.List5 = [];
                this.List6 = [];
                this.dataList = [];
                this.tableData.forEach((item,index,arr)=>{
                    this.List1.push(item.alreadyOrderNumTotal);
                    this.List2.push(this.formatFixed(item.actualCollectAmtTotal/100));
                    this.List3.push(this.formatFixed(item.purchasePayAmtTotal/100));
                    this.List4.push(this.formatFixed(item.subsidyAmtTotal/100));
                    this.List5.push(this.formatFixed((item.actualCollectAmtTotal - item.purchasePayAmtTotal)/100));
                    this.List6.push(this.formatFixed(((item.actualCollectAmtTotal - item.purchasePayAmtTotal)/100) / (item.purchasePayAmtTotal/100) * 100));
                    this.dataList.push(this.formattedDate(item.time))
                })
                console.log(this.dataList,23)
                this.$nextTick(()=>{
                    this.getMain();
                })
            }).catch(() => {})
        },
        formatDate(val) {
            const date = new Date(val);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },
        dateRangeChange (val) {
            this.timeRange = null
            this.beginTime = this.formatDate(new Date().setHours(0, 0, 0, 0));
            this.endTime = this.formatDate(new Date());
            if (val=='实时') {
                this.beginTime = this.formatDate(new Date().setHours(0, 0, 0, 0));
                this.endTime = this.formatDate(new Date());
                this.getWorkData();
            } 
            if (val=='7日') {
                this.beginTime = this.formatDate(new Date(this.beginTime).setDate(new Date(this.beginTime).getDate() - 7));
                this.getWorkData();
            } 
            if (val=='30日') {
                this.beginTime = this.formatDate(new Date(this.beginTime).setDate(new Date(this.beginTime).getDate() - 30));
                this.getWorkData();
            }
        },
        // 商家端接口
        async fetchData(loading = 'loading') {
            const arr = [
                await this.$API.getAccountPoints(),
            ]
            Promise.all(arr).then(res => {
                // 账号积分统计
                if (res[0]) {
                    this.userData = res[0].data.data;
                    console.log(this.userData ,'userData')
                }
            }).catch((err) => {
				// 捕获异常判断是否需要验证二级密码
				if (err.code === 50050 || err.msg === 'requiresSecondPwd') {
					this.openDialog = true;
				}
			});
            // 等待同步任务处理完，再更改加载状态
            if (this.firstLoading) {
                setTimeout(() => {
                    this.firstLoading = false;
                }, 0);
            }
            this[loading] = false;
        },
        //选择店铺
        onShopIdChange: debounce(function (val) {
            this.shopId = val
            this.getWorkData();
        }, 500),
        // 查询当前商家的店铺列表是否有授权过期的店铺
        async loadMerchantInfo () {
            const h = this.$createElement;
            const { data: { data } } = await loadMerchantInfo({useId: this.userInfo.id})
            try {
                const expireLength = data.filter(item => item.authStatus == 0)
                if (expireLength.length) {
                    const notify = this.$notify({
                        title: '温馨提示',
                        type: 'warning',
                        duration: 10000,
                        message: h('div', null, [
                            '您的店铺授权状态已失效，请前往授权即可使用',
                            h('el-button',{
                                props: {type: 'primary', size: 'mini'},
                                style: {marginLeft: '12px', padding: '5px 10px'},
                                on: {
                                    'click': () => {
                                        this.$router.push('/dfh/shop/index')
                                        notify.close()
                                    }
                                }
                            }, '去授权')
                        ])
                    });
                }
            } catch (error) {
                console.log('error', error)
            }
        },
        onDashboardExport () {
            this.fullscreenLoading = true
            const params = this.form
            this.$API.exportDashboard(params).then(res => {
                console.log(res);
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

        //以下为管理端接口及处理
        // 管理端接口
        async fetchisAdminData () {
            this.initDataBoard()
            this.initPointData()
            this.initVipData()
            this.initOrderData()
            this.initSiteList()
        },
        // 顶部数据统计
        async initDataBoard () {
            this.adminLoading.board = true
            const { data } = await this.$API.getRealTimeDataBoard({})
            this.adminData.board = data.data
            this.adminLoading.board = false
        },
        // 处理出曲线图x轴坐标出来
        initXAxis (items) {
            console.log('items', items)
            const data = items.map(item => {
                return item.createTime ? this.$moment(item.createTime).format('MM-DD') : '-'
            })
            console.log('items', data)
            return data
        },
        // 积分充值记录图表
        async initPointData () {
            let today = false
            const params = {
                dateRange: this.adminForm.pointDateVal
            }
            if (this.adminForm.pointCreateTimeArr) {
                params['createTimeArr'] = [`${this.adminForm.pointCreateTimeArr[0]} 00:00:00`, `${this.adminForm.pointCreateTimeArr[1]} 23:59:59`]
                today = this.adminForm.pointCreateTimeArr[0] == this.adminForm.pointCreateTimeArr[1]
            }
            this.adminLoading.point = true
            const { data } = await this.$API.getInitPointData(params)
            this.adminLoading.point = false
            console.log('initPointData', data)
            let xAxisData = this.adminForm.pointDateVal == 1 || today ? HOURS : this.initXAxis(data.data)
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
        async initVipData () {
            this.adminLoading.vip = true
            const { data } = await this.$API.getInitVipData({})
            console.log('initVipData', data)
            let vipCount = 0
            const option = {
                legend: data.data.map(item => {return {name: item.memberName, icon: 'circle'} }),
                data: data.data.map(item => {return {name: item.memberName, value: item.memberNum || 0} }),
            }
            data.data.forEach(item => {
                vipCount += item.memberNum || 0
            })
            this.$refs.vipChart.initData(option)
            this.adminData.vipCount = vipCount
            this.adminLoading.vip = false

        },
        // 订单统计
        async initOrderData () {
            let today = false
            const params = {
                dateRange: this.adminForm.orderDateVal,
                ...this.form
            }
            if (this.adminForm.orderCreateTimeArr) {
                params['createTimeArr'] = [`${this.adminForm.orderCreateTimeArr[0]} 00:00:00`, `${this.adminForm.orderCreateTimeArr[1]} 23:59:59`]
                today = this.adminForm.orderCreateTimeArr[0] == this.adminForm.orderCreateTimeArr[1]
            }
            this.adminLoading.order = true
            const { data } = await this.$API.getAdminOrderInfo(params)
            console.log('initorderData', data)
            let xAxisData = this.adminForm.orderDateVal == 1 || today ? HOURS : this.initXAxis(data.data)
            const legendData = ['销售订单数', '采购订单数', '销售金额', '采购金额']
            const option = {
                legendData: legendData,
                xAxisData: xAxisData,
                series: legendData.map((item, index) => {
                    return {
                        ...this.orderSeriesTheme[index],
                        name: item,
                        values: data.data.map(value => value[this.orderSeriesTheme[index].key])
                    }
                })
            }
            console.log('option', option)
            this.$refs.orderChart.initData(option)
            this.adminLoading.order = false
        },
        // 获取对应的商家的店铺
        async loadShopList (params) {
            const { data } = await this.$API.getShopList(params)
            this.shopList = data.data || []
            console.log(this.shopList,'this.shopList');
        },
        // 获取站点列表
        async initSiteList () {
            const { data } = await this.$API.fetchSitesTree()
            console.log('fetchSitesTree', data)
            this.sitesOptions = data.data.map((v) => {
                return this.sum(v)
            })
        },
        // 商家列表
        async initMerchantList () {
            const { data } = await this.$API.fetchMerchantList({tenantId: this.form.tenantId})
            console.log('initMerchantList', data)
            this.merchantOptions = data.data.records
        },
        // 积分充值记录时间筛选
        dateRangePointChange (val) {
            let dateRange = 1;
            switch (val) {
                case '今日':
                    dateRange = 1;
                    break;
                case '本周':
                    dateRange = 2;
                    break;
                case '本月':
                    dateRange = 3;
                    break;
                case '选择日期':
                    dateRange = 4;
                    break;
            }
            this.adminForm.pointDateRange = val
            this.adminForm.pointDateVal = dateRange
            this.adminForm.pointCreateTimeArr = null
            this.initPointData()
        },
        // 积分充值记录时间自定义
        onAdminPointChange (val) {
            console.log('val', val)
            if (val) {
                this.adminForm.pointDateRange = '选择日期'
                this.adminForm.pointDateVal = 4
            } else {
                this.adminForm.pointDateRange = '今日'
                this.adminForm.pointDateVal = 1
            }
            this.initPointData()
        },
        // 订单统计时间筛选
        dateRangeOrderChange (val) {
            let dateRange = 1;
            switch (val) {
                case '今日':
                    dateRange = 1;
                    break;
                case '本周':
                    dateRange = 2;
                    break;
                case '本月':
                    dateRange = 3;
                    break;
                case '选择日期':
                    dateRange = 4;
                    break;
            }
            this.adminForm.orderDateRange = val
            this.adminForm.orderDateVal = dateRange
            this.adminForm.orderCreateTimeArr = null
            this.initOrderData()
        },
        // 积分充值记录时间自定义
        onAdminOrderChange (val) {
            console.log('val', val)
            if (val) {
                this.adminForm.orderDateRange = '选择日期'
                this.adminForm.orderDateVal = 4
            } else {
                this.adminForm.orderDateRange = '今日'
                this.adminForm.orderDateVal = 1
            }
            this.initOrderData()
        },
        // 切换商家
        onMerchantChange () {
            this.form.shopId = ''
            this.loadShopList({userId: this.form.userId})
            this.initOrderData()
        },
        // 选择站点
        selectSite(val) {
            this.form.tenantId = val[val.length - 1] || ''
            this.form.userId = ''
            this.form.shopId = ''
            this.initMerchantList()
            this.initOrderData()
        },
        // 遍历站点层级数据
        sum(e) {
            if (e.children) {
                return {
                    label: e.name,
                    value: e.id,
                    children: e.children.map(v => this.sum(v))
                }
            } else {
                return {
                    label: e.name,
                    value: e.id,
                }
            }
        },

    },
    mounted() {
        this.tenantId = getStore({name: 'tenantId'})
        if (this.permissions.sys_site_view != null && this.permissions.sys_site_view == true) {
            // 管理端接口
            this.isAdmin = true
            this.fetchisAdminData()
        } else {
            // 商家端接口
            this.getWorkData();
            this.fetchData();
            this.loadMerchantInfo()

        }
    },
}
</script>

<style scoped lang="scss">
.el-collapse-item__header {
    display: block !important;
}
.dashboard-contailer {
    position: relative;
    height: calc(100vh - 120px);
    overflow: scroll;
    padding: 0 5px 15px 15px;
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
    .title {
        position: relative;
        padding-left: 13px;
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 20px;
        span {
            font-size: 13px;
            font-weight: normal;
        }
    }
    .title:after {
        content: "";
        position: absolute;
        width: 4px;
        height: 17px;
        background: rgb(70, 180, 109);
        top: -1px;
        left: 0;
    }
    .count-content {
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
        margin-bottom: 15px;
        .count-items {
            .count-item {
                justify-content: center;
                padding: 20px 0;
                border-right: 1px solid #e9ecf7;
                color: #666;
                position: relative;
                .count-icon {
                    flex-basis: 60px;
                    height: 60px;
                    margin-right: 10px;
                    background: url('/img/board/icon_merchant.png') no-repeat;
                    background-size: contain;
                }
                .count {
                    font-size: 24px;
                    font-family: Barlow;
                    margin-bottom: 10px;
                }
                .tip {
                    position: absolute;
                    right: 10px;
                    top: 0;
                    font-size: 12px;
                    span {
                        color: rgb(70, 180, 109);
                    }
                }
                .tip.href {
                    cursor: pointer;
                }
                .tip.href:hover {
                    color: rgb(70, 180, 109);
                }
            }
            .count-item.future {
                .count {
                    color: rgb(70, 180, 109);
                }
            }
            .count-item.delivery {
                .count-icon {
                    background-image: url('/img/board/icon_shop.png');
                }
                .count {
                    color: #eb623b;
                }
            }
            .count-item.manage {
                .count-icon {
                    background-image: url('/img/board/icon_order.png');
                }
                .count {
                    color: #36cfc9;
                }
                
            }
            .count-item.timeout {
                .count-icon {
                    background-image: url('/img/board/icon_profit.png');
                }
                .count {
                    color: #0facd5;
                }
            }
            .count-item.recharge {
                .count-icon {
                    background-image: url('/img/board/icon_recharge.png');
                }
                .count {
                    color: #f09a33;
                }
            }
            .count-item.balance {
                .count-icon {
                    background-image: url('/img/board/icon_balance.png');
                }
                border: 0;
                .count {
                    color: #1f77fe;
                }
            }
        }
    }
    .todo-content {
        padding: 20px;
        box-sizing: border-box;
        margin-bottom: 15px;
        background-color: #fff;
        .todo-item {
            border-radius: 3px;
            box-sizing: border-box;
            cursor: pointer;
            position: relative;
            color: #fff;
            padding: 33px 0;
            .info {
                font-size: 16px;
                text-align: center;
                .count {
                    font-family: Barlow;
                    font-size: 30px;
                    margin-bottom: 20px;
                }
            }
        }
        .todo-item.future {
            background: #FF6B5C url('/img/board/icon_todo_future.png') no-repeat right center;
            background-size: 26%;
        }
        .todo-item.delivery {
            background: rgb(70, 180, 109) url('/img/board/icon_todo_delivery.png') no-repeat right center;
            background-size: 26%;
        }
        .todo-item.manage {
            background: #F3B100 url('/img/board/icon_todo_manage.png') no-repeat right center;
            background-size: 23%;
        }
        .todo-item.timeout {
            background: #37CAC0 url('/img/board/icon_todo_timeout.png') no-repeat right center;
            background-size: 26%;
        }
        .todo-item.recharge {
            background: #f495b5 url('/img/board/icon_todo_timeout.png') no-repeat right center;
            background-size: 26%;
        }
        .todo-item.balance {
            background: #a2aae8 url('/img/board/icon_todo_timeout.png') no-repeat right center;
            background-size: 26%;
        }
    }
    .admin-content {
        display: flex;
        flex-direction: column;
        margin-bottom: 32px;
        min-width: 1240px;
        ::v-deep.el-radio-group {
            transform: translateY(-2px);
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
        .todo-content {
            border-radius: 5px;
            .todo-item {
                padding: 26px 0;
            }
        }
        .point-content {
            .title {
                margin-bottom: 0;
            }
            .point-left {
                background-color: #fff;
                border-radius: 5px;
                .header {
                    border-bottom: 1px solid #ededed;
                    .refresh-btn {
                        .el-button {
                            font-size: 20px;
                            padding: 4px 6px;
                        }
                    }
                    ::v-deep.el-range-separator {
                        width: 10%;
                    }
                }
                .detail {
                    padding: 20px;
                    box-sizing: border-box;
                    height: 400px;
                    width: 100%;
                }
            }
            .point-right {
                width: 500px;
                background-color: #fff;
                border-radius: 5px;
                margin-left: 15px;
                .header {
                    border-bottom: 1px solid #ededed;
                }
                .detail {
                    height: 400px;
                }
            }
        }
        .order-content {
            background-color: #fff;
            border-radius: 5px;
            .header {
                border-bottom: 1px solid #ededed;
                .refresh-btn {
                    .el-button {
                        font-size: 20px;
                        padding: 4px 6px;
                    }
                }
                ::v-deep.el-range-separator {
                    width: 10%;
                }
            }
            .title {
                margin-bottom: 0;
            }
            .title:after {
                top: 6px;
            }
            .detail {
                height: 400px;
            }
        }
    }
}
</style>

<style scoped lang="scss">
// 商家版
.userarea {
    flex-shrink: 0;
    .user {
        display:flex;
        align-items: center;
        .avatar {
            width: 56px;
            height: 56px;
            border-radius: 50%;
        }
        .name {
            margin-left: 16px;
            font-size: 14px;
            color: #000000;
            line-height: 18px;
            div {
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            div:last-child {
                margin-top: 8px;
            }
        }

    }
}

#admin-content {
    display: flex;
    flex-direction: column;
    margin-bottom: 32px;
    min-width: 1240px;
    .title {
        position: relative;
        padding-left: 13px;
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 20px;
        span {
            font-size: 13px;
            font-weight: normal;
        }
    }
    .title:after {
        content: "";
        position: absolute;
        width: 4px;
        height: 17px;
        background: rgb(70, 180, 109);
        top: -1px;
        left: 0;
    }
    .count-content {
        background: #fff;
        padding: 20px;
        border-radius: 5px;
        margin-bottom: 15px;
        .top {
            width: 100%;
            height: 30px;
            .title {
                float: left;
                position: relative;
                line-height: 30px;
                padding-left: 13px;
                font-size: 16px;
                font-weight: 500;
                color: #333;
                margin-bottom: 20px;
            }
            .title:after {
                content: "";
                position: absolute;
                width: 4px;
                height: 17px;
                background: rgb(70, 180, 109);
                top: 6px;
                left: 0;
            }
            .shopCount {
                float: left;
                line-height: 30px;
                font-size: 12px;
                margin-left: 10px;
            }
            .titleTime {
                float: left;
                padding: 0 10px;
                height: 32px;
                line-height: 32px;
                font-size: 12px;
                color: rgb(64,158,255);
                background: rgb(217,236,255);
                text-align: center;
                margin-left: 5px;
            }
            .right {
                float: right;
                padding: 0 10px;
            }
        }
        .count-items {
            margin-top: 30px;
            .count-item {
                width: 100%;
                float: left;
                justify-content: center;
                color: #666;
                position: relative;
                .count-icon {
                    padding: 10px 10px;
                    width: 16%;
                    float: left;
                    background:#fff;
                    margin: 0 4px;
                    border-radius: 5px;
                    box-shadow: 5px 5px 15px 5px rgba(235,235,233, 0.75);
                }
                .count {
                    font-size: 24px;
                    color:#000;
                    font-family: Barlow;
                    margin-bottom: 10px;
                }
                p {
                    font-size: 14px;
                    color: rgb(129,130,125);
                }
            }
        }
    }
}
</style>
