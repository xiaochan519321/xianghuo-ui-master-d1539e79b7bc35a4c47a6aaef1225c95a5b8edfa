<template>
    <div class="recharge-index-pages-container">
        <div class="recharge-box cards mt20">
            <p class="h-title">
                <span>充值面单</span>
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
<script>
import { placePay } from '@/api/pay/paygoodsorder'
export default {
    data() {
        return {
            list: [
                {
                    amount: 100,
                },
                {
                    amount: 200,
                },
                {
                    amount: 500,
                }, 
                {
                    amount: 1000,
                }
            ],
            selected: 0,
            amt: 100
        };
    },
    created() {},
    mounted() {},
    methods: {
        selectItem(index) {
            this.selected = index;
            this.amt = this.list[index].amount;
        },
        onPay() {
            placePay(this.amt).then(response => {
                if (window.electron) {
                    // 发送到electron进行跳转
                    window.electron.send({key: 'chromeUrl', url: response.data})
                } else {
                    window.open(response.data)
                }
            }).catch(() => {})
        }
    }
};
</script>

<style lang="scss" scoped>
.recharge-index-pages-container {
    padding: 0 20px 50px 20px;
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
            background: #3b7bff;
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
            color: #1890ff;
        }
        .account {
            font-size: 16px;
            font-weight: 500;
            color: #666666;
        }

        .desc {
            font-size: 16px;
            font-weight: 500;
            color: #666666;
        }
    }

    .recharge-box {
        .item-cell {
            user-select: none;
            padding: 15px 15px;
            box-sizing: border-box;
            background: #d6eafe;
            border-radius: 18px;
            position: relative;
            cursor: pointer;
            display: flex;
            align-items: center;
            flex-direction: column;
            color: #2d8aed;

            &.active {
                color: #fff;
                background: #2d8aed;
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
            background: #1890ff;
            border-radius: 6px;
            font-size: 26px;
            color: #ffffff;
        }
    }
}
</style>
