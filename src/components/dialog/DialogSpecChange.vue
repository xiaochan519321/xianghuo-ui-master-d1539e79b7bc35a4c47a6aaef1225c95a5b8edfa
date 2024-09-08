<template>
    <div class='dialog-spec-change'>
        <el-dialog title="检测到抖店规格有变化" :visible.sync="specDialog" width="630px" top="15%" :close-on-click-modal="false">
            <div class="tip-title">检测到抖店规格有改动导致订单无法关联规格，请重新转换</div>
            <el-row class="title-row" :gutter="30">
                <el-col :span="10">抖店已变动规格</el-col>
                <el-col :span="14">抖店现有规格</el-col>
            </el-row>
            <el-row class="content-tow">
                <el-col :span="10">
                    <div class="flex items-center">
                        <el-popover
                            placement="top"
                            v-if="item.img"
                            width="200"
                            trigger="hover">
                            <el-image 
                                fit="cover"
                                class="spec-image"
                                :src="picUrl(item.img)">
                            </el-image>
                            <el-image 
                                fit="cover"
                                slot="reference"
                                class="spec-image"
                                :src="picUrl(item.img)"
                                :preview-src-list="[picUrl(item.img)]">
                            </el-image>
                        </el-popover>
                        <div class="flex-1">{{item.specName}}；</div>
                    </div>
                </el-col>
                <el-col :span="14">
                    <div class="flex items-center">
                        <el-popover
                            placement="top"
                            v-if="curSkuItem.pic"
                            width="200"
                            trigger="hover">
                            <el-image 
                                fit="cover"
                                class="spec-image"
                                :src="picUrl(curSkuItem.pic)">
                            </el-image>
                            <el-image 
                                fit="cover"
                                slot="reference"
                                class="spec-image"
                                :style="{marginRight: specList.length > 1 ? '0' : '10px'}"
                                :src="picUrl(curSkuItem.pic)"
                                :preview-src-list="[picUrl(curSkuItem.pic)]">
                            </el-image>
                        </el-popover>
                        <div class="flex-1 flex">
                            <el-select v-model="specRes[`spec_detail_id${index + 1}`]" size="small" placeholder="请选择对应规格" v-for="(item, index) in specList" :key="index" style="margin-left: 10px;" class="flex-1">
                                <el-option
                                    v-for="spec in item"
                                    :key="spec.id"
                                    :label="spec.name"
                                    :value="spec.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="specDialog = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit" :loading="loading">开始转换</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { updateOrderSkuId } from '@/api/dfh/order';
export default {
    components: {},
    watch: {
    },
    data() {
        const that = this
        return {
            specDialog: false,
            ruleForm: {},
            loading: false,
            specList: [],
            item: {},
            specRes: {}
        }
    },
    computed: {
        curSkuItem () {
            let result = {}
            const specCheck = Object.keys(this.specRes)
            try {
                if (specCheck.length === 0 || specCheck.length != this.specList.length) return result
                this.list.forEach(item => {
                    let check = true
                    for (let i = 0; i < specCheck.length; i++) {
                        if (this.specRes[specCheck[i]] != item[specCheck[i]]) {
                            check = false
                            break
                        }
                    }
                    if (check == true) {
                        result = item
                        throw Error('end')
                    }
                })
            } catch (err) {
                console.log('err')
                return result
            }
        }
    },
    methods: {
        // 抖店图片
        picUrl (url) {
            return url.indexOf('http') !== -1 ? url : `https://p9-aio.ecombdimg.com/obj/${url}`
        },
        showEdit (list, item) {
            this.specDialog = true
            this.item = item
            this.list = list
            console.log('list', list)
            this.specList = this.loadSpecList(list)
        },
        loadSpecList (list) {
            const specList = []
            list.forEach((item, index) => {
                item.specs.forEach((spec, sepcIndex) => {
                    if (!specList[sepcIndex]) {
                        specList[sepcIndex] = [spec]
                    } else {
                        const curSpec = specList[sepcIndex].map(item => item.id)
                        if (curSpec.indexOf(spec.id) == -1) {
                            specList[sepcIndex].push(spec)
                        }
                    }

                })
            })
            return specList
        },
        async onSubmit () {
            if (!this.curSkuItem.sku_id) {
                this.$message.warning('请先选择店铺现有规格!')
                return
            }
            this.loading = true
            let spec = this.curSkuItem.specs.map(item => item.name)
            const params = {
                newSkuId: this.curSkuItem.sku_id,
                spec: spec.join('&&'),
                oldSkuId:  this.item.skuId,
                productId: this.item.id
            }
            console.log('params', params)
            try {
                const { data } = await updateOrderSkuId(params)
                this.loading = false
                if (data.code == 0) {
                    this.specDialog = false
                    this.specRes = {}
                    this.$message.success('转换成功')
                    this.$emit('success', params.newSkuId)
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
    .dialog-spec-change {
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
                .tip-title {
                    font-size: 12px;
                    margin-bottom: 20px;
                    color: red;
                    margin-left: -15px;
                }
                .title-row {
                    padding: 12px 10px;
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