<template>
    <div class='operate-compass-page' ref="operateMain" v-loading="pageLoading">
        <div class="operate-main">
            <div class="px20 rank-form">
                <div class="tips mb20 px10 py10">
                    <div class="mb10 font-w-500">查询条件</div>
                    <div class="lh22">
                        输入关键词查询抖音商城搜索中前20页的商品，最多有400个商品可供查看销量等数据
                    </div>
                </div>
                <el-form :model="generateForm" inline label-position="right" label-width="80px">
                    <el-form-item label="关键词：">
                        <el-input
                            type="input"
                            placeholder="请填写关键词"
                            v-model="generateForm.searchKey"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-button type="primary" style="margin-left: 20px;" @click="onGenerate">提 交</el-button>
                </el-form>
            </div>
            <div class="pt20 px20 mb20">
                <el-form inline :model="searchForm" ref="form" class="ddk-form">
                    <el-form-item label="提交时间 :" prop="createTimeArr">
                        <el-date-picker
                            v-model="searchForm.createTimeArr"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                            style="width: 230px;"
                            size="mini"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
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
                            <el-option label="失败" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键词：" prop="keyword">
                        <el-input
                            type="input"
                            placeholder="请填写关键词"
                            v-model.trim="searchForm.keyword"
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="margin-left: 15px;" @click.stop="initGetList">
                            <span>查询</span>
                        </el-button>
                        <el-button style="margin-left: 15px;" @click.stop="resetForm('form')">
                            <span>清空</span>
                        </el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    :data="rankData"
                    border
                    height="55vh"
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
                        prop="created"
                        min-width="150"
                        align="center"
                        label="提交时间">
                    </el-table-column>
                    <el-table-column
                        prop="keyword"
                        label="关键词"
                        align="center"
                        min-width="150">
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
                    <el-table-column
                        prop="status"
                        min-width="100"
                        align="center"
                        label="状态">
                        <template slot-scope="{row}">
                            <el-tag size="small" type="danger" v-if="row.status == 3">失败</el-tag>
                            <el-tag size="small" type="success" v-else-if="row.status == 2">已完成</el-tag>
                            <el-tag size="small" type="warning" v-else-if="row.status == 1">查询中</el-tag>
                            <el-tag size="small" type="info" v-else>未开始</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="option"
                        width="150"
                        align="center"
                        label="操作">
                        <template slot-scope="{row}">
                            <el-button type="text" size="mini" @click="onView(row)" v-if="row.status == 2">查看</el-button>                        
                        </template>
                    </el-table-column>
                    <template slot="empty">
                        <div class="empty">
                            <el-empty
                                description="暂时没有找到任何记录信息"
                                style="height: 515px"
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
import { getSearchList, createSearchGenerate, getSearchPointAmount } from '@/api/dfh/operate'
import { mapState } from 'vuex'
export default {
    components: {
    },
    data() {
        return {
            rankData: [],
            generateForm: {},
            searchForm: {
                size: 50,
                current: 1,
                total: 0,
                status: null,
                keyword: '',
                createTimeArr: []
            },
            goodsData: '',
            tableLoading: false,
            pageLoading: false,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
            },
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
        // 查询详情
        onView (item) {
            this.$router.push(`/operate/compass/detail?id=${item.id}&keyword=${item.keyword}`)
        },
        initGetList () {
            this.searchForm.current = 1
            this.onLoadList()
        },
        // 清空查询项目
        resetForm (formName) {
            this.$refs[formName].resetFields()
            console.log('searchForm', this.searchForm)
            this.initGetList()
        },
        // 查询排名
        async onGenerate () {
            if (!this.generateForm.searchKey) {
                this.$message.warning('请先输入需要搜索的关键词！')
                return
            }
            const { data } = await getSearchPointAmount({})
            console.log('point', data)
            const pointTotal = data.data
            this.$confirm(`本次搜索需扣除${pointTotal}积分，是否确认提交？`, '温馨提示', {
                confirmButtonText: '提交',
                closeOnClickModal: false,
                type: 'warning'
            }).then(async () => {
                this.pageLoading = true
                const params = {
                    searchKey: this.generateForm.searchKey
                }
                console.log('params', params)
                try {
                    const { data } = await createSearchGenerate(params)
                    console.log('data', data)
                    this.pageLoading = false
                    if (data.code == 0) {
                        this.$message.success('提交成功，稍后刷新列表查看!')
                        this.goodsData = ''
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
            const params = {
                ...this.searchForm
            }
            if (params.createTimeArr && params.createTimeArr.length) {
                params['createdStart'] = `${params.createTimeArr[0]} 00:00:00`
                params['createdEnd'] = `${params.createTimeArr[1]} 23:59:59`
            }
            this.tableLoading = true
            const { data } = await getSearchList(params)
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
.operate-compass-page {
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
        .ddk-form {
            ::v-deep .el-range-separator {
                width: 10%;
            }
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