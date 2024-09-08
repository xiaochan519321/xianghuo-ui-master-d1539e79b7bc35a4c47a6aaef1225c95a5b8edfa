<template>
    <div class='compass-detail-page'>
        <div class="pt20 px20 mb20">
            <div class="mb20 keyword-tag">查询关键词【<span>{{keyword}}</span>】的结果如下</div>
            <el-form inline :model="searchForm" ref="form" class="ddk-form">
                <!-- <el-form-item label="最近5天连续评价：" prop="continueCommentFlag" style="margin-right: 20px;">
                    <el-select
                        @change="initGetList"
                        v-model="searchForm.continueCommentFlag"
                        placeholder="请选择是否有连续评价"
                        style="width: 160px"
                        clearable
                    >
                        <el-option label="全部" :value="null"></el-option>
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="销量：" prop="salesCountStart">
                    <el-input-number
                        :min="0"
                        :controls="false"
                        step-strictly
                        type="number"
                        placeholder="请填写销量"
                        v-model.number="searchForm.salesCountStart"
                        style="width: 140px;"
                        clearable
                    ></el-input-number>
                    <span class="font20" style="vertical-align: middle;"> - </span>
                    <el-input-number
                        :min="null"
                        :controls="false"
                        step-strictly
                        type="number"
                        placeholder="请填写销量"
                        v-model.number="searchForm.salesCountEnd"
                        style="width: 140px;"
                        clearable
                    ></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="margin-left: 15px;" @click.stop="initGetList">
                        <span>查询</span>
                    </el-button>
                    <el-button style="margin-left: 15px;" @click.stop="resetForm('form')">
                        <span>清空</span>
                    </el-button>
                </el-form-item>
                <el-form-item style="float: right;">
                    <el-button @click.stop="$router.go(-1)">
                        <span>返回</span>
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table
                :data="tableData"
                border
                height="68vh"
                v-loading="tableLoading"
                style="width: 100%"
                @sort-change="sortChange">
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="productTitle"
                    min-width="150"
                    align="center"
                    label="商品标题">
                    <template slot-scope="{row}">
                        <div class="product-url theme-color" @click="onProductLink(row.productUrl)">{{row.productTitle}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="date"
                    label="商品图片"
                    align="center"
                    min-width="100">
                    <template slot-scope="{row}">
                        <el-image 
                            fit="cover"
                            style="width: 50px; height: 50px; border-radius: 5px;"
                            :src="row.productImg"
                            :preview-src-list="[row.productImg]">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="productPrice"
                    label="价格"
                    align="center"
                    min-width="100">
                </el-table-column>
                <el-table-column
                    prop="salesCount"
                    min-width="100"
                    align="center"
                    sortable="custom"
                    label="销量">
                </el-table-column>
                <el-table-column
                    prop="commentCount"
                    min-width="100"
                    align="center"
                    label="评论数">
                </el-table-column>
                <el-table-column
                    prop="goodRatio"
                    min-width="100"
                    align="center"
                    sortable="custom"
                    label="好评率">
                    <template slot-scope="{row}">
                        <span>{{row.goodRatio}}%</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    prop="continueCommentFlag"
                    width="150"
                    align="center"
                    label="最近连续5天内有评价">
                    <template slot-scope="{row}">
                        <span>{{(row.continueCommentFlag == 1 ? '是' : '否')}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column
                    prop="shopName"
                    min-width="150"
                    align="center"
                    label="店铺名">
                </el-table-column>
                <template slot="empty">
                    <div class="empty">
                        <el-empty
                            description="暂时没有找到任何记录信息"
                            style="height: 515px"
                            :image-size="100"
                            v-if="!tableData.length && !tableLoading"
                        ></el-empty>
                    </div>
                </template>
            </el-table>
        </div>
        <div class="pagination pb20 flex flex-row-reverse" v-if="searchForm.total > 0">
            <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :current-page.sync="searchForm.pageNum"
                :page-size="searchForm.pageSize"
                :page-sizes="[20, 50, 100]"
                :total="searchForm.total"
                @current-change="onCurrentChange"
                @size-change="onSizeChange"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { getSearchDetailList } from '@/api/dfh/operate'

export default {
    components: {},
    data() {
        return {
            tableData: [],
            searchForm: {
                pageSize: 20,
                pageNum: 1,
                total: 0,
                continueCommentFlag: null,
                salesCountStart: undefined,
                salesCountEnd: undefined
            },
            orderBy: {
                asc: null,
                column: ""
            },
            searchSelectionId: '',
            tableLoading: false,
            pageLoading: false,
            keyword: ''
        }
    },
    computed: {},
    methods: {
        // 查看商品详情
        onProductLink (href) {
            if (window.electron) {
            // 发送到electron进行跳转
                window.electron.send({key: 'chromeUrl', url: `${href}&origin_type=604`})
            } else {
                window.open(`${href}&origin_type=604`)
            }
        },
        // 自定义排序
        sortChange (column) {
            this.orderBy = {
                column: column.prop,
                asc: column.order ? (column.order == 'ascending' ? true : false) : null
            }
            this.initGetList()
        },
        initGetList () {
            this.searchForm.pageNum = 1
            this.onLoadList()
        },
        // 清空查询项目
        resetForm (formName) {
            this.searchForm.salesCountEnd = null
            this.$refs[formName].resetFields()
            console.log('searchForm', this.searchForm)
            this.initGetList()
        },
        async onLoadList () {
            const params = {
                ...this.searchForm,
                searchSelectionId: this.searchSelectionId
            }
            if (this.orderBy.asc != null && this.orderBy.column) {
                params['asc'] = this.orderBy.asc
                params['column'] = this.orderBy.column
            }
            this.tableLoading = true
            const { data } = await getSearchDetailList(params)
            this.tableLoading = false
            this.tableData = data.data.records
            this.searchForm.total = data.data.total
            console.log('data', data)
        },
        /**
         * current 改变时会触发
         */
        onCurrentChange(page) {
            this.searchForm.pageNum = page
            this.onLoadList()
        },
        /**
         * pageSize 改变时会触发
         */
        onSizeChange(size) {
            this.searchForm.pageSize = size
            this.onLoadList();
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        const id = this.$route.query.id
        if (!id) {
            this.$router.go(-1)
        } else {
            this.searchSelectionId = id
            this.keyword = this.$route.query.keyword
            this.onLoadList()
        }
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>
<style lang="scss" scoped>
.compass-detail-page {
    height: 100%;
    background-color: #fff;
    .keyword-tag {
        padding: 10px 15px;
        background-color: #ecf5ff;
        span {
            color: rgb(70, 180, 109);
        }
    }
    ::v-deep .product-url {
        text-decoration: underline;
        cursor: pointer;
    }
    ::v-deep .el-input-number .el-input__inner {
        text-align: left;
    }
}
</style>