<template>
    <div class='operate-rank-page' ref="operateMain" v-loading="pageLoading">
        <div class="operate-main">
            <div class="px20 rank-form">
                <div class="tips mb20 px10 py20">
                    <div class="mb20 font-w-500">功能说明：</div>
                    <div class="lh22">
                        1、我们做宝贝推广时，需要实时关注商品排名变化以监测推广效果，通常我们只能搜索页一页一页的翻查，查找过程很痛苦。而使用批量查排名，就可以很方便查询该商品在搜索排名情况。（需要加载时为一页）<br />
                        2、即使为实时查询，且尽量排出个性化因素，但亦会出现与本地搜索不一致的情况。<br />
                        3、因搜索排名随时可能变化，本查询只返回当时查询时间的位置。
                    </div>
                    <div class="mt20 mb15">补单秘籍：如果发现宝贝排名靠前，就可以补单了。</div>
                    <div class="lh22">
                        单价：<br />
                        ① 非会员、个人版会员：<span class="color-red">50</span> 积分/关键词<br />
                        ② 旗舰版会员：<span class="color-red">40</span> 积分/关键词<br />
                        ③ 团队版会员：<span class="color-red">30</span> 积分/关键词<br />
                        ④ 企业版会员：<span class="color-red">20</span> 积分/关键词
                    </div>
                </div>
                <el-form :model="searchForm" label-position="right" label-width="80px">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="商品链接">
                                <el-input
                                    type="textarea"
                                    style="width: 100%;"
                                    :rows="3"
                                    placeholder="请填写商品链接"
                                    v-model="searchForm.link"
                                    resize="none"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" class="mb20">
                            <el-form-item label="关键词">
                                <el-input
                                    type="textarea"
                                    style="width: 100%;"
                                    :rows="3"
                                    placeholder="支持单个或多个关键词，以“，”隔开，最多支持同时查询100个关键词"
                                    v-model="goodsData"
                                    resize="none"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" style="text-align: center;">
                            <el-button type="primary" size="medium" style="width: 100px; height: 50px; margin-top: 10px;" @click="onGenerate">提 交</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="pt20 px20 mb20">
                <el-form inline :model="searchForm" ref="form" class="ddk-form">
                    <el-form-item label="状态：" prop="status" style="margin-right: 20px;">
                        <el-select
                            @change="initGetList"
                            v-model="searchForm.status"
                            placeholder="请选择状态"
                            style="width: 160px"
                            clearable
                        >
                            <el-option label="全部" :value="null"></el-option>
                            <el-option label="已完成" :value="2"></el-option>
                            <el-option label="查询中" :value="1"></el-option>
                            <el-option label="未开始" :value="0"></el-option>
                            <el-option label="失败" :value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click.stop="initGetList">
                            <span>查询</span>
                        </el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    :data="rankData"
                    border
                    height="515px"
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
                        prop="date"
                        label="商品图片"
                        align="center"
                        min-width="100">
                        <template slot-scope="{row}">
                            <el-image 
                                fit="cover"
                                style="width: 50px; height: 50px; border-radius: 5px;"
                                :src="row.img"
                                :preview-src-list="[row.img]">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="productTitle"
                        label="商品标题"
                        align="center"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        prop="keyword"
                        label="关键词"
                        align="center"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        prop="position"
                        min-width="100"
                        align="center"
                        label="排名位置">
                        <template slot-scope="{row}">
                            <div v-if="row.status == 2">
                                <span v-if="row.position > 0">第{{row.position}}名</span>
                                <!-- <span v-else-if="row.position < 0">不在前{{-row.position}}名内</span> -->
                                <span v-else-if="row.position < 0">100名以外</span>
                                <span v-else>商品不在结果内</span>
                            </div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="created"
                        min-width="150"
                        align="center"
                        label="提交时间">
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        min-width="100"
                        align="center"
                        label="状态">
                        <template slot-scope="{row}">
                            <el-tag size="small" type="error" v-if="row.status == 3">失败</el-tag>
                            <el-tag size="small" type="success" v-else-if="row.status == 2">已完成</el-tag>
                            <el-tag size="small" type="warning" v-else-if="row.status == 1">查询中</el-tag>
                            <el-tag size="small" type="info" v-else>未开始</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="amount"
                        min-width="100"
                        align="center"
                        label="消耗积分">
                        <template slot-scope="{row}">
                            <span>{{row.amount - row.refundAmount}}</span>
                        </template>
                    </el-table-column>
                    <template slot="empty">
                        <div class="empty">
                            <el-empty
                                description="暂时没有找到任何订单信息"
                                style="height: 473px"
                                :image-size="100"
                                v-if="!rankData.length && !tableLoading"
                            ></el-empty>
                        </div>
                    </template>
                </el-table>
            </div>
            <div class="pagination pb20 flex flex-row-reverse" v-if="searchForm.total > 0">
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
import { createRankSearch, getRankList, getPointAmount } from '@/api/dfh/operate'
import { mapState } from 'vuex'
export default {
    components: {
    },
    data() {
        return {
            rankData: [],
            searchForm: {
                size: 50,
                current: 1,
                total: 0,
                status: null
            },
            goodsData: '',
            tableLoading: false,
            pageLoading: false
        }
    },
    watch: {
    },
    computed: {
        ...mapState({
            my: state => state.user.my
        }),
        // 是否开通会员
        vipRight () {
            try {
                return this.my.memberRight.code
            } catch (error) {
                return 'default'
            }
        },
    },
    methods: {
        initGetList () {
            this.searchForm.current = 1
            this.onLoadList()
        },
        // 查询排名
        async onGenerate () {
            let keys = ''
            if (!this.goodsData || !this.searchForm.link) {
                this.$message.warning('请先填写商品链接和关键词！')
                return false
            }
            keys = this.goodsData.replace(/\r/g, "").replace(/\n/g, ",").replace(/，/g, ",").replace(/\s*/g, "")
            const keysList = keys.split(',').filter(item => item)
            console.log('keysList', keysList)
            const { data } = await getPointAmount({count: keysList.length})
            console.log('point', data)
            const pointTotal = data.data
            this.$confirm(`本次共查询${keysList.length}个关键词，预估扣除${pointTotal}积分，是否确认提交？`, '温馨提示', {
                confirmButtonText: '提交',
                closeOnClickModal: false,
                type: 'warning'
            }).then(async () => {
                this.pageLoading = true
                const params = {
                    productUrl: this.searchForm.link,
                    keywords: keys
                }
                console.log('params', params)
                try {
                    const { data } = await createRankSearch(params)
                    console.log('data', data)
                    this.pageLoading = false
                    if (data.code == 0) {
                        this.$message.success('提交成功，稍后刷新列表查看!')
                        this.goodsData = ''
                        this.searchForm.link = ''
                        this.onLoadList()
                        // 更新积分
                        this.$bus.$emit('point-dialog')
                    } else {
                        this.$message.warning(data.msg)
                    }
                } catch (err) {
                    this.pageLoading = false
                    console.log('err', err)
                }
            })
        },
        async onLoadList () {
            this.tableLoading = true
            const { data } = await getRankList(this.searchForm)
            this.tableLoading = false
            this.rankData = data.data.records
            this.searchForm.total = data.data.total
            console.log('data', data)
        },
        /**
         * current 改变时会触发
         */
        onCurrentChange(page) {
            this.searchForm.current = page
            this.onLoadList()
        },
        /**
         * pageSize 改变时会触发
         */
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
        if (this.vipRight == 'regular' || this.vipRight == 'default' || this.vipRight == 'introduction') {
            // 会员如果是个人版或者没开通会员则禁用
            // this.$refs.dialogUp.showModel()
        }
    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>

<style lang="scss" scoped>
.operate-rank-page {
    height: 100%;
    overflow-y: auto;
    padding: 8px 10px;
    position: relative;
    .operate-main {
        min-height: 100%;
        border-radius: 5px;
        background-color: #fff;
        padding: 20px 0;
        .tips {
            background-color: #f6f6f6;
            border-radius: 5px;
        }
        .tip-title {
            color: #333;
            font-weight: 500;
        }
        ::v-deep.el-image__error {
            font-size: 12px;
        }
        .rank-form {
            border-bottom: 10px solid #f0f2f5;
        }
        .operate-first {
            .code-item {
                display: flex;
                align-items: center;
                border-bottom: 1px solid #DCDFE6;
                border-left: 1px solid #DCDFE6;
                border-right: 1px solid #DCDFE6;
                .title {
                    flex: 1;
                    padding-right: 20px;
                }
            }
            .first-left-content {
                border: 1px solid #DCDFE6;
            }
            ::v-deep.el-textarea__inner {
                border-radius: 0;
            }
            .use-tips-content {
                background-color: #f9f9f9;
                border-left: 1px solid #DCDFE6;
                border-right: 1px solid #DCDFE6;
                border-bottom: 1px solid #DCDFE6;
                .borderl {
                    border-left: 1px solid #DCDFE6;
                }
                .borderr {
                    border-right: 1px solid #DCDFE6;
                }
                .use-tip {
                    color: rgb(70, 180, 109);
                    font-weight: 500;
                }
            }
        }
    }
}
.operate-rank-page.disable {
    overflow: hidden;
}
</style>