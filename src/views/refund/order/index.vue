<template>
    <div class='refund' v-loading="schemeLoading" element-loading-text="正在启动客户端，请稍后...">
        <div class="refund-content">
            <div class="search-content">
                <div class="title">请选择筛选条件</div>
                <el-form inline class="form-box" :model="formData" ref="form">
                    <el-form-item label="申请时间：" prop="createTimeArrNew">
                        <el-date-picker
                            v-model="formData.createTimeArrNew"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            style="width: 336px;"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="店铺名称：" prop="shopId">
                        <el-select v-model="formData.shopId" placeholder="请选择店铺" clearable>
                            <el-option
                                v-for="(item, index) in shopList"
                                :key="index"
                                :label="item.shopName"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单编号：" prop="relatedId">
                        <el-input v-model="formData.relatedId" placeholder="请输入订单编号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="售后类型：" prop="aftersaleType">
                        <el-select v-model="formData.aftersaleType" placeholder="请选择售后类型" clearable>
                            <el-option v-for="(item, index) in aftersaleTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="申请原因：" prop="reasonCode">
                        <el-select v-model="formData.reasonCode" placeholder="请选择申请原因" clearable>
                            <el-option label="请先选择申请原因" value="aftersaleType" v-if="!formData.aftersaleType" disabled></el-option>
                            <el-option v-for="(item, index) in reasonList" :key="index" :label="item.description" :value="item.value" v-else></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="售后编号：" prop="aftersaleId">
                        <el-input v-model="formData.aftersaleId" placeholder="请输入售后编号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="旗帜：" prop="sellerRemarkStars" label-width="60px">
                        <el-select
                            v-model="sellerRemarkStars"
                            placeholder="请选择旗帜"
                            style="width: 165px"
                            clearable
                            @change="onChangeSelect"
                        >
                            <el-option :lable="item.label" :value="item.label" v-for="(item, index) in flag" :key="index">
                                <div class="px15">
                                    <i class="el-icon-s-flag font18" :style="{ color: colors(index) }"></i>
                                </div>
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="商家备注：" prop="ifRemark">
                        <el-select v-model="formData.ifRemark" placeholder="请选择商家是否备注" clearable>
                            <el-option label="已备注" :value="1"></el-option>
                            <el-option label="未备注" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="采购状态：" prop="isPlatformOrder">
                        <el-select v-model="formData.isPlatformOrder" placeholder="请选择采购状态" clearable>
                            <el-option label="全部" :value="0"></el-option>
                            <el-option label="已采购" :value="1"></el-option>
                            <el-option label="未采购" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"  icon="el-icon-search" style="width: 86px;" @click="fetchList('search')">搜索</el-button>
                        <el-button icon="el-icon-delete" style="width: 86px;"  @click="onClear">清空</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="all-box">
                <div class="operation-content">
                    <el-button style="width: 104px;" icon="el-icon-refresh-right" type="primary"   @click.stop="isSyncOrderVisible = true">同步订单</el-button>
                    <el-button style="margin-left: 20px; width:103px" @click="onMutiDispose">批量同意退款</el-button>
                    <!-- <el-button size="small" @click="onDown">启动客户端</el-button> -->
                    <!-- <el-button type="primary" size="small" @click.stop="exportOrder" v-loading.fullscreen.lock="fullscreenLoading">导出订单</el-button> -->
                </div>
                <div class="tabs-content">
                    <el-tabs v-model="formData.AfterSalesSelectType" @tab-click="onClickTabs" stretch>
                        <el-tab-pane :name="item.name" v-for="(item, index) in tabs" :key="index">
                            <template slot="label">
                                <div>
                                    <span>{{ item.label }}</span>
                                    <span> {{ orderStatusCount[item.key] || 0 }}</span>
                                </div>
                            </template>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="refund-table-new" v-loading="tableloading">
                    <div>
                        <div class="theader">
                            <div class="th">
                                <el-checkbox :value="multipleSelection.length === tableData.length && tableData.length > 0" @change="e => multipleSelectionAllChange(e)"></el-checkbox>
                            </div>
                            <div class="th">售后订单明细</div>
                            <!-- <div class="th">金额</div> -->
                            <div class="th">店铺售后状态</div>
                            <div class="th">采购售后状态</div>
                            <div class="th">店铺售后操作</div>
                            <div class="th">采购售后操作</div>
                        </div>
                        <div class="tbody" v-if="formData.total > 0">
                            <div v-for="item in tableData" :key="item.id" class="tr">
                                <div class="tr-header">
                                    <div class="checkbox">
                                        <el-checkbox :value="multipleSelection.includes(item.id)" @change="e => multipleSelectionChange(e, item)"></el-checkbox>
                                    </div>
                                    <div class="type">
                                        <img src="@/assets/head-shou.png" alt="" />
                                        <span>{{item.textPartData ? item.textPartData.aftersaleTypeText : '-'}}</span>
                                    </div>
                                    <span class="line"></span>
                                    <span>订单号</span>
                                    <el-tooltip effect="dark" :content="item.parentOrderId" placement="top">
                                        <span class="order">{{ item.parentOrderId }}</span>
                                    </el-tooltip>
                                    <i
                                        class="el-icon-copy-document"
                                        v-clipboard:copy="item.parentOrderId"
                                        v-clipboard:success="onCopy"
                                        v-clipboard:error="onError"
                                    />
                                    <span class="line"></span>
                                    <span class="id">商品id</span>
                                    <el-tooltip effect="dark" :content="item.productId" placement="top">
                                        <span >{{ item.productId }}</span>
                                    </el-tooltip>
                                    <i
                                        class="el-icon-copy-document"
                                        style="margin-left: 10px;"
                                        v-clipboard:copy="item.productId"
                                        v-clipboard:success="onCopy"
                                        v-clipboard:error="onError"
                                    />
                                </div>
                                <div class="tr-body">
                                    <div class="td td-info">
                                        <div class="info">
                                            <div class="left">
                                                <el-image 
                                                    fit="cover"
                                                    style="width: 50px; height: 50px;"
                                                    :preview-src-list="[item.productImage]"
                                                    :src="item.productImage">
                                                </el-image>
                                            </div>
                                            <div class="right">
                                                <div class="name">
                                                    <el-tooltip effect="dark" :content="item.productName" placement="top">
                                                        <span class="order">{{ item.productName }}</span>
                                                    </el-tooltip>
                                                </div>
                                                <div class="amount">
                                                    抖店实收：<span>￥{{ (item.refundAmount / 100).toFixed(2) || '-' }}</span>
                                                </div>
                                                <div class="sub-order">
                                                    <span class="label">子订单编号：</span>
                                                    <el-tooltip effect="dark" :content="item.pddOrderId || '-'" placement="top">
                                                        <span class="order">{{item.pddOrderId || '-'}}</span>
                                                    </el-tooltip>
                                                    <i
                                                        class="el-icon-copy-document"
                                                        v-clipboard:copy="item.pddOrderId"
                                                        v-clipboard:success="onCopy"
                                                        v-clipboard:error="onError"
                                                    ></i>
                                                </div>
                                                <div class="spec">
                                                    规格：
                                                    <el-tooltip effect="dark" :content="item.skuSpec" placement="top">
                                                        <span>{{ item.skuSpec }}</span>
                                                    </el-tooltip>
                                                </div>
                                                <div class="time">
                                                    申请时间：
                                                    {{ item.applyTime | timeformat(that) }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="td td-map">
                                        <div class="map">
                                            <img class="left" src="@/assets/dy-shouhou-icon.png" alt="" />
                                            <div class="right">
                                                <div class="icon-item">
                                                    <div >
                                                        店铺名称：
                                                        <el-tooltip effect="dark" :content="item.shopName" placement="top">
                                                            <span>{{ item.shopName }}</span>
                                                        </el-tooltip>
                                                    </div> 
                                                </div>
                                                <div class="icon-item">
                                                    <div class="red">
                                                        抖店订单：
                                                        <el-tooltip effect="dark" :content="item.parentOrderId" placement="top">
                                                            <span style="color: #0080ff">{{ item.parentOrderId }}</span>
                                                        </el-tooltip>
                                                    </div> 
                                                </div>
                                                <div class="icon-item">
                                                    <div class="blue2">
                                                        抖店售后：
                                                        <el-tooltip effect="dark" :content="item.textPartData ? item.textPartData.aftersaleStatusText : '-'" placement="top">
                                                            <span style="color: #f73">{{ item.textPartData ? item.textPartData.aftersaleStatusText : '-' }}</span>
                                                        </el-tooltip>
                                                    </div> 
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="td td-map">
                                        <div class="map">
                                            <img class="left" src="@/assets/alibaba-shouhou-icon.png" alt="" />
                                            <div class="right">
                                                <div class="icon-item">
                                                    <div >
                                                        采购账号：
                                                        <el-tooltip effect="dark" :content="item.pddUserName" placement="top">
                                                            <span>{{ item.pddUserName }}</span>
                                                        </el-tooltip>
                                                        <p style="font-size:12px;cursor: pointer;display: inline-block;" @click="onSale(item)">
                                                            <i
                                                                class="el-icon-date"
                                                                style="color:rgb(87,173,126);"/>
                                                            <span style="color:rgb(87,173,126);">售后详情</span>
                                                        </p>
                                                    </div> 
                                                </div>
                                                <div class="icon-item">
                                                    <div class="red">
                                                        采购订单：
                                                        <el-tooltip effect="dark" :content="item.pddOrderId" placement="top">
                                                            <span style="color: #f73">{{ item.pddOrderId }}</span>
                                                        </el-tooltip>
                                                    </div> 
                                                </div>
                                                <div class="icon-item">
                                                    <div class="blue2">
                                                        采购售后：
                                                        <el-tooltip v-if="item.platform == 1 || item.platform == 2" effect="dark" :content=" item.currentStatus || item.refundAction" placement="top">
                                                            <span style="color: #0080ff">{{ item.currentStatus || item.refundAction }}</span>
                                                        </el-tooltip>
                                                        <el-tooltip v-else effect="dark" :content="pddActualRefundOption[item.pddActualRefundStatus]" placement="top">
                                                            <span style="color: #0080ff">{{ pddActualRefundOption[item.pddActualRefundStatus] }}</span>
                                                        </el-tooltip>
                                                    </div> 
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="td td-operate">
                                        <el-button type="primary" @click="onDispose(item)" v-if="item.aftersaleStatus == 6">处理申请</el-button>
                                        <el-button type="primary" @click="onDispose(item)" v-if="item.aftersaleStatus == 11 && item.pddActualRefundStatus > 1">处理退款</el-button>
                                    </div>
                                    <div class="td td-operate">
                                        <template >
                                            <!-- 淘特 -->
                                            <!-- <el-button type="success" @click="onOpenTaoteClient(props.row)" v-if="row.pddOrderId && props.row.platform == 3">联系商家</el-button> -->
                                            <!-- 1688 | 供应链 -->
                                            <el-button type="primary" @click="onPruchaseDispose(item)" v-if="(item.platform == 1 || item.platform == 2) && item.pddOrderId && !item.refundId" :loading="pruchaseLoading">{{item.platform == 1 ? '申请供应商售后' : '申请1688售后'}}</el-button>
                                            <!-- PDD -->
                                            <!-- <el-button type="success" @click="onOpenClient(props.row)" v-if="row.pddOrderId && props.row.platform == 0">联系商家</el-button> -->
                                            <!-- 存在拼多多ID 状态为待商家收货 是否为本平台订单 是否未回填过拼多多物流单号  -->
                                            <!-- && row.pddBackFillStatus != 1 && row.pddBackFillStatus != 3 && props.row.platform != 3 -->
                                            <el-button style="margin: 5px 0;" type="primary" @click="onBackfillNo(item)" v-if="item.aftersaleStatus == 11 && item.pddOrderId">回填物流单号</el-button>
                                            <div>
                                                <el-tag v-if="item.pddBackFillStatus == 3" class="mt10">物流回填中</el-tag>
                                                <el-tag v-else-if="item.pddBackFillStatus == 2">物流回填失败</el-tag>
                                                <el-tag v-else-if="item.pddBackFillStatus == 1 && item.pddActualRefundStatus == 0" class="mt10">待上家同意退款</el-tag>
                                                <el-tag v-else class="mt10">{{pddActualRefundOption[item.pddActualRefundStatus]}}</el-tag>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                                <div class="tr-footer">
                                    <img class="dy-b" src="@/assets/dy-b.png" alt="" />
                                    <span>申请原因：</span>
                                    <span>{{ item.textPartData ? item.textPartData.reasonText : '-' }}</span>
                                    <span></span>
                                    <!-- <span>采购账号</span> -->
                                    <span class="line"></span>
                                    <span >店铺备注</span>
                                    <i
                                        class="el-icon-s-flag"
                                        :style="`color: ${colors(+item.sellerRemarkStars)}`"
                                    ></i>
                                    <el-tooltip
                                        effect="dark"
                                        placement="top"
                                        :content="item.sellerWords"
                                    >
                                        <span class="remark">{{ item.sellerWords || '-' }}</span>
                                    </el-tooltip>

                                </div>
                            </div>
                        </div>
                        <div class="empty mt100 mb100" v-else>
                            <el-empty
                                description="暂时没有找到任何订单信息"
                                :image-size="100"
                            ></el-empty>
                        </div>
                    </div>
                    <el-pagination
                        v-if="formData.total > 0"
                        style="display:flex; justify-content: flex-end; margin-top:22px "
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page.sync="formData.current"
                        :page-size="formData.size"
                        :page-sizes="[10, 20, 50, 100, 200, 500]"
                        :total="formData.total"
                        @current-change="onCurrentChange"
                        @size-change="onSizeChange"
                    ></el-pagination>
                </div>
                <div class="refund-table" v-loading="tableloading" element-loading-customClass="table-loading" v-if="false" > 
                    <el-table
                        :data="tableData"
                        ref="multipleTable"
                        :default-expand-all="true"
                        size="medium"
                        @header-dragend="setWidth"
                        @selection-change="handleSelectionChange"
                        :header-cell-style="{ background: '#f6f8fc' }"
                        row-key="id"
                        style="width: 100%"
                    >
                        <el-table-column
                            align="center"
                            fixed="left"
                            type="selection"
                            width="45"
                            :reserve-selection="true"
                        ></el-table-column>
                        <el-table-column type="expand" width="30">
                            <template slot-scope="props">
                                <!-- <el-form-item label="商品名称">
                                    <span>{{ props.row.name }}</span>
                                </el-form-item> -->
                                <div class="expand-info">
                                    <div class="order-info-status"><span @click="onPruchaseStatus(props.$index, props.row.orderPurchaseStatus)">{{props.row.orderPurchaseStatus ? '收起' : '展开'}} <i :class="props.row.orderPurchaseStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></span></div>
                                    <div class="order">
                                        <div style="margin-bottom: 15px;">
                                            主订单编号：{{props.row.parentOrderId || '-'}}
                                            <span>
                                                <i class="copy-icon iconfont icon-bianzu13" v-clipboard:copy="props.row.parentOrderId" v-clipboard:success="onCopy" v-clipboard:error="onError"></i>
                                            </span>
                                            子订单编号：{{props.row.pddOrderId || '-'}}
                                            <span>
                                                <i class="copy-icon iconfont icon-bianzu13" v-clipboard:copy="props.row.pddOrderId" v-clipboard:success="onCopy" v-clipboard:error="onError"></i>
                                            </span>
                                            售后编号：{{props.row.aftersaleId || '-'}}
                                            <span>
                                                <i class="copy-icon iconfont icon-bianzu13" v-clipboard:copy="props.row.aftersaleId" v-clipboard:success="onCopy" v-clipboard:error="onError"></i>
                                            </span>
                                            申请时间：{{props.row.applyTime | timeformat(that)}}
                                        </div>
                                        <div>收货信息：<span :class="{'decrypt-success': props.row.decryptStatus == 0}">{{props.row.decryptStatus | addressFormat(props.row)}}</span></div>
                                    </div>
                                    <div class="order-reason">
                                        <div>申请原因：{{props.row.textPartData ? props.row.textPartData.reasonText : '-'}}</div>
                                        <div v-if="props.row.orderErrorInfo" class="error-info">处理失败：{{props.row.orderErrorInfo}}</div>
                                    </div>
                                </div>
                                <el-table
                                    :data="props.row.purchaseData"
                                    v-show="props.row.orderPurchaseStatus == 1"
                                    border
                                    size="medium"
                                    :header-cell-style="{ background: '#f3f7ff' }"
                                    style="width: 100%">
                                    <el-table-column label="商品采购信息" width="300">
                                        <template slot-scope="{row}">
                                            <!-- PDD商品时才能查看链接 -->
                                            <div v-if="props.row.platform == 0">
                                                采购-商品链接 
                                                <el-link
                                                    :href="row.purchaseUrl"
                                                    target="_blank"
                                                    :underline="false"
                                                    type="primary"
                                                >
                                                    <el-button type="text" style="padding: 0;">{{row.purchaseUrl ? '查看' : '-'}}</el-button>
                                                </el-link>
                                            </div>
                                            <div>{{platformPrefix(props.row.platform)}}店铺：{{row.pddShopName || '-'}}</div>
                                            <div>
                                                {{platformPrefix(props.row.platform)}}订单ID：{{row.pddOrderId || '-'}}
                                                <i class="copy-icon iconfont icon-bianzu13" v-clipboard:copy="row.pddOrderId" v-clipboard:success="onCopy" v-clipboard:error="onError"></i>
                                            </div>
                                            <div>商品名称：{{row.productName || '-'}}</div>
                                            <div>商品规格：{{row.pddSpec || '-'}}</div>
                                            <div>{{platformPrefix(props.row.platform)}}下单时间：{{row.pddOrderTime || '-'}}</div>
                                            <div><span style="color: rgb(70, 180, 109);">订单备注：</span>{{row.purchaseRemark}}</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="支付信息">
                                        <template slot-scope="{row}">
                                            <div>件数：{{row.purchaseQuantity}}</div>
                                            <div>退款金额：<span style="color: #999;">¥ {{row.pddRefundAmount | rounding}}</span></div>
                                            <div>实际退款金额：<span style="color: #999;">¥ {{row.pddAlreadyRefundAmount | rounding}}</span></div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="物流信息">
                                        <template slot-scope="{row}">
                                            <div>快递公司：{{row.returnLogisticsCompanyName || '-'}}</div>
                                            <div>退货单号：{{row.returnLogisticsCode || '-'}}</div>
                                            <div>退货地址：{{row.receiver || '-'}}<span class="px5">{{row.receiverAddress}}</span>{{row.receiverPhone || ''}}</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="申请原因">
                                        <template slot-scope="{row}">
                                            <div>原因：{{row.pddQuestionDesc || '-'}}</div>
                                            <div>描述：{{row.pddApplyReason || '-'}}</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="申请时间">
                                        <template slot-scope="{row}">
                                            <div>{{row.pddAfterSalesCreatedTime || '-'}}</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="售后状态">
                                        <template slot-scope="{row}">
                                            <!-- 供应链订单 -->
                                            <div v-if="props.row.platform == 1 || props.row.platform == 2">{{row.currentStatus || row.refundAction}}</div>
                                            <div v-else>{{pddRefundStatusOption[row.pddAfterSalesStatus]}}</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="{row}">
                                            <!-- 淘特 -->
                                            <!-- <el-button type="success" @click="onOpenTaoteClient(props.row)" v-if="row.pddOrderId && props.row.platform == 3">联系商家</el-button> -->
                                            <!-- 1688 | 供应链 -->
                                            <el-button type="primary" @click="onPruchaseDispose(props.row)" v-if="(props.row.platform == 1 || props.row.platform == 2) && row.pddOrderId && !props.row.refundId" :loading="pruchaseLoading">{{props.row.platform == 1 ? '申请供应商售后' : '申请1688售后'}}</el-button>
                                            <!-- PDD -->
                                            <!-- <el-button type="success" @click="onOpenClient(props.row)" v-if="row.pddOrderId && props.row.platform == 0">联系商家</el-button> -->
                                            <!-- 存在拼多多ID 状态为待商家收货 是否为本平台订单 是否未回填过拼多多物流单号  -->
                                            <!-- && row.pddBackFillStatus != 1 && row.pddBackFillStatus != 3 && props.row.platform != 3 -->
                                            <el-button style="margin: 10px 0;" type="primary" @click="onBackfillNo(props.row)" v-if="row.aftersaleStatus == 11 && row.pddOrderId">回填物流单号</el-button>
                                            <div>
                                                <el-tag v-if="row.pddBackFillStatus == 3" class="mt10">物流回填中</el-tag>
                                                <el-tag v-else-if="row.pddBackFillStatus == 2">物流回填失败</el-tag>
                                                <el-tag v-else-if="row.pddBackFillStatus == 1 && row.pddActualRefundStatus == 0" class="mt10">待上家同意退款</el-tag>
                                                <el-tag v-else class="mt10">{{pddActualRefundOption[row.pddActualRefundStatus]}}</el-tag>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column width="450" label="商品信息">
                            <template slot-scope="{row}">
                                <div class="goods-info">
                                    <el-image class="goods-info-image" :src="row.productImage">
                                        <div slot="error" class="image-slot">
                                            <i class="el-icon-picture-outline"></i>
                                        </div>
                                    </el-image>
                                    <div class="info">
                                        <div class="goods-name">
                                            <el-tag effect="dark" v-if="row.platform == 1">供应链订单</el-tag>
                                            <el-tag effect="dark" v-else-if="row.platform == 2">1688订单</el-tag>
                                            <el-tag effect="dark" v-else-if="row.platform == 3">淘特订单</el-tag>
                                            {{row.productName}}
                                        </div>
                                        <div class="goods-spec"><span>{{row.skuSpec}}</span></div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column width="150" label="店铺名称">
                            <template slot-scope="{row}">
                                <span>{{row.shopName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="180" label="交易信息">
                            <template slot-scope="{row}">
                                <div>售后件数：{{row.aftersaleNum}}</div>
                                <div style="color: #999;">退款金额 ¥ {{row.refundAmount | rounding}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="190" label="售后状态">
                            <template slot-scope="{row}">
                                <span>{{row.textPartData ? row.textPartData.aftersaleStatusText : '-'}}</span>
                                <div class="countdown">{{orderCountDown(row)}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="150" label="售后类型">
                            <template slot-scope="{row}">
                                <div class="order-type">
                                    <span>{{row.textPartData ? row.textPartData.aftersaleTypeText : '-'}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="150" label="商家备注">
                            <template slot-scope="{row}">
                                <div class="order-remarks">
                                    商家备注：
                                    <template>
                                        <i
                                            class="el-icon-s-flag"
                                            :style="`color: ${colors(+row.sellerRemarkStars)}`"
                                        ></i>
                                        <el-tooltip
                                            effect="dark"
                                            placement="top"
                                            :content="row.sellerWords"
                                            :disabled="!row.sellerWords || (row.sellerWords && row.sellerWords.length < 10)"
                                        >
                                            <span>{{ row.sellerWords || '-' }}</span>
                                        </el-tooltip>
                                    </template>
                                </div>
                            </template>
                            <!-- <template slot-scope="scope">
                                <span>商家备注：-</span>
                            </template> -->
                        </el-table-column>
                        <el-table-column width="170" label="标记订单">
                            <template slot-scope="{row}">
                                <div class="order-tag">
                                    <template v-if="row.orderSignId">
                                        <i class="el-icon-s-order tag-icon"></i>
                                        <span>{{row.orderSignName}}</span>
                                        <i class="el-icon-edit edit-icon" @click="onOrderTag(row)"></i>
                                        <div class="remark ellipsis-2">
                                            备注：
                                            <el-tooltip
                                                :content="row.orderSignRemark"
                                                placement="top"
                                            >
                                                <span>{{ row.orderSignRemark || '-' }}</span>
                                            </el-tooltip>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <i class="el-icon-s-order tag-icon"></i>
                                        <el-button type="text" size="medium" @click="onOrderTag(row)">标记订单</el-button>
                                    </template>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column width="150px" fixed="right" label="操作" align="center">
                            <template slot-scope="{row}">
                                <el-button type="primary" @click="onDispose(row)" v-if="row.aftersaleStatus == 6">处理申请</el-button>
                                <el-button type="primary" @click="onDispose(row)" v-if="row.aftersaleStatus == 11 && row.pddActualRefundStatus > 1">处理退款</el-button>
                            </template>
                        </el-table-column>
                        <template slot="empty">
                            <div class="empty">
                                <el-empty
                                    description="暂时没有找到任何订单信息"
                                    :image-size="100"
                                    v-if="!tableData.length && !tableloading"
                                ></el-empty>
                            </div>
                        </template>
                    </el-table>
                    <el-pagination
                        v-if="formData.total > 0"
                        style="display:flex; justify-content: flex-end; margin-top:22px "
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page.sync="formData.current"
                        :page-size="formData.size"
                        :page-sizes="[10, 20, 50, 100, 200, 500]"
                        :total="formData.total"
                        @current-change="onCurrentChange"
                        @size-change="onSizeChange"
                    ></el-pagination>
                </div>
            </div>
        </div>
        <!-- 采购信息弹窗 -->
        <el-dialog title="采购信息" class="procurement-details" :visible.sync="procurementDetailsVisible">
            <div class="detail" v-if="procurementDetailsData">
                <div class="product">
                    <div class="title">商品采购信息</div>
                    <div class="main">
                        <div class="row">
                            <div class="label">店铺名称：</div>
                            <div class="content">
                                <el-tooltip
                                    effect="dark"
                                    placement="top"
                                    :content="procurementDetailsData.pddShopName || '-'"
                                >
                                    <span >{{ procurementDetailsData.pddShopName  || '-' }}</span>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="row">
                            <div class="label">订单ID：</div>
                            <div class="content">
                                <el-tooltip
                                    effect="dark"
                                    placement="top"
                                    :content="procurementDetailsData.pddOrderId || '-'"
                                >
                                    <span >{{ procurementDetailsData.pddOrderId  || '-' }}</span>
                                </el-tooltip>
                                <i 
                                    class="el-icon-copy-document" 
                                    v-clipboard:copy="procurementDetailsData.pddOrderId"
                                    v-clipboard:success="onCopy"
                                    v-clipboard:error="onError"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="label">商品名称：</div>
                            <div class="content">
                                <el-tooltip
                                    effect="dark"
                                    placement="top"
                                    :content="procurementDetailsData.productName ||'-'"
                                >
                                    <span >{{ procurementDetailsData.productName  || '-' }}</span>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="row">
                            <div class="label">商品链接：</div>
                            <div class="content">
                                <a v-if="procurementDetailsData.purchaseUrl" :href="procurementDetailsData.purchaseUrl" target="_blank">
                                    查看
                                </a>
                                <span v-else>-</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="label">商品规格：</div>
                            <div class="content">
                                <el-tooltip
                                    effect="dark"
                                    placement="top"
                                    :content="procurementDetailsData.pddSpec || '-'"
                                >
                                    <span >{{ procurementDetailsData.pddSpec  || '-' }}</span>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="row">
                            <div class="label">下单时间：</div>
                            <div class="content">
                                <el-tooltip
                                    effect="dark"
                                    placement="top"
                                    :content="procurementDetailsData.pddOrderTime || '-'"
                                >
                                    <span >{{ procurementDetailsData.pddOrderTime  || '-' }}</span>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="row">
                            <div class="label">订单备注：</div>
                            <div class="content">
                                <el-tooltip
                                    effect="dark"
                                    placement="top"
                                    :content="procurementDetailsData.purchaseRemark || '-'"
                                >
                                    <span >{{ procurementDetailsData.purchaseRemark  || '-' }}</span>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="row">
                            <div class="label">商品数量：</div>
                            <div class="content">
                                <el-tooltip
                                    effect="dark"
                                    placement="top"
                                    :content="procurementDetailsData.purchaseQuantity || '-' "
                                >
                                    <span >{{ procurementDetailsData.purchaseQuantity  || '-' }}</span>
                                </el-tooltip>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="logistics">
                    <div class="title">厂家售后信息</div>
                    <div class="main">
                        <div class="row">
                            <div class="label">申请原因：</div>
                            <div class="content">
                                <el-tooltip
                                    effect="dark"
                                    placement="top"
                                    :content="procurementDetailsData.pddQuestionDesc || '-' "
                                >
                                    <span >{{ procurementDetailsData.pddQuestionDesc  || '-' }}</span>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="row">
                            <div class="label">申请时间：</div>
                            <div class="content">
                                <el-tooltip
                                    effect="dark"
                                    placement="top"
                                    :content="procurementDetailsData.pddAfterSalesCreatedTime || '-' "
                                >
                                    <span >{{ procurementDetailsData.pddAfterSalesCreatedTime  || '-' }}</span>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="row">
                            <div class="label">售后状态：</div>
                            <div class="content">
                                <span v-if="procurementDetailsData.platform == 1 || procurementDetailsData.platform == 2">{{procurementDetailsData.currentStatus || procurementDetailsData.refundAction || '-'}}</span>
                                <span v-else>{{pddRefundStatusOption[procurementDetailsData.pddAfterSalesStatus] || '-'}}</span>
                                
                            </div>
                        </div>
                        <div class="row">
                            <div class="label">快递公司：</div>
                            <div class="content">
                                <el-tooltip
                                    effect="dark"
                                    placement="top"
                                    :content="procurementDetailsData.returnLogisticsCompanyName || '-' "
                                >
                                    <span >{{ procurementDetailsData.returnLogisticsCompanyName  || '-' }}</span>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="row">
                            <div class="label">退货单号：</div>
                            <div class="content">
                                <el-tooltip
                                    effect="dark"
                                    placement="top"
                                    :content="procurementDetailsData.returnLogisticsCode || '-' "
                                >
                                    <span>{{ procurementDetailsData.returnLogisticsCode  || '-' }}</span>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="row">
                            <div class="label">退货地址：</div>
                            <div class="content">
                                <el-tooltip
                                    effect="dark"
                                    placement="top"
                                    :content="`${procurementDetailsData.receiver || '-'}${procurementDetailsData.receiverAddress}${procurementDetailsData.receiverPhone || ''}`"
                                >
                                    <span>{{ procurementDetailsData.receiver || '-' }}{{procurementDetailsData.receiverAddress}}{{procurementDetailsData.receiverPhone || ''}}</span>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="row">
                            <div class="label">退款金额：</div>
                            <div class="content">
                                 <el-tooltip
                                    effect="dark"
                                    placement="top"
                                    :content="procurementDetailsData.pddRefundAmount || '-' "
                                >
                                    <span >{{ procurementDetailsData.pddRefundAmount  || '-' }}</span>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="row">
                            <div class="label">实际退款金额：</div>
                            <div class="content">
                                <el-tooltip
                                    effect="dark"
                                    placement="top"
                                    :content="procurementDetailsData.pddAlreadyRefundAmount || '-' "
                                >
                                    <span >{{ procurementDetailsData.pddAlreadyRefundAmount  || '-' }}</span>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="operate">
                    <div class="title">售后操作</div>
                    <div class="main">
                        <el-button type="primary" @click="onPruchaseDispose(procurementDetailsData)" v-if="(procurementDetailsData.platform == 1 || procurementDetailsData.platform == 2) && procurementDetailsData.pddOrderId && !procurementDetailsData.refundId" :loading="pruchaseLoading">{{procurementDetailsData.platform == 1 ? '申请供应商售后' : '申请1688售后'}}</el-button>
                        <!-- PDD -->
                        <!-- <el-button type="success" @click="onOpenClient(props.row)" v-if="row.pddOrderId && props.row.platform == 0">联系商家</el-button> -->
                        <!-- 存在拼多多ID 状态为待商家收货 是否为本平台订单 是否未回填过拼多多物流单号  -->
                        <!-- && row.pddBackFillStatus != 1 && row.pddBackFillStatus != 3 && props.row.platform != 3 -->
                        <el-button style="margin: 10px 0;" type="primary" @click="onBackfillNo(procurementDetailsData)" v-if="procurementDetailsData.aftersaleStatus == 11 && procurementDetailsData.pddOrderId">回填物流单号</el-button>
                        <template>
                            <el-tag v-if="procurementDetailsData.pddBackFillStatus == 3" class="mt10">物流回填中</el-tag>
                            <el-tag v-else-if="procurementDetailsData.pddBackFillStatus == 2">物流回填失败</el-tag>
                            <el-tag v-else-if="procurementDetailsData.pddBackFillStatus == 1 && procurementDetailsData.pddActualRefundStatus == 0" class="mt10">待上家同意退款</el-tag>
                            <el-tag v-else class="mt10">{{pddActualRefundOption[procurementDetailsData.pddActualRefundStatus]}}</el-tag>
                        </template>
                    </div>
                </div>
            </div>

        </el-dialog>
        <!-- 同步订单弹窗 -->
        <dialog-sync-order
            :visible="isSyncOrderVisible"
            :data="shopList"
            @close="isSyncOrderVisible = false"
            @success="fetchList"
        ></dialog-sync-order>
        <!-- 打开客户端 -->
        <scheme-dialog ref="scheme" @close="schemeLoading = false"/>
        <dialog-agree ref="agreeDialog" @success="fetchList"/>
        <dialog-agree-addr ref="agreeAddrDialog" @success="fetchList"/>
        <dialog-tag ref="tagDialog" @success="fetchList"/>
        <dialog-back-fill ref="backFillDialog" @success="fetchList"/>
        <dialog-agree-again ref="agreeAgainDialog" @success="fetchList" />
        <!-- 采购售后 -->
        <dialog-purchase ref="dialogPurchaseDispose" @success="fetchList" />
    </div>
</template>

<script>
import Pages from '@/components/page/page'
import DialogSyncOrder from './modules/DialogSyncOrder'
import DialogAgree from './modules/DialogAgree'
import DialogAgreeAddr from './modules/DialogAgreeAddr'
import DialogPurchase from './modules/DialogPurchase'
import DialogTag from './modules/DialogTag.vue'
import DialogBackFill from './modules/DialogBackFill'
import DialogAgreeAgain from './modules/DialogAgreeAgain.vue'
import TimeFormats from '@/util/TimeFormats'
import { fetchList, getOrderStatusCount, refundOperate, afterSaleOperate1688 } from '@/api/refund/order'
import { signFetchList } from '@/api/dfh/sign'
import schemeDialog from '@/components/scheme/scheme'
import { remote } from '@/api/admin/dict'
import { mapState } from 'vuex'
import { getClientStatus } from '@/api/info'

export default {
    components: {
        Pages,
        DialogSyncOrder,
        schemeDialog,
        DialogAgree,
        DialogAgreeAddr,
        DialogTag,
        DialogBackFill,
        DialogAgreeAgain,
        DialogPurchase
    },
    filters: {
        // 格式化时间戳
        timeformat (val, vue) {
            if (!val) {
                return '-'
            }
            return vue.formatTime(val * 1000, 'YYYY-MM-DD hh:mm:ss')
        },
        // 收货地址格式化
        addressFormat (val, item) {
            if (val == 1) {
                return `${item.consigneeName || ''} ${item.consigneePhone || ''} ${item.province || ''} ${item.city || ''} ${item.town || ''} ${item.street || ''} ${item.consigneeAddress && item.consigneeAddress.length > 100 ? '******' : item.consigneeAddress || ''}`
            }
            return '尚未解密'
        },
        rounding (val) {
            if (!val) {
                return '-'
            }
            return val / 100
        }
    },
    watch: {
        refundStatus (val, oldVal) {
            if (val != null) {
                const today = this.$moment().format('YYYY-MM-DD')
                this.formData = {
                    current: 1,
                    size: this.formData.size,
                    AfterSalesSelectType: val,
                    createTimeArrNew: [today, today]
                }
                this.sellerRemarkStars = ''
                this.fetchList()
                this.$store.commit('SET_REFUNDSTATUS', null)
            }
        },
        // 'formData.size': {
        //     handler (val, oldVal) {
        //         this.formData.current = 1
        //         this.fetchList()
        //     }
        // }
    },
    data() {
        return {
            // 商家是否有备注，
            // 申请状态
            that: this,
            tableData: [],
            headerWidth: 0,
            parent: 'refund-table',
            input: '',
            purchaseData: [{}],
            shopList: [],
            formData: {
                AfterSalesSelectType: '0',
                current: 1,
                size: 10,
                total: 0
            },
            sellerRemarkStars: '',
            flag: [
                {id: 1, label: '灰旗', value: 0},
                {id: 2, label: '紫旗', value: 1},
                {id: 3, label: '蓝旗', value: 2},
                {id: 4, label: '绿旗', value: 3},
                {id: 5, label: '橙旗', value: 4},
                {id: 6, label: '红旗', value: 5}
            ],
            tabs: [
                // 待商家处理
                // 退款中
                // 退款成功
                // 退款失败
                // 待商家收货
                // 极速退款/退货
                // 拒绝售后申请
                // 售后关闭
                // 即将逾期
                {key: 'total', label: '全部', name: '0'},
                {key: 'waitRefund', label: '待商家处理', name: '1'},
                {key: 'rapidlyRefund', label: '极速退款', name: '2'},
                {key: 'refundOnly', label: '仅退款', name: '3'},
                {key: 'waitBuyerShipments', label: '待买家退货', name: '4'},
                {key: 'waitMerchantsShipments', label: '待商家收货', name: '5'},
                {key: 'refundSuccess', label: '退款成功', name: '6'},
                {key: 'aboutTimeout', label: '即将超时', name: '7',},
                {key: 'refundReject', label: '拒绝售后申请', name: '8'},
                {key: 'refundClosed', label: '售后关闭', name: '9'},
                {key: 'refundFail', label: '退款失败', name: '10'},
            ],
            aftersaleTypeList: [
                {label: '退货退款', value: 0},
                {label: '已发货仅退款', value: 1},
                {label: '未发货仅退款', value: 2},
                {label: '换货', value: 3},
                {label: '价保', value: 6},
                {label: '补寄', value: 7},
            ],
            arbitrateStatusList: [
                {label: '无仲裁记录', value: 0},
                {label: '仲裁中', value: 1},
                {label: '客服同意', value: 2},
                {label: '客服拒绝', value: 3},
                {label: '待商家举证', value: 4},
                {label: '协商期', value: 5},
                {label: '仲裁结束', value: 255},
            ],
            orderStatusCount: {},
            fullscreenLoading: false,
            isSyncOrderVisible: false,
            schemeLoading: false,
            tableloading: false,
            // 拼多多售后状态
            pddRefundStatusOption: {},
            // 拼多多实际退款状态
            pddActualRefundOption: {
                '0': '未退款',
                '1': '退款中',
                '2': '退款成功',
                '3': '退款失败',
            },
            multipleSelection: [],
            multipleList:[],
            signList: [],
            refunReasonOpt: {},
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 90
                },
            },
            clientStatus: 0,
            pruchaseLoading: false,

            procurementDetailsVisible: false,
            procurementDetailsData: null
        }
    },
    computed: {
        ...mapState({
            refundStatus: state => state.common.refundStatus,
        }),
        reasonList () {
            try {
                return this.refunReasonOpt[`after_sale_reason${this.formData.aftersaleType}`]
            } catch (err) {
                return []
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
    methods: {
        onCurrentChange(v) {
            this.formData.current = v
            this.fetchList()
        },
        onSizeChange(v) {
            this.formData.size = v
            this.formData.current = 1
            this.fetchList()
        },
        // 订单是否为供应链模式，则去掉PDD-
        platformPrefix (platform) {
            return ''
            // return platform == 0 ? 'PDD-' : ''
        },
        // 清空搜索选项
        onClear () {
            this.formData = {
                AfterSalesSelectType: '0',
                size: this.formData.size,
                current: 1
            }
            this.sellerRemarkStars = ''
            this.fetchList()
        },
        // 订单状态筛选
        onClickTabs() {
            this.formData.current = 1
            this.fetchList()
            // this.getList()
        },
        // 筛选旗帜
        onChangeSelect() {
            let flag = undefined;
            if(this.sellerRemarkStars != "" && this.sellerRemarkStars != undefined){
                flag = this.flag.find(e => e.label === this.sellerRemarkStars).value;
            }
            this.formData.sellerRemarkStars = flag;
        },
        // 下载客户端
        onDown () {
            let timer = null
            let number = 0
            if (this.clientStatus == 1) {
                window.location.href = 'kuaipai://client?router=dashboard'
            } else {
                this.$refs.scheme.schemeOpen(`kuaipai://client?router=dashboard`)
                this.schemeLoading = true
                timer = setInterval(async () => {
                    const { data } = await getClientStatus()
                    this.clientStatus = data.data
                    if (data.data == 1 || number >= 3) {
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
        // 导出订单
        exportOrder () {
            // getExportStatus().then(res =>{
            //     this.fullscreenLoading = true;
            //     exportOrder(this.formData).then(res => {
            //         this.fullscreenLoading = false;
            //         const type = 'application/gzip'
            //         const blob = new Blob([res.data], {type: type})
            //         const name = decodeURI(
            //             res.headers['content-disposition'].split('=')[1])
            //         if (window.navigator.msSaveBlob) {  //没有此判断的话，ie11下的导出没有效果
            //             window.navigator.msSaveBlob(blob, name)
            //         } else {
            //             const downloadElement = document.createElement('a')
            //             const href = window.URL.createObjectURL(blob)
            //             //后台再header中传文件名
            //             downloadElement.href = href
            //             downloadElement.download = name
            //             document.body.appendChild(downloadElement)
            //             downloadElement.click()
            //             document.body.removeChild(downloadElement)// 下载完成移除元素
            //         }
            //         return Promise.resolve(true)
            //     }).catch(() => {
            //         this.fullscreenLoading = false;
            //     })
            // })
        },
        // 每一条数据是否展开采购信息
        onPruchaseStatus (index, status) {
            console.log('status', status)
            const item = this.tableData[index]
            this.$set(this.tableData, index, {...item, orderPurchaseStatus: !status})
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
        //打开采购明细
        showProcurementDetails(item) {
            this.procurementDetailsVisible = true;
            this.procurementDetailsData = item;
        },
        // 订单标记
        onOrderTag (item) {
            this.$refs.tagDialog.showEdit(item)
        },
        // 售后处理
        onDispose (item) {
            console.log('item', item)
            if (item.aftersaleType == 0 && item.aftersaleStatus == 6) {
                // 退货退款
                this.$refs.agreeAddrDialog.showEdit(item)
            } else if (item.aftersaleType == 1 || item.aftersaleType == 2) {
                // 已发货仅退款 // 未发货仅退款
                this.$refs.agreeDialog.showEdit(item)
            } else if (item.aftersaleType == 0 && item.aftersaleStatus == 11 && item.pddActualRefundStatus > 1) {
                // 二次处理退款（退货退款，待商家收货）(PDD 返回退款状态后才能处理)
                this.$refs.agreeAgainDialog.showEdit(item)
            }
        },
        onSale(row) {
            let pddPaymentUrl = `https://mobile.pinduoduo.com/order.html?order_sn=${row.pddOrderId}&version=${row.pddOrderId}&refer_page_name=my_order`;
            if (window.electron) {
                const msg = {
                    key: 'saleUrl',
                    url: pddPaymentUrl,
                    id: row.relatedId
                }
                // 发送到electron进行跳转
                window.electron.send(msg)
            } else {
                window.open(pddPaymentUrl)
            }
        },
        // 批量同意退款
        onMutiDispose () {
            if (!this.multipleList.length) {
                this.$message.warning('请选择待处理订单！')
                return
            }
            // aftersaleStatus 6， 11 待商家处理
            // aftersaleType 1， 2 仅退款
            const that = this
            const meet = []
            const notMeet = []
            console.log(this.multipleList,1234)
            this.multipleList.forEach(item => {
                if (item.pddAfterSalesStatus==0 && (item.aftersaleStatus == 6 || item.aftersaleStatus == 11 || item.aftersaleStatus == 12) && (item.aftersaleType == 1 || item.aftersaleType == 2)) {
                    meet.push(item)
                } else {
                    notMeet.push(item)
                }
                console.log(item.pddAfterSalesStatus,item.aftersaleStatus,item.aftersaleType,1234)
            })
            
            if (!meet.length) {
                this.$alert('您选中的所有售后单的售后状态货或售后类型都不符合要求，无法批量同意退款。请重新选择售后单。', '温馨提示', {
                    confirmButtonText: '知道了',
                    callback: action => {
                    }
                })
                return
            }
            if (notMeet.length) {
                const orderShow = []
                const noOrders = notMeet.map((item, index) => {
                    if (index < 2) {
                        orderShow.push(item.aftersaleId)
                    }
                    return item.aftersaleId
                }).join(',')
                const notMeetLen = notMeet.length
                const h = this.$createElement
                this.$msgbox({
                    title: '批量同意退款',
                    confirmButtonText: '继续退款',
                    showCancelButton: true,
                    closeOnClickModal: false,
                    cancelButtonText: '取消',
                    customClass: 'multiple-order-msgbox',
                    message: h('div', null, [
                        h('p', { class: 'multiple-order-message' }, `你共选中${this.multipleList.length}个售后单，其中${notMeetLen}个因售后状态或售后类型不符合要求，无法批量退款，是否忽略这些售后单，继续退款？`),
                        h('p', { class: 'multiple-order-tip' }, [
                            h('span', null, `共${notMeetLen}个售后单不符合要求：${orderShow}${notMeetLen > 2 ? ' 等' : ''}`),
                            h('input', {attrs: {id: 'select-copy-text', value: noOrders}, style: {position: 'absolute', left: 0, top: 0, opacity: 0}}, ''),
                            h('el-button', {
                                props: {type: 'text'},
                                style: {marginLeft: '10px'},
                                on: {
                                    click: () => this.onOrderCopy()
                                }
                            }, '一键复制')
                        ])
                    ])
                })
                .then(() => {
                    that.onMeetSubmit(meet)
                })
                return
            }
            if (!notMeet.length) {
                this.onMeetSubmit(meet)
            }
        },
        onMeetSubmit (items) {
            const ids = items.map(item => item.aftersaleId)
            // 未发货仅退款
            const unshipped = []
            // 已发货仅退款
            const delivered = []
            items.map(item => {
                if (item.aftersaleType == 2) {
                    unshipped.push(item.refundAmount)
                } else if (item.aftersaleType == 1) {
                    delivered.push(item.refundAmount)
                }
            })
            const unshippedAmount = unshipped.length ? unshipped.sum() / 100 : 0
            const deliveredAmount = delivered.length ? delivered.sum() / 100 : 0
            const refundAmoundCount = (unshippedAmount * 100 + deliveredAmount * 100) / 100 // 为了解决相加可能会出现很多小数位的情况
            
            let message = `<div>
                <div>您一共同意<span style='color: red;'>${items.length}</span>笔退款，合计退款金额<span style='color: red;'>${refundAmoundCount}</span>元。</div>
                <div>其中，${unshipped.length ? `未发货仅退款${unshipped.length}笔，退款金额${unshippedAmount}元；` : ''}${delivered.length ? `未发货仅退款${delivered.length}笔，退款金额${deliveredAmount}元；` : ''}</div>
                <div>你同意退款的售后单中存在已发货或已退回商品，请确认商品物流状态，否则批量退款可能产生资损，确定后不可撤销</div>
            </div>`
            this.$confirm(message, '确定批量同意退款?', {
                dangerouslyUseHTMLString: true,
                closeOnClickModal: false,
                showClose: false,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'multiple-order-sub-msgbox',
                type: 'warning',
                beforeClose: async (action, instance, done) => {
                    const params = {
                        type: 201,
                        aftersaleIds: ids
                    }
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true
                        instance.confirmButtonText = '正在提交...'
                        const { data } = await refundOperate(params)
                        instance.confirmButtonLoading = false
                        if (data.code == 0) {
                            done()
                        }
                    } else {
                        done()
                    }
                }
            }).then((res) => {
                this.$message.success('操作成功')
                this.fetchList()
            })
        },
        onOrderCopy () {
            var text = document.getElementById("select-copy-text")
            console.log('text', text)
            text.select() // 选择对象
            document.execCommand("Copy")
            this.$message.success('复制成功')
        },
        // 采购售后
        async onPruchaseDispose (row) {
            this.pruchaseLoading = true
            try {
                const { data } = await afterSaleOperate1688({afterSaleId: row.aftersaleId})
                if (data.code == 0) {
                    this.$message.success('操作成功')
                    this.pruchaseLoading = false
                    this.fetchList()
                } else {
                    this.pruchaseLoading = false
                }
            } catch (err) {
                this.pruchaseLoading = false
            } finally {
                this.procurementDetailsVisible = false
            }
            // this.$refs.dialogPurchaseDispose.showModel(row)
        },
        // 联系商家，唤醒客户端
        onOpenClient (item) {
            let timer = null
            let number = 0
            if (this.clientStatus == 1) {
                window.location.href = `kuaipai://client?router=afterSale&orderId=${item.relatedId}`
            } else {
                this.$refs.scheme.schemeOpen(`kuaipai://client?router=afterSale&orderId=${item.relatedId}`)
                this.schemeLoading = true
                timer = setInterval(async () => {
                    const { data } = await getClientStatus()
                    this.clientStatus = data.data
                    if (data.data == 1 || number >= 3) {
                        clearInterval(timer)
                        timer = null
                        number = null
                        this.$refs.scheme.clearTimer()
                    }
                    number++
                }, 5000)
            }
        },
        // 淘特联系商家
        onOpenTaoteClient () {
            let timer = null
            let number = 0
            if (this.clientStatus == 1) {
                window.location.href = `kuaipai://client?router=taoteRefund&orderId=${item.parentOrderId}`
            } else {
                this.$refs.scheme.schemeOpen(`kuaipai://client?router=taoteRefund&orderId=${item.parentOrderId}`)
                this.schemeLoading = true
                timer = setInterval(async () => {
                    const { data } = await getClientStatus()
                    this.clientStatus = data.data
                    if (data.data == 1 || number >= 3) {
                        clearInterval(timer)
                        timer = null
                        number = null
                        this.$refs.scheme.clearTimer()
                    }
                    number++
                }, 5000)
            }
        },
        // 回填拼多多物流单号
        onBackfillNo (item) {
            this.procurementDetailsVisible = false;
            this.$refs.backFillDialog.showEdit(item)
        },
        scrollChange(x) {
            this.$refs.multipleTable.bodyWrapper.scrollLeft = x
        },
        setWidth() {
            this.headerDragend()
        },
        // 选中表格列表项
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        multipleSelectionChange(value, item) {
            if(value) {
                this.multipleSelection.push(item.id)
                this.multipleList.push(item)
            } else {
                this.multipleSelection = this.multipleSelection.filter(id => id !== item.id)
                this.multipleList = this.multipleList.filter(index => index.id !== item.id)
            }
            console.log(this.multipleSelection,this.multipleList,124)
        },
        multipleSelectionAllChange(value) {
            if(value) {
                this.multipleSelection = this.tableData.map(item => item.id)
                this.multipleList = this.tableData
            }
            else {
                this.multipleSelection = []
                this.multipleList = []
            }
        },
		// 时间日期转成时间戳
		getTimestamp(time) {
		   return (new Date(time)).getTime() / 1000
		},
        // 格式化时间戳
        formatTime(value, format = 'YYYY-MM-DD hh:mm:ss') {
            if (typeof (value) === 'string') value = +value;
            return value ? new TimeFormats().convertTime(format, value) : '-';
        },
        // 格式化到期处理时间
        orderCountDown (item) {
            const currentTime = new Date().getTime()
            let deadlineSec = item.statusDeadline && this.$moment(item.statusDeadline * 1000).diff(this.$moment(currentTime), 'seconds')
            const timer = this.$moment.duration(deadlineSec, 'seconds')
            const days = timer.days()
            const hours = timer.hours()
            const minutes = timer.minutes()
            let formatRes = days > 0 ? `${days}天${hours}小时${minutes}分` : `${hours}小时${minutes}分`
            switch (item.aftersaleStatus) {
                case '6':
                    // 待商家处理
                    formatRes = `${formatRes}后自动同意`
                    // if (item.aftersaleType == 0) {
                    //     // 退货退款
                    //     formatRes = `${formatRes}后自动同意`
                    // } else if (item.aftersaleType == 1 || item.aftersaleType == 2) {
                    //     // 仅退款
                    //     formatRes = `${formatRes}后自动同意`
                    // }
                    return formatRes
                break;
                case '7':
                    // 待买家退货
                    formatRes = `${formatRes}后售后关闭`
                    return formatRes
                break;
                case '11':
                    // 待商家收货
                    formatRes = `${formatRes}后自动同意`
                    return formatRes
                break;
            }
            return ''
        },
        async fetchList (type) {
            this.tableloading = true
            // 如果是搜索的话将重置页码
            if (type === 'search') {
                this.formData.current = 1
            }
            const params = {...this.formData}
            try {
                params['applyTimeStartTime'] = this.getTimestamp(`${this.formData.createTimeArrNew[0]} 00:00:00`)
                params['applyTimeEndTime'] = this.getTimestamp(`${this.formData.createTimeArrNew[1]} 23:59:59`)
            } catch (err) {
                console.log('error', err)
            }
            if (params.AfterSalesSelectType == 7) {
                params['orderByColumn'] = 'statusDeadline'
                params['orderByType'] = 0
            } else {
                // 除了即将超时的订单，其他的排序都按照申请时间降序来排
                params['orderByColumn'] = 'applyTime'
                params['orderByType'] = 1
            }
            const { data } = await fetchList(params)
            this.tableloading = false
            this.formData = {
                ...this.formData,
                current: data.data.current || 1,
                size: data.data.size || 0,
                total: data.data.total || 0
            }
            this.multipleSelection = []
            this.tableData = data.data.records.map(item => {
                return {
                    ...item,
                    orderPurchaseStatus: item.pddOrderId ? 1 : 0,
                    purchaseData: [{
                        purchaseUrl: item.purchaseUrl,
                        pddShopName: item.pddShopName,
                        pddOrderId: item.pddOrderId,
                        productName: item.productName,
                        pddOrderTime: item.pddOrderTime,
                        pddRefundAmount: item.pddRefundAmount,
                        pddAlreadyRefundAmount: item.pddAlreadyRefundAmount,
                        pddAfterSalesStatus: item.pddAfterSalesStatus,
                        aftersaleStatus: item.aftersaleStatus,
                        returnLogisticsCompanyName: item.returnLogisticsCompanyName,
                        returnLogisticsCode: item.returnLogisticsCode,
                        receiver: item.receiver,
                        receiverAddress: item.receiverAddress,
                        receiverPhone: item.receiverPhone,
                        pddQuestionDesc: item.pddQuestionDesc,
                        pddApplyReason: item.pddApplyReason,
                        pddAfterSalesCreatedTime: item.pddAfterSalesCreatedTime,
                        pddActualRefundStatus: item.pddActualRefundStatus,
                        isPlatformOrder: item.isPlatformOrder,
                        pddBackFillStatus: item.pddBackFillStatus,
                        currentStatus: item.currentStatus,
                        refundAction: item.refundAction
                    }]
                }
            })
            // 获取统计数据
            this.getOrderCount(params)
            this.$nextTick(() => {
                this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()
            })
        },
        async getShopList () {
            // 查询店铺列表
            const { data: { data } } = await this.$API.getShopList()
            this.shopList = data || []
        },
        async pddAfterStatus () {
            // 查询售后状态字典
            const { data } = await remote('pdd_after_sales_status')
            data.data.forEach(item => {
                this.pddRefundStatusOption[item.value] = item.label
            })
        },
        async afterTypeList () {
            // 查询售后类型字典
            const { data } = await remote('after_sale_type')
            this.aftersaleTypeList = data.data
        },
        async afterReasonList () {
            // 查询售后申请原因字典
            const { data } = await remote('after_sale_reason')
            data.data.forEach(item => {
                if (!(this.refunReasonOpt[item.label] instanceof Array)) {
                    this.refunReasonOpt[item.label] = []
                }
                this.refunReasonOpt[item.label].push(item)
            })
        },
        // 获取统计数量
        async getOrderCount (params) {
            const { data } = await getOrderStatusCount(params)
            this.orderStatusCount = data.data
        },
        async getSignList () {
            const { data } = await signFetchList()
            this.signList = data.data.records || []
        },
        initData () {
            
            const start = this.$moment().subtract(1, 'day').format('YYYY-MM-DD')
            const end = this.$moment().format('YYYY-MM-DD')
            if (this.refundStatus != null) {
                // 如果是从工作台进来，默认差的是当天，而不是两天
                this.formData.createTimeArrNew = [end, end]
                this.formData.AfterSalesSelectType = this.refundStatus
            } else {
                this.formData.createTimeArrNew = [start, end]
            }
            this.afterTypeList()
            this.pddAfterStatus()
            this.fetchList()
            this.getShopList()
            this.afterReasonList()
            this.getSignList()
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.initData()
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
    },
    activated () {
        this.onClientStatus()
    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>

<style lang="scss" scoped>
.refund {
    padding-bottom: 30px;
    ::v-deep .el-loading-mask {
        position: fixed;
    }
    .refund-content {
        margin-top: 0;
        box-sizing: border-box;
        .search-content {
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
                    display: flex;
                    margin-right: 22px;
                    margin-bottom: 20px;
                    .el-form-item__label {
                        line-height: 32px;
                    }
                }
            }
        }
        .all-box{
            padding: 16px 20px;
            background: #fff;
            border-radius: 12px;
            margin-top: 16px;
        }
        .operation-content {
            display: flex;
            justify-content: flex-end;

        }
        .tabs-content {
            margin-top: 16px;
            ::v-deep .el-tabs {
                .el-tabs__header {
                    margin-bottom: 0px;
                }
                .el-tabs__active-bar  {
                    display: none;
                }
                .el-tabs__nav.is-stretch {
                    display: block !important;
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
                    flex: auto;
                    padding: 0 12px;
                    background: #D4D6D9;
                    height: 32px;
                    line-height: 32px;
                    margin-right: 10px;
                    border-radius: 4px;
                
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
                            max-height: 16px;
                            display: inline-flex;
                            align-items: center;
                            background: #fff;
                            color: #D4D6D9;

                        }
                    }
                    &.is-active {
                        background: $themeColor;
                        & > div {
                            span:last-child {
                                color: $themeColor;
                            }
                        }
                    }
                    &:hover {
                        
                        background: $themeColor;
                        
                        & > div {
                            span:last-child {
                                color: $themeColor;
                            }
                        }
                    }
                }
            }
        }
        .refund-table-new {
            margin-top: 20px;
            .theader {
                width: 100%;
                padding: 15px;
                background: #f3f4f5;
                height: 46px;
                display: flex;
                align-items: center;
                .th {
                    color: #666;
                    font-size: 14px;
                    &:nth-child(1) {
                        width: 50px;
                        text-align: center;
                        flex-shrink: 0;
                    }
                    // &:nth-child(2) {
                    //     width: 30%;
                    //     min-width: 28px;
                    // }
                    &:nth-child(2) {
                        width: 30%;
                    }
                    &:nth-child(3) {
                        width: 25%;
                        min-width: 130px;
                    }
                    &:nth-child(4) {
                        width: 25%;
                        min-width: 130px;
                    }
                    &:nth-child(5) {
                        width: 15%;
                        text-align: center;
                        min-width: 130px;
                    }
                    &:nth-child(6) {
                        width: 15%;
                        text-align: center;
                        min-width: 130px;
                    }
                }
            }
            .tbody {
                
                .tr {
                    border: 1px solid rgba(24,23,28,.03922);
                    margin-top: 20px;
                    &-header {
                        display: flex;
                        padding: 15px;
                        border-bottom: 1px solid #dedede;
                        background: linear-gradient(90deg,rgba(47, 81, 255,.05882),rgba(136,95,253,0));
                        height: 46px;
                        font-size: 14px;
                        color: #666;
                        display: flex;
                        align-items: center;
                        .checkbox {
                            width: 50px;
                            text-align: center;
                        }
                        .type {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            min-width: 80px;
                            background: #f73;
                            color: #fff;
                            padding: 4px;
                            border-radius: 4px;
                            font-size: 12px;
                            text-align: center;
                            img {
                                width: 16px;
                            }
                        }
                        .order {
                            max-width: 180px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            margin: 0 10px;
                        }
                        .el-icon-copy-document {
                            font-size: 18px;
                            color: $themeColor;
                            cursor: pointer;
                        }
                        .line {
                            width: 2px;
                            height: 18px;
                            background: rgba(24,23,28,.10196);
                            margin: 0 15px;
                        }
                        .id {
                            @extend .order;
                        }
                    }
                    &-body {
                        display: flex;
                        align-items: center;
                        padding: 15px;
                        .td {
                           
                            display: flex;
                            align-items: center;
                            &.td-info {
                                width: 30%;
                                .info {
                                    padding-right:10px;
                                    text-align: left;
                                    align-self: flex-start;
                                    display: flex;
                                    align-items: flex-start;
                                    
                                    .left {
                                        width: 50px;
                                        flex-shrink: 0;
                                    }
                                    .right {
                                        margin-left: 10px;
                                        max-width: 280px;
                                        .name {
                                            color: #000;
                                            font-weight: bold;
                                            font-size: 14px;
                                            overflow: hidden;
                                            text-overflow: ellipsis;
                                            white-space: nowrap;
                                        }
                                        .amount {
                                            margin-top: 10px;
                                            .span {
                                                color: #FF4C4D;
                                                font-weight: bold;
                                            }

                                        }
                                        .sub-order {
                                            margin-top: 12px;
                                            display: flex;
                                            color: #666;
                                            font-size: 14px;
                                            .label {
                                                flex-shrink: 0;
                                            }
                                            .order {
                                                overflow: hidden;
                                                text-overflow: ellipsis;
                                                white-space: nowrap;
                                            }
                                            .el-icon-copy-document {
                                                font-size: 16px;
                                                color: $themeColor;
                                                flex-shrink: 0;
                                                cursor: pointer;

                                            }
                                        }
                                        .spec {
                                            margin-top: 12px;
                                            overflow: hidden;
                                            text-overflow: ellipsis;
                                            white-space: nowrap;
                                            color: #666;
                                            font-size: 14px;
                                        }
                                        .time {
                                            margin-top: 12px;
                                            color: #666;
                                            font-size: 14px;
                                        }
                                    }
                                }
                            }
                            &.td-map {
                                width: 25%;
                                .map {
                                    display: flex;
                                    align-items: center;
                                    flex-shrink: 0;
                                    .left {
                                        width: 20px;
                                    }
                                    .right {
                                        .icon-item {
                                            margin-top: 10px;
                                            margin-left: 5px;
                                            display: flex;
                                            &:first-child {
                                                margin-top: 0px;
                                            }
                                            div {
                                                border-radius: 0 2px 2px 0;
                                                padding: 4px;
                                                font-size: 12px;
                                                max-height: 250px;
                                                text-overflow: ellipsis;
                                                white-space: nowrap;
                                                overflow: hidden;
                                                color: rgb(0, 0, 0);
                                            }
                                        }
                                    }
                                }
                            }
                            &.td-operate {
                                min-width: 130px;
                                width: 15%;
                                min-width: 130px;
                                height: 3px;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                            }
                        }
                       
                    }
                    &-footer {
                        height: 46px;
                        border-top: 1px solid #dedede;
                        display: flex;
                        align-items: center;
                        color: #666;
                        padding: 0px 15px 0px 20px;
                        .dy-b {
                            width: 20px;
                            height: 20px;
                            margin-right: 6px;
                        }
                        .line {
                            width: 2px;
                            height: 18px;
                            background: rgba(24,23,28,.10196);
                            margin: 0 15px;
                        }
                        .el-icon-s-flag {
                            font-size: 18px;
                            margin: 0 10px;
                        }
                        .remark {
                            max-width: 180px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                    }
                }
            }
        }
        .refund-table {
            margin-top: 20px;
            ::v-deep .el-loading-mask {
                position: absolute;
            }
            ::v-deep .el-table {
                .el-table__header {
                    tr {
                        th {
                            height: 40px;
                            line-height: 40px;
                            background: #F8F9FB;
                            padding: 0;
                            color: #394D5F;
                        }
                    }
                }       
                .el-table__expanded-cell {
                    padding: 10px 160px 30px 55px;
                    color: #333;
                    border-bottom: 20px solid #f0f2f5;
                    position: relative;
                    .expand-info {
                        display: flex;
                        margin-bottom: 20px;
                        .order-info-status {
                            margin-top: 18px;
                            margin-right: 15px;
                            color: rgb(70, 180, 109);
                            font-weight: 500;
                            font-size: 12px;
                            span {
                                cursor: pointer;
                            }
                        }
                        .order {
                            flex-basis: 1004px;
                            white-space: nowrap;
                            .copy-icon {
                                margin-left: 4px;
                                margin-right: 8px;
                                color: #333;
                            }
                            .decrypt-success {
                                color: rgb(70, 180, 109);
                            }
                        }
                        .order-remarks {
                            margin-left: 20px;
                            flex-basis: 160px;
                            line-height: 18px;
                        }
                        .order-reason {
                            flex-basis: 300px;
                            margin-left: 20px;
                            line-height: 20px;
                            position: relative;
                            .error-info {
                                color: red;
                                position: absolute;
                                top: 30px;
                                left: 0;
                            }
                        }
                    }
                    .copy-icon {
                        cursor: pointer;
                    }
                    .copy-icon:hover {
                        color: rgb(70, 180, 109);
                    }
                }
                .el-table__cell .cell {
                    color: #333;
                    .goods-info {
                        display: flex;
                        align-items: center;
                        &-image {
                            flex-basis: 50px;
                            height: 50px;
                            border-radius: 5px;
                            .image-slot {
                                text-align: center;
                                line-height: 50px;
                                background-color: #ededed;
                            }
                        }
                        .info {
                            font-size: 14px;
                            flex: 1;
                            padding-left: 12px;
                            padding-right: 50px;
                            .goods-name {
                                line-height: 18px;
                                margin-bottom: 5px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                line-clamp: 2;
                                -webkit-box-orient: vertical;
                                .el-tag {
                                    height: 22px;
                                    line-height: 20px;
                                    margin-bottom: 5px;
                                    margin-right: 5px;
                                }
                            }
                            .goods-spec span {
                                color: rgb(70, 180, 109);
                            }
                        }
                    }
                    .order-type {
                        padding: 2px 0;
                        span {
                            padding: 2px 4px;
                            border-radius: 5px;
                            color: rgb(70, 180, 109);
                            border: 1px solid rgb(70, 180, 109);
                            font-weight: 500;
                        }
                    }
                    .order-tag {
                        .tag-icon {
                            color: red;
                            font-size: 18px;
                            margin-right: 2px;
                            transform: translateY(1px);
                        }
                        .edit-icon {
                            color: rgb(70, 180, 109);
                            cursor: pointer;
                        }
                        .el-button {
                            padding: 0;
                        }
                    }
                    .countdown {
                        color: red;
                        font-size: 13px;
                    }
                }
                .el-table__empty-block {
                    min-height: 400px;
                }
            }
        }
    }
}
.procurement-details {
    ::v-deep .el-dialog {
        width: 70%;
        background-color: rgb(244, 243, 247);
        .el-dialog__body {
            padding-top: 0px;
            padding-bottom: 50px;
        }
        .detail {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            & > div {
                width: 33%;
                border-radius: 4px;
                padding: 12px;
                height: 400px;
                background: #fff;
                position: relative;
                &::after{ 
                    display: block;
                    content: "";
                    width: 100%;
                    height: 18px;
                    position: absolute;
                    left: 0;
                    bottom: -18px;
                    z-index: 999;
                    background-image: url(~@/assets/purchasing-info.png);
                    background-size: contain;
                    background-position: bottom;
                    background-repeat: no-repeat;
                    background-size: 100%;
                }
                .title {
                    width: 100%;
                    color: #161221;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 24px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid rgba(12,23,28,.1);
                }
                &.product{
                    border-top: 4px solid $themeColor;
                }
                &.logistics {
                    border-top: 4px solid #f73;
                }
                &.product,&.logistics {
                    .main {
                        .row {
                            margin-top: 10px;
                            font-size: 14px;
                            display: flex;
                            line-height: 18px;
                            .label {
                                width: 110px;
                                text-align: right;
                                color: #777;
                                flex-shrink: 0;
                            }
                            .content {
                                margin-left: 4px;
                                display: flex;
                                align-items: center;
                                color: #000;
                                flex: 1;
                                width: 1px;
                                a {
                                    color: $themeColor;
                                    text-decoration: underline;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                                span {
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                                i {
                                    margin-left: 6px;
                                    cursor: pointer;
                                    flex-shrink: 0;
                                    font-weight: 16px;
                                    color: $themeColor;
                                }
                            }
                        }
                    }
                }
                

                &.operate {
                    border-top: 4px solid #ff4d4d;
                    .main {
                        height: 300px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
                }

               
                
            }

        }
    }
   
    
    
}
</style>

<style lang="scss">
.multiple-order-msgbox {
    width: 600px;
    .multiple-order-message {
        color: #12141a;
        font-weight: 500;
        line-height: 20px;
        margin-bottom: 8px;
    }
    .multiple-order-tip {
        color: #898b8f;
    }
}
.multiple-order-sub-msgbox {
    .el-message-box__header {
        padding-left: 50px;
        padding-top: 20px;
    }
    .el-message-box__status {
        top: -41px;
        transform: translateY(0);
    }
}
</style>