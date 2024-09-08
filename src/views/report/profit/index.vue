<template>
    <div id="main" class="profit-new-execution">
        <basic-container>
            <div class="header">
                <div class="alert">
                    <i class="el-icon-warning" />
                    <span class="text">
                        1.平台报表默认统计维度的数据，包含未开始代发、代发中、代发失败、支付中、支付失败、待上家发货、上家已发货、代发完成，若只需统计某个或者某些维度数据，请点击统计维度进行选择。 <br/>
                       <template v-if="isAlertExpand">
                        2.利润默认计算公式：销售金额+平台补贴-采购实付金额=我的利润，可根据实际情况，在利润计算中勾选选项重新计算利润。 <br/>
                        3.平台计算的利润不包含采购优惠金额，抖店的平台服务费、精选联盟佣金、分成等支出。<br/>
                        4.销售退款金额以实际产生退款订单，且退款成功的时间进行统计，如昨天产生退款订单，在今天进行完成退款，退款订单则统计在今天。<br/>
                       </template>
                    </span>
                    <div class="right" v-if="!isAlertExpand" @click="isAlertExpand = !isAlertExpand">
                        展开 
                        <i class="el-icon-arrow-down"></i>
                    </div>
                    <div class="right" v-else @click="isAlertExpand = !isAlertExpand">
                        收起
                        <i class="el-icon-arrow-up"></i>
                    </div>
                </div>
                <div class="filter-box">
                    <el-radio-group v-model="formData.timeFrame" @change="onCycleChange" style="margin-bottom: 15px;">
                        <el-radio-button label="1">今日实时数据</el-radio-button>
                        <el-radio-button label="2">最近7天数据</el-radio-button>
                        <el-radio-button label="3">最近30天数据</el-radio-button>
                        <el-radio-button label="4">本月数据</el-radio-button>
                    </el-radio-group>
                    <el-form inline :model="formData" ref="form" class="form" label-width="100px">
                        <el-form-item label="店铺：" prop="shopId">
                            <el-select
                                v-model="formData.shopId"
                                placeholder="请选择店铺"
                                style="width: 156px"
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
                        <!-- <el-form-item prop="createTimeArr" label="下单时间：" class="search-time-item">
                            <el-date-picker
                                v-model="formData.createTimeArr"
                                type="daterange"
                                align="right"
                                unlink-panels
                                :picker-options="pickerOptions"
                                style="width: 366px"
                                range-separator="至"
                                value-format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item> -->
                        <el-form-item>
                            <el-button icon="el-icon-delete" style="width: 86px" @click.stop="resetForm()">
                                <span>清空</span>
                            </el-button>
                            <el-button type="primary" icon="el-icon-search" style="width: 86px" @click.stop="initGetList">
                                <span>搜索</span>
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="formula-content">
                    <div class="head-items">
                        <div class="item">
                            <div class="title">
                                <span>利润</span>
                                <el-popover
                                    placement="right"
                                    width="150"
                                    v-model="formulaVisible">
                                    <div style="line-height: 28px;">
                                        <el-checkbox-group v-model="formulaOptionCopy">
                                            <el-checkbox label="purchaseSalesAmount">采购销售金额</el-checkbox>
                                            <!-- <el-checkbox label="refundAmount">退款金额</el-checkbox> -->
                                            <el-checkbox label="purchaseAmount">采购实付金额</el-checkbox>
                                            <!-- <el-checkbox label="purchaseRefundAmount">采购退款金额</el-checkbox> -->
                                            <el-checkbox label="platformSubsidyFee">平台补贴</el-checkbox>
                                            <el-checkbox label="purchaseCostAmount">采购优惠金额</el-checkbox>
                                            <el-checkbox label="isolationAmount">隔离订单金额</el-checkbox>
                                        </el-checkbox-group>
                                        <div class="mt15" style="text-align: right;">
                                            <el-button size="mini" @click="formulaVisible = false">取消</el-button>
                                            <el-button size="mini" type="primary" @click="onFormulaSave">保存</el-button>
                                        </div>
                                    </div>
                                    <span slot="reference" class="reference">更换公式</span>
                                </el-popover>
                            </div>
                            <div class="tip">
                                计算公式：采购销售金额
                                <template v-if="onFormulaModel('purchaseAmount')">
                                    - 采购实付金额
                                </template>
                                <!-- <template v-if="onFormulaModel('refundAmount')">
                                    - 退款金额
                                </template>
                                <template v-if="onFormulaModel('purchaseRefundAmount')">
                                    + 采购退款金额
                                </template> -->
                                <template v-if="onFormulaModel('platformSubsidyFee')">
                                    + 平台补贴
                                </template>
                                <template v-if="onFormulaModel('purchaseCostAmount')">
                                    + 采购优惠金额
                                </template>
                                <template v-if="onFormulaModel('isolationAmount')">
                                    - 隔离订单金额
                                </template>
                                
                            </div>
                            <div class="count">
                                ¥
                                <count-to
                                    :start-val="0"
                                    :end-val="dataBoard.profitAmount"
                                    :decimals="2"
                                    :duration="2000"
                                />
                            </div>
                        </div>
                        <div class="item">
                            <div class="title">利润率</div>
                            <div class="tip">
                                计算公式：利润/采购销售金额*100%
                            </div>
                            <div class="count">
                                <count-to
                                    :start-val="0"
                                    :end-val="dataBoard.avgProfitAmount"
                                    :decimals="2"
                                    :duration="2000"
                                />
                                %
                            </div>
                        </div>
                        <div class="verify-item" >
                            <el-button icon="el-icon-refresh" type="primary" @click="onVerify"></el-button>
                        </div>
                    </div>
                    <!-- 第一行 -->
                    <div class="items">
                        <div class="ab">
                            <div class="item">
                                <div class="title">
                                    销售金额
                                    <el-tooltip content="支付成功的订单金额汇总" placement="bottom" effect="dark">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </div>
                                <div class="count">
                                    ¥
                                    <count-to
                                        :start-val="0"
                                        :end-val="dataBoard.salesAmount"
                                        :decimals="2"
                                        :duration="2000"
                                    />
                                </div>
                                <div class="tip">所选店铺支付成功的订单金额</div>
                            </div>
                            <div class="item">
                                <div class="title">
                                    销售订单量
                                    <el-tooltip content="支付成功的子订单数，包含退款的子订单数" placement="bottom" effect="dark">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </div>
                                <div class="count">
                                    <count-to
                                        :start-val="0"
                                        :end-val="dataBoard.salesCount"
                                        :decimals="0"
                                        :duration="2000"
                                    />
                                </div>
                                <div class="tip">所选店铺支付成功的子订单数</div>
                            </div>
                        </div>
                        <div class="ab">
                            <div class="item">
                                <div class="title">
                                    退款金额
                                    <el-tooltip content="在平台进行采购支付成功，但发生退款且退款成功的金额汇总" placement="bottom" effect="dark">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </div>
                                <div class="count">
                                    ¥
                                    <count-to
                                        :start-val="0"
                                        :end-val="dataBoard.refundAmount"
                                        :decimals="2"
                                        :duration="2000"
                                    />
                                </div>
                                <div class="tip">所选店铺采购支付成功，但退款成功的金额汇总</div>
                            </div>
                            <div class="item">
                                <div class="title">
                                    退款订单量
                                    <el-tooltip content="在平台进行采购支付成功，但发生退款且退款成功的订单数" placement="bottom" effect="dark">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </div>
                                <div class="count">
                                    <count-to
                                        :start-val="0"
                                        :end-val="dataBoard.refundCount"
                                        :decimals="0"
                                        :duration="2000"
                                    />
                                </div>
                                <div class="tip">所选店铺采购支付成功，但退款成功的订单数</div>
                            </div>
                        </div>
                    </div>
                    <div class="items">
                        <div class="ab">
                            <div class="item">
                                <div class="title">
                                    采购实付金额
                                    <el-tooltip content="进行采购支付成功的订单金额汇总" placement="bottom" effect="dark">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </div>
                                <div class="count">
                                    ¥
                                    <count-to
                                        :start-val="0"
                                        :end-val="dataBoard.purchaseAmount"
                                        :decimals="2"
                                        :duration="2000"
                                    />
                                </div>
                                <div class="tip">所选店铺采购支付成功的订单金额汇总</div>
                            </div>
                            <div class="item">
                                <div class="title">
                                    采购订单量
                                    <el-tooltip content="采购支付成功的订单量" placement="bottom" effect="dark">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </div>
                                <div class="count">
                                    <count-to
                                        :start-val="0"
                                        :end-val="dataBoard.purchaseCount"
                                        :decimals="0"
                                        :duration="2000"
                                    />
                                </div>
                                <div class="tip">所选店铺采购支付成功的订单量</div>
                            </div>
                        </div>
                        <div class="ab">
                            <div class="item">
                                <div class="title">
                                    采购销售金额
                                    <el-tooltip content="采购销售总金额" placement="bottom" effect="dark">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </div>
                                <div class="count">
                                    <count-to
                                        :start-val="0"
                                        :end-val="dataBoard.purchaseSalesAmount"
                                        :decimals="2"
                                        :duration="2000"
                                    />
                                </div>
                                <div class="tip">所选店铺的采购销售总金额汇总</div>
                            </div>
                            <div class="item">
                                <div class="title">
                                    采购退款金额
                                    <el-tooltip content="采购退款成功的订单金额汇总" placement="bottom" effect="dark">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </div>
                                <div class="count">
                                    ¥
                                    <count-to
                                        :start-val="0"
                                        :end-val="dataBoard.purchaseRefundAmount"
                                        :decimals="2"
                                        :duration="2000"
                                    />
                                </div>
                                <div class="tip">所选店铺采购退款成功的订单金额汇总</div>
                            </div>
                        </div>
                    </div>
                    <div class="items">
                        <div class="ab">
                            <div class="item">
                                <div class="title">
                                    采购退款订单量
                                    <el-tooltip content="采购退款成功的订单量" placement="bottom" effect="dark">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </div>
                                <div class="count">
                                    <count-to
                                        :start-val="0"
                                        :end-val="dataBoard.purchaseRefundCount"
                                        :decimals="0"
                                        :duration="2000"
                                    />
                                </div>
                                <div class="tip">所选店铺采购退款成功的订单量</div>
                            </div>
                            <div class="item">
                                <div class="title">
                                    平台补贴
                                    <el-tooltip content="官方为消费者购买商品时的补贴金额" placement="bottom" effect="dark">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </div>
                                <div class="count">
                                    <count-to
                                        :start-val="0"
                                        :end-val="dataBoard.platformSubsidyFee"
                                        :decimals="2"
                                        :duration="2000"
                                    />
                                </div>
                                <div class="tip">所选店铺的平台补贴汇总</div>
                            </div>
                        </div>
                        <div class="ab">
                            <div class="item">
                                <div class="title">
                                    领劵节省金额
                                    <el-tooltip content="采购时使用优惠券的总额（即平台优惠金额）" placement="bottom" effect="dark">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </div>
                                <div class="count">
                                    ¥
                                    <count-to
                                        :start-val="0"
                                        :end-val="dataBoard.purchaseCostAmount"
                                        :decimals="2"
                                        :duration="2000"
                                    />
                                </div>
                                <div class="tip">所选店铺的领劵节省金额汇总</div>
                            </div>
                            <div class="item">
                                <div class="title">
                                    销售商品件数
                                    <el-tooltip content="抖店销售商品的总件数" placement="bottom" effect="dark">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </div>
                                <div class="count">
                                    <count-to
                                        :start-val="0"
                                        :end-val="dataBoard.salesItems"
                                        :decimals="0"
                                        :duration="2000"
                                    />
                                </div>
                                <div class="tip">所选店铺的销售商品件数汇总</div>
                            </div>
                        </div>
                    </div>
                    <div class="items" >
                        <div class="ab">
                            <div class="item">
                                <div class="title">
                                    采购商品件数
                                    <el-tooltip content="通过平台进行采购商品的总件数" placement="bottom" effect="dark">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </div>
                                <div class="count">
                                    <count-to
                                        :start-val="0"
                                        :end-val="dataBoard.purchaseItems"
                                        :decimals="0"
                                        :duration="2000"
                                    />
                                </div>
                                <div class="tip">所选店铺的采购商品件数汇总</div>
                            </div>
                            <div class="item">
                                <div class="title">
                                    隔离订单金额
                                    <el-tooltip content="隔离订单的金额汇总" placement="bottom" effect="dark">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </div>
                                <div class="count">
                                    ¥
                                    <count-to
                                        :start-val="0"
                                        :end-val="dataBoard.isolationAmount"
                                        :decimals="2"
                                        :duration="2000"
                                    />
                                </div>
                                <div class="tip">所选店铺的隔离订单金额汇总</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </basic-container>
        <dialogVerify ref="dialogVerify" @success="verifySuccess" />
    </div>
</template>
<script>
import CountTo from 'vue-count-to'
import { getProfitOption, getProfitData } from "@/api/report/profit";
import DialogVerify from './components/DialogVerify.vue'
export default {
    name: "profit",
    components: {
        CountTo,
        DialogVerify
    },
    data() {
        return {
            isAlertExpand: false,
            tableData: [],
            dataBoard: {
                avgProfitAmount: 0,
                isolationAmount: 0,
                platformSubsidyFee: 0,
                profitAmount: 0,
                purchaseAmount: 0,
                purchaseCostAmount: 0,
                purchaseCount: 0,
                purchaseSalesAmount: 0,
                purchaseItems: 0,
                purchaseRefundAmount: 0,
                purchaseRefundCount: 0,
                refundAmount: 0,
                refundCount: 0,
                salesAmount: 0,
                salesCount: 0,
                salesItems: 0
            },
            formData: {
                timeType: '1',
                timeFrame: '1',
                createTimeArr: [],
                shopId: ''
            },
            countLoading: false,
            shopList: [],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
            },
            statusList: [
                {label: '未开始代发', value: 1},
                {label: '隔离订单', value: 10},
                {label: '待上家发货', value: 5},
                {label: '上家已发货', value: 6},
                {label: '代发完成', value: 7}
            ],
            checkOption: [],
            formulaOption: [],
            formulaOptionCopy: [],
            formulaVisible: false,
            getProfitList: []
        }
    },
    computed: {},
    methods: {
        async onLoadShop () {
            const { data: { data } } = await this.$API.getShopList()
            this.shopList = data
        },
        initGetList() {
            this.getList();
        },
        // 公式展示
        onFormulaModel (key) {
            return this.formulaOption.indexOf(key) > -1
        },
        // 保存公式
        onFormulaSave () {
            this.formulaVisible = false
            this.initGetList()
        },
        async getList () {
            this.countLoading = true
            const { shopId, timeFrame } = this.formData
            const params = {
                shopId,
                timeFrame
            }
            // if (createTimeArr && timeType == 1) {
            //     // 下单时间
            //     params.createTimeArr = [`${createTimeArr[0]} 00:00:00`, `${createTimeArr[1]} 23:59:59`]
            // } else if (createTimeArr && timeType == 2) {
            //     // 采购时间
            //     params.purchaseTimeArr = [`${createTimeArr[0]} 00:00:00`, `${createTimeArr[1]} 23:59:59`]
            // }
            if (this.formulaOptionCopy.length) {
                // 计算公式设置
                params['filterRange'] = JSON.stringify(this.formulaOptionCopy)
            }
            const { data } = await getProfitData(params)
            this.countLoading = false
            this.formulaOption = this.formulaOptionCopy
            this.dataBoard = data.data || {}
        },
        resetForm () {
            this.$refs.form.resetFields()
        },
        onCycleChange (val) {
            this.formData.timeFrame = val;
            this.initGetList()
        },
        // 数据校准
        onVerify () {
            this.$refs.dialogVerify.showModel(this.shopList)
        },
        // 校准成功
        verifySuccess () {
            this.initGetList()
        },
        // 获取计算公式配置
        async onLoadOption () {
            const { data } = await getProfitOption()
            this.formulaOption = data.data
            this.formulaOptionCopy = data.data
            this.initGetList()
        },
    },
    created () {
        try {
            const today = this.$moment().format('YYYY-MM-DD')
            this.formData.createTimeArr = [today, today]
            this.onLoadShop()
            this.onLoadOption()
        } catch (error) {}
    }
};
</script>

<style lang="scss" scoped>
.profit-new-execution {
    .header {
        .alert {
            width: 100%;
            padding: 10px 0px;
            background: #EDF0FF;
            border-radius: 4px 4px 4px 4px;
            border: 1px solid  $themeColor;
            display: flex;
            align-items: flex-start;
            padding-right: 28px;
            .el-icon-warning {
                font-size: 16px;
                color: $themeColor;
                transform: rotate(180deg) translateY(-1px);
                margin-left: 16px;
                margin-right: 12px;
               
            }
            .text {
                font-size: 14px;
                color: rgba(0,0,0,0.85);
                line-height: 18px;
            }
            .right {
                font-size: 14px;
                margin-left: auto;
                cursor: pointer;
                color: $themeColor;
                flex-shrink: 0;
            }
        }
    }    
    .filter-box {
        border-radius: 12px;
        background: #fff;
        padding: 16px 2px 16px 12px;
        display: flex;
        flex-wrap: wrap;
        margin-top: 16px;
        ::v-deep .el-radio-group {
            .el-radio-button  {
                .el-radio-button__inner {
                    padding-left: 8px;
                    padding-right: 8px;
                }
            }
            margin-right: 36px;
        }
        .form {
            ::v-deep .el-form-item {
                margin-right: 10px;
                margin-bottom: 0px;
            }
        }
    }


    .profit-tabs {
        position: relative;
        .last-time {
            position: absolute;
            right: 0;
            top: 10px;
            color: red;
        }
    }
    ::v-deep.el-tabs {
        .el-tabs__nav-wrap::after {
            display: none;
        }
    }
    ::v-deep.el-form {
        .search-time-item {
            .el-form-item__label {
                padding: 0;
                .el-select {
                    width: 100px;
                    transform: translateY(-1px);
                }
                .el-input {
                    width: 85px;
                    transform: translateY(-1px);
                }
                .el-input__inner {
                    background-color: #f5f8fc;
                    color: #999;
                    border-right: 0;
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
                .el-input__inner:hover {
                    border-color: #DCDFE6 !important;
                }
                .el-input__inner:focus {
                    border-color: #DCDFE6 !important;
                }
            }
            .el-range-separator {
                width: 10%;
            }
            .el-form-item__content {
                .el-input__inner {
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                }

            }
        }
    }
    .formula-content {
        background: #fff;
        width: 100%;
        border-radius: 12px;
        padding: 46px 58px 0px;
        position: relative;
        .head-items {
            display: flex;
            align-items:  flex-start;
            justify-content: space-between;
            .item {
                width: 47%;
                .title {
                    font-size: 20px;
                    color: #000;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    
                    .reference {
                        width: 56px;
                        height: 18px;
                        background: rgba(47,81,255,0.15);
                        border-radius: 4px 4px 4px 4px;
                        border: 1px solid #2F51FF;
                        font-size: 12px;
                        color: #2F51FF;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-left: 10px;
                        cursor: pointer;
                    }
                    
                }
                .tip {
                    font-size: 12px;
                    color: #999;
                    margin-top: 8px;
                    color: rgba(0,0,0,0.6);
                }
                .count {
                    font-size: 30px;
                    margin: 24px 0;
                    font-family: Barlow;
                }
            }
            .verify-item {
                position: absolute;
                top: 46px;
                right: 58px;
                ::v-deep .el-button {
                    font-size: 20px;
                    padding: 4px 6px;
                }

            }
        }
        .items {
            width: 100%;
            display: flex;
            justify-content: space-between;
            .ab {
                width: 47%;
                display: flex;
                justify-content: space-between;

            
            .item {
                width: 43.5%;
                height: 102px;
                background: #F5F5FF;
                border-radius: 8px;
                margin-bottom: 40px;
                padding-top: 20px;
                padding-left: 16px;
              

               
                .title {
                    font-size: 14px;
                    color: #333;
                    .el-icon-question {
                        color: rgba(0,0,0,.5);
                        font-size: 12px;
                        transform: translateY(-2px);
                    }
                }
                
                .count {
                    font-size: 20px;
                    margin: 10px 0;
                    font-family: Barlow;
                }
                .tip {
                    font-size: 12px;
                    color: #999;
                    font-weight: 500;
                    line-height: 18px;
                    padding-right: 40px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
          
        }
        }
    }
}
</style>

