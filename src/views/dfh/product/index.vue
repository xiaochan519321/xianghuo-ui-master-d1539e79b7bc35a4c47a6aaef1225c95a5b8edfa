<template>
    <div class="execution product-page">
        <basic-container>
            <div class="filter-box">
                <div class="title">请选择筛选条件</div>
                <el-form label-width="84px" inline>
                    <el-form-item label="店铺：">
                        <el-select
                            v-model="searchForm.shopId"
                            placeholder="请选择店铺"
                            style="width: 180px"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in shopList"
                                :key="index"
                                :label="item.shopName"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品ID：">
                        <el-input style="width: 180px;" clearable v-model="searchForm.id" placeholder="请输入商品ID"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称：">
                        <el-input style="width: 180px;"  clearable v-model="searchForm.name" placeholder="请输入商品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="关联规格：">
                       <el-select v-model="searchForm.isRelated" clearable style="width: 180px">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="未关联" value="1"></el-option>
                            <el-option label="已关联" value="2"></el-option>
                       </el-select>
                    </el-form-item>
                    <el-form-item label="七天内已有销量：" label-width="134px">
                       <el-select v-model="searchForm.selectType" clearable style="width: 180px">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="有销量" value="1"></el-option>
                       </el-select>
                    </el-form-item>
                    <el-form-item label="出售状态">
                       <el-select v-model="searchForm.status" clearable style="width: 180px">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="售卖中" value="0"></el-option>
                       </el-select>
                    </el-form-item>
                    <el-form-item label="隔离状态：">
                       <el-select v-model="searchForm.isolationStatus" clearable style="width: 180px">
                            <el-option label="未隔离" value="0"></el-option>
                            <el-option label="已隔离" value="1"></el-option>
                       </el-select>
                    </el-form-item>
                    <el-form-item label="福利品：" v-if="false">
                       <el-select v-model="searchForm.bindWelfareGoods" clearable style="width: 180px">
                            <el-option label="未绑定" value="0"></el-option>
                            <el-option label="已绑定" value="1"></el-option>
                       </el-select>
                    </el-form-item>
                    <el-form-item style="margin-left: 20px;">
                        <el-button style="width: 86px;"  type="primary" icon="el-icon-search" @click="getList" :loading="tableLoading" :disabled="tableLoading">
                            <span>{{tableLoading ? '查询中' : '搜索'}}</span>
                        </el-button>
                        <el-button  @click="clearForm" style="width: 86px;" icon="el-icon-delete">
                            <span>清空</span>
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="card">
                <avue-crud
                    ref="crud"
                    :page.sync="page"
                    :data="tableData"
                    :permission="permissionList"
                    :table-loading="tableLoading"
                    :option="tableOption"
                    :headerCellClassName="() => {return 'header-cell-bg-color'}"
                    @on-load="getList"
                    @search-change="searchChange"
                    @refresh-change="refreshChange"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    @row-update="handleUpdate"
                    @row-save="handleSave"
                    @row-del="rowDel"
                    @selection-change="selectionChange"
                >
                    <template slot="menuLeft" slot-scope="{size}">
                        <el-button  v-if="permissions.dfh_product_add" type="primary" style="width: 208px"  :size="size" @click="syncProduct">
                            同步商品信息及分类信息
                        </el-button>
                        <el-dropdown class="ml10" @command="onBatchHandle">
                            <el-button size="small" class="default-gray" style="width: 110px">
                                <span style="margin-right: 12px">批量操作</span>
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="separate">批量隔离商品</el-dropdown-item>
                                <el-dropdown-item command="cancelSeparate">批量取消隔离</el-dropdown-item>
                                <el-dropdown-item command="benefits">批量关联福利品</el-dropdown-item>
                                <el-dropdown-item command="cancelBenefits">批量取消福利品</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                    <template slot="shopId" slot-scope="{ row }">
                        <div>{{row.shopName}}</div>
                        <div v-if="row.isolationStatus == 1">
                            <el-tag type="danger" size="mini">已隔离</el-tag>
                        </div>
                    </template>
                    <template slot="goodsInfo" slot-scope="{row}">
                        <div class="flex items-center">
                            <el-image 
                                fit="cover"
                                style="width: 50px; height: 50px; border-radius: 5px;"
                                :src="row.img"
                                :preview-src-list="[row.img]">
                            </el-image>
                            <div style="flex: 1;" class="ml15 text-left lh16">
                                <div class="mb10 ellipsis-2" style="color:#000; font-weight: bold; font-size: 14px;">{{row.name}}</div>
                                <div>
                                    商品ID：{{row.id}}
                                    <i
                                        class="iconfont icon-bianzu13 ml5"
                                        style="cursor: pointer;"
                                        v-clipboard:copy="row.id"
                                        v-clipboard:success="onCopy"
                                        v-clipboard:error="onError"
                                    ></i>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template slot="img" slot-scope="{ row }">
                        <div>
                            <el-image 
                                fit="cover"
                                style="width: 64px; height: 64px;"
                                :src="row.img"
                                :preview-src-list="[row.img]">
                            </el-image>
                        </div>
                    </template>
                    <template slot="purchaseUrl" slot-scope="{ row }">
                        <template v-if="row.pddWelfareGoodsId">
                            <el-popover
                            placement="top"
                                width="200"
                                trigger="hover">
                                <el-image 
                                    v-if="row.pddWelfareGoodsImage"
                                    fit="cover"
                                    :src="picUrl(row.pddWelfareGoodsImage)">
                                </el-image>
                                <p slot="reference" class="benefit-sku">已绑福利品</p>
                            </el-popover>
                            <div>{{row.pddWelfareGoodsSpec}}</div>
                        </template>
                        <template v-else>
                            <el-button @click="addPurchaseUrl(row)" type="primary" size="mini" style="padding: 5px 8px;">
                                <span>关联规格</span>
                            </el-button>
                            <div>共{{row.puCount}}条</div>
                        </template>
                    </template>
                    <template slot="discountPrice" slot-scope="{ row }">
                        <span style="color:rgb(70, 180, 109);">{{(row.discountPrice / 100).toFixed(2)}}</span>
                    </template>
                    <template slot="categoryDetail" slot-scope="{ row }">
                        <div>{{row.firstCname}}</div>
                        <div>{{row.secondCname}}</div>
                        <div>{{row.thirdCname}}</div>
                        <div>{{row.fourthCname}}</div>
                    </template>
                </avue-crud>
            </div>
            <el-dialog title="对应采购商品链接" :visible.sync="purchaseUrlDialogVisible" width="45%">
                <div
                    class="table_c"
                    style="background-color: #eef5ff;height: 50px;width: 100%;line-height: 50px;font-weight: 700;"
                >
                    <div
                        class="cell"
                        style="display: inline-block;text-align: left;width: 550px"
                    >采购链接</div>
                    <div class="cell1" style="display: inline-block;">提示信息</div>
                </div>
                <br />
                <el-row v-for="(item,index) in puData" :gutter="30" :key="index">
                    <el-col :sm="14" :md="14" :lg="14">
                        <el-input
                            v-model="puData[index].purchaseUrl"
                            type="text"
                            clearable
                            placeholder="请输入采购链接"
                        />
                    </el-col>
                    <el-col :sm="1" :md="1" :lg="1">
                        <button type="button" class="el-button el-button--text el-button--small">
                            <el-link
                                :href="puData[index].purchaseUrl"
                                target="_blank"
                                :underline="false"
                                type="primary"
                            >查看</el-link>
                        </button>
                    </el-col>
                    <el-col :sm="6" :md="6" :lg="6">
                        <el-input
                            type="text"
                            placeholder="请输提示信息"
                            v-model="puData[index].hintInfo"
                            maxlength="8"
                            show-word-limit
                        />
                    </el-col>
                    <el-col :sm="1" :md="1" :lg="1">
                        <el-button @click="delRows(index)" type="danger" circle>
                            <i class="el-icon-minus"></i>
                        </el-button>
                    </el-col>
                </el-row>
                <br />
                <el-button @click="addRows()" type="primary">
                    <i class="el-icon-plus"></i>添加链接
                </el-button>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="savePurchaseUrl">保 存</el-button>
                    <el-button @click="purchaseUrlDialogVisible = false">关 闭</el-button>
                </span>
            </el-dialog>
        </basic-container>
        <el-backtop target=".main-container"></el-backtop>
        <dialog-spec :visible="visible" :data="info" @close="visible = false"></dialog-spec>
        <dialog-product />
        <dialog-filter ref="filterDialog" @success="getList(page)"/>
        <dialog-benefits ref="benefitsDialog" @success="getList(page)"/>
    </div>
</template>

<script>
import { fetchList, addObj, putObj, delObj, syncProduct, getPurchaseUrl, savePurchaseUrl, batchIsolation, cancelPddWelfareGoods } from '@/api/dfh/product'
import { tableOption } from '@/const/crud/dfh/product'
import { mapGetters } from 'vuex';
import DialogSpec from '@/components/dialog/DialogSpec';
import DialogProduct from '@/components/dialog/DialogProduct';
import DialogFilter from './modules/DialogFilter'
import DialogBenefits from './modules/DialogBenefits'

export default {
    components: {
        DialogSpec,
        DialogProduct,
        DialogFilter,
        DialogBenefits
    },
    name: 'dfhproduct',
    data() {
        return {
            shopList: [], //店铺
            searchForm: {},
            tableData: [],
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 20 // 每页显示多少条
            },
            tableLoading: false,
            tableOption: tableOption,
            purchaseUrlDialogVisible: false,

            puData: [], //采购链接数据
            productId: '',

            visible: false,
            info: {},
            scData: []
        }
    },
    computed: {
        ...mapGetters(['permissions']),
        permissionList() {
            return {
                addBtn: this.vaildData(this.permissions.dfh_product_add, false),
                delBtn: this.vaildData(this.permissions.dfh_product_del, false),
                editBtn: this.vaildData(this.permissions.dfh_product_edit, false)
            };
        }
    },
    async mounted() {
        const { data: { data } } = await this.$API.getShopList();
        this.shopList = data;
    },
    methods: {
        clearForm() {
            this.searchForm = this.$options.data().searchForm;
            this.page.currentChange = 1;
            this.getList(this.page);
        },
        onCopy(e) { 　　 // 复制成功
            this.$message({
                message: '复制成功！',
                type: 'success'
            })
        },
        onError(e) {　　 // 复制失败
            this.$message({
                message: '复制失败！',
                type: 'error'
            })
        },
        // 图片路径处理
        picUrl (url) {
            if (!url) return
            return url.indexOf('http') !== -1 ? url : `https://p9-aio.ecombdimg.com/obj/${url}`
        },
        // 批量操作
        onBatchHandle (command) {
            if (command == 'separate') return this.onBatchSeparate()
            if (command == 'cancelSeparate') return this.onCancelBatchSeparate()
            if (command == 'benefits') return this.onBenefits()
            if (command == 'cancelBenefits') return this.onCancelBenefits()
        },
        // 批量隔离商品
        onBatchSeparate () {
            const that = this
            if (this.scData.length) {
                this.$confirm('是否确定将当前选中商品进行隔离？', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    that.onBatchIsolation(1)
                })
            } else {
                this.$refs.filterDialog.showEdit(1)
            }
        },
        onCancelBatchSeparate () {
            const that = this
            if (this.scData.length) {
                this.$confirm('是否确定将当前选中商品进行取消隔离？', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    that.onBatchIsolation(0)
                })
            } else {
                this.$refs.filterDialog.showEdit(0)
            }
        },
        // 批量关联福利品
        onBenefits () {
            if (!this.scData.length) return this.$message.error('请至少勾选一个商品进行操作')
            const ids = this.scData.map(item => item.id)
            this.$refs.benefitsDialog.showEdit(ids)
        },
        // 批量取消福利品
        onCancelBenefits () {
            if (!this.scData.length) return this.$message.error('请至少勾选一个商品进行操作')
            const ids = this.scData.map(item => item.id)
            const that = this
            this.$confirm('是否确定将当前选中商品进行取消关联福利品？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async function () {
                const { data } = await cancelPddWelfareGoods({productIds: ids})
                if (data.code == 0) {
                    that.$message.success('操作成功')
                    that.getList(that.page)
                }
            })
        },
        async onBatchIsolation (status) {
            const params = {
                isolationStatus: status,
                productIds: this.scData.map(item => item.id)
            }
            this.tableLoading = true
            const { data } = await batchIsolation(params)
            if (data.code == 0) {
                this.$message.success('操作成功')
                this.getList(this.page)
            }
            console.log('data', data)
        },
        syncProduct() {
            let than = this;
            this.$confirm('确定同步商品信息吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
            }).then(function () {
                syncProduct().then(data => {
                    if (data.data.code == 0) {
                        than.$message.success(data.data.msg)
                    } else {
                        than.$message.error(data.data.msg)
                    }
                }).catch(() => {
                    loading();
                });
            }).then(data => {
                //this.$message.success('删除成功')
            })
        },
        savePurchaseUrl() {
            savePurchaseUrl(this.puData, this.productId).then(data => {
                this.purchaseUrlDialogVisible = false;
                this.$message.success('保存成功')
                // alert(1)
                // done()
                this.getList(this.page)
            }).catch(() => {
                loading();
            });
        },
        addPurchaseUrl(row) {
            this.info = row;
            this.visible = true;
            // this.purchaseUrlDialogVisible = !this.purchaseUrlDialogVisible;
            // this.productId = row.id;
            // let than = this;
            // getPurchaseUrl({ "productId": row.id }).then(data => {
            //     if (data.data.data.length >= 1) {
            //         than.puData = data.data.data;
            //     } else {
            //         this.puData = [];
            //         this.puData.push({
            //             "id": '',
            //             "purchaseUrl": '',
            //             "hintInfo": '采购链接',
            //             "productId": row.id,
            //         })
            //     }
            // }).catch(() => {
            //     this.tableLoading = false
            // })
        },
        addRows() {
            this.puData.push({
                "id": '',
                "purchaseUrl": '',
                "hintInfo": '采购链接',
                "productId": this.productId,
            })
        },
        delRows(index) {
            this.puData.splice(index, 1);
        },
        getList(page, params) {
            this.tableLoading = true
            fetchList(Object.assign({
                current: page.currentPage,
                size: page.pageSize
            }, params, this.searchForm)).then(response => {
                this.tableData = response.data.data.records
                this.page.total = response.data.data.total
                this.tableLoading = false
            }).catch(() => {
                this.tableLoading = false
            })
        },
        rowDel: function (row, index) {
            this.$confirm('是否确认删除ID为' + row.id, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                return delObj(row.id)
            }).then(data => {
                this.$message.success('删除成功')
                this.getList(this.page)
            })
        },
        handleUpdate: function (row, index, done, loading) {
            putObj(row).then(data => {
                this.$message.success('修改成功')
                done()
                this.getList(this.page)
            }).catch(() => {
                loading();
            });
        },
        handleSave: function (row, done, loading) {
            addObj(row).then(data => {
                this.$message.success('添加成功')
                done()
                this.getList(this.page)
            }).catch(() => {
                loading();
            });
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize
        },
        currentChange(current) {
            this.page.currentPage = current
        },
        searchChange(form, done) {
            this.searchForm = form
            this.page.currentPage = 1
            this.getList(this.page, form)
            done()
        },
        refreshChange() {
            this.getList(this.page)
        },
        selectionChange(list){
            this.scData = list;
        }
    }
}
</script>

<style lang="scss" scoped>
    .execution {
        .benefit-sku {
            color: #E6A23C;
            cursor: pointer;
        }
    }
    .product-page {
        ::v-deep .el-card__body {
            .el-collapse-item__wrap {
                padding: 0 20px;
                margin: 0 -20px 20px;
                border-bottom: 1px solid #eee;
            }
            .avue-crud__menu {
                margin-bottom: 10px;
            }
            .el-tag--small {
                height: 32px;
                line-height: 32px;
                margin-top: 0;
                margin-bottom: 15px;
            }
        }
    }

</style>

<style lang="scss" scoped>
.filter-box {
    padding: 0px 16px 0px 16px;
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
        margin-bottom: 18px;
        
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
}

.card {
    padding: 0px 16px 50px 16px;
    border-radius: 12px;
    background: #fff;

    ::v-deep .avue-crud {
        width: 100%;
        .avue-crud__search {
            padding: 20px 6px 14px 10px;
            position: relative;
            &::before {
                content: '';
                display: block;
                position: absolute;
                width: calc(100% + 32px);
                height: 14px;
                left: -16px;
                bottom: -0px;
                background: #F4F8FB;
                z-index: 1;
            }
            &::after {
                content: '';
                display: block;
                position: absolute;
                width: calc(100% + 32px);
                left: -16px;
                bottom: -0px;
                height: 14px;
                background: #FFF;
                border-bottom-left-radius: 12px;
                border-bottom-right-radius: 12px;
                z-index: 5;
            }
            .el-form-item {
                display: flex;
                flex-direction: column;
                margin-bottom: 20px;
                .el-form-item__label {
                    line-height: 14px;
                }

                .el-form-item__content {
                    margin-left: 0px !important;
                    margin-top: 10px;
                }
            }
            //最后两个按钮
            .avue-form__menu.avue-form__menu--right {
                .el-form-item__content {
                    margin-right: auto !important;
                    margin-top: 24px;
                }
            }
        }
        .avue-crud__menu {
            position: relative;
            padding-top: 36px;
            margin-bottom: 0;
            overflow: visible;
            &::before{
                content: '';
                display: block;
                position: absolute;
                width: calc(100% + 32px);
                height: 36px;
                left: -16px;
                top: 0px;
                background: #F4F8FB;
                z-index: 1;
            }
            &::after{
                content: '';
                display: block;
                position: absolute;
                width: calc(100% + 32px);
                height: 20px;
                left: -16px;
                top: 16px;
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
                background: #FFF;
                z-index: 5;
            }
            .avue-crud__left {
                .el-button {
                    margin-bottom: 0;
                }
            }
            .avue-crud__right {
                .el-button {
                    margin-bottom: 0;
                    &:last-child {
                        display: none !important;
                    }
                }
            }
        }
        .avue-crud__tip {
            width: 100%;
            margin: 0;
            display: flex;
            padding: 16px 0px 24px;
            height:auto;
            border: none;
            box-shadow: none;
            background: transparent;
            .avue-crud__tip-name {
                width: 100%;
                background: #EDF0FF;
                border-radius: 4px 4px 4px 4px;
                height: 32px;
                line-height: 32px;
                border: none;
                padding-left: 44px;
                color: #000;
                font-size: 14px;
                position: relative;
                .avue-crud__tip-count {
                    font-weight: 300;
                    font-size: 14px;
                    margin: 0;
                }
                &::before {
                    content: '';
                    display: block;
                    width: 20px;
                    height: 20px;
                    position: absolute;
                    top: 50%;
                    left: 17px;
                    transform: translateY(-49%);
                    // background:url(~@/assets/info-circle.png);
                    background-size: 100%;
                }
                
            }
            .el-button  {
                display: none;
            }
        }
        .avue-crud__pagination {
            padding-bottom: 0px;
        }
        //表格
        .el-table {
            border: none;
            &::after, &::before{
                display: none !important; 
            }
            .el-table__header {
                tr {
                    th {
                        border: none;
                        background: #F8F9FB;
                    }
                }
            }
            .el-table__body {
                tr {
                    td {
                        border-right: none;
                        border-left: none;
                    }
                    
                }
            }
            
            
        }
    } 
}</style>