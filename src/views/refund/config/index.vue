<template>
    <div class='refund-config'>
        <div class="config-content">
            <div class="alert">
                <i class="el-icon-warning" />
                <span>开启自动售后之后，系统将根据设置的对应条件自动去申请售后处理</span>
            </div>
            <div class="config-header">
                <div class="title">请选择筛选条件</div>
                <el-form inline :model="formData" class="form-box">
                    <el-form-item label="创建时间：" prop="orderCreateTimeStart">
                        <el-date-picker
                            v-model="formData.createTimeArr"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                            value-format="yyyy-MM-dd"
                            style="width:336px"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="选择店铺：">
                        <el-select v-model="formData.shopId" placeholder="请选择店铺" clearable style="width: 165px;">
                            <el-option
                                v-for="(item, index) in shopList"
                                :key="index"
                                :label="item.shopName"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单类型：">
                        <el-select v-model="orderType" disabled placeholder="请选择订单类型" clearable style="width: 165px;">
                            <el-option
                                v-for="(item, index) in orderTypeList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单编号：">
                        <el-input v-model="formData.orderId" placeholder="请输入订单编号" clearable style="width: 165px;"></el-input>
                    </el-form-item>
                    <el-form-item label="售后编号：">
                        <el-input v-model="formData.aftersaleId" placeholder="请输入售后编号" clearable style="width: 165px;"></el-input>
                    </el-form-item>
                    <el-form-item label="处理状态：">
                        <el-select v-model="formData.orderProcessingStatus" placeholder="请选择处理状态" clearable style="width: 165px;">
                            <el-option
                                v-for="(item, index) in statusList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="width: 86px" icon="el-icon-search" @click="fetchList('search')">搜索</el-button>
                        <el-button type="default" style="width: 86px; margin-left: 10px" icon="el-icon-delete" @click="onClear">清空</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="content">
            <div class="operation-content">
               
               
                <!-- <el-button size="small" @click.stop="exportOrder" v-loading.fullscreen.lock="fullscreenLoading">导出列表</el-button> -->
                <template>
                    <span class="effect-time">生效时间: {{curConfig.updateTime}}</span>
                    <div class="current-setting" v-if="curConfig.shopId">
                        <!-- <span class="tag">触发条件</span> -->
                        <div class="detail">
                            <el-popover
                                popper-class="refund-setting-popper"
                                placement="bottom"
                                width="500"
                                trigger="hover">
                                <el-form :model="currentConfForm" label-width="120px" size="small">
                                    <el-form-item label="生效店铺："><span>{{curConfig.shopName}}</span></el-form-item>
                                    <el-form-item label="订单创建时间："><span>{{curConfig.orderTimeStart}} ~ {{curConfig.orderTimeEnd}}</span></el-form-item>
                                    <el-form-item label="售后类型："><span>{{curConfig.refundTypeText}}</span></el-form-item>
                                </el-form>
                                <i class="el-icon-warning" slot="reference"  style="color:#2F51FF; font-size: 18px; cursor: pointer; margin-left: 6px"></i>
                                <!-- <el-button size="small" slot="reference" icon="el-icon-warning" circle > </el-button> -->
                            </el-popover>
                        </div>
                    </div>
                </template>

                <el-button  style="margin-left: auto;" size="small" @click="onCloseAuto" :loading="autoLoading" v-if="curConfig.autoSwitch == 1">关闭自动售后</el-button>
                <el-button  size="small" @click="onOpenAuto" :loading="autoLoading" v-else>开启自动售后</el-button>
                <el-button type="primary" size="small" @click="onAutoSetting">自动设置</el-button>
            </div>
            <div class="refund-config-table" v-loading="tableloading">
                <el-table
                    :data="tableData"
                    ref="configTable"
                    :default-expand-all="true"
                    size="medium"
                    @header-dragend="setWidth"
                    @selection-change="handleSelectionChange"
                    :header-cell-style="{ background: '#f6f8fc' }"
                    row-key="id"
                    style="width: 100%"
                >
                    <!-- <el-table-column
                        align="center"
                        fixed="left"
                        type="selection"
                        width="45"
                        :reserve-selection="true"
                    ></el-table-column> -->
                    <el-table-column
                        width="20">
                    </el-table-column>
                    <el-table-column width="150" label="店铺名称" prop="shopName"></el-table-column>
                    <el-table-column width="200" label="主订单编号">
                        <template slot-scope="{row}">
                            <div>{{row.orderId}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column width="200" label="售后编号">
                        <template slot-scope="{row}">
                            <div>{{row.aftersaleId}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="300" label="流程">
                        <template slot-scope="{row}">
                            <div class="process-cell">

                                <!-- 开始 -->
                                <div :class="row.operationInfo > 0 ? 'processed' : ''" v-if="row.operationInfo >= 0">
                                    <i class="el-icon-circle-check" v-if="row.operationInfo > 0"></i>
                                    接收申请
                                </div>

                                <!-- 过程 -->
                                <div :class="row.operationInfo > 2 ? 'processed' : ''" v-if="row.operationInfo >= 1">
                                    <span class="symbol">•••</span>
                                    <i class="el-icon-circle-check" v-if="row.operationInfo > 2"></i>
                                    待商家处理
                                </div>
                                <div :class="row.operationInfo > 4 ? 'processed' : ''" v-if="row.operationInfo > 2 && row.aftersaleType == 0">
                                    <span class="symbol">•••</span>
                                    <i class="el-icon-circle-check" v-if="row.operationInfo > 4"></i>
                                    <span v-if="row.operationInfo == 3">待买家退货</span>
                                    <span v-if="row.operationInfo >= 4">待商家收货</span>
                                </div>

                                <!-- 结果 -->
                                <div v-if="row.orderProcessingStatus == 2"><span class="symbol">•••</span>处理完成</div>
                                <div v-if="row.orderProcessingStatus == 3 || row.orderProcessingStatus == 4"><span class="symbol">•••</span>处理失败</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="150" label="售后类型">
                        <template slot-scope="{row}">
                            <div>{{row.aftersaleTypeText ? row.aftersaleTypeText : ''}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column width="150" label="处理状态">
                        <template slot-scope="{row}">
                            {{row.orderProcessingStatus == 3 || row.orderProcessingStatus == 4 ? row.reasonProcessingFailure : orderProcessingStatusOpt[row.orderProcessingStatus]}}
                        </template>
                    </el-table-column>
                    <el-table-column width="150" label="处理时间">
                        <template slot-scope="{row}">
                            {{row.updateTime ? formatTime(row.updateTime * 1000, 'YYYY-MM-DD hh:mm:ss') : ''}}
                        </template>
                        
                    </el-table-column>
                    <el-table-column width="150" fixed="right" label="操作" align="center">
                        <!-- <template slot-scope="{row}">
                            <el-button type="primary" @click="onDispose(row)" v-if="row.aftersaleStatus == 6">处理申请</el-button> 
                        </template>-->
                    </el-table-column>
                    <template slot="empty">
                        <div class="empty">
                            <el-empty
                                description="暂时没有找到任何记录"
                                :image-size="100"
                                v-if="!tableData.length"
                            ></el-empty>
                        </div>
                    </template>
                </el-table>
                
            </div>
            <el-pagination
                v-if="formData.total > 0"
                style="display: flex; justify-content: flex-end;margin-top: 40px;"
                background
                :page-sizes="[10, 30, 50, 100]"
                :current-page="formData.current"
                layout="total, sizes, prev, pager, next,slot"
                :page-size="formData.size"
                @size-change="sizeChange"
                @current-change="currentChange"
                :total="formData.total"
            >
            </el-pagination>
            <Pages
                v-if="false"
                    @scrollChange="scrollChange"
                    @pageChange="fetchList"
                    :tableWidth="tableWidth"
                    :limit.sync="formData.size"
                    :page.sync="formData.current"
                    :total="formData.total"
                    :width="headerWidth">
                    <!-- <span style="margin-left: 20px" v-if="multipleSelection.length">已选中{{multipleSelection.length}}条</span> -->
                </Pages>
        </div>
        </div>
        
        <dialog-sales ref="dialogSales" @success="onLoadConfig"/>
    </div>
</template>

<script>

import Pages from '@/components/page/page'
import stacky from '@/mixins/table-sticky'
import { fetchList, loadConfig, setConfig } from '@/api/refund/config'
import TimeFormats from '@/util/TimeFormats'
import DialogSales from './modules/DialogSales'
import DialogAgree from '../order/modules/DialogAgree.vue'
export default {
    components: {
        Pages,
        DialogSales,
        DialogAgree
    },
    mixins: [stacky],
    watch: {
        'formData.size': {
            handler (val, oldVal) {
                this.formData.current = 1
                this.fetchList()
            }
        }
    },
    data() {
        return {
            tableData: [],
            tableloading: false,
            multipleSelection: [],
            orderProcessingStatusOpt: {
                1: '处理中',
                2: '成功',
                3: '失败',
                4: '订单需要人工处理'
            },
            shopList: [],
            headerWidth: 0,
            parent: 'refund-config-table',
            orderType: 1,
            orderTypeList: [{label: '销售订单售后', value: 1}, {label: '采购订单售后', value: 2}],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 90
                }
            },
            statusList: [
                {label: '处理中', value: 1},
                {label: '处理成功', value: 2},
                {label: '处理失败', value: 3},
                {label: '订单需要人工处理', value: 4},
            ],
            formData: {
                current: 1,
                size: 10,
                total: 0
            },
            fullscreenLoading: false,
            autoLoading: false,
            currentConfForm: {},
            curConfig: {},
            refundType: [{label: '未发货仅退款（已代发）', value: 2}, {label: '已发货仅退款（已代发）', value: 1}, {label: '退货退款（已代发）', value: 0}]
        }
    },
    computed: {},
    methods: {
        sizeChange(val) {
            this.page.currentPage = 1
            this.page.pageSize = val
            this.getPage(this.page)
        },
        currentChange(val) {
            this.page.currentPage = val
            this.getPage(this.page)
        },
        async getShopList () {
            // 查询店铺列表
            const { data: { data } } = await this.$API.getShopList()
            this.shopList = data || []
        },
        async onLoadConfig () {
            // 查询自动售后设置
            const { data } = await loadConfig()
            if (data.data) {
                this.curConfig = {
                    ...data.data,
                    shopName: data.data.shops.map(item => item.shopName).join(','),
                    refundTypeText: this.refundType.filter(item => {
                        return data.data.aftersaleType.indexOf(item.value) > -1
                    }).map(item => item.label).join(' &'),
                    orderTimeStart: this.formatTime(data.data.orderTimeStart * 1000, 'YYYY-MM-DD hh:mm:ss'),
                    orderTimeEnd: this.formatTime(data.data.orderTimeEnd * 1000, 'YYYY-MM-DD hh:mm:ss')
                }
            }
            console.log('config', data)
        },
        // 开启自动售后
        async onOpenAuto () {
            if (!this.curConfig.id) {
                this.$confirm('请先设置自动售后触发条件!', '提示', {
                    confirmButtonText: '知道了',
                    type: 'warning'
                }).then(() => {
                    this.$refs.dialogSales.showEdit({})
                })
                return
            }
            this.autoLoading = true
            const params = {
                ...this.curConfig,
                autoSwitch: 1
            }
            const { data } = await setConfig(params)
            this.autoLoading = false
            if (data.code == 0) {
                this.$message.success('设置成功')
                this.onLoadConfig()
            }
        },
        // 关闭自动售后
        async onCloseAuto () {
            const params = {
                ...this.curConfig,
                autoSwitch: 0
            }
            this.autoLoading = true
            const { data } = await setConfig(params)
            this.autoLoading = false
            if (data.code == 0) {
                this.$message.success('设置成功')
                this.onLoadConfig()
            }
        },
        // 自动设置
        onAutoSetting () {
            this.$refs.dialogSales.showEdit(this.curConfig)
        },
        // 获取列表
        async fetchList () {
            this.tableloading = true
            const params = {...this.formData}
            try {
                params['orderCreateTimeStart'] = new TimeFormats().timestamp(`${this.formData.createTimeArr[0]} 00:00:00`)
                params['orderCreateTimeEnd'] = new TimeFormats().timestamp(`${this.formData.createTimeArr[1]} 23:59:59`)
            } catch (err) {
                console.log('error', err)
            }
            const { data: { data } } = await fetchList(params)
            this.tableloading = false
            this.tableData = data.records
            this.formData = {
                ...this.formData,
                current: data.current || 1,
                size: data.size || 0,
                total: data.total || 0
            }
            console.log('data', data)
        },
        scrollChange(x) {
            this.$refs.configTable.bodyWrapper.scrollLeft = x
        },
        setWidth() {
            this.headerDragend()
        },
        // 选中表格列表项
        handleSelectionChange (val) {
            this.multipleSelection = val
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
        onClear () {
            this.formData = {
                size: this.formData.size,
                current: 1
            }
            this.fetchList()
        },
        // 格式化时间戳
        formatTime(value, format = 'YYYY-MM-DD') {
            if (typeof (value) === 'string') value = +value;
            return value ? new TimeFormats().convertTime(format, value) : '-';
        },
        initData () {
            const start = this.formatTime(new Date().getTime() - 86400000)
            const end = this.formatTime(new Date().getTime())
            this.formData.createTimeArr = [start, end]
            this.fetchList()
            this.getShopList()
            this.onLoadConfig()
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.initData()
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>
<style lang="scss" scoped>

.refund-config {
    padding-bottom: 30px;
    .config-content {
        .alert {
            width: 100%;
            height: 32px;
            margin-top: 16px;
            background: #EDF0FF;
            border-radius: 4px 4px 4px 4px;
            border: 1px solid  $themeColor;
            display: flex;
            align-items: center;
            i {
                font-size: 16px;
                color: $themeColor;
                transform: rotate(180deg);
                margin-left: 16px;
                margin-right: 12px;
            }
            span {
                font-size: 14px;
                color: rgba(0,0,0,0.85);
            }
        }
        .config-header {
            background: #fff;
            border-radius: 12px;
            padding: 18px 0px 0px 0px;
            margin-top: 16px;
            .title {
                font-size: 20px;
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
        .content {
            margin-top: 16px;
            background: #FFFFFF;
            border-radius: 12px 12px 12px 12px;
            padding: 16px 16px 50px;
        }
        .operation-content {
            display: flex;
            // justify-content: flex-end;
            align-items: center;
            .effect-time {
                width: 227px;
                height: 32px;
                background: #EDF0FF;
                border-radius: 8px 8px 8px 8px;
                opacity: 1;
                border: 1px solid #BCC7FF;
                font-size: 14px;
                color: #000000;
                line-height: 32px;
                text-align: center;
                margin-left: 10px;
            }
            .current-setting {
                display: inline-block;
                .tag {
                    background-color: #fba82d;
                    color: #fff;
                    padding: 1px 5px;
                    margin-right: 10px;
                }
                .detail {
                    display: inline-block;
                }
                
            }
        }
        .refund-config-table {
            margin-top: 16px;
            ::v-deep .el-table {
                min-height: 480px;
                .el-table__cell .cell {
                    .process-cell {
                        display: flex;
                        align-items: center;
                        .processed {
                            color: #c2c2c2;
                        }
                        .symbol {
                            margin: 0 5px;
                            font-size: 12px;
                            color: #c2c2c2;
                        }
                    }
                }
                .el-table__empty-block {
                    min-height: 400px;
                }
            }
        }
    }
}
</style>

<style lang="scss">
    .refund-setting-popper {
        padding: 30px;
        .el-form .el-form-item {
            margin-bottom: 4px;
        }
    }
</style>