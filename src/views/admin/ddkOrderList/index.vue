<template>
    <div class='ddk-order'>
        <basic-container>
            <div class="header mb20">
                <div class="mb5">
                    <el-alert title="明细只支持站点相关的店铺订单明细和分佣" type="warning" show-icon :closable="false"></el-alert>
                </div>
                <div class="search-content">
                    <div class="commission pt10 pb20 text-right">
                        预估总佣金：<span class="mr15">{{orderCount.totalAmount | rounding}}</span>
                        预估已结算佣金：<span class="mr15">{{orderCount.usableAmount | rounding}}</span>
                        已冻结佣金：<span>{{orderCount.frozenAmount | rounding}}</span>
                        <el-tooltip content="已冻结佣金是指平台未审核通过的佣金" placement="bottom-end" effect="dark" class="ml5 mr20">
                            <i class="el-icon-question" style="font-size: 16px; color: #999;"></i>
                        </el-tooltip>
                    </div>
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="收入明细" name="profit"></el-tab-pane>
                    </el-tabs>
                    <el-form inline :model="formData" ref="form" class="ddk-form">
                        <el-form-item label="交易时间" prop="createTimeArr">
                            <el-date-picker
                                v-model="formData.createTimeArr"
                                type="daterange"
                                align="right"
                                unlink-panels
                                @change="initGetList"
                                :picker-options="pickerOptions"
                                range-separator="至"
                                value-format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="订单状态" prop="ddkOrderStatus">
                            <el-select
                                v-model="formData.ddkOrderStatus"
                                placeholder="请选择订单状态"
                                style="width: 160px"
                                clearable
                            >
                                <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订单号" prop="pddOrderId">
                            <el-input type="text" placeholder="请输入采购订单编号" v-model="formData.pddOrderId"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click.stop="initGetList">
                                <span>搜索</span>
                            </el-button>
                            <el-button @click.stop="onExport" v-loading.fullscreen.lock="fullscreenLoading" v-if="permissions.site_ddk_order_list_view">
                                <span>导出</span>
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="content" v-loading="tableLoading">
                  <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        prop="shopName"
                        label="店铺名称"
                        min-width="120"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="pddOrderId"
                        label="订单编号"
                        min-width="150"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        label="订单金额（元）"
                        align="center">
                        <template slot-scope="{row}">
                            {{row.pddMoney ? row.pddMoney / 100 : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="订单状态"
                        align="center">
                        <template slot-scope="{row}">
                            {{statusText[row.ddkOrderStatus]}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="预估佣金收入"
                        align="center">
                        <template slot-scope="{row}">
                            {{row.ddkPromotionAmount ? row.ddkPromotionAmount / 100 : '-'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="pddOrderTime"
                        label="交易时间"
                        min-width="150"
                        align="center">
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
            <div class="pagination pt10 pb20 flex flex-row-reverse" v-if="formData.total > 0">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :current-page.sync="formData.current"
                    :page-size="formData.size"
                    :page-sizes="[30, 50, 100]"
                    :total="formData.total"
                    @current-change="onCurrentChange"
                    @size-change="onSizeChange"
                ></el-pagination>
            </div>
        </basic-container>
    </div>
</template>

<script>
import { fetchList, fetchCountList, fetchExportList } from '@/api/admin/ddkOrder'
import { mapGetters } from 'vuex'
export default {
    components: {},
    filters: {
        rounding (val) {
            if (val == 0 || !val) {
                return 0
            }
            return val / 100
        }
    },
    data() {
        return {
            activeName: 'profit',
            fullscreenLoading: false,
            tableLoading: false,
            tableData: [],
            formData: {
                total: 0,
                current: 1,
                size: 30,
                createTimeArr: null
            },
            orderCount: {},
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
            },
            statusList: [
                {label: '已支付', value: 0},
                {label: '已成团', value: 1},
                {label: '确认收货', value: 2},
                {label: '审核成功', value: 3},
                {label: '审核失败', value: 4},
                {label: '已经结算', value: 5},
                {label: '已处罚', value: 10}
            ],
            statusText: {
                '0': '已支付',
                '1': '已成团',
                '2': '确认收货',
                '3': '审核成功',
                '4': '审核失败',
                '5': '已经结算',
                '10': '已处罚',
            }
        }
    },
    computed: {
        ...mapGetters(['permissions']),
    },
    methods: {
        onCurrentChange(page) {
            this.formData.current = page
            this.getList()
        },
        onSizeChange(size) {
            this.formData.size = size
            this.getList()
        },
        initGetList() {
            this.formData.current = 1
            this.getList()
            this.getCountList()
        },
        async getList () {
            this.tableLoading = true
            const params = {...this.formData}
            if (params.createTimeArr) {
                params['startTime'] = `${params.createTimeArr[0]} 00:00:00`
                params['endTime'] = `${params.createTimeArr[1]} 23:59:59`
            }
            const { data } = await fetchList(params)
            this.tableLoading = false
            console.log('getList', data)
            this.tableData = data.data.records || []
            this.formData.total = data.data.total
        },
        onExport () {
            this.fullscreenLoading = true
            const params = {...this.formData}
            if (params.createTimeArr) {
                params['startTime'] = `${params.createTimeArr[0]} 00:00:00`
                params['endTime'] = `${params.createTimeArr[1]} 23:59:59`
            }
            fetchExportList(params).then(res => {
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
        },
        async getCountList () {
            const { data } = await fetchCountList(this.formData)
            console.log('getCountList', data)
            this.orderCount = data.data
        }

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        const start = this.$moment().subtract(6, 'day').format('YYYY-MM-DD')
        const end = this.$moment().format('YYYY-MM-DD')
        this.formData.createTimeArr = [start, end]
        this.getList()
        this.getCountList()
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>
<style lang="scss" scoped>
    .ddk-order {
        .search-content {
            position: relative;
            .commission {
                span {
                    color: red;
                }
            }
            .ddk-form {
                position: absolute;
                right: 0;
                bottom: 10px;
                ::v-deep.el-range-separator {
                    width: 10%;
                }
            }
        }
        .content {
            ::v-deep.el-table {
                min-height: 500px;
            }
        }
    }
</style>