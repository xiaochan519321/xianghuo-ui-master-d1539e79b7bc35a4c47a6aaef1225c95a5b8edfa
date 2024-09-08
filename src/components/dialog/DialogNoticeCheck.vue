<template>
    <div class="container">
        <el-dialog title="信息通知" :visible.sync="visible_" width="48%" :before-close="handleClose">
            <div class="content">
                <div class="lbox">
                    <div class="item-wrap">
                        <div class="active-bar" :style="`${transform}`"></div>
                        <div :class="`item ${tabActive ===1?'active ':''}`" @click="tabChange(1)">
                            <span>商品信息</span>
                            <div class="badge-box">
                                <el-badge :value="unreadNumObj.shop" :max="99"></el-badge>
                            </div>
                        </div>
                        <div :class="`item ${tabActive ===2?'active ':''}`" @click="tabChange(2)">
                            <span>售后信息</span>
                            <div class="badge-box">
                                <el-badge :value="unreadNumObj.aftersale" :max="99"></el-badge>
                            </div>
                        </div>
                        <div :class="`item ${tabActive ===3?'active ':''}`" @click="tabChange(3)">
                            <span>订单信息</span>
                            <div class="badge-box">
                                <el-badge :value="unreadNumObj.order" :max="99"></el-badge>
                            </div>
                        </div>
                        <div :class="`item ${tabActive ===4?'active ':''}`" @click="tabChange(4)">
                            <span>账户资金</span>
                            <div class="badge-box">
                                <el-badge :value="unreadNumObj.account" :max="99"></el-badge>
                            </div>
                        </div>
                        <div :class="`item ${tabActive ===5?'active ':''}`" @click="tabChange(5)">
                            <span>系统通知</span>
                            <div class="badge-box">
                                <el-badge :value="unreadNumObj.system" :max="99"></el-badge>
                            </div>
                        </div>
                    </div>
                    <div class="footer-wrap">
                        <div class="read-box">
                            <span class="read" @click="handleReadAll">全部标为已读</span>
                        </div>
                    </div>
                </div>
                <div class="rbox">
                    <div class="header">
                        <div class="ml12">
                            <button
                                :class=" ` btn ${btnActive ===1 ? '':'not-active' }`"
                                @click="fetchData(1)"
                            >全部信息</button>
                        </div>
                        <div class="ml12">
                            <button
                                :class=" ` btn ${btnActive ===2 ? '':'not-active' }`"
                                @click="fetchData(2)"
                            >未读消息</button>
                        </div>
                    </div>
                    <!-- 通知详情 -->
                    <div class="details-content" v-if="showDetails">
                        <div class="title">
                            <span>{{rowDetails.title}}</span>
                            <span class="time">{{ rowDetails.publishTime}}</span>
                        </div>
                        <div class="notice-details">
                            <div class="text">{{rowDetails.content}}</div>
                            <div class="footer">
                                <button class="btn-detail" @click="returnContentList">返回列表</button>
                            </div>
                        </div>
                    </div>
                    <!-- 通知列表 -->
                    <div class="content-wrap" v-else>
                        <div class="row-wrap" v-loading="loading">
                            <el-empty v-if="list.length===0" description="暂无信息"></el-empty>

                            <div class="row" v-for="(item,index) in list" :key="index">
                                <div class="title">
                                    <el-badge is-dot v-if="item.readStatus ===0"></el-badge>
                                    <span>{{item.title}}</span>
                                </div>
                                <div class="ellipsis-2">
                                    <div class="text">{{item.content}}</div>
                                </div>
                                <div class="footer">
                                    <span class="time">{{ item.publishTime}}</span>
                                    <button class="btn-detail" @click="ckeckDetails(item)">查看详情</button>
                                </div>
                            </div>
                        </div>
                        <div class="pagination">
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="current"
                                :page-sizes="[5, 10, 20]"
                                :page-size="size"
                                layout="total, sizes, prev, pager, next"
                                :total="total"
                            ></el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatTime } from '@/filters/'

export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            loading: true,
            unreadNumObj: {
                shop: null,
                aftersale: null,
                order: null,
                account: null,
                system: null
            },
            list: [],
            current: 1,
            size: 10,
            total: 0,
            tabActive: 1,
            // 1 全部信息， 2 未读信息
            btnActive: 1,
            transform: 'transform: translateY(0px)',
            dialogVisible: true,
            showDetails: false,
            rowDetails: {},
        };
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ]),
        visible_: {
            get() {
                return this.visible;
            },
            set(newVal) {
                return this.$emit('close');
            }
        },
    },
    watch: {
        visible(val) {
            if (val) {
                this.fetchData();
            }
        },
    },
    created() {

    },
    mounted() {
    },
    methods: {
        // 不同通知类型的未读条数
        initData(data) {
            if (data.length > 0) {
                let obj = {
                    shop: null,
                    aftersale: null,
                    order: null,
                    account: null,
                    system: null
                };
                data.forEach((item) => {
                    switch (item.noticeType) {
                        case 1:
                            obj.shop = item.unreadNum;
                            break;
                        case 2:
                            obj.aftersale = item.unreadNum;
                            break;
                        case 3:
                            obj.order = item.unreadNum;
                            break;
                        case 4:
                            obj.account = item.unreadNum;
                            break;
                        case 5:
                            obj.system = item.unreadNum;
                            break;
                    }
                });
                this.unreadNumObj = obj;
            } else {
                this.unreadNumObj = {
                    shop: null,
                    aftersale: null,
                    order: null,
                    account: null,
                    system: null
                };
            }
        },
        async fetchData(type) {
            this.loading = true;
            const params = {
                noticeType: this.tabActive,
                current: this.current,
                size: this.size,
            }
            // 1 全部信息
            if (type === 1) {
                this.btnActive = 1;
            }
            // 2 未读信息
            if (type === 2) {
                this.btnActive = 2;
                params.readStatus = 0;
            }
            // 获取未读通知数
            this.$API.getNoticeList(params).then(({ data }) => {
                const datas = data.data;
                this.list = datas.records;
                this.total = datas.total;
                this.loading = false;
            });
        },
        tabChange(index) {
            this.tabActive = index;
            switch (index) {
                case 1:
                    this.transform = 'transform: translateY(0px)';
                    break;
                case 2:
                    this.transform = 'transform: translateY(45px)';
                    break;
                case 3:
                    this.transform = 'transform: translateY(90px)';
                    break;
                case 4:
                    this.transform = 'transform: translateY(135px)';
                    break;
                case 5:
                    this.transform = 'transform: translateY(180px)';
                    break;
            }
            this.showDetails = false;
            this.fetchData(1);
        },
        handleClose() {
            this.form = {
                title: '',
                content: '',
                noticeType: null,
                publishTime: '',
                publishNow: true,
                notifyAllTenant: true,
                members: [
                    {
                        notifyAllUser: true,
                        tenantId: '',
                        userIds: [],
                    }
                ]
            };
            this.$emit('close');
        },
        // 查看详情
        ckeckDetails(row) {
            this.rowDetails = row;
            this.showDetails = true;
            this.updateNoticeRead({ noticeId: row.noticeId, readType: 1 });
        },
        // 更新 通知阅读状态
        updateNoticeRead(params) {
            this.$API.noticeRead(params).then(datas => {
                const data = datas.data;
                this.$emit('update');
            });
        },
        // 全部标为已读
        handleReadAll() {
            this.updateNoticeRead({ readType: 0 });
        },
        // 从详情 返回到 通知列表
        returnContentList() {
            this.showDetails = false;
            this.fetchData();
            this.$emit('update');
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
    ::v-deep .el-dialog__body {
        padding: 0px;
    }
    .content {
        height: 500px;
        display: flex;
        flex: 1 1 auto;
        .lbox {
            display: flex;
            flex-direction: column;
            border: 1px solid #dedede;
            .item-wrap {
                position: relative;
                overflow: hidden;
                user-select: none;
                .active-bar {
                    position: absolute;
                    right: 0;
                    width: 2px;
                    height: calc(100% / 4);
                    background-color: $themeColor;
                    transition: transform 0.3s
                        cubic-bezier(0.645, 0.045, 0.355, 1);
                }
                .active {
                    color: $themeColor;
                }
                .item {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 122px;
                    height: 45px;
                    border-bottom: 1px solid #dedede;
                    cursor: pointer;
                    .badge-box {
                        width: 21px;
                    }
                }
            }
            ::v-deep .el-badge__content.is-fixed {
                top: 10px;
                right: 25px;
            }
            .footer-wrap {
                display: flex;
                flex-direction: column;
                flex: 1 1 auto;
                justify-content: flex-end;
                background: #ffffff;
                user-select: none;
                .read-box {
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    border-top: 1px solid #dedede;
                    border-bottom: 1px solid #dedede;
                    height: 40px;
                    .read {
                        font-size: 12px;
                        font-weight: 400;
                        color: #777171;
                        line-height: 30px;
                    }
                }
            }
        }
        .rbox {
            flex: 1 1 auto;
            .header {
                height: 46px;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #dedede;
                .not-active {
                    background: #ffffff;
                    border: 1px solid #d9d9d9;
                    font-weight: 400;
                    color: #000;
                }
            }
            .content-wrap {
                height: 420px;
                overflow-y: scroll;
                .row-wrap {
                    min-height: 360px;
                    .row {
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                        border-right: 1px solid #dedede;
                        border-bottom: 1px solid #dedede;
                        .title {
                            margin-top: 7px;
                            margin-left: 34px;
                            font-size: 14px;
                            font-weight: 400;
                            color: #000;
                            line-height: 30px;
                            ::v-deep .el-badge__content.is-dot {
                                right: 2px;
                                top: -2px;
                            }
                        }
                        .text {
                            margin: 7px 60px 6px 60px;
                            height: 40px;
                            font-size: 12px;
                            font-weight: 400;
                            color: rgba(0, 0, 0, 0.65);
                            line-height: 20px;
                            word-wrap: break-word;
                        }
                        .footer {
                            display: flex;
                            justify-content: space-between;
                            margin: 18px 60px 9px 60px;
                            .time {
                                font-size: 12px;
                                font-weight: 400;
                                color: rgba(0, 0, 0, 0.65);
                                line-height: 29px;
                            }
                        }
                    }
                }
                .pagination {
                    margin-top: 20px;
                    margin-right: 40px;
                    display: flex;
                    flex-direction: row-reverse;
                }
            }
            .btn-detail {
                width: 82px;
                height: 25px;
                background: #ffffff;
                border-radius: 3px;
                border: 1px solid #1890ff;
                font-size: 12px;
                font-weight: 400;
                color: #1890ff;
            }
            .details-content {
                display: flex;
                align-items: center;
                flex-direction: column;
                padding-top: 30px;
                height: 420px;
                overflow-y: scroll;
                .title {
                    font-size: 18px;
                    font-weight: 400;
                    color: #000;
                    line-height: 30px;
                    .time {
                        margin-left: 10px;
                        font-size: 14px;
                        font-weight: 400;
                        color: rgba(0, 0, 0, 0.65);
                        line-height: 30px;
                    }
                }
                .notice-details {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    justify-self: start;
                    margin-top: 16px;
                    position: relative;
                    .text {
                        padding: 0 30px 20px;
                        line-height: 22px;
                        word-break: break-all;
                        white-space: break-spaces;
                        height: 100%;
                    }
                    .footer {
                        padding: 20px 50px;
                        display: flex;
                        justify-content: flex-end;
                    }
                }
            }
        }
        .btn {
            width: 98px;
            height: 32px;
            background: $themeColor;
            border-radius: 5px;
            border: 0;
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
            line-height: 20px;
        }
    }
}
</style>
