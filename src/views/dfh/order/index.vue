<template>
    <div class="execution dfh-order-index-pages-container" :class="total > 0 ? 'pb70' : 'pb10'" ref="dfhMain" v-loading="schemeLoading" element-loading-text="正在启动客户端，请稍后...">
        <div class="wrapper">
            <div class="header">
                <div class="banner" v-if="siteConfig.id == 1">
                    派派交易已全面支持1688官方密文下单,无需消耗解密额度,抖音面单发货
                </div>
                <div class="banner" v-if="siteConfig.id == 1810202544216821762">
                    极速交易已全面支持1688官方密文下单,无需消耗解密额度,抖音面单发货
                </div>
                <div class="banner" v-if="siteConfig.id == 1810565944151515137">
                    截流大师拍单已全面支持1688官方密文下单,无需消耗解密额度,抖音面单发货
                </div>
                <div class="banner" v-if="siteConfig.id == 1766060302561169409">
                    老梦一键下单已全面支持1688官方密文下单,无需消耗解密额度,抖音面单发货
                </div>
                <div class="banner" v-if="siteConfig.id == 1813891945346191362">
                    九九代发下单已全面支持1688官方密文下单,无需消耗解密额度,抖音面单发货
                </div>
                <div class="banner" v-if="siteConfig.id == 1817835750357606401">
                    拍单交易已全面支持1688官方密文下单,无需消耗解密额度,抖音面单发货
                </div>
                <div class="filter-box ">
                    <div class="title">请选择筛选条件</div>
                    <el-form class="form-box" :model="formData" inline ref="form" label-width="83px" label-position="left">
                        <el-form-item label="下单时间：">
                            <el-date-picker
                                style="width: 366px"
                                v-model="formCreateTime"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions"
                                :clearable="false"
                                format="yyyy-MM-dd HH:mm"
                                value-format="yyyy-MM-dd HH:mm"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="店铺名称：" prop="shopId">
                            <el-select
                                v-model="formData.shopId"
                                placeholder="请选择店铺"
                                style="width: 165px"
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
                        <el-form-item label="商品ID：" prop="productId">
                            <el-input
                                style="width: 165px"
                                placeholder="请输入商品ID"
                                v-model="formData.productId"
                            ></el-input>
                        </el-form-item>
                         <el-form-item label="商品标题：" prop="productName">
                            <el-input
                                style="width: 165px"
                                placeholder="请输入商品标题"
                                v-model="formData.productName"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="下单手机号：" prop="pddUserName" label-width="120">
                            <el-input
                                placeholder="请输入下单手机号"
                                v-model="formData.pddUserName"
                                clearable
                                style="width: 165px"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="采购单号：" prop="pddOrderId">
                            <el-input
                                placeholder="请输入采购订单编号"
                                v-model="formData.pddOrderId"
                                clearable
                                style="width: 165px"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="支付流水号：" prop="channelPaymentNo" label-width="120">
                            <el-input
                                placeholder="请输入支付流水号"
                                v-model="formData.channelPaymentNo"
                                style="width: 165px"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="订单编号：" prop="orderId">
                            <el-input
                                placeholder="请输入订单编号"
                                v-model="formData.orderId"
                                style="width: 165px"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="订单状态：" prop="orderStatus">
                            <el-select
                                v-model="formData.orderStatus"
                                placeholder="请选择订单状态"
                                style="width: 165px"
                                clearable
                            >
                                <el-option
                                    v-for="(item, index) in orderStatusList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="筛选旗帜：" prop="sellerRemarkStars">
                            <el-select
                                v-model="sellerRemarkStars"
                                placeholder="请选择旗帜"
                                clearable
                                @change="onChangeSelect"
                                style="width: 165px"
                            >
                                <el-option
                                    :lable="item.label"
                                    :value="item.label"
                                    v-for="(item, index) in flag"
                                    :key="index"
                                >
                                    <div class="px15">
                                        <i
                                            class="el-icon-s-flag font18"
                                            :style="{ color: colors(index) }"
                                        ></i>
                                    </div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button style="width: 86px;" type="primary" icon="el-icon-search" @click.stop="initGetList" :loading="tableLoading" :disabled="tableLoading">
                                <span>{{tableLoading ? '查询中' : '搜索'}}</span>
                            </el-button>
                            <el-button style="width: 86px;" icon="el-icon-delete" @click.stop="resetForm('form')">
                                <span>清空</span>
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="select-box">
                    <div class="buttons">
                        <el-button @click.stop="bulkUndertakesTo">
                            <span>批量下单</span>
                        </el-button>
                        <!-- <el-tooltip class="item" effect="dark" content="无限制隐私号下单0.8点券/单" placement="top">
                            <el-button style=" margin-left:10px;" @click.stop="batchDecryption">
                                <span>无限制隐私号解密</span>
                            </el-button>
                        </el-tooltip> -->
                        <el-dropdown class="ml10" @command="onBatchHandle">
                            <el-button >
                                <span>批量操作</span>
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <!-- <el-dropdown-item command="encrypt">批量解密</el-dropdown-item> -->
                                <el-dropdown-item command="rebuy">批量重新补单</el-dropdown-item>
                                <el-dropdown-item command="repay">批量重新支付</el-dropdown-item>
                                <el-dropdown-item command="flagconfig">批量插旗备注</el-dropdown-item>
                                <el-dropdown-item command="cancelds">批量取消代发</el-dropdown-item>
                                <el-dropdown-item command="forcedrop">批量强制代发</el-dropdown-item>
                                <el-dropdown-item command="filterOrder">批量隔离订单</el-dropdown-item>
                                <el-dropdown-item command="checks">批量检测上家发货状态</el-dropdown-item>
                                <el-dropdown-item command="shipping">批量发中铁同步单</el-dropdown-item>
                                <el-dropdown-item command="cancelFilterOrder">批量取消隔离订单</el-dropdown-item>
                                <el-dropdown-item command="getspec">获取采购商品规格</el-dropdown-item>
                                <el-dropdown-item command="mutiPay">批量支付订单</el-dropdown-item>
                                <el-dropdown-item command="mutiPurchaseNum">批量修改采购数量</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-button style="margin-left:auto" @click.stop="isSyncOrderVisible = true" icon="el-icon-refresh-right" >
                            同步订单
                        </el-button>
                        <el-button @click.stop="importOrder" style="margin-left:10px" icon="el-icon-upload2">
                            导入代发订单
                        </el-button>
                    </div>
                </div>
                <div class="table-box">
                    <div class="tabs">
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
                                        <span class="">{{ orderStatusCount[item.key] || 0 }}</span>
                                    </div>
                                </template>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <template>
                        <el-table
                            :data="tableData"
                            style="width: 100%;margin-top: 30px"
                            :header-cell-style="{background:'rgb(244,245,247)',color:'#000'}"
                            :default-expand-all="true"
                            @selection-change="handleSelectionChange">
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <div style="padding:15px 10px;min-height:100px;overflow:hidden;background:rgb(244,245,247);">
                                        <div class="top" style="float:left;">
                                            <el-image 
                                                v-if="props.row.btype === '101'"
                                                fit="cover"
                                                style="width: 50px; height: 50px; "
                                                src="/img/icon_xhs.png">
                                            </el-image>
                                            <!-- 抖店商品图 -->
                                            <el-image 
                                                v-else
                                                fit="cover"
                                                style="width: 50px; height: 50px;"
                                                :preview-src-list="[props.row.pic && props.row.pic.indexOf('http')!==-1 ? props.row.pic : (`https://p9-aio.ecombdimg.com/obj/`+ props.row.pic)]"
                                                :src="props.row.pic && props.row.pic.indexOf('http')!==-1 ? props.row.pic : (`https://p9-aio.ecombdimg.com/obj/`+ props.row.pic)">
                                            </el-image>
                                        </div>
                                        <div style="float:left;margin-left:20px;">
                                            <span style="float:left;font-weight:bold;font-size:15px;color:#000;">{{ props.row.name }}</span>
                                            <i
                                                class="el-icon-copy-document"
                                                style="color:rgb(87,173,126);"
                                                v-clipboard:copy="props.row.name"
                                                v-clipboard:success="onCopy"
                                                v-clipboard:error="onError"/>
                                        </div>
                                        <div v-if="props.row.status == '2'" style="float:right;">
                                            <div style="float:left; margin-left:5px;" v-if="props.row.platform == 3">
                                                <!-- 淘特 -->
                                                <el-button type="primary" style="margin: 5px 0;" @click="onPddZfbPay(props.row, 'taote')">支付宝支付</el-button>
                                            </div>
                                            <div style="float:left; margin-left:5px;" v-else-if="props.row.platform == 2">
                                                <!-- 1688 -->
                                                <el-button type="primary" style="margin: 5px 0;" @click="onAliPayDialog(props.row)">支付宝支付</el-button>
                                            </div>
                                            <div style="float:left; margin-left:5px;" v-else-if="props.row.platform == 1">
                                                <!-- 供应链聚合支付 -->
                                                <el-button type="primary" style="margin: 5px 0;" @click="onPayDialog(props.row)">立即支付</el-button>
                                            </div>
                                            <div style="float:left; margin-left:5px;" v-else>
                                                <!-- PDD代发 -->
                                                <el-button style="float:left; margin: 5px 0;" type="primary" @click="handlePayCommand(props.row)" v-if="props.row.outerPlaceOrderMode == 0">采购代发支付</el-button>
                                                <!-- PDD批发 -->
                                                <el-button style="float:left; margin: 5px 0;" type="primary" @click="onPddZfbPay(props.row)" v-else>支付宝支付</el-button>
                                            </div>
                                        </div>
                                        <!-- 供应链 -->
                                        <!-- <el-button type="text" size="mini" class="purchase-opt-btn" v-if="row.platform == 1 && row.pddOrderId && (row.status == 5 || row.status == 6 || row.status == 7)" @click="onSupplyContact(row.pddOrderId)">联系供应商</el-button> -->
                                        <!-- 1688 -->
                                        <el-button type="primary" style="float: left;margin: 5px 0;" v-else-if="props.row.platform == 2 && props.row.pddOrderId && (props.row.status == 5 || props.row.status == 6 || item.status == 7)" @click="onAliContact(props.row)">联系商家</el-button>
                                        <!-- 淘特 -->
                                        <!-- <el-button type="text" size="mini" class="purchase-opt-btn" v-if="row.platform == 3 && row.pddOrderId && (row.status == 5 || row.status == 6 || row.status == 7)" @click="onTaoteContact(row)">联系商家</el-button> -->
                                        <!-- 供应链与1688申请售后 -->
                                        <div style="text-align: center" v-if="(props.row.platform == 1 || props.row.platform == 2) && item.pddOrderId && (props.row.status == 5 || props.row.status == 6) && props.row.pddPayStatus == 2">
                                            <el-button type="primary" style="float: left;margin: 5px 0;" @click="onSupplyRefund(props.row.pddOrderId)" :loading="supplyRefundLoading">申请退款</el-button>
                                        </div>
                                        <div style="text-align: center" v-if="(props.row.platform == 1 || props.row.platform == 2) && item.pddOrderId && (props.row.status == 5 || props.row.status == 6) && props.row.pddPayStatus == 3">
                                            <el-button type="primary" style="float: left;margin: 5px 0;">申请退款中</el-button>
                                        </div>

                                        <div v-if="formData.status != 14" style="float:right;">
                                            <div style="float:left; margin-left:5px;" v-if="props.row.decryptStatus != 1">
                                                <el-button type="primary" style="margin: 5px 0;" @click.native="onOneKeyOrder(props.row)">一键下单</el-button>
                                            </div>
                                            <div style="float:left; margin-left:5px;" v-if="((props.row.status == 1 && props.row.decryptStatus == 1) || props.row.status == 3) && (props.row.status == 3 || orderConfig.placeOrderModel != 2 || props.row.bindWelfareGoods == 1)">
                                                <el-button type="primary" style="margin: 5px 0;" @click.native="manualUndertakesToRow(props.row)">
                                                    <span v-if="props.row.status == 3">重新代发</span>
                                                    <span v-else-if="orderConfig.placeOrderModel != 2 || props.row.bindWelfareGoods == 1">手动代发</span>
                                                </el-button>
                                            </div>
                                            <!-- 供应链订单不能直接重新支付 -->
                                            <div style="float:left; margin-left:5px;" v-if="props.row.status == 4 && props.row.platform == 0">
                                                <el-button type="primary" style="margin: 5px 0;"  @click.native="onRepay(props.row)">重新支付</el-button>
                                            </div>
                                            <div style="float:left; margin-left:5px;" v-if="props.row.status == 9 || props.row.status == 2 || props.row.status == 3">
                                                <el-button type="primary" style="margin: 5px 0;"  @click.native="cancelUndertakesToRow(props.row)">取消代发</el-button>
                                            </div>
                                            <div style="float:left; margin-left:5px;" v-if="props.row.status == 2 || props.row.status == 4">
                                                <el-button type="primary" style="margin: 5px 0;" @click.native="onDetectioPddPay(props.row)">检测支付状态</el-button>
                                                <el-button type="primary" style="margin: 5px 0 5px 5px;" @click.native="onReloadPddPayUrl(props.row)">刷新支付链接</el-button>
                                            </div>
                                            <div style="float:left; margin-left:5px;" v-if="props.row.status == 5 || props.row.status == 6">
                                                <el-button type="primary" style="margin: 5px 0;"  v-if="props.row.status == 5" @click.native="onManualCheckShipping(props.row)">手动检测上家发货状态</el-button>
                                                <el-button type="primary" style="margin: 5px 0;"  v-if="props.row.status == 6" @click.native="onManualShipping(props.row)">发中铁同步单(需消耗{{ siteConfig.id == 1810202544216821762?'4.8':'1.5' }}点券)</el-button>
                                                <el-tooltip effect="dark" content="只有家具店可以使用" placement="left">
                                                    <el-button type="primary" style="margin: 5px 0 5px 5px;" @click.native="onSendOutEx(props.row)">发送其它平台物流</el-button>
                                                </el-tooltip>
                                            </div>
                                            <div style="float:left; margin-left:5px;" v-if="props.row.status == 5">
                                                <el-tooltip effect="dark" content="请确保当前订单已经退款成功，才可重新补发" placement="left">
                                                    <el-button type="primary" style="margin: 5px 0;" @click.native="reorder(props.row)">重新补单</el-button>
                                                </el-tooltip>
                                                <!-- <el-button type="primary" style="margin: 5px 0 5px 5px;" @click.native="onManualShippingNoUp(props.row)">无视上家发货</el-button> -->
                                            </div>
                                            <div style="float:left; margin-left:5px;" v-if="props.row.status == 3">
                                                <el-button type="primary" style="margin: 5px 0;" @click.native="onForceDropShipping(props.row)">强制代发</el-button>
                                            </div>
                                        </div>
                                        <div style="margin-left:5px;float:right;">
                                            <el-button type="primary" style="margin: 5px 0;background: none;color: rgb(70,180,109);border: 1px solid rgb(70,180,109);" @click.native="updateSku(props.row)">关联规格</el-button>
                                        </div>
                                        <div style="width:100%; float:left; padding:0 70px;margin-top:-25px">
                                            <div style="width:30%; float:left;">
                                                <p style="margin-top:15px; font-size:12px;">
                                                    商品id：
                                                    <span style="color:rgb(87,173,126);font-weight:bold;">
                                                        {{ props.row.productId }}
                                                        <i
                                                            class="el-icon-copy-document"
                                                            v-clipboard:copy="props.row.productId"
                                                            v-clipboard:success="onCopy"
                                                            v-clipboard:error="onError"
                                                        ></i>
                                                    </span>
                                                </p>
                                                <p style="margin-top:15px; font-size:12px;">
                                                    子订单编号：
                                                    <span style="color:rgb(87,173,126);font-weight:bold;">
                                                        {{ props.row.orderId }}
                                                        <i
                                                            class="el-icon-copy-document"
                                                            v-clipboard:copy="props.row.orderId"
                                                            v-clipboard:success="onCopy"
                                                            v-clipboard:error="onError"
                                                        ></i>
                                                    </span>
                                                </p>
                                                <p style="width:80%;margin-top:15px;font-size:12px;text-overflow:ellipsis;
                                                    overflow:hidden;
                                                    white-space:nowrap;">
                                                    规格：
                                                    <el-tooltip effect="dark" :content="props.row.spec +  'x' + props.row.itemNum" placement="top">
                                                        <span style="color:rgb(87,173,126);font-weight:bold;">{{ props.row.spec }} x{{ props.row.itemNum }}</span>
                                                    </el-tooltip>
                                                </p>
                                            </div>
                                            <div style="width:25%; float:left;">
                                                <p style="margin-top:15px; font-size:12px;">
                                                    <span>店铺名称：{{ props.row.shopName }}</span>
                                                </p>
                                                <p style="margin-top:15px; font-size:12px;">
                                                    <span>数量：{{props.row.purchaseQuantity || props.row.itemNum}}件</span>
                                                </p>
                                                <p style="margin-top:15px; font-size:12px;">
                                                    <span>抖店实收款：{{ (props.row.payAmount / 100).toFixed(2) || '-' }}</span>
                                                </p>
                                            </div>

                                            <div style="width:25%; float:left;font-size:12px">
                                                <div v-if="(props.row.status == 1 || props.row.status == 3) && !props.row.pddGoodsId">
                                                    <p style="width:100%;margin-top:45px;font-size:12px;margin-left:30px">
                                                    未关联</p>
                                                </div>
                                                <div v-else>
                                                    <div style="width:100%;margin-top:15px;font-size:12px;text-overflow:ellipsis;
                                                        overflow:hidden;
                                                        white-space:nowrap;">
                                                        <span style="float: left;margin-top:10px;">sku规格：</span>
                                                        <el-image
                                                            fit="cover"
                                                            style="float:left;width:30px;height:30px;"
                                                            :preview-src-list="[props.row.thumbUrl]"
                                                            :src="props.row.thumbUrl">
                                                        </el-image>
                                                        <p style="width:60%;margin-top:10px;text-overflow:ellipsis;;
                                                            overflow:hidden;
                                                            white-space:nowrap;">
                                                            <el-tooltip effect="dark" :content="props.row.newPddSpec" placement="top">
                                                                <span style="color:rgb(87,173,126);font-weight:bold;margin-left:3px;">{{props.row.newPddSpec}}</span>
                                                            </el-tooltip>
                                                        </p>
                                                    </div>
                                                    <p style="margin-top:15px; font-size:12px;">
                                                        预估券后价：
                                                        <span style="color:rgb(87,173,126);font-weight:bold;">{{props.row.unitPrice ? props.row.unitPrice.toFixed(2) : '-'}}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div style="width:20%; float:left;">
                                                <p style="width:100%;margin-top:25px;font-size:12px;text-overflow:ellipsis;
                                                    overflow:hidden;
                                                    white-space:nowrap;">
                                                    上家订单状态：
                                                    <el-tooltip effect="dark" :content="props.row.status | statusFormats" placement="top">
                                                        <span style="color:red;">{{ props.row.status | statusFormats }}</span>
                                                    </el-tooltip>
                                                    <el-tooltip v-if="reasonText(props.row)" effect="dark" :content="reasonText(props.row)" placement="left">
                                                        <span style="color:rgb(87,173,126);">{{ reasonText(props.row) }}</span>
                                                    </el-tooltip>
                                                </p>
                                                <p 
                                                    style="margin-top:15px; font-size:14px;cursor: pointer;" 
                                                    v-if="props.row.status == 5 || props.row.status == 6 || props.row.status == 7 || props.row.status == 17"
                                                    @click="onSale(props.row)">
                                                    <i
                                                        class="el-icon-date"
                                                        style="color:rgb(87,173,126);"/>
                                                    <span style="color:rgb(87,173,126);">售后详情</span>
                                                </p>
                                                <p 
                                                    style="margin-top:15px; font-size:14px;cursor: pointer;" 
                                                    v-if="props.row.status == 8"
                                                    @click="$router.push('/refund/order/index')">
                                                    <i
                                                        class="el-icon-date"
                                                        style="color:rgb(87,173,126);"/>
                                                    <span style="color:rgb(87,173,126);">查看售后</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div style="width:90%;float:left;margin:20px 0 0 70px;">
                                            <span style="margin-right:10px;" v-if="props.row.status!=1 && props.row.status!=3">上家订单号：{{ props.row.pddOrderId || '-' }}</span>
                                            <span style="margin-right:10px;" v-if="props.row.status==5 || props.row.status==6 || props.row.status==7 || props.row.status==17">下单手机号：{{ props.row.pddUserName || '-' }}</span>
                                            <span style="margin-right:10px;" v-if="props.row.status==6 || props.row.status==7 || props.row.status==17">快递公司：{{ props.row.originalTrackingName || '-' }}</span>
                                            <span style="margin-right:10px;" v-if="props.row.status==6 || props.row.status==7 || props.row.status==17">快递单号：{{ props.row.originalTrackingNumber || '-' }}</span>
                                            <span style="margin-right:10px;" v-if="props.row.status==17">取件码：{{ props.row.pickupCode || '-' }}</span>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                type="selection"
                                width="55">
                            </el-table-column>
                            <el-table-column label="订单号">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.parentOrderId }}</span>
                                    <i
                                        class="el-icon-copy-document"
                                        style="color:rgb(87,173,126);"
                                        v-clipboard:copy="scope.row.parentOrderId"
                                        v-clipboard:success="onCopy"
                                        v-clipboard:error="onError"/>
                                </template>
                            </el-table-column>
                            <el-table-column label="下单时间">
                                <template slot-scope="scope">
                                    {{ formatTime(scope.row.createTime * 1000,'YYYY-MM-DD hh:mm:ss') }}
                                </template>
                            </el-table-column>
                            <el-table-column label="抖店订单状态">
                                <template slot-scope="scope">
                                    <span style="color:rgb(87,173,126);">{{ scope.row.orderStatus | orderStatusFormats }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="收货信息" width="200">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.decryptStatus == '0'" style="color: red">请联系在线客服解除解密限制</span>
                                    <el-tooltip v-if="scope.row.decryptStatus == '2'" effect="dark" :content="decryptText(scope.row)" placement="left">
                                        <span style="color: red">解密失败</span>
                                    </el-tooltip>
                                    <span v-if="scope.row.decryptStatus == '3'" style="color: red">点券扣除失败</span>
                                    <el-tooltip v-if="scope.row.decryptStatus == '1'" :content="address(scope.row)" effect="dark" placement="left">
                                        <span>
                                            {{ scope.row.province }}
                                            {{ scope.row.city }}
                                            {{ scope.row.town }}
                                        </span>
                                    </el-tooltip>
                                    <span style="color:#ef7c1b" v-if="scope.row.encryptPostTel.length>11&&scope.row.encryptPostTel.length<20">无限制隐私号</span>
                                    <i class="el-icon-edit" @click="editPddArea(scope.row)"></i>
                                </template>
                            </el-table-column>
                            <el-table-column label="发货剩余时间">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.status == '12'">
                                        <div class="timeout" >
                                            <img src="@/assets/wran.png" alt="" />
                                            <span>已超时</span>
                                        </div>
                                        <span v-if="getRemainderTime(scope.row.expShipTime, 'dec') === '-'">{{ '-' }}</span>
                                        <div v-else>
                                            <span>{{ getRemainderTime(scope.row.expShipTime,'dec').d }}</span><span>天</span>
                                            <span>{{ getRemainderTime(scope.row.expShipTime,'dec').h }}</span><span>时</span>
                                            <span>{{ getRemainderTime(scope.row.expShipTime,'dec').m }}</span><span>分</span>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <span v-if="getRemainderTime(scope.row.expShipTime) === '-'">{{ '-' }}</span>
                                        <div v-else>
                                            {{ getRemainderTime(scope.row.expShipTime).d }}<span>天</span>
                                            {{ getRemainderTime(scope.row.expShipTime).h }}<span>时</span>
                                            {{ getRemainderTime(scope.row.expShipTime).m }}<span>分</span>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="店铺备注">
                                <template slot-scope="scope">
                                    <i class="el-icon-s-flag" :style="`color: ${colors(+scope.row.sellerRemarkStars || 0)}`"/>
                                    <el-tooltip effect="dark" placement="top" :content="scope.row.sellerWords">
                                        <span class="remark">{{scope.row.sellerWords  }}</span>
                                    </el-tooltip>
                                    <i class="el-icon-edit" @click.stop="showFlagConfig(scope.row)"></i>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                    <div style="margin-top: 40px;" v-if="total > 0">
                        <el-pagination
                            style="display:flex; justify-content: flex-end"
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
            </div>
            <!--代发补充地址 -->
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
            <!-- 同步订单弹窗 -->
            <dialog-sync-order
                :visible="isSyncOrderVisible"
                :data="shopList"
                @close="isSyncOrderVisible = false"
            ></dialog-sync-order>
            <!-- 插旗备注 -->
            <dialog-flag
                :visible="isFlagVisible"
                :data="flagInfo"
                :loading="isFlagLoading"
                @close="onClose"
                @on-success="onSuccessFlag"
            ></dialog-flag>
            <!-- 关联规格 -->
            <dialog-spec 
                :visible="isSpecVisible"
                :data="specInfo"
                @success="onSuccess"
                @close="isSpecVisible = false">
            </dialog-spec>
        </div>
        <el-backtop target=".dfh-order-index-pages-container" :bottom="70"></el-backtop>
        <scheme-dialog ref="scheme" @close="schemeLoading = false"/>
        <dialog-custom-sku ref="dialogCustomSku" @success="onSuccess"/>
        <!-- PDD代发连续支付 -->
        <dialog-pdd-muti-pay ref="dialogPddMutiPay" @success="getList"/>
        <!-- 支付宝支付 -->
        <dialog-zfb-pay ref="dialogZfbPay" @success="onZfbPaySuccess"/>
        <!-- 供应链聚合支付 -->
        <dialog-muti-pay ref="dialogMutiPay" @success="getList"/>
        <!-- 1688支付 -->
        <dialog-ali-muti-pay ref="dialogAliMutiPay" @success="getList"/>
        <!-- 查看物流 -->
        <dialog-logistics ref="dialogLogistics"/>
        <!-- 代发设置引导 -->
        <dialog-config-guide ref="dialogConfigGuide"/>
        <!-- 导入收货信息订单 -->
        <dialog-import-addr ref="dialogImportAddr"></dialog-import-addr>
    </div>
</template>

<script>
import { detectioPddPay, detectioAliPay, reloadPddPay, encrypt, repay, fetchList, saveFilterOrder, cancelFilterOrder, rebuy, getPddProductSpec, manualDropShipping, manualShipping, cancelDropShipping, addOrderRemark, exportOrder, getExportStatus, orderBatchDecryption, updateOrderNum, mutiUpdateOrderNum, orderSupplyRefund, checkOrderFengKong, getOrderTrackingInfo, sendOutEx, manualShippingNoUp, manualCheckShipping} from '@/api/dfh/order'
import { getClientStatus } from '@/api/info'
import { getConfig } from '@/api/dfh/dfhConfig'
import { mapGetters, mapState } from 'vuex'
import PddArea from './modules/PddArea'
import FilterOrder from './modules/FilterOrder'
import TableItemHeader from './modules/TableItemHeader'
import TimeFormats from '@/util/TimeFormats'
import schemeDialog from '@/components/scheme/scheme'

import DialogProblem from './modules/DialogProblem';
import DialogSyncOrder from './modules/DialogSyncOrder';
import DialogFlag from './components/DialogFlag';
import DialogCustomSku from './components/DialogCustomSku';
import DialogPay from './components/DialogPay';
import DialogZfbPay from './components/DialogZFBPay';
import DialogMutiPay from './components/DialogMutiPay';
import DialogAliMutiPay from './components/DialogAliMutiPay';
import DialogPddMutiPay from './components/DialogPddMutiPay';
import DialogConfigGuide from './components/DialogConfigGuide'
import DialogImportAddr from './components/DialogImportAddr'
import DialogSpec from '@/components/dialog/DialogSpec';
import DialogLogistics from './components/Dialoglogistics'
export default {
    name: 'dfhorder',
    components: {
        DialogSpec,
        PddArea,
        FilterOrder,
        TableItemHeader,
        DialogProblem,
        DialogSyncOrder,
        DialogFlag,
        schemeDialog,
        DialogCustomSku,
        DialogPay,
        DialogZfbPay,
        DialogMutiPay,
        DialogAliMutiPay,
        DialogPddMutiPay,
        DialogLogistics,
        DialogConfigGuide,
        DialogImportAddr
    },
    filters: {
        // 抖店状态
        orderStatusFormats (orderStatus) {
            switch (+orderStatus) {
                case 2: return '待发货';
                case 3: return '已发货';
                case 4: return '已关闭';
                case 5: return '已完成';
            }
        },
        //上家状态
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
                case 17: return '取件码完成';
                default:
                    break;
            }
        },
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
        }
    },
    data() {
        return {
            href: "",
            fullscreenLoading: false,
            orderStatusCount: {},
            pickerOptions: {
                shortcuts: [{
                    text: '最近一天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                        picker.$emit('pick', [start, end]);
                    }
                },{
                    text: '最近七天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                },{
                    text: '最近十五天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三十天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近九十天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }],
                disabledDate(time) {
                    return time.getTime() > Date.now() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 90
                }
            },
            formData: {
                shopId: undefined, //店铺
                orderId: undefined, // 订单ID
                channelPaymentNo: undefined, // 支付流水号
                pddUserName: undefined, //下单手机号
                productId: undefined, // 商品ID
                productName: undefined, //商品标题
                decryptStatus: undefined, // 解密状态
                refundStatus: '0', // 售后状态
                orderStatus: '2', // 订单状态
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
                    label: '全部',
                    value: '',
                }, {
                    label: '备货中',
                    value: '2',
                }, {
                    label: '已发货',
                    value: '3',
                }, {
                    label: '已关闭',
                    value: '4',
                }, {
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

            // 选项卡
            tabs: [
                {
                    key: 'a',
                    label: '全部',
                    name: '0',
                }, 
                {
                    key: 'b',
                    label: '待下单',
                    name: '1',
                },
                {
                    key: 'j',
                    label: '待付款',
                    name: '9',
                }, 
                {
                    key: 'd',
                    label: '下单失败',
                    name: '3',
                }, 
                {
                    key: 'c',
                    label: '支付中',
                    name: '2',
                }, 
                {   key: 'e',
                    label: '支付失败',
                    name: '4',
                }, 
                {
                    key: 'orvertime',
                    label: '发货超时',
                    name: '12',
                },
                {
                    key: 'f',
                    label: '待上家发货',
                    name: '5',
                }, 
                {
                    key: 'g',
                    label: '上家已发货抖店未发货',
                    name: '6',
                }, 
                {
                    key: 'h',
                    label: '代发完成',
                    name: '7',
                },
                {
                    key: 'l',
                    label: '取件码完成',
                    name: '17',
                }
            ],
            multipleSelection:[],//全选
            schemeLoading: false,
            clientStatus: 0,
            orderConfig: {},
            supplyRefundLoading: false
        }
    },
    computed: {
        ...mapGetters(['siteConfig']),
        ...mapState({
            userInfo: (state) => state.user.userInfo,
            my: state => state.user.my,
            dfhStatus: state => state.common.dfhStatus,
        }),
        formCreateTime: {
            get() {
                const {createTimeArr, createTimeStr} = this.formData;
                const [startDate, endDate] = createTimeArr
                const [startTime, endTime] = createTimeStr
                return [
                    startDate + ' ' + startTime,
                    endDate  + ' ' + endTime,
                ]
            },
            set(value) {
                const [start, end] = value;
                this.formData.createTimeArr = [this.$moment(start).format('YYYY-MM-DD'), this.$moment(end).format('YYYY-MM-DD')]
                this.formData.createTimeStr = [this.$moment(start).format('HH:mm'), this.$moment(end).format('HH:mm')]
            }
        },
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
        }
    },
    created() {
        this.initData();
    },
    mounted () {},
    activated () {
        this.onClientStatus()
    },
    methods: {
        //解密失败原因
        decryptText(item){
            if(item.decryptErrorMsg != null && item.decryptErrorMsg != '') {
                if(item.decryptErrorMsg == 'access_token已过期') {
                    return '解密异常：店铺授权已到期'
                }
                else {
                    return '解密异常：' + item.decryptErrorMsg
                }
            }
        },
        address(item) {
            return item.encryptPostReceiver +
                item.encryptPostTel +
                item.province +
                item.city +
                item.town +
                item.encryptDetail 
        },
        reasonText(item) {
            console.log(item)
            if(item.status == '3') {
                return item.loseStatusHint
            }
            else if(item.status == '5' && item.pddStatusDesc) {
                return item.pddStatusDesc
            }
            else if(this.formData.status == 14 && item.status == '5') {
                return '采购审核订单中'
            }   
            else if((item.status == '5'||item.status == '6')&& item.shippingErrorMsg != null && item.shippingErrorMsg != '') {
                if(item.shippingErrorMsg == '店铺不存在或未授权') {
                    return '发货异常：店铺授权已到期'
                }
                else {
                    return '发货异常：' + item.shippingErrorMsg
                }
            }
            else if(item.status == '4') {
                return item.payRemark
            }
            else if(this.formData.status == 11) {
                return this.getRemainderTime(item.expShipTime) + '内发货'
            }
            else if(this.formData.status == 12) {
                return '发货已超时' + this.getRemainderTime(item.expShipTime, 'dec') 
            }
            else {
                return ''
            }
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
        convertSecondsToObject(seconds) {
            seconds = parseInt(seconds )
            // 计算天数
            const days = Math.floor(seconds / (3600 * 24));
            // 计算剩余小时数
            const remainingSecondsAfterDays = seconds % (3600 * 24);
            const hours = Math.floor(remainingSecondsAfterDays / 3600);
            // 计算剩余分钟数
            const remainingSecondsAfterHours = remainingSecondsAfterDays % 3600;
            const minutes = Math.floor(remainingSecondsAfterHours / 60);

            // 返回对象
            return {
                d: days < 10 ? '0' + days : days,
                h: hours < 10 ? '0' + hours : hours,
                m: minutes < 10 ? '0' + minutes : minutes,
            };
        },
        // 计算超时发货剩余时间
        getRemainderTime(startTime, by) {
            const end = (+startTime * 1000)
            let residue = (end - new Date().getTime()) / 1000;
            if (by === 'dec') {
                // 已超时的时间需要反过来计算
                residue = (new Date().getTime() - end) / 1000;
            }
            return residue > 0 ? this.convertSecondsToObject(residue) : '-';
        },
        // 格式化时间戳
        formatTime(value, format = 'YYYY-MM-DD hh:mm:ss') {
            if (typeof (value) === 'string') value = +value;
            return value ? new TimeFormats().convertTime(format, value) : '-';
        },
        // 格式化时间戳
        formats(val) {
            const nowTime = this.formatTime(new Date().getTime(), 'YYYY-MM-DD hh:mm:ss');
            const targetTime = new Date(this.$moment(nowTime).subtract(val, 'days').calendar()).getTime();
            return this.formatTime(targetTime, 'YYYY-MM-DD hh:mm:ss');
        },
        //二次封装 element-ui MessageBox 弹框
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
        //关闭插旗
        onClose() {
            this.commonDialog.tag = '';
            this.isFlagVisible = false;
            this.flagInfo = {};
        },
        /*** 初始化 查询 条件*/
        async initData() {
            try {
                const start = this.$moment().subtract(30, 'day').format('YYYY-MM-DD')
                const end = this.$moment().format('YYYY-MM-DD')
                if (this.dfhStatus != null) {
                    // 如果是从工作台进来，默认差的是当天，而不是两天
                    this.formData.createTimeArr = [end, end]
                    this.formData.status = this.dfhStatus
                } else {
                    this.formData.createTimeArr = [start, end]
                }
                console.log(this.formData.createTimeArr)
                // 查询店铺列表
                const { data: { data } } = await this.$API.getShopList();
                this.shopList = data;
                // 查询代发订单列表
                await this.getList();
                // 查询下单模式
                await this.onOrderConfig()
                this.$store.commit('SET_DFHSTATUS', null)
            } catch (error) {

            }
        },
        // 获取代发设置
        async onOrderConfig () {
            const { data } = await getConfig()
            console.log('onOrderConfig', data)
            this.orderConfig = data.data
        },
        // 获取订单状态统计
        async getOrderStatus(formData) {
            try {
                const { data: { data } } = await this.$API.getOrderStatusCount(formData);
                this.orderStatusCount = data;
            } catch (error) {}
        },
        // 获取订单列表
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

                if (formData.status === '0') formData.status = '';
                if (opt.filterOrderIds) formData.filterOrderIds = opt.filterOrderIds;
                this.getOrderStatus(formData);
                const { data: { data } } = await fetchList(formData);
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
                if (formData.status === '0') formData.status = '';
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
                    exportOrder(formData).then(res => {
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
                }) 
                
        },
        // 导入代发订单
        importOrder () {
            this.$refs.dialogImportAddr.showModel(1)
        },
        // 切换订单状态
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
        // 初始化订单列表
        initGetList() {
            this.formData.current = 1;
            this.getList();
        },
        // current 改变时会触发
        onCurrentChange(page) {
            this.formData.current = page;
            this.getList();
        },
        //pageSize 改变时会触发
        onSizeChange(size) {
            this.formData.size = size;
            this.getList();
        },
        
        // 勾选批量操作订单
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.selecteds = this.multipleSelection;
            console.log(this.multipleSelection,this.selecteds)
        },
        // 重置form表单
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
        // 修改抖店数量
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
            } catch (err) {}
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
            const items = this.selecteds
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
            const ids = this.selecteds.map(e => e.id);
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
        // 关联规格
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
        refreshOrderTrackingInfo (row) {
           getOrderTrackingInfo(row.id).then(action => {
                try {
                    this.$message.success('刷新快递信息成功');
                    this.getList();
                } catch (error) {}
            });
        },
        // 弹窗成功回调
        onSuccess() {
            const scrollTop = this.$refs.dfhMain.scrollTop
            this.commonDialog.dialogVisible = false;
            this.getList({scroll:scrollTop});
        },
        // 插旗备注弹窗回调
        async onSuccessFlag(form) {
            const ids = this.selecteds.map(e => e.id);
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
        // 打开隔离订单弹窗
        filterOrder(filterOrderIds) {
            this.filterOrderVisible = false;
            this.formData.status = '';
            this.getList({ filterOrderIds });
        },
        // 打开插旗备注弹窗
        showFlagConfig(row) {
            this.isFlagVisible = true;
            this.flagInfo = { ...row };
        },
        //保存弹窗内容
        onSave() {
            switch (this.commonDialog.tag) {
                case 'pa':
                    this.$refs.pAForm.ok();
                    break;
            }
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
                this.$refs.pAForm.row = row;
                this.$refs.pAForm.timestamp = new Date().getTime();
            });
        },
        // 批量操作按钮
        onBatchHandle(command) {
            if (!this.selecteds.length) return this.$message.error('请至少勾选一条订单进行操作');
            if (command === 'rebuy') return this.batchReorder();
            // if (command === 'encrypt') return this.batchDecryption();
            if (command === 'repay') return this.toPayFor();
            if (command === 'flagconfig') return this.flagRemark();
            if (command === 'cancelds') return this.cancelUndertakesTo();
            if (command === 'forcedrop') return this.batchMandatoryForwarding();
            if (command === 'filterOrder') return this.isolationOfTheOrder();
            if (command === 'cancelFilterOrder') return this.onCancelFilterOrder();
            if (command === 'getspec') return this.getBatchPddProductSpec();
            if (command === 'shipping') return this.onMutiManualShipping();
            if (command === 'checks') return this.onMutiManualCheckShipping();
            if (command === 'mutiPay') return this.onMutiPayDialog();
            if (command === 'mutiPurchaseNum') return this.onMutiPurchaseNumDialog()
        },
        // 重新补单
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
                } catch (error) {}
            });
        },
        // 批量重新补单
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
            const ids = this.selecteds.map(e => e.id);
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
        // // 自动解密
        // onAutoDecode () {
        //     const formData = {};
        //     for (const key in this.formData) {
        //         const row = this.formData[key];
        //         console.log(row,1234)
        //         if(key == "sellerRemarkStars"){
        //             formData["sellerRemarkStars"] = row;
        //         }
        //         if (row) formData[key] = row;
               
        //     }
        //     this.$confirm('自动解密前请确保抖店解密余额充足，额度用完再申请提额!', '温馨提示', {
        //         confirmButtonText: '开始解密',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //     }).then(async () => {
        //         try {
        //             const { data } = await orderBatchDecryption(formData)
        //             this.$message.success(data.msg)
        //         } catch (err) {
        //         }
        //     }).catch(() => {
        //     })
        // },
        // //批量解密
        // batchDecryption() {
        //     if (!this.selecteds.length) return this.$message.error('请至少勾选一条订单进行操作');
        //     const ids = this.selecteds.map(e => e.id);
        //     console.log(ids)
        //     this.confirm('确定要批量解密勾选的订单吗？').then(async () => {
        //         try {
        //             await encrypt({ ids: ids.join(',') });
        //             this.$message.success('操作成功，批量解密为异步方式解密，可能需要几分钟时间出，请耐心等待~');
        //             this.getList();
        //         } catch (error) {

        //         }
        //     });
        // },
        //手动解密
        // onEncrypt(row) {
        //     this.confirm('确定要手动解密吗？').then(async () => {
        //         try {
        //             const { data } = await encrypt({ ids: row.id });
        //             this.$message.success(data.msg)
        //             this.getList();
        //         } catch (error) {}
        //     });
        // },
        //批量重新支付
        async toPayFor() {
            const ids = this.selecteds.filter(e => !['5', '6', '7'].includes(e.status)).map(e => e.id);
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
        // 批量插旗备注
        flagRemark() {
            this.isFlagVisible = true;
            this.flagInfo = {
                sellerRemarkStars: '0',
                sellerWords: '',
            };
        },
        //批量取消代发
        async cancelUndertakesTo() {
            const ids = this.selecteds;
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
        // 批量强制代发
        batchMandatoryForwarding() {
            const ids = this.selecteds;
            const idsData = [];
            for (let i = 0; i < ids.length; i++) {
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
        //批量下单
        bulkUndertakesTo() {
            if (!this.selecteds.length) return this.$message.error('请至少勾选一订单条进行操作');
            const ids = this.selecteds;
            const idsData = [];
            for (let i = 0; i < ids.length; i++) {
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
        // 批量隔离订单
        isolationOfTheOrder() {
            const ids = this.selecteds.map(e => e.id);
            this.confirm('确定要批量隔离勾选的订单吗？').then(async () => {
                try {
                    const { data } = await saveFilterOrder({ ids: ids.join(',') });
                    this.$message.success('操作成功，请刷新隔离订单列表查看~');
                    this.getList();
                } catch (error) {

                }
            });
        },
        //取消隔离订单
        onCancelFilterOrder() {
            if (!this.selecteds.length) return this.$message.error('请至少勾选一订单条进行操作');
            const ids = this.selecteds;
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
                } catch (error) {}
            });
        },
        // 批量获取PDD商品规格
        getBatchPddProductSpec() {
            const ids = this.selecteds.filter(e => e.hintInfo !== null).map(e => e.id);
            if (!ids.length) return this.$message.error('不能勾选尚未绑定采购链接的订单');
            this.confirm('确定要获取采购商品规格选中的订单吗？').then(async () => {
                try {
                    const { data } = await getPddProductSpec({ ids: ids.join(',') });
                    this.$message.success('该商品规格为异步方式获取，可能需要几分钟时间，请耐心等待~');
                    this.getList();
                } catch (error) {}
            });
        },
        //一键下单
        onOneKeyOrder(row) {
            // 不是采购下单，不是福利品时才需要校验是否关联拼多多规格
            if (!this.orderConfig.placeOrderModel && row.bindWelfareGoods != 1 && !row.pddSkuId) {
                return this.$message.error('不能代发尚未关联采购规格的订单')
            }
            this.confirm(`确定要一键下单此订单吗？`).then(async () => {
                try {
                    // const encryptResult = await encrypt({ ids: row.id });
                    // console.log('encryptResult', encryptResult);
                    // this.$message.success(encryptResult.data.msg)
                    
                    for(let i = 0; i < 10; i++){
                        await new Promise((resolve)=>{
                            setTimeout(resolve, 500);
                        });
                        const { data: { data } } = await fetchList({orderId: row.orderId});
                        let item = data.order.records[0];
                        if(item.decryptStatus == 1){
                            const { data } = await manualDropShipping({ ids: row.id });
                            if (data.code == 501) {
                                this.manualDropTip()
                            } else {
                                this.$message.success(text + `成功`)
                                this.getList();
                            }
                            return
                        }
                    }
                    this.getList();
                } catch (error) {}
            });
        },
        // 重新支付
        onRepay(row) {
            this.confirm('确定要重新支付吗？').then(async () => {
                try {
                    const { data } = await repay({ ids: row.id });
                    this.$message.success("重新支付成功")
                    this.getList();
                } catch (error) {}
            });
        },
        //取消代发
        cancelUndertakesToRow(row) {
            this.confirm('确定要取消此代发订单吗？').then(async () => {
                try {
                    const { data } = await cancelDropShipping({ ids: row.id });
                    this.$message.success('取消代发成功');
                    this.getList();
                } catch (error) {}
            });
        },
        // 手动代发|重新代发
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
                } catch (error) {}
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
        //检测支付状态
        async onDetectioPddPay(row, pay) {
            if (row.platform == 1 || row.platform == 2) {
                // 检测支付状态需要区分采购平台
                this.confirm('确定要手动检测该订单支付状态吗？').then(async () => {
                    try {
                        await detectioAliPay({ orderId: row.orderId })
                        this.$message.success('正在检测中，稍后刷新列表查看检测结果！')
                    } catch (error) {}
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
                        } catch (error) {}
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
                } catch (error) {}
            });
        },
        /* 手动检测上家发货状态*/
        onManualCheckShipping(row) {
            this.confirm('确定要检测此订单吗？').then(async () => {
                try {
                    const { data } = await manualCheckShipping({ ids: row.id });
                    this.$message.success(data.msg);
                    this.getList();
                } catch (error) {}
            });
        },
        /* 批量检测上家发货状态*/
        onMutiManualCheckShipping() {
            const ids = this.selecteds.map(e => e.id).join(',');
            this.confirm('确定要检测此批订单吗？').then(async () => {
                try {
                    const { data } = await manualCheckShipping({ ids: ids })
                    this.$message.success(data.msg)
                    this.getList()
                } catch (error) {}
            })
        },
        /* 手动发货(发邮政延迟单)*/
        onManualShipping(row) {
            this.confirm('确定要发货此订单吗？').then(async () => {
                try {
                    const { data } = await manualShipping({ ids: row.id });
                    this.$message.success(data.msg);
                    this.getList();
                } catch (error) {}
            });
        },
        /* 批量发邮政延迟单*/
        onMutiManualShipping() {
            const ids = this.selecteds.map(e => e.id).join(',');
            this.confirm('确定要发货此批订单吗？').then(async () => {
                try {
                    const { data } = await manualShipping({ ids: ids })
                    this.$message.success(data.msg)
                    this.getList()
                } catch (error) {}
            })
        },
        // 强制代发
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
                } catch (error) {}
            });
        },
        onSale(row) {
            let pddPaymentUrl = `https://mobile.pinduoduo.com/order.html?order_sn=${row.pddOrderId}&version=${row.pddOrderId}&refer_page_name=my_order`;
            if (window.electron) {
                const msg = {
                    key: 'saleUrl',
                    url: pddPaymentUrl,
                    id: row.orderId
                }
                // 发送到electron进行跳转
                window.electron.send(msg)
            } else {
                window.open(pddPaymentUrl)
            }
        },
        //无视上家发货
        // onManualShippingNoUp(row) {
        //     this.confirm('确定要无视上家发货吗?不等上家发货抖店直接发货由此造成的用户投诉自行承担').then(async () => {
        //         try {
        //             const { data } = await manualShippingNoUp({ ids: row.id });
        //             this.$message.success('操作成功');
        //             this.getList();
        //         } catch (error) {}
        //     });
        // },
        // 发送其它平台物流
        onSendOutEx(row) {
            this.confirm('确定从其他系统发送物流吗?确定之后本司只提供后续的取件码服务不提供物流发货服务').then(async () => {
                try {
                    const { data } = await sendOutEx({ orderId: row.orderId });
                    this.$message.success('操作成功');
                    this.getList();
                } catch (error) {}
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
        // 检测客户端是否在线
        async onClientStatus () {
            const { data } = await getClientStatus()
            this.clientStatus = data.data
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
        }
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
    box-sizing: border-box;
    height: calc(100vh - 120px);
    overflow: auto;
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

    .wrapper {
        border-radius: 11px;
        box-sizing: border-box;
        .header {
            margin-bottom: 20px;
            box-sizing: border-box;
            position: relative;
            ::v-deep .el-alert {
                .el-alert__title {
                    font-weight: 500;
                }
            }
            .banner {
                width: 100%;
                height: 65px;
                line-height: 65px;
                text-align: center;
                font-size: 28px;
                color: #000;
                font-weight: 600;
                background: rgb(116, 199, 146);
            }
            .filter-box {
                margin-top: 16px;
                background: #fff;
                border-radius: 12px;
                padding: 18px 0px 0px 0px;
                .title {
                    font-size: 20px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: bold;
                    color: #000000;
                    line-height: 20px;
                    position: relative;
                    text-indent: 11px;
                    margin-left: 16px;
                    &::before {
                        content: '';
                        display: block;
                        position: absolute;
                        width: 2px;
                        height: 18px;
                        top: 1px;
                        left: 0px;
                        background: $themeColor; ; 
                    }
                }

                .form-box {
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: 20px;
                    padding-left: 24px;
                    padding-right: 3px;
                    ::v-deep .el-form-item {
                        line-height: 32px;
                        display: flex;
                        margin-right: 22px;
                        margin-bottom: 20px;
                        .el-form-item__label {
                            line-height: 32px;
                        }
                    }
                }
                
            }
            .select-box {
                margin-top: 16px;
                background: #fff;
                border-radius: 12px;
                width: 100%;
                box-sizing: border-box;
                padding: 16px 24px;
                .buttons {
                    display: flex;
                    align-items: center;
                    ::v-deep .el-button{
                        padding: 0 8px;
                        height: 32px;
                        line-height: 32px;
                    }
                }
            }
        }
        .table-box {
            margin-top: 16px;
            background: #fff;
            border-radius: 12px;
            padding: 14px 20px 32px;
            ::v-deep .el-tabs {
                .el-tabs__active-bar  {
                    display: none;
                }
                .el-tabs__nav-wrap {
                    &::after {
                        display: none;
                    }
                }
                .el-tabs__nav-prev ,.el-tabs__nav-next {
                    height: 32px;
                    line-height: 32px;

                }
                .el-tabs__item {
                    padding: 0 12px;
                    background: #D4D6D9;
                    height: 32px;
                    line-height: 32px;
                    margin-right: 10px;
                    border-radius: 4px;
                    flex: none;
                    & > div {
                        display: flex;
                        align-items: center;
                        span:first-child {
                            color: #fff;
                            font-size: 12px;
                        }
                        span:last-child {
                            padding: 4px;
                            margin-left: 10px;
                            border-radius: 50%;
                            line-height: 14px;
                            font-size: 12px;
                            max-height: 14px;
                            display: inline-flex;
                            align-items: center;
                            background: #fff;
                            color: #D4D6D9;

                        }
                    }
                    &.is-active {
                        background: rgb(70,180,109);
                        & > div {
                            span:last-child {
                                color: rgb(70,180,109);
                            }
                        }
                    }
                    &:hover {
                        
                        background: rgb(70,180,109);
                        
                        & > div {
                            span:last-child {
                                color: rgb(70,180,109);
                            }
                        }
                    }
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

.tabs ::v-deep .el-tabs__header {
    margin-bottom: 0;
}

::v-deep .el-table__body {
    background: black !important;
    position: relative;
    .el-table__row {
        position: relative;
        .el-table__expand-icon {
            .el-icon-arrow-right {
                &::before {
                    font-size: 14px;
                    font-weight: 1000;
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

.el-icon-s-flag:before {
    content: "\E7B0";
    font-size: 16px;
}
</style>