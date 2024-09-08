<template>
    <div class="execution dfh-order-index-pages-container" :class="total > 0 ? 'pb70' : 'pb10'" ref="dfhMain" v-loading="schemeLoading" element-loading-text="正在启动客户端，请稍后...">
        <div class="wrapper">
            <div class="header">
                <div class="px20">
                    <el-alert title="如遇到代发中的订单不进行支付，是由于前面单量比较多导致，需要排队请耐心稍等" type="warning" show-icon :closable="false"></el-alert>
                </div>


                <div class="filter-box mt20">
                    <el-form inline :model="formData" ref="form" label-width="80px" label-position="left">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="订单编号 :" prop="orderId">
                                    <el-input
                                        placeholder="请输入订单编号"
                                        v-model="formData.orderId"
                                        size="mini"
                                        style="width: 100%"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="采购单号 :" prop="pddOrderId">
                                    <el-input
                                        placeholder="请输入采购订单编号"
                                        v-model="formData.pddOrderId"
                                        clearable
                                        size="mini"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="下单时间 :" prop="createTimeArr">
									<el-date-picker
										v-model="formData.createTimeArr"
										type="daterange"
										range-separator="至"
										start-placeholder="开始日期"
										end-placeholder="结束日期"
                                        style="width: 65%;"
										size="mini"
										value-format="yyyy-MM-dd">
									</el-date-picker>
									<el-time-picker
                                        is-range
                                        v-model="formData.createTimeStr"
                                        range-separator="一"
                                        style="width: 33%; margin-left: 2%;"
										size="mini"
                                        :clearable="false"
                                        start-placeholder="开始时间"
                                        end-placeholder="结束时间"
                                        placeholder="选择时间范围"
                                        format="HH:mm"
                                        value-format="HH:mm">
									</el-time-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="规格绑定 :" prop="isBindPddSpec">
                                    <el-select
                                        v-model="formData.isBindPddSpec"
                                        placeholder="请选择"
                                        style="width: 100%"
                                        size="mini"
                                        clearable
                                    >
                                        <el-option label="已绑定" value="0"></el-option>
                                        <el-option label="未绑定" value="9"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="支付流水 :" prop="purchasePaymentNo">
                                    <el-input
                                        placeholder="请输入支付流水号"
                                        v-model="formData.purchasePaymentNo"
                                        clearable
                                        size="mini"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="采购时间 :" prop="pddOrderTimeArr">
                                    <el-date-picker
                                        v-model="formData.pddOrderTimeArr"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        style="width: 65%;"
                                        size="mini"
                                        value-format="yyyy-MM-dd">
                                    </el-date-picker>
                                    <el-time-picker
                                        is-range
                                        v-model="formData.pddOrderTimeStr"
                                        range-separator="一"
                                        style="width: 33%; margin-left: 2%;"
                                        size="mini"
                                        :clearable="false"
                                        start-placeholder="开始时间"
                                        end-placeholder="结束时间"
                                        placeholder="选择时间范围"
                                        format="HH:mm"
                                        value-format="HH:mm">
                                    </el-time-picker>
                                </el-form-item>
                            </el-col>

                            <!-- 第四行 -->
                            <el-col :span="10">
                                <el-form-item>
                                    <el-button type="primary" size="mini" @click.stop="initGetList" :loading="tableLoading" :disabled="tableLoading">
                                        <span>{{tableLoading ? '查询中' : '搜索'}}</span>
                                    </el-button>
                                    <el-button plain size="mini" @click.stop="resetForm('form')">
                                        <span>清空</span>
                                    </el-button>
                                    <el-button type="default" size="mini" @click.stop="exportOrder" style="margin-left:10px"
                                        v-loading.fullscreen.lock="fullscreenLoading"
                                    >
                                        <span>导出订单</span>
                                    </el-button>
                                    <el-dropdown class="ml10" @command="onImportBatchHandle">
                                        <el-button size="mini">
                                            <span>导入订单</span>
                                            <i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item command="book">小红书订单</el-dropdown-item>
                                            <el-dropdown-item command="other">其他订单</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div class="select-box">
                    <div class="pt20 pb10">
                        <el-button type="primary" size="small" @click.stop="bulkUndertakesTo">
                            <span>批量代发</span>
                        </el-button>
                        <el-dropdown class="ml10" @command="onBatchHandle">
                            <el-button size="small">
                                <span>批量操作</span>
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="encrypt">批量解密</el-dropdown-item>
                                <el-dropdown-item command="rebuy">批量重新补单</el-dropdown-item>
                                <el-dropdown-item command="repay">批量重新支付</el-dropdown-item>
                                <el-dropdown-item command="flagconfig">批量插旗备注</el-dropdown-item>
                                <el-dropdown-item command="cancelds">批量取消代发</el-dropdown-item>
                                <el-dropdown-item command="forcedrop">批量强制代发</el-dropdown-item>
                                <el-dropdown-item command="filterOrder">批量隔离订单</el-dropdown-item>
                                <el-dropdown-item command="shipping">批量手动发货</el-dropdown-item>
                                <el-dropdown-item command="cancelFilterOrder">批量取消隔离订单</el-dropdown-item>
                                <el-dropdown-item command="getspec">获取采购商品规格</el-dropdown-item>
                                <el-dropdown-item command="mutiPay">批量支付订单</el-dropdown-item>
                                <el-dropdown-item command="mutiPurchaseNum">批量修改采购数量</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <div class="single-model ml10">
                            <span class="mr10 single-label">拍单模式 :</span>
                            <span>{{orderConfig.accountOrderMode | orderModeMap}}</span>
                            <span class="color-l ml20" style="cursor: pointer;" @click="$router.push('/dfhConfig/index')">切换</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center flex-wrap">
                        
                            <template v-if="hasIntegralSkipTime">
                                <div class="tags mr15 mt10">
                                    <span>当前领券不扣积分</span>
                                    <span>，到期时间：</span>
                                    <span>{{ integralSkipExpireTime }}</span>
                                </div>
                            </template>

                            <template v-else-if="expireDay">
                                <!-- <div class="tags mr15 mt10">
                                    <span>规则：1688/淘特/小红书代发一单扣3积分</span>
                                </div> -->
                            </template>
                            <template v-else>
                                <div class="tags mr15 mt10">
                                    <span>当前用户未开通会员，无法使用供应链订单</span>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="tabs mt10">
                        <!-- tabs 选项卡 -->
                        <el-tabs v-model="formData.status" @tab-click="onClickTabs" stretch :class="tabClass()">
                            <el-tab-pane
                                :name="item.name"
                                v-for="(item, index) in tabs"
                                :key="index"
                            >
                                <template slot="label">
                                    <div :class="tabClass(item.name)">
                                        <span>{{ item.label }}</span>
                                        <span>({{ orderStatusCount[item.key] || 0 }})</span>
                                    </div>
                                </template>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>

            <div class="px20">
                <div class="table-main" v-loading="tableLoading">
                    <div class="theader">
                        <div class="theader--th pl15 pr40">
                            <el-checkbox v-model="checkedAll" @change="onChangeOrderId('all')"></el-checkbox>
                        </div>
                        <div class="theader--th w380">
                            <span>商品信息</span>
                        </div>
                        <div class="theader--th w360">
                            <span>利润</span>
                        </div>
                        <div class="theader--th w262">
                            <span>关联商品规格</span>
                        </div>
                        <div class="theader--th w200">
                            <span>物流信息</span>
                        </div>
                        <div class="theader--th flex-1 text-right" style="padding-right: 3.5%;">
                            <span>操作</span>
                        </div>
                    </div>

                    <!-- 新版详情 -->
                    <div class="dfh-order-items mt12">
                        <div class="dfh-order-item" v-for="(item, index) in tableData" :key="index">
                            <div class="order-item-header">
                                <el-checkbox v-model="item.check" @change="onChangeOrderId(item.id)"></el-checkbox>
                                <div class="item-left">
                                    <div>
                                        <span>订单编号：{{item.parentOrderId || '-'}}
                                            <i
                                                class="iconfont icon-bianzu13 ml5 mr30 font13 color-theme"
                                                style="cursor: pointer;"
                                                v-clipboard:copy="item.parentOrderId"
                                                v-clipboard:success="onCopy"
                                                v-clipboard:error="onError"
                                            ></i>
                                        </span>
                                        <span>子订单编号：{{item.orderId || '-'}}
                                            <i
                                                class="iconfont icon-bianzu13 ml5 font13 color-theme"
                                                style="cursor: pointer;"
                                                v-clipboard:copy="item.orderId"
                                                v-clipboard:success="onCopy"
                                                v-clipboard:error="onError"
                                            ></i>
                                        </span>
                                        <div>
                                            收货地址：
                                            <span class="color-red" v-if="item.decryptStatus == '0'">
                                                <span>尚未解密</span>
                                            </span>
                                            <template v-if="item.decryptStatus == '1'">
                                                <span>{{ item.encryptPostReceiver }}</span>
                                                <span class="pl10">{{ item.encryptPostTel }}</span>
                                                <span
                                                    class="pl10"
                                                >{{ item.province }} {{ item.city }} {{ item.town }} {{ item.street }}</span>
                                                <span class="pl10">{{ item.encryptDetail }}</span>
                                            </template>
                                            <span class="color-red" v-if="item.decryptStatus == '2'">
                                                <span>解密失败</span>
                                                <i class="el-icon-view"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="item-right">
                                    <div class="right-top">
                                        <span class="shop-name mr40 ellipsis-1">店铺名：{{ item.shopName }}</span>
                                        <span class="mr40">下单时间：{{ formatTime(item.createTime * 1000,'YYYY-MM-DD hh:mm:ss') }}</span>
                                        <span>发货时间剩余：<span class="color-red">{{ getRemainderTime(item.expShipTime) }}</span></span>
                                    </div>
                                    <div class="item-remark">
                                        商家备注：
                                        <template>
                                            <i
                                                class="el-icon-s-flag"
                                                :style="`color: ${colors(+item.sellerRemarkStars)}`"
                                            ></i>
                                            <el-tooltip
                                                effect="dark"
                                                placement="top"
                                                :content="item.sellerWords"
                                                :disabled="item.sellerWords && item.sellerWords.length < 30"
                                            >
                                                <span
                                                    class="ml10 ellipsis-1"
                                                    style="max-width: 450px;"
                                                >
                                                    <span>{{ item.sellerWords }}</span>
                                                </span>
                                            </el-tooltip>
                                        </template>
                                        <span class="note ml20 color-theme" style="cursor: pointer;" @click.stop="showFlagConfig(item)">
                                            <i class="iconfont icon-bianji"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="order-item-dd">
                                <div class="item-dd-unfold color-theme" style="cursor: pointer;" @click.stop="item.show = !item.show">
                                    <span>{{ item.show ? '收起' : '展开' }}</span>
                                    <i :class="`el-icon-arrow-${item.show ? 'up' : 'down'}`"></i>
                                </div>
                                <!-- 小红书默认商品图 -->
                                <el-image 
                                    class="purchase-image"
                                    v-if="item.btype === '101'"
                                    fit="cover"
                                    style="width: 52px; height: 52px; margin-right: 10px; border-radius: 5px;"
                                    src="/img/icon_xhs.png">
                                </el-image>
                                <!-- 其他默认商品图 -->
                                <el-image 
                                    class="purchase-image"
                                    v-else-if="item.btype === '102'"
                                    fit="cover"
                                    style="width: 52px; height: 52px; margin-right: 10px; border-radius: 5px;"
                                    src="/img/icon_ohter.png">
                                </el-image>
                                <!-- 抖店商品图 -->
                                <el-image 
                                    class="purchase-image"
                                    v-else
                                    fit="cover"
                                    style="width: 52px; height: 52px; margin-right: 10px; border-radius: 5px;"
                                    :preview-src-list="[item.pic && item.pic.indexOf('http')!==-1 ? item.pic : (`https://p9-aio.ecombdimg.com/obj/`+ item.pic)]"
                                    :src="item.pic && item.pic.indexOf('http')!==-1 ? item.pic : (`https://p9-aio.ecombdimg.com/obj/`+ item.pic)">
                                </el-image>
                                <!-- 抖店商品信息 -->
                                <div class="item-dd-goods lh16">
                                    <el-tooltip
                                        effect="dark"
                                        placement="top"
                                        :content="item.name"
                                        :disabled="item.name && item.name.length < 20"
                                    >
                                        <p class="dd-goods-title">{{ item.name || '-' }}</p>
                                    </el-tooltip>
                                    <p class="col-g font-w-500 mt3">{{ item.spec }} x{{ item.itemNum }}</p>
                                </div>
                                <!-- 抖店价格 -->
                                <div class="item-dd-goodPrice lh16 ml50 mr80">
                                    <p>¥ {{ (item.orderAmount / 100).toFixed(2) || '-' }}</p>
                                    <p class="col-g font-w-500 text-right">x{{ item.itemNum }}</p>
                                </div>
                                <!-- 抖店金额 -->
                                <div class="item-dd-profit lh18">
                                    <p><span class="dd-label">采购实付金额：</span>¥ {{ (item.pddMoney / 100).toFixed(2) || '-' }}</p>
                                    <p><span class="dd-label">销售实收金额：</span>¥ {{ (item.payAmount / 100).toFixed(2) || '-' }}</p>
                                    <p><span class="dd-label">利润率：</span><span class="color-red">{{ profitComputed(item)}}</span></p>
                                    <!-- <p><el-button type="text" style="margin: 0; padding: 0;">查看明细</el-button></p> -->
                                </div>
                                <!-- 采购金额 -->
                                <div class="item-dd-purchase-profit lh18 ml30 mr80" style="width: 135px;">
                                    <p>
                                        <span class="dd-label">采购数量：</span>
                                        {{ item.purchaseQuantity || item.itemNum }}
                                        <i
                                            v-if="item.status == 1"
                                            class="el-icon-edit font14 color-theme ml10"
                                            style="cursor: pointer;"
                                            @click="editOrderNum(item)"
                                        ></i>
                                    </p>
                                    <p><span class="dd-label">利润：</span><span class="color-red">¥ {{ item.pddMoney ? ((Number(item.payAmount) + Number(item.promotionPlatformAmount) - item.pddMoney) / 100).toFixed(2) : '-'}}</span></p>
                                </div>
                                <!-- 采购商品图 -->
                                <el-image
                                    class="purchase-image"
                                    fit="cover"
                                    style="width: 52px; height: 52px; margin-right: 10px; border-radius: 5px;"
                                    :preview-src-list="[item.thumbUrl]"
                                    :src="item.thumbUrl">
                                </el-image>
                                <!-- 采购sku信息hover全标题 -->
                                <div class="item-dd-purchase-sku lh16 mr60">
                                    <el-tooltip
                                        effect="dark"
                                        placement="top"
                                        :content="item.newPddSpec"
                                        :disabled="!item.newPddSpec || item.newPddSpec.length < 10"
                                    >
                                        <p style="width: 145px;" class="ellipsis-1">{{ item.newPddSpec || '未绑定' }}</p>
                                    </el-tooltip>
                                    <p class="color-red">¥ {{item.unitPrice ? item.unitPrice.toFixed(2) : '-'}}</p>
                                    <p class="mt6">
                                        <!-- <el-button type="text" v-if="item.bindWelfareGoods == 1 || item.placeOrderModel == 1" style="margin: 0; padding: 0;">
                                            <span>福利品</span>
                                        </el-button> -->
                                        <el-button type="text" class="purchase-btn" @click.stop="addCustomSku(item)" v-if="item.status == 1" style="margin: 0; padding: 0;">
                                            <span>采购下单</span>
                                        </el-button>
                                        <el-button type="text" class="benefits-btn" v-else-if="item.placeOrderModel == 2" style="margin: 0; padding: 0;">
                                            <span>采购下单</span>
                                        </el-button>
                                        <!-- <el-button type="text" @click.stop="updateSku(item)" v-else style="margin: 0; padding: 0;">
                                            <span>关联规格</span>
                                        </el-button> -->
                                    </p>
                                </div>
                                <!-- 物流信息 -->
                                <div class="item-dd-logistics lh18">
                                    <p>快递公司：{{ item.shippingName || '-' }}</p>
                                    <p>快递单号：{{ item.trackingNumber || '-' }}</p>
                                    <p v-if="(item.platform == 1 || item.platform == 2) && item.trackingNumber && (item.status == 6 || item.status == 7)">
                                        <el-button type="text" style="padding: 0; margin: 0;" @click="onViewLogistics(item)">查看物流</el-button>
                                    </p>
                                </div>

                                <!-- 操作功能 -->
                                <div class="option-btn" v-if="formData.status != 14">
                                    <div v-if="item.decryptStatus != 1">
                                        <el-button type="text" @click.native="onEncrypt(item)">手动解密</el-button>
                                    </div>
                                    <div v-if="((item.status == 1 && item.decryptStatus == 1) || item.status == 3) && (item.status == 3 || item.bindWelfareGoods == 1)">
                                        <el-button type="text" @click.native="manualUndertakesToRow(item)">
                                            <span v-if="item.status == 3">重新代发</span>
                                            <span v-else-if="item.bindWelfareGoods == 1">手动代发</span>
                                        </el-button>
                                    </div>
                                    <!-- 供应链订单不能直接重新支付 -->
                                    <div v-if="item.status == 4 && item.platform == 0">
                                        <el-button type="text"  @click.native="onRepay(item)">重新支付</el-button>
                                    </div>
                                    <div v-if="item.status == 9 || item.status == 2 || item.status == 3">
                                        <el-button type="text" @click.native="cancelUndertakesToRow(item)">取消代发</el-button>
                                    </div>
                                    <div v-if="item.status == 2 || item.status == 4">
                                        <div><el-button type="text" @click.native="onDetectioPddPay(item)">检测支付状态</el-button></div>
                                        <div><el-button type="text" @click.native="onReloadPddPayUrl(item)">刷新支付链接</el-button></div>
                                    </div>
                                    <div v-if="item.status == 5">
                                        <el-button type="text" @click.native="onManualShipping(item)">手动发货</el-button>
                                    </div>
                                    <div v-if="item.status == 5 || item.status == 6 || item.status == 7">
                                        <div v-if="item.status == 6 || formData.status == 13">
                                            <el-tooltip effect="dark" content="请确保当前订单已经退款成功，才可重新补发" placement="left">
                                                <el-button type="text" @click.native="reorder(item)">重新补单</el-button>
                                            </el-tooltip>
                                        </div>
                                        <div v-else>
                                            <el-tooltip effect="dark" popper-class="placeOrderModel-popper" content="请确保当前订单已经退款成功，才可重新补发，该功能仅支持采购未发货退款订单去使用" placement="left">
                                                <el-button type="text" disabled>重新补单</el-button>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                    <div v-if="item.status == 3">
                                        <el-button type="text" @click.native="onForceDropShipping(item)">强制代发</el-button>
                                    </div>
                                </div>
                            </div>

                            <!--采购信息 -->
                            <div class="order-item-purchase mt10" v-show="item.show">
                                <el-table border :data="[item]" headerCellClassName="header-cell-bg-color" style="width: 100%;">
                                    <el-table-column
                                        label="商品销售信息"
                                        min-width="250">
                                        <template slot-scope="{row}">
                                            <p>
                                                <span class="item-purchase-table-label">商品ID：</span>
                                                {{row.productId}}
                                                <i
                                                    class="iconfont icon-bianzu13 ml5 font13 color-theme"
                                                    style="cursor: pointer;"
                                                    v-clipboard:copy="item.productId"
                                                    v-clipboard:success="onCopy"
                                                    v-clipboard:error="onError"
                                                ></i>
                                            </p>
                                            <p><span class="item-purchase-table-label">付款时间：</span>{{row.payTime}}</p>
                                            <p><span class="item-purchase-table-label">订单状态：</span><span class="color-theme">{{ row.orderStatusDesc }}</span></p>
                                            <p>
                                                <span class="item-purchase-table-label">售后状态：</span>
                                                <span v-if="row.refundStatus==0">-</span>
                                                <span v-else-if="row.refundStatus==1">待退款</span>
                                                <span v-else-if="row.refundStatus==2">退款中</span>
                                                <span v-else-if="row.refundStatus==3">退款成功</span>
                                                <span v-else-if="row.refundStatus==4">退款失败</span>
                                            </p>
                                            <p><span class="item-purchase-table-label">买家留言：</span>{{ row.buyerWords || '-' }}</p>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="商品采购支付信息"
                                        min-width="324">
                                        <template slot="header">
                                            <span>商品采购支付信息</span>
                                            <span class="ml10">
                                                <el-tag effect="dark" size="mini" v-if="item.platform == 3">淘特订单</el-tag>
                                                <el-tag effect="dark" size="mini" v-else-if="item.platform == 2">1688订单</el-tag>
                                                <el-tag effect="dark" size="mini" v-else-if="item.platform == 1">供应链订单</el-tag>
                                                <el-tag effect="dark" size="mini" v-if="item.pddOrderId && item.platform == 0">{{orderTag(item.accountOrderMode, item.outerPlaceOrderMode)}}</el-tag>
                                            </span>
                                        </template>
                                        <template slot-scope="{row}">
                                            <p><span class="item-purchase-table-label">下单账号：</span>{{ row.pddUserName || '-' }}</p>
                                            <p><span class="item-purchase-table-label">商品链接：</span><el-button type="text" style="padding: 0; margin: 0; vertical-align: initial;" @click="onPurchaseUrlView(row.pddPurchaseUrl)"> 查看</el-button></p>
                                            <p><span class="item-purchase-table-label">商品规格：</span><span v-if="row.pddSpec">{{ row.pddSpec || '-' }} x{{row.purchaseQuantity || 1}}</span><span v-else>-</span></p>
                                            <p><span class="item-purchase-table-label">商品ID：</span>{{ row.pddGoodsId || '-' }}</p>
                                            <p><span class="item-purchase-table-label">采购单号：</span>{{ row.pddOrderId || '-' }}</p>
                                            <p><span class="item-purchase-table-label">下单时间：</span>{{ row.pddOrderTime || '-' }}</p>
                                            <p><span class="item-purchase-table-label">支付时间：</span>{{ row.pddPayTime || '-' }}</p>
                                            <p>
                                                <el-popover
                                                    placement="right"
                                                    popper-class="item-purchase-table-popover"
                                                    width="300"
                                                    trigger="hover">
                                                    <p><span class="item-purchase-table-label">支付方式：</span>{{row.pddPayType != null ? pddPayOpt[row.pddPayType] : '-'}}</p>
                                                    <p><span class="item-purchase-table-label">支付账号：</span>{{ row.pddPayName || '-' }}</p>
                                                    <p><span class="item-purchase-table-label">支付流水：</span>{{ row.purchasePaymentNo || '-' }}</p>
                                                    <p><span class="item-purchase-table-label">订单备注：</span>{{ row.purchaseRemark || '-' }}</p>
                                                    <el-button type="text" slot="reference" style="padding: 0; margin: 0;">更多信息</el-button>
                                                </el-popover>
                                            </p>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="代发状态"
                                        min-width="180">
                                        <template slot-scope="{row}">
                                            <div class="font14 font-w500">{{ row.status | statusFormats }}</div>
                                            <div class="color-red">
                                                <el-tooltip
                                                    v-if="row.status == '3'"
                                                    :content="row.loseStatusHint"
                                                    placement="bottom"
                                                    effect="dark"
                                                >
                                                    <p class="ellipsis-3 mt20">
                                                        <span>{{ row.loseStatusHint }}</span>
                                                    </p>
                                                </el-tooltip>
                                                <p class="mt20" v-else-if="row.status == '5' && row.pddStatusDesc">
                                                    <!-- PDD风控审核中 -->
                                                    {{row.pddStatusDesc}}
                                                </p>
                                                <p class="mt20" v-else-if="formData.status == 14 && row.status == '5'">
                                                    <!-- PDD风控审核中 -->
                                                    采购审核订单中
                                                </p>
                                                <el-tooltip
                                                    v-else-if="row.status == '5' && row.shippingErrorMsg != null && row.shippingErrorMsg != ''"
                                                    :content="row.shippingErrorMsg"
                                                    placement="bottom"
                                                    effect="dark"
                                                >
                                                    <p class="color-r ellipsis-2 mt20 lh20">
                                                        <span v-if="row.shippingErrorMsg == '店铺不存在或未授权'">
                                                            发货异常：店铺授权已到期 <a class="color-l" href="/#/dfh/shop/index">点击前往授权</a>
                                                        </span>
                                                        <span v-else>发货异常：{{ row.shippingErrorMsg }}</span>
                                                    </p>
                                                </el-tooltip>
                                                <el-tooltip
                                                    v-else-if="row.status == '1' && row.decryptErrorMsg != null && row.decryptErrorMsg != '' && row.decryptStatus != '1'"
                                                    :content="row.decryptErrorMsg"
                                                    placement="bottom"
                                                    effect="dark"
                                                >
                                                    <p class="color-r ellipsis-2 mt20 lh20">
                                                        <span v-if="row.decryptErrorMsg == 'access_token已过期'">
                                                            解密异常：店铺授权已到期 <a class="color-l" href="/#/dfh/shop/index">点击前往授权</a>
                                                        </span>
                                                        <span v-else>解密异常：{{ row.decryptErrorMsg }}</span>
                                                    </p>
                                                </el-tooltip>
                                                <el-tooltip
                                                    v-else-if="row.status == '4'"
                                                    :content="row.payRemark"
                                                    placement="bottom"
                                                    effect="dark"
                                                >
                                                    <p class="color-r ellipsis-2 mt20 lh20">
                                                        <span>{{ row.payRemark }}</span>
                                                    </p>
                                                </el-tooltip>
                                                <p class="color-r mt20" v-else-if="formData.status == 11">
                                                    <!-- 24h未发货 -->
                                                    {{getRemainderTime(row.expShipTime)}}内发货
                                                </p>
                                                <p class="color-r mt20" v-else-if="formData.status == 12">
                                                    <!-- 超时未发货 -->
                                                    发货已超时{{getRemainderTime(row.expShipTime, 'dec')}}
                                                </p>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="消耗积分"
                                        min-width="120">
                                        <template slot-scope="{row}">
                                            <div class="font14">
                                                {{row.placeOrderDeductScore || '-'}}
                                                <!-- <span>{{row.placeOrderDeductScore > 0 ? `本次消耗${row.placeOrderDeductScore}积分` : '-'}}</span>
                                                <span>{{row.placeOrderDeductScore > 0 && row.virtualNumStatus == 1 ? '，过滤代发短信' : ''}}</span> -->
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="代发补充地址"
                                        min-width="134">
                                        <template slot-scope="{row}">
                                            <div class="font14">
                                                补充地址
                                                <i
                                                    class="iconfont icon-bianji color-theme ml5 font14"
                                                    style="cursor: pointer;"
                                                    @click="editPddArea(row)"
                                                ></i>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="操作"
                                        min-width="125">
                                        <template slot-scope="{row}">
                                            <div v-if="row.status == '2'" style="margin-bottom: 10px;">
                                                <template v-if="row.platform == 3">
                                                    <!-- 淘特 -->
                                                    <el-button type="primary" size="mini" style="padding: 5px 7px;" @click="onPddZfbPay(row, 'taote')">支付宝支付</el-button>
                                                </template>
                                                <template v-else-if="row.platform == 2">
                                                    <!-- 1688 -->
                                                    <el-button type="primary" size="mini" style="padding: 5px 7px;" @click="onAliPayDialog(row)">支付宝支付</el-button>
                                                </template>
                                                <template v-else-if="row.platform == 1">
                                                    <!-- 供应链聚合支付 -->
                                                    <el-button type="primary" size="mini" style="padding: 5px 7px;" @click="onPayDialog(row)">立即支付</el-button>
                                                </template>
                                                <template v-else>
                                                    <!-- PDD代发 -->
                                                    <el-button type="primary" size="mini" style="padding: 5px 7px;" @click="handlePayCommand(row)" v-if="row.outerPlaceOrderMode == 0">采购代发支付</el-button>
                                                    <!-- PDD批发 -->
                                                    <el-button type="primary" size="mini" style="padding: 5px 7px;" @click="onPddZfbPay(row)" v-else>支付宝支付</el-button>
                                                </template>
                                            </div>
                                            <!-- 供应链 -->
                                            <!-- <el-button type="text" size="mini" class="purchase-opt-btn" v-if="row.platform == 1 && row.pddOrderId && (row.status == 5 || row.status == 6 || row.status == 7)" @click="onSupplyContact(row.pddOrderId)">联系供应商</el-button> -->
                                            <!-- 1688 -->
                                            <el-button type="text" size="mini" class="purchase-opt-btn" v-else-if="row.platform == 2 && row.pddOrderId && (row.status == 5 || row.status == 6 || row.status == 7)" @click="onAliContact(row)">联系商家</el-button>
                                            <!-- 淘特 -->
                                            <!-- <el-button type="text" size="mini" class="purchase-opt-btn" v-if="row.platform == 3 && row.pddOrderId && (row.status == 5 || row.status == 6 || row.status == 7)" @click="onTaoteContact(row)">联系商家</el-button> -->
                                            <!-- 供应链与1688申请售后 -->
                                            <div v-if="(row.platform == 1 || row.platform == 2) && row.pddOrderId && (row.status == 5 || row.status == 6) && row.pddPayStatus == 2">
                                                <el-button type="primary" size="mini" class="purchase-opt-btn" @click="onSupplyRefund(row.pddOrderId)" :loading="supplyRefundLoading">申请退款</el-button>
                                            </div>
                                            <div v-if="(row.platform == 1 || row.platform == 2) && row.pddOrderId && (row.status == 5 || row.status == 6) && row.pddPayStatus == 3">
                                                <el-button type="text" size="mini" class="purchase-opt-btn">申请退款中</el-button>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                    <div class="empty mt100" v-if="!tableData.length && !tableLoading">
                        <el-empty
                            description="暂时没有找到任何订单信息"
                            :image-size="100"
                        ></el-empty>
                    </div>
                </div>
                <div class="pagination flex flex-row-reverse order-pagination" v-if="total > 0">
                    <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page.sync="formData.current"
                        :page-size="formData.size"
                        :page-sizes="[10, 20, 50, 100, 200, 500]"
                        :total="total"
                        @current-change="onCurrentChange"
                        @size-change="onSizeChange"
                    ></el-pagination>
                </div>
            </div>
            <!-- 插旗备注|代发补充地址 -->
            <el-dialog
                :title="commonDialog.title"
                :visible.sync="commonDialog.dialogVisible"
                :width="commonDialog.width"
                :close-on-click-modal="false"
                @close="onClose"
            >
                <span>
                    <!-- 代发补充地址 -->
                    <PddArea v-if="commonDialog.tag === 'pa'" ref="pAForm" @ok="onSuccess" />
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" style="float: left;" @click="$refs.pAForm.handleAutoEncrypt()">自动识别</el-button>
                    <el-button type="primary" @click="onSave">保 存</el-button>
                    <el-button @click="commonDialog.dialogVisible = false">关 闭</el-button>
                </span>
            </el-dialog>
            <!-- 隔离订单 -->
            <FilterOrder
                :visible="filterOrderVisible"
                @close="filterOrderVisible =false"
                @filter="filterOrder"
            />
            <!-- 右侧问号悬浮按钮 -->
            <div class="right-problem" @click.stop="visible = true"></div>
            <!-- 右侧问号悬浮弹窗 -->
            <dialog-problem :visible="visible" @close="visible = false"></dialog-problem>
            <dialog-flag
                :visible="isFlagVisible"
                :data="flagInfo"
                :loading="isFlagLoading"
                @close="onClose"
                @on-success="onSuccessFlag"
            ></dialog-flag>
        </div>
        <el-backtop target=".dfh-order-index-pages-container" :bottom="70"></el-backtop>
        <dialog-custom-sku ref="dialogCustomSku" @success="onSuccess"/>
        <!-- 微信支付 -->
        <!-- <dialog-pay ref="dialogPay" @success="onPaySuccess"/> -->
        <!-- PDD代发连续支付 -->
        <dialog-pdd-muti-pay ref="dialogPddMutiPay" @success="getList"/>
        <!-- 支付宝支付 -->
        <dialog-zfb-pay ref="dialogZfbPay" @success="onZfbPaySuccess"/>
        <!-- 供应链聚合支付 -->
        <dialog-muti-pay ref="dialogMutiPay" @success="getList"/>
        <!-- 查看物流 -->
        <dialog-logistics ref="dialogLogistics"/>
        <!-- 导入收货信息订单 -->
        <dialog-import-addr ref="dialogImportAddr"></dialog-import-addr>
        <!-- 导入收货信息订单 -->
        <dialog-import-other ref="dialogImportOther"></dialog-import-other>
    </div>
</template>

<script>
import { detectioPddPay, detectioAliPay, reloadPddPay, encrypt, repay, fetchXhsList, saveFilterOrder, cancelFilterOrder, rebuy, getPddProductSpec, manualDropShipping, manualShipping, cancelDropShipping, addOrderRemark, exportXhsOrder, getExportStatus, orderBatchDecryption, updateOrderNum, mutiUpdateOrderNum, orderSupplyRefund, checkOrderFengKong } from '@/api/dfh/order'
import { getClientStatus } from '@/api/info'
import { getConfig, saveConfig, updateAccountOrderMode } from '@/api/dfh/dfhConfig'
import { mapGetters, mapState } from 'vuex'
import PddArea from './modules/PddArea'
import FilterOrder from './modules/FilterOrder'
import TableItemHeader from './modules/TableItemHeader'
import TimeFormats from '@/util/TimeFormats'
import { deepClone } from '@/util/util'

import DialogProblem from './modules/DialogProblem';
import DialogFlag from './components/DialogFlag';
import DialogCustomSku from './components/DialogCustomSku';
import DialogPay from './components/DialogPay';
import DialogZfbPay from './components/DialogZFBPay';
import DialogMutiPay from './components/DialogMutiPay';
import DialogPddMutiPay from './components/DialogPddMutiPay';
import DialogImportAddr from './components/DialogImportAddr'
import DialogImportOther from './components/DialogImportOther'

import MyAlert from '@/components/widget/MyAlert';
import DialogLogistics from './components/Dialoglogistics'
export default {
    name: 'dfhorder',
    components: {
        PddArea,
        FilterOrder,
        TableItemHeader,

        DialogProblem,
        MyAlert,
        DialogFlag,
        DialogCustomSku,
        DialogPay,
        DialogZfbPay,
        DialogMutiPay,
        DialogPddMutiPay,
        DialogLogistics,
        DialogImportAddr,
        DialogImportOther
    },
    filters: {
        statusFormats(status) {
            switch (+status) {
                case 1: return '未开始代发';
                case 2: return '支付中';
                case 3: return '代发失败';
                case 4: return '支付失败';
                case 5: return '待上家发货';
                case 6: return '上家已发货';
                case 7: return '代发完成';
                case 8: return '已退款';
                case 9: return '代发中';
                default:
                    break;
            }
        },
        // 拍单模式Map
        orderModeMap (status) {
            switch (+status) {
                case 0: return '普通模式';
                case 1: return '机器人模式';
                case 2: return '个人号模式';
            }
        },
        // 采购模式Map
        placeOrderModeMap (status) {
            switch (+status) {
                case 0: return '批发';
                case 1: return '代发';
            }
        },
        rounding (val) {
            if (val == 0) {
                return 0
            }
            return (val / 100).toFixed(2)
        }
    },
    watch: {
        dfhStatus (val, oldVal) {
            if (val != null) {
                const today = this.$moment().format('YYYY-MM-DD')
                this.$refs.form && this.$refs.form.resetFields()
                this.formData = {
                    ...this.formData,
                    createTimeArr: [today, today],
                    payAmountStart: undefined,
                    payAmountEnd: undefined,
                    status: val,
                    current: 1
                }
                this.getList();
                this.$store.commit('SET_DFHSTATUS', null)
            }
        },
    },
    data() {
        return {
            fullscreenLoading: false,
            integral: 0, // 当前可用积分
            hasIntegralSkipTime: 0,
            integralSkipExpireTime: 0,
            orderStatusCount: {},

            formData: {
                shopId: undefined, //店铺
                orderId: undefined, // 订单ID
                productId: undefined, // 商品ID
                decryptStatus: undefined, // 解密状态
                refundStatus: '0', // 售后状态
                orderStatus: '', // 订单状态
                sellerRemarkStars: undefined, // 旗帜
                sellerWords: undefined, // 商家备注
                createTimeArr: [], // 下单时间
                createTimeStr: ['00:00', '23:59'],
                pddOrderTimeStr: ['00:00', '23:59'],
                buyerWords: undefined, // 买家留言
                isBindPddPurchaseUrl: undefined, // 是否关联采购链接
                isBindPddSpec: undefined, // 是否绑定PDD规格
                pddOrderTimeArr: [], // PDD下单时间
                pddPayTimeArr: undefined, // PDD支付时间
                purchasePaymentNo: '',
                loseStatusHint: undefined, // 代发失败原因
                shippingErrorMsg: undefined, // 发货失败原因
                payAmountStart: undefined,
                payAmountEnd: undefined,
                sellerWordsIf: undefined,
                expShipTimeOrderBy: '0',
                status: '0',
                current: 1, // 当前页数
                size: 10, // 每页显示多少条
                placeOrderModel: '',
                platform: undefined,
                addressChanged: null
            },
            total: 0, // 订单总数
            sellerRemarkStars: '', // 旗帜
            shopList: [], // 店铺列表
            orderStatusList: [ // 订单状态
                {
                    id: 1,
                    label: '全部',
                    value: '',
                }, {
                    id: 3,
                    label: '备货中',
                    value: '2',
                }, {
                    id: 4,
                    label: '已发货',
                    value: '3',
                }, {
                    id: 5,
                    label: '已关闭',
                    value: '4',
                }, {
                    id: 6,
                    label: '已完成',
                    value: '5',
                }
            ],
            flag: [
                {
                    id: 1,
                    label: '灰旗',
                    value: 0,
                }, {
                    id: 2,
                    label: '紫旗',
                    value: 1,
                }, {
                    id: 3,
                    label: '蓝旗',
                    value: 2,
                }, {
                    id: 4,
                    label: '绿旗',
                    value: 3,
                }, {
                    id: 5,
                    label: '橙旗',
                    value: 4,
                }, {
                    id: 6,
                    label: '红旗',
                    value: 5,
                },
            ],
            pddPayOpt: {
                0: '微信支付',
                1: 'QQ支付',
                2: '云闪付',
                3: '支付宝支付',
            },
            showMore: false, // 表单是否展开全部查询条件
            visible: false, // 右侧悬浮问号按钮
            checkedAll: false, // 勾选全部订单
            selecteds: [], // 选中的订单
            tableData: [], // 列表数据集合
            isSyncOrderVisible: false, // 是否显示同步订单弹窗
            isSpecVisible: false, // 是否显示新版绑定规格
            tableLoading: true,
            filterOrderVisible: false,
            commonDialog: {
                tag: '',
                title: '',
                width: '40%',
                dialogVisible: false
            },

            isSkuVisible: false,
            skuDialogInfo: {},
            specInfo: {},
            isFlagVisible: false,
            isFlagLoading: false,
            flagInfo: {},
            isFirst: true, // 记录首次查询列表

            // 选项卡
            tabs: [
                {
                    key: 'a',
                    label: '全部',
                    name: '0',
                }, {
                    key: 'b',
                    label: '未开始代发',
                    name: '1',
                }, {
                    key: 'j',
                    label: '代发中',
                    name: '9',
                }, {
                    key: 'd',
                    label: '代发失败',
                    name: '3',
                }, {
                    key: 'c',
                    label: '支付中',
                    name: '2',
                }, {
                    key: 'e',
                    label: '支付失败',
                    name: '4',
                }, {
                    key: 'f',
                    label: '待上家发货',
                    name: '5',
                }, {
                    key: 'g',
                    label: '上家已发货',
                    name: '6',
                }
            ],
            schemeLoading: false,
            clientStatus: 0,
            orderConfig: {},
            supplyRefundLoading: false
        }
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.user.userInfo,
            my: state => state.user.my,
            dfhStatus: state => state.common.dfhStatus,
        }),
        colors() {
            return function (index) {
                switch (index) {
                    case 0: return '#808080';
                    case 1: return '#7f6ff6';
                    case 2: return '#70cce2';
                    case 3: return '#66c186';
                    case 4: return '#f08e48';
                    case 5: return '#ed6c72';
                    default:
                        break;
                }
            };
        },
        // 会员等级描述
        expireLv () {
            try {
                return this.my.memberRight.description
            } catch (error) {
                return ''
            }
        },
        // 会员是否到期
        expireDay () {
            const now = Date.now()
            const rightTime = this.$moment(this.my.rightExpireTime)
            try {
                return this.$moment(rightTime).diff(now, 'minutes') > 0
            } catch (error) {
                return false
            }
        },
    },
    created() {
        this.initData();
    },
    mounted () {
        // const configGuide = window.localStorage.getItem('orderConfigGuide') || null
        // if (!configGuide) {
        //     this.$refs.dialogConfigGuide.showModel()
        // }
    },
    activated () {
        this.onClientStatus()
        // 查询下单模式
        this.onOrderConfig()
    },
    methods: {
        // 订单是否为供应链模式，则去掉PDD-
        platformPrefix (platform) {
            return ''
            // return platform == 1 || platform == 2 || platform == 3 ? '' : 'PDD-'
        },
        // 订单拍单模式
        orderTag (tag, type) {
            // type 1 -> 批发, 0 -> 代发
            const prefix = type == 1 ? '批发' : '代发'
            if (type == 1) {
                return '批发'
            }
            switch(tag) {
                case 0:
                    return `${prefix}.普通`
                case 1:
                    return `${prefix}.机器人`
                case 2:
                    return `${prefix}.个人号`
                default:
                    return `${prefix}.普通`
            } 
        },
        // 消耗积分计算
        pointDeductScore (row) {
            // 最终消耗积分
            const point = Number(row.placeOrderDeductScore || 0) + Number(row.couponsDeductScore || 0)
            // 订单利润
            const profits = row.pddMoney ? ((Number(row.payAmount) + Number(row.promotionPlatformAmount) - Number(row.pddMoney))) : 0
            // PDD优惠卷金额
            const pddCoupon = row.pddPromotionMoney || 0
            let pointType = '优惠券'
            let result = pddCoupon / 100
            if (!point) return '-'
            if (profits < pddCoupon) {
                pointType = '利润'
                result = profits / 100
            }
            return `本次消耗积分按${pointType}${result}元扣除${point}积分`
        },
        // 计算每一单的利润率
        profitComputed (item) {
            const profit = item.pddMoney > 0 ? (Number(item.payAmount) + Number(item.promotionPlatformAmount) - item.pddMoney) : '-'
            if (profit == '-') return '-'
            const profitPercent = (profit / item.pddMoney).toFixed(2)
            return (profitPercent * 100).toFixed(2) + '%'
        },
        /**
         * 秒转换成天时分秒
         */
        formatSeconds(value) {
            var time = `${parseInt(value)}秒`;
            if (parseInt(value) > 60) {
                var second = parseInt(value) % 60;
                var min = parseInt(value / 60);
                time = `${min}分`;
                if (min > 60) {
                    min = parseInt(value / 60) % 60;
                    var hour = parseInt(parseInt(value / 60) / 60);
                    time = `${hour}小时${min}分`;
                    if (hour > 24) {
                        hour = parseInt(parseInt(value / 60) / 60) % 24;
                        var day = parseInt(parseInt(parseInt(value / 60) / 60) / 24);
                        time = `${day}天${hour}小时${min}分`;
                    }
                }
            }
            return time;
        },
        /**
         * 计算超时发货剩余时间
         */
        getRemainderTime(startTime, by) {
            const end = (+startTime * 1000)
            let residue = (end - new Date().getTime()) / 1000;
            if (by === 'dec') {
                // 已超时的时间需要反过来计算
                residue = (new Date().getTime() - end) / 1000;
            }
            return residue > 0 ? this.formatSeconds(residue) : '-';
        },
        /**
         * 格式化时间戳
         */
        formatTime(value, format = 'YYYY-MM-DD hh:mm:ss') {
            if (typeof (value) === 'string') value = +value;
            return value ? new TimeFormats().convertTime(format, value) : '-';
        },
        /**
         * 格式化时间戳
         */
        formats(val) {
            const nowTime = this.formatTime(new Date().getTime(), 'YYYY-MM-DD hh:mm:ss');
            const targetTime = new Date(this.$moment(nowTime).subtract(val, 'days').calendar()).getTime();
            return this.formatTime(targetTime, 'YYYY-MM-DD hh:mm:ss');
        },
        /**
         * 二次封装 element-ui MessageBox 弹框
         */
        confirm(title) {
            return new Promise((resolve, reject) => {
                this.$confirm(title, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    try {
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }).catch(() => {

                });
            })
        },
        /**
         *
         */
        onClose() {
            this.commonDialog.tag = '';
            this.isFlagVisible = false;
            this.flagInfo = {};
        },
        /**
         * 初始化 查询 条件
         */
        async initData() {
            try {
                const start = this.$moment().subtract(1, 'day').format('YYYY-MM-DD')
                const end = this.$moment().format('YYYY-MM-DD')
                if (this.dfhStatus != null) {
                    // 如果是从工作台进来，默认差的是当天，而不是两天
                    this.formData.createTimeArr = [end, end]
                    this.formData.status = this.dfhStatus
                } else {
                    this.formData.createTimeArr = [start, end]
                }
                // 查询店铺列表
                const { data: { data } } = await this.$API.getShopList();
                this.shopList = data;
                // 获取用户积分
                await this.getMerchantInfo();
                // 查询代发订单列表
                await this.getList();
                // 查询下单模式
                await this.onOrderConfig()
                this.$store.commit('SET_DFHSTATUS', null)
                this.isFirst = false;
            } catch (error) {

            }
        },
        // 获取代发设置
        async onOrderConfig () {
            const { data } = await getConfig()
            console.log('onOrderConfig', data)
            this.orderConfig = data.data
        },
        // 保存代发设置
        async onOrderModeChange (val, oldVal) {
            try {
                const { data } = await updateAccountOrderMode({accountOrderMode: this.orderConfig.accountOrderMode})
                if (val == 2 && data.code == 3) {
                    // 个人号下单模式，判断是否已经添加了个人号
                    this.$confirm('系统检测到您还未添加个人号，请先添加代发个人号！', '温馨提示', {
                        confirmButtonText: '去添加',
                        cancelButtonText: '关闭',
                        closeOnClickModal: false,
                        type: 'warning'
                    }).then(() => {
                        this.$router.push('/dfh/privateAccount/index')
                        this.orderConfig.accountOrderMode = oldVal
                    }).catch(() => {
                        this.orderConfig.accountOrderMode = oldVal
                    })
                }
                this.getList()
            } catch (err) {
                
            }
        },
        // 保存PDD采购模式
        async onPddModelChange (val) {
            console.log('val', val)
            try {
                const params = {
                    pddPlaceOrderModel: val
                }
                const { data } = await saveConfig(params)
                console.log('data', data)
            } catch (error) {

            }
        },
        /**
         * 获取用户 当前可用积分
         */
        async getMerchantInfo() {
            try {
                const { data: { data } } = await this.$API.getMerchantInfo();
                this.integral = data.integral;
                this.hasIntegralSkipTime = data.hasIntegralSkipTime;
                this.integralSkipExpireTime = data.integralSkipExpireTime;
            } catch (error) {

            }
        },
        /**
         * 获取订单状态统计
         */
        async getOrderStatus(formData) {
            console.log( 'formData', formData)
            try {
                const { data: { data } } = await this.$API.getXhsOrderStatusCount(formData);
                this.orderStatusCount = data;
            } catch (error) {
                console.log('error', error)
            }
        },
        /**
         * 获取订单列表
         */
        async getList(opt = {}) {
            this.tableLoading = true;
            this.tableData = [];
            // 设置查询列表页数
            if (opt.page) this.formData.current = opt.page;
            const params = {...this.formData}
            const { status } = params
            // 状态为24h未发货或超时未发货时，需要基于待上家发货状态来筛选
            // 11 -> 24h小时未发货，12 -> 超时未发货，13 -> PDD退单风险订单，14 -> PDD风控审核中
            if (status == 11 || status == 12 || status == 13 || status == 14) {
                switch (status) {
                    case '11':
                        params['orderExpireStatus'] = 1
                    break
                    case '12':
                        params['orderExpireStatus'] = 2
                    break
                    case '13':
                        params['orderExpireStatus'] = 3
                    break
                    case '14':
                        params['pddStatus'] = 1
                    break
                }
                params['status'] = 5
            }
            console.log('formData', this.formData)
            if (this.formData.createTimeArr && this.formData.createTimeArr.length) {
                params['createTimeArr'] = [`${this.formData.createTimeArr[0]} ${this.formData.createTimeStr[0]}:00`, `${this.formData.createTimeArr[1]} ${this.formData.createTimeStr[1]}:59`]
            }
            if (this.formData.pddOrderTimeArr && this.formData.pddOrderTimeArr.length) {
                params['pddOrderTimeArr'] = [`${this.formData.pddOrderTimeArr[0]} ${this.formData.pddOrderTimeStr[0]}:00`, `${this.formData.pddOrderTimeArr[1]} ${this.formData.pddOrderTimeStr[1]}:59`]
            } else {
                params['pddOrderTimeArr'] = ''
            }
            try {
                // 设置请求参数
                const formData = {};
                for (const key in params) {
                    const row = params[key]
                    if(key == "sellerRemarkStars"){
                        formData["sellerRemarkStars"] = row
                    }
                    if (row) formData[key] = row;
                }

                if (formData.status === '0') formData.status = this.isFirst ? '1' : '';
                if (opt.filterOrderIds) formData.filterOrderIds = opt.filterOrderIds;
                this.getOrderStatus(formData);
                const { data: { data } } = await fetchXhsList(formData);
                this.tableData = data.order.records.map(e => ({
                    ...e,
                    show: true,
                    check: false,
                }));
                this.checkedAll = false;
                this.selecteds = [];
                this.total = data.order.total;
                if (opt.scroll && opt.scroll > 0) {
                    this.$nextTick(() => {
                        this.$refs.dfhMain.scrollTo(0, opt.scroll, true);
                    })
                }
            } finally {
                this.tableLoading = false;
            }
        },
        // 导出订单
        async exportOrder(opt = {}){
            const formData = {};
            for (const key in this.formData) {
                const row = this.formData[key];
                if (row) formData[key] = row;
            }
            if (!formData.pddOrderTimeArr || !formData.pddOrderTimeArr.length) {
                delete formData.pddOrderTimeArr
            } else {
                formData['pddOrderTimeArr'] = [`${formData.pddOrderTimeArr[0]} ${formData.pddOrderTimeStr[0]}:00`, `${formData.pddOrderTimeArr[1]} ${formData.pddOrderTimeStr[1]}:59`]
            }
            if (formData.status === '0') formData.status = this.isFirst ? '1' : '';
            if (opt.filterOrderIds) formData.filterOrderIds = opt.filterOrderIds;
            // 11 -> 24h小时未发货，12 -> 超时未发货，13 -> PDD退单风险订单，14 -> PDD风险审核中
            if (formData.status == 11 || formData.status == 12 || formData.status == 13 || formData.status == 14) {
                switch (formData.status) {
                    case '11':
                        formData['orderExpireStatus'] = 1
                    break
                    case '12':
                        formData['orderExpireStatus'] = 2
                    break
                    case '13':
                        formData['orderExpireStatus'] = 3
                    break
                    case '14':
                        formData['pddStatus'] = 1
                    break
                }
                formData['status'] = 5
            }
            getExportStatus().then(res =>{
                this.fullscreenLoading = true;
                exportXhsOrder(formData).then(res => {
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
                    this.$message.error('导出失败');
                });
            }) 
                
        },
        // 导入小红书代发订单
        importOrder () {
            this.$refs.dialogImportAddr.showModel(2)
        },
        // 导入其他平台订单
        importOther () {
            this.$refs.dialogImportOther.showModel()
        },
        /**
         * 切换订单状态
         */
        onClickTabs() {
            console.log('status', this.formData.status)
            const { status } = this.formData
            if (status != 5 && status != 11 && status != 12) {
                // 如果状态不是待上家发货，24h超时，超时未发货，PDD风控审核中则需清空排序筛选
                this.formData.expShipTimeOrderBy = '0'
            }
            if (status == 5) {
                // 当选中待上家发货时检测当前积分
                this.$bus.$emit('point-dialog')
            }
            this.formData.current = 1;
            this.getList();
        },
        /**
         * 初始化订单列表
         */
        initGetList() {
            this.formData.current = 1;
            this.getList();
        },
        /**
         * current 改变时会触发
         */
        onCurrentChange(page) {
            this.formData.current = page;
            this.getList();
        },
        /**
         * pageSize 改变时会触发
         */
        onSizeChange(size) {
            this.formData.size = size;
            this.getList();
        },
        /**
         * 勾选批量操作订单
         */
        onChangeOrderId(id) {
            // 设置全选
            if (id === 'all') {
                this.tableData.forEach(item => { item.check = this.checkedAll });
                this.selecteds = this.tableData.filter(e => e.check).map(e => e.id);
                return;
            }
            // 设置单个选中
            if (!this.selecteds.includes(id)) {
                this.selecteds.push(id);
            } else {
                const index = this.selecteds.indexOf(id);
                this.selecteds.splice(index, 1);
            }
            // 设置全选
            this.checkedAll = this.selecteds.length === this.tableData.length;
        },
        /**
         * 重置form表单
         */
        resetForm(formName) {
            this.formData.payAmountStart = undefined
            this.formData.payAmountEnd = undefined
            this.formData.createTimeStr=['00:00', '23:59']
            this.formData.pddOrderTimeStr=['00:00', '23:59']
            this.$refs[formName].resetFields()
            this.sellerRemarkStars = ''
        },
        onChangeSelect() {
            let flag = undefined;
            if(this.sellerRemarkStars != "" && this.sellerRemarkStars != undefined){
                flag = this.flag.find(e => e.label === this.sellerRemarkStars).value;
            }
            this.formData.sellerRemarkStars = flag;
        },
        /**
         * 修改抖店数量
         */
        editOrderNum (row) {
            const params = {
                orderId: row.orderId
            }
            this.$prompt('请输入采购数量', '修改采购数量', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                inputType: 'number'
            }).then(async ({ value }) => {
                params['sum'] = value
                const { data } = await updateOrderNum(params)
                this.$message.success('修改成功')
                row.purchaseQuantity = value
            }).catch(() => {
            })
        },
        // PDD代发支付
        async handlePayCommand (row) {
            const items = []
            try {
                const { data } = await checkOrderFengKong({})
                console.log('data', data)
                if (data.data == true) {
                    this.$confirm('代发订单出现风控，请更换支付账号！', '温馨提示', {
                        confirmButtonText: '知道了',
                        showCancelButton: false,
                        closeOnClickModal: false,
                        type: 'warning'
                    }).then(() => {
                    })
                } else {
                    // 筛选出PDD代发
                    this.tableData.filter(item => item.status == 2 && item.platform == 0 && item.outerPlaceOrderMode == 0).forEach(order => {
                        if (order.id === row.id) {
                            // 如果是当前点击的订单则置顶
                            items.unshift(order)
                        } else {
                            items.push(order)
                        }
                    })
                    this.$refs.dialogPddMutiPay.showModel(items)
                    // switch (command) {
                    //     case 'wx':
                    //         // 微信支付
                    //         this.$refs.dialogPay.showEdit({...item, payModelType: 0})
                    //     break;
                    //     case 'qq':
                    //         // QQ
                    //         this.$refs.dialogPay.showEdit({...item, payModelType: 1})
                    //     break;
                    //     case 'ysf':
                    //         // 云闪付
                    //         this.$refs.dialogPay.showEdit({...item, payModelType: 2})
                    //     break;
                    //     case 'zfb':
                    //         // 支付宝支付
                    //         this.$refs.dialogZfbPay.showEdit(item)
                    //     break;
                    // }
                }
            } catch (err) {

            }
        },
        // PDD批发支付宝支付
        onPddZfbPay (item, type) {
            this.$refs.dialogZfbPay.showEdit(item, type)
        },
        // 供应链订单发起聚合支付
        onPayDialog (item) {
            console.log('item', item)
            this.$refs.dialogMutiPay.showModel(item.orderId)
        },
        // 批量支付供应链订单
        onMutiPayDialog () {
            let purchaseAccount = null
            const items = this.tableData.filter(item => item.check)
            const ids = items.map(item => item.orderId)
            
            // 批量支付支持20单
            if (items.length && items.length > 20) return this.onAlert('批量支付仅支持20单以内！')

            // 只能勾选支付中且为供应链订单或1688订单
            const platform = items.some(item => item.status != 2 || item.platform == 0)
            if (platform) return this.onAlert('只能勾选支付中且为供应链订单或1688订单！')

            // 不支持多平台同时发起批量支付
            const supplyPlatform = items.some(item => item.platform == 1)
            const aliPlatform = items.some(item => item.platform == 2)
            const taotePlatform = items.some(item => item.platform == 3)
            if (supplyPlatform && aliPlatform && taotePlatform) return this.onAlert('暂不支持多平台同时发起批量支付！')

            // 只能支持同个采购账号批量支付
            const differentAccount = items.some(item => {
                if (purchaseAccount && purchaseAccount != item.pddUserName) {
                    return true
                } else {
                    purchaseAccount = item.pddUserName
                    return false
                }
            })
            if (aliPlatform && differentAccount) return this.onAlert('勾选支付订单中，不属于同一采购账号请分批支付')

            if (ids.length) {
                if (supplyPlatform) this.$refs.dialogMutiPay.showModel(ids.join(','))
                else if (aliPlatform) this.$refs.dialogAliMutiPay.showModel(ids.join(','))
            }
        },
        // 批量修改采购数量
        onMutiPurchaseNumDialog () {
            const ids = this.selecteds
            console.log('ids', ids)
            const params = {
                ids: ids
            }
            this.$prompt('请输入采购数量', '修改采购数量', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                inputType: 'number'
            }).then(async ({ value }) => {
                params['purchaseQuantity'] = value
                const { data } = await mutiUpdateOrderNum(params)
                console.log('data', data)
                this.$message.success('修改成功')
                this.getList()
            }).catch(() => {
            })
        },
        // 1688
        onAliPayDialog (item) {
            console.log('1688', item)
            this.$refs.dialogAliMutiPay.showModel(item.orderId)
        },
        // 微信支付，QQ支付，云闪付成功回调
        onPaySuccess (item) {
            this.onDetectioPddPay(item, 'pay')
        },
        // 支付宝支付成功回调
        onZfbPaySuccess (item) {
            this.onDetectioPddPay(item, 'zfb')
        },
        // 人工规格绑定
        addCustomSku (row) {
            const ids = [row.id]
            this.$refs.dialogCustomSku.showEdit(ids)
        },
        /**
         * 关联规格
         */
        updateSku(row) {
            // if(row.pddSkuId == null){
            //     // 新版绑定规格
                console.log('row', row)
                const pic = row.pic && row.pic.indexOf('http') !== -1 ? row.pic : `https://p9-aio.ecombdimg.com/obj/${row.pic}`
                const specData = {id: row.productId, shopId: row.shopId , name: row.name, img: row.pic ? pic : '', skuId: row.skuId, specName: row.spec}
                this.specInfo = specData
                this.isSpecVisible = true
            // }else{
                // 旧版绑定规格
                // this.skuDialogInfo = row;
                // this.isSkuVisible = true;
            // }
        },
        /**
         * 弹窗成功回调
         */
        onSuccess() {
            const scrollTop = this.$refs.dfhMain.scrollTop
            this.commonDialog.dialogVisible = false;
            this.getList({scroll: scrollTop})
        },
        /**
         * 插旗备注弹窗回调
         */
        async onSuccessFlag(form) {
            const ids = this.tableData.filter(e => e.check).map(e => e.id);
            this.isFlagLoading = true;
            try {
                const { data } = await addOrderRemark({
                    ids: [form.id || ids.join(',')],
                    "flagRemark":form.sellerWords,
                    "flagStar":form.sellerRemarkStars
                });
                this.$message.success('插旗成功');
                this.isFlagVisible = false;
                this.onSuccess()
            } finally {
                this.isFlagLoading = false;
            }
        },
        /**
         * 打开隔离订单弹窗
         */
        filterOrder(filterOrderIds) {
            this.filterOrderVisible = false;
            this.formData.status = '';
            this.getList({ filterOrderIds });
        },
        /**
         * 打开代发补充地址弹窗
         */
        editPddArea(row) {
            this.commonDialog.width = '40%';
            this.commonDialog.tag = 'pa';
            this.commonDialog.title = '代发补充地址';
            this.commonDialog.dialogVisible = !this.commonDialog.dialogVisible;
            this.$nextTick(function () {
                this.$refs.pAForm.rowId = row.id;
                this.$refs.pAForm.timestamp = new Date().getTime();
            });
        },
        /**
         * 打开插旗备注弹窗
         */
        showFlagConfig(row) {
            this.isFlagVisible = true;
            this.flagInfo = { ...row };
        },
        /**
         * 保存弹窗内容
         */
        onSave() {
            switch (this.commonDialog.tag) {
                case 'pa':
                    this.$refs.pAForm.ok();
                    break;
            }
        },
        /**
         * 批量操作按钮
         */
        onBatchHandle(command) {
            if (!this.selecteds.length) return this.$message.error('请至少勾选一条订单进行操作');
            if (command === 'rebuy') return this.batchReorder();
            if (command === 'encrypt') return this.batchDecryption();
            if (command === 'repay') return this.toPayFor();
            if (command === 'flagconfig') return this.flagRemark();
            if (command === 'cancelds') return this.cancelUndertakesTo();
            if (command === 'forcedrop') return this.batchMandatoryForwarding();
            if (command === 'filterOrder') return this.isolationOfTheOrder();
            if (command === 'cancelFilterOrder') return this.onCancelFilterOrder();
            if (command === 'getspec') return this.getBatchPddProductSpec();
            if (command === 'shipping') return this.onMutiManualShipping()
            if (command === 'mutiPay') return this.onMutiPayDialog()
            if (command === 'mutiPurchaseNum') return this.onMutiPurchaseNumDialog()
        },
        // 导入批量选择
        onImportBatchHandle (command) {
            if (command === 'book') return this.importOrder();
            if (command === 'other') return this.importOther();
        },
        /**
         * 重新补单
         */
        reorder(row){
            const h = this.$createElement;
            this.$msgbox({
                title: '提示',
                message: h('p', null, [
                    h('span', null, '确定要重新补发此订单吗？重补后会出现一个新的订单 '),
                    h('i', { style: 'color: red' }, '(请确保之前的订单已完成退款，才可重新补发)')
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(action => {
                try {
                    rebuy({ ids: row.id});
                    this.$message.success('重新补单成功');
                    this.getList();
                } catch (error) {
                }
            });
        },
        /**
         * 批量重新支付
         */
        batchReorder() {
            const h = this.$createElement;
            if (this.formData.status != 13) {
                this.$msgbox({
                    title: '提示',
                    message: h('p', null, [
                        h('span', null, '该功能仅支持去使用'),
                        h('i', { style: 'color: red' }, '采购未发货退款订单'),
                        h('span', null, '去使用')
                    ]),
                    showCancelButton: false,
                    confirmButtonText: '知道了',
                })
                return
            }
            const ids = this.tableData.filter(e => e.check).map(item => item.id)
            this.$msgbox({
                title: '提示',
                message: h('p', null, [
                    h('span', null, '确定要批量重新补发订单吗？重补后会出现一个新的订单 '),
                    h('i', { style: 'color: red' }, '(请确保之前的订单已完成退款，才可重新补发)')
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(action => {
                try {
                    rebuy({ ids: ids.join(',')})
                    this.$message.success('重新补单成功')
                    this.getList()
                } catch (error) {
                }
            });
        },
        // 自动解密
        onAutoDecode () {
            const formData = {};
            for (const key in this.formData) {
                const row = this.formData[key];
                if(key == "sellerRemarkStars"){
                    formData["sellerRemarkStars"] = row;
                }
                if (row) formData[key] = row;
            }
            this.$confirm('自动解密前请确保抖店解密余额充足，额度用完再申请提额!', '温馨提示', {
                confirmButtonText: '开始解密',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const { data } = await orderBatchDecryption(formData)
                    this.$message.success(data.msg)
                } catch (err) {
                }
            }).catch(() => {
            })
        },
        // 启动客户端
        onOpenClient (router = 'shop') {
            let timer = null
            let number = 0
            if (this.clientStatus == 1) {
                window.location.href = `kuaipai://client?router=${router}`
            } else {
                this.$refs.scheme.schemeOpen(`kuaipai://client?router=${router}`)
                this.schemeLoading = true
                timer = setInterval(async () => {
                    const { data } = await getClientStatus()
                    this.clientStatus = data.data
                    if (data.data == 1 || number >= 12) {
                        clearInterval(timer)
                        timer = null
                        number = null
                        this.$refs.scheme.clearTimer()
                    }
                    number++
                }, 5000)
            }
        },
        // 联系供应商商家
        onSupplyContact (id) {
            const router = `supply&orderId=${id}`
            this.onOpenClient(router)
        },
        // 联系旺旺商家
        onAliContact (item) {
            console.log('item', item)
            const url = `https://air.1688.com/app/ocms-fusion-components-1688/def_cbu_web_im/index.html?&touid=cnalichn${item.pddShopName}`
            if (window.electron) {
            // 发送到electron进行跳转
                window.electron.send({key: 'chromeUrl', url: url})
            } else {
                window.open(url)
            }
        },
        // 联系淘特商家
        onTaoteContact (item) {
            // window.open(`https://market.m.taobao.com/app/im/chat/index.html?&uid=${item.pddShopName}&type=web#/`)
            const router = `taoteRefund&orderId=${item.orderId}`
            this.onOpenClient(router)
        },
        // 发起供应商退款
        async onSupplyRefund (id) {
            console.log('id', id)
            this.supplyRefundLoading = true
            try {
                const { data } = await orderSupplyRefund({orderId: id})
                this.supplyRefundLoading = false
                if (data.code == 0) {
                    this.$message.success('申请成功')
                    this.getList()
                }
            } catch (err) {
                this.supplyRefundLoading = false
            }

        },
        // 切换下单模式
        async onSwitchModel () {
            const params = {
                ...this.orderConfig,
                placeOrderModel: this.orderConfig.placeOrderModel == 0 ? 2 : 0
            }
            const { data } = await saveConfig(params)
            this.orderConfig = data.data
        },
        // 检测客户端是否在线
        async onClientStatus () {
            const { data } = await getClientStatus()
            this.clientStatus = data.data
        },
        /**
         * 批量解密
         */
        batchDecryption() {
            const ids = this.tableData.filter(e => e.check && e.decryptStatus !== '1').map(e => e.id);
            if (!ids.length) return this.$message.error('只能勾选未解密的订单')
            this.confirm('确定要批量解密勾选的订单吗？').then(async () => {
                try {
                    await encrypt({ ids: ids.join(',') });
                    this.$message.success('操作成功，批量解密为异步方式解密，可能需要几分钟时间出，请耐心等待~');
                    this.getList();
                } catch (error) {

                }
            });
        },
        /**
         * 批量重新支付
         */
        async toPayFor() {
            const ids = this.tableData.filter(e => e.check && !['5', '6', '7'].includes(e.status)).map(e => e.id);
            if (!ids.length) return this.$message.error('只能勾选代发成功的订单')
            this.confirm('确定要重新支付勾选的订单吗？').then(async () => {
                try {
                    await repay({ ids: ids.join(',') });
                    this.$message.success('操作成功，请刷新代发中订单列表查看~');
                    this.getList();
                } catch (error) {

                }
            });
        },
        /**
         * 批量插旗备注
         */
        flagRemark() {
            this.isFlagVisible = true;
            this.flagInfo = {
                sellerRemarkStars: '0',
                sellerWords: '',
            };
        },
        /**
         * 批量取消代发
         */
        async cancelUndertakesTo() {
            const ids = this.tableData.filter(e => e.check);
            for (let i = 0; i < ids.length; i++) {
                if (ids[i].status === '5') return this.$message.error('不能勾选代发成功的订单');
                if (ids[i].status === '6') return this.$message.error('不能勾选已发货的订单');
                if (ids[i].status === '7') return this.$message.error('不能勾选代发完成的订单');
            };
            this.confirm('确定要批量取消勾选的代发订单吗？').then(async () => {
                try {
                    const { data } = await cancelDropShipping({ ids: ids.filter(e => !['5', '6', '7'].includes(e.status)).map(e => e.id).join(',') });
                    this.$message.success(data.msg);
                    this.getList();
                } catch (error) {

                }
            });
        },
        /**
         * 批量强制代发
         */
        batchMandatoryForwarding() {
            const ids = this.tableData.filter(e => e.check);
            const idsData = [];
            for (let i = 0; i < ids.length; i++) {
                // if (!ids[i].pddSkuId) return this.$message.error('不能勾选尚未关联拼多多规格的订单');
                if (!ids[i].pddSkuId) continue
                if (ids[i].status === '5') return this.$message.error('不能勾选代发成功的订单');
                idsData.push(ids[i].id);
            };
            this.confirm('确定要批量强制代发选中的订单吗？可能会出现采购金额比销售金额大。会自动过滤未绑定商品规格的订单。').then(async () => {
                try {
                    const { data } = await manualDropShipping({
                        ids: idsData.join(','),
                        force: true,
                    });
                    if (data.code == 501) {
                        this.manualDropTip()
                    } else {
                        this.$message.success('操作成功，批量代发为异步方式代发，可能需要几分钟时间出，请耐心等待');
                        this.getList();
                    }
                } catch (error) {

                }
            });
        },
        /**
         * 批量代发
         */
        bulkUndertakesTo() {
            if (!this.selecteds.length) return this.$message.error('请至少勾选一订单条进行操作');
            const ids = this.tableData.filter(e => e.check);
            const idsData = [];
            for (let i = 0; i < ids.length; i++) {
                // if (!ids[i].pddSkuId) return this.$message.error('不能勾选尚未关联拼多多规格的订单');
                if (!ids[i].pddSkuId) continue
                if (ids[i].status === '5') return this.$message.error('不能勾选代发成功的订单');
                idsData.push(ids[i].id);
            };
            this.confirm('确定要批量代发勾选的订单吗？会自动过滤未绑定商品规格的订单。').then(async () => {
                try {
                    const { data } = await manualDropShipping({
                        ids: idsData.join(','),
                        force: false,
                    });
                    if (data.code == 501) {
                        this.manualDropTip()
                    } else {
                        this.$message.success('操作成功，批量代发为异步方式代发，可能需要几分钟时间出，请耐心等待');
                        this.getList();
                    }
                } catch (error) {

                }
            });
        },
        /**
         * 批量隔离订单
         */
        isolationOfTheOrder() {
            const ids = this.tableData.filter(e => e.check).map(e => e.id);
            this.confirm('确定要批量隔离勾选的订单吗？').then(async () => {
                try {
                    const { data } = await saveFilterOrder({ ids: ids.join(',') });
                    this.$message.success('操作成功，请刷新隔离订单列表查看~');
                    this.getList();
                } catch (error) {

                }
            });
        },
        /**
         * 取消隔离订单
         */
        onCancelFilterOrder() {
            if (!this.selecteds.length) return this.$message.error('请至少勾选一订单条进行操作');
            const ids = this.tableData.filter(e => e.check);
            const idsData = [];
            for (let i = 0; i < ids.length; i++) {
                if (ids[i].status !== '10') return this.$message.error('只能勾选已隔离的订单');
                idsData.push(ids[i].id);
            };
            this.confirm('确定要取消隔离选中的订单吗？').then(async () => {
                try {
                    const { data } = await cancelFilterOrder({ ids: idsData.join(',') });
                    this.$message.success('操作成功，请刷新隔离订单列表查看~');
                    this.getList();
                } catch (error) {

                }
            });
        },
        /**
         * 获取PDD商品规格
         */
        getBatchPddProductSpec() {
            const ids = this.tableData.filter(e => e.check && e.hintInfo !== null).map(e => e.id);
            if (!ids.length) return this.$message.error('不能勾选尚未绑定采购链接的订单');
            this.confirm('确定要获取采购商品规格选中的订单吗？').then(async () => {
                try {
                    const { data } = await getPddProductSpec({ ids: ids.join(',') });
                    this.$message.success('该商品规格为异步方式获取，可能需要几分钟时间，请耐心等待~');
                    this.getList();
                } catch (error) {

                }
            });
        },
        /**
         * 手动解密
         */
        onEncrypt(row) {
            this.confirm('确定要手动解密吗？').then(async () => {
                try {
                    const { data } = await encrypt({ ids: row.id });
                    this.$message.success(data.msg)
                    this.getList();
                } catch (error) {

                }
            });
        },
        /**
         * 重新支付
         */
        onRepay(row) {
            this.confirm('确定要重新支付吗？').then(async () => {
                try {
                    const { data } = await repay({ ids: row.id });
                    this.$message.success("重新支付成功")
                    this.getList();
                } catch (error) {

                }
            });
        },
        /**
         * 取消代发
         */
        cancelUndertakesToRow(row) {
            this.confirm('确定要取消此代发订单吗？').then(async () => {
                try {
                    const { data } = await cancelDropShipping({ ids: row.id });
                    this.$message.success('取消代发成功');
                    this.getList();
                } catch (error) {

                }
            });
        },
        /**
         * 手动代发|重新代发
         */
        manualUndertakesToRow(row) {
            // 不是采购下单，不是福利品时才需要校验是否关联拼多多规格
            if (!this.orderConfig.placeOrderModel && row.bindWelfareGoods != 1 && !row.pddSkuId) {
                return this.$message.error('不能代发尚未关联采购规格的订单')
            }
            const text = row.status == 3 ? '重新代发' : '手动代发';
            this.confirm(`确定要${text}此订单吗？`).then(async () => {
                try {
                    const { data } = await manualDropShipping({ ids: row.id });
                    if (data.code == 501) {
                        this.manualDropTip()
                    } else {
                        this.$message.success(text + `成功`)
                        this.getList();
                    }
                } catch (error) {

                }
            });
        },
        manualDropTip () {
            this.$confirm('当前未开通会员，无法进行拍单', '提示', {
                confirmButtonText: '立即开通',
                cancelButtonText: '放弃',
                closeOnClickModal: false,
                type: 'warning'
            }).then(() => {
                this.$router.push('/members/index')
            }).catch(() => {
                this.visible = false
            })
        },
        /**
         * 检测支付状态
         */
        async onDetectioPddPay(row, pay) {
            if (row.platform == 1 || row.platform == 2) {
                // 检测支付状态需要区分采购平台
                this.confirm('确定要手动检测该订单支付状态吗？').then(async () => {
                    try {
                        await detectioAliPay({ orderId: row.orderId })
                        this.$message.success('正在检测中，稍后刷新列表查看检测结果！')
                    } catch (error) {
                    }
                });
            } else {
                // 微信支付回调
                if (pay == 'pay' || pay == 'zfb') {
                    await detectioPddPay({ ids: row.id })
                    pay == 'pay' && this.$refs.dialogPay.onClose()
                    pay == 'zfb' && this.$refs.dialogZfbPay.onClose()
                    this.onSuccess()
                } else {
                    this.confirm('确定要手动检测该订单支付状态吗？').then(async () => {
                        try {
                            await detectioPddPay({ ids: row.id });
                            this.$message.success('正在检测中，稍后刷新列表查看检测结果！')
                        } catch (error) {
                        }
                    });
                }
            }
        },
        // 重新获取支付链接
        onReloadPddPayUrl (row) {
            this.confirm('刷新后即可重新支付，确定要重新获取付款链接吗？').then(async () => {
                try {
                    await reloadPddPay({ id: row.id });
                    this.$message.success('刷新成功，请您稍后重新支付！');
                } catch (error) {

                }
            });
        },
        /**
         * 手动发货
         */
        onManualShipping(row) {
            this.confirm('确定要发货此订单吗？').then(async () => {
                try {
                    const { data } = await manualShipping({ ids: row.id });
                    this.$message.success(data.msg);
                    this.getList();
                } catch (error) {

                }
            });
        },
        /**
         * 手动发货
         */
        onMutiManualShipping() {
            const ids = this.selecteds.join(',')
            this.confirm('确定要发货此批订单吗？').then(async () => {
                try {
                    const { data } = await manualShipping({ ids: ids })
                    this.$message.success(data.msg)
                    this.getList()
                } catch (error) {

                }
            })
        },
        /**
         * 强制代发
         */
        onForceDropShipping(row) {
            // 不是采购下单，不是福利品时才需要校验是否关联拼多多规格
            if (!this.orderConfig.placeOrderModel && row.bindWelfareGoods != 1 && !row.pddSkuId) {
                return this.$message.error('不能代发尚未关联采购规格的订单')
            }
            this.confirm('确定要强制代发此订单吗？可能会出现采购金额比销售金额大。').then(async () => {
                try {
                    const { data } = await manualDropShipping({ ids: row.id, force: true });
                    this.$message.success('操作成功，强制代发为异步方式代发，可能需要几分钟时间，请耐心等待~');
                    this.getList();
                } catch (error) {

                }
            });
        },
        // 查看物流
        onViewLogistics (row) {
            this.$refs.dialogLogistics.showModel(row)
        },
        onCopy(e) { 　　 // 复制成功
            this.$message({
                message: '复制成功！',
                type: 'success'
            })
        },
        onError(e) {　　 // 复制失败
            this.$message({
                message: '复制失败！',
                type: 'error'
            })
        },
        // 状态栏颜色
        tabClass (value) {
            const val = value || this.formData.status
            switch (val) {
                case '11':
                    return 'warning'
                break
                case '12':
                case '13':
                case '14':
                    return 'danger'
                break
            }
        },
        onAlert (message) {
            this.$alert(message, '温馨提示', {
                confirmButtonText: '知道了',
                type: 'warning',
                closeOnClickModal: false
            })
        },
        // 查看采购链接
        onPurchaseUrlView (url) {
            if (window.electron) {
            // 发送到electron进行跳转
                window.electron.send({key: 'chromeUrl', url: url})
            } else {
                window.open(url)
            }
        },
    },
}
</script>
<style lang="scss">
.el-popper.item-purchase-table-popover {
    color: #333;
    font-size: 12px;
    text-align: inherit;
    .item-purchase-table-label {
        display: inline-block;
        width: 60px;
        color: #999;
    }
}
</style>
<style lang="scss" scoped>
.dfh-order-index-pages-container {
    padding-right: 10px;
    padding-left: 10px;
    box-sizing: border-box;
    height: calc(100vh - 120px);
    overflow: scroll;
    position: relative;
    &::-webkit-scrollbar {
        width: 12px;
        height: 12px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: #999;
    }
    &::-webkit-scrollbar-track-piece {
        background-color: #fff;
    }
    ::v-deep .el-loading-mask {
        position: fixed;
    }

    .w106 {
        width: 106px;
    }
    .w37 {
        width: 37px;
    }
    .w380 {
        width: 380px;
    }
    .w360 {
        width: 360px;
    }
    .w262 {
        width: 262px;
    }
    .w200 {
        width: 200px;
    }
    .w10-f {
        width: 10%;
    }
    .w15-f {
        width: 15%;
    }
    .w20-f {
        width: 20%;
    }
    .w30-f {
        width: 30%;
    }
    .w223 {
        width: 223px;
    }
    .w300 {
        width: 300px !important;
    }

    .text-center {
        text-align: center;
    }

    .wrapper {
        background: #ffffff;
        border-radius: 11px;
        padding: 13px 0;
        box-sizing: border-box;
        min-width: 1400px;
        .header {
            margin-bottom: 20px;
            box-sizing: border-box;
            position: relative;
            ::v-deep .el-alert {
                .el-alert__title {
                    font-weight: 500;
                }
            }
            .filter-box {
                width: 100%;
                // height: 107px;
                border-bottom: 1px solid #edeaea;
                box-sizing: border-box;
                padding: 0 20px;

                .form-box {
                    .form-item {
                        .label {
                            min-width: 70px;
                            display: inline-block;
                            text-align: right;
                            padding-right: 10px;
                            box-sizing: border-box;
                        }
                    }
                }
                ::v-deep .el-form-item {
                    margin-bottom: 10px;
                    padding-right: 25px;
                    display: flex;
                    height: 32px;
                    .el-form-item__label {
                        flex-basis: 80px;
                        font-weight: 500;
                    }
                    .el-form-item__content {
                        flex: 1;
                    }
                    .el-input-group__prepend {
                        padding: 0 9px;
                    }
                    .el-range-separator {
                        width: 10%;
                    }
                }
            }
            .select-box {
                width: 100%;
                border-bottom: 1px solid #edeaea;
                box-sizing: border-box;
                padding: 0 20px;
                .client-status {
                    float: right;
                    span {
                        color: #f63838;
                        cursor: pointer;
                    }
                    span:hover {
                        text-decoration: underline;
                    }
                }
                .tags {
                    padding: 0 20px;
                    height: 33px;
                    background: #ecf5ff;
                    border-radius: 4px;
                    color: #1890ff;
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                }
                .to-pay {
                    width: 80px;
                    height: 28px;
                    border-radius: 3px;
                    border: 1px solid #1890ff;
                    box-sizing: border-box;
                    background: #fff;
                    color: #1890ff;
                    font-size: 12px;
                }
                .single-model {
                    height: 32px;
                    line-height: 32px;
                    background-color: #f2f2f2;
                    border-radius: 4px;
                    padding: 0 12px;
                    display: inline-block;
                    .single-label {
                        vertical-align: middle;
                    }
                    .color-l {
                        vertical-align: middle;
                        color: #1890ff;
                    }
                }
            }
            .status-tip {
                position: absolute;
                bottom: -20px;
                left: 20px;
                font-size: 12px;
                color: #E6A23C;
            }
        }

        .table-main {
            min-height: 500px;
            ::v-deep .el-loading-mask {
                position: absolute;
            }
            .theader {
                background: #f2f2f2;
                height: 38px;
                display: flex;
                align-items: center;

                &--th {
                    font-size: 14px;
                    color: #333;
                    font-weight: 500;
                }
            }
            .dfh-order-items {
                .dfh-order-item {
                    color: #333;
                    font-size: 14px;
                    margin-bottom: 20px;
                    .order-item-header {
                        background-color: rgba(67, 107, 255, 0.05);
                        padding: 16px 15px;
                        display: flex;
                        line-height: 28px;
                        align-items: center;
                        position: relative;
                        .order-tag {
                            position: absolute;
                            top: -3px;
                            left: 0px;
                            .el-tag {
                                height: 20px;
                                line-height: normal;
                            }
                        }
                        .item-left {
                            width: 550px;
                            margin-left: 23px;
                            margin-right: 20px;
                        }
                        .item-right {
                            .right-top {
                                display: flex;
                                align-items: center;
                            }
                            .shop-name {
                                width: 165px;
                            }
                            .item-remark {
                                display: flex;
                                align-items: center;
                            }
                        }
                    }
                    .order-item-dd {
                        position: relative;
                        display: flex;
                        padding: 15px 12px;
                        font-size: 12px;
                        .item-dd-unfold {
                            align-self: center;
                            margin-right: 20px;
                        }
                        .item-dd-goods {
                            max-width: 150px;
                            .dd-goods-title {
                                height: 32px;
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 2;
                                overflow: hidden;
                            }
                        }
                        ::v-deep.purchase-image {
                            .el-image__error {
                                font-size: 12px;
                                text-align: center;
                            }
                        }
                        .dd-label {
                            width: 84px;
                        }
                        .option-btn {
                            width: 100px;
                            text-align: center;
                            position: absolute;
                            right: 1%;
                            top: 10px;
                            line-height: 28px;
                            .el-button {
                                padding: 0;
                                margin: 0;
                                font-size: 14px;
                            }
                        }
                    }
                    .order-item-purchase {
                        padding-left: 68px;
                        padding-right: 150px;
                        ::v-deep .el-table {
                            .el-table__header-wrapper .cell {
                                color: #333;
                                font-size: 14px;
                                padding: 0 20px;
                            }
                            .el-table__body {
                                .el-table__cell {
                                    padding: 12px 0;
                                    vertical-align: initial;
                                    background-color: #fff;
                                    .cell {
                                        padding: 0 20px;
                                        color: #333;
                                        .item-purchase-table-label {
                                            display: inline-block;
                                            width: 60px;
                                            color: #999;
                                            font-weight: 500;
                                        }
                                        .purchase-opt-btn {
                                            margin: 0 0 10px;
                                            padding: 0;
                                            font-size: 14px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .tbody {
                padding-top: 12px;
                min-height: 450px;
                box-sizing: border-box;
                position: relative;

                .empty {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .color-l {
                    color: #1890ff;
                }
                .goodsdesc {
                    padding: 0 25px;
                }

                .color-r {
                    color: #cc1818;
                }
                .cell {
                    width: 100%;
                    border: 1px solid #dedede;
                    box-sizing: border-box;
                    margin-bottom: 20px;
                    .cell-header {
                        width: 100%;
                        height: 83px;
                        background: #f9fafc;
                        padding-left: 35px;
                        box-sizing: border-box;
                        color: #666666;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        font-size: 14px;
                        position: relative;
                        .order-tag {
                            position: absolute;
                            right: 0;
                            top: 0;
                        }
                        .top {
                            display: flex;
                            align-items: center;
                            margin-bottom: 20px;
                            .remark {
                                display: flex;
                                align-items: center;

                                .note {
                                    display: flex;
                                    align-items: center;
                                    cursor: pointer;
                                    color: #1890ff;
                                }
                            }
                            .nowarp {
                                white-space: nowrap;
                            }
                        }
                        .bottom {
                            display: flex;
                        }
                    }
                    .cell-main {
                        width: 100%;
                        height: 186px;
                        position: relative;
                        &__item {
                            color: rgba(51, 51, 51, 0.65);
                            .unfold {
                                cursor: pointer;
                                color: #1890ff;
                                font-size: 12px;
                            }
                            &.info {
                                display: flex;
                                padding-top: 30px;
                                .lbox {
                                    width: 52px;
                                    height: 52px;
                                    border-radius: 4px;
                                    box-sizing: border-box;
                                    overflow: hidden;
                                    margin-top: 20px;
                                }
                                .rbox {
                                    flex: 1;
                                    padding-right: 40px;
                                    margin-left: 20px;
                                    line-height: 20px;
                                    font-size: 14px;

                                    .goodsID {
                                        white-space: nowrap;
                                        .icon-bianzu13 {
                                            color: #1890ff;
                                            margin-left: 5px;
                                            cursor: pointer;
                                        }
                                    }
                                }
                            }
                            &.spec {
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                .tags {
                                    width: 67px;
                                    height: 24px;
                                    background: #edf5ff;
                                    border-radius: 4px;
                                    border: 1px solid #e3f0fe;
                                    color: #62afff;
                                    font-size: 12px;
                                    text-align: center;
                                    line-height: 24px;
                                    cursor: pointer;
                                    margin-bottom: 10px;
                                }
                                .spec-btn {
                                    width: 67px;
                                    height: 24px;
                                    border-radius: 3px;
                                    border: 1px solid #0090ff;
                                    color: #1890ff;
                                    font-size: 12px;
                                    box-sizing: border-box;
                                    background: none;
                                }
                                .spec-btn.purchase-btn {
                                    background-color: #ecf5ff;
                                    border-color: #b3d8ff;
                                }
                                .spec-btn.benefits-btn {
                                    border: 1px solid #E6A23C;
                                    color: #E6A23C;
                                }
                            }

                            .dfh-btn {
                                width: 80px;
                                height: 28px;
                                background: #1890ff;
                                border-radius: 3px;
                                box-sizing: border-box;
                                font-size: 12px;
                                color: #fff;
                                display: block;
                                margin-bottom: 10px;
                            }
                            .dfh-btn.disabled {
                                color: #fff;
                                background-color: #c8c9cc;
                                cursor: no-drop;
                            }
                            .icon-bianji {
                                cursor: pointer;
                                color: rgb(70, 180, 109);
                                margin-left: 4px;
                            }
                        }
                    }
                    .cell-footer {
                        width: 100%;
                        padding: 0 35px 20px 35px;

                        &--table {
                            width: 100%;
                            border: 1px solid #dedede;
                            box-sizing: border-box;
                            display: flex;
                            flex-direction: column;
                            &__header {
                                width: 100%;
                                height: 49px;
                                background: #f6f8fc;
                                border-bottom: 1px solid #dedede;
                                box-sizing: border-box;
                                display: flex;

                                .th {
                                    width: calc(100% / 6);
                                    height: 49px;
                                    border-right: 1px solid #dedede;
                                    box-sizing: border-box;
                                    padding-left: 20px;
                                    display: flex;
                                    align-items: center;
                                    font-size: 14px;
                                    color: #666666;
                                    font-weight: 600;

                                    &:last-of-type {
                                        border-right: 0;
                                    }
                                }
                            }
                            &__body {
                                flex: 1;
                                display: flex;

                                .item-cell {
                                    width: calc(100% / 6);
                                    border-right: 1px solid #dedede;
                                    box-sizing: border-box;
                                    padding: 20px;
                                    color: rgba(0, 0, 0, 0.5);
                                    font-size: 12px;
                                    &:last-of-type {
                                        border-right: 0;
                                    }

                                    .icon-bianji {
                                        color: #1890ff;
                                        cursor: pointer;
                                    }

                                    .action {
                                        margin-top: 10px;
                                        color: #1890ff;
                                        cursor: pointer;
                                        font-size: 14px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .order-pagination {
        position: fixed;
        bottom: 18px;
        right: 0;
        z-index: 1;
        width: 100%;
        padding: 15px 0;
        padding-right: 20px;
        background-color: #fff;
        border-top: 1px solid #eaeaea;
    }

    .spec-content {
        .top {
            .lbox {
                .tags {
                    width: 59px;
                    height: 19px;
                    background: #edf5ff;
                    border-radius: 4px;
                    border: 1px solid #e3f0fe;
                    font-size: 12px;
                    color: #62afff;
                    cursor: pointer;
                    margin-bottom: 10px;
                }
                .get-spec {
                    width: 62px;
                    height: 23px;
                    border-radius: 3px;
                    border: 1px solid #0090ff;
                    box-sizing: border-box;
                    font-size: 12px;
                    color: #0090ff;
                    background: none;
                }
            }
        }
    }

    .right-problem {
        position: fixed;
        width: 70px;
        height: 70px;
        background-image: url("/img/common/problem.png");
        background-repeat: no-repeat;
        background-size: cover;
        top: 165px;
        right: 10px;
        z-index: 99;
        cursor: pointer;
    }
}
::v-deep.tabs {
    .el-tabs.danger .el-tabs__nav-scroll .el-tabs__active-bar {
        background-color: #F56C6C;
    }
    .el-tabs.warning .el-tabs__nav-scroll .el-tabs__active-bar {
        background-color: #E6A23C;
    }
}
.tabs ::v-deep .el-tabs__header {
    margin-bottom: 0;
}

.tabs ::v-deep .el-tabs__nav-wrap {
    .el-tabs__item {
        .warning {
            color: #E6A23C;
        }
        .danger {
            color: #F56C6C;
        }
    }
    &::after {
        background: none;
    }
}
.profit {
    color: #e71010;
    font-size: 14px;
    line-height: 29px;
}
::v-deep .el-table__body {
    background: black !important;
    position: relative;
    .el-table__row {
        position: relative;
        .el-table__expand-icon {
            .el-icon-arrow-right {
                &::before {
                    font-size: 18px;
                    font-weight: 1000;
                    color: rgb(70, 180, 109);
                }
            }
        }
        .item-header-wrap {
            display: flex;
            flex-direction: column;
            padding: 10px 0 10px 0;
            .row {
                display: flex;
                justify-content: space-evenly;
            }
        }
    }
}
</style>

<style lang="scss">
.placeOrderModel-popper {
    width: 310px;
    line-height: 22px;
}
</style>
