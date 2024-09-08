<template>
    <div class="container flex flex-1">
        <div class="content-wrap flex flex-1 flex-col">
            <div class="header-box flex flex-col">
                <div class="steps section flex" v-loading="loading">
                    <div class="step one flex flex-1 flex-col justify-center items-center">
                        <div class="step-bg flex justify-center items-center">
                            <i class="iconfont icon-tuikuan font35"></i>
                        </div>
                        <p>抖音用户申请售前退款</p>
                    </div>
                    <div class="mt20">
                        <img src="/img/aftersales/finish.png" alt />
                    </div>
                    <div class="step two flex flex-1 flex-col justify-center items-center">
                        <div class="step-bg flex justify-center items-center">
                            <i class="iconfont icon-shenhe font30"></i>
                        </div>
                        <p>商家审核</p>
                    </div>
                    <div class="mt20">
                        <!-- 12(售后完成) -->
                        <img
                            v-if="aftersaleInfo.aftersale_status ===12"
                            src="/img/aftersales/finish.png"
                            alt
                        />
                        <!-- 8(待商家处理) -->
                        <img v-else src="/img/aftersales/progress.png" alt />
                    </div>
                    <div class="step three flex flex-1 flex-col justify-center items-center">
                        <div
                            class="step-bg flex justify-center items-center"
                            :style="`${aftersaleInfo.aftersale_status !==12?'background:#8d98ac;':''}`"
                        >
                            <i class="iconfont icon-zhengque font35"></i>
                        </div>
                        <p>售后完成</p>
                    </div>
                </div>
                <div class="tips-box flex" v-loading="loading">
                    <div class="lbox">
                        <i class="iconfont icon-xinxi font55"></i>
                    </div>
                    <div class="rbox ml10">
                        <!-- 待买家退货 -->
                        <span
                            class="font20"
                        >{{ formatAftersaleStatus(aftersaleInfo.aftersale_status) }}</span>
                        <br />
                        <p class="cash-sale font14 mt10">
                            <span>申请退款金额：</span>
                            <span>{{aftersaleInfo.refund_amount |formatMoney}}</span>
                            <span>{{ '（含运费'+Number(aftersaleInfo.refund_post_amount || 0).toFixed(2)+')'}}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="content">
                <!-- 售后信息 -->
                <div class="card one section" v-loading="loading">
                    <el-form label-width="128px">
                        <div class="table-box">
                            <h3 class="title font16">售后信息</h3>
                        </div>
                        <ul>
                            <li>
                                <ul class="ul-class">
                                    <li class="li-class">
                                        <el-form-item label="售后编号">
                                            <span>{{aftersaleInfo.aftersale_id}}</span>
                                        </el-form-item>
                                        <el-form-item label="售后类型">
                                            <span>{{ formatAftersaleType(aftersaleInfo.aftersale_type)}}</span>
                                        </el-form-item>
                                        <el-form-item label="退款金额">
                                            <span>{{aftersaleInfo.refund_amount |formatMoney}}</span>
                                        </el-form-item>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <ul class="ul-class">
                                    <li class="li-class">
                                        <el-form-item label="申请时间">
                                            <span>{{ new Date(aftersaleInfo.apply_time *1000) |dateFormat }}</span>
                                        </el-form-item>
                                        <el-form-item label="售后原因">
                                            <span>{{orderInfo.reasonText?orderInfo.reasonText:'-'}}</span>
                                        </el-form-item>
                                        <el-form-item label="申请件数">
                                            <span>{{aftersaleInfo.aftersale_num}}</span>
                                        </el-form-item>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </el-form>
                </div>
                <!-- 商品信息 -->
                <div class="card two section" v-loading="loading">
                    <h3 class="title font16">商品信息</h3>
                    <el-table
                        :data="orderInfo.related_order_info"
                        style="width: 100%"
                        class="table"
                    >
                        <el-table-column prop="product_name" label="商品信息">
                            <template slot-scope="{ row }">
                                <div class="title-box flex">
                                    <div class="title-box-left" v-if="row">
                                        <img :src="row.product_image" alt />
                                    </div>
                                    <div class="title-box-right flex-1 ellipsis-2" v-if="row">
                                        <div
                                            class="flex flex-col justify-items-center justify-between"
                                        >
                                            <span
                                                class="title-box-right-text text-left"
                                            >{{ row.product_name }}</span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sku_spec" label="商品规格">
                            <template slot-scope="{ row }">
                                <div v-for="(item, index) in row.sku_spec" :key="index">
                                    <span>{{item.name+'：' +item.value}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="product_id" label="商品ID"></el-table-column>
                        <el-table-column prop="price" label="单价">
                            <template slot-scope="{ row }">
                                <span class="price_red">{{ row.price | formatMoney }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-form label-width="128px">
                        <div>
                            <h4>购买信息</h4>
                        </div>
                        <ul>
                            <li>
                                <ul class="ul-class">
                                    <li class="li-class">
                                        <el-form-item label="订单编号">
                                            <span>{{orderInfo.shop_order_id}}</span>
                                        </el-form-item>
                                        <el-form-item label="下单时间">
                                            <span>{{ new Date(orderInfo.createTime *1000) |dateFormat }}</span>
                                        </el-form-item>
                                        <el-form-item label="收货人电话">
                                            <span>{{orderInfo.encryptPostTel}}</span>
                                        </el-form-item>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <ul class="ul-class">
                                    <li class="li-class">
                                        <el-form-item label="应付金额">
                                            <span>{{orderInfo.payAmount |formatMoney}}</span>
                                        </el-form-item>
                                        <el-form-item label="商品发货状态">
                                            <span>{{orderInfo.$status}}</span>
                                        </el-form-item>
                                        <el-form-item label="申请件数">
                                            <span>{{orderInfo.aftersaleNum}}</span>
                                        </el-form-item>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <ul class="ul-class">
                                    <li class="li-class">
                                        <el-form-item label="支付方式">
                                            <span>支付宝支付</span>
                                        </el-form-item>
                                        <el-form-item label="收货人姓名">
                                            <span>{{orderInfo.encryptPostReceiver}}</span>
                                        </el-form-item>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </el-form>
                </div>
                <!-- 代发信息 -->
                <div class="card three section" v-loading="loading">
                    <el-form label-width="128px">
                        <div>
                            <h3 class="title">代发信息</h3>
                        </div>
                        <ul>
                            <li>
                                <ul class="ul-class">
                                    <li class="li-class">
                                        <el-form-item label="商品链接">
                                            <el-link
                                                :href="dropShippingInfo.pddPurchaseUrl"
                                                target="_blank"
                                                :underline="false"
                                                type="primary"
                                            >{{dropShippingInfo.pddPurchaseUrl == null? '-':'查看'}}</el-link>
                                        </el-form-item>
                                        <el-form-item label="订单编号">
                                            <span>{{dropShippingInfo.pddOrderId}}</span>
                                        </el-form-item>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <ul class="ul-class">
                                    <li class="li-class">
                                        <el-form-item label="商品规格">
                                            <span>{{dropShippingInfo.pddSpec}}</span>
                                        </el-form-item>
                                        <el-form-item label="下单时间">
                                            <span>{{dropShippingInfo.pddOrderTime}}</span>
                                        </el-form-item>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <ul class="ul-class">
                                    <li class="li-class">
                                        <el-form-item label="商品ID">
                                            <span>{{dropShippingInfo.goodsId}}</span>
                                        </el-form-item>
                                        <el-form-item label="物流公司">
                                            <span>{{dropShippingInfo.shippingName}}</span>
                                        </el-form-item>
                                        <!-- <el-form-item label="支付方式">
                      <span>{{dropShippingInfo.payWay}}</span>
                                        </el-form-item>-->
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <ul class="ul-class">
                                    <li class="li-class">
                                        <el-form-item label="单价">
                                            <span>{{dropShippingInfo.payAmount |formatMoney}}</span>
                                        </el-form-item>
                                        <el-form-item label="运单号">
                                            <span>{{dropShippingInfo.trackingNumber }}</span>
                                        </el-form-item>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </el-form>
                </div>
                <!-- 协商记录 -->
                <!-- <div class="card four section">
          <div class="table-box">
            <h3 class="title font16">协商记录</h3>
            <el-table :data="aftersaleRecords" style="width: 100%" class="table">
              <el-table-column prop="opType" label="操作类型">
                <template slot-scope="{ row }">
                  <span>{{row.opType ?getOpType(row.opType):'-'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="comment" label="操作内容">
                <template slot-scope="{ row }">
                  <span>{{row.comment ?row.comment :'-'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="role" label="操作人">
                <template slot-scope="{ row }">
                  <span>{{row.role ==='user'?'用户':'系统'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="opTime" label="操作时间"></el-table-column>
            </el-table>
          </div>
                </div>-->
            </div>
        </div>
    </div>
</template>

<script>
import { detail } from '@/api/aftersales/doudian'
export default {
    data() {
        return {
            loading: true,
            // 协商记录
            aftersaleRecords: [
                {
                    "comment": "多拍 / 错拍 / 不想要",
                    "opTime": "2021-10-14 21:44:09",
                    "opType": "apply",
                    "role": "user"
                },
                {
                    "comment": "退款助手自动同意",
                    "opTime": "2021-10-14 21:44:09",
                    "opType": "audit",
                    "role": "system"
                },
                {
                    "comment": "",
                    "opTime": "2021-10-14 21:50:47",
                    "opType": "refund",
                    "role": "system"
                }
            ],
            // 售后
            aftersaleInfo: {
            },
            // 订单
            orderInfo: {},
            // 代发
            dropShippingInfo: {}
        }
    },
    computed: {
        /**
         * 操作类型
         */
        getOpType() {
            return function (opType) {
                switch (opType) {
                    case 'apply':
                        return '售后申请'
                        break;
                    case 'audit':
                        return '售后审核'
                        break;
                    case 'refund':
                        return '退款'
                        break;
                }
            }
        },
        /**
         * 售后类型
         */
        formatAftersaleType() {
            return function (type) {
                switch (type) {
                    case 0:
                        return '退货退款'
                        break;
                    case 1:
                        return '已发货仅退款'
                        break;
                    case 2:
                        return '未发货仅退款'
                    case 3:
                        return '换货'
                        break;
                }
            }
        },
        /**
         * 售后状态
         */
        formatAftersaleStatus() {
            return function (type) {
                switch (type) {
                    case 2:
                        return '发货前退款待处理'
                        break;
                    case 3:
                        return '发货后仅退款待处理'
                        break;
                    case 4:
                        return '退货待处理'
                    case 5:
                        return '换货待处理'
                        break;
                    case 6:
                        return '同意退款，退款失败'
                        break;
                    case 7:
                        return '同意退款，退款成功'
                        break;
                    case 8:
                        return '待商家处理'
                        break;
                    case 9:
                        return '待商家收货'
                        break;
                    case 10:
                        return '同意退款，退款中'
                        break;
                    case 11:
                        return '仲裁中'
                        break;
                    case 12:
                        return '售后成功'
                        break;
                    case 13:
                        return '待买家退货'
                        break;
                    case 14:
                        return '等待用户收货'
                        break;
                    case 15:
                        return '换货成功'
                        break;
                    case 16:
                        return '拒绝售后'
                        break;
                    case 17:
                        return '退货后拒绝退款'
                        break;
                    case 18:
                        return '待商家上传凭证'
                        break;
                    case 19:
                        return '仲裁中-待商家举证'
                        break;
                    case 20:
                        return '仲裁中-待商家举证或协商期'
                        break;
                }
            }
        },
    },
    methods: {
        async fetchData() {
            this.loading = true;
            const orderId = this.$route.query.id;
            await detail({ "orderId": orderId }).then(datas => {
                const { data: { data } } = datas;
                this.aftersaleInfo = data.aftersaleInfo;
                const aftelDetails = this.$locStore.getStore({
                    name: 'aftel_details',
                    type: 'session',
                });
                this.orderInfo = { ...data.orderInfo, ...aftelDetails };
                this.dropShippingInfo = data.dropShippingInfo;
                this.loading = false;
            }).catch(() => {
                // loading();
            });
        }
    },
    mounted() {
        this.fetchData();
    }
}
</script>
<style lang="scss" scoped>
.container {
    padding: 10px 20px 30px 20px;
    font-size: 14px;
    color: #3b4859;
    box-sizing: border-box;
    .section {
        border-radius: 6px;
        margin-bottom: 20px;
        background: #fff;
    }
    .content-wrap {
        padding-bottom: 10px;
        .header-box {
            .steps {
                font-size: 14px;
                line-height: 20px;
                padding-top: 15px;
                padding-bottom: 15px;
                .step {
                    .step-bg {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        background: #3b7cff;
                        .iconfont {
                            color: #fff;
                        }
                    }
                }
            }
            .tips-box {
                padding: 21px 20px;
                height: 114px;
                background: #f9f0d5;
                .lbox {
                    .iconfont {
                        color: #ffc80c;
                    }
                }
                .rbox {
                    .cash-sale {
                        display: inline-block;
                        color: #8392a7;
                    }
                }
            }
        }
        .content {
            & ::v-deep .el-form-item__label {
                padding: 0 30px 0 0 !important;
            }
            .card {
                padding: 5px 20px 0 20px;
                margin-top: 20px;
                margin-bottom: 20px;
                .table-box {
                    padding-bottom: 30px;
                }
                .title {
                    color: #3b4859;
                    position: relative;
                    padding-left: 15px;
                    &::after {
                        content: "";
                        position: absolute;
                        width: 4px;
                        height: 14px;
                        background: #3b7bff;
                        border-radius: 35%;
                        top: 5px;
                        left: 0;
                    }
                }
                ul {
                    display: flex;
                    list-style: none;
                    padding: 0;
                    margin-bottom: 20px;
                    & li {
                        width: 33.33%;
                    }
                }
                .ul-class {
                    .li-class {
                        width: 100%;
                        line-height: 1.5em;
                    }
                }
                .table {
                    margin-top: 15px;
                    font-size: 14px;
                    color: #333;
                    .title-box {
                        &-left:hover {
                            .hover-img-box {
                                display: block;
                            }
                        }
                        &-left {
                            min-width: 60px;
                            width: 60px;
                            height: 60px;
                            border-radius: 4px;
                            overflow: hidden;
                            margin-right: 12px;
                            .hover-img-box {
                                display: none;
                                position: absolute;
                                top: 0;
                                left: 50px;
                                width: 75px;
                                height: 75px;
                                border-radius: 4px;
                                z-index: 6;
                            }
                        }
                        &-right {
                            height: 70px;
                            &-text {
                                margin-top: 8px;
                                min-width: 70px;
                                max-height: 70px;
                                text-decoration: none;
                            }
                        }
                    }
                }
                .price_red {
                    color: #ff5e68;
                }
            }
            & ::v-deep .el-table th.el-table__cell > .cell {
                padding: 12px 10px;
                color: #3b4859;
                background-color: #fff;
            }

            & ::v-deep .el-table td,
            .el-table th {
                padding: 12px 0;
                min-width: 0;
                box-sizing: border-box;
                text-overflow: ellipsis;
                vertical-align: middle;
                position: relative;
                text-align: left;
            }
        }
    }
}
</style>
