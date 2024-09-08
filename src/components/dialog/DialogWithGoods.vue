<template>
    <div class='dialog-with-goods'>
        <el-dialog
            title="搜同款"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            top="5vh"
            width="1100px">
            <div class="with-goods-content" v-loading="loading">
                <div class="title">精选供应链平台</div>
                <div class="flex search">
                    <el-input
                        class="flex-1"
                        size="medium"
                        type="text"
                        v-model="formData.keyWords"
                        clearable
                        placeholder="请输入商品关键词/图片链接地址"
                        @keyup.enter.native="onInitList"
                        @input="onSearchInput"
                        @clear="onSearchClear">
                        <el-image
                            slot="prepend"
                            style="width: 30px; height: 30px"
                            :src="imgUrl"
                            fit="cover"
                            :preview-src-list="[imgUrl]"
                            v-if="imgUrl">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>

                        <el-upload
                            :headers="headers"
                            :show-file-list="false"
                            :before-upload="beforeImgUpload"
                            :on-success="handleImgSuccess"
                            :data="{fileType: 'tempGoodsImg'}"
                            class="avatar-uploader"
                            action="/admin/sys-file/upload"
                            slot="append"
                        >
                            <i class="el-icon-camera" />
                        </el-upload>
                    </el-input>
                    <el-button type="primary" size="medium" @click="onInitList"><i class="el-icon-search"></i> 立即搜索</el-button>
                </div>
                <div class="child-search">
                    <div class="cate flex">
                        <div class="label">分类</div>
                        <div class="value">
                            <span :class="{active: cateActive == 0}" @click="cateActive = 0; onInitList()">全部</span>
                            <span v-for="(item, index) in cateMapComputed" :key="index" :class="{active: cateActive == item.value}" @click="cateActive = item.value; onInitList()">{{item.label}}</span>
                            <span class="more" @click="searchStatus = searchStatus ? 0 : 1">{{searchStatus ? '收起' : '更多'}} <i :class="searchStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></span>
                        </div>
                    </div>
                    <div class="other flex">
                        <div class="label">筛选</div>
                        <div class="value">
                            <el-form inline :model="formData" size="mini">
                                <el-form-item label="价格区间">
                                    <el-row class="price-row">
                                        <el-col :span="11">
                                            <el-input v-model="formData.priceStart" placeholder="最低价">
                                                <template slot="prepend">¥</template>
                                            </el-input>
                                        </el-col>
                                        <el-col style="text-align: center;" :span="2">-</el-col>
                                        <el-col :span="11">
                                            <el-input v-model="formData.priceEnd" placeholder="最高价">
                                                <template slot="prepend">¥</template>
                                            </el-input>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <!-- <el-form-item label="发货时效" prop="deliveryTimeType">
                                    <el-select
                                        v-model="formData.deliveryTimeType"
                                        placeholder="请选择发货时效"
                                        style="width: 160px"
                                        size="mini"
                                        clearable
                                    >
                                        <el-option label="24小时发货" value="1"></el-option>
                                        <el-option label="48小时发货" value="2"></el-option>
                                    </el-select>
                                </el-form-item> -->
                            </el-form>
                        </div>
                    </div>
                </div>
                <div class="items">
                    <el-row :gutter="30" v-if="items.length">
                        <el-col :span="6" v-for="(item, index) in items" :key="item.offerId">
                            <el-card :body-style="{ padding: '0px' }" shadow="hover">
                                <div class="image">
                                    <img :src="item.imgUrl" width="100%" height="auto" @click="toDetail(item.offerId)">
                                    <div class="tag" v-if="item.offerTags">{{item.offerTags}}</div>
                                </div>
                                <div style="padding: 10px;">
                                    <div class="card-title">{{item.subject}}</div>
                                    <div class="card-bottom flex items-center">
                                        <span class="payment flex-1">¥ {{item.price}}</span>
                                        <el-button type="primary" size="mini" @click="onCheck(item)">选择商品</el-button>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                    <el-empty description="暂时没有找到任何商品信息" :image-size="200" class="mt50" v-else>
                        <el-button style="padding: 0;" type="text" size="medium" @click.native="onSupplyConcant">添加供应链负责人</el-button>
                    </el-empty>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-pagination
                    background
                    :current-page.sync="formData.page"
                    :page-size.sync="formData.pageSize"
                    @current-change="pageChange"
                    layout="prev, pager, next"
                    :total="formData.total">
                </el-pagination>
            </span>
        </el-dialog>
        <DialogWxSupply ref="dialogWxSupply" />
    </div>
</template>

<script>

import { searchPlatformProduct } from '@/api/dfh/product'
import { debounce } from '@/scripts/utils/index';
import DialogWxSupply from '@/components/dialog/DialogWxSupply'
import store from "@/store"
export default {
    components: {
        DialogWxSupply
    },
    watch: {
        dialogVisible (val, oldVal) {
            if (!val) {
                this.formData = {
                    keyWords: '',
                    page: 1,
                    pageSize: 20,
                    total: 0,
                }
                this.imgUrl = ''
                this.searchStatus = 0
                this.cateActive = 0
            }
        }
    },
    data() {
        return {
            dialogVisible: false,
            formData: {
                keyWords: '',
                page: 1,
                pageSize: 20,
                total: 0,
            },
            items: [],
            loading: false,
            inData: {},
            imgUrl: '',
            searchStatus: 0,
            cateActive: 0,
            cateMap: [
                {label: '日用百货', value: 9},
                {label: '服饰配件、饰品', value: 8},
                {label: '家居饰品', value: 6},
                {label: '玩具', value: 2},
                {label: '运动服饰', value: 15},
                {label: '箱包皮具', value: 16},
                {label: '五金、工具', value: 7},
                {label: '汽车用品', value: 1},
                {label: '家装、建材', value: 3},
                {label: '鞋', value: 17},
                {label: '母婴用品', value: 4},
                {label: '美容护肤/彩妆', value: 5},
                {label: '数码、电脑', value: 10},
                {label: '食品酒水', value: 11},
                {label: '床上用品', value: 12},
                {label: '餐饮生鲜', value: 14},
                {label: '男装', value: 18},
                {label: '女装', value: 19},
                {label: '童装', value: 20},
                {label: '内衣', value: 21},
                {label: '家纺家饰', value: 22},
            ],
            headers: {
                Authorization: "Bearer " + store.getters.access_token,
            },
            imgDomain: "http://bucket.damaijia.co/",
        }
    },
    computed: {
        cateMapComputed () {
            if (!this.searchStatus) {
                return this.cateMap.filter((item, index) => {
                    return index < 9
                })
            } else {
                return this.cateMap
            }
        },
    },
    methods: {
        onSupplyConcant () {
            this.$refs.dialogWxSupply.showModel()
        },
        // 搜索输入
        onSearchInput: debounce(async function (val) {
            console.log('val', val)
            // 判断输入是否带有http链接图
            if (val && val.indexOf('http') > -1) {
                this.imgUrl = val
            } else {
                this.imgUrl = ''
            }
        }),
        // 清除搜索框
        onSearchClear () {
            this.formData.keyWords = ''
            this.imgUrl = ''
        },
        showModel (data) {
            this.dialogVisible = true
            this.inData = data
            this.imgUrl = data.imgUrl || ''
            if (data.keywords) {
                this.formData.keyWords = data.keywords
                this.loadList()
            }
        },
        pageChange (page) {
            this.formData.page = page
            this.loadList()
        },
        onInitList () {
            this.formData.page = 1
            this.loadList()
        },
        async loadList () {
            const params = {...this.formData}
            if (this.cateActive > 0) {
                params['categoryId'] = this.cateActive
            }
            this.loading = true
            try {
                const { data } = await searchPlatformProduct(params)
                this.loading = false
                const total = data.data.total || 0
                this.items = data.data.result || []
                this.formData.total = total > 200 ? 200 : total
            } catch (err) {
                this.loading = false
            }
        },
        onCheck (item) {
            const result = {
                goodsId: item.offerId,
                ...this.inData
            }
            this.dialogVisible = false
            this.$emit('success', result)
        },
        toDetail(offerId){
            window.open().location = '#/dfh/product/detail?offerId=' + offerId
        },
        beforeImgUpload (file) {
            this.loading = true
            let width = 2048
            let height = 2048
            const isLt4M = file.size / 1024 / 1024 < 4
            if (!isLt4M) {
                this.$message.error('上传凭证大小不能超过 4MB!')
                this.loading = false
                return false
            }
            const isSize = new Promise(function(resolve, reject){
                let _URL = window.URL || window.webkitURL
                let img = new Image()
                img.onload = function(){
                    console.log('上传图片尺寸：%s*%s',img.width,img.height)
                    let valid = img.width <= width && img.height <= height;
                    valid ? resolve() : reject()
                }
                img.src = _URL.createObjectURL(file)
            }).then(()=>{
                this.loading = false
                return file
            }, ()=>{
                this.loading = false
                this.$notify.error("图片尺寸规格要求：小于等于" + width + '*'+ height)
                return Promise.reject()
            })
            return isSize
        },
        handleImgSuccess(res, file) {
            const imgUrl = `${this.imgDomain}${res.data.url}`
            this.imgUrl = imgUrl
            this.$set(this.formData, 'keyWords', imgUrl)
            this.onInitList()
        },
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
.dialog-with-goods {
    ::v-deep.el-dialog {
        .el-dialog__body {
            padding: 10px 50px;
            height: 78vh;
            overflow-y: scroll;
            .with-goods-content {
                .title {
                    text-align: center;
                    font-size: 25px;
                    font-weight: 500;
                    margin-bottom: 30px;
                }
                .search {
                    padding: 0 50px;
                    box-sizing: border-box;
                    margin-bottom: 20px;
                    .el-input {
                        border: 2px solid rgb(70, 180, 109);
                        .el-input-group__prepend {
                            background: none;
                            padding: 2px 5px;
                            font-size: 0;
                            border: 0;
                            padding-right: 0;
                            .image-slot {
                                font-size: 20px;
                                text-align: center;
                                padding-top: 3px;
                            }
                        }
                        .el-input-group__append {
                            padding: 0 10px;
                            background: none;
                            border: 0;
                            padding-left: 0;
                            .el-upload {
                                border: 0;
                                font-size: 20px;
                                padding-top: 5px;
                            }
                        }
                        .el-input__inner {
                            border: 0;
                            height: 37px;
                            line-height: 37px;
                        }
                    }
                    .el-button {
                        border-top-left-radius: 0;
                        border-bottom-left-radius: 0;
                    }
                }
                .child-search {
                    padding: 0 50px;
                    .label {
                        flex-basis: 50px;
                        color: #333;
                        font-weight: 500;
                    }
                    .cate {
                        .value {
                            flex: 1;
                            span {
                                display: inline-block;
                                margin-right: 20px;
                                margin-bottom: 20px;
                                cursor: pointer;
                                white-space: nowrap;
                            }
                            span.more {
                                margin-right: 0;
                                color: rgb(70, 180, 109);
                            }
                            span:hover {
                                color: rgb(70, 180, 109);
                            }
                            span.active {
                                color: rgb(70, 180, 109);
                            }
                        }
                    }
                    .other {
                        .label {
                            padding-top: 7px;
                        }
                        .value {
                            .price-row {
                                width: 200px;
                                .el-input-group__prepend {
                                    padding: 0 7px;
                                }
                                .el-input__inner {
                                    padding: 0 10px;
                                }
                            }
                        }
                    }
                }
                .items {
                    flex: 1;
                    .el-col {
                        margin-bottom: 30px;
                    }
                    .el-card {
                        cursor: pointer;
                        .el-card__body .image {
                            overflow: hidden;
                            width: 226px;
                            height: 226px;
                            background-color: #ededed;
                            position: relative;
                            img {
                                transition: all .3s;
                            }
                            img:hover {
                                transform: scale(1.2);
                            }
                            .tag {
                                background-color: #ff4000;
                                color: #fff;
                                padding: 3px 5px;
                                border-radius: 3px;
                                position: absolute;
                                left: 0;
                                bottom: 0;
                                font-size: 13px;
                            }
                        }
                        .card-title {
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                            margin-bottom: 5px;
                        }
                        .payment {
                            font-size: 18px;
                            color: #ff4000;
                            font-family: Barlow;
                        }
                    }
                }
                .el-loading-mask {
                    .el-loading-spinner {
                        width: auto;
                        position: fixed;
                        left: 50%;
                        margin-right: -21px;
                    }
                }
            }
        }
    }
}
</style>