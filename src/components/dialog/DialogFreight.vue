<template>
    <div class='dialog-freight'>
        <el-dialog
            title="运费物流模版（仅供参考）"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            top="5vh"
            width="800px">
            <div class="freight-table">
                <el-table
                    :data="tableData"
                    :span-method="objectSpanMethod"
                    height="50vh"
                    v-loading="loading"
                    border
                    style="width: 100%; margin-top: 20px">
                    <el-table-column
                        label="发货地"
                        width="150">
                        <template>
                            <span>{{freightData.sendGoodsAddressText || ''}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="toAreaCodeText"
                        label="运送到">
                        <template slot-scope="{row}">
                            <span>{{row.toAreaCodeText || '其他地区'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="firstUnit"
                        width="100"
                        :label="`首${chargeType == 0 ? '重' : '件'}（${chargeType == 0 ? '克' : '件'}）`">
                        <template slot-scope="{row}">
                            <span>{{row.rateDTO[0].firstUnit}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="firstUnitFee"
                        width="100"
                        label="运费（元）">
                        <template slot-scope="{row}">
                            <span>{{(row.rateDTO[0].firstUnitFee / 100).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="nextUnit"
                        width="100"
                        :label="`续${chargeType == 0 ? '重' : '件'}（${chargeType == 0 ? '克' : '件'}）`">
                        <template slot-scope="{row}">
                            <span>{{row.rateDTO[0].nextUnit}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="nextUnitFee"
                        width="100"
                        label="运费（元）">
                        <template slot-scope="{row}">
                            <span>{{(row.rateDTO[0].nextUnitFee / 100).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">知道了</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { get1688ProductDetail } from '@/api/dfh/product'
export default {
    components: {},
    data() {
        return {
            dialogVisible: false,
            freightData: {},
            loading: false,
            freightDefaultTemp: {
                isSysRate: false,
                rateDTO: [{firstUnit: "1", firstUnitFee: "0", nextUnit: "1", nextUnitFee: "0"}],
                toAreaCodeText: '全部地区'
            }
        }
    },
    computed: {
        tableData () {
            try {
                return  this.freightData.rateList || []
                // if (this.freightData.serviceChargeType == 0) {
                //     // 包邮情况自己造一条数据
                //     return [this.freightDefaultTemp]
                // } else {
                // }
            } catch (err) {
                return []
            }
        },
        // 计件类型 0 => 重量，1 => 件数
        chargeType () {
            return this.freightData.chargeType || 0
        }
    },
    methods: {
        showModel (id) {
            this.dialogVisible = true
            this.loadList(id)
        },
        async loadList (id) {
            this.loading = true
            try {
                const { data } = await get1688ProductDetail({offerId: id})
                console.log('data', data)
                this.freightData = data.data
                this.loading = false
            } catch (err) {
                this.loading = false
            }
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (rowIndex === 0) {
                    return {
                        rowspan: 6,
                        colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>
<style lang="scss" scoped>
.dialog-freight {
    ::v-deep.el-dialog {
        .el-dialog__body {
            padding: 10px 20px;
        }
    }
}
</style>