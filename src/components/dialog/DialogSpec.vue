<template>
    <div class="dialog-spec-dfh-components">
        <el-dialog-custom width="1200px" :visible="visible_" :fullscreen="fullscreen">
            <div class="wrapper" ref="warpper" v-loading="spin">
                <div class="header">
                    <p class="title">关联商品规格</p>
                    <i class="el-icon-full-screen icon-screen" @click="onFullscreen"></i>
                    <i class="iconfont icon-close2" @click.stop="onClose"></i>
                </div>
                <div class="content px20">
                    <div class="goods-info flex items-center">
                        <div class="lbox">
                            <el-image :src="data.img"></el-image>
                        </div>
                        <div class="rbox flex flex-col justify-between">
                            <p class="ellipsis-2 title">
                                <span>商品名称：</span>
                                <el-tooltip effect="dark" placement="top">
                                    <span>{{ data.name }}</span>
                                    <div slot="content" class="lh22" style="width: 200px;">
                                        <span>{{ data.name }}</span>
                                    </div>
                                </el-tooltip>
                            </p>
                            <p>
                                <span>商品ID：</span>
                                <span>{{ data.id }}</span>
                            </p>
                        </div>
                        <div class="flex-1 text-right self-end pb10">
                            <el-button type="primary"  @click="onAliRecommend">1688包邮商品推荐</el-button>
                        </div>
                    </div>
                    <div class="goods-path">
                        <div class="theader flex">
                            <div class="cell w68 justify-center">
                                <span>编号</span>
                            </div>
                            <div class="cell w462 pl14">
                                <span>
                                    采购链接/ID
                                    <el-tooltip class="item" content="如提示采购链接未开放访问权限，则需要更换链接" placement="right" effect="light">
                                        <i class="el-icon-question" style="font-size: 18px;"></i>
                                    </el-tooltip>
                                </span>
                            </div>
                            <div class="cell w180">
                                <span>所属平台</span>
                            </div>
                            <div class="cell w180 pl14">
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
                                            <span>链接{{ index + 1 }}</span>
                                        </div>
                                    </div>
                                    <div class="cell w462" :class="{'sku-url-input': item.platform == 0 || item.platform == 1 || item.platform == 2}">
                                        <el-form-item
                                            :prop="`skuUrls.${index}.purchaseUrl`"
                                            :rules="rules.purchaseUrl"
                                            style="margin-bottom: 0;"
                                        >
                                            <el-input
                                                style="max-width: 410px; margin-right: 15px;"
                                                :class="{'border-r-none': (item.platform == 0 || item.platform == 1 || item.platform == 2) && item.purchaseUrl}"
                                                size="mini"
                                                v-model="item.purchaseUrl"
                                                placeholder="请输入1688/淘特链接"
                                                @blur="onBlur(item.purchaseUrl,item)"
                                                @input="onLinkInput({url: item.purchaseUrl, index, item})"
                                            >
                                                <template slot="append" v-if="item.purchaseUrl">
                                                    <!--
                                                      <el-button type="text" size="mini" @click="onViewFreight(item.purchaseUrl)">查看运费模版</el-button>  
                                                    -->
                                                    <el-button v-if="item.platform == 1 || item.platform == 2" type="text" size="mini" @click="toDetail(item.purchaseUrl)">查看详情</el-button>
                                                    <template v-else-if="item.platform == 0 && hasToolsAuth">
                                                        <el-tooltip effect="dark" popper-class="placeOrderModel-popper" content="对于本地获取为了让账号减少风控建议获取到sku之后不要关闭页面看一看评论,收藏商品,跟客服聊天 等不同操作 此行为是更像正常人去查看商品详情，机械化的重复查看关联商品非常容易被风控仅支持采购未发货退款订单去使用" placement="left">
                                                            <el-button type="text" size="mini" @click="loadSku(item.purchaseUrl)">本地获取</el-button>
                                                        </el-tooltip>
                                                        <el-button type="text" size="mini" v-if="wxparseOpened === false" @click="openWxparse(item.purchaseUrl)">开启微信获取</el-button>
                                                        <el-button type="text" size="mini" v-if="wxparseOpened === true" @click="closeWxparse(item.purchaseUrl)">关闭微信获取</el-button>
                                                    </template> 
                                                </template>
                                            </el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="cell w180">
                                        <span class="mr10" style="display: inline-block; width: 80px;">{{systemLabel(item)}}</span>
                                        <!-- <el-button size="mini" type="primary" @click="onWithGoods(index)">搜同款</el-button> -->
                                    </div>
                                    <div class="cell w180">
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
                                                v-if="item.platform == 3"
                                                class="action-item"
                                                @click.stop="onSyncTaoteSpec(index, item.purchaseUrl)"
                                            >
                                                <span>获取淘特SKU</span>
                                            </div>
                                            <div
                                                v-else-if="item.platform == 2"
                                                class="action-item"
                                                @click.stop="onSync1688Spec(index, item.purchaseUrl)"
                                            >
                                                <span>获取1688SKU</span>
                                            </div>
                                            <div
                                                v-else-if="item.platform == 1"
                                                class="action-item"
                                                @click.stop="onSyncSupplierSpec(index, item.purchaseUrl)"
                                            >
                                                <span>获取供应链SKU</span>
                                            </div>
                                            <div
                                                v-else-if="item.platform == 0"
                                                class="action-item"
                                                @click.stop="onSyncPddSpec(index, item.purchaseUrl)"
                                            >
                                                <span>获取SKU</span>
                                            </div>
                                            <div
                                                v-else
                                                class="action-item"
                                                @click.stop="onSyncPddSpec(index, item.purchaseUrl)"
                                            >
                                                <span>获取SKU</span>
                                            </div>
                                            <div class="line"></div>
                                            <div
                                                class="action-item"
                                                @click.stop="onUpdateSkuUrl(index, item.purchaseUrl)"
                                            >
                                                <span>更新SKU</span>
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
                        <el-button type="primary" v-if="autoBindProductShow">
                            <i class="el-icon-magic-stick"></i>
                            <span @click.stop="onClickAutoBindSpecs">自动关联规格</span>
                        </el-button>
                        <span style="color:red;">   请检查上家商品属性自动关联是否正确</span>
                        <el-button type="default" style="float: right;">
                            <span @click.stop="onClearSpecs">清空采购规格</span>
                        </el-button>
                        <!-- <el-button type="primary">
                            <span>同步抖店规格</span>
                        </el-button>-->
                        <!-- <el-button type="primary">
                            <span>定位当前规格</span>
                        </el-button>-->
                    </div>
                    <div class="spec-box mt10">
                        <div class="theader flex">
                            <div class="cell w45"></div>
                            <div class="cell" :class="specHasMuti ? 'w270' : 'w330'">
                                <span>店铺商品属性</span>
                            </div>
                            <div class="cell w140 pl30">
                                <span>销售价格</span>
                            </div>
                            <div class="cell w130 pl20">
                                <span>链接编号</span>
                                <el-tooltip class="item" content="请在下方切换采购链接" placement="right" effect="light">
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                            </div>
                            <div class="cell w140 pl30">
                                <span>采购价格</span>
                            </div>
                            <div class="cell w45"></div>
                            <div class="cell flex-1">
                                <span>上家商品属性</span>
                            </div>
                        </div>
                        <div class="tbody pt10">
                            <div class="item pl20" :class="{active: item.current}" v-for="(item, index) in specsList" :key="index">
                            <!-- <div class="item" v-for="(item, index) in specsList" :key="index"> -->
                                <i class="el-icon-caret-right current-icon" v-if="item.current"></i>
                                <div class="flex items-center">
                                    <div class="cell ml5 w45">
                                        <el-popover
                                            placement="top"
                                            v-if="item.pic"
                                            width="200"
                                            trigger="hover">
                                            <el-image 
                                                fit="cover"
                                                class="spec-image"
                                                :src="picUrl(item)">
                                            </el-image>
                                            <el-image 
                                                fit="cover"
                                                slot="reference"
                                                class="spec-image"
                                                :src="picUrl(item)"
                                                :preview-src-list="[picUrl(item)]">
                                            </el-image>
                                        </el-popover>
                                    </div>
                                    <div class="cell" :class="specHasMuti ? 'w320' : 'w380'">
                                        <div class="pr-28 pl0">
                                            <p
                                                class="lh22 title"
                                                v-for="(child, childIndex) in item.specs"
                                                :key="childIndex"
                                            >
                                                <span>{{ child.m_name }}：{{ child.name }}；</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="cell w140 pl16">
                                        <span>{{ (item.price/100).toFixed(2) }}</span>
                                    </div>
                                    <div class="cell w130">
                                        <el-select
                                            size="mini"
                                            v-model="activeList[index].pddGoodsId"
                                            placeholder="请选择链接编号"
                                            @change="urlOnChange(index,activeList)"
                                            clearable
                                        >
                                            <el-option
                                                v-for="(child,childIndex) in purchaseLinks"
                                                :key="childIndex"
                                                :label="child.label"
                                                :value="child.value"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div class="cell w140 pl16">
                                        <span class="inventory-tip">{{ currentSpec(activeList[index]).quantity == 0 ? '已售罄' : '' }}</span>
                                        <span>{{ currentSpec(activeList[index]).groupPrice }}</span>
                                    </div>
                                    <div class="cell w45">
                                        <el-popover
                                            placement="top"
                                            v-if="currentSpec(activeList[index])"
                                            width="200"
                                            trigger="hover">
                                            <el-image 
                                                fit="cover"
                                                class="spec-image"
                                                :src="currentSpec(activeList[index]).thumbUrl">
                                            </el-image>
                                            <el-image 
                                                fit="cover"
                                                class="spec-image"
                                                slot="reference"
                                                :src="currentSpec(activeList[index]).thumbUrl" 
                                                :preview-src-list="[currentSpec(activeList[index]).thumbUrl]">
                                            </el-image>
                                        </el-popover>
                                    </div>
                                    <div class="cell items-center">
                                        <div
                                            class="spec-item"
                                            v-for="(spec, specIndex) in currentSpecList[activeList[index].pddGoodsId]"
                                            v-if="activeList[index].specs[specIndex]"
                                            :key="specIndex"
                                            style="margin-top:10px"
                                        >
                                            <el-select
                                                size="mini"
                                                v-model="activeList[index].specs[specIndex].pddSpecValueId"
                                                placeholder="请选择"
                                                @change="onChange(index,specIndex)"
                                            >
                                                <el-option
                                                    v-for="(child,childIndex) in spec.values"
                                                    :key="childIndex"
                                                    :label="child.specValue"
                                                    :value="child.specValueId"
                                                ></el-option>
                                            </el-select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <div>
                        <el-button style="width: 94px;" @click.stop="onClose">
                            <span>取消</span>
                        </el-button>
                        <el-button
                            type="primary"
                            style="width: 94px;margin-left: 20px;"
                            @click.stop="onClickConfirm"
                        >
                            <span>确定</span>
                        </el-button>
                    </div>
                </div>
            </div>
        </el-dialog-custom>
        <dialog-spec-change ref="dialogSpecChange" @success="specChangeSuccess"/>
        <dialog-with-goods ref="dialogWithGoods" @success="goodsCheckeSuccess"/>
        <dialog-freight ref="dialogFreight" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ElDialogCustom from '@/components/base/ElDialogCustom';
import { getPurchaseUrl, syncPddSpec, syncSupplierSpec, sync1688DfSpec, syncSpecTaote, updatePddSpec, getURLGoodsId} from '@/api/dfh/product';
import { throttle, debounce } from '@/scripts/utils/index';
import DialogSpecChange from './DialogSpecChange'
import DialogWithGoods from './DialogWithGoods'
import DialogFreight from './DialogFreight'
import { lib } from 'crypto-js';

export default {
    components: {
        ElDialogCustom,
        DialogSpecChange,
        DialogWithGoods,
        DialogFreight,
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
                callback(new Error('请输入采购链接/ID'));
            }
            // else if (!isURL(value) || !this.getQueryVariable(value, 'goods_id')) {
            //     callback(new Error('请输入有效的采购链接/ID'));
            // }
            else {
                callback && callback();
            }
        };
        return {
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
            specsList: [], // 抖店商品规格
            purchaseLinks: [], // 采购链接选项
            activeList: [], // 已经绑定的采购链接
            pddSpecList: [], // 拼多多商品规格
            spin: false,
            currentSpecList: {},
            pddSpecsSelected: {
                pddSpecKeyId: '',
                pddSpecValueId: '',
            },
            value: '',
            fullscreen: false,
            backupData: {},
            wxparseOpened: 0
        };
    },
    computed: {
        ...mapGetters(['menu']),
        hasToolsAuth () {
            if (this.menu) {
                return this.menu.filter(item => item.id === 10217).length
            }
            return false
        },
        visible_: {
            get() {
                return this.visible;
            },
            set(newVal) {
                return this.$emit('close');
            },
        },
        // 计算当前选中的PDD商品规格采购价格
        currentSpec() {
            return function (val) {
                let specItem = '';
                if (val.pddGoodsId) {
                    val.specs.forEach(item => {
                        val.specs.forEach(row => {
                            val.specs.forEach(li => {
                                if (this.pddSpecList[val.pddGoodsId]) {
                                    if (row.pddSpecValueId !== li.pddSpecValueId){
                                        const spec = [item.pddSpecValueId, row.pddSpecValueId, li.pddSpecValueId].join(',');
                                        const data = this.pddSpecList[val.pddGoodsId].find(e => e.spec === spec);
                                        if (data) specItem = data;
                                    } else if (item.pddSpecValueId !== row.pddSpecValueId) {
                                        const spec = [item.pddSpecValueId, row.pddSpecValueId].join(',');
                                        const data = this.pddSpecList[val.pddGoodsId].find(e => e.spec === spec);
                                        if (data) specItem = data;
                                    } else {
                                        // 只有一个规格选项
                                        const data = this.pddSpecList[val.pddGoodsId].find(e => e.spec === row.pddSpecValueId);
                                        if (data) specItem = data;
                                    }
                                }
                            })
                        });
                    });
                }
                return specItem;
            };
        },
        specHasMuti () {
            try {
                let res = false
                for (let i = 0; i < this.activeList.length; i++) {
                    try {
                        if (this.currentSpecList[this.activeList[i].pddGoodsId].length > 1) {
                            res = true
                            break
                        }
                    } catch (err) {
                        continue
                    }
                }
                return res
            } catch (error) {
                return false
            }
        },
        // 判断当前链接数组中是否存在供应链平台链接或1688链接或淘特链接，存在则关闭自动关联功能
        autoBindProductShow () {
            try {
                return this.ruleForm.skuUrls.filter(item => item.platform === 1 || item.platform === 2 || item.platform === 3).length ? false : true
            } catch (err) {
                return true
            }
        },
    },
    watch: {
        // 监听弹窗每次显示出来
        visible(newVal) {
            if (newVal) {
                this.backupData = this.data
                this.initData()
            }
        },
    },
    methods: {
        // 1688包邮商品推荐
        onAliRecommend () {
            const url = 'https://mindx.1688.com/fx/wydf/dwvgj16p7/index.html?spm=a260k.dacugeneral.pc_index_taomai.3.663335e4a5NSIJ&wh_pha=true&wh_pid=1873644&__pageId__=1873644&topOfferIds=681235488624,651124753812,676147401287'
            if (window.electron) {
                // 发送到electron进行跳转
                window.electron.send({key: 'chromeUrl', url: url})
            } else {
                window.open(url)
            }
        },
        // 抖店图片
        picUrl (row) {
            return row.pic && row.pic.indexOf('http') !== -1 ? row.pic : `https://p9-aio.ecombdimg.com/obj/${row.pic}`
        },
        // 窗口全屏切换
        onFullscreen () {
            const warpper = this.$refs.warpper
            warpper.style = `height: ${this.fullscreen ? '89vh' : '100vh'}`
            this.fullscreen = !this.fullscreen
        },
        // 采购链接输入框失去焦点
        onBlur(url, row) {
            let gid = this.getPddGid(url)
            if (gid) {
                // 拼多多模式规格
                row.goodsId = gid
            } else {
                // 供应链模式规格
                row.goodsId = url;
            }
        },
        getPddGid (url) {
            let gid = this.getQueryVariable(url, 'goods_id') || this.getQueryVariable(url, 'gid')
            if (url.indexOf('1688.com') > -1) {
                // 1688,截取offer/与.html之间的商品ID
                const cutStart = url.indexOf('offer/')
                const cutEnd = url.indexOf('.html')
                gid = cutStart > -1 && cutEnd > -1 ? url.substring(cutStart + 6, cutEnd) : ''
            } else if (url.indexOf('market.m.taobao.com') > -1) {
                // 淘特获取id
                gid = this.getQueryVariable(url, 'id')
            } else if (gid && gid.indexOf('#') > -1) {
                // 拼多多
                gid = gid.split('#')[0]
            }
            // 都不满足的情况就为供应链
            return gid
        },
        //初始化
        async initData() {
            this.spin = true;
            try {
                // 获取采购链接
                await this.fetchData();
                // 获取抖店商品属性
                await this.getData();
                // 获取上家商品规格
                await this.getSyncPddSpec();
            } finally {
                this.spin = false;
            }
        },
        /**
         * 获取采购链接
         */
        async fetchData() {
            try {
                const { data: { data } } = await getPurchaseUrl({ productId: this.backupData.id });
                if (data && data.length > 0) {
                    this.ruleForm.skuUrls = data.map(e => ({
                        ...e,
                        pddGoodsId: e.goodsId,
                    }));
                    this.getPurchaseLinks();
                } else {
                    this.ruleForm.skuUrls = [
                        {
                            platform: null,
                            purchaseUrl: '',
                            hintInfo: '',
                            goodsId: '',
                            pddGoodsId: '',
                        },
                    ];
                }
            } finally {}
        },
        /**
         * 获取抖店商品属性
         */
        async getData() {
            try {
                const { data: { data } } = await this.$API.getOrderStatus({
                    productId: this.backupData.id,
                    shopId: this.backupData.shopId,
                });
                let item = null
                if (this.backupData.skuId && data && data.length > 0) {
                    // 如果有skuid那就把对应的规格置顶
                    for(let i = 0; i < data.length; i++) {
                        if (data[i].sku_id == this.backupData.skuId) {
                            item = {...data[i], current: 1}
                            data.splice(i, 1)
                            break
                        }
                    }
                    console.log('item', item)
                    item && data.unshift(item)
                    this.specsList = data
                    if (!item) {
                        console.log('抖店规格已经变更')
                        this.$nextTick(() => {
                            this.$refs.dialogSpecChange.showEdit(data, this.backupData)
                        })
                    }
                } else {
                    this.specsList = data
                }
                this.activeList = data.map(e => ({
                    pddGoodsId: '',
                    specKeyId: '',
                    specValueId: '',
                    specs: [],
                }));
                this.getProductSpecsRelevantList();
            } finally {

            }
        },
        // 更新都点skuid成功后
        specChangeSuccess (skuid) {
            this.backupData = {
                ...this.backupData,
                skuId: skuid
            }
            this.initData()
            this.$emit('success')
        },
        /**
         * 笛卡尔积算法
         */
        descartes(array) {
            // 商品属性只有1个选项时
            if (array.length < 2) {
                return array[0].values.map(e => ([{
                    specKeyId: array[0].id,
                    specValueId: e.id,
                    name: array[0].name,
                    value: e.name,
                }]));
            }
            return [].reduce.call(array, (col, set) => {
                const res = [];
                col.values.forEach((c) => {
                    set.values.forEach((s) => {
                        const t = [].concat([{
                            specKeyId: col.id,
                            specValueId: c.id,
                            name: col.name,
                            value: c.name,
                        }]);
                        t.push({
                            specKeyId: set.id,
                            specValueId: s.id,
                            name: set.name,
                            value: s.name,
                        });
                        res.push(t);
                    })
                });
                return res;
            });
        },
        //获取已经绑定的商品规格
        async getProductSpecsRelevantList() {
            try {
                const { data: { data } } = await this.$API.getProductSpecsRelevantList({ productId: this.backupData.id, shopId: this.backupData.shopId });
                if (!data.specsList) data.specsList = [];
                data.specsList = this.sortSpecs(data.specsList);
                const obj = this.pddSpecsSelected;
                this.activeList = this.specsList.map((e, i) => {
                    return {
                        pddGoodsId: i < data.specsList.length ? data.specsList[i].pddGoodsId : '',
                        specKeyId: i < data.specsList.length ? data.specsList[i].specKeyId : '',
                        specValueId: i < data.specsList.length ? data.specsList[i].specValueId : '',
                        specs: i < data.specsList.length ? data.specsList[i].specs : e.spec_detail_id1 && e.spec_detail_id2 ? [{ ...obj }, { ...obj }] : [obj]
                    };
                });
                for (var active of this.activeList) {
                    if (active.specs.length < 2) {
                        active.specs.push({ ...obj });
                    }
                } 
            } catch (error) {

            }
        },
        // PDD商品规格排序
        sortSpecs(data) {
            const obj = this.pddSpecsSelected;
            const num = [];
            const arr = [];
            for (let i = 0; i < this.specsList.length; i++) {
                const item = this.specsList[i];
                for (let j = 0; j < data.length; j++) {
                    const row = data[j];
                    if (item.sku_id === row.specKeyId) {
                        num.push(i);
                        arr.push(row);
                    }
                }
            }
            for (let i = 0; i <= Math.max(...num); i++) {
                if (i !== num[i]) {
                    const e = this.specsList[0];
                    num.splice(i, 0, i);
                    arr.splice(i, 0, {
                        pddGoodsId: '',
                        specKeyId: '',
                        specValueId: '',
                        specs: e.spec_detail_id1 && e.spec_detail_id2 ? [{ ...obj }, { ...obj }] : [obj],
                    });
                }
            }
            return arr;
        },
        //选择采购链接
        urlOnChange(index, activeList) {
            Object.keys(this.currentSpecList).forEach(key => {
                if (activeList[index].pddGoodsId == key) {
                    console.log(key,this.currentSpecList[key].length);
                    const obj = this.pddSpecsSelected;
                    activeList[index].specs = Array.from({ length: this.currentSpecList[key].length }, () => ({ ...obj }));
                }
            });
        },
        // 选择PDD商品规格
        onChange(index, specIndex) {
            const spec = this.specsList[index];
            const specKeyId = spec.sku_id;
            // const specValueId = spec.spec_detail_id1 && spec.spec_detail_id2 ? `${spec.spec_detail_id1},${spec.spec_detail_id2}` : spec.spec_detail_id1;
            const specValueId = spec.spec_detail_id1 && spec.spec_detail_id2 ? spec.spec_detail_id1 + spec.spec_detail_id2 : spec.spec_detail_id1;
            const pddSpecValueId = this.activeList[index].specs[specIndex].pddSpecValueId;
            const values = this.currentSpecList[this.activeList[index].pddGoodsId][specIndex].values;
            const pddSpecKeyId = values.find(e => e.specValueId === pddSpecValueId).specKeyId;
            this.activeList[index].specKeyId = specKeyId;
            this.activeList[index].specValueId = specValueId;
            this.activeList[index].specs[specIndex].pddSpecKeyId = pddSpecKeyId;
            this.activeList[index].specs[specIndex].pddSpecValueId = pddSpecValueId;
        },
        //获取PDD商品规格
        async getSyncPddSpec() {
            try {
                const { data: { data } } = await this.$API.getPddProductSkuList({ productId: this.backupData.id, shopId: this.backupData.shopId});
                this.pddSpecList = data;
                this.currentSpecList = this.setPddSpecData(data);
            } finally {}
        },
        // 解析PDD商品规格数据格式
        setPddSpecData(goods_list) {
            const all_goods = {}
            for (let goods_id in goods_list) {
                console.log('goods_id', goods_id)
                let goods_sku_array = goods_list[goods_id];
                console.log('goods_sku_array', goods_sku_array)
                var sku_spec_map = {}
                for (let i = 0; i < goods_sku_array.length; i++) {
                    let goods_sku = goods_sku_array[i]
                    let pddProductSkuSpecs = goods_sku['pddProductSkuSpecs']
                    let skuSpecs = []
                    for (let j = 0; j < pddProductSkuSpecs.length; j++) {
                        let spec = pddProductSkuSpecs[j]
                        skuSpecs.push(spec)
                    }
                    console.log('skuSpecs', skuSpecs)
                    for (let k = 0; k < skuSpecs.length; k++) {
                        let spec = skuSpecs[k]
                        let specKey = spec['specKey']
                        let specValueId = spec['specValueId']
                        if (!sku_spec_map[specKey]) {
                            sku_spec_map[specKey] = {}
                        }
                        sku_spec_map[specKey][specValueId] = spec
                    }
                    console.log('sku_spec_map', sku_spec_map)
                }
                var sku_spce_result = []
                for (let key in sku_spec_map) {
                    var sku_spec = sku_spec_map[key]
                    let sku_spec_array = []
                    for (let specValueId in sku_spec) {
                        sku_spec_array.push(sku_spec[specValueId])
                    }
                    sku_spce_result.push({
                        "name": key,
                        "values": sku_spec_array
                    })
                }
                all_goods[goods_id] = sku_spce_result
            }
            return all_goods;
        },
        // json数组去重
        deWeight(arr, key) {
            const temp = {};
            const result = [];
            arr.map((item, index) => {
                if (!temp[item[key]]) {
                    result.push(item);
                    temp[item[key]] = true;
                }
            });
            return result;
        },
        // 对表单进行校验的方法
        validate(key) {
            return new Promise((resolve, reject) => {
                // 对部分表单字段进行校验的方法
                if (key) {
                    this.$refs.ruleForm.validateField(key, (valid) => {
                        if (!valid) {
                            resolve(true);
                        } else {
                            this.$message.warning('请检查采购链接是否填写完整')
                            reject(false);
                        }
                    });
                } else {
                    this.$refs.ruleForm.validate((valid) => {
                        if (valid) {
                            resolve(true);
                        } else {
                            this.$message.warning('请检查采购链接是否填写完整')
                            reject(false);
                        }
                    });
                }
            });
        },
        //获取PDD商品ID
        getPddGoodsId(url) {
            // const pddGoodsId = this.getPddGid(url)
            // return pddGoodsId;
            const pddGoodsId = this.getPddGid(url)
            if (pddGoodsId) {
                // 拼多多模式规格
                return pddGoodsId;
            } else if (url.indexOf('?ps=') > -1 && url.indexOf('mobile.yangkeduo.com') > -1) {
                // 拼多多供应链模式规格
                return url;
            } else {
                return false;
            }
        },
        //获取url中的参数
        getQueryVariable(url, variable) {
            const query = url.substr(url.indexOf('?') + 1);
            const vars = query.split("&");
            for (let i = 0; i < vars.length; i++) {
                const pair = vars[i].split("=");
                if (pair[0] == variable) return pair[1];
            }
            return false;
        },
        //添加链接
        onClickAddSkuUrl() {
            this.ruleForm.skuUrls.push({
                purchaseUrl: '',
                hintInfo: '',
                goodsId: '',
                pddGoodsId: '',
                platform: null,
            });
        },
        //自动关联规格
        onClickAutoBindSpecs: throttle(async function (){
            this.spin = true;
            try {
                const valid = await this.validate();
                if (valid) {
                    // 保存采购链接
                    await this.$API.savePurchaseUrl({
                        productId: this.backupData.id,
                        shopId: this.backupData.shopId,
                        savePurchaseUrlList: this.deWeight(this.ruleForm.skuUrls.map(e => ({
                            goodsId: e.goodsId || this.getPddGoodsId(e.purchaseUrl),
                            hintInfo: e.hintInfo,
                            platform: e.platform || 0
                        })), 'goodsId'),
                    });
                    const specsList = this.activeList.filter(e => e.pddGoodsId && e.specs.length > 0).map(item => {
                        const { pddGoodsId } = item
                        const platform = pddGoodsId ? this.ruleForm.skuUrls.filter(url => url.goodsId == pddGoodsId)[0].platform : 0
                        return {
                            ...item,
                            platform: platform
                        }
                    })
                    // 保存商品规格
                    await this.$API.bindProductSpecsRelevant({
                        productId: this.backupData.id,
                        shopId: this.backupData.shopId,
                        specsList: specsList
                    });
                    // 自动关联规格
                    await this.$API.autoBindProductSpecsRelevant({
                        productId: this.backupData.id,
                        shopId: this.backupData.shopId,
                        pddGoodsId: this.getPddGoodsId(this.ruleForm.skuUrls[0].purchaseUrl)
                    })
                    await this.getProductSpecsRelevantList();
                    await this.getSyncPddSpec();
                    this.$message.success('自动关联规格成功!');
                    // this.onClose();
                }
            } finally {
                this.spin = false;
            }
        }),
        //删除链接
        onClickDelSkuUrl(index) {
            if (this.ruleForm.skuUrls.length === 1) return this.$message.error('请至少保留一条采购链接')
            const item = this.ruleForm.skuUrls[index]
            this.ruleForm.skuUrls.splice(index, 1)
            this.getPurchaseLinks()
            // 清空移除链接对应绑定的商品规格
            for (let i = 0; i < this.activeList.length; i++) {
                const row = this.activeList[i]
                if (item.goodsId == row.pddGoodsId) {
                    this.activeList[i].pddGoodsId = ''
                    this.activeList[i].specKeyId = ''
                    this.activeList[i].specValueId = ''
                    this.activeList[i].specs = this.activeList[i].specs.map(e => ({
                        pddSpecKeyId: '',
                        pddSpecValueId: '',
                    }));
                }
            }
        },
        //关闭弹窗 & 清空数据
        onClose() {
            this.visible_ = false;
            this.ruleForm.skuUrls = [];
            this.specsList = [];
            this.purchaseLinks = {};
            this.pddSpecList = [];
            this.activeList = [];
            this.currentSpecList = {};
            this.fullscreen = false
        },
        //同步商品SKU
        getPurchaseLinks() {
            this.purchaseLinks = this.ruleForm.skuUrls.map((e, i) => ({
                label: `链接${i + 1}`,
                value: e.goodsId,
            }));
        },
        // 清空采购规格
        onClearSpecs () {
            console.log('activeList', this.activeList)
            this.$confirm('清空该商品关联的采购规格，会导致该商品的订单无法自动代发，您确认要清空吗？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.activeList = this.activeList.map(item => {
                    return {
                        pddGoodsId: '',
                        specKeyId: '',
                        specValueId: '',
                        specs: item.specs.map(spec => {
                            return {
                                pddSpecKeyId: '',
                                pddSpecValueId: ''
                            }
                        })
                    }
                })
            })
        },
        // 输入采购连接
        onLinkInput: debounce(async function (linkOption) {
            // 确定链接平台类型
            const { url, index, item } = linkOption
            if (url) {
                let platform = null
                if (url.indexOf('yangkeduo') > -1 || url.indexOf('pinduoduo') > -1) {
                    // 拼多多平台
                    platform = 0
                } else if (url.indexOf('market.m.taobao.com') > -1) {
                    // 淘特平台
                    platform = 3
                } else if (url.indexOf('1688.com') > -1) {
                    // 1688平台
                    platform = 2
                } else {
                    // 供应链平台
                    platform = 1
                }
                console.log(111,this.ruleForm.skuUrls)
                this.$set(this.ruleForm.skuUrls, index, {...item, platform: platform})
                if (platform === 1 || platform === 2 || platform === 3) return
            }
            // if (index === 0) {
            //     // this.getQueryVariable(url, 'goods_id')
            //     // 输入的是第一条数据的时候将开始自动同步
            //     this.onBlur(url, item)
            //     this.onSyncPddSpec(index, url, 'auto')
            // }
        }, 500),
        //更新Sku
        onUpdateSkuUrl: throttle(async function (index, url) {
            console.log('skuUrls', this.ruleForm.skuUrls)
            try {
                const valid = await this.validate(`skuUrls.${index}.purchaseUrl`);
                if (valid) {
                    const goodsId  = this.getPddGoodsId(url);
                    if(goodsId==false) return this.$message.warning('请填写正确的采购链接！'),this.spin = false;
                    const { data: { data } } = await updatePddSpec({ goodsId : goodsId });
                    if(data.code==-1){
                        this.$message.warning('正在为您获取sku信息,请耐心等待')
                    }
                }
            } catch {}
        }),
        // 获取sku
        onSyncPddSpec: throttle(async function (index, url, type) {
            this.spin = true;
            console.log('skuUrls', this.ruleForm.skuUrls)
            try {
                const valid = await this.validate(`skuUrls.${index}.purchaseUrl`);
                if (valid) {
                    const pddGoodsId = this.getPddGoodsId(url);
                    if(pddGoodsId==false) return this.$message.warning('请填写正确的采购链接！'),this.spin = false;
                    const { data } = await syncPddSpec({ pddGoodsId: pddGoodsId, type: !type ? 2 : 1 });
                    if(data.data === null){
                        this.$message.warning(data.msg)
                    } else {
                        this.$message.success('获取成功')
                    }
                    

                    this.currentSpecList[pddGoodsId] = data.data.map(e => ({
                        name: e.spec_key,
                        values: e.spec_value.map(v => ({
                            id: v.id,
                            goodsId: v.goods_id,
                            specKey: v.spec_key,
                            specKeyId: v.spec_key_id,
                            specValue: v.spec_value,
                            specValueId: v.spec_value_id,
                        }))
                    }));
                    // this.pddSpecList[pddGoodsId] = list;
                    console.log('currentSpecList', this.currentSpecList)
                    this.getPurchaseLinks();
                    // 清空修改后的采购链接对应绑定的商品规格
                    if (this.ruleForm.skuUrls[index].pddGoodsId !== this.ruleForm.skuUrls[index].goodsId) {
                        for (let i = 0; i < this.activeList.length; i++) {
                            const item = this.activeList[i];
                            if (item.pddGoodsId === this.ruleForm.skuUrls[index].pddGoodsId) {
                                this.activeList[i].pddGoodsId = '';
                                this.activeList[i].specKeyId = '';
                                this.activeList[i].specValueId = '';
                                this.activeList[i].specs = this.activeList[i].specs.map(e => ({
                                    pddSpecKeyId: '',
                                    pddSpecValueId: '',
                                }));
                            }
                        }
                    }
                    // 如果类型是auto，则自动开始关联规格
                    if (type === 'auto') this.onClickAutoBindSpecs()
                    else this.spin = false
                }
            } catch {
                this.spin = false;
            }
        }),
        // 同步供应链SKU
        onSyncSupplierSpec: throttle(async function (index, goodsId) {
            console.log('skuUrls', this.ruleForm.skuUrls)
            this.spin = true;
            try {
                const valid = await this.validate(`skuUrls.${index}.purchaseUrl`);
                if (valid) {
                    const { data: { data } } = await syncSupplierSpec({ goodsId: goodsId});
                    this.$message.success('获取成功')
                    this.currentSpecList[goodsId] = data.map(e => ({
                        name: e.spec_key,
                        values: e.spec_value.map(v => ({
                            id: v.id,
                            goodsId: v.goods_id,
                            specKey: v.spec_key,
                            specKeyId: v.spec_key_id,
                            specValue: v.spec_value,
                            specValueId: v.spec_value_id,
                        }))
                    }));
                    console.log('currentSpecList', this.currentSpecList)
                    this.getPurchaseLinks();
                    if (this.ruleForm.skuUrls[index].pddGoodsId !== this.ruleForm.skuUrls[index].goodsId) {
                        for (let i = 0; i < this.activeList.length; i++) {
                            const item = this.activeList[i];
                            if (item.pddGoodsId === this.ruleForm.skuUrls[index].pddGoodsId) {
                                this.activeList[i].pddGoodsId = '';
                                this.activeList[i].specKeyId = '';
                                this.activeList[i].specValueId = '';
                                this.activeList[i].specs = this.activeList[i].specs.map(e => ({
                                    pddSpecKeyId: '',
                                    pddSpecValueId: '',
                                }));
                            }
                        }
                    }
                    this.spin = false
                }
            } catch {
                this.spin = false;
            }
        }),
        // 同步淘特SKU
        onSyncTaoteSpec: throttle(async function (index, url) {
            console.log('skuUrls', this.ruleForm.skuUrls)
            this.spin = true;
            try {
                const valid = await this.validate(`skuUrls.${index}.purchaseUrl`);
                if (valid) {
                    const goodsId = this.getPddGoodsId(url);
                    if(goodsId==false) return this.$message.warning('请填写正确的采购链接！'),this.spin = false;
                    const { data: { data } } = await syncSpecTaote({ goodsId: goodsId })
                    console.log('data', data)
                    this.$message.success('获取成功')
                    this.currentSpecList[goodsId] = data.map(e => ({
                        name: e.spec_key,
                        values: e.spec_value.map(v => ({
                            id: v.id,
                            goodsId: v.goods_id,
                            specKey: v.spec_key,
                            specKeyId: v.spec_key_id,
                            specValue: v.spec_value,
                            specValueId: v.spec_value_id,
                        }))
                    }));
                    console.log('currentSpecList', this.currentSpecList)
                    this.getPurchaseLinks();
                    if (this.ruleForm.skuUrls[index].pddGoodsId !== this.ruleForm.skuUrls[index].goodsId) {
                        for (let i = 0; i < this.activeList.length; i++) {
                            const item = this.activeList[i];
                            if (item.pddGoodsId === this.ruleForm.skuUrls[index].pddGoodsId) {
                                this.activeList[i].pddGoodsId = '';
                                this.activeList[i].specKeyId = '';
                                this.activeList[i].specValueId = '';
                                this.activeList[i].specs = this.activeList[i].specs.map(e => ({
                                    pddSpecKeyId: '',
                                    pddSpecValueId: '',
                                }));
                            }
                        }
                    }
                    this.spin = false
                }
            } catch {
                this.spin = false;
            }
        }),
        // 同步1688SKU
        onSync1688Spec: throttle(async function (index, url) {
            console.log('skuUrls', this.ruleForm.skuUrls)
            this.spin = true;
            try {
                const valid = await this.validate(`skuUrls.${index}.purchaseUrl`);
                if (valid) {
                    const goodsId = this.getPddGoodsId(url);
                    if(goodsId==false) return this.$message.warning('请填写正确的采购链接！'),this.spin = false;
                    const { data: { data } } = await sync1688DfSpec({ param: goodsId })
                    console.log('data', data)
                    this.$message.success('获取成功')
                    this.currentSpecList[goodsId] = data.map(e => ({
                        name: e.spec_key,
                        values: e.spec_value.map(v => ({
                            id: v.id,
                            goodsId: v.goods_id,
                            specKey: v.spec_key,
                            specKeyId: v.spec_key_id,
                            specValue: v.spec_value,
                            specValueId: v.spec_value_id,
                        }))
                    }));
                    console.log('currentSpecList', this.currentSpecList)
                    this.getPurchaseLinks();
                    if (this.ruleForm.skuUrls[index].pddGoodsId !== this.ruleForm.skuUrls[index].goodsId) {
                        for (let i = 0; i < this.activeList.length; i++) {
                            const item = this.activeList[i];
                            if (item.pddGoodsId === this.ruleForm.skuUrls[index].pddGoodsId) {
                                this.activeList[i].pddGoodsId = '';
                                this.activeList[i].specKeyId = '';
                                this.activeList[i].specValueId = '';
                                this.activeList[i].specs = this.activeList[i].specs.map(e => ({
                                    pddSpecKeyId: '',
                                    pddSpecValueId: '',
                                }));
                            }
                        }
                    }
                    this.spin = false
                }
            } catch {
                this.spin = false;
            }
        }),
        // 链接所属平台展示
        systemLabel (item) {
            switch (item.platform) {
                case 0:
                    return ''
                break;
                case 1:
                    return '供应链平台'
                break;
                case 2:
                    return '1688平台'
                break;
                case 3:
                    return '淘特平台'
                break;
                default:
                    return '-'
            }
        },
        // 搜同款
        onWithGoods (index) {
            const params = {
                index: index,
                keywords: this.data.img,
                imgUrl: this.data.img
            }
            this.$refs.dialogWithGoods.showModel(params)
        },
        // 供应链商品选完回调
        goodsCheckeSuccess (res) {
            const { index, goodsId } = res
            const item = this.ruleForm.skuUrls[index]
            this.$set(this.ruleForm.skuUrls, index, {...item, purchaseUrl: goodsId, platform: 1, goodsId})
        },
        // 查看供应链商品运费模版
        onViewFreight (offerId) {
            this.$refs.dialogFreight.showModel(offerId)
        },
        //确定关联
        onClickConfirm: throttle(async function () {
            this.spin = true;
            try {
                const valid = await this.validate();
                if (valid) {
                    // 保存采购链接
                    await this.$API.savePurchaseUrl({
                        productId: this.backupData.id,
                        shopId: this.backupData.shopId,
                        savePurchaseUrlList: this.deWeight(this.ruleForm.skuUrls.map(e => ({
                            goodsId: e.goodsId || this.getPddGoodsId(e.purchaseUrl),
                            hintInfo: e.hintInfo,
                            platform: e.platform || 0
                        })), 'goodsId'),
                    });
                    const specsList = this.activeList.filter(e => e.pddGoodsId && e.specs.length > 0).map(item => {
                        const { pddGoodsId } = item
                        let platform = 0
                        const checkItem = this.ruleForm.skuUrls.filter(url => url.goodsId == pddGoodsId)
                        if (checkItem.length) {
                            platform = checkItem[0].platform
                        }
                        return {
                            ...item,
                            platform: platform
                        }
                    })
                    // 保存商品规格
                    await this.$API.bindProductSpecsRelevant({
                        productId: this.backupData.id,
                        shopId: this.backupData.shopId,
                        specsList: specsList
                    });
                    this.$message.success('保存成功');
                    this.$emit('success')
                    this.onClose();
                }
            } finally {
                this.spin = false;
            }
        }, 1000),
        // 查看详情，限供应链商品使用
        toDetail(offerId){
            if (offerId.indexOf('1688.com') > -1) {
                // 1688
                if (window.electron) {
                // 发送到electron进行跳转
                    window.electron.send({key: 'chromeUrl', url: offerId})
                } else {
                    window.open(offerId)
                }
            } else {
                // 供应链
                window.open().location = '#/dfh/product/detail?offerId=' + offerId
            }
        },
        loadSku (url) {
            if (url.indexOf('?ps=') > -1 && url.indexOf('mobile.yangkeduo.com') > -1) {
                getURLGoodsId({
                    url: url,
                }).then(response => {
                    let goodsId = response.data.data;
                    url = `https://mobile.yangkeduo.com/goods1.html?goods_id=${goodsId}`
                    if (window.electron) {
                        window.electron.ipcRenderer.send('refund-window', {path: '/goodsSku', query: {pddGoodsUrl: encodeURIComponent(url)}})
                    } else {
                        this.$confirm('请确保当前已经登录，否则将无法获取!', '温馨提示', {
                            confirmButtonText: '前往获取',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.onOpenClient(url)
                        }).catch(() => {})
                    }
                    console.log(encodeURIComponent(url),1345)
                }).catch(() => {});
            } else {
                if (window.electron) {
                    window.electron.ipcRenderer.send('refund-window', {path: '/goodsSku', query: {pddGoodsUrl: encodeURIComponent(url)}})
                } else {
                    this.$confirm('请确保当前已经登录，否则将无法获取!', '温馨提示', {
                        confirmButtonText: '前往获取',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.onOpenClient(url)
                    }).catch(() => {})
                }
            }
        },
        openWxparse () {
            if (window.electron) {
                window.electron.once('reply-message', (event, response) => {
                    console.log("openWxparse response", response); 
                    if(response.success){
                        this.$notify.success('微信获取商品启动成功，请把商品链接发送到电脑微信上，然后点击链接打开进行商品获取');
                        this.wxparseOpened = true;
                    }else{
                        this.$notify.error('微信获取商品启动失败: ' + response.data.msg);
                    }
                });
                window.electron.ipcRenderer.send('open-wxparse', {})
            } else {
                this.$confirm('请确保当前已经登录，否则将无法获取!', '温馨提示', {
                    confirmButtonText: '前往获取',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.onOpenClient(url)
                }).catch(() => {
                })
            }
        },
        closeWxparse () {
            if (window.electron) {
                window.electron.once('reply-message', (event, response) => {
                    console.log("closeWxparse response", response); 
                    if(response.success){
                        this.$notify.success('微信获取商品关闭成功');
                        this.wxparseOpened = false;
                    }else{
                        this.$notify.error('微信获取商品关闭失败: ' + response.data.msg);
                    }
                })
                window.electron.ipcRenderer.send('close-wxparse', {})
            } else {
                this.$confirm('请确保当前已经登录，否则将无法获取!', '温馨提示', {
                    confirmButtonText: '前往获取',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.onOpenClient(url)
                }).catch(() => {
                })
            }
        },
        // 启动客户端
        onOpenClient (url) {
            const resUrl = encodeURIComponent(url)
            console.log(resUrl)
            window.location.href = `kuaipai://client?router=goodsSku&pddGoodsUrl=${resUrl}`
        },
    },
    mounted() {
        if (window.electron) {
            window.electron.once('reply-message', (event, response) => {
                console.log("closeWxparse response", response); 
                this.wxparseOpened = response.wxparseOpened;
            })
            window.electron.ipcRenderer.send('wxparse-status', {})
        }
    },
};
</script>

<style lang="scss" scoped>
@keyframes breath {
    from { opacity: 0.3; }
    50%  { opacity:   1; }
    to   { opacity: 0.1; }
}
.dialog-spec-dfh-components {
    & ::v-deep .el-dialog {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0);
    }
    .w68 {
        width: 68px;
    }
    .w45 {
        width: 45px;
    }
    .w314 {
        width: 314px;
    }
    .w130 {
        width: 130px;
    }
    .w140 {
        width: 140px;
    }
    .w180 {
        width: 180px;
    }
    .w220 {
        width: 220px;
    }
    .w260 {
        width: 260px;
    }
    .w270 {
        width: 270px;
    }
    .w280 {
        width: 280px;
    }
    .w300 {
        width: 300px;
    }
    .w310 {
        width: 310px;
    }
    .w320 {
        width: 320px;
    }
    .w330 {
        width: 330px;
    }
    .w380 {
        width: 380px;
    }
    .w390 {
        width: 390px;
    }
    .w400 {
        width: 400px;
    }
    .w462 {
        width: 462px;
    }

    .wrapper {
        width: 100%;
        height: 89vh;
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
                flex: 1;
                font-size: 18px;
                font-weight: 600;
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
            height: calc(100% - 117px);
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
                    overflow: hidden;
                }

                .rbox {
                    width: 240px;
                    height: 68px;
                    .title {
                        cursor: pointer;
                        font-weight: 600;
                        line-height: 20px;
                    }
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
                        background: #c1c1c1;
                    }

                    scrollbar-color: #c1c1c1 #f1f1f1;
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
                    .cell.sku-url-input {
                        ::v-deep.border-r-none {
                            .el-input__inner {
                                border-right: 0;
                                padding-right: 0;
                            }
                        }
                        ::v-deep.el-input {
                            .el-input-group__append {
                                background: none;
                            }
                            .el-button {
                                padding: 0 10px 2px;
                                color: rgb(70, 180, 109);
                            }
                            .el-button:hover {
                                color: #66b1ff;
                            }
                        }
                    }
                }
            }

            .spec-box {
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
                    .el-icon-question {
                        font-size: 18px;
                        margin-left: 5px;
                    }
                }
                .tbody {
                    height: 270px;
                    overflow-x: hidden;
                    overflow-y: auto;
                    .item {
                        padding-top: 5px;
                        padding-bottom: 5px;
                        position: relative;
                        .current-icon {
                            opacity: 0.1;
                            color: #1890ff;
                            font-size: 20px;
                            position: absolute;
                            left: 3px;
                            top: 50%;
                            transform: translateY(-50%);
                            animation: breath 3s ease-in-out infinite;
                        }
                        .inventory-tip {
                            color: red;
                            margin-right: 8px;
                        }
                    }
                    .item.active {
                        background-color: #dbf4ff;
                        border-radius: 5px;
                        color: #1890ff;
                        .title {
                            position: relative;
                        }
                    }
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
                        background: #c1c1c1;
                    }

                    scrollbar-color: #c1c1c1 #f1f1f1;
                    scrollbar-width: thin;
                    .item {
                        &:nth-child(odd) {
                            .cell {
                                &:nth-child(1) {
                                    color: #1890ff;
                                }
                            }
                        }
                    }
                    .cell {
                        .spec-image {
                            width: 35px;
                            height: 35px;
                            margin-right: 10px;
                            border-radius: 5px;
                        }
                        .spec-item {
                            margin-right: 10px;
                            .el-select {
                                width: 90%;
                                min-width: 146px;
                                max-width: 300px;
                            }
                            &:last-of-type {
                                margin-right: 0;
                            }
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

.form-box ::v-deep .el-form-item {
    margin-bottom: 0;
}
</style>
