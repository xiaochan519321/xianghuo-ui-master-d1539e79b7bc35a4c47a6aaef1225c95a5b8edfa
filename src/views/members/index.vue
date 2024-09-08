<template>
    <div class="container" v-loading="loading">
        <div class="left">
            <div class="title">
                <div class="title-content">
                    <span class="left1"></span>
                    <span class="left2"></span>
                    <span class="left3"></span>
                    <span>VIP会员特权</span>
                    <span class="right1"></span>
                    <span class="right2"></span>
                    <span class="right3"></span>
                </div>
            </div>
            <div class="logo">
                <img src="@/assets/vip-logo.png" alt="">
            </div>
            <ul class="list">
                <li>
                    <i class="el-icon-check"></i>
                    <div>开通减免供应链拍单费用</div>
                </li>
                <li>
                    <i class="el-icon-check"></i>
                    <div>利润提高67%</div>
                </li>
                <li>
                    <i class="el-icon-check"></i>
                    <div>批发模式成功代发一单3积分</div>
                </li>
                <li>
                    <i class="el-icon-check"></i>
                    <div>全自动支付，自动使用各种优惠卷</div>
                </li>
                <li>
                    <i class="el-icon-check"></i>
                    <div>无需准备采购账号</div>
                </li>
                <li>
                    <i class="el-icon-check"></i>
                    <div>销售环比计算</div>
                </li>
            </ul>
        </div>
        <div class="right">
            <div class="header">
                <div class="h-l">
                    <div class="status">
                        <span>当前账号状态：</span>
                        <span class="block">{{ my.memberRight? my.memberRight.name : '普通用户' }}</span>
                    </div>
                    <div class="info">
                        <template v-if="my.memberRight && my.memberRight.code !=='introduction'">
                            会员有效期至：{{my.rightExpireTime}}
                        </template>
                        <template v-else>
                            账户，仅能使用部分功能，建议您升级会员，体验完整功能
                        </template>
                    </div>
                </div>
                <div class="h-r">
                    <el-button style="width:106px" type="primary" @click.stop="visible = true">
                        卡密兑换
                    </el-button>
                </div>
            </div>
            <div class="content" >
                <div class="card" v-for="(item,index) in cards" :key="index" :style="styles[item.code].bgStyle">
                    <div class="flag" :style="styles[item.code].flagStyle" v-if="item.code === 'introduction'">
                        免费使用
                    </div>
                   <div class="title" :style="styles[item.code].titleStyle">
                    {{ item.name }}
                   </div>
                   <div class="price" :style="styles[item.code].priceStyle">
                        <span>低至</span>
                        <span class="c" v-if="item.code == 'regular'">{{ item.rightpriceVO.onemonthPrice }}</span>
                        <span class="c" v-else>{{ item.rightpriceVO.oneyearPrice }}</span>
                        <span v-if="item.code == 'regular'">元/月</span>
                        <span v-else>元/年</span>
                   </div>
                   <div class="description" :style="styles[item.code].descStyle">
                        <span>{{item.shopLimit +'店铺/'}}</span>
                        <span>{{item.sonLimit +'子账号/'}}</span>
                        <span v-if="item.code == 'regular'">1个月</span>
                        <span v-else>1年</span>
                   </div>
                   <div class="line" :style="styles[item.code].lineStyle" ></div>
                   <template  v-if="item.code !== 'introduction'">
                        <div :class="['button', 'button-' + item.code]" @click="chooseVip(index)" :style="styles[item.code].buttonStyle" v-if="item.code == 'regular'">
                            <span>{{ my && my.memberRight && my.memberRight.id === item.id ? '续费会员' : '升级会员' }}</span>
                        </div>
                        <div :class="['button', 'button-' + item.code]" :style="styles[item.code].buttonStyle" @click="chooseVipOrder(index)" v-else>
                            <span>{{ my && my.memberRight && my.memberRight.id === item.id ? '续费会员' : '升级会员' }}</span>
                        </div>
                   </template>
                </div>
            </div>
            <div class="bottom">
                <div class="h-l">
                    <div class="status">
                        <span>邀请获得会员（最高可获得33天，邀请一人双方即可获得3天个人版会员）</span>
                    </div>
                    <div class="info">
                        备注：(用户是新用户，第一次绑定店铺)邀请达到10人，即可额外获得30天使用时

                    </div>
                </div>
                <div class="h-r">
                    <router-link to="/admin/promote/invite/index">
                        <el-button style="width:106px" type="primary">
                            点击了解
                        </el-button>
                    </router-link>
                </div>
            </div>
            <el-row class="centent" v-if="false">
                <el-col class="card" v-for="(item,index) in cards" :key="index">
                    <div class="title-box">
                        <div class="lbox">
                            <el-image :src="siteConfig.PATH +item.icon" />
                        </div>
                        <div class="rbox">
                            <span class="name">{{ item.name }}</span>
                            <div class="text">
                                <span>{{ item.description }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="price-wrap">
                        <!-- v-if="index !==0" -->
                        <div v-if="item.code != 'introduction'">
                            <span class="price" v-if="item.code == 'regular'">{{ item.rightpriceVO.onemonthPrice }}</span>
                            <span class="price" v-else>{{ item.rightpriceVO.oneyearPrice }}</span>
                            <span v-if="item.code == 'regular'">元/月</span>
                            <span v-else>元/年</span>
                            <div class="line-box">
                                <span class="line"></span>
                            </div>
                            <div class="btn-wrap">
                                <button class="up-btn" @click="chooseVip(index)" v-if="item.code == 'regular'">
                                    <span>{{ my && my.memberRight && my.memberRight.id === item.id ? '续费会员' : '升级会员' }}</span>
                                </button>
                                <button class="up-btn" @click="chooseVipOrder(index)" v-else>
                                    <span>{{ my && my.memberRight && my.memberRight.id === item.id ? '续费会员' : '升级会员' }}</span>
                                </button>
                            </div>
                        </div>

                        <div class="flex justify-center pt45" v-if="item.code == 'introduction'">
                            <span class="free">免费使用</span>
                            <div class="line-box">
                                <span class="line"></span>
                            </div>
                        </div>
                    </div>

                    <div class="descr">
                        <div class="cell" v-if="item.code !== 'introduction'">
                            <span class="highlight text">开通减免供应链拍单费用</span>
                        </div>
                        <div class="cell">
                            <div class="highlight text">
                                <span>{{item.shopLimit +'店铺/'}}</span>
                                <span>{{item.sonLimit +'子账号/'}}</span>
                                <span v-if="item.code == 'regular'">1个月</span>
                                <span v-else>1年</span>
                            </div>
                        </div>
                        <div class="cell">
                            <span class="highlight text">利润提高{{ (item.couponsCommissionRatio/(100-item.couponsCommissionRatio) * 100).toFixed(0) }}%</span>
                        </div>
                        <div class="cell">
                            <!-- <span class="highlight text">每领取1元优惠券，扣{{ 10*(1-item.couponsCommissionRatio/100) }}积分</span> -->
                            <span class="highlight text">批发模式成功代发一单3积分</span>
                        </div>
                        <div class="cell">
                            <span class="text">全自动支付，自动使用各种优惠卷</span>
                        </div>
                        <div class="cell">
                            <span class="text">无需准备采购账号</span>
                        </div>
                        <div class="cell">
                            <span class="text">销售环比计算</span>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div class="bottom" v-if="false">
                <div class="lbox">
                    <div class="title">邀请获得会员（最高可获得33天）</div>
                    <div class="text1 pt25">
                        <span>邀请一人双方即可获得3天个人版会员</span>
                    
                    </div>
                    <div class="text2 pt25">
                        <span class="highlight">(用户是新用户，第一次绑定店铺)</span>
                        <span class="highlight">邀请达到10人，即可额外获得30天使用时</span>
                    </div>
                </div>
                <div class="rbox">
                    <button class="details">点击了解</button>
                </div>
            </div>
        </div>

        <dialog-pay
            :loading="dialogPayLoading"
            :visible="visibleDialogPay"
            :data="obj"
            @close="dialogPayClose"
        ></dialog-pay>
        <dialog-cd-key
            :visible="visible"
            @close="visible = false"
            @success="$store.dispatch('GetMy')"
        ></dialog-cd-key>
        <el-dialog
            title="请选择期限"
            :visible.sync="dialogVisible"
            width="20%"
            :before-close="closeDialog">
                <div>
                    <el-radio-group v-model="openingTime" size="small">
                    <el-radio label="month" border>月卡</el-radio>
                    <el-radio label="quarter" border disabled>季卡</el-radio>
                    <el-radio label="halfyear" border disabled>半年</el-radio>
                    </el-radio-group>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onClick(0)">确 定</el-button>
            </span>
        </el-dialog>
        <DialogTip ref="tips" @success="onCloseTip"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DialogCdKey from "./components/DialogCdKey";
import DialogPay from "@/components/dialog/DialogPay";
import { getStore } from '@/util/store'
import DialogTip from '../recharge/components/DialogTip'


export default {
    components: {
        DialogCdKey,
        DialogPay,
        DialogTip
    },
    data() {
        return {
            loading: true,
            cards: [],
            dialogPayLoading: true,
            visibleDialogPay: false,
            obj: {},
            payOrderId: null,
            timerID: null,
            // 订单生成(0),支付成功(1)
            payGoodsOrderStatus: 0,
            dialogVisible: false,
            visible: false,
            openingTime: "month",
            tenantId: 0,
            styles: {
                //个人版
                regular: {
                    bgStyle: 'background: linear-gradient(90deg, #FFF9F1 0%, #FEEFDD 100%);',
                    titleStyle: 'color: #B57435;',
                    priceStyle: 'color: #FF3306',
                    descStyle: 'color: #B57435',
                    lineStyle: 'background: #B57435;',
                    buttonStyle: `
                        background: linear-gradient(101deg, #FFE5CE 0%, #FFB06A 100%);
                        color: #B57435;
                    `,
                    flagStyle: `
                        background: #FFF3DE;
                        box-shadow: 0px 2px 4px 0px #FFE6BA;
                        color: #B57435
                    `

                },  
                //旗舰版
                personal: {
                    bgStyle: 'background: linear-gradient(121deg, #E3EEFF 0%, #A3CEFF 100%);',
                    titleStyle: 'color: #326BC0;',
                    priceStyle: 'color: #004392',
                    descStyle: 'color: #326BC0',
                    lineStyle: 'background: #326BC0;',
                    buttonStyle: `
                        background: linear-gradient(101deg, #DAE9FF 0%, #A9D1FF 100%);
                        color: #004392;
                    `,
                    flagStyle: `
                    background: #DAEAFF;
                    box-shadow: 0px 2px 4px 0px rgba(146,178,220,0.8);
                    color: #326BC0;
                    `
                },
                //团队版
                team: {
                    bgStyle: 'background: linear-gradient(90deg, #FCCCC0 0%, #FF9780 100%);',
                    titleStyle: 'color: #FFFFFF;',
                    priceStyle: 'color: #FFFFFF',
                    descStyle: 'color: #FFFFFF',
                    lineStyle: 'background: #FFFFFF;',
                    buttonStyle: `
                        background: linear-gradient(101deg, #FDC6B8 0%, rgba(255,51,6,0.55) 100%);
                        color: #ffffff;
                    `,
                    flagStyle: `
                        background: #FF6948;
                        box-shadow: 0px 2px 4px 0px rgba(203,65,22,0.8);
                        color:#FFF
                    `
                },
                //企业版
                enterprise: {
                    bgStyle: 'background: linear-gradient(90deg, #F7F3FF 0%, #D1ABFF 100%);',
                    titleStyle: 'color: #8167FF;',
                    priceStyle: 'color: #8167FF',
                    descStyle: 'color: #8167FF',
                    lineStyle: 'background: #8167FF;',
                    buttonStyle: `
                        background: linear-gradient(101deg, #F7F2FF 0%, #EAD9FF 100%);
                        color: #8167FF;
                    `,
                    flagStyle: `
                        background: #BCAEFF;
                        box-shadow: 0px 2px 4px 0px #B7A8FF;
                        color: #8167FF
                    `
                }

            }
        };
    },
    computed: {
        ...mapGetters([
            'siteConfig',
            'my'
        ]),
        /**
         * 返回不同的 获取拍单优惠卷利润
         */
        returnPercentage(index) {
            return (index) => {
                switch (index) {
                    case 0:
                        return '获取拍单优惠卷利润20%';
                        break;
                    case 1:
                        return '获取拍单优惠卷利润30%';
                        break;
                    case 2:
                        return '获取拍单优惠卷利润40%';
                        break;
                    case 3:
                        return '获取拍单优惠卷利润50%';
                        break;
                }
            };
        },
    },
    mounted() {
        this.fetchData();
        this.tenantId = getStore({name: 'tenantId'})
    },
    beforeDestroy() {
        this.resetTimerAndOrderStatus();
    },
    methods: {
        /**
         * 获取会员权益列表
         */
        async fetchData() {
            this.loading = true;
            try {
                const { data: { data } } = await this.$API.getMemberRightsList();
                this.cards = data;
                console.log(this.cards)
                // this.cards[0].code = 'introduction'
            } finally {
                this.loading = false;
            }
        },
        handleClose(done) {
            this.openingTime = "year";
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        chooseVip () {
            console.log('vip')
            // 判断是否为主站，则提醒
            if (this.tenantId == 1) {
                this.$refs.tips.showEdit('month')
            } else {
                this.chooseLimit()
            }
        },
        async chooseLimit(){
             this.openingTime = "month";
            this.dialogVisible = true;
        },
        chooseVipOrder (index) {
            console.log('chooseVipOrder')
            // 判断是否为主站，则提醒
            if (this.tenantId == 1) {
                this.$refs.tips.showEdit(index)
            } else {
                this.onClick(index)
            }
        },
        /**
         * 获取开通会员订单
         */
        async onClick(index) {
            this.dialogVisible = false;
            this.visibleDialogPay = true;
            this.dialogPayLoading = true;
            console.log(this.openingTime);
            console.log(this.cards[index].code);

            if(this.cards[index].code == "regular"){
                if(this.openingTime == "year" ||this.openingTime == ''){
                    this.openingTime = "month";
                }
            }else{
                this.openingTime = "year";
            }
            try {
                const { data } = await this.$API.createPayOrder({
                    goodsType: 2,
                    rightId: this.cards[index].id,
                    openingTime: this.openingTime
                });
                this.openingTime = "year";
                this.obj = data;
                this.payOrderId = data.goods.payOrderId;
                this.startTimer();
            } finally {
                this.dialogPayLoading = false;
            }
        },
        // 关闭提醒弹窗时回调
        onCloseTip (tag) {
            if (tag == 'month') {
                this.chooseLimit()
            } else {
                this.onClick(tag)
            }
        },
        /**
         * 定时器 支付状态轮询
         */
        startTimer() {
            clearInterval(this.timerID);
            this.timerID = setInterval(() => {
                // 订单生成(0),支付成功(1)
                switch (this.payGoodsOrderStatus) {
                    case 0:
                        this.getPayOrderStatus();
                        break;
                    case 1:
                        this.$message.success('支付成功！');
                        this.visibleDialogPay = false;
                        this.resetTimerAndOrderStatus();
                        this.fetchData();
                        break;
                    case -1:
                        this.$message.error('支付失败，请刷新页面重试');
                        this.resetTimerAndOrderStatus();
                        break;
                    default:
                        break;
                }
            }, 2000);
        },
        /**
         * 获取 支付订单状态
         */
        async getPayOrderStatus() {
            const { payOrderId } = this;
            const { data } = await this.$API.getPayOrderStatus(payOrderId);
            this.payGoodsOrderStatus = +data.data.status;
            if (this.payGoodsOrderStatus === 1) this.$store.dispatch('GetMy');
        },
        /**
        * 重置定时器以及相关状态
        */
        resetTimerAndOrderStatus() {
            clearInterval(this.timerID);
            this.payGoodsOrderStatus = 0;
        },
        /**
        * 关闭 支付弹窗，销毁定时器
        */
        dialogPayClose() {
            this.visibleDialogPay = false;
            this.resetTimerAndOrderStatus();
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    // padding-bottom: 93px;
    display: flex;
    .left {
        width: 328px;
        border-radius: 12px 12px 12px 12px; 
        background: linear-gradient(180deg, #FFF5E7 0%, #FFEBCA 100%);
        .title {
            margin-top: 36px;
            display: flex;
            justify-content: center;
            .title-content {
                font-size: 30px;
                font-weight: 800;
                color: #B57435;
                text-align: center;
                position: relative;
                
                .left1, .left2, .left3 ,.right1, .right2, .right3 {
                    position: absolute;
                    width: 10px;
                    height: 1px;
                    background: #B57435;
                }
                .left1 {
                    width: 10px;
                    left: -20px;
                    bottom: 10px;

                }
                .left2 {
                    width: 20px;
                    left: -30px;
                    bottom: 6px;
                }
                .left3 {
                    width: 16px;
                    left: -24px;
                    bottom: 2px;
                }
                .right1 {
                    width: 10px;
                    right: -20px;
                    bottom: 10px; 
                }
                .right2 {
                    width: 20px;
                    right: -30px;
                    bottom: 6px;
                }
                .right3 {
                    width: 16px;
                    right: -24px;
                    bottom: 2px;
                }
            }
            

        }
        .logo {
            margin-top: 36px;
            width: 100%;
            img {
                width: 100%;
            }
        }
        .list{
            margin-top: 60px;
            li {
                padding-left: 42px;
                font-size: 14px;
                color: #B57435;
                margin-bottom: 30px;
                font-weight: bold;
                display: flex;
                align-items: center;
                i {
                    font-size: 18px;
                    font-weight: bold;
                    margin-right: 12px;
                    color: #B57435;
                }
            }
        }
    }
    .right {
        margin-left: 16px;
        flex: 1;
        
        .header {
            height: 80px;
            background: #FFFFFF;
            border-radius: 8px 8px 8px 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 16px;
            padding-right: 24px;
            .h-l {

                .status {
                    font-size: 14px;
                    color: #000000;
                    line-height: 14px;
                    .block {
                        padding: 2px 7px;
                        background: rgba(47,81,255,0.15);
                        border-radius: 4px 4px 4px 4px;
                        border: 1px solid #2F51FF;
                        font-size: 12px;
                        color: #2F51FF;
                    }
                }
                .info {
                    font-size: 12px;
                    color: #EB5E12;
                    line-height: 12px;
                    margin-top: 13px;
                }
            }
        }
        .content {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .card {
                margin-top: 16px;
                width: calc(50% - 10px);
                height: 286px;
                border-radius: 12px 12px 12px 12px;
                overflow: hidden;
                cursor: pointer;
                background: pink;
                position: relative;
                .flag {
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    width: 100px;
                    height: 24px;
                    line-height: 24px;
                    font-size: 14px;
                    text-align: center;
                    background: blue;
                    border-bottom-right-radius: 24px;
                }
                .title {
                    font-size: 30px;
                    font-weight: 800;
                    margin-top: 30px;
                    text-align: center;
                }
                .price {
                    font-size: 14px;
                    color: #004392;
                    line-height: 14px;
                    margin-top: 36px;
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    font-weight: bold;
                    .c {
                        font-size:50px ;
                       
                        line-height: 35px;
                        margin: 0 10px;
                    }
                }
                .description {
                    margin-top: 36px;
                    font-size: 14px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: bold;
                    color: #B57435;
                    line-height: 14px;
                    text-align: center;
                }
                .line {
                    width: 296px;
                    height: 1px;
                    margin: 32px auto 0;
                    background: red;
                }
                .button {
                    width: 120px;
                    height: 40px;
                    background: linear-gradient(101deg, #FFE5CE 0%, #FFB06A 100%);
                    border-radius: 40px ;
                    text-align: center;
                    line-height: 40px;
                    margin: 20px auto 0;
                    font-size: 14px;    
                    color: #B57435;
                    text-align: center;
                    &-regular {
                        box-shadow: 0px 1px 3px 0px #FFBD82;
                    }
                    &-personal {
                        box-shadow: 0px 1px 3px 0px #3B70B7;
                    }
                    &-team {
                        box-shadow: 0px 1px 3px 0px #D95A3D;
                    }
                    &-enterprise {
                        box-shadow: 0px 1px 3px 0px #BCAEFF;
                    }


                }
            }
        }
        .bottom{
            @extend .header;
            height: 104px;
            margin-top: 16px;
        }
    }
}

</style>
