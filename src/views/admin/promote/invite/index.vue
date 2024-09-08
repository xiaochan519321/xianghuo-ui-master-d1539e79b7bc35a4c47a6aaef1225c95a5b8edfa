<template>
    <div class="market-manage-new">
        <template v-if="false">
            <div class="title-wrap mr30">
            <div class="title">推广管理</div>
        </div>
        <div class="h260 flex justify-between mt20 mr30" v-loading="spin">
            <!-- 用户信息 -->
            <div class="cards w356 p20 flex flex-col">
                <div class="h-title">
                    <span>用户信息</span>
                </div>
                <div class="px28 userinfo-box flex flex-col flex-1">
                    <div class="flex mt40" v-if="my">
                        <div class="avatar">
                            <el-image src="/img/user/avatar.png"></el-image>
                        </div>
                        <div class="flex-1 flex flex-col justify-between py8 ml20">
                            <p class="font-w-600">
                                <span>账号：{{ my.phone }}</span>
                            </p>
                            <div class="roles">
                                <span class="color-l">用户身份：{{ my.identity >= 1 ? '代理商' : '普通用户' }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="tips mt30 lh20">
                        <span>推广新用户绑定店铺成功即可双方都获得</span>
                        <span class="days">3天</span>
                        <span>免费体验会员，想成为代理联系商务客服</span>
                    </div>
                </div>
            </div>
            <!-- 我要推广 -->
            <div class="cards flex-1 p20 mx20">
                <div class="h-title">
                    <span>我要推广</span>
                </div>
                <div class="px15 mt20">
                    <div class="promote-box px20 col-w pt38">
                        <div class="flex justify-center items-center" v-if="my">
                            <span class="pt1">我的邀请：</span>
                            <div class="flex justify-between flex-1">
                                <p>
                                    <span>已成功邀请人数</span>
                                    <span class="num px5">{{ my.promoteNum || 0 }}</span>
                                    <span>人</span>
                                </p>
                                <p>
                                    <span>今日邀请人数</span>
                                    <span class="num pr5">{{my.countToday || 0}}</span>
                                    <span>人</span>
                                </p>
                                <p>
                                    <span>已获得会员天数：</span>
                                    <span class="num pr5">{{ my.giftDateSum || 0 }}</span>
                                    <span>天</span>
                                </p>
                            </div>
                        </div>
                        <div class="flex justify-between items-center mt56">
                            <span>推广链接生成</span>
                            <div class="path">
                                <span class="flex pt5 ellipsis-1">{{ promoteUrl }}</span>
                            </div>
                            <button class="copy" @click="copyPromoteUrl">
                                <span>复制</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 推广说明 -->
            <div class="cards w510 p20">
                <div class="h-title">
                    <span>推广说明</span>
                </div>
                <div class="px15 mt20 instructions-box">
                    <div class="item-cell">
                        <div class="head col-w">
                            <span>如何推广自己的邀请码</span>
                        </div>
                        <div class="text lh20 pt5 pl10 font12">
                            <!-- <span>
                                每个邀请码都是唯一的，点击复制推广链接分享到微信群或者朋友圈
                                <br />等，被推荐人打开链接注册即为推广成功
                            </span>-->
                            <span class="desc">
                                每个邀请码都是唯一的，点击复制推广链接分享到微信群或者朋友圈等，被推荐人打开链接注册成功，成功绑定一个店铺即为推广成功
                            </span>
                        </div>
                    </div>
                    <div class="item-cell mt5">
                        <div class="head col-w">
                            <span>推广好友为什么没有获得3天会员</span>
                        </div>
                        <div class="text lh20 pt5 pl10 font12">
                            <span class="desc">
                                只要您这边邀请的是没有使用过的新用户，店铺是第一次绑定的，您这边是会收到3天会员奖励的哦
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 推广列表 -->
        <div class="cards mt20 p20 mr30">
            <div class="flex justify-between items-center">
                <div class="h-title flex items-center">
                    <span>推广列表</span>
                    <el-tooltip effect="dark" placement="top" content="已成功推广人数将会在下方列表展示">
                        <i class="el-icon-question ml5 font18 font-w-500 color-l"></i>
                    </el-tooltip>
                </div>
                <div class="input-box flex">
                    <input
                        v-model="params.phone"
                        class="flex-1 input"
                        type="text"
                        placeholder="请输入手机号"
                        @keyup.enter="onCurrentChange(1)"
                    />
                    <button class="confirm" @click="onCurrentChange(1)">
                        <i class="iconfont icon-search"></i>
                    </button>
                </div>
            </div>
           
            <div class="table-main mt20 relative mh400" v-loading="loading">
                <div class="t-header flex">
                    <div class="t-th w-1/3">
                        <span>用户名</span>
                    </div>
                    <div class="t-th w-1/3">
                        <span>手机号</span>
                    </div>
                    <div class="t-th w-1/3">
                        <span>注册时间</span>
                    </div>
                </div>
                <div class="t-tboby">
                    <div class="t-tr" v-for="(item, index) in list" :key="index">
                        <div class="t-td w-1/3">
                            <span>{{ item.username }}</span>
                        </div>
                        <div class="t-td w-1/3">
                            <span>{{ item.phone }}</span>
                        </div>
                        <div class="t-td w-1/3">
                            <span>{{ item.userCreateTime || '-' }}</span>
                        </div>
                    </div>
                </div>
                <div class="pagination mt20" v-if="list.length > 0">
                    <el-pagination-custom
                        align="center"
                        :options="{
                            currentPage: params.current,
                            pageSize: params.size,
                            total: total,
                            layout: 'prev, pager, next, total',
                        }"
                        @current-change="onCurrentChange"
                    ></el-pagination-custom>
                </div>
                <empty-main v-if="!list.length && !loading"></empty-main>
            </div>
        </div>
        </template>
        <div class="card header-card">
            <div class="title" style="float:left">
                <span>推广管理</span>
                <span>邀请人永久获得被邀请人充值的百分之五积分</span>
                <span>{{
                    sts == "1"
                    ? "审核中"
                    : sts == "2"
                    ? "审核成功"
                    : sts == "3"
                    ? "审核拒绝"
                    : ""
                }}</span>
            </div>
            <el-button
                type="primary"
                style="width: 80px;float:right;margin:-5px 15px 0 0"
                @click.stop="addAudit(row)"
            >
                申请代理
            </el-button>
        </div>
        <div class="invite">
            <div class="card user-card">
                <div class="title">
                    用户信息
                </div>
                <div class="card-main">
                    <div class="user">
                        <el-image class="avatar" src="/img/user/avatar.png"></el-image>
                        <div class="info">
                            <div class="t">
                                <span>{{ my.username }}</span>
                                <span>{{ my.identity >= 1 ? '代理商' : '普通用户' }}</span>
                            </div>
                            <div class="b">{{ my.phone }}</div>
                        </div>
                    </div>
                    <div class="counts">
                        <div class="item">
                            <p class="name">我的邀请人数</p>
                            <div class="count">
                                <div class="i blue">
                                    <img src="@/assets/icon-my.png" alt="">
                                </div>
                                <span class="t">{{ my.promoteNum || 0 }}</span>
                                <span class="r">人</span>
                            </div>
                        </div>
                        <!-- <div class="item">
                            <p class="name">今日邀请人数</p>
                            <div class="count ">
                                <div class="i yellow">
                                    <img src="@/assets/icon-user.png" alt="">

                                </div>
                                <span class="t">{{ my.countToday || 0 }}</span>
                                <span class="r">人</span>
                            </div>
                        </div>
                        <div class="item">
                            <p class="name">获得会员天数</p>
                            <div class="count">
                                <div class="i red">
                                    <img src="@/assets/icon-vip.png" alt="">
                                </div>
                                <span class="t">{{ my.giftDateSum || 0 }}</span>
                                <span class="r">人</span>
                            </div>
                        </div> -->
                        
                    </div>
                </div>
            </div>
            <div class="card invite-card">
                <div class="title">
                    推广链接生成
                    <el-button type="primary" icon="el-icon-copy-document" @click="copyPromoteUrl">复制</el-button>
                </div>
                <div class="card-main">
                    <div class="promoteUrl">
                        {{ promoteUrl }}
                    </div>
                </div>
            </div>
        </div>
        <div class="card list-card">
            <div class="title">
                <span>推广列表</span>
                <el-tooltip content="已成功推广人数将会在下方列表展示" placement="bottom" effect="dark">
                    <i class="el-icon-question question" />    
                </el-tooltip>
                <div class="search">
                    <input
                        v-model="params.phone"
                        style="width: 317px;"
                        type="text"
                        placeholder="请输入手机号"
                        @keyup.enter="onCurrentChange(1)"
                    />
                    <button  @click="onCurrentChange(1)">
                        <i class="icon-search"></i>
                    </button>
                </div>
            </div>            
            <div class="card-main">
                <div class="table">
                <el-table v-loading="loading" :data="list">
                    <el-table-column label="用户编号" prop="userId"></el-table-column>
                    <el-table-column label="手机号" prop="phone"></el-table-column>
                    <el-table-column label="上级编号" prop="agentId"></el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span>{{
                                scope.row.sts == "1"
                                ? "正常"
                                : scope.row.sts == "2"
                                ? "冻结"
                                : ''
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="代理比例">
                        <template slot-scope="scope">
                            {{ (scope.row.radio)*100 +'%' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="拥有店铺权限数量" prop="shopNum"></el-table-column>
                    <el-table-column label="拥有子账号权限数量" prop="subNum"></el-table-column>
                    <el-table-column label="时间">
                        <template slot-scope="scope">
                            <span style="float:left">
                                {{ scope.row.time.substr(0, 4) + '-'
                                + scope.row.time.substr(4, 2) + '-'
                                + scope.row.time.substr(6, 2)}}
                            </span>
                            <span style="float:left;margin-left:5px">
                                {{ scope.row.time.substr(8, 2) + ':'
                                +scope.row.time.substr(10, 2) + ':'
                                +scope.row.time.substr(12, 2)
                                }}
                            </span>
                        </template> 
                    </el-table-column>
                </el-table>
                <div style="margin-top: 40px">
                    <el-pagination-custom
                        v-if="list.length > 0"
                        align="right"
                        :options="{
                            currentPage: params.current,
                            pageSize: params.size,
                            total: total,
                            layout: 'prev, pager, next, total',
                        }"
                        @current-change="onCurrentChange">
                    </el-pagination-custom>
                </div>
            </div>
            </div>
        </div>
        <dialog-with-drawal :visible="show" @close="show = false"></dialog-with-drawal>
    </div>
</template>

<script>
// import moment from 'moment'
import { mapState, mapGetters } from "vuex";
import DialogWithDrawal from './components/DialogWithDrawal';
import ElPaginationCustom from '@/components/base/ElPaginationCustom';
import EmptyMain from '@/components/widget/EmptyMain';
import { fetchList, count, codeObj, addAuditObj,getAudit} from '@/api/admin/promote-invite';
import {getMerchantInfo} from'@/api/admin/merchant'

export default {
    components: {
        ElPaginationCustom,
        EmptyMain,
        DialogWithDrawal,
    },
    data() {
        return {
            spin: true,
            loading: true,
            promoteUrl: window.location.origin + '/#/login?invite',
            show: false,
            list: [],
            params: {
                current: 1,
                size: 10,
                phone:""
            },
            total: 0,
            membersList: [],
            show: false,
            visible: false,
            options: {},
            sts: '' //用户审核状态
        };
    },
    computed: {
        ...mapGetters([
            'my',
            'siteConfig',
        ]),
        ...mapState({
            userInfo: (state) => state.user.userInfo
        }),
    },
    mounted() {
        this.getCode();
        this.getAudit();
        this.fetchData();
        this.getsuccessNum();
        this.getMerchantInfo();
        this.spin = false;
        this.loading = false;
    },
    methods: {
        // dateFormat(n){
        //     const result = this.$moment(n).format('YYYY-MM-DD HH:mm:ss')
        //     // const result = this.$moment(n * 1000).format('YYYY-MM-DD hh:mm:ss') // 转换时间格式
        //     return result // 返回出去 否则不会生效
        // },
        /* 获取邀请码 */
        async getCode() {
            try {
                const { data: { data } } = await codeObj();
                this.promoteUrl = `${window.location.origin}/#/login?invite=${data.invite}`
                this.my.promoteNum = data.pushNum
                console.log(this.promoteUrl,123);
            } catch (error) {}
        },
        //用户发起审核
        addAudit() {
            addAuditObj().then((res) => {
                this.$message({
                    type: "success",
                    message: "删除成功!",
                });
            });
        },
        //用户查询代理审核状态
        async getAudit() {
            try {
                const { data: { data } } = await getAudit();
                this.sts = data.sts
                console.log(this.data);
            } catch (error) {}
        },
        /* 获取推广列表*/
        async fetchData() {
            try {
                const { data: { data } } = await fetchList(this.params);
                this.list = data.records;
                this.total = data.total;
                console.log(list)
            } catch (error) {}
        },
        /* 获取成功邀请操作*/
        async getsuccessNum() {
            try {
                const { data: { data } } = await count();
                console.log('data', data)
                this.my.countToday = data.countToday
                this.my.giftDateSum = data.giftDateSum
                this.my.promoteNum = data.promoteNum
            } catch (error) {}
        },
        /*获取当前登录商家信息*/
        async getMerchantInfo() {
            try {
                const { data: { data } } = await getMerchantInfo();
                this.my.profitMoney = data.commission;
                this.my.identity = data.agentStatus;
                this.my.phone = this.userInfo.phone;
            } catch (error) {
                console.log(error);
            }
        },
        copyPromoteUrl: function () {
            this.$Clipboard({
                text: this.promoteUrl
            }).then(() => {
                this.$message.success('复制成功')
            }).catch(() => {
                this.$message.error('复制失败')
            });
        },
        onCurrentChange(val) {
            this.params.current = val;
            this.fetchData();
        },
        onClickBtn() {
            this.$bus.$emit('wechat');
        }
    }
};
</script>

<style lang="scss" scoped>
.market-manage {
    .title-wrap {
        background: #ffffff;
        border-radius: 6px;
        .title {
            font-size: 22px;
            font-weight: bold;
            color: #1890ff;
            line-height: 29px;
            padding: 19px 0 19px 41px;
        }
    }
    .highlight {
        color: #f9be0f;
    }
    .color-l {
        color: $themeColor;
    }
    .w-1\/5 {
        width: 20%;
    }
    .w-1\/3 {
        width: 33.33%;
    }
    .w356 {
        width: 356px;
    }
    .w510 {
        width: 509px;
    }
    .h260 {
        height: 260px;
    }
    .mh400 {
        min-height: 400px;
    }
    .cards {
        background: #ffffff;
        border-radius: 6px;
    }
    .h-title {
        position: relative;
        font-weight: 600;
        font-size: 16px;
        padding-left: 15px;

        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: -2px;
            width: 7px;
            height: 20px;
            background: $themeColor;
            border-radius: 9px;
        }
    }
    .userinfo-box {
        .avatar {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            overflow: hidden;
        }
        .roles {
            width: 157px;
            height: 26px;
            border-radius: 4px;
            border: 1px solid #4fa1fe;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .tips {
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
            color: #333333;
            .days {
                display: inline-block;
                padding: 0 5px 0 5px;
                color: #1890ff;
            }
        }

        .footer {
            .btn {
                width: 92px;
                height: 30px;
                border-radius: 3px;
                box-sizing: border-box;
                color: #fff;
                border: 0;
                &.lbox {
                    background: #4fa1fe;
                    box-shadow: 0px 2px 4px 0px #4fa1fe;
                }
                &.rbox {
                    background: #8464fe;
                    box-shadow: 0px 2px 4px 0px #8464fe;
                }
            }
        }
    }
    .promote-box {
        width: 100%;
        height: 185px;
        border-radius: 8px;
        background: url("/img/promotion/cards.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: top;

        // @include bgImg("/img/promotion/cards.png");
        .num {
            color: #f9be0f;
            font-size: 16px;
            font-weight: 600;
        }
        .path {
            width: 384px;
            height: 30px;
            min-height: 30px;
            background: #ffffff;
            border-radius: 6px;
            color: #666666;
            line-height: 20px;
            padding: 0 15px;
            position: relative;
            .desc {
                color: #0267cd;
                position: absolute;
                left: 0;
                bottom: -100%;
                font-size: 12px;
                .desc-tips {
                    width: 295px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #f0c875;
                    line-height: 17px;
                }
            }
        }
        .copy {
            width: 84px;
            height: 30px;
            background: #30323f;
            border-radius: 6px;
            color: #fff;
        }
    }
    .instructions-box {
        .item-cell {
            .head {
                width: 100%;
                height: 33px;
                background: #1890ff;
                border-radius: 4px;
                line-height: 33px;
                padding-left: 10px;
            }
            .desc {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
        }
    }
    .input-box {
        width: 291px;
        height: 30px;

        .input {
            border: 1px solid #dedede;
            box-sizing: border-box;
            border-radius: 4px 0 0 4px;
            padding: 0 20px;
        }

        .confirm {
            width: 47px;
            height: 30px;
            background: $themeColor;
            border-radius: 0 4px 4px 0;
            color: #fff;
        }
    }
    .table-main {
        .t-header {
            border-radius: 8px 8px 0 0;
            width: 100%;
            height: 50px;
            background: #1890ff;
            .t-th {
                text-align: center;
                line-height: 50px;
                color: #fff;
                border-right: 1px solid #fff;
                &:last-of-type {
                    border-right: 0;
                }
            }
        }
        .t-tboby {
            .t-tr {
                height: 50px;
                border-left: 1px solid #dedede;
                border-right: 1px solid #dedede;
                border-bottom: 1px solid #dedede;
                box-sizing: border-box;
                display: flex;
                transition: 0.15s ease-in-out;
                &:hover {
                    background: #f5f7fa;
                }
                .t-td {
                    text-align: center;
                    line-height: 50px;
                    color: #666666;
                }
                .confirm {
                    width: 80px;
                    height: 30px;
                    background: $themeColor;
                    border-radius: 4px;
                    color: #fff;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
<style lang="scss" scoped>


.card {
    background: #fff;
    border-radius: 12px;
    padding: 16px 0px 0px 16px;
    .title {
        font-size: 20px;
        font-family: PingFang SC, PingFang SC;
        font-weight: bold;
        color: #000000;
        line-height: 20px;
        position: relative;
        text-indent: 11px;
        &::before {
            content: '';
            display: block;
            position: absolute;
            width: 2px;
            height: 18px;
            top: 1px;
            left: 0px;
            // background: $themeColor; ; 
            background: $themeColor; 
        }
    }
}
.market-manage-new {
    .header-card {
        height: 50px;
        .title{
            display: flex;
            align-items: center;
            span:last-child {
                margin-left: 14px;
                font-size: 16px;
                // color: $themeColor;
                color: red;
            }
        }
    }
    .invite {
        display: flex;
        margin-top: 16px;
        .user-card {
            flex: 1;
            .card-main {
                padding-bottom: 22px;
                padding-left: 0px;
                .user {
                    display:flex;
                    align-items: center;
                    margin: 34px 0px 0px 40px;
                    .avatar {
                        width: 56px;
                        height: 56px;
                        border-radius: 50%;
                        overflow: hidden;
                    }
                    .info {
                        margin-left: 10px;
                        .t {
                            display: flex;
                            align-items: center;
                            font-size: 12px;
                            span:last-child {
                                width: 56px;
                                height: 18px;
                                background: rgba(47,81,255,0.15);
                                border-radius: 4px 4px 4px 4px;
                                border: 1px solid #2F51FF;
                                font-size: 12px;
                                color: $themeColor;
                                display: flex;
                                align-items:center;
                                justify-content: center;
                                transform: scale(.86);
                            }
                        }
                        .b {
                            font-size: 12px;
                            line-height: 12px;
                            margin-top: 12px;
                        }
                    }
                }
                .counts {
                    display: flex;
                    align-items: center;
                    margin-top:50px;
                    .item {
                        flex: 1;
                        .name {
                            font-size: 20px;
                            font-weight: bold;
                            color: #000000;
                            line-height: 20px;
                            text-align: center;
                        }
                        .count  {
                            margin-top: 16px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            .i {
                                width: 40px;
                                height: 40px;
                                border-radius: 50%;
                                overflow: hidden;
                                transform: translateY(-3px);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                &.blue {
                                    background: #F0F5FE;
  
                                }
                                &.yellow {
                                    background: #FFF6ED;
                                }
                                &.red {
                                    background: #FFEDED;
                                }

                                img {
                                    width: 24px;
                                    border-radius: 50%;
                                    // width: 100%;
                                }
                            }
                            .t {
                                color: $themeColor;
                                font-weight: bold;
                                font-size: 24px;
                                margin-left:10px;
                                margin-right: 10px;
                            }
                            .r {
                                font-size: 14px;
                                color: #D6D8DA;
                                font-weight: bold;

                            }
                        }
                       
                    }

                }
            }
        }
        .invite-card {
            flex: 1;
            margin-left: 16px;
            padding-right: 16px;
            padding-bottom: 50px;
            .title {
                display: flex;
                justify-content: space-between;
            }
            .card-main {
                margin-top: 46px;
                .promoteUrl {
                    width: 100%;
                    min-height: 118px;
                    background: #F5F5FF;
                    border-radius: 8px 8px 8px 8px;
                    font-size: 20px;
                    font-weight: bold;
                    color: #000000;
                    padding: 0 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    word-break: break-all;
                }
            }
        }
    }
    .list-card {
        margin-top: 16px;
        padding-right: 16px;
        padding-bottom: 50px;
        .title {
            display: flex;
            align-items: flex-start;
            .question {
                font-size: 14px;
                color: rgba(0,0,0,.5);
                margin-left: 3px;
                transform: translate(-12px);
            }
            .search {
                margin-left: auto;
                display: flex;
                input  {
                    border-radius: 2px 2px 2px 2px;
                    border: 1px solid #D9D9D9; 
                    border-right: none;
                    font-size: 14px;
                    color: #31373D ;
                    padding-left: 12px;
                    &::placeholder {
                        color: rgba(0,0,0,0.25);
                        font-size: 14px;
                    } 
                }
                button {
                    height:32px;
                    background: $themeColor;
                    width: 46px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    
                    i {
                        font-size: 14px !important;
                        color: #fff;
                    }
                }

            }
        }
        .card-main {
            margin-top: 24px;
        }
    }
    .table {
        ::v-deep .el-table{
            .el-table__header {
                th {
                    color: #394D5F;
                    background: #F8F9FB;
                }
            }
            .el-table__body {
                td {
                    font-size: 12px;
                    color: #666666;
                    height: 48px;
                }
            }
        }   
    }
}
</style>
