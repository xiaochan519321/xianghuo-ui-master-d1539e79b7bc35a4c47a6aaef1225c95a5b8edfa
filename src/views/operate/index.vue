<template>
    <div class='operate-page' :class="{'disable': vipRight == 'regular' || vipRight == 'default' || vipRight == 'introduction'}" ref="operateMain" v-loading="pageLoading">
        <div class="operate-main">
            <el-tabs v-model="activeName">
                <el-tab-pane label="搜索排名优化" name="1" class="operate-first">
                    <el-alert title="这个方法可以帮助到您的流量入口为【抖音商城搜索、商品详情顶部搜索】目前权重最高的渠道，根据我们的方法来操作并在客户端生成二维码，通过这个入口操作，第二天的商品来源会来自【搜索】" type="warning" show-icon :closable="false"></el-alert>
                    <div class="tip-title mt30 mb10">输入关键词，宝贝链接<span class="color-red">（多个链接时换行，生成失败时请参考例子）</span></div>
                    <el-row :gutter="20">
                        <el-col :span="24" class="mb20">
                            <el-input
                                type="textarea"
                                :rows="8"
                                :placeholder="`请输入关键词、商品链接，一行一个，最多批量十个；\n\n例子：\n毛绒绒卡菲猫，https://haohuo.jinritemai.com/ecommerce/trade/detail/index.html?id=2235223611349807\n毛绒绒小猫，https://haohuo.jinritemai.com/ecommerce/trade/detail/index.html?id=2235223611349807`"
                                v-model="firstGoodsData"
                                resize="none"
                                clearable
                            ></el-input>
                            <div class="code-item p20">
                                <div class="title">一个商品生成二维码为100积分，理论上来说可使用无数次</div>
                                <el-button type="primary" @click="onGenerate">生成二维码</el-button>
                            </div>
                            <el-row class="use-tips-content">
                                <el-col :span="24" class="p20">
                                    <div class="lh20"><span class="use-tip">说明：</span><span>关键词必须是标题中所含的词，选择的关键词尽量长一点，但也不要全标题，不可以是关键词延伸出来的词，否则无效果。</span></div>
                                </el-col>
                                <!-- <el-col :span="24" class="p20">
                                    <div class="use-tip mb20">使用注意点：</div>
                                    <div class="mb20 lh18">1.输入相应的关键词和商品链接，会免费生成一个二维码。买家通过扫描这个二维码，商品会在搜索结果页比较靠前的位置。</div>
                                    <div class="mb20 lh18">2.二维码是通过特定的代码只做出搜索入口，买家扫描二维码后，商品会提高相应的排名。</div>
                                    <div class="mb20 lh18">3.新品没排名可使用此功能，买手可通过扫描生成的二维码，快速找到商品，提高商品关键词流量。</div>
                                    <div class="mb20 lh18">4.关键词必须是标题中所含的词，不可以是关键词延伸出来的词，否则无效果。</div>
                                    <div class="mb20 lh18">5.新品使用此功能时，选择的关键词尽量长一点，但也不要全标题卡首屏，全标题卡首屏提升的权重不会很高甚至没有变化。</div>
                                    <div class="mb20 lh18">6.不要用一级词卡屏，新品在一级词的权重太低，很大概率会没有效果。</div>
                                    <div class="mb20 lh18">7.新品卡出来之后，若有加购、货比三家等一系列操作的加持，商品所提升的权重会更高。</div>
                                    <div>8.测试时，尽量用近期没有访问过商品的账号，避免个性化推荐影响结果。</div>
                                </el-col>
                                <el-col :span="8" class="p20">
                                    <div class="use-tip mb20">账号建议：</div>
                                    <div class="mb20">1.建议七天内没有在抖音下过单的。</div>
                                    <div class="mb20">2.不要狂S号，适当检查买手订单。</div>
                                    <div class="mb20">3.有实名，有绑定手机号，有绑定今日头条。</div>
                                    <div class="mb20">4.数字号不要，关注了一千人以上的号不要。</div>
                                    <div class="mb20">5.有自己的作品最好。</div>
                                    <div>符合以上三个条件，为优质</div>
                                </el-col> -->
                            </el-row>
                        </el-col>
                        <el-col :span="24">
                            <el-table
                                :data="firstTableData"
                                border
                                height="515px"
                                headerCellClassName="header-cell-bg-color"
                                class="mb20"
                                style="width: 100%">
                                <el-table-column
                                    prop="date"
                                    label="宝贝图片"
                                    align="center"
                                    min-width="100">
                                    <template slot-scope="{row}">
                                        <el-image 
                                            fit="cover"
                                            style="width: 50px; height: 50px; border-radius: 5px;"
                                            :src="row.img"
                                            :preview-src-list="[row.img]">
                                        </el-image>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="productId"
                                    label="商品ID"
                                    align="center"
                                    min-width="150">
                                </el-table-column>
                                <el-table-column
                                    prop="searchKey"
                                    label="关键词"
                                    align="center"
                                    min-width="150">
                                </el-table-column>
                                <el-table-column
                                    prop="created"
                                    min-width="150"
                                    align="center"
                                    label="生成时间">
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="操作">
                                    <template slot-scope="{row}">
                                        <el-button type="text" @click="onView(row.link)">查看二维码</el-button>
                                    </template>
                                </el-table-column>
                                <template slot="empty">
                                    <div class="empty">
                                        <el-empty
                                            description="暂时没有找到任何订单信息"
                                            style="height: 473px"
                                            :image-size="100"
                                            v-if="!firstTableData.length && !tableLoading"
                                        ></el-empty>
                                    </div>
                                </template>
                            </el-table>
                            <div class="pagination pb20 flex flex-row-reverse" v-if="firstForm.total > 0">
                                <el-pagination
                                    background
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :current-page.sync="firstForm.current"
                                    :page-size="firstForm.size"
                                    :page-sizes="[20, 50, 100]"
                                    :total="firstForm.total"
                                    @current-change="onCurrentChange"
                                    @size-change="onSizeChange"
                                ></el-pagination>
                            </div>
                        </el-col>
                    </el-row>
                </el-tab-pane>

                <!-- 卡猜你喜欢二维码 -->
                <el-tab-pane label="猜你喜欢优化" name="0" class="operate-first">
                    <el-alert title="这个方法可以帮助到您的流量入口为【商城推荐流量】目前权重最高的渠道，根据我们的方法来操作并在客户端生成二维码，通过这个入口操作，第二天的商品来源会来自【商城推荐流量】" type="warning" show-icon :closable="false"></el-alert>
                    <div class="tip-title mt30 mb10">宝贝链接<span class="color-red">（多个链接时换行，生成失败时请参考例子）</span></div>
                    <el-row :gutter="20">
                        <el-col :span="24" class="mb20">
                            <el-input
                                type="textarea"
                                :rows="8"
                                :placeholder="`请输入商品链接，一行一个，最多批量十个；\n\n例子：\nhttps://haohuo.jinritemai.com/ecommerce/trade/detail/index.html?id=2235223611349807\nhttps://haohuo.jinritemai.com/ecommerce/trade/detail/index.html?id=2235223611349807`"
                                v-model="secondGoodsData"
                                resize="none"
                                clearable
                            ></el-input>
                            <div class="code-item p20">
                                <div class="title">一个商品生成二维码为50积分，理论上来说可使用无数次</div>
                                <el-button type="primary" @click="onGenerate">生成二维码</el-button>
                            </div>
                            <!-- <el-row class="use-tips-content">
                                <el-col :span="24" class="p20">
                                    <div class="use-tip mb20">使用注意点：</div>
                                    <div class="mb5">1.不要随意找新账号，垃圾鱼塘号进行操作。</div>
                                    <div class="mb5 lh18">2.0销量的商品不可以使用【0销量的商品本身就无猜你喜欢流量，用这个操作容易稽查】。</div>
                                    <div class="mb5">3.不建议一拖多，只建议一拖一，账号漂亮可以一拖二。</div>
                                    <div class="mb5">4.生成二维码，直接用抖音app扫码即可。</div>
                                    <div class="mb5">5.如果使用链接拍单，请复制生成链接，到手机自带浏览器处，跳转抖音拍单。</div>
                                    <div class="mb5">6.部分安卓手机例如oppo vivo等兼容性差的手机，可能会调不到抖音商城下单。</div>
                                    <div class="mb5">7.直接扫码浏览一下购买，不建议增加购物车购买，客服浏览窗口购买。</div>
                                    <div class="mb5">8.成交后第二天就可以从抖音小店电商罗盘，商品卡分析，查看流量来源。</div>
                                    <div class="mb5">9.如出现的不是猜你喜欢，请联系客服查询问题。</div>
                                    <div class="mb5">10.我们只提供流量入口，不提供玩法，玩法请自行操作！</div>
                                    <div class="mb5">11.遭遇清销量原因，属于S手账号问题，请及时更换账号，我们只提供入口！</div>
                                    <div>12.不要做任意收藏加购客服聊天拍下行为，这样流量入口会发生变更！</div>
                                </el-col>
                                <el-col :span="10" class="p20">
                                    <div class="use-tip mb20">账号建议：</div>
                                    <div class="mb20">1.建议七天内没有在抖音下过单的。</div>
                                    <div class="mb20">2.不要狂S号，适当检查买手订单。</div>
                                    <div class="mb20">3.有实名，有绑定手机号，有绑定今日头条。</div>
                                    <div class="mb20">4. 数字号不要，关注了一千人以上的号不要。</div>
                                    <div class="mb20">5. 有自己的作品最好。</div>
                                    <div>符合以上三个条件，为优质</div>
                                </el-col>
                            </el-row> -->
                        </el-col>
                        <el-col :span="24">
                            <el-table
                                :data="secondTableData"
                                border
                                height="515px"
                                headerCellClassName="header-cell-bg-color"
                                class="mb20"
                                style="width: 100%">
                                <el-table-column
                                    prop="date"
                                    label="宝贝图片"
                                    align="center"
                                    min-width="100">
                                    <template slot-scope="{row}">
                                        <el-image 
                                            fit="cover"
                                            style="width: 50px; height: 50px; border-radius: 5px;"
                                            :src="row.img"
                                            :preview-src-list="[row.img]">
                                        </el-image>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="productId"
                                    label="商品ID"
                                    align="center"
                                    min-width="150">
                                </el-table-column>
                                <el-table-column
                                    prop="link"
                                    label="链接"
                                    align="center"
                                    min-width="200">
                                </el-table-column>
                                <el-table-column
                                    prop="created"
                                    min-width="150"
                                    align="center"
                                    label="生成时间">
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="操作">
                                    <template slot-scope="{row}">
                                        <el-button type="text" @click="onView(row.link)">查看二维码</el-button>
                                    </template>
                                </el-table-column>
                                <template slot="empty">
                                    <div class="empty">
                                        <el-empty
                                            description="暂时没有找到任何订单信息"
                                            style="height: 473px"
                                            :image-size="100"
                                            v-if="!secondTableData.length && !tableLoading"
                                        ></el-empty>
                                    </div>
                                </template>
                            </el-table>
                            <div class="pagination pb20 flex flex-row-reverse" v-if="secondForm.total > 0">
                                <el-pagination
                                    background
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :current-page.sync="secondForm.current"
                                    :page-size="secondForm.size"
                                    :page-sizes="[20, 50, 100]"
                                    :total="secondForm.total"
                                    @current-change="onCurrentChange"
                                    @size-change="onSizeChange"
                                ></el-pagination>
                            </div>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </div>
        <DialogCode ref="dialogCode" />
        <DialogUp ref="dialogUp" />
    </div>
</template>

<script>
import { createGenerateLink, getList } from '@/api/dfh/operate'
import DialogCode from './components/DialogCode.vue'
import DialogUp from './components/DialogUp.vue'
import { mapState } from 'vuex'
export default {
    components: {
        DialogCode,
        DialogUp
    },
    data() {
        return {
            activeName: '1',
            firstGoodsData: '',
            secondGoodsData: '',
            firstTableData: [],
            firstForm: {
                size: 50,
                current: 1,
                total: 0
            },
            secondForm: {
                size: 50,
                current: 1,
                total: 0
            },
            secondTableData: [],
            secondTotal: 0,
            tableLoading: false,
            pageLoading: false
        }
    },
    watch: {
        activeName (val, oldVal) {
            this.onLoadList()
        },
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
        // 查看二维码
        onView (link) {
            this.$refs.dialogCode.showModel(link)
        },
        onGenerate () {
            let filterOrderIds = ''
            let filterOrders = ''
            let searchKeys = ''
            try {
                if (this.activeName == '0') {
                    // 卡猜你喜欢
                    if (!this.secondGoodsData) {
                        this.$message.warning("请填写商品链接或口令")
                        return false
                    }
                    filterOrderIds = this.secondGoodsData.replace(/\r/g, "").replace(/\n/g, ",").replace(/，/g, ",").replace(/\s*/g, "")
                } else {
                    // 卡搜索
                    if (!this.firstGoodsData) {
                        this.$message.warning("请填写关键词，商品链接")
                        return false
                    }
                    const result = this.firstGoodsData.replace(/\r/g, "").replace(/\n/g, "～").split('～')
                    result.filter(item => {
                        // 先过滤空项
                        return item != ''
                    }).forEach((item, index) => {
                        const itemArr = item.replace(/\s*/g, "").replace(/，/g, ",").split(',')
                        if (itemArr[0] && itemArr[1]) {
                            if (!filterOrderIds) filterOrderIds += itemArr[1] || ''
                            else filterOrderIds += `,${itemArr[1] || ''}`
                            if (!searchKeys) searchKeys += itemArr[0] || ''
                            else searchKeys += `,${itemArr[0] || ''}`
                        } else {
                            throw Error(index)
                        }
                    })
                }
                filterOrders = filterOrderIds.split(',').filter(item => {
                    return item != ''
                })
                console.log('filterOrders', filterOrders)
            } catch (index) {
                console.log('index', index)
                const sub = index.toString().replace('Error: ', '')
                if (this.activeName == '1') {
                    this.$message.warning(`第${sub - 0 + 1}条输入的格式不正确，请检查！正确的格式是【关键词，商品链接】`)
                } else {
                    this.$message.warning(`第${sub - 0 + 1}条输入的链接格式不正确，请检查！`)
                }
                return
            }
            if (filterOrders.length > 10) {
                this.$message.warning('每次生成最多提交10条链接')
                return
            }
            this.$confirm(`本次提交${filterOrders.length}条共需消耗 ${filterOrders.length * (this.activeName == '1' ? 100 : 50)} 积分，是否确认生成？`, '温馨提示', {
                confirmButtonText: '生成',
                closeOnClickModal: false,
                type: 'warning'
            }).then(async () => {
                this.pageLoading = true
                const params = {
                    type: this.activeName,
                    productUrls: filterOrderIds
                }
                if (this.activeName == '1') {
                    params['searchKeys'] = searchKeys
                }
                try {
                    const { data } = await createGenerateLink(params)
                    console.log('data', data)
                    this.pageLoading = false
                    if (data.code == 0) {
                        this.secondGoodsData = ''
                        this.firstGoodsData = ''
                        this.$confirm(`本次提交${data.data.totalCount}条，成功${data.data.successCount}条，共消耗${data.data.costScore}积分`, '生成成功', {
                            confirmButtonText: '去查看',
                            showCancelButton: false,
                            closeOnClickModal: false,
                            type: 'success'
                        }).then(() => {
                            this.$nextTick(() => {
                                let scrollElem = this.$refs.operateMain;
                                scrollElem.scrollTo({ top: scrollElem.scrollHeight, behavior: 'smooth'})
                            })
                        })
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
            this.tableLoading = true
            const params = {
                type: this.activeName
            }
            if (this.activeName == '0') {
                params['size'] = this.secondForm.size
                params['current'] = this.secondForm.current
            } else {
                params['size'] = this.firstForm.size
                params['current'] = this.firstForm.current
            }
            const { data } = await getList(params)
            this.tableLoading = false
            if (this.activeName == '0') {
                this.secondTableData = data.data.records
                this.secondForm.total = data.data.total
            } else {
                this.firstTableData = data.data.records
                this.firstForm.total = data.data.total
            }
            console.log('data', data)
        },
        /**
         * current 改变时会触发
         */
        onCurrentChange(page) {
            if (this.activeName == '0') {
                this.secondForm.current = page;
            } else {
                this.firstForm.current = page;
            }
            this.onLoadList()
        },
        /**
         * pageSize 改变时会触发
         */
        onSizeChange(size) {
            if (this.activeName == '0') {
                this.secondForm.size = size
            } else {
                this.firstForm.size = size
            }
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
            this.$refs.dialogUp.showModel()
        }
    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>

<style lang="scss" scoped>
.operate-page {
    height: 100%;
    overflow-y: auto;
    padding: 8px 10px;
    position: relative;
    .operate-main {
        min-height: 100%;
        border-radius: 5px;
        background-color: #fff;
        padding: 20px;
        .tip-title {
            color: #333;
            font-weight: 500;
        }
        ::v-deep.el-image__error {
            font-size: 12px;
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
.operate-page.disable {
    overflow: hidden;
}
</style>