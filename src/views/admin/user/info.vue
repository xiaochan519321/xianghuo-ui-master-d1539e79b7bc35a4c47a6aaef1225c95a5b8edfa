<!--
  -    Copyright (c) 2018-2025, lzyq All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the lzyq developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lzyq
  -->

<template>
    <div class="app-container calendar-list-container">
        <basic-container>
            <div class="account-center-container flex" v-loading="loading">
                <div class="lbox flex  justify-center" style="align-items:center">
                    <div class="img-box" v-if="false">
                        <img v-if="siteConfig.htLogo" :src=" siteConfig.htLogo" alt />
                    </div>
                    <div class="info flex flex-col justify-center">
                        <div class="flex flex-1 justify-center">
                            <!-- <img
                                class="avatar"
                                :src="`${merchantInfo.avatar?imgDomain+merchantInfo.avatar:'./img/user/avatar.png'  }`"
                            />-->
                            <img class="avatar" src="/img/user/avatar.png" />
                        </div>
                        <div class="flex flex-col justify-center items-center mt32">
                            <div class="nickname">
                                <span v-if="isAdmin">{{merchantInfo.username}}</span>
                                <span v-else>{{merchantInfo.merchantName}}</span>
                                <el-popover
                                    v-if="!isAdmin"
                                    placement="right"
                                    trigger="hover"
                                    content="修改商家名称请联系客服"
                                >
                                    <i slot="reference" class="el-icon-question ml8"></i>
                                </el-popover>
                            </div>
                            <template v-if="!isAdmin && merchantInfo.memberRight">
                                <div
                                    class="expiry"
                                    v-if=" merchantInfo.memberRight.code!=='visitor'"
                                >
                                    <span class="mr5">{{merchantInfo.memberRight.name +' 套餐'}}</span>
                                    <span class="text">有效期至</span>
                                    <span class="time">{{merchantInfo.rightExpireTime}}</span>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="rbox">
                    <div class="grid-content">
                        <!-- 登录账号 -->
                        <div class="item">
                            <div class="title-box flex items-center mt26 ml32">
                                <div class="icon-wrap">
                                    <i class="iconfont icon-zhanghao1 font32"></i>
                                </div>
                                <span class="ml16">登录账号</span>
                            </div>
                            <div class="text mt54">
                                <span>{{merchantInfo.username}}</span>
                            </div>
                            <button v-if="!isAdmin" class="button">请联系客服修改</button>
                        </div>
                        <!-- 手机号 -->
                        <div class="item">
                            <div class="title-box flex items-center mt26 ml32">
                                <div class="icon-wrap">
                                    <i
                                        class="iconfont icon-shoujihao font32"
                                        style="color:#5BD171;"
                                    ></i>
                                </div>
                                <span class="ml16">手机号</span>
                            </div>
                            <div class="text mt54">
                                <span>{{merchantInfo.phone}}</span>
                            </div>
                            <!-- <button class="button">更换</button> -->
                        </div>
                        <!-- 注册时间 -->
                        <div class="item">
                            <div class="title-box flex items-center mt26 ml32">
                                <div class="icon-wrap">
                                    <i
                                        class="iconfont icon-zhuceshijian font32"
                                        style="color:#2E2E2E;"
                                    ></i>
                                </div>
                                <span class="ml16">注册时间</span>
                            </div>
                            <div class="text mt54">
                                <span>{{merchantInfo.createTime}}</span>
                            </div>
                        </div>
                        <!-- 剩余积分 -->
                        <div class="item">
                            <div class="title-box flex items-center mt26 ml32">
                                <div class="icon-wrap">
                                    <i
                                        class="iconfont icon-shengyujifen font32"
                                        style="color:#2C92F6;"
                                    ></i>
                                </div>
                                <span class="ml16">剩余积分</span>
                            </div>
                            <div class="text mt54">
                                <span>{{merchantInfo.integral}}</span>
                                <router-link to="/recharge/index" v-if="userInfo.identity != 'sub'">
                                    <el-button class="recharge">充值</el-button>
                                </router-link>
                            </div>
                            <!-- <button class="button">查看明细</button> -->
                        </div>
                        <!-- 登录密码 -->
                        <div class="item">
                            <div class="title-box flex items-center mt26 ml32">
                                <div class="icon-wrap">
                                    <i
                                        class="iconfont icon-denglumima font32"
                                        style="color:#2E2E2E;"
                                    ></i>
                                </div>
                                <span class="ml16">登录密码</span>
                            </div>
                            <div class="text mt54">
                                <span>*********</span>
                            </div>
                            <!-- <button class="button" @click.stop="isVisible = true">修改</button> -->
                        </div>
                        <!-- 累计充值 -->
                        <!-- <div class="item">
                            <div class="title-box flex items-center mt26 ml32">
                                <div class="icon-wrap">
                                    <i
                                        class="iconfont icon-leijichongzhi font32"
                                        style="color:#2C92F6;"
                                    ></i>
                                </div>
                                <span class="ml16">累计充值</span>
                            </div>
                            <div class="text mt54">
                                <span>{{ merchantInfo.presentIntegral ? merchantInfo.presentIntegral :'---'}}</span>
                            </div>
                        </div> -->
                        <!-- 二级密保 -->
						<div class="item" v-if="userInfo.identity == 'merchant'">
						    <div class="title-box flex items-center mt26 ml32">
						        <div class="icon-wrap">
						            <i
						                class="iconfont icon-denglumima font32"
						                style="color:#F56C6C;"
						            ></i>
						        </div>
						        <span class="ml16">二级密保</span>
								<div style="display: inline;padding-left: 5px;">
									<el-tooltip class="tooltip" effect="light" placement="right-start">
									    <i class="tips iconfont icon-wenhao"></i>
									    <div slot="content" class="tip-content">
											<p>1、仅主账号拥有设置开启密码保护的权限，在账号中心设置修改权限，开启后设置二级密码确认即可生效。</p>
											<p>2、子账号登录系统，将没有查看数据看板和财务报表的权限，都需要输入二级密码才能访问。</p>
									    </div>
									</el-tooltip>
								</div>
						    </div>
						    <div class="text mt54">
								<span v-if="open_spwd_flag">已启用</span>
								<span v-else>已关闭</span>密码保护
								<el-switch
									v-model="open_spwd_flag"
									@change="changeOpenSpwdFlag"
									active-color="rgb(70, 180, 109)"
									inactive-color="#909399">
								</el-switch>
						    </div>
							<div v-if="userInfo.second_password" style="text-align: right;margin-right: 32px;padding-top: 32px;">
								<el-button type="primary" @click="openDialog">修改密码</el-button>
							</div>
						</div>
                    </div>
                </div>
            </div>
            <div class="block"></div>
            <div>
                <div class="ml20 pt20">数据统计</div>
                <!-- <div style="display: flex;">
                    <div class="mt20 ml20">
                    <el-date-picker
                        v-model="dataTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @clear="handleClear"
                        >
                    </el-date-picker>
                    </div>
                    <div class="ml20 mt20">
                        <el-button
                            size="mini"
                            type="primary"
                            @click="screenBtn()"
                            >
                            筛选</el-button>
                    </div>
                </div> -->
                <div ref="echartsContainer" style="width: 100%; height: 400px;"></div>
            </div>
            <!-- 历史购买记录 -->
            <div class="table-wrap" v-loading="loading" v-if="userInfo.identity == 'merchant'">
                <div class="title-box">
                    <div class="title">
                        <span>购买历史列表</span>
                    </div>
                </div>
                <el-table :data="list" style="width: 100%" class="table">
                    <el-table-column prop="goodsName" label="产品名称">
                        <template slot-scope="{ row }">
                            <span class="name">{{row.goodsName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop label="类型">
                        <template slot-scope="{ row }">
                            <span v-if="row.goodsType == '1'">积分充值</span>
                            <span v-if="row.goodsType == '2'">开通会员</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop label="支付方式">
                        <template slot-scope="{ row }">
                            <span v-if="row.payChannel == 'wxpay'">微信支付</span>
                            <span v-if="row.payChannel == 'alipay'">支付宝支付</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="goodsCount" label="购买数量"></el-table-column>
                    <el-table-column prop="amount" label="购买总金额">
                        <template slot-scope="{ row }">
                            <span>{{row.amount / 100}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="下单时间"></el-table-column>
                </el-table>
                <div class="flex justify-end pt15">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="current"
                        :page-sizes="[10, 20, 30,50,100]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next"
                        :total="total"
                    ></el-pagination>
                </div>
            </div> 
            <dialog-change-password :visible="isVisible" @close="isVisible =false"></dialog-change-password>
        </basic-container>
        <!-- 二级密码模态框 -->
		<el-dialog
			title="二级密码设置"
			:visible.sync="dialogVisible"
			:close-on-click-modal="false"
			width="30%"
			@close="handleClose">
			<el-alert
				v-if="!userInfo.second_password"
				show-icon
				title="首次开启二级密保功能需要初始化二级密码"
				type="warning"
				:closable="false">
			</el-alert>
			<el-form ref="spwdForm" :model="spwdForm" :rules="spwdRules">
				<el-form-item label="输入二级密码" prop="second_password">
					<el-input v-model="spwdForm.second_password" show-password></el-input>
				</el-form-item>
				<el-form-item label="再次输入二级密码" prop="second_passwordAg">
					<el-input v-model="spwdForm.second_passwordAg" show-password></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="updateSecondPassword('spwdForm')">确 定</el-button>
			</span>
		</el-dialog>
    </div>
</template>

<script>
import { handleImg, openWindow } from "@/util/util";
import { mapState, mapGetters } from "vuex";
import store from "@/store";
import { getStore, setStore } from "@/util/store";
import { isValidateNoneMobile,validatePsdReg } from "@/util/validate";
import { editInfo,updateSecondPassword,changeOpenSpwdFlag,getUserInfo } from "@/api/admin/user";
import DialogChangePWD from "./components/DialogChangePWD";
import { getHistoryList } from '@/api/info'

import { orderInfoForTime,getOrderInfo } from "../../../api/pdduser";

import * as echarts from 'echarts';


export default {
    components: {
        DialogChangePassword: DialogChangePWD,
    },
    data() {
        return {
            option:{},
            dataTime:'',
            loading: true,
            // 是否管理员身份
            isAdmin: false,
            isVisible: false,
            merchantInfo: {
                avatar: null
            },
            list: [],
            current: 1,
            total: 0,
            open_spwd_flag: false,
			dialogVisible: false,
			spwdForm: {},
			spwdRules: {
				second_password: [
					{ required: true, message: '请输入二级密码', trigger: ['blur', 'change'] },
					{ validator: validatePsdReg, trigger: ['blur', 'change'] }
				],
				second_passwordAg: [
					{ required: true, message: '请再次输入二级密码', trigger: ['blur', 'change'] },
					{ validator: validatePsdReg, trigger: ['blur', 'change'] }
				]
			}

        }
    },
    computed: {
        ...mapGetters([
            'siteConfig'
        ]),
        ...mapState({
            userInfo: (state) => state.user.userInfo,
            siteConfig: (state) => state.user.siteConfig,
        }),
    },
    mounted() {
		this.getUserInfo();
        if (this.userInfo.identity === 'admin') {
            this.isAdmin = true;
        }
        if (this.userInfo.identity === 'merchant') {
			this.spwdForm.username = this.userInfo.username;
			if (this.userInfo.open_spwd_flag === '1') {
				this.open_spwd_flag = true;
			}
		}
        this.fetchData();
        this.renderECharts()
    },
    watch: {
    dataTime(newValue) {
      if (!newValue) {
        // 日期时间被清除时的操作
        this.handleClear();
      }
    },
  },
    methods: {
        // 折线图
       async renderECharts(newData) {
            const echartsContainer = this.$refs.echartsContainer;
            if(echartsContainer) {
                const myChart = echarts.init(echartsContainer);
                this.option = {
                    xAxis: {
                    type: 'category',
                    data: []
                    },
                    yAxis: {
                    type: 'value'
                    },
                    series: [
                    {
                        data: [],
                        type: 'line'
                    }
                    ]
                };
                const res = await orderInfoForTime()
                console.log(res,'折线图');
                if(newData) {
                    let timeData = []
                    const time = newData.data.data.map(item=>{
                        timeData.push(item.createTime)
                    })
                    let salesCount = []
                    const time2 = newData.data.data.map(item=>{
                        salesCount.push(item.salesCount)
                    })
                    this.option.xAxis.data = timeData
                    this.option.series[0].data = salesCount
                } else {
                    let timeData = []
                    const time = res.data.data.map(item=>{
                    timeData.push(item.createTime)
                    })
                    let salesCount = []
                    const time2 = res.data.data.map(item=>{
                        salesCount.push(item.salesCount)
                    })
                    this.option.xAxis.data = timeData
                    this.option.series[0].data = salesCount
                }
                myChart.setOption(this.option);
            }
        },
        // 筛选
       async screenBtn() {
        if(this.dataTime) {
            const newData = await getOrderInfo({
                startTime:this.dataTime[0],
                endTime:this.dataTime[1]
            })
            this.renderECharts(newData);
        } else {
            const newData = await orderInfoForTime()
            this.renderECharts(newData);
        }
        },
        // 清空日期选择器
        handleClear() {
            this.dataTime = ''
        },
		getUserInfo() {
			getUserInfo().then(res => {
				var userInfo = res.data.data.sysUser;
				// 实时从接口获取数据填入
				this.userInfo.second_password = userInfo.secondPassword;
				this.userInfo.open_spwd_flag = userInfo.openSpwdFlag;
			}).catch(() => {});
		},
        fetchData() {
            this.loading = true;
            this.$store.dispatch('GetMy').then((data) => {
                this.merchantInfo = data;
                this.loading = false;
            });
        },
        handleSizeChange(pageSizes) {
            this.pageSizes = pageSizes;
            this.getHistoryList({ "current": this.current, "size": this.pageSizes })
        },
        handleCurrentChange(page) {
            this.current = page;
            this.getHistoryList({ "current": this.current, "size": this.pageSizes })
        },
        getHistoryList(query) {
            getHistoryList(query).then(data => {
                this.list = data.data.data.records
                this.total = data.data.data.total;
            }).catch(() => {
                // loading();
            });
        },
		// 打开模态框
		openDialog() {
			this.dialogVisible = true;
		},
		// 关闭模态框
		handleClose() {
			// 缓存中的二级密码没有初始值则代表为从未开启
			if (!this.userInfo.second_password) {
				this.open_spwd_flag = false;
			}
		},
		// 修改二级密码
		updateSecondPassword(form) {
			this.$refs[form].validate((valid) => {
				let _this = this;
				if (valid) {
					// 判断是否首次开启（根据userInfo里面是否存在二级密码）
					if (!_this.userInfo.second_password && _this.userInfo.open_spwd_flag == 0) {
						_this.spwdForm.open_spwd_flag = '1';
					}
					updateSecondPassword(_this.spwdForm).then(function(res) {
						_this.userInfo.open_spwd_flag = _this.spwdForm.open_spwd_flag;
						_this.userInfo.second_password = _this.spwdForm.second_password;
						_this.$store.commit("UPDATE_OPEN_SPWD_FLAG", _this.userInfo);
						_this.$message({
							message: res.data.msg,
							type: 'success'
						});
						_this.dialogVisible = false;
						_this.$nextTick(() => {
							_this.$refs[form].resetFields();
						});
					})
				}
			})
		},
		// 切换二级密保标识状态
		changeOpenSpwdFlag(flag) {
			if (flag && this.userInfo.open_spwd_flag == 0 && !this.userInfo.second_password) {
				this.dialogVisible = true;
				return false;
			}
			let _this = this;
			let form = {
				'username': _this.userInfo.username,
				'open_spwd_flag': flag ? '1':'0'
			}
			changeOpenSpwdFlag(form).then(function(res) {
				if (flag) {
					_this.$message({
						message: "已启用二级密保功能",
						type: 'success'
					});
				} else {
					_this.$message({
						message: "已关闭二级密保功能",
						type: 'error'
					});
				}
				_this.$store.commit("UPDATE_OPEN_SPWD_FLAG", form);
			})
		}
    },
    created() {
        this.getHistoryList()
    }
};
</script>
<style lang="scss" scoped>
// @import "@/styles/info.scss";

::v-deep .el-card__body {
    padding: 0;
}
.account-center-container {
    padding: 78px 32px 54px 47px;
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid #d9d9d9;
    .lbox {
        float: left;
        // min-width: 437px;
        .img-box {
            padding: 99px 99px 39px 67px;
            text-align: center;
            img {
                width: 203px;
                height: 78px;
            }
        }
        .info {
            .nickname {
                font-size: 20px;
                font-weight: 500;
                color: rgba(0, 0, 0, 0.65);
                line-height: 37px;
                .el-icon-question:before {
                    color: rgba(0, 0, 0, 0.2);
                    font-size: 18px;
                }
            }
            .avatar {
                width: 106px;
                height: 106px;
            }
            .expiry {
                .text {
                    font-size: 16px;
                    font-weight: 500;
                    color: rgba(27, 23, 23, 0.6);
                    line-height: 29px;
                }
                .time {
                    margin-left: 5px;
                    font-size: 16px;
                    font-weight: 500;
                    color: #dfa019;
                    line-height: 43px;
                }
            }
        }
    }
    .rbox {
        float: left;
        .grid-content {
            display: grid;
            grid-template-columns: repeat(3, minmax(327px, 1fr));
            gap: 23px;
            .item {
                // width: 327px;
                height: 230px;
                float: left;
                background: #ffffff;
                border-radius: 10px;
                border: 1px solid #e9e9e9;
                color: rgba(0, 0, 0, 0.65);
                .ml16 {
                    font-weight: 500;
                }
                .recharge {
                    margin-left: 16px;
                    width: 57px;
                    height: 25px;
                    font-weight: 500;
                    color: #ffffff;
                    background: $themeColor;
                    line-height: 7px;
                }
                .icon-wrap {
                    i {
                        font-size: 24px;
                        color: #ffbf00;
                    }
                }
                .text {
                    text-align: center;
                    font-size: 20px;
                    font-weight: 500;
                    line-height: 37px;
                    &::v-deep .el-button:active {
                        border-color: #ffbf00;
                    }
                }
                .button {
                    margin-top: 33px;
                    width: 100%;
                    height: 53px;
                    color: rgba(0, 0, 0, 0.65);
                    border-radius: 0px 0px 3px 3px;
                    background-color: #fff;
                    border: 1px solid #e9e9e9;
                    font-size: 16px;
                    font-weight: 500;
                    line-height: 30px;
                }
                .button:focus,
                .button:hover {
                    opacity: 0.8;
                    color: black;
                    border-color: rgba(0, 0, 0, 0.5);
                }
            }
        }
    }
}
.block {
    height: 23px;
    background: #f0f2f5;
}
.table-wrap {
    margin-bottom: 20px;
    .table-box {
        padding-bottom: 30px;
    }
    .title-box {
        line-height: 56px;
        border-bottom: 1px solid #dedede;
        .title {
            position: relative;
            padding-left: 30px;
            font-size: 20px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.65);
            &::after {
                content: "";
                position: absolute;
                width: 5px;
                height: 13px;
                background: #3b7bff;
                border-radius: 35%;
                top: 20px;
                left: 20px;
            }
        }
    }

    .name {
        color: $themeColor;
        font-weight: 500;
    }

    .table {
        padding: 5px 20px 0 20px;
        margin-top: 15px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.65);
    }

    & ::v-deep .el-table thead {
        font-size: 18px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
    }

    & ::v-deep .el-table tr {
        background-color: #fff;
    }
    & ::v-deep .el-table__row {
        font-size: 16px;
        font-weight: 500;
    }
    & ::v-deep .el-table th.el-table__cell > .cell {
        padding: 12px 10px;
    }

    & ::v-deep .el-table td,
    .el-table th {
        padding: 12px 0;
        min-width: 0;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
        text-align: left;
    }
}
</style>