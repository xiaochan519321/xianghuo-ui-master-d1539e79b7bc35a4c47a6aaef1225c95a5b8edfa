<template>
    <!-- <div class="recharge-index-pages-container">
        <div class="balance-box cards" v-loading="loading">
            <p class="h-title">积分余额</p>
            <div>
                <div class="flex items-center mt40">
                    <p class="account">
                        <span>用户账号：{{ merchantInfo.phone }}</span>
                    </p>
                    <p class="ml90 account flex items-center">
                        <span>积分余额：</span>
                        <span class="balance">{{ merchantInfo.integral || 0 }}</span>
                    </p>
                </div>
                <div class="flex items-center mt40">
                    <p class="desc">
                        <span>积分是平台的价值流通货币，可用于代发下单抵扣，积分兑换比值是</span>
                        <span class="highlight">1元等于10积分</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="recharge-box cards mt20">
            <p class="h-title">
                <span>充值</span>
                <span class="tip">（每充值500元，可以增加一个店铺授权）</span>
            </p>
            <div class="box-border flex justify-between mt50">
                <div
                    :class="`item-cell pt70 ${selected === index && 'active'}`"
                    v-for="(item, index) in list"
                    :key="index"
                    @click="selectItem(index)"
                >
                    <div class="label-wrap" v-if="index === 0">
                        <span class="label">新用户尝鲜价格</span>
                    </div>
                    <p>
                        <span class="font30">¥</span>
                        <span class="font40">{{ item.amount }}</span>
                    </p>
                    <p class="font24 mt30 giving">
                        <span>{{ item.giving }}</span>
                    </p>
                    <p class="mt50 font16">
                        <span class="text">充值{{ item.amount }}=</span>
                        <span class="text">{{ item.integral }}</span>
                        <span class="text">积分</span>
                    </p>
                </div>
                <div
                    v-if="tenantId != 1"
                    :class="`item-cell flex items-center justify-center ${selected === 6 && 'active'}`"
                    @click="selectItem(6)"
                >
                    <span class="font30">自定义金额</span>
                </div>
            </div>
            <p class="mt30 text-center tags">
                <span>注意：如充值积分，或购买机器人属于虚拟商品，一经购买概不退还</span>
            </p>
            <div class="mt50 flex justify-center relative pb40">
                <div class="price-box">
                    <div class="flex items-center">
                        <span class="font20">应付金额</span>
                        <p class="ml30 highlight price">
                            <span class="font30">¥</span>
                            <span class="font40">{{ form.amount }}</span>
                        </p>
                    </div>
                    <p class="text-right mt15">付款后积分会到您的账户</p>
                </div>
                <el-button class="confirm" @click.stop="onPay">立即支付</el-button>
            </div>
        </div>
        <div class="list cards mt20">
            <p class="h-title">充值记录</p>
            <div class="table-main mt20">
                <div class="mb20 flex flex-row-reverse">
                    <div class="flex items-center">
                        <span>订单状态：</span>
                        <el-select v-model="params.status" placeholder="请选择" @change="getData(1)">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                </div>
                <el-table-custom
                    :columns="columns"
                    :data="tableData"
                    :loading="tableLoading"
                    :options="{
                        currentPage: params.current,
                        pageSize: params.size,
                        total: total,
                        layout: 'total, sizes, prev, pager, next, jumper',
                    }"
                    :size-change="onSizeChange"
                    :current-change="onCurrentChange"
                    border
                    pagination
                ></el-table-custom>
            </div>
        </div>
        <dialog-custom-price
            :visible="visibleDialogCustomPrice"
            @close="visibleDialogCustomPrice =false"
            @onPay="onPay"
        ></dialog-custom-price>
        <dialog-pay
            :loading="dialogPayLoading"
            :visible="visibleDialogPay"
            :data="obj"
            @close="dialogPayClose"
        ></dialog-pay>
        <DialogTip ref="tips"/>
    </div> -->
    <div class="recharge-index-pages-container">
        <div class="balance-box cards">
            <p class="h-title">积分余额</p>
            <div>
                <div class="flex items-center mt40">
                    <p class="account">
                        <span>用户账号：{{ merchantInfo.phone }}</span>
                    </p>
                    <p class="ml90 account flex items-center">
                        <span>积分余额：</span>
                        <span class="balance">{{ merchantInfo.integral || 0 }}</span>
                    </p>
                </div>
                <div class="flex items-center mt40">
                    <p class="desc">
                        <span>积分是平台的价值流通货币，可用于代发下单抵扣，积分兑换比值是</span>
                        <span class="highlight">1元等于10积分</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="recharge-box cards mt20">
            <p class="h-title">
                <span>充值积分</span>
                <span class="tip">（注意：该产品为虚拟产品，一旦充值不予退款）</span>
            </p>
            <div class="box-border flex justify-between mt50">
                <div
                    :class="`item-cell pt70 ${selected === index && 'active'}`"
                    v-for="(item, index) in list"
                    :key="index"
                    @click="selectItem(index)"
                >
                    <p>
                        <span class="font30">¥</span>
                        <span class="font40">{{ item.amount }}</span>
                    </p>
                    <p class="mt50 font16">
                        <span class="text">充值{{ item.amount }}=</span>
                        <span class="text">{{ item.integral }}</span>
                        <span class="text">积分</span>
                    </p>
                </div>
            </div>
            <div class="mt50 flex justify-center relative pb40">
                <div class="price-box">
                    <div class="flex items-center">
                        <span class="font20">应付金额</span>
                        <p class="ml30 highlight price">
                            <span class="font30">¥</span>
                            <span class="font40">{{ amt }}</span>
                        </p>
                    </div>
                </div>
                <el-button class="confirm" @click.stop="onPay">立即支付</el-button>
            </div>
        </div>
    </div>
</template>

<!-- <script>
import { mapGetters } from 'vuex';
import DialogCustomPrice from "./components/DialogCustomPrice";
import DialogPay from "./components/DialogPay";
import ElTableCustom from '@/components/base/ElTableCustom';
import { getStore } from '@/util/store'
import DialogTip from './components/DialogTip'

export default {
    components: {
        DialogCustomPrice,
        DialogPay,
        ElTableCustom,
        DialogTip
    },
    data() {
        return {
            loading: true,
            visibleDialogCustomPrice: false,
            visibleDialogPay: false,
            dialogPayLoading: true,
            merchantInfo: {},
            list: [
                {
                    amount: 100,
                    giving: '赠送0元',
                    integral: 1000,
                },
                {
                    amount: 500,
                    giving: '赠送10元',
                    integral: 5100,
                },
                {
                    amount: 1000,
                    giving: '赠送30元',
                    integral: 10300,
                }, {
                    amount: 5000,
                    giving: '赠送150元',
                    integral: 51500,
                }, {
                    amount: 20000,
                    giving: '赠送1000元',
                    integral: 210000,
                }, {
                    amount: 50000,
                    giving: '赠送3000元',
                    integral: 530000,
                },
            ],
            selected: 0,
            amount: 100,
            obj: {},
            // 创建支付订单
            form: {
                amount: 100,
                goodsType: '1',
            },
            payOrderId: null,
            timerID: null,
            // 订单生成(0),支付成功(1)
            payGoodsOrderStatus: 0,

            tableData: [],
            columns: [
                {
                    type: 'index',
                    label: '序号',
                    width: '100px',
                }, {
                    key: 'goodsOrderId',
                    label: '订单号',
                }, {
                    key: 'status',
                    label: '订单状态',
                    formatter: (row) => {
                        switch (+row.status) {
                            case 0: return '待支付';
                            case 1: return '支付完成';
                            case 2: return '处理完成';
                            case -1: return '处理失败';
                            default:
                                break;
                        }
                    },
                }, {
                    key: 'goodsName',
                    label: '充值类型',
                }, {
                    key: 'amount',
                    label: '充值金额',
                    formatter: (row) => {
                        return Math.floor(row.amount / 100);
                    },
                }, {
                    key: 'createTime',
                    label: '充值时间',
                },
            ],
            params: {
                current: 1,
                size: 10,
                goodsType: 1,
                status: '',
                'page.orderBy': 'create_time desc',
            },
            total: 0,
            tableLoading: false,

            options: [
                {
                    value: '',
                    label: '全部',
                }, {
                    value: '0',
                    label: '待支付',
                }, {
                    value: '1',
                    label: '支付完成',
                }, {
                    value: '2',
                    label: '处理完成',
                }, {
                    value: '-1',
                    label: '处理失败',
                },
            ],
            tenantId: 0
        };
    },
    computed: {
        ...mapGetters([
            'my'
        ]),
    },
    created() {
    },
    mounted() {
        this.fetchData();
        this.getData();
        // 主站的时候不开放充值 id为1
        this.tenantId = getStore({name: 'tenantId'})
        console.log('tenantId', this.tenantId)
        // if (this.tenantId == 1) {this.$refs.tips.showEdit()}
    },
    beforeDestroy() {
        this.resetTimerAndOrderStatus();
    },
    methods: {
        selectItem(index) {
            this.selected = index;
            if (index === 6) return this.visibleDialogCustomPrice = true;
            this.form.amount = this.list[index].amount;
        },
        /**
         * 获取商家积分信息
         */
        fetchData() {
            this.loading = false;
            this.$API.getMerchantInfo().then(({ data }) => {
                this.merchantInfo = data.data;
                this.loading = false;
            });
        },
        onPay(e, price) {
            // 如果传入了价格，就是自定义价格
            if (price) {
                this.visibleDialogCustomPrice = false;
                this.form.amount = price;
            }
            this.visibleDialogPay = true;
            this.dialogPayLoading = true;
            const obj = { ...this.form };
            this.$API.createPayOrder(obj).then(datas => {
                this.obj = datas.data;
                this.payOrderId = datas.data.goods.payOrderId;
                this.dialogPayLoading = false;
                this.startTimer();
            });
        },
        /** 定时器 支付状态轮询 */
        startTimer() {
            clearInterval(this.timerID);
            this.timerID = setInterval(() => {
                // 订单生成(0),支付成功(1)
                switch (this.payGoodsOrderStatus) {
                    case 0:
                        this.getPayOrderStatus();
                        break;
                    case 1:
                        this.status = 1;
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
        * 重置定时器以及相关状态
        */
        resetTimerAndOrderStatus() {
            clearInterval(this.timerID);
            this.payGoodsOrderStatus = 0;
        },
        /**
         * 获取 支付订单状态
         */
        async getPayOrderStatus() {
            const { payOrderId } = this;
            const { data } = await this.$API.getPayOrderStatus(payOrderId);
            this.payGoodsOrderStatus = +data.data.status;
        },
        /**
        * 关闭 支付弹窗，销毁定时器
        */
        dialogPayClose() {
            this.visibleDialogPay = false;
            this.resetTimerAndOrderStatus();
        },
        async getData(page) {
            if (page) this.params.current = page;
            this.tableLoading = true;
            try {
                const { data: { data } } = await this.$API.getPageByUser(this.params);
                this.tableData = data.records;
                this.total = data.total;
            } finally {
                this.tableLoading = false;
            }
        },
        onSizeChange(size) {
            this.params.size = size;
            this.getData();
        },
        onCurrentChange(page) {
            this.params.current = page;
            this.getData();
        },
    },
};
</script>-->
<script>
import { placePay } from '@/api/pay/paygoodsorder'
export default {
    data() {
        return {
            merchantInfo: {},
            list: [
                {
                    amount: 100,
                    integral: 1000
                },
                {
                    amount: 200,
                    integral: 2000
                },
                {
                    amount: 500,
                    integral: 5000
                }, 
                {
                    amount: 1000,
                    integral: 10000
                }
            ],
            selected: 0,
            amt: 100
        };
    },
    created() {},
    mounted() {
       this.fetchData();
    },
    methods: {
        selectItem(index) {
            this.selected = index;
            this.amt = this.list[index].amount;
        },
        //支付
        onPay() {
            placePay(this.amt).then(response => {
                if (window.electron) {
                    // 发送到electron进行跳转
                    window.electron.send({key: 'chromeUrl', url: response.data})
                } else {
                    window.open(response.data)
                }
            }).catch(() => {})
        },
        // 获取商家积分信息
        fetchData() {
            this.$API.getMerchantInfo().then(({ data }) => {
                this.merchantInfo = data.data;
            });
        },
    }
};
</script>

<style lang="scss" scoped>
.recharge-index-pages-container {
    padding: 0 20px 50px 20px;
    .section {
        padding-left: 20px;
        background: #fff;
        border-radius: 3px;
    }

    .cards {
        background: #ffffff;
        border-radius: 3px;
        padding: 24px 28px 24px 38px;
        box-sizing: border-box;
    }

    .h-title {
        font-size: 20px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 600;
        position: relative;

        &::after {
            content: "";
            position: absolute;
            width: 7px;
            height: 100%;
            background: $themeColor;
            border-radius: 3px;
            top: 0;
            left: -14px;
        }
        .tip {
            font-size: 16px;
            color: $themeColor;
            margin-left: 10px;
        }
    }
    .highlight {
        color: #fa5243;
    }

    .balance-box {
        .balance {
            font-size: 26px;
            font-weight: 600;
            color: $themeColor;
        }
        .account {
            font-size: 16px;
            font-weight: 500;
            color: #666;
        }

        .desc {
            font-size: 16px;
            font-weight: 500;
            color: #666;
        }
    }

    .recharge-box {
        .item-cell {
            user-select: none;
            padding: 15px 5px;
            box-sizing: border-box;
            background: #d6eafe;
            border-radius: 18px;
            position: relative;
            cursor: pointer;
            display: flex;
            align-items: center;
            flex-direction: column;
            color: $themeColor;

            &.active {
                color: #fff;
                background: $themeColor;
                .giving {
                    color: #fff;
                }
            }

            .label-wrap {
                position: absolute;
                top: 0;
                right: 0;
                // width: 150px;
                left: 0;
                height: 40px;
                background: #fc6550;
                border-radius: 0px 19px 0px 19px;
                display: flex;
                justify-content: center;
                align-items: center;
                .label {
                    font-size: 16px;
                    font-weight: 500;
                    color: #feef04;
                    line-height: 28px;
                }
            }

            .giving {
                color: #fa5243;
            }
        }
        .tags {
            span {
                padding: 10px;
                border-radius: 5px;
                background: #ffeff0;
                color: #ff5756;
            }
        }
        .price {
            transform: translateY(-5px);
        }
        .price-box {
            position: absolute;
            left: 100px;
        }
        .confirm {
            width: 350px;
            height: 72px;
            background: $themeColor;
            border-radius: 6px;
            font-size: 26px;
            color: #ffffff;
        }
    }
}
</style>