<template>
    <div class='private-page'>
        <basic-container>
            <div class="alert">
                <i class="el-icon-warning" />
                <span>可添加个人账号无上限，若账号离线需重新登录，使用个人号平台不承担账号售后问题，Token号掉线将无法重新上线，强烈建议控制好每个号的下单数量！</span>
            </div>
            <div class="tabs">
                <div :class="['item', activeName === 'first' && 'active']" @click="activeName = 'first'">登录采购账号</div>
                <div :class="['item', activeName === 'third' && 'active']" @click="activeName = 'third'">个人账号设置</div>
            </div>
                <div class="list" v-show="activeName === 'first'">
                    <div class="form">
                        <el-form inline :model="formData" ref="form" label-width="72px" style="display: flex">
                            <el-form-item label="采购账号" prop="mobile">
                                <el-input type="text" placeholder="请输入采购账号" v-model="formData.mobile"></el-input>
                            </el-form-item>
                            <el-form-item label="账号状态" prop="status">
                                <el-select
                                    @change="initGetList"
                                    v-model="formData.status"
                                    placeholder="请选择采购账号状态"
                                    style="width: 160px"
                                    clearable
                                >
                                    <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="登录时间" prop="createTimeArr">
                                <el-date-picker
                                    v-model="formData.createTimeArr"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions"
                                    style="width: 366px;"
                                    value-format="yyyy-MM-dd"
                                ></el-date-picker>
                            </el-form-item>
                            <el-form-item style="margin-left: auto">
                                <el-button style="width: 86px;" class="default-gray" icon="el-icon-delete" @click.stop="resetForm('form')">
                                    <span>清空</span>
                                </el-button>
                                <el-button type="primary" style="width: 86px;" icon="el-icon-search"  @click.stop="loadList">
                                    <span>搜索</span>
                                </el-button>
                                
                            </el-form-item>
                            <!-- <div class="account-add mt10" style="float: right;">
                                <span class="mr10">账号数量：{{formData.total || 0}}</span>
                            </div> -->
                           
                        </el-form>
                    </div>

                    <div class="table table-card">
                        <div class="title">
                            <span>采购申请列表</span>
                            <div class="event-btn">
                                <el-dropdown class="ml10" @command="onUserBatchHandle">
                                    <el-button size="small" style="width: 106px" class="default-gray">
                                        <span style="margin-right: 12px;">批量操作</span>
                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="open">批量启动</el-dropdown-item>
                                        <el-dropdown-item command="close">批量禁用</el-dropdown-item>
                                        <el-dropdown-item command="setting">批量设置下单量</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                                <el-button type="primary" @click.stop="onAccountAdd" class="default-gray" style="width: 106px; margin-left: 10px;">
                                    <span>添加账号</span>
                                </el-button>
                            </div>
                        </div>
                    
                        <el-table
                            :data="tableData"
                            size="medium"
                            v-loading="tableloading"
                            @selection-change="handleUserSelectChange"
                            style="width: 100%">
                            <el-table-column
                                type="selection"
                                align="center"
                                width="55">
                            </el-table-column>
                            <el-table-column
                                prop="mobile"
                                label="采购账号"
                                align="center"
                                min-width="120">
                            </el-table-column>
                            <el-table-column
                                prop="status"
                                min-width="100"
                                align="center">
                                <template slot="header">
                                    <span>
                                        状态
                                        <el-tooltip class="item" effect="dark" placement="bottom">
                                            <div slot="content">在线为正常可进行拍单的账号<br/>离线为当前帐号已经掉线或异常，需重新上线</div>
                                            <i class="el-icon-question font16"></i>
                                        </el-tooltip>
                                    </span>
                                </template>
                                <template slot-scope="{row}">
                                    <span>{{statusOpt[row.status]}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="totalUseCount"
                                min-width="120"
                                sortable
                                align="center"
                                label="累计下单量">
                            </el-table-column>
                            <el-table-column
                                prop="todayUseCount"
                                min-width="120"
                                sortable
                                align="center"
                                label="今日下单量">
                            </el-table-column>
                            <el-table-column
                                prop="maxCount"
                                min-width="140"
                                align="center">
                                <template slot="header">
                                    <span>
                                        账号最大下单量
                                        <el-tooltip class="item" effect="dark" placement="bottom">
                                            <div slot="content">代表帐号总共最多下单量，可根据设定下单数量进行调整</div>
                                            <i class="el-icon-question font16"></i>
                                        </el-tooltip>
                                    </span>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column
                                prop="pddAuditCount"
                                min-width="120"
                                align="center"
                                label="今日风控订单">
                            </el-table-column> -->
                            <el-table-column
                                prop="isAbnormal"
                                min-width="100"
                                align="center"
                                label="是否可用">
                                <template slot-scope="{row}">
                                    <el-switch
                                        v-model="row.disable"
                                        @change="onDisableChange($event, row)"
                                        :active-value="0"
                                        :inactive-value="1"
                                        active-color="rgb(70, 180, 109)">
                                    </el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="loginTime"
                                min-width="150"
                                sortable
                                align="center"
                                label="最近登录时间">
                            </el-table-column>
                            <el-table-column
                                fixed="right"
                                label="操作"
                                align="center"
                                width="180">
                                <template slot-scope="{row, $index}">
                                    <el-button type="text" @click="onItemLogin(row)">登录</el-button>
                                    <el-button type="text" :loading="row.getLoading" :disabled="row.getLoading" @click="onGetAccountStatus(row, $index)">检测状态</el-button>
                                    <el-button type="text" @click="onItemDel(row)">删除</el-button>
                                </template>
                            </el-table-column>
                            <template slot="empty">
                                <div class="empty my30">
                                    <el-empty
                                        description="暂时没有找到任何记录"
                                        :image-size="100"
                                        v-if="!tableData.length"
                                    ></el-empty>
                                </div>
                            </template>
                        </el-table>
                        <div class="pagination pb30 mt40 flex flex-row-reverse" v-if="formData.total > 0">
                            <el-pagination
                                background
                                layout="total, sizes, prev, pager, next, jumper"
                                :current-page.sync="formData.current"
                                :page-size="formData.size"
                                :page-sizes="[50, 100, 200]"
                                :total="formData.total"
                                @current-change="onCurrentChange"
                                @size-change="onSizeChange"
                            ></el-pagination>
                        </div>
                    </div>
                </div>
                <el-tab-pane label="新增Token号" name="second" v-if="1==2">
                    <div class="token-list" >
                        <el-form inline :model="tokenFormData" ref="tokenform" class="ddk-form">
                            <el-form-item label="采购账号" prop="mobile">
                                <el-input type="text" placeholder="请输入采购账号" v-model="tokenFormData.mobile"></el-input>
                            </el-form-item>
                            <el-form-item label="账号状态" prop="status">
                                <el-select
                                    @change="initGetList"
                                    v-model="tokenFormData.status"
                                    placeholder="请选择采购账号状态"
                                    style="width: 160px"
                                    clearable
                                >
                                    <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="创建时间" prop="createTimeArr">
                                <el-date-picker
                                    v-model="tokenFormData.createTimeArr"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions"
                                    style="width: 230px;"
                                    value-format="yyyy-MM-dd"
                                ></el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click.stop="loadTokenList">
                                    <span>搜索</span>
                                </el-button>
                                <el-button @click.stop="resetForm('tokenform')">
                                    <span>清空</span>
                                </el-button>
                                <el-tooltip class="item" effect="dark" content="建议账号每日下单数量不要太高，防止支付频繁导致触发风控" placement="bottom">
                                    <el-button type="primary" @click.stop="onOrderOption">
                                        <span>设定下单数量</span>
                                    </el-button>
                                </el-tooltip>
                            </el-form-item>
                            <div class="account-add mt10" style="float: right;">
                                <span class="mr10">账号数量：{{tokenFormData.total || 0}}</span>
                            </div>
                            <div class="event-btn">
                                <el-button type="primary" @click.stop="onTokenAdd">
                                    <span>添加Token号</span>
                                </el-button>
                                <el-dropdown class="ml10" @command="onBatchHandle">
                                    <el-button size="small">
                                        <span>批量操作</span>
                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="open">批量启动</el-dropdown-item>
                                        <el-dropdown-item command="close">批量禁用</el-dropdown-item>
                                        <el-dropdown-item command="setting">批量设置下单量</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </el-form>
                        <el-table
                            :data="tableTokenData"
                            size="medium"
                            v-loading="tableloading"
                            @selection-change="handleSelectionChange"
                            style="width: 100%">
                            <el-table-column
                                type="selection"
                                align="center"
                                width="55">
                            </el-table-column>
                            <el-table-column
                                prop="mobile"
                                label="账号"
                                align="center"
                                min-width="120">
                                <template slot-scope="{row}">
                                    <span>{{row.mobile || row.uid}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="token"
                                label="Token"
                                align="center"
                                min-width="200">
                            </el-table-column>
                            <el-table-column
                                prop="status"
                                min-width="100"
                                align="center">
                                <template slot="header">
                                    <span>
                                        状态
                                        <el-tooltip class="item" effect="dark" placement="bottom">
                                            <div slot="content">在线为正常可进行拍单的账号<br/>离线为当前帐号已经掉线或异常，需重新上线</div>
                                            <i class="el-icon-question font16"></i>
                                        </el-tooltip>
                                    </span>
                                </template>
                                <template slot-scope="{row}">
                                    <span>{{statusOpt[row.status]}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="totalUseCount"
                                min-width="120"
                                sortable
                                align="center"
                                label="累计下单量">
                            </el-table-column>
                            <el-table-column
                                prop="todayUseCount"
                                min-width="120"
                                sortable
                                align="center"
                                label="今日下单量">
                            </el-table-column>
                            <el-table-column
                                prop="maxCount"
                                min-width="140"
                                align="center">
                                <template slot="header">
                                    <span>
                                        账号最大下单量
                                        <el-tooltip class="item" effect="dark" placement="bottom">
                                            <div slot="content">代表帐号总共最多下单量，可根据设定下单数量进行调整</div>
                                            <i class="el-icon-question font16"></i>
                                        </el-tooltip>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="todayMaxCount"
                                min-width="120"
                                align="center"
                                label="今日最大下单量">
                            </el-table-column>
                            <!-- <el-table-column
                                prop="todayUseCount"
                                min-width="100"
                                align="center"
                                label="今日风控订单">
                            </el-table-column> -->
                            <el-table-column
                                prop="isAbnormal"
                                min-width="100"
                                align="center"
                                label="是否可用">
                                <template slot-scope="{row}">
                                    <el-switch
                                        v-model="row.disable"
                                        @change="onDisableChange($event, row)"
                                        :active-value="0"
                                        :inactive-value="1"
                                        active-color="rgb(70, 180, 109)">
                                    </el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="created"
                                min-width="150"
                                sortable
                                align="center"
                                label="首次创建时间">
                            </el-table-column>
                            <el-table-column
                                fixed="right"
                                label="操作"
                                align="center"
                                width="180">
                                <template slot-scope="{row, $index}">
                                    <el-button type="text" :loading="row.getLoading" :disabled="row.getLoading" @click="onGetAccountStatus(row, $index)">检测状态</el-button>
                                    <el-button type="text" @click="onItemDel(row)">删除</el-button>
                                </template>
                            </el-table-column>
                            <template slot="empty">
                                <div class="empty my30">
                                    <el-empty
                                        description="暂时没有找到任何记录"
                                        :image-size="100"
                                        v-if="!tableTokenData.length"
                                    ></el-empty>
                                </div>
                            </template>
                        </el-table>
                        <div class="pagination pb30 mt30 flex flex-row-reverse" v-if="tokenFormData.total > 0">
                            <el-pagination
                                background
                                layout="total, sizes, prev, pager, next, jumper"
                                :current-page.sync="tokenFormData.current"
                                :page-size="tokenFormData.size"
                                :page-sizes="[50, 100, 200]"
                                :total="tokenFormData.total"
                                @current-change="onCurrentChange"
                                @size-change="onSizeChange"
                            ></el-pagination>
                        </div>
                    </div>
                </el-tab-pane>
                <div v-show="activeName === 'third'" class="account-setting">
                    <div class="account-setting-main">
                        <el-form class="form" ref="form" :model="setttingForm" label-width="303px" v-loading="configLoading">
                            <!-- <el-form-item label="设定风控订单数量：">
                                <el-radio-group v-model="setttingForm.isAudit">
                                    <el-radio :label="0">开启</el-radio>
                                    <el-radio :label="1">关闭</el-radio>
                                </el-radio-group>
                                <div class="mt20 col-6">
                                    风控订单数量达到
                                    <el-input v-model.number="setttingForm.auditCount" style="width: 180px;" class="mx10"></el-input>
                                    状态为禁用立即关闭可用状态
                                </div>
                            </el-form-item> -->
                            <el-form-item label="每日下单数量（初始）：">
                                <el-input v-model.number="setttingForm.todayMaxCount" style="width: 261px;"></el-input>
                                <p class="tip">请输入每日下单数量，例如默认是5单账号今日下单量就不超过5单</p>
                            </el-form-item>
                            <el-form-item label="账号最大下单数量（初始）：" class="mt50">
                                <el-input v-model.number="setttingForm.maxCount" style="width: 261px;"></el-input>
                                <p class="tip">请输入最大下单量例如默认是5单后，状态为禁用立即关闭可用状态</p>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" style="width: 106px" @click="onSaveSetting" :loading="settingLoading">保存设置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            <!-- </el-tabs> -->
        </basic-container>
        <DialogOption ref="optionDialog" @success="initGetList" />
        <DialogLogin ref="loginDialog" @success="loadList"/>
        <DialogFilter ref="filterDialog" @success="initGetList"/>
        <DialogTokenSetting ref="dialogTokenSetting" @success="initGetList"/>
    </div>
</template>

<script>

import { fetchList, deletePddAccount, switchPacStatus, getAccountStatus, enableBatch, blockBatch, getUserAccountConfig, setUserAccountConfig } from '@/api/dfh/privateAccount'
import DialogOption from './modules/DialogOption'
import DialogLogin from './modules/DialogLogin'
import DialogFilter from './modules/DialogFilter'
import DialogTokenSetting from './modules/DialogTokenSetting'
export default {
    components: {
        DialogOption,
        DialogLogin,
        DialogFilter,
        DialogTokenSetting
    },
    watch: {
        activeName (val, oldVal) {
            if (val === 'third') {
                // 切换到个人号设置是每次都获取下最新配置
                this.onLoadSetting()
            }
        }
    },
    data() {
        return {
            tableData: [],
            multiple: [],
            userMultiple: [],
            formData: {
                type: 1,
                size: 50,
                current: 1,
                total: 0,
                status: undefined,
                mobile: undefined,
                createTimeArr: []
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
            },
            tokenFormData: {
                type: 2,
                size: 50,
                current: 1,
                total: 0,
                status: undefined,
                mobile: undefined,
                createTimeArr: []
            },
            tableTokenData: [],
            statusList: [
                {label: '全部', value: ''},
                {label: '在线', value: 0},
                {label: '离线', value: 1},
                {label: '禁用', value: 2},
                {label: '地址异常', value: 8},
            ],
            statusOpt: {
                0: '在线',
                1: '离线',
                2: '禁用',
                8: '地址异常'
            },
            tableloading: false,
            activeName: 'first',
            setttingForm: {
                isAudit: 1,
                auditCount: 0,
                maxCount: 1000,
                todayMaxCount: 100
            },
            configLoading: false,
            settingLoading: false
        }
    },
    computed: {
    },
    methods: {
        initGetList () {
            if (this.activeName === 'second') {
                this.tokenFormData.current = 1
                this.loadTokenList()
            } else {
                this.formData.current = 1
                this.loadList()
            }
        },
        async onGetAccountStatus (row, index) {
            console.log('index', index)
            const { activeName } = this
            this.$set(activeName === 'second' ? this.tableTokenData : this.tableData, index, {...row, getLoading: true})
            try {
                const { data } = await getAccountStatus({ids: row.id})
                this.$set(activeName === 'second' ? this.tableTokenData : this.tableData, index, {...row, getLoading: false})
                if (activeName === 'second') {
                    this.loadTokenList()
                } else {
                    this.loadList()
                }
            } catch (err) {
                this.$set(activeName === 'second' ? this.tableTokenData : this.tableData, index, {...row, getLoading: false})
            }
            // this.$message.success('正在检测中，稍后刷新列表查看结果')
        },
        // 修改停用状态
        async onDisableChange (val, item) {
            const params = {
                disable: val,
                id: item.id
            }
            const { data } = await switchPacStatus(params)
            if (this.activeName === 'second') {
                // token模式
                this.loadTokenList()
            } else {
                this.loadList()
            }
        },
        // 添加个人号
        onAccountAdd () {
            this.$refs.loginDialog.showModel()
        },
        // 新增token号
        onTokenAdd () {
            this.$refs.filterDialog.showModel()
        },
        // 下单设置
        onOrderOption () {
            // if (!this.multiple.length) return this.$message.warning('请至少一个个人号进行操作')
            // const ids = this.multiple.map(item => item.id)
            this.$refs.optionDialog.showModel()
        },
        onItemDel (row) {
            const { activeName } = this
            this.$confirm(`删除${activeName === 'second' ? 'token号' : '个人号'}后将无法继续使用该号进行拍单!`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data } = await deletePddAccount({id: row.id})
                this.$message.success('删除成功')
                if (activeName === 'second') {
                    this.loadTokenList()
                } else {
                    this.loadList()
                }
            }).catch(() => {   
            });
        },
        onItemLogin (row) {
            this.$refs.loginDialog.showModel(row.mobile)
        },
        // 个人号列表
        async loadList () {
            const params = {...this.formData}
            if (params.createTimeArr && params.createTimeArr.length) {
                params['startTime'] = `${params.createTimeArr[0]} 00:00:00`
                params['endTime'] = `${params.createTimeArr[1]} 23:59:59`
            }
            this.tableloading = true
            const { data } = await fetchList(params)
            this.tableloading = false
            console.log('data', data)
            this.tableData = data.data.records
            this.formData.total = data.data.total
        },
        // token号列表
        async loadTokenList () {
            const params = {...this.tokenFormData}
            if (params.createTimeArr && params.createTimeArr.length) {
                params['startTime'] = `${params.createTimeArr[0]} 00:00:00`
                params['endTime'] = `${params.createTimeArr[1]} 23:59:59`
            }
            this.tableloading = true
            const { data } = await fetchList(params)
            this.tableloading = false
            console.log('data', data)
            this.tableTokenData = data.data.records
            this.tokenFormData.total = data.data.total
        },
        // 个人号批量操作
        onUserBatchHandle (command) {
            if (!this.userMultiple.length) return this.$message.warning('请至少一个个人号进行操作')
            const uids = this.userMultiple.map(item => item.uid)
            switch (command) {
                case 'open':
                    // 批量启用
                    this.$confirm('是否确认启用当前选中的个人号？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        const { data } = await enableBatch({uids: uids})
                        console.log('data', data)
                        if (data.code == 0) {
                            this.$message.success('操作成功')
                            this.loadTokenList()
                        }
                    }).catch(() => {   
                    })
                break
                case 'close':
                    this.$confirm('是否确认禁用当前选中的个人号？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        const { data } = await blockBatch({uids: uids})
                        console.log('data', data)
                        if (data.code == 0) {
                            this.$message.success('操作成功')
                            this.loadTokenList()
                        }
                    }).catch(() => {   
                    })
                break
                case 'setting':
                    this.$refs.dialogTokenSetting.showModel(uids, 'user')
                break
            }
        },
        // token批量操作
        onBatchHandle (command) {
            if (!this.multiple.length) return this.$message.warning('请至少一个token号进行操作')
            const uids = this.multiple.map(item => item.uid)
            switch (command) {
                case 'open':
                    // 批量启用
                    this.$confirm('是否确认启用当前选中的token号？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        const { data } = await enableBatch({uids: uids})
                        console.log('data', data)
                        if (data.code == 0) {
                            this.$message.success('操作成功')
                            this.loadTokenList()
                        }
                    }).catch(() => {   
                    })
                break
                case 'close':
                    this.$confirm('是否确认禁用当前选中的token号？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        const { data } = await blockBatch({uids: uids})
                        console.log('data', data)
                        if (data.code == 0) {
                            this.$message.success('操作成功')
                            this.loadTokenList()
                        }
                    }).catch(() => {   
                    })
                break
                case 'setting':
                    this.$refs.dialogTokenSetting.showModel(uids)
                break
            }
        },
        // 个人号表格选择
        handleUserSelectChange (val) {
            this.userMultiple = val
        },
        // 表格选择
        handleSelectionChange(val) {
            this.multiple = val
        },
        /**
         * current 改变时会触发
         */
        onCurrentChange(page) {
            if (this.activeName === 'second') {
                // token模式
                this.tokenFormData.current = page;
                this.loadTokenList();
            } else {
                this.formData.current = page;
                this.loadList();
            }
        },
        /**
         * pageSize 改变时会触发
         */
        onSizeChange(size) {
            if (this.activeName === 'second') {
                // token模式
                this.tokenFormData.size = size;
                this.loadTokenList();
            } else {
                this.formData.size = size;
                this.loadList();
            }
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
            this.initGetList()
        },
        async onLoadSetting () {
            this.configLoading = true
            const { data } = await getUserAccountConfig({})
            this.configLoading = false
            if (data.data) {
                this.setttingForm = data.data
            } else {
                this.setttingForm = {
                    isAudit: 1,
                    auditCount: 0,
                    maxCount: 1000,
                    todayMaxCount: 100
                }
            }
        },
        async onSaveSetting () {
            this.settingLoading = true
            try {
                const { data } = await setUserAccountConfig(this.setttingForm)
                if (data.code == 0) {
                    this.$message.success('设置成功')
                }
                this.settingLoading = false
            } catch (err) {
                console.log('error', err)
                this.settingLoading = false
            }
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.loadList()
        this.loadTokenList()
    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>

<style lang="scss" scoped>
.private-page {
    .alert {
        width: 100%;
        height: 41px;
        background: #EDF0FF;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid  $themeColor;
        display: flex;
        align-items: center;
        i {
           font-size: 16px;
           color: $themeColor;
           transform: rotate(180deg);
           margin-left: 16px;
           margin-right: 12px;
        }
        span {
            font-size: 14px;
            color: rgba(0,0,0,0.85);
        }
    }
    //标签
    .tabs {
        display: flex;
        height: 32px;
        margin-top: 22px;
        .item {
            width: 120px;
            height: 30px;
            display: flex;
            align-items:center;
            justify-content: center;
            font-size: 14px;
            color: #31373D;
            border: 1px solid #E6E8EB;
            transition: all .15s;
            cursor: pointer;
            
            &.active {
                border: 1px solid $themeColor;
                color: #fff;
                background: $themeColor;
            }

            &:first-child {
                border-radius: 4px 0px 0px 4px;
                border-right: none;
            }
            &:last-child {
                border-radius: 0px 4px 4px 0px;
                border-left: none;
            }
            
        }

    }
    //列表区域
    .list {
        margin-top: 16px;
        .form {
            padding: 16px 16px 6px;
            background: #fff;
            border-radius: 12px;
        }

        .table-card {
            margin-top: 16px;
            padding: 0px 16px 50px ;
            border-radius: 12px;
            background: #fff;
           
            .title {
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
                padding-top: 18px;
                background: #fff;
                font-size: 20px;
                font-family: PingFang SC, PingFang SC;
                font-weight: bold;
                color: #000000;
                line-height: 20px;
                position: relative;
                text-indent: 11px;
                display: flex;
                justify-content: space-between;
                
                &::before {
                    content: '';
                    display: block;
                    position: absolute;
                    width: 2px;
                    height: 18px;
                    top: 19px;
                    background: $themeColor; ; 
                }
                
            }
            ::v-deep .el-table {
                margin-top: 20px;
                .el-table__header {
                    tr {
                        th {
                            background: #F8F9FB;
                            color: #394D5F;
                        }
                    }
                }
            }
        }
    }

    .account-setting {
        overflow: hidden;
        margin-top: 16px;
        background: #FFFFFF;
        border-radius: 12px 12px 12px 12px;
        &-main {
            width: 60%;
            margin: 105px auto 190px;
            border-radius: 12px 12px 12px 12px;
            border: 1px solid #2F51FF;
            padding-bottom: 60px;
            .form{
                ::v-deep .el-form-item {
                    margin-bottom: 0px;
                    margin-top: 70px;
                     .el-input__inner {
                        background: #EDF0FF;
                        border: 1px solid #BCC7FF;
                    }
                    .tip {
                        font-size: 12px;
                        line-height: 12px;
                        color: #EB5E12 ;
                        margin-top: 12px;
                    }
                }
            }
        }
    }
   
}
</style>
