<template>
    <div class="mod-config">
        <basic-container>
            <el-form inline :model="formData" size="mini">
                <el-form-item label="卡密类型">
                    <el-select v-model="formData.cdkeyType" placeholder="请选择卡密类型" clearable style="width: 160px;">
                        <el-option
                            v-for="(item, index) in typeList"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="卡密状态">
                    <el-select v-model="formData.cdkeyStatus" placeholder="请选择卡密状态" clearable style="width: 160px;">
                        <el-option
                            v-for="(item, index) in statusList"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="getDataList()">
                    <span>查询</span>
                </el-button>
                <el-button
                    v-if="permissions.generator_syscdkey_add"
                    type="success"
                    @click="addOrUpdateHandle()"
                >
                    <span>购买卡密</span>
                </el-button>
            </el-form>

            <div class="mt20">
                <el-table :data="dataList" border v-loading="dataListLoading">
                    <el-table-column prop="id" header-align="center" align="center" label="ID"></el-table-column>
                    <el-table-column prop="cdkey" header-align="center" align="center" label="卡密"></el-table-column>
                    <el-table-column
                        prop="cdkeyType"
                        header-align="center"
                        align="center"
                        label="卡密类型"
                    >
                        <template slot-scope="{ row }">
                            <span>{{ row.cdkeyType | formatType }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="cdkeyStatus"
                        header-align="center"
                        align="center"
                        label="卡密状态"
                    >
                        <template slot-scope="{ row }">
                            <span>{{ row.cdkeyStatus | formatStatus }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="consumeSiteBalance"
                        header-align="center"
                        align="center"
                        label="消耗站点余额"
                    ></el-table-column>
                    <el-table-column
                        prop="createTime"
                        header-align="center"
                        align="center"
                        label="卡密生成时间"
                    ></el-table-column>
                </el-table>
            </div>

            <div class="avue-crud__pagination">
                <el-pagination
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                    :current-page="pageIndex"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    :total="totalPage"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                ></el-pagination>
            </div>
            <table-form
                :visible="addOrUpdateVisible"
                @success="getDataList"
                @close="addOrUpdateVisible = false"
            ></table-form>
        </basic-container>
    </div>
</template>

<script>
import { fetchList } from '@/api/syscdkey'
import TableForm from './syscdkey-form'
import { mapGetters } from 'vuex'
export default {
    filters: {
        // 卡密类型
        formatType(key) {
            switch (key) {
                case 'UITIMATE_YEAR': return '旗舰版一年';
                case 'TEAM_YEAR': return '团队版一年';
                case 'ENTERPRISE_YEAR': return '企业版一年';
                case 'REGULAR_MONTH': return '个人版一个月';
                case 'REGULAR_QUARTER': return '个人版一季度';
                case 'REGULAR_HALF_YEAR': return '个人版半年';
                default:
                    break;
            }
        },
        // 卡密状态
        formatStatus(key) {
            switch (key) {
                case 0: return '正常';
                case 1: return '已使用';
                case 2: return '禁用';
                default:
                    break;
            }
        },
    },
    data() {
        return {
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            addOrUpdateVisible: false,
            formData: {},
            typeList: [
                {label: '旗舰版一年', value: 'UITIMATE_YEAR'},
                {label: '团队版一年', value: 'TEAM_YEAR'},
                {label: '企业版一年', value: 'ENTERPRISE_YEAR'},
                {label: '个人版一个月', value: 'REGULAR_MONTH'},
                {label: '个人版一季度', value: 'REGULAR_QUARTER'},
                {label: '个人版半年', value: 'REGULAR_HALF_YEAR'}
            ],
            statusList: [
                {label: '正常', value: 0},
                {label: '已使用', value: 1},
                {label: '禁用', value: 2},
            ]
        }
    },
    components: {
        TableForm
    },
    created() {
        this.getDataList()
    },
    computed: {
        ...mapGetters(['permissions'])
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true
            const params = {
                ...this.formData,
                current: this.pageIndex,
                size: this.pageSize
            }
            fetchList(params).then(response => {
                this.dataList = response.data.data.records
                this.totalPage = response.data.data.total
            })
            this.dataListLoading = false
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val
            this.pageIndex = 1
            this.getDataList()
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val
            this.getDataList()
        },
        //
        /**
         * 购买卡密
         */
        addOrUpdateHandle(id) {
            this.addOrUpdateVisible = true
            this.getDataList()
            // this.$nextTick(() => {
            //     this.$refs.addOrUpdate.init(id)
            // })
        },
    }
}
</script>
