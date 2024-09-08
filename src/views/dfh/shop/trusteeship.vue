<template>
    <div class='shop-list'>
        <el-card>
            <el-form :model="searchForm" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="店铺名称">
                            <el-input v-model="searchForm.shopName" size="small" placeholder="请输入店铺名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class="search-btn">
                        <el-button type="primary" size="small" @click="loadShopList(1)">查询</el-button>
                    </el-col>
                </el-row>
            </el-form>
            <el-table
                v-loading="tableLoading"
                :data="tableData"
                height="77vh"
                style="width: 100%">
                <el-table-column
                    prop="shopName"
                    label="店铺名称">
                </el-table-column>
                <el-table-column
                    prop="platformId"
                    label="所属平台">
                    <template slot-scope="{row}">
                        <span>{{shopType[row.platformId]}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="cookiesStatus">
                    <template slot="header">
                        <span>抖店状态</span>
                        <el-tooltip class="item" placement="bottom" effect="light">
                            <div slot="content">
                                <div style="margin-bottom: 3px;">如果状态出现异常的情况，可以去抖店后台</div>
                                <div>订单列表点击身份验证或重登账号</div>
                            </div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </template>
                    <template slot-scope="{row}">
                        <el-tag size="mini" type="info" v-if="row.cookiesStatus == 0 || row.cookiesStatus == null">未登录</el-tag>
                        <el-tag size="mini" type="success" v-else-if="row.cookiesStatus == 1">在线</el-tag>
                        <el-tag size="mini" type="warning" v-else-if="row.cookiesStatus == 2">会话过期</el-tag>
                        <el-tag size="mini" type="warning" v-else-if="row.cookiesStatus == 3">出现滑块</el-tag>
                        <el-tag size="mini" type="warning" v-else-if="row.cookiesStatus == 4">出现短信验证码</el-tag>
                        <el-tag size="mini" type="danger" v-else>异常</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="aiyongStatus"
                    label="爱用状态">
                    <template slot-scope="{row}">
                        <el-tag size="mini" type="info" v-if="row.aiyongStatus == 0 || row.aiyongStatus == null">未登录</el-tag>
                        <el-tag size="mini" type="success" v-else-if="row.aiyongStatus == 1">在线</el-tag>
                        <el-tag size="mini" type="danger" v-else>异常</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="option"
                    width="150"
                    align="center"
                    label="操作">
                    <template slot-scope="{row}">
                        <el-button type="text" v-if="row.cookiesStatus == 1 && row.aiyongStatus != 1" size="mini" @click="onClickManager(row)">登录爱用</el-button>
                        <el-button type="text" v-if="row.cookiesStatus == 0 || row.cookiesStatus == null" size="mini" @click="onLogin">登录抖店</el-button>
                        <el-button type="text" v-else-if="row.cookiesStatus > 2" size="mini" @click="onLogin">重新登录抖店</el-button>
                        <el-button type="text" size="mini" v-if="row.cookiesStatus != 0 && row.cookiesStatus != null" @click="onLogout(row)">退出</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <dialog-login ref="dialogLogin" @success="loadShopList"/>
    </div>
</template>

<script>
import { getAllList, kuaidizsSignOut, shopManagerLogin } from '@/api/dfh/shop'
import DialogLogin from './modules/DialogLogin.vue'
export default {
    components: {
        DialogLogin
    },
    data() {
        return {
            searchForm: {},
            tableData: [],
            tableLoading: false,
            shopType: {
                1: '抖音店铺',
                2: '淘宝店铺'
            },
            shopStatus: {
                0: '未登录',
                1: '正常',
                2: '异常',
                3: '异常',
                4: '异常',
            },
            cmdResult: ''
        }
    },
    computed: {},
    methods: {
        onLogin () {
            this.$refs.dialogLogin.showEdit()
        },
        // 退出登录
        async onLogout (item) {
            const { data } = await kuaidizsSignOut(item.id)
            this.$message.success('退出成功')
            this.loadShopList()
        },
        async loadShopList(page){
            const params = {
                current: page || 1,
                size: 99,
                shopName: this.searchForm.shopName
            }
            this.tableLoading = true
            const { data } = await getAllList(params)
            this.tableLoading = false
            console.log('data', data)
            this.tableData = (data.data || []).map(item => {
                return {
                    ...item,
                    kuaidizsAuthEndTime: item.kuaidizsAuthEndTime ? this.$moment.unix(item.kuaidizsAuthEndTime).format('YYYY-MM-DD HH:mm:ss') : '',
                    jiancentAuthEndTime: item.jiancentAuthEndTime ? this.$moment.unix(item.jiancentAuthEndTime).format('YYYY-MM-DD HH:mm:ss') : ''
                }
            })
        },
        // 智能爱用交易
        async onClickManager (item) {
            this.tableLoading = true
            try {
                const { data } = await shopManagerLogin({shopId: item.id})
                this.tableLoading = false
                this.$message.success('登录成功')
                this.loadShopList()
            } catch (err) {
                this.tableLoading = false
            }
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.loadShopList()
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>
<style lang="scss">
.shop-list {
    .el-card {
        .el-card__body .search-btn {
            text-align: left;
            padding-left: 20px;
        }
        .login-tip {
            text-align: left;
            padding-left: 10px;
            color: #909399;
            margin-bottom: 15px;
            font-size: 14px;
        }
    }
}
</style>