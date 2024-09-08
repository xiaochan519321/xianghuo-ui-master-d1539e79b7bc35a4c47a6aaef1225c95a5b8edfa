<template>
    <div class='aliaccount-page'>
        <basic-container>
            <!-- <div class="pb20">
                <el-alert title="可添加个人账号无上限，若账号离线需重新登录，使用个人号平台不承担账号售后问题，Token号掉线将无法重新上线，强烈建议控制好每个号的下单数量！" type="warning" show-icon :closable="false"></el-alert>
            </div> -->
            <div class="private-content">
                <div class="private-list">
                    <el-form inline :model="formData" ref="form" class="ddk-form px20">
                        <el-form-item label="1688账号" prop="name">
                            <el-input type="text" placeholder="请输入1688账号" v-model="formData.name"></el-input>
                        </el-form-item>
                        <el-form-item label="授权状态" prop="status">
                            <el-select
                                @change="initGetList"
                                v-model="formData.status"
                                placeholder="请选择授权状态"
                                style="width: 160px"
                                clearable
                            >
                                <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click.stop="initGetList">
                                <span>搜索</span>
                            </el-button>
                            <el-button @click.stop="resetForm('form')">
                                <span>清空</span>
                            </el-button>
                        </el-form-item>
                        <span class="mr10 mt10" style="float: right;">账号数量：{{formData.total || 0}}</span>
                    </el-form>
                    <div class="account-add px20 border-t-eee pt20 mb20">
                        <el-button type="primary" @click.stop="onAccountAdd" :loading="addLoading">
                            <span>添加1688账号</span>
                        </el-button>
                        <span class="tips">注意：在添加1688账号授权或订购应用后，请点击搜索更新状态</span>
                    </div>
                    <div class="px20">
                        <el-table
                            :data="tableData"
                            size="small"
                            v-loading="tableloading"
                            headerCellClassName="header-cell-bg-color"
                            @selection-change="handleSelectionChange"
                            style="width: 100%">
                            <el-table-column
                                type="index"
                                label="序号"
                                align="center"
                                width="50">
                            </el-table-column>
                            <el-table-column
                                prop="name"
                                label="1688账号"
                                align="center"
                                min-width="120">
                            </el-table-column>
                            <el-table-column
                                prop="status"
                                label="授权状态"
                                min-width="100"
                                align="center">
                                <template slot-scope="{row}">
                                    <el-tag :type="row.status == 1 ? 'success' : 'danger'">{{statusOpt[row.status]}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="expiresTime"
                                min-width="150"
                                align="center"
                                label="授权到期时间">
                            </el-table-column>
                            <el-table-column
                                prop="created"
                                min-width="150"
                                sortable
                                align="center"
                                label="创建时间">
                            </el-table-column>
                            <el-table-column
                                fixed="right"
                                label="操作"
                                align="center"
                                width="180">
                                <template slot-scope="{row}">
                                    <el-button type="text" @click="onHrefAuth">前往授权</el-button>
                                    <el-button type="text" @click="onHrefOrder">订购</el-button>
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

                    </div>
                    <div class="pagination pb30 mt30 flex flex-row-reverse" v-if="formData.total > 0">
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
        </basic-container>
    </div>
</template>

<script>

import { getAuthUrl, fetchList, fetchDelete } from '@/api/dfh/aliAccount'
export default {
    components: {
    },
    data() {
        return {
            tableData: [],
            multiple: [],
            formData: {
                size: 50,
                current: 1,
                total: 0,
                platform: 2
            },
            statusList: [
                {label: '全部', value: ''},
                {label: '生效中', value: 1},
                {label: '已失效', value: 2}
            ],
            statusOpt: {
                1: '生效中',
                2: '已失效'
            },
            tableloading: false,
            addLoading: false
        }
    },
    computed: {
    },
    methods: {
        initGetList () {
            this.formData.current = 1
            this.loadList()
        },
        // 添加1688账号
        async onAccountAdd () {
            this.addLoading = true
            const { data } = await getAuthUrl({})
            this.addLoading = false
            if (window.electron) {
            // 发送到electron进行跳转
                window.electron.send({key: 'chromeUrl', url: data})
            } else {
                window.open(data)
            }
        },
        async onHrefAuth () {
            const { data } = await getAuthUrl({})
            if (window.electron) {
            // 发送到electron进行跳转
                window.electron.send({key: 'chromeUrl', url: data})
            } else {
                window.open(data)
            }
        },
        onHrefOrder () {
            const url = 'https://pc.1688.com/product/detail.htm?spm=a26370.20994425.fwsj_work_bench.1.68747ba6JsVA5x&productCode=2r5On%2Bs4WFdHlgsR4RCh%2FyQfmgU1cbg7AyGZTnQCG1Q%3D&productType=GROUP'
            if (window.electron) {
            // 发送到electron进行跳转
                window.electron.send({key: 'chromeUrl', url: url})
            } else {
                window.open(url)
            }
        },
        onItemDel (row) {
            this.$confirm(`是否删除1688账号？删除后将无法继续使用该号拍单!`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data } = await fetchDelete({id: Number(row.id)})
                this.$message.success('删除成功')
                this.loadList()
            }).catch(() => {   
            });
        },
        // 1688账号列表
        async loadList () {
            this.tableloading = true
            const { data } = await fetchList(this.formData)
            this.tableloading = false
            console.log('data', data)
            this.tableData = data.data.records
            this.formData.total = data.data.total
        },
        // 表格选择
        handleSelectionChange(val) {
            this.multiple = val
        },
        /**
         * current 改变时会触发
         */
        onCurrentChange(page) {
            this.formData.current = page;
            this.loadList();
        },
        /**
         * pageSize 改变时会触发
         */
        onSizeChange(size) {
            this.formData.size = size;
            this.loadList();
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
            this.initGetList()
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.loadList()
        console.log('1663367260414', this.$moment(1663367260414).format('YYYY-MM-DD HH:mm:ss'))
    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>

<style lang="scss" scoped>
.aliaccount-page {
    ::v-deep .el-card__body {
        padding: 20px 0;
    }

    .private-content {
        .account-add {
            display: flex;
            align-items: center;
            .tips {
                padding: 0 20px;
                height: 34px;
                line-height: 34px;
                background: #ffeff0;
                border-radius: 4px;
                color: #f77877;
                margin-left: 8px;
                font-weight: 500;
                display: inline-block;
            }
        }
        ::v-deep.el-table {
            min-height: 400px;
        }
    }
}
</style>
