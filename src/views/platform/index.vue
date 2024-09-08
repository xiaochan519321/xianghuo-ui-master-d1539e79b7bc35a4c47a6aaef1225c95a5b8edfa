<template>
    <div class='private-page'>
        <basic-container>
            <div class="tabs">
                <div :class="['item', activeName === 'first' && 'active']" @click="activeName = 'first'">个人号管理</div>
                <div :class="['item', activeName === 'third' && 'active']" @click="activeName = 'third'">个人号设置</div>
            </div>
            <div class="list" v-show="activeName === 'first'">
                <div class="form">
                    <el-form inline :model="formData" ref="form" label-width="72px" style="display: flex">
                        <el-form-item label="手机号">
                            <el-input type="text" placeholder="请输入手机号" v-model="formData.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="账号状态">
                            <el-select
                                v-model="formData.sts"
                                placeholder="请选择状态"
                                style="width: 160px"
                                clearable
                            >
                                <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item style="margin-left: auto">
                            <el-button style="width: 86px;" class="default-gray" icon="el-icon-delete" @click.stop="resetForm">
                                <span>清空</span>
                            </el-button>
                            <el-button type="primary" style="width: 86px;" icon="el-icon-search"  @click.stop="getSearch">
                                <span>搜索</span>
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="table table-card">
                    <div class="title">
                        <span>账号列表</span>
                        <div class="event-btn">
                            <el-button type="primary" @click.stop="onAccountAdd" class="default-gray" style="width: 106px; margin-left: 10px;">
                                <span>添加账号</span>
                            </el-button>
                        </div>
                    </div>
                    <el-table
                        :data="tableData"
                        size="medium"
                        v-loading="tableloading"
                        style="width: 100%">
                        <el-table-column
                            prop="personalId"
                            label="编号"
                            align="center"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="userId"
                            label="用户编号"
                            align="center"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            prop="phone"
                            label="手机号"
                            align="center"
                            width="120">
                        </el-table-column>
                        <el-table-column label="平台类型" width="100" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.platformId==1?"拼多多":"" }}
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" min-width="100" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.sts==1?"正常":scope.row.sts==2?"掉线":"" }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="nowUseCount"
                            min-width="120"
                            align="center"
                            label="当天使用次数">
                        </el-table-column>
                        <el-table-column
                            prop="totalUseCount"
                            min-width="120"
                            align="center"
                            label="总使用次数">
                        </el-table-column>
                        <el-table-column
                            prop="nowMaxCount"
                            min-width="150"
                            align="center"
                            label="当天最大使用次数">
                        </el-table-column>
                        <el-table-column
                            prop="totalMaxCount"
                            min-width="120"
                            align="center"
                            label="最大使用次数">
                        </el-table-column>
                        <el-table-column label="创建时间" width="180">
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
                        <el-table-column label="登录时间" width="180">
                            <template slot-scope="scope">
                                <span style="float:left">
                                    {{ scope.row.loginTime.substr(0, 4) + '-'
                                    + scope.row.loginTime.substr(4, 2) + '-'
                                    + scope.row.loginTime.substr(6, 2)}}
                                </span>
                                <span style="float:left;margin-left:5px">
                                    {{ scope.row.loginTime.substr(8, 2) + ':'
                                    +scope.row.loginTime.substr(10, 2) + ':'
                                    +scope.row.loginTime.substr(12, 2)
                                    }}
                                </span>
                            </template> 
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作"
                            align="center"
                            width="180">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="onItemLogin(row)" v-if="row.sts==2">登录</el-button>
                                <el-button type="text" @click="onItemEdit(row)" v-if="row.sts==1">下线</el-button>
                                <el-button type="text" @click="onItemDel(row)">删除</el-button>
                                <el-button type="text" @click="onItemSet(row)">设置次数</el-button>
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
                            :total="formData.total"
                            @current-change="onCurrentChange"
                            @size-change="onSizeChange"
                        ></el-pagination>
                    </div>
                </div>
            </div>
                
            <div v-show="activeName === 'third'" class="account-setting">
                <div class="account-setting-main">
                    <el-form class="form" ref="form" :model="setForm" label-width="303px" v-loading="configLoading">
                        <el-form-item label="当天最大使用次数（初始）：">
                            <el-input v-model.number="setForm.nowMaxCount" style="width: 260px;"></el-input>
                            <p class="tip">请输入当天最大使用次数</p>
                        </el-form-item>
                        <el-form-item label="最大使用次数（初始）：" class="mt50">
                            <el-input v-model.number="setForm.totalMaxCount" style="width: 260px;"></el-input>
                            <p class="tip">请输入最大使用次数</p>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" style="width: 106px" @click="onSaveSetting" :loading="settingLoading">保存设置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </basic-container>
        <DialogLogin ref="loginDialog" @success="loadList"/>
        <el-dialog title="设置次数" :visible.sync="dialogVisible" width="430px">
            <el-form :model="form" ref="form">
                <el-form-item label="当天最大使用次数" label-width="125px">
                    <el-input v-model="form.nowMaxCount"></el-input>
                </el-form-item>
                <el-form-item label="最大使用次数" label-width="125px">
                    <el-input v-model="form.totalMaxCount"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setCount()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import { fetchList, platformExit,updmax, updallmax, platformDel } from '@/api/platform'
import DialogLogin from './modules/DialogLogin'
export default {
    components: {
        DialogLogin,
    },
    watch: {},
    data() {
        return {
            tableData: [],
            formData: {
                size: 20,
                current: 1,
                total: 0,
                sts: -1,
                phone: ''
            },
            statusList: [
                {label: '全部', value: -1},
                {label: '正常', value: 1},
                {label: '掉线', value: 2}
            ],
            tableloading: false,
            activeName: 'first',
            dialogVisible: false,
            form: {
                phone: '',
                nowMaxCount: 500,
                totalMaxCount: 3000
            },
            setForm: {
                nowMaxCount: '',
                totalMaxCount: ''
            },
            configLoading: false,
            settingLoading: false
        }
    },
    computed: {},
    methods: {
        // 添加个人号
        onAccountAdd() {
            this.$refs.loginDialog.showModel()
        },
        //登录
        onItemLogin(row) {
            this.$refs.loginDialog.showModel(row.phone)
        },
        //删除
        onItemDel(row) {
            this.$confirm(`确定删除该账号吗`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data } = await platformDel({phone: row.phone,userId:row.userId})
                this.$message.success('删除成功')
                this.loadList()
            }).catch(() => {});
        },
        //下线
        onItemEdit(row) {
            this.$confirm(`确定下线该账号吗`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data } = await platformExit({phone: row.phone})
                this.$message.success('下线成功')
                this.loadList()
            }).catch(() => {});
        },
        //搜索
        getSearch() {
            this.formData.current = 1
            this.loadList()
        },
        // 个人号列表
        async loadList() {
            try {
                const params = {...this.formData}
                this.tableloading = true
                const { data } = await fetchList(params)
                this.tableData = data.data.records
                this.formData.total = data.data.total
                this.tableloading = false
                console.log('data', data)
            } catch (err) {
                console.log('error', err)
                this.tableloading = false
            }
        },
        //设置次数
        onItemSet(row) {
            this.dialogVisible = true;
            this.form = {
                phone: row.phone,
                nowMaxCount: row.nowMaxCount,
                totalMaxCount: row.totalMaxCount,
            }
        },
        async setCount() {
            try {
                if(this.form.nowMaxCount>this.form.totalMaxCount){
                    this.$message.error('当天最大使用次数不能大于最大使用次数！')
                } else {
                    const { data } = await updmax(this.form)
                    if (data.code == 0) {
                        this.$message.success('设置成功')
                    }
                    this.loadList()
                    this.dialogVisible = false
                }
            } catch (err) {
                console.log('error', err)
            }
        },
        // current 改变时会触发
        onCurrentChange(page) {
            this.formData.current = page
            this.loadList()
        },
        // pageSize 改变时会触发
        onSizeChange(size) {
            this.formData.size = size
            this.loadList()
        },
        resetForm() {
            this.formData.phone = ''
            this.formData.sts = -1
            this.loadList()
        },
        async onSaveSetting () {
            this.settingLoading = true
            try {
                if(this.setForm.nowMaxCount>this.setForm.totalMaxCount){
                    this.$message.error('当天最大使用次数不能大于最大使用次数！')
                } else {
                    const { data } = await updallmax(this.setForm)
                    if (data.code == 0) {
                        this.$message.success('设置成功')
                    }
                    this.loadList()
                    this.activeName = 'first'
                    this.settingLoading = false
                }
            } catch (err) {
                console.log('error', err)
                this.settingLoading = false
            }
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.loadList()
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
