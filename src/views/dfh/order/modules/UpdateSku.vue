<template>
    <div class="execution">
        <el-collapse v-model="activeNames" v-loading="loadingFlag" element-loading-text="正在执行，请稍等">
            <el-collapse-item name="1">
                <template slot="title">
                    <strong>采购链接</strong>
                </template>
                <div
                    class="table_c"
                    style="background-color: #eef5ff;height: 50px;width: 100%;line-height: 50px;font-weight: 700;"
                >
                    <div
                        class="cell"
                        style="display: inline-block;text-align: left;width: 540px; margin-left: 50px;"
                    >采购链接</div>
                    <div
                        class="cell"
                        style="display: inline-block;text-align: left;width: 120px; margin-left: 50px;"
                    >提示信息</div>
                </div>
                <br />
                <template v-for="(item,index) in newPuData">
                    <el-row :gutter="30" :key="index">
                        <el-col :sm="1" :md="1" :lg="1">
                            <template>
                                <input
                                    type="radio"
                                    name="girl"
                                    :value="item.id"
                                    :id="item.id"
                                    :checked="item.isChecked"
                                    @change="checkUrl(index)"
                                />
                            </template>
                        </el-col>
                        <el-col :sm="17" :md="17" :lg="17">
                            <el-input
                                v-if="saveFlag"
                                v-model="item.purchaseUrl"
                                type="text"
                                clearable
                                placeholder="请输入采购链接"
                            />
                            <span v-else>{{item.purchaseUrl}}</span>
                        </el-col>
                        <el-col :sm="3" :md="3" :lg="3">
                            <el-input
                                v-if="saveFlag"
                                v-model="item.hintInfo"
                                type="text"
                                clearable
                                placeholder="请输入备注"
                            />
                            <el-tag v-else size="mini" type="primary">{{item.hintInfo}}</el-tag>
                        </el-col>
                        <el-col :sm="2" :md="2" :lg="2">
                            <el-button v-if="saveFlag" @click="delRows(index)" type="danger" circle>
                                <i class="el-icon-minus"></i>
                            </el-button>
                        </el-col>
                    </el-row>
                    <br />
                </template>
                <el-button @click="addRows()" type="primary">
                    <i class="el-icon-plus"></i>添加链接
                </el-button>
                <el-button v-if="editFlag" @click="editRows" type="primary">
                    <i class="el-icon-edit"></i>编辑链接
                </el-button>
                <el-button v-if="saveFlag" @click="saveRows" type="primary">
                    <i class="el-icon-check"></i>提交链接
                </el-button>
                <el-button v-if="saveFlag" @click="cancelEditRows" type="primary">
                    <i class="el-icon-check"></i>取消编辑
                </el-button>
                <el-button @click="syncPddSpec" type="primary">
                    <i class="el-icon-refresh"></i>同步采购商品规格
                </el-button>
            </el-collapse-item>
            <el-collapse-item name="2">
                <template slot="title">
                    <strong>商品规格</strong>
                </template>
                <el-alert
                    title="1、请确认并关联好采购商品sku，系统将按照关联好的sku进行代下单 ；"
                    type="warning"
                    description
                    :closable="false"
                ></el-alert>
                <el-alert
                    title="2、采购的商品价格可能会存在波动风险，请及时关注！"
                    type="warning"
                    description
                    :closable="false"
                ></el-alert>
                <br />
                <div style="display: flex;">
                    <div
                        style="border: 1px solid #67c23a;border-radius: 2px;padding:5px 5px 5px 5px;width:49.5%;"
                    >
                        <div style="cursor:pointer;" @click="openPreview(row.pic)">
                            <avue-avatar
                                shape="square"
                                :size="64"
                                :src="row.pic && row.pic.indexOf('http')!==-1 ? row.pic : (`https://p9-aio.ecombdimg.com/obj/`+row.pic)"
                            ></avue-avatar>
                            原商品规格： {{row.spec}}
                        </div>
                    </div>
                    <br />
                    <div style="width:1%;"></div>
                    <div
                        style="border: 1px solid rgb(70, 180, 109);border-radius: 2px;padding:5px 5px 5px 5px;width:49.5%;"
                    >
                        <div style="cursor:pointer;" @click="openPreview(row.thumbUrl)">
                            <avue-avatar shape="square" :size="64" :src="row.thumbUrl"></avue-avatar>
                            已关联规格：{{row.pddSpec}}
                        </div>
                    </div>
                </div>
                <center>
                    <h2 style="color:#1E90FF;">价格：￥{{bindPrice}}</h2>
                    <div style="cursor:pointer;" @click="openPreview(bindThumbUrl)">
                        <avue-avatar shape="square" :size="64" :src="bindThumbUrl"></avue-avatar>
                    </div>
                </center>
                <div v-for="(item,index) in specData" :key="index">
                    <h3>{{item.spec_key}}</h3>
                    <template v-for="(child,childIndex) in item.spec_value">
                        <el-radio-group
                            :key="childIndex"
                            v-model="bindData[index].group"
                            @change="bindClick(index,childIndex)"
                            style="margin-bottom: 5px"
                        >
                            <el-radio-button
                                :label="child.spec_value_id"
                                style="cursor:pointer;margin-right: 10px;"
                            >
                                <span>{{child.spec_value}}</span>
                            </el-radio-button>
                        </el-radio-group>
                    </template>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import { getPddProductSpecShow, getPddSpecByUrlId, getOrderPddSkuById, updateOrderPddSku, getOrderPddSkuBySpec } from '@/api/dfh/order'
import { getPurchaseUrlAndSku, saveOrderPurchaseUrl, editPurchaseUrl, syncPddSpec } from '@/api/dfh/product'

export default {
    name: 'updateSku',
    data() {
        return {
            activeNames: ['1', '2'],
            row: {},
            specData: [],
            bindData: [],
            bindPrice: '0.00',
            bindThumbUrl: '',
            puData: [],
            newPuData: [],
            timestamp: '',
            checkedValue: '',
            editFlag: true,
            saveFlag: false,
            pddGoodsId: '',
            checkUrlId: '',
            loadingFlag: false
        }
    },
    watch: {
        row: 'getPddProductSpecShow',
        timestamp: 'getPurchaseUrls'
    },
    methods: {
        openPreview(img) {
            if (img && img.indexOf("http") === -1) img = 'https://p9-aio.ecombdimg.com/obj/' + img
            this.$ImagePreview([{ url: img }]);
        },
        getQueryVariable(url, variable) {
            var query = url.substr(url.indexOf('?') + 1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) { return pair[1]; }
            }
            return (false);
        },
        /**
         * 获取商品规格
         */
        async getPddProductSpecShow() {
            let than = this;
            than.pddGoodsId = than.row.pddGoodsId
            if (!than.saveFlag) than.getPurchaseUrls();
            if (than.row.pddGoodsId) {
                this.syncPddSpec();
                // 获取价格
                if (than.row.pddSkuId) {
                    const { data: { data } } = await getOrderPddSkuById({ "id": than.row.pddSkuId })
                    than.bindPrice = data.group_price;
                    than.bindThumbUrl = data.thumb_url;
                }
            }
        },
        /**
         * 获取采购链接
         */
        async getPurchaseUrls() {
            try {
                this.checkUrlId = this.row.purchaseUrlId;
                const { data: { data } } = await getPurchaseUrlAndSku({ id: this.row.id });
                if (data && data.length > 0) {
                    this.puData = data;
                    this.newPuData = data;
                }
            } catch (error) {

            }
        },
        /**
         * 同步PDD商品规格
         */
        syncPddSpec() {
            if (!this.pddGoodsId) return this.$message.error('请先选择采购链接');
            this.loadingFlag = true
            syncPddSpec({ "pddGoodsId": this.pddGoodsId }).then(data => {
                if (data.data.code !== 0) return this.$message.error("操作失败," + data.msg);
                this.specData = data.data.data;
                this.bindData = data.data.data.map(e => ({
                    group: '',
                }));
                //设置打开选中
                if (this.specData && this.specData.length > 0 && this.row.specId) {
                    const arr = this.row.specId.split(',');
                    for (var i = 0; i < arr.length; i++) {
                        this.bindData[i].group = arr[i];
                    }
                }
            }).finally(() => {
                this.loadingFlag = false
            });
        },
        getPddSpecByUrlId(purchaseUrlId) {
            let than = this;
            than.loadingFlag = true
            getPddSpecByUrlId({ "purchaseUrlId": purchaseUrlId }).then(data => {
                than.loadingFlag = false
                than.specData = data.data.data;
                than.bindData = [];
                //设置打开选中
                if (null == than.row.specId) {
                    for (var i = 0; i < than.specData.length; i++) {
                        than.bindData.push({ "group": undefined });
                    }
                }
                var arr = than.row.specId.split(',');
                if (arr.length == than.specData.length) {
                    for (var i = 0; i < arr.length; i++) {
                        than.bindData.push({ "group": arr[i] });
                    }
                } else {
                    for (var i = 0; i < than.specData.length; i++) {
                        than.bindData.push({ "group": undefined });
                    }
                }

                //获取价格
                getOrderPddSkuById({ "id": than.row.pddSkuId }).then(data => {
                    than.bindPrice = data.data.data.group_price;//99api
                    than.bindThumbUrl = data.data.data.thumb_url;
                });

            });
        },
        ok() {
            if (this.saveFlag) return this.$message.error('请先提交或取消编辑采购链接');
            if (!this.newPuData.length) return this.$message.error('请先添加采购链接');
            // if (undefined == this.bindData[0].group) {
            //     return this.$message.error('请选择' + this.specData[0].spec_key)
            // }
            // if (this.specData.length == 2) {
            //     if (undefined == this.bindData[1].group) {
            //         return this.$message.error('请选择' + this.specData[1].spec_key)
            //     }
            // }
            for (let i = 0; i < this.bindData.length; i++) {
                const row = this.bindData[i].group;
                if (row === '') return this.$message.error(`请选择${this.specData[i].spec_key}`);
            }
            updateOrderPddSku({
                id: this.row.id,
                productId: this.row.productId,
                spec: this.row.spec,
                bindData: this.bindData,
                goodsId: this.pddGoodsId,
                purchaseUrlId: this.checkUrlId,
            }).then(data => {
                this.$message.success('保存成功')
                this.$emit('ok');
                this.row = {};
            });
        },
        /**
         * 选中商品价格
         */
        bindClick(index, childIndex) {
            this.bindData[index].group = this.specData[index].spec_value[childIndex].spec_value_id;
            this.getOrderPddSkuBySpec();
        },
        /**
         * 获取商品价格
         */
        getOrderPddSkuBySpec() {
            getOrderPddSkuBySpec({
                specs: JSON.stringify(this.bindData),
                goodsId: this.pddGoodsId,
            }).then(res => {
                const { data: { data } } = res;
                if (data) {
                    this.bindPrice = data.group_price;
                    this.bindThumbUrl = data.thumb_url;
                }
            });
        },
        /**
         * 选择采购链接
         */
        checkUrl(index) {
            let than = this
            let urlId = null;
            for (let i = 0; i < than.newPuData.length; i++) {
                than.newPuData[i].isChecked = (i === index)
                if (than.newPuData[i].isChecked) {
                    urlId = than.newPuData[i].id
                    than.checkUrlId = than.newPuData[i].id
                    than.pddGoodsId = than.newPuData[i].goodsId
                }
            }
            if (!than.pddGoodsId) {
                than.pddGoodsId = this.getQueryVariable(this.newPuData[index].purchaseUrl, 'goods_id')
            }
            // if (!than.saveFlag) than.getPddSpecByUrlId(urlId)
        },
        editRows() {
            this.saveFlag = true
            this.editFlag = false
        },

        cancelEditRows() {
            this.saveFlag = false
            this.editFlag = true
            this.newPuData = []
            for (let i = 0; i < this.puData.length; i++) {
                this.puData[i].isChecked = this.puData[i].goodsId == this.pddGoodsId
                if (this.puData[i].isChecked) {
                    this.checkUrlId = this.puData[i].id
                }
                this.newPuData.push(this.puData[i])
            }
        },
        addRows() {
            if (this.newPuData.length === 5) {
                return this.$message.error('一个商品最多添加5个采购链接')
            }
            this.saveFlag = true
            this.editFlag = false
            let isCheck = this.newPuData.length === 0
            this.newPuData.push({
                "id": '',
                "purchaseUrl": '',
                "hintInfo": '采购链接',
                "isChecked": isCheck,
                "productId": this.productId,
            })
        },
        delRows(index) {
            this.newPuData.splice(index, 1);
        },
        /**
         *  提交链接
         */
        saveRows() {
            let than = this
            if (!this.newPuData.length) return this.$message.error('请添加采购链接')
            for (let i = 0; i < than.newPuData.length; i++) {
                const row = than.newPuData[i];
                if (!this.getQueryVariable(row.purchaseUrl, 'goods_id')) {
                    return this.$message.error('请输入有效的采购链接');
                }
                row.goodsId = this.getQueryVariable(row.purchaseUrl, 'goods_id');
            }
            than.loadingFlag = true
            let orderId = this.row.orderId
            saveOrderPurchaseUrl(than.newPuData, orderId).then(data => {
                than.loadingFlag = false
                if (data.data.code !== 0) return this.$message.error("操作失败," + data.msg);
                let res = data.data.data
                than.puData = []
                than.newPuData = []
                for (let i = 0; i < res.length; i++) {
                    if (res[i].isChecked) {
                        than.checkUrlId = res[i].id
                    }
                    than.puData.push(res[i])
                    than.newPuData.push(res[i])
                }
                this.$message.success('保存成功')
                this.saveFlag = false
                this.editFlag = true
                this.pddGoodsId = res.find(e => e.isChecked).goodsId;
            }).finally(() => {
                than.loadingFlag = false
            });
        },
    }
}
</script>

<style lang="scss" scoped>
s {
    margin-bottom: 20px;
    border: 1px solid red;
}
</style>
