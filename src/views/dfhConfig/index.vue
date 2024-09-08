<template>
    <div class="dfh-config">
        <div class="dfh-content">
            <el-form
                ref="form"
                v-loading="loadingFlag"
                element-loading-text="拼命加载中"
                :model="form"
                label-width="265px"
            >
                <!-- <div class="card auto-card">
                    <div class="title">
                        <span>自动代发设置</span>
                        <el-tooltip effect="dark" placement="right-start">
                            <i class="el-icon-question" />  
                            <div slot="content" class="lh20" style="width: 300px">
                                1.开启自动代发：在开启自动代发生效的的那一刻，平台新进来的订单都会由系统处理代发；
                                <br />2.关闭自动代发：在关闭自动代发生效的那一刻，系统暂停提交代发订单，已经提交的代发订单将继续完成；
                            </div>  
                        </el-tooltip>
                    </div>
                    <div class="card-main">
                        <el-form-item label="自动代发状态：">
                            <el-switch
                                v-model="form.dropShippingSwitch"
                                :active-color="switchColor"
                                :active-value="1"
                                :inactive-value="0"
                            />
                            <span class="time" v-if="!!form.updateTime">生效时间：{{form.updateTime}}</span>
                        </el-form-item>
                        <el-form-item>
                            <el-radio v-model="form.dropShippingTiming " :label="0" style="margin-right:16px">立即开启</el-radio>
                            <el-radio v-model="form.dropShippingTiming" :label="1" style="margin-right:36px">定时开启</el-radio>
                            <el-date-picker
                                v-model="form.dropShippingStartTime"
                                v-if="form.dropShippingTiming===1"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                placeholder="请选择开启日期时间"
                                style="height: 30px; width:227px;"
                                class="inner-input"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item prop="undropBuyerMsgFlag">
                            <el-checkbox
                                v-model="form.undropBuyerMsgFlag"
                                :true-label="1"
                                :false-label="0"
                            >不代发有买家留言的订单</el-checkbox>
                        </el-form-item>
                        <el-form-item prop="undropSellerMsgFlag">
                            <el-checkbox
                                v-model="form.undropSellerMsgFlag"
                                :true-label="1"
                                :false-label="0"
                            >不代发有商家备注的订单</el-checkbox>
                        </el-form-item>
                        <el-form-item prop="undropSellerMsgFlag">
                            <div class="flex">
                                <el-checkbox
                                    v-model="selectDropShippingProductIds"
                                    :true-label="1"
                                    :false-label="0"
                                >仅代发</el-checkbox>
                                <el-input
                                    v-if="selectDropShippingProductIds === 1"
                                    type="textarea"
                                    :rows="3"
                                    placeholder="请输入商品ID，ID间用逗号隔开"
                                    v-model="form.dropShippingProductIds"
                                    resize="none"
                                    @input="onInput"
                                    style="margin-left: 146px; width:227px;"
                                    class="inner-textarea"
                                ></el-input>
                            </div>
                        </el-form-item>
                    </div>
                </div> -->
                <div class="card filter-card">
                    <div class="title">
                        <span>采购拍单设置</span>
                    </div>
                    <div class="card-main">
                        <el-form-item label="个人号模式：">
                            <!-- <el-radio v-model="form.accountOrderMode" :label="0">普通模式</el-radio> -->
                            <!-- <el-radio v-model="form.accountOrderMode" :label="2">个人号模式</el-radio> -->
                            <el-switch
                                v-model="form.accountOrderMode"
                                :active-color="switchColor"
                                :active-value="2"
                                :inactive-value="0"
                            />
                        </el-form-item>
                        <!-- <el-form-item label="是否开启面单功能：">
                            <el-radio v-model="form.waybillSwitch " :label="1" style="margin-right: 16px;">开启面单</el-radio>
                            <el-radio v-model="form.waybillSwitch" :label="0">关闭面单</el-radio>
                            <span class="remark" style="margin-left: 7px;">备注：需保证面单余额充足，否则开启后也不会生效，充值面单余额详情联系客服</span>
                        </el-form-item> -->
                        <!-- <el-form-item label="是否有分机号：">
                            <el-switch
                                v-model="form.accountOrderMode"
                                :active-color="switchColor"
                                :active-value="2"
                                :inactive-value="0"
                            />
                        </el-form-item> -->
                        <el-form-item label="虚拟手机号&物流通知：">
                            <el-switch
                                v-model="form.pddVirtualSmsModel"
                                :active-color="switchColor"
                                :active-value="1"
                                :inactive-value="0"
                            />
                        </el-form-item>
                        <span class="remark">说明：开启后需要增加消耗<span style="color:#ff7919">1</span>积分/单，可根据需要选择</span>
                        <!-- <el-form-item label="无限制隐私号下单：">
                            <el-switch
                                v-model="form.ciphertextPlaceOrderSwitch"
                                :active-color="switchColor"
                                :active-value="1"
                                :inactive-value="0"
                            />
                            <el-tooltip style="margin-left:10px;" effect="light" placement="right-start">
                                <div slot="content">
                                    可以联系到真实用户以及拨通电话处理售后
                                </div>
                                <i class="el-icon-view el-icon-question"/>
                            </el-tooltip>
                        </el-form-item>
                        <span class="remark">说明：无限制隐私号下单<span style="color:#ff7919">0.8</span>点券/单，可根据需要选择</span>-->
                    </div>
                </div>
                <div class="card order-card">
                    <div class="title">
                        <span>负利润代发设置</span>
                    </div>
                    <div class="card-main">
                        <el-form-item label="负利润代发设置：">
                            <el-switch
                                v-model="form.autoForceDropShippingSwitch"
                                :active-color="switchColor"
                                :active-value="1"
                                :inactive-value="0"
                            />
                            <span v-if="!!form.updateTime" class="time">生效时间：{{form.updateTime}}</span>
                        </el-form-item>
                        <el-form-item label="">
                            <span style="margin-right: 10px;">代发订单利润少于</span>
                            <el-input
                                class="inner-input"
                                type="number"
                                style="width: 74px;"
                                v-model="form.profitLossForceDropShipping"
                            >
                                <span slot="append">元</span>
                            </el-input>
                            <span style="margin-left: 10px;">会代发失败，如需代发可以手动点强制代发</span>
                        </el-form-item>
                    </div>
                </div>

                <!-- <div class="card filter-card">
                    <div class="title">
                        <span>代发过滤设置</span>
                    </div>
                    <div class="card-main">
                        <el-form-item label="收货人含有">
                            <div>
                                <el-input
                                    class="inner-input"
                                    style="width: 249px;"
                                    v-model="form.receiverFilter"
                                    placeholder="只能数组和字母"
                                ></el-input>
                                <span>
                                    的订单不自动代发&nbsp;
                                    <el-tooltip effect="light" placement="right-start">
                                        <div slot="content">
                                            1.收货人任意位置含有连续且完整所输入数字或字母的，才生效；
                                            <br />2.删除数字或字母（即输入框为空），则解除禁制，可自动代发；
                                        </div>
                                        <i class="el-icon-view el-icon-question"/>
                                    </el-tooltip>
                                </span>
                            </div>
                        </el-form-item>
                        <el-form-item label="收货地址含有">
                            <div>
                                <el-input
                                    class="inner-input"
                                    style="width: 249px;"
                                    v-model="form.shippingAddressFilter"
                                    placeholder="只能数组和字母"
                                ></el-input>
                                <span>
                                    的订单不自动代发&nbsp;
                                    <el-tooltip effect="light" placement="right-start">
                                        <div slot="content">
                                            1.收货地址任意位置含有连续且完整所输入数字或字母的，才生效；
                                            <br />2.删除数字或字母（即输入框为空），则解除禁制，可自动代发；
                                        </div>
                                        <i class="el-icon-view el-icon-question"/>
                                    </el-tooltip>
                                </span>
                            </div>
                        </el-form-item>
                    </div>
                </div> -->
                <div class="card order-card">
                    <div class="title">
                        <span>自动商家备注</span>
                        <el-tooltip effect="dark" placement="right-start">
                            <div slot="content" class="lh20" style="width: 300px">
                                1.开启自动商家备注：在开启自动商家备注后，新扭转为所选代发状态的订单都会由系统加入备注队列，执行自动商家备注。自动商家备注会覆盖原有商家备注内容；
                                <br />2.关闭自动商家备注: 在关闭自动商家备注后, 终止还未备注的订单, 后续该代发状态的订单也不再执行自动商家备注；
                            </div>
                            <i class="el-icon-view el-icon-question"/>
                        </el-tooltip>
                    </div>
                    <div class="card-main">
                        <el-form-item label="自动商家备注：">
                            <el-switch
                                v-model="form.sellerRemarkSwitch"
                                :active-color="switchColor"
                                :active-value="1"
                                :inactive-value="0"
                            />
                            <span v-if="!!form.updateTime" class="time">生效时间：{{form.updateTime}}</span>
                        </el-form-item>
                        <el-form-item label>
                            <el-radio v-model="form.sellerRemarkRules" :label="1">订单下单成功，自动备注</el-radio>
                        </el-form-item>
                        <el-form-item label="抖店插旗：">
                            <el-radio v-model="form.sellerFlag" :label="0">
                                <i class="iconfont icon-qizhi" style="color: gray;"></i>
                            </el-radio>
                            <el-radio v-model="form.sellerFlag" :label="5">
                                <i class="iconfont icon-qizhi" style="color: red;"></i>
                            </el-radio>
                            <el-radio v-model="form.sellerFlag" :label="4">
                                <i class="iconfont icon-qizhi" style="color: orange;"></i>
                            </el-radio>
                            <el-radio v-model="form.sellerFlag" :label="3">
                                <i class="iconfont icon-qizhi" style="color: green;"></i>
                            </el-radio>
                            <el-radio v-model="form.sellerFlag" :label="2">
                                <i class="iconfont icon-qizhi" style="color: cyan;"></i>
                            </el-radio>
                            <el-radio v-model="form.sellerFlag" :label="1">
                                <i class="iconfont icon-qizhi" style="color: purple;"></i>
                            </el-radio>
                        </el-form-item>
                        <el-form-item label="商家备注：">
                            <el-input
                                class="inner-input"
                                style="width:250px;"
                                v-model="form.sellerRemark"
                                placeholder="请输入备注内容"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="附加内容：">
                            <el-checkbox label="采购金额" style="margin-right: 18px;" v-model="form.purchaseAmountSwitch" :true-label="1" :false-label="0"></el-checkbox>
                            <el-checkbox label="利润" v-model="form.profitAmountSwitch" :true-label="1" :false-label="0"></el-checkbox>
                            <el-checkbox label="下单手机号" v-model="form.placeOrderPhSwitch" :true-label="1" :false-label="0"></el-checkbox>
                        </el-form-item>
                    </div>
                </div>
                <div class="card order-card">
                    <div class="title">
                        <span>系统自动发货</span>
                        <el-tooltip effect="dark" placement="right-start">
                            <div slot="content" class="lh20" style="width: 300px">
                                1.开启自动发货：在开启自动发货生效的的那一刻，平台未发货的订单都会由系统加入发货队列，执行发货；
                                <br />2.关闭自动发货：在关闭自动发货生效的那一刻，系统暂停自动提交未发货订单，已经提交的发货订单将继续完成发货；
                            </div>
                            <i class="el-icon-view el-icon-question"/>
                        </el-tooltip>
                    </div>
                    <div class="card-main">
                        <el-form-item label="自动发货状态：">
                            <el-switch
                                v-model="form.deliverySwitch"
                                :active-color="switchColor"
                                :active-value="1"
                                :inactive-value="0"
                            />
                            <span v-if="!!form.updateTime" class="time">生效时间：{{form.updateTime}}</span>
                        </el-form-item>
                        <!-- <el-form-item label="非隐私号解密订单发货默认签收手机号：" style="margin: 10px 0;">
                            <el-input
                                class="inner-input"
                                style="width:250px;"
                                oninput="if(value.length>11)value=value.slice(0,11)"
                                v-model="form.placeRecipientsPhone"
                                placeholder="请输入手机号"
                            ></el-input>
                        </el-form-item> -->
                    </div>
                </div>
                <!-- <div class="card filter-card">
                    <div class="title">
                        <span>双物流发货</span>
                        <el-tooltip effect="dark" placement="right-start">
                            <div slot="content" class="lh20" style="width: 300px">
                                1.鉴于店铺平台跟采购平台的物流体系不一致，需要通过购买双物流的方式代替真实采购物流发货；
                                2.如果同时打开双物流发货和延迟单，优先双物流发货
                            </div>
                            <i class="el-icon-view el-icon-question"/>
                        </el-tooltip>
                        <span style="color: red;font-size: 12px;margin-top: 25px;">如果不想使用本司物流发货但是需要检测上家发货状态,请关闭所有物流发货开关</span>
                    </div>
                    <div class="card-main"> -->
                        <!-- <el-form-item label="双物流发货：">
                            <el-switch
                                :disabled="form.ciphertextPlaceOrderSwitch==0"
                                v-model="form.twoLogisticsType"
                                :active-color="switchColor"
                                :active-value="1"
                                :inactive-value="-1"
                            />
                            <el-tooltip effect="light" placement="right-start" style="margin-left:10px;">
                                <div slot="content">
                                    无限制隐私号下单开关打开的情况下才可选择申通
                                </div>
                                <i class="el-icon-view el-icon-question"/>
                            </el-tooltip>
                        </el-form-item>
                        <span class="remark">说明：双物流<span style="color:#ff7919">1.2</span>点券/单(除了顺丰和一些物流外剩下都可同步，带转运单号)，可根据需要选择</span> -->
                        <!-- <el-form-item label="邮政延迟单：">
                            <el-switch
                                v-model="form.delayOrderSwitch"
                                :active-color="switchColor"
                                :active-value="1"
                                :inactive-value="2"
                            />
                        </el-form-item>
                        <span class="remark">说明：延迟单<span style="color:#ff7919">{{ siteConfig.id == 1810202544216821762?'4.8':'1.8' }}</span>点券/单(上家发什么快递都可延迟，会比上家晚到一到两天)，可根据需要选择</span> -->
                        <!-- <el-form-item label="同步延迟单：">
                            <el-switch
                                v-model="form.twoLogisticsType"
                                :active-color="switchColor"
                                :active-value="1"
                                :inactive-value="-1"
                            />
                        </el-form-item>
                        <span class="remark">说明：延迟单<span style="color:#ff7919">1.8</span>点券/单(百分百延迟上家单号用户不会收到该产品,该单会直接签收为抖音面单)，可根据需要选择</span> -->
                    <!-- </div>
                </div> -->
                <div class="card order-card">
                    <div class="title">
                        <span>系统自动发送物流短信</span>
                        <el-tooltip effect="dark" placement="right-start">
                            <div slot="content" class="lh20" style="width: 300px">
                                1.开启自动发送物流短信：在开启自动发送物流短信生效的的那一刻，平台新获取到物流信息的订单都会由系统自动给买家手机号发送物流短信（已有物流信息的不会触发）；
                                <br />2.关闭自动发送物流短信：在关闭自动发送物流短信生效的那一刻，系统暂停对新获取到物流信息的订单自动发送物流短信，已经提交自动发送物流短信的将继续发送完成；
                                <br />3.若开启自动发送物流短信，但没有剩余的短信数量去执行自动发送物流短信，则后续的订单暂停自动发送物流短信，需购买短信套餐后，再继续执行自动发送物流短信；
                            </div>
                            <i class="el-icon-view el-icon-question"/>
                        </el-tooltip>
                    </div>
                    <div class="card-main">
                        <el-form-item label="自动发送物流短信：">
                            <el-switch
                                v-model="form.sendCodeSwitch"
                                :active-color="switchColor"
                                :active-value="1"
                                :inactive-value="2"
                            />
                            <span v-if="!!form.updateTime" class="time">生效时间：{{form.updateTime}}</span>
                        </el-form-item>
                        <span class="remark">说明：取件码短信自动发送<span style="color:#ff7919">0.1</span>点券/条，可根据需要选择</span>
                    </div>
                </div>
                <div class="card order-card">
                    <div class="title">
                        <span>自动申请采购平台退款</span>
                        <el-tooltip effect="dark" placement="right-start">
                            <div slot="content" class="lh20" style="width: 300px">
                                1.开启自动申请采购退款：在开启自动申请采购退款生效的的那一刻，新获取到原平台的退款申请，都会由系统自动给对应的未发货采购订单申请退款（采购已发货的不会触发）；
                                <br />2.关闭自动申请采购退款：在关闭自动申请采购退款生效的那一刻，系统暂停对新获取到原平台申请退款的订单自动申请采购退款，已经提交采购申请退款的将继续完成；
                            </div>
                            <i class="el-icon-view el-icon-question"/>
                        </el-tooltip>
                    </div>
                    <div class="card-main">
                        <el-form-item label="自动申请退款：">
                            <el-switch
                                v-model="form.refundSwitch"
                                :active-color="switchColor"
                                :active-value="1"
                                :inactive-value="0"
                            />
                            <span v-if="!!form.updateTime" class="time">生效时间：{{form.updateTime}}</span>
                        </el-form-item>
                        <span class="remark">说明：需去售后管理再次打开自动售后才能生效</span>
                    </div>
                </div>
                <!-- <div class="card order-card">
                    <div class="title">
                        <span>自动申请采购备注</span>
                        <el-tooltip effect="dark" placement="right-start">
                            <div slot="content" class="lh20" style="width: 300px">
                                1.开启自动申请采购备注：在开启自动申请采购备注生效的那一刻，手动输入备注内容后，会自动同步到采购订单备注里面；
                                <br />2.关闭自动申请采购备注：系统暂停自动申请订单备注
                            </div>
                            <i class="el-icon-view el-icon-question"/>
                        </el-tooltip>
                    </div>
                    <div class="card-main">
                        <el-form-item label="自动采购备注：">
                            <el-switch
                                v-model="form.buyerMemoSwitch"
                                :active-color="switchColor"
                                :active-value="1"
                                :inactive-value="0"
                            />
                            <span v-if="!!form.updateTime" class="time">生效时间：{{form.updateTime}}</span>
                        </el-form-item>
                        <el-form-item label="采购备注：">
                            <el-input
                                class="inner-input"
                                style="width:250px;"
                                v-model="form.buyerMemo"
                                placeholder="请输入备注内容"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-checkbox label="抖店下单有买家留言时，自动备注到采购订单备注" v-model="form.buyerOrderMemoSwitch" :true-label="1" :false-label="0"></el-checkbox>
                        </el-form-item>
                    </div>
                </div> -->
                <div class="save">
                    <el-button class="btn" type="primary" @click="saveConfig">保存设置</el-button>
                    <el-button class="btn gray" type="primary" @click="resetConfig">重置为默认设置</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import { getConfig, saveConfig } from '@/api/dfh/dfhConfig'
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            switchColor: '#2F51FF',
            loadingFlag: false,
            form: {
                id: '',
                // dropShippingSwitch: 0,
                // dropShippingTiming: 0,
                accountOrderMode: 2,
                // waybillSwitch: 0,
                // dropShippingStartTime: '',
                pddVirtualSmsModel: 0,
                // undropBuyerMsgFlag: 0,
                // undropSellerMsgFlag: 0,
                // receiverFilter: '',
                // shippingAddressFilter: '',
                sellerRemarkSwitch: 0,
                sellerRemarkRules: 1,
                sellerFlag: 0,
                sellerRemark: '',
                deliverySwitch: 0,
                refundSwitch: 0,
                // buyerMemoSwitch: 0,
                autoForceDropShippingSwitch: 0,
                profitLossForceDropShipping: 0,
                // buyerMemo: '',
                // buyerOrderMemoSwitch: 0,
                updateTime: '',
                // dropShippingProductIds: '',
                purchaseAmountSwitch: 0,
                profitAmountSwitch: 0,
                placeOrderPhSwitch: 0,
                // delayOrderSwitch: 1,
                sendCodeSwitch: 1,
                // twoLogisticsType: -1,
                // placeRecipientsPhone: '' //手机号
            },
            value: '',
            // selectDropShippingProductIds: 0
        };
    },
    computed: {
        ...mapGetters(['siteConfig']),
    },
    created() {
        this.getConfig()
    },
    mounted () {},
    methods: {
        // switchChange() {
        //     if (this.form.ciphertextPlaceOrderSwitch == 0) {
        //         this.form.twoLogisticsType = -1
        //     }
        // },
        // onInput() {
        //     const data = this.form.dropShippingProductIds;
        //     if (data.indexOf('\n') !== -1) {
        //         const arr = data.split('\n').filter(e => e !== '');
        //         console.log(arr.join(','));
        //     }
        // },
        getConfig() {
            this.loadingFlag = true
            getConfig().then(res => {
                this.loadingFlag = false
                if (res.data.code !== 0) return this.$message.error('获取代发设置异常，请联系管理员');
                let data = res.data.data
                if (data) {
                    // if (data.dropShippingProductIds) {
                    //     this.selectDropShippingProductIds = 1;
                    //     if (data.dropShippingProductIds.indexOf(',') !== -1) {
                    //         data.dropShippingProductIds = data.dropShippingProductIds.split(',').join('\n');
                    //     }
                    // }
                    if (data.profitLossForceDropShipping) {
                        data.profitLossForceDropShipping = data.profitLossForceDropShipping / 100
                    }
                    this.form = data;
                }
            }).catch(() => {
                this.loadingFlag = false
                this.$message.error('获取代发设置异常，请联系管理员')
            })
        },
        saveConfig() {
            this.loadingFlag = true
            if (this.form.autoForceDropShippingSwitch == 1 && !this.form.profitLossForceDropShipping) {
                this.loadingFlag = false
                return this.$message.error('请输入强制代发利润金额')
            }
            // const dropShippingProductIds = this.form.dropShippingProductIds;
            // if (dropShippingProductIds && dropShippingProductIds.indexOf('\n') !== -1) {
            //     const ctx = dropShippingProductIds.split('\n').filter(e => e !== '');
            //     this.form.dropShippingProductIds = ctx.join(',');
            // }
            const params = {...this.form}
            if (this.form.autoForceDropShippingSwitch == 1) {
                params['profitLossForceDropShipping'] = params['profitLossForceDropShipping'] * 100
            }
            saveConfig(params).then(res => {
                const { data: { data } } = res;
                this.loadingFlag = false;
                if (res.data.code !== 0) {
                    this.$message.error('保存失败,' + res.data.msg)
                } else {
                    if (data) {
                        this.$message.success('保存成功');
                        // if (data.dropShippingProductIds && data.dropShippingProductIds.indexOf(',') !== -1) {
                        //     data.dropShippingProductIds = data.dropShippingProductIds.split(',').join('\n');
                        // }
                        if (data.profitLossForceDropShipping) {
                            data.profitLossForceDropShipping = data.profitLossForceDropShipping / 100
                        }
                        this.form = data;
                    }
                }
            }).catch((e) => {
                this.loadingFlag = false
                this.$message.error('保存失败')
            })

        },
        resetConfig() {
            this.getConfig()
        },
    },
};
</script>
<style lang="scss" scoped>
.dfh-config {
    padding-bottom: 40px;
    background: #fff;
    .dfh-content {
        .card{
            width: 80%;
            margin: 0 auto;
            margin-top: 16px;
            border-radius: 12px 12px 12px 12px;
            overflow: hidden;
            
            .title {
                width: 100%;
                height: 50px;
                display: flex;
                align-items: center;
                background: #fff;
                padding-left: 16px;
                text-indent: 11px;
                font-size: 18px;
                font-family: PingFang SC, PingFang SC;
                font-weight: bold;
                color: #3b4859;
                position: relative;

                &::before {
                    content: '';
                    display: block;
                    position: absolute;
                    width: 4px;
                    height: 15px;
                    top: 18px;
                    left: 16px;
                    border-radius: 5px;
                    background: $themeColor; ; 
                }
                i {
                    font-size: 10px;
                    color: rgba(0,0,0,0.5);
                    transform: translate(-8px, -4px);
                    margin-left: 2px;
                    
                }
            }
            .card-main {
                background: #fff;
                border-top: 1px solid #e9ecf0;
                padding-bottom: 18px;
                ::v-deep .el-form-item {
                    margin-bottom: 0px; 
                    line-height: 32px;
                    margin: 2px 0;
                }
                ::v-deep .el-input__icon.el-icon-time {
                    &::before {
                        display: none;
                    }
                }
                .time {
                    margin-left: 35px;
                    font-size: 14px;
                    color: #8998ac;
                }
                .remark {
                    font-size: 14px;
                    font-weight: bold;
                    color: #3b4859;
                    margin-left: 252px;
                }
                .inner-input {
                    position: relative;
                    ::v-deep .el-input__inner {
                        border-radius: 4px 4px 4px 4px;
                    }
                    ::v-deep .el-input-group__append {
                        position: absolute;
                        top: 50%;
                        right: 6px;
                        transform: translateY(-50%);
                        background: transparent;
                        border: none;
                        padding: 0;
                        color: #000;
                        right: 20px;
                    }
                }
                .inner-textarea {
                    position: relative;
                    ::v-deep .el-textarea__inner {
                        background: #EDF0FF;
                        border-radius: 4px 4px 4px 4px;
                    }
                }
            }
        }
        .auto-card {
            margin-top: 0px;
            .card-main {
                padding-top: 19px;
            }
        }
        .order-card {
            .card-main{
                padding-top: 16px;
                
            }
        }
        .filter-card {
            .card-main {
                padding: 20px 0px ;
                .inner-input{
                    margin-right: 10px;
                }
                i{
                    font-size: 16px;
                    color: rgba(0,0,0,0.5);
                    transform: translate(-8px, -1px);
                    margin: 2px;
                    
                }
            }
        }
        .save {
            width: 100%;
            margin-top: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            .btn {
                width: 106px;
            }
            .gray{
                width:150px;
                background:#D4D6D9 ;
                border-color: #D4D6D9;
                margin-left: 40px;
                &:focus, &:hover, &:hover {
                    background:#D4D6D9 ;
                    border-color: #D4D6D9;
                }
            }

        }
    }
}
</style>
