<template>
    <div class="container">
        <div class="header-wrap">
            <div class="form">
                <el-form ref="form" :model="form" label-width="100px">
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="通知标题：">
                                <el-input v-model="form.title" placeholder="请输入通知标题" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="ml120" :span="3">
                            <el-select v-model="form.publishStatus" placeholder="状态" clearable>
                                <el-option label="未发布" :value="0"></el-option>
                                <el-option label="已发布" :value="1"></el-option>
                            </el-select>
                        </el-col>
                        <el-col class="ml136" :span="3">
                            <el-select v-model="form.noticeType" placeholder="类型" clearable>
                                <el-option label="商品通知" value="1"></el-option>
                                <el-option label="售后通知" value="2"></el-option>
                                <el-option label="订单通知" value="3"></el-option>
                                <el-option label="资金通知" value="4"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="10">
                            <el-form-item label="发布时间：">
                                <el-date-picker
                                    v-model="form.publishTimeArr"
                                    type="datetimerange"
                                    align="right"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions"
                                    :default-time="['00:00:00', '23:59:59']"
                                    clearable
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="options">
                            <!-- <div>
                                <button class="btn" @click="resetData">最近一周</button>
                            </div>
                            <div class="ml12">
                                <button class="btn" @click="resetData">最近一个月</button>
                            </div>-->
                            <div class="ml12">
                                <button class="btn" @click="resetData">重置</button>
                            </div>
                            <div class="ml12">
                                <button class="btn" @click="fetchData">查询</button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <div class="content-wrap">
            <div class="options">
                <div class="ml12">
                    <button class="btn" @click="openDialog">创建通知</button>
                </div>
            </div>
            <div class="table-wrap">
                <el-table v-loading="loading" :data="tableList" style="width: 100%">
                    <el-table-column prop="title" label="通知标题" width="180"></el-table-column>
                    <el-table-column prop="noticeType" label="通知类型" width="100">
                        <template slot-scope="{row}">
                            <span v-if="row.noticeType===1">商品通知</span>
                            <span v-if="row.noticeType===2">售后通知</span>
                            <span v-if="row.noticeType===3">订单通知</span>
                            <span v-if="row.noticeType===4">资金通知</span>
                            <span v-if="row.noticeType===5">系统通知</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="publishStatus" label="状态">
                        <template slot-scope="{row}">
                            <span v-if="row.publishStatus===0">未发布</span>
                            <span v-else>已发布</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间"></el-table-column>
                    <el-table-column prop="publishTime" label="发布时间"></el-table-column>
                    <el-table-column label="通知内容">
                        <template slot-scope="{row}">
                            <el-tooltip class="tooltip" effect="light" placement="right-start">
                                <div slot="content" class="tip-content">
                                    <span>{{row.content}}</span>
                                </div>
                                <div class="content-text ellipsis">
                                    <span>{{row.content}}</span>
                                </div>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="{row}">
                            <el-button
                                @click="deleteNotice(row.noticeId)"
                                type="text"
                                size="small"
                            >移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="current"
                        :page-sizes="[10, 20, 100, 200,500]"
                        :page-size="size"
                        layout="total, sizes, prev, pager, next"
                        :total="total"
                    ></el-pagination>
                </div>
            </div>
        </div>
        <dialog-create-notice :visible="visible" @close="visible=false" @submit="createNotice" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DialogCreateNotice from "./components/DialogCreateNotice";
import { dateFormat } from '@/filters/'

export default {
    components: {
        DialogCreateNotice,
    },
    data() {
        return {
            loading: true,
            visible: false,
            form: {
                title: '',
                noticeType: null,
                publishStatus: null,
                publishTimeArr: '',
            },
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            tableList: [],
            current: 1,
            size: 10,
            total: 0,
        };
    },
    computed: {
        ...mapGetters([

        ]),
    },
    created() {

    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            this.loading = true;
            const params = {
                title: this.form.title,
            };
            params.noticeType = this.form.noticeType;
            params.publishStatus = this.form.publishStatus;
            if (this.form.publishTimeArr) {
                params.publishTimeArr = [
                    dateFormat(this.form.publishTimeArr[0]),
                    dateFormat(this.form.publishTimeArr[1])
                ];
            }
            const arr = [
                await this.$API.getNoticelist(
                    {
                        ...params,
                        current: this.current,
                        size: this.size,
                    }
                ),
            ];
            Promise.all(arr).then(res => {
                if (res[0]) {
                    const datas = res[0].data.data;
                    this.tableList = datas.records;
                    this.total = datas.total;
                }

                this.loading = false;
            });

        },
        // 创建一条通知
        createNotice(params) {
            this.loading = true;
            // 1 notifyAllUser (通知所有用户) 如果为 true 不需要传 members 对象
            // members: [
            //     {
            //         tenantId: "1",
            //         userIds: [1]
            //     }
            // 2 publishNow true 为 立即发布，如果是 false 需要传 publishTime （发布时间）
            this.$API.createNotice(params).then(datas => {
                const data = datas.data;
                this.tableList = data.records;
                this.total = data.total;
                this.fetchData();
                this.loading = false;
                this.visible = false;
                this.$message.success('发布成功')
            });
        },
        openDialog() {
            this.visible = true;
        },
        resetData() {
            this.form = {
                title: '',
                noticeType: null,
                publishStatus: null,
                publishTimeArr: '',
            };
            this.current = 1;
            this.size = 10;
            this.fetchData();
        },
        // 删除 一条通知
        deleteNotice(id) {
            this.loading = true;
            this.$API.deleteNotice(id).then(datas => {
                this.fetchData();
                this.loading = false;
            });
        },
        handleSizeChange(val) {
            this.size = val;
            this.fetchData();
        },
        handleCurrentChange(val) {
            this.current = val;
            this.fetchData();
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    background: #f0f2f5;
    .header-wrap {
        margin: 10px;
        padding: 20px;
        background: #fff;
        .form {
            .options {
                display: flex;
            }
        }
    }
    .content-wrap {
        margin: 0 10px;
        padding: 20px;
        background: #fff;
        margin-top: 30px;
        .options {
            display: flex;
            justify-content: flex-end;
            .btn {
                margin-right: 20px;
            }
        }

        .table-wrap {
            & ::v-deep .el-table th.el-table__cell > .cell {
                padding: 12px 10px;
                background-color: #fff;
                font-size: 16px;
                font-weight: 600;
                color: rgba(0, 0, 0, 0.96);
                line-height: 29px;
                text-align: center;
            }

            & ::v-deep .el-table td,
            .el-table th {
                font-size: 16px;
                color: rgba(0, 0, 0, 0.96);
                line-height: 24px;
                padding: 12px 0;
                box-sizing: border-box;
                text-overflow: ellipsis;
                vertical-align: middle;
                position: relative;
                text-align: center;
            }

            .name {
                text-align: left !important;
            }
            .pagination {
                margin-top: 20px;
                display: flex;
                flex-direction: row-reverse;
            }
        }
    }
    .btn {
        width: 89px;
        height: 34px;
        background: $themeColor;
        border-radius: 5px;
        border: 0;
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
    }
}
</style>
