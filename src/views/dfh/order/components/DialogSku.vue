<template>
    <div class="dialog-spec-dfh-components">
        <el-dialog-custom width="1100px" :visible="visible_" @close="onClose" :fullscreen="fullscreen">
            <div class="wrapper" ref="wrapper" v-if="visible_" v-loading="spin">
                <div class="header">
                    <p class="title">关联商品规格</p>
                    <i class="el-icon-full-screen icon-screen" @click="onFullscreen"></i>
                    <i class="iconfont icon-close2" @click.stop="onClose"></i>
                </div>
                <div class="content flex flex-col">
                    <div class="px28">
                        <div class="goods-info flex items-center">
                            <div class="lbox">
                                <el-image :src="data.img || pic"></el-image>
                            </div>
                            <div class="rbox flex flex-col justify-between">
                                <p class="ellipsis-2 lh20 font-w-600">
                                    <span>商品名称：</span>
                                    <span>{{ data.name || '-' }}</span>
                                </p>
                                <p>
                                    <span>商品ID：</span>
                                    <span>{{ data.productId }}</span>
                                </p>
                            </div>
                        </div>
                        <div class="goods-path">
                            <div class="theader flex">
                                <div class="cell w68 justify-center">
                                    <span>编号</span>
                                </div>
                                <div class="cell w508 pl14">
                                    <span>采购链接</span>
                                </div>
                                <div class="cell w314 pl14">
                                    <span>链接备注</span>
                                </div>
                                <div class="cell flex-1">
                                    <span>操作</span>
                                </div>
                            </div>
                            <div class="tbody">
                                <el-form :model="ruleForm" ref="ruleForm">
                                    <div
                                        class="flex items-center"
                                        v-for="(item, index) in ruleForm.skuUrls"
                                        :key="index"
                                    >
                                        <div class="cell w68 flex justify-center">
                                            <div class="flex justify-center">
                                                <input
                                                    class="radio"
                                                    type="radio"
                                                    :checked="item.isChecked"
                                                    @change="onChangeUrl(index)"
                                                />
                                                <span>{{ index + 1 }}</span>
                                            </div>
                                        </div>
                                        <div class="cell w508">
                                            <el-form-item
                                                :prop="`skuUrls.${index}.purchaseUrl`"
                                                :rules="rules.purchaseUrl"
                                                style="margin-bottom: 0;"
                                            >
                                                <el-input
                                                    style="max-width: 410px"
                                                    size="mini"
                                                    v-model="item.purchaseUrl"
                                                    placeholder="请输入采购链接"
                                                ></el-input>
                                            </el-form-item>
                                        </div>
                                        <div class="cell w314">
                                            <el-input
                                                style="max-width: 160px"
                                                size="mini"
                                                v-model="item.hintInfo"
                                                placeholder="请输入备注"
                                                maxlength="20"
                                                show-word-limit
                                            ></el-input>
                                        </div>
                                        <div class="cell flex-1">
                                            <div class="action">
                                                <div
                                                    class="action-item"
                                                    @click.stop="onHandleSku(index,item.purchaseUrl)"
                                                >
                                                    <span>获取SKU</span>
                                                </div>
                                                <div class="line"></div>
                                                <div
                                                    class="action-item"
                                                    @click.stop="onClickDelSkuUrl(index)"
                                                >
                                                    <span>删除</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </el-form>
                            </div>
                        </div>
                        <div class="button-cell">
                            <el-button type="primary" @click.stop="onClickAddSkuUrl">
                                <span>+添加链接</span>
                            </el-button>
                        </div>
                    </div>
                    <div class="spec-box">
                        <p class="py20">
                            <span>商品规格</span>
                        </p>
                        <div class="desc">
                            <p>
                                <span>1.请确认并关联好采购商品sku，系统将按照关联好的sku进行代拍下单；</span>
                            </p>
                            <p class="mt10">
                                <span>2.采购的商品价格可能会存在波动危险，请及时关注！</span>
                            </p>
                        </div>
                        <div class="flex spec-wrap mt20">
                            <div class="spec-item flex items-center mr10">
                                <div class="cover mr15">
                                    <el-image :src="pic"></el-image>
                                </div>
                                <p class="ellipsis-1">
                                    <span>原商品规格：{{ data.spec }}</span>
                                </p>
                            </div>
                            <div
                                class="spec-item flex items-center justify-between"
                                v-if="bindData"
                            >
                                <div class="flex items-center">
                                    <div class="cover mr15">
                                        <el-image :src="bindData.thumb_url"></el-image>
                                    </div>
                                    <p class="ellipsis-1 mr10">
                                        <span>当前选中的商品规格：{{ bindData.pdd_spec }}</span>
                                    </p>
                                </div>
                                <div class="price pr30">
                                    <span>价格：¥{{ bindData.group_price }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="spec-list">
                            <div class="mt20" v-for="(item, index) in specsList" :key="index">
                                <p>
                                    <span>{{ item.spec_key }}</span>
                                </p>
                                <div class="mt10 flex flex-wrap">
                                    <div
                                        :class="`item-cell ${bindSpecs[index].group === child.spec_value_id ? 'active' : ''}`"
                                        v-for="(child,childIndex) in item.spec_value"
                                        :key="childIndex"
                                        @click.stop="onClickSpecItem(index,childIndex)"
                                    >
                                        <span>{{ child.spec_value }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <div class="flex items-center">
                        <el-button class="btn" @click.stop="onClose">
                            <span>取消</span>
                        </el-button>
                        <el-button class="btn" type="primary" @click="onClickConfirm">
                            <span>确定</span>
                        </el-button>
                    </div>
                </div>
            </div>
        </el-dialog-custom>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ElDialogCustom from '@/components/base/ElDialogCustom';
import { getPurchaseUrlAndSku, syncPddSpec, saveOrderPurchaseUrl } from '@/api/dfh/product';
import { getOrderPddSkuBySpec, getOrderPddSkuById, updateOrderPddSku } from '@/api/dfh/order';
import { isURL } from '@/util/validate';
import { throttle } from '@/scripts/utils/index';

export default {
    components: {
        ElDialogCustom,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        data: {
            type: Object,
            default: () => { },
        },
    },
    data() {
        // 表单校验 -- 采购链接
        const validates = (rule, value, callback) => {
            if (!value || value === '') {
                callback(new Error('请输入采购链接'));
            } else if (!isURL(value) || !this.getQueryVariable(value, 'goods_id')) {
                callback(new Error('请输入有效的采购链接'));
            } else {
                callback && callback();
            }
        };
        return {
            path: 'https://p9-aio.ecombdimg.com/obj/',
            spin: false,
            ruleForm: {
                // 采购链接
                skuUrls: [],
            },
            rules: {
                purchaseUrl: [ // 校验采购链接
                    {
                        validator: validates,
                        trigger: 'blur',
                    },
                ],
            },
            specsList: [], // 商品规格集合
            bindSpecs: [], // 选中的商品规格
            bindData: null,
            pddGoodsId: '',
            fullscreen: false
        };
    },
    computed: {
        ...mapGetters([

        ]),
        visible_: {
            get() {
                return this.visible;
            },
            set(newVal) {
                return this.$emit('close');
            },
        },
        //
        pic() {
            return this.data.pic && this.data.pic.indexOf('http') !== -1 ? this.data.pic : (this.path + this.data.pic);
        }
    },
    watch: {
        visible(newVal) {
            if (newVal) this.fetchData();
        },
    },
    mounted() {

    },
    methods: {
        // 窗口全屏切换
        onFullscreen () {
            const warpper = this.$refs.wrapper
            warpper.style = `height: ${this.fullscreen ? '90vh' : '100vh'}`
            this.fullscreen = !this.fullscreen
        },
        /**
         * 获取SKU
         */
        onHandleSku: throttle(async function (index, url) {
            try {
                const valid = await this.validate(`skuUrls.${index}.purchaseUrl`);
                if (valid) this.getSyncPddSpec();
            } catch (error) {

            }
        }),
        /**
         * 对表单进行校验的方法
         */
        validate(key) {
            return new Promise((resolve, reject) => {
                // 对部分表单字段进行校验的方法
                if (key) {
                    this.$refs.ruleForm.validateField(key, (valid) => {
                        if (!valid) {
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    });
                } else {
                    this.$refs.ruleForm.validate((valid) => {
                        if (valid) {
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    });
                }
            });
        },
        /**
         * 保存商品规格配置
         */
        onClickConfirm: throttle(async function () {
            this.spin = true;
            try {
                // 校验所有表单
                const valid = await this.validate();
                if (!this.bindData) {
                    for (let i = 0; i < this.bindSpecs.length; i++) {
                        const row = this.bindSpecs[i].group;
                        if (row === '') return this.$message.error(`请选择${this.specsList[i].spec_key}`);
                    }
                }
                if (valid && this.bindData) {
                    await saveOrderPurchaseUrl(this.ruleForm.skuUrls, this.data.orderId);
                    await updateOrderPddSku({
                        id: this.data.id,
                        productId: this.data.productId,
                        spec: this.data.spec,
                        bindData: this.bindSpecs,
                        goodsId: this.getPddGoodsId(),
                    });
                    this.onClose();
                    this.$emit('on-success');
                    this.$message.success('保存成功');
                }
            } finally {
                this.spin = false;
            }
        }, 1000),
        /**
         * 选择采购链接
         */
        onChangeUrl(index) {
            this.ruleForm.skuUrls.forEach((item, i) => {
                if (i === index) {
                    // 设置当前选中的采购链接
                    this.ruleForm.skuUrls[i].isChecked = true;
                } else {
                    // 其他设置为未选中
                    this.ruleForm.skuUrls[i].isChecked = false;
                }
            });
            this.bindData = null;
            this.getSyncPddSpec();
        },
        /**
         * 获取采购链接
         */
        async fetchData() {
            this.spin = true;
            try {
                const { data: { data } } = await getPurchaseUrlAndSku({ id: this.data.id });
                if (data && data.length > 0) {
                    if (data.length === 1) data[0].isChecked = true;
                    this.ruleForm.skuUrls = data;
                    await this.getSyncPddSpec();

                } else {
                    this.ruleForm.skuUrls = [
                        {
                            isChecked: false,
                            purchaseUrl: '',
                            hintInfo: '',
                        },
                    ];
                }
            } finally {
                this.spin = false;
            }
        },
        /**
         * 获取PDD商品规格
         */
        async getSyncPddSpec() {
            this.spin = true;
            try {
                const { data: { data } } = await syncPddSpec({ pddGoodsId: this.getPddGoodsId() });
                if (data) {
                    this.specsList = data;
                    this.bindSpecs = data.map(e => ({ group: '' }));

                    const pddGoodsId = this.data.pddGoodsId;
                    if (pddGoodsId && pddGoodsId === this.getPddGoodsId()) {
                        // 设置选中的商品规格
                        if (data.length > 0 && this.data.specId) {
                            const arr = this.data.specId.split(',');
                            for (var i = 0; i < arr.length; i++) {
                                this.bindSpecs[i].group = arr[i];
                            }
                        }
                        // 获取商品价格
                        if (this.data.pddSkuId) {
                            const { data: { data } } = await getOrderPddSkuById({ id: this.data.pddSkuId })
                            if (data) {
                                this.bindData = {
                                    thumb_url: data.thumb_url,
                                    group_price: data.group_price,
                                    pdd_spec: this.data.pddSpec,
                                };
                            }
                        }
                    }
                }
            } finally {
                this.spin = false;
            }
        },
        /**
         * 获取商品价格
         */
        async getSkuBySpec(pdd_spec) {
            try {
                const { data: { data } } = await getOrderPddSkuBySpec({
                    specs: JSON.stringify(this.bindSpecs),
                    goodsId: this.getPddGoodsId(),
                });
                if (data) {
                    this.bindData = {
                        thumb_url: data.thumb_url,
                        group_price: data.group_price,
                        pdd_spec: pdd_spec,
                    };
                }
            } catch (error) {

            }
        },
        /**
         * 获取PDD商品ID
         */
        getPddGoodsId() {
            const url = this.ruleForm.skuUrls.find(e => e.isChecked).purchaseUrl;
            const pddGoodsId = this.getQueryVariable(url, 'goods_id');
            return pddGoodsId;
        },
        /**
         * 获取url中的参数
         */
        getQueryVariable(url, variable) {
            const query = url.substr(url.indexOf('?') + 1);
            const vars = query.split("&");
            for (let i = 0; i < vars.length; i++) {
                const pair = vars[i].split("=");
                if (pair[0] == variable) return pair[1];
            }
            return false;
        },
        /**
         * 添加链接
         */
        onClickAddSkuUrl() {
            // if (this.ruleForm.skuUrls.length >= 5) return this.$message.error('一个商品最多添加5个采购链接');
            this.ruleForm.skuUrls.push({
                isChecked: false,
                purchaseUrl: '',
                hintInfo: '',
            });
        },
        /**
         * 删除链接
         */
        onClickDelSkuUrl(index) {
            if (this.ruleForm.skuUrls.length === 1) return this.$message.error('请至少保留一条采购链接');
            this.ruleForm.skuUrls.splice(index, 1);
        },
        /**
         * 关闭弹窗
         */
        onClose() {
            this.visible_ = false;
            this.specsList = [];
            this.ruleForm.skuUrls = [];
            this.bindData = null;
            this.fullscreen = false
        },
        /**
         * 选中商品规格
         */
        onClickSpecItem: throttle(function (index, childIndex) {
            const row = this.specsList[index].spec_value[childIndex];
            this.bindSpecs[index].group = row.spec_value_id;
            const valid = this.bindSpecs.filter(e => e.group === '');
            if (valid && !valid.length) this.getSkuBySpec(row.spec_value);
        }, 500),
    },
};
</script>

<style lang="scss" scoped>
.dialog-spec-dfh-components {
    .w68 {
        width: 68px;
    }
    .w314 {
        width: 314px;
    }
    .w140 {
        width: 140px;
    }
    .w508 {
        width: 508px;
    }
    .w566 {
        width: 566px;
    }

    .wrapper {
        width: 100%;
        height: 90vh;
        background: #ffffff;
        border-radius: 8px;
        color: #666666;
        position: relative;

        .header {
            background: #fff;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 63px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 0 28px;
            border-bottom: 1px solid #dedede;

            .title {
                font-size: 18px;
                font-weight: 600;
                flex: 1;
            }

            .icon-close2 {
                font-size: 28px;
                cursor: pointer;
            }
            .icon-screen {
                font-size: 20px;
                cursor: pointer;
                font-weight: 500;
            }
        }

        .content {
            position: absolute;
            top: 63px;
            left: 0;
            width: 100%;
            height: calc(100% - 143px);
            overflow-x: hidden;
            overflow-y: auto;
            padding-bottom: 20px;
            box-sizing: border-box;
            &::-webkit-scrollbar {
                width: 8px;
                height: 8px;
                background-color: #fff;
            }

            /* 滚动槽 */
            &::-webkit-scrollbar-track {
                border-radius: 10px;
            }

            /* 滚动条滑块 */
            &::-webkit-scrollbar-thumb {
                border-radius: 10px;
                background: #cccccc;
            }

            scrollbar-color: #cccccc #fff;
            scrollbar-width: thin;
            .goods-info {
                width: 100%;
                height: 117px;

                .lbox {
                    width: 68px;
                    height: 68px;
                    margin-right: 20px;
                    border-radius: 3px;
                }

                .rbox {
                    width: 240px;
                    height: 68px;
                }
            }

            .goods-path {
                .theader {
                    width: 100%;
                    height: 46px;
                    background: #eef5ff;
                    border-radius: 2px;
                    .cell {
                        height: 46px;
                        display: flex;
                        align-items: center;
                        font-weight: 600;
                    }
                }

                .tbody {
                    height: 150px;
                    overflow-x: hidden;
                    overflow-y: auto;
                    &::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                        background-color: #f1f1f1;
                    }

                    /* 滚动槽 */
                    &::-webkit-scrollbar-track {
                        border-radius: 10px;
                    }

                    /* 滚动条滑块 */
                    &::-webkit-scrollbar-thumb {
                        border-radius: 10px;
                        background: #cccccc;
                    }

                    scrollbar-color: #cccccc #f1f1f1;
                    scrollbar-width: thin;
                    .cell {
                        padding: 10px 0;
                        position: relative;

                        .radio {
                            position: absolute;
                            left: 5px;
                            top: 50%;
                            transform: translateY(-50%);
                        }

                        .action {
                            display: flex;
                            align-items: center;

                            .line {
                                width: 1px;
                                height: 16px;
                                background: #666666;
                                margin: 0 15px;
                            }
                            .action-item {
                                color: #1890ff;
                                font-size: 14px;
                                cursor: pointer;
                                user-select: none;
                            }
                        }
                    }
                }
            }

            .spec-box {
                margin-top: 10px;
                padding: 0 28px;
                border-top: 1px solid #dedede;
                box-sizing: border-box;
                .desc {
                    width: 100%;
                    height: 62px;
                    background: #fdf6ec;
                    border-radius: 6px;
                    padding: 0 30px;
                    box-sizing: border-box;
                    font-size: 12px;
                    color: #e6a23c;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .spec-wrap {
                    .spec-item {
                        width: calc(100% / 2);
                        height: 70px;
                        border: 1px solid #41acff;
                        box-sizing: border-box;
                        padding: 0 10px;
                        .cover {
                            width: 50px;
                            height: 50px;
                            border-radius: 4px;
                            .el-image {
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .price {
                            color: #e75454;
                            white-space: nowrap;
                        }
                    }
                }
                .spec-list {
                    .item-cell {
                        height: 30px;
                        border-radius: 3px;
                        border: 1px solid #dedede;
                        box-sizing: border-box;
                        padding: 0 5px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 10px;
                        margin-top: 10px;
                        color: #666666;
                        font-size: 12px;
                        cursor: pointer;
                        &.active {
                            background: rgb(70, 180, 109);
                            color: #fff;
                            border-color: rgb(70, 180, 109);
                        }
                    }
                }
            }
        }
        .footer {
            background: #fff;
            position: absolute;
            bottom: 0;
            left: 0;
            border-top: 1px solid #dedede;
            box-sizing: border-box;
            width: 100%;
            height: 80px;
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            padding-right: 28px;

            .btn {
                width: 80px;
            }
        }
    }
}
</style>
