<template>
    <div class='dialog-product-benefit'>
        <el-dialog title="批量关联福利品" :visible.sync="specDialog" width="600px" v-loading="spin" top="15%" :close-on-click-modal="false">
            <el-row class="title-row" :gutter="30">
                <el-col :span="20">福利品链接</el-col>
                <el-col :span="4" class="text-center">操作</el-col>
            </el-row>
            <el-row class="my20" :gutter="30" type="flex" align="middle">
                <el-col :span="20">
                    <el-input type="text" v-model="purchaseLink" placeholder="请输入福利品采购链接" style="width: 100%;"></el-input>
                </el-col>
                <el-col :span="4" class="text-center">
                    <el-button type="text" size="medium" @click="onSyncPddSpec">获取SKU</el-button>
                </el-col>
            </el-row>
            <el-row class="title-row" :gutter="30">
                <el-col :span="20">
                    选择商品属性
                    <el-tooltip class="font16" content="关联福利品后在代发可显示福利品标识" placement="right" effect="light">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </el-col>
                <el-col :span="4" class="text-center">价格</el-col>
            </el-row>
            <el-row class="my20 content-tow" :gutter="30" type="flex" align="middle">
                <el-col :span="20">
                    <div class="flex align-items">
                        <el-popover
                            placement="top"
                            v-if="curSkuItem"
                            width="200"
                            trigger="hover">
                            <el-image 
                                fit="cover"
                                class="spec-image"
                                :src="picUrl(curSkuItem.thumbUrl)">
                            </el-image>
                            <el-image 
                                fit="cover"
                                slot="reference"
                                class="spec-image"
                                :src="picUrl(curSkuItem.thumbUrl)"
                                :preview-src-list="[picUrl(curSkuItem.thumbUrl)]">
                            </el-image>
                        </el-popover>
                        <el-select v-model="specRes[index]" size="small" placeholder="请选择对应规格" v-for="(item, index) in pddSkuList" :key="index" class="flex-1 ml10" style="max-width: 250px;">
                            <el-option
                                v-for="spec in item.spec_value"
                                :key="spec.spec_value_id"
                                :label="spec.spec_value"
                                :value="spec.spec_value_id">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="4" class="text-center">
                    <template v-if="curSkuItem">
                        <el-button type="text" size="medium" style="padding: 0;">{{curSkuItem.groupPrice}}</el-button>
                        <p v-if="curSkuItem.quantity == 0" style="color: red;">已售罄</p>
                    </template>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="specDialog = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit" :loading="loading">确定关联</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { syncPddSpec, getPddSpecList, savePddWelfareGoods } from '@/api/dfh/product'
export default {
    components: {},
    watch: {
    },
    data() {
        const that = this
        return {
            specDialog: false,
            ruleForm: {
                productIds: []
            },
            loading: false,
            purchaseLink: '',
            spin: false,
            pddSkuList: [],
            specRes: [],
            pddSpecList: []
        }
    },
    computed: {
        curSkuItem () {
            let item = null
            try {
                if (!this.specRes.length || this.specRes.length != this.pddSkuList.length) return item
                for (let i = 0; i < this.pddSpecList.length; i++) {
                    const itemSpec = this.pddSpecList[i].spec
                    try {
                        this.specRes.forEach((spec, index) => {
                            if (itemSpec.indexOf(spec) == -1) {
                                throw Error('end')
                            } else if (index == this.specRes.length - 1) {
                                // sku结果的最后一次循环才给出结果
                                item = this.pddSpecList[i]
                            }
                        })
                    } catch (err) {
                        continue
                    }
                }
                return item
            } catch (err) {
                console.log('end')
                return item
            }
        }
    },
    methods: {
        // 获取链接sku
        async onSyncPddSpec () {
            if (!this.purchaseLink || !this.getQueryVariable(this.purchaseLink, 'goods_id')) return this.$message.warning('福利品地址不正确！')
            this.spin = true
            try {
                const pddGoodsId = this.getPddGoodsId(this.purchaseLink)
                const { data: { data } } = await syncPddSpec({ pddGoodsId: pddGoodsId, type: 2 })
                console.log('data', data)
                this.pddSkuList = data
                this.spin = false
                this.onLoadPddSku(pddGoodsId)
            } catch {
                this.spin = false;
            }
        },
        async onLoadPddSku (id) {
            const { data } = await getPddSpecList({ pddGoodsId: id})
            this.pddSpecList = data.data
        },
        getPddGoodsId(url) {
            const pddGoodsId = this.getQueryVariable(url, 'goods_id')
            return pddGoodsId
        },
        getQueryVariable(url, variable) {
            const query = url.substr(url.indexOf('?') + 1);
            const vars = query.split("&");
            for (let i = 0; i < vars.length; i++) {
                const pair = vars[i].split("=");
                if (pair[0] == variable) return pair[1];
            }
            return false;
        },
        // 抖店图片
        picUrl (url) {
            return url.indexOf('http') !== -1 ? url : `https://p9-aio.ecombdimg.com/obj/${url}`
        },
        showEdit (ids) {
            this.specDialog = true
            console.log('ids', ids)
            this.ruleForm.productIds = ids
        },
        async onSubmit () {
            console.log('specRes', this.specRes)
            console.log('curSkuItem', this.curSkuItem)
            if (!this.curSkuItem) return this.$message.warning('请先选择完整的福利品属性规格！')
            if (this.curSkuItem.quantity == 0) return this.$message.warning('当前选择的福利品规格已售罄！')
            this.loading = true
            const params = {
                productIds: this.ruleForm.productIds,
                goodsId: this.getQueryVariable(this.purchaseLink, 'goods_id'),
                skuId: this.curSkuItem.skuId
            }
            try {
                const { data } = await savePddWelfareGoods(params)
                this.loading = false
                if (data.code == 0) {
                    this.specDialog = false
                    this.$message.success('关联成功')
                    this.$emit('success')
                    this.ruleForm = { productIds: [] }
                    this.purchaseLink = ''
                    this.pddSkuList = []
                    this.specRes = []
                    this.pddSpecList = []
                }
            } catch (err) {
                this.loading = false
            }
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>
<style lang="scss" scoped>
    .dialog-product-benefit {
        ::v-deep .el-dialog {
            border-radius: 10px;
            .el-dialog__header {
                padding: 15px 20px 15px;
                border-bottom: 1px solid #ededed;
                .el-dialog__title {
                    font-size: 17px;
                    font-weight: 500;
                }
            }
            .el-dialog__body {
                padding: 20px 34px 40px;
                .title-row {
                    padding: 12px 0;
                    background: #eef5ff;
                    font-weight: 500;
                }
                .content-tow {
                    padding-top: 20px;
                    margin: 0 -15px;
                    line-height: 20px;
                    .spec-image {
                        width: 35px;
                        height: 35px;
                        margin-right: 10px;
                        border-radius: 5px;
                    }
                }
            }
        }
    }
</style>