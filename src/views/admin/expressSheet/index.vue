<template>
    <div class='express-sheet-page'>
        <div class="page">
            <el-table
                :data="logData"
                height="93%"
                headerCellClassName="header-cell-bg-color"
                v-loading="tableLoading"
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="orderId"
                    min-width="200"
                    align="center"
                    label="抖店订单号">
                </el-table-column>
                <el-table-column
                    prop="incomeType"
                    min-width="100"
                    align="center"
                    label="收入">
                    <template slot-scope="{row}">
                        <span v-if="row.incomeType == 1">充值余额</span>
                        <span v-else-if="row.incomeType == 2">平台赠送</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="expenseType"
                    min-width="100"
                    align="center"
                    label="支出">
                    <template slot-scope="{row}">
                        <span v-if="row.expenseType == 1">下单扣除</span>
                        <span v-else-if="row.expenseType == 2">平台回收</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="afterBalance"
                    min-width="100"
                    align="center"
                    label="剩余余额">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    min-width="150"
                    align="center"
                    label="创建时间">
                </el-table-column>
                <template slot="empty">
                    <div class="empty">
                        <el-empty
                            description="暂时没有找到任何记录信息"
                            style="height: 515px"
                            :image-size="100"
                            v-if="!logData.length && !tableLoading"
                        ></el-empty>
                    </div>
                </template>
            </el-table>
            <div class="pagination pt20 flex flex-row-reverse" v-if="searchForm.total > 0">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :current-page.sync="searchForm.current"
                    :page-size="searchForm.size"
                    :page-sizes="[20, 50, 100]"
                    :total="searchForm.total"
                    @current-change="onCurrentChange"
                    @size-change="onSizeChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { balanceLogs }  from '@/api/admin/log'
export default {
    components: {},
    data() {
        return {
            logData: [],
            tableLoading: false,
            searchForm: {
                size: 20,
                current: 1,
                total: 1
            }
        }
    },
    computed: {},
    methods: {
        async onLoadList () {
            this.tableLoading = true
            const { data } = await balanceLogs(this.searchForm)
            console.log('balanceLogs', data)
            this.tableLoading = false
            this.logData = data.data.records
            this.searchForm.total = data.data.total
        },
        onCurrentChange(page) {
            this.searchForm.current = page
            this.onLoadList()
        },
        onSizeChange(size) {
            this.searchForm.size = size
            this.onLoadList();
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.onLoadList()
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>
<style lang="scss" scoped>
    .express-sheet-page {
        height: 97%;
        .page {
            background-color: #fff;
            border-radius: 8px;
            padding: 16px;
            height: 98%;
        }
    }
</style>