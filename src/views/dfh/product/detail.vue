<template>
  <div class="product-detail-page">
    <!-- item header -->
    <!-- <div class="item-header">
      <div class="inner">
      </div>
    </div> -->
    <div class="item-detail clearfix">
      <div class="left-area">
        <div class="item-main clearfix">
          <div class="item-cover">
            <div class="main-img">
                <img :src="mainImgs" alt="" class="jqzoom" style="cursor: crosshair;">
            </div>
            <div class="main-select">
              <ul>
                <li v-for="(item, index) in item.imgs" :key="index" :class="index === currIndex ? 'curr' : ''" @click="selectImg(index, item)">
                  <img v-if="item" :src="item + '_60x60.jpg'" alt="">
                </li>
              </ul>
            </div>
          </div>
          <div class="name lh24">{{ item.title }}</div>
          <div class="price">
            <span class="p-label">价格</span><span class="p-value-u">￥</span><span class="p-value-p">{{ currentSku.price || item.price }}</span> <br>
          </div>
          <div class="price amountOnSale" style="padding-bottom: 0;" v-if="currentSku.amountOnSale">
            <span class="p-label">库存</span><span>{{ currentSku.amountOnSale || 0 }}</span> <br>
          </div>
          <div class="price">
            <span class="p-label">邮费</span><span class="p-value-u">￥</span><span class="p-value-p">{{(this.item.expressPrice / 100).toFixed(2)}}元起</span>
            <el-link href="#freighList" type="primary">查看明细</el-link>
          </div>
          <div class="param">
            <p><span class="key">发货地</span>
              <span class="value">
                {{ item.shipping.sendGoodsAddressText }}
              </span>
            </p>
          </div>


          <div v-for="(skuView, index) in skuViewList" :key="index" class="param sku">
            <div class="key">{{ skuView[0].attributeName }}</div>
            <div class="value">
              <ul>
                <li v-for="(attr, attrIndex) in skuView" :key="attrIndex" class="color" :class="(attr.attributeValue == currentAttr.attributeValue ? 'curr' : '')" @click="selectAttr(attr)" >
                  {{ attr.attributeValue }}
                </li>
              </ul>
            </div>
          </div>

          <div class="btn">
            <!--
            <el-button type="primary" size="mini" @click="buyNow()">选择商品</el-button>
             -->
          </div>
        </div>
        <div class="item-container">
          <div class="other-recommond">
            <!--
              <div class="title">橱窗推荐</div>
            -->
          </div>
          <div class="item-desc">
            <div class="item-desc-sku">
              <div class="title"></div>
              <div class="content">
                  <template v-if="freighList.length">
                        <p id="freighList">邮费说明</p>
                        <el-table 
                            :data="freighList"
                            border:true
                            style="width: 100%; margin-top: 20px;border: 1;">
                            <el-table-column
                                label="发货地"
                                width="150">
                                <template slot-scope="{row}">
                                    <span>{{row.addressCodeText}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="toAreaCodeText"
                                label="运送到">
                                <template slot-scope="{row}">
                                    <span>{{row.toAreaCodeText || '其他地区'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="firstUnit"
                                width="100"
                                :label="`首${chargeType == 0 ? '重' : '件'}（${chargeType == 0 ? '克' : '件'}）`">
                                <template slot-scope="{row}">
                                    <span>{{row.firstUnit}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="firstUnitFee"
                                width="120"
                                label="单价（元）">
                                <template slot-scope="{row}">
                                    <span>{{(row.firstUnitFee / 100).toFixed(2)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="nextUnit"
                                width="100"
                                :label="`续${chargeType == 0 ? '重' : '件'}（${chargeType == 0 ? '克' : '件'}）`">
                                <template slot-scope="{row}">
                                    <span>{{row.nextUnit}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="nextUnitFee"
                                width="120"
                                label="单价（元）">
                                <template slot-scope="{row}">
                                    <span>{{(row.nextUnitFee / 100).toFixed(2)}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                  </template>
                
                <p class="pt10 pl10">商品属性</p>
                <ul v-if="item.attrs" class="sku">
                  <li v-for="(item,index) in item.attrs" :key="index" class="px10">
                    {{ item.attributeName }}：{{ item.value }}
                  </li>
                </ul>
                <p class="py10 pl10">商品详情</p>
                <div class="item-desc-html" v-html="item.desc" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-area">
        <div class="shop-info" />
        <div class="item-recommond">
          <!--
          <div class="title">推荐商品</div>
          -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getSupplyProductDetail } from '@/api/dfh/product'
export default {
  name: 'Item',
  components: {
  },
  data: () => ({
    id: null,
    item: {
      itemId: null,
      title: '',
      picPath: '',
      price: 0,
      imgs: [],
      skus: [],
      attrs: [],
      shipping:{},
      desc: '',
      expressPrice:0
    },
    currIndex: 0,
    itemSelectedShow: false,
    mainImgs: '',
    skuViewList:[],
    freighList:[],
    currentAttr: {}
  }),
  watch: {
    
  },
  computed: {
        // 计件类型 0 => 重量，1 => 件数
        chargeType () {
            if (this.freighList.length) {
                return this.freighList[0].chargeType || 0
            } else {
                return 0
            }
            
        },
        currentSku () {
            let sku = {}
            try {
                this.item.skus.forEach(item => {
                    if (item.attributes[0].attributeValue ==  this.currentAttr.attributeValue) {
                        sku = item
                        return
                    }
                })
                return sku
            } catch (err) {
                return sku
            }
        }
  },
  mounted() {
  },
  created() {
    this.getSupplyProductDetail()
  },
  methods: {
    getSupplyProductDetail() {
      this.id = this.$route.query.offerId
      const params = { offerId: this.id }
      getSupplyProductDetail(params).then(response => {
        let result = response.data.data.result
        let productInfo = result.productInfo
        this.item.itemId = productInfo.productID
        this.item.title = productInfo.subject
        this.item.skus = productInfo.skuInfos
        this.item.price = this.item.skus[0].consignPrice
        this.item.imgs = productInfo.image.images
        this.mainImgs = this.item.imgs[0]
        this.item.picPath = this.mainImgs
        this.item.attrs = productInfo.attributes
        this.item.desc = productInfo.description.replace(/HREF=("|\')?([^ "\']*)("|\')/ig, 'href=""')
        this.item.shipping = productInfo.shippingInfo
        this.initSku(this.item.skus)
        this.initFreighList(this.item.shipping)
      }).catch(error => {
        console.error(error)
        this.$message.error('获取商品详情失败')
      })
    },
    selectImg(index, item) {
      this.currIndex = index
      this.mainImgs = item
    },
    initFreighList(shipping){
      shipping.freightTemplate.forEach((item, index1) => {
          if (item.expressSubTemplate) {
            let chargeType = item.expressSubTemplate.subTemplateDTO.chargeType
            let addressCodeText = item.addressCodeText
            item.expressSubTemplate.rateList.forEach((rate, index2) => {
            let tempObject=new Object();
            tempObject.addressCodeText=addressCodeText
            tempObject.chargeType=chargeType
            tempObject.toAreaCodeText=rate.toAreaCodeText
            tempObject.firstUnit=rate.rateDTO.firstUnit
            tempObject.firstUnitFee=rate.rateDTO.firstUnitFee
            if(index2 == 0){
                this.item.expressPrice = rate.rateDTO.firstUnitFee
            }else{
                if(rate.rateDTO.firstUnitFee < this.item.expressPrice){
                this.item.expressPrice = rate.rateDTO.firstUnitFee
                }
            }
            tempObject.nextUnit=rate.rateDTO.nextUnit
            tempObject.nextUnitFee=rate.rateDTO.nextUnitFee
            this.freighList.push(tempObject)
            })
          }
      })
      console.log(JSON.stringify(this.freighList))
    },
    initSku(skus) {
      if (!skus || skus.length === 0) return
      //去重
      let localSet = new Set()
      skus.forEach((sku, index) => {
        sku.attributes.forEach((arrt, arrtIndex) => {
          if (index === 0) {
            let skuAttrList=[]
            localSet.add(arrt.attributeValue)
            skuAttrList.push(arrt)
            this.skuViewList.push(skuAttrList)
          }else{
            if(!localSet.has(arrt.attributeValue)){
              localSet.add(arrt.attributeValue)
              this.skuViewList[arrtIndex].push(arrt)
            }
          }
        })
      })
      console.log(JSON.stringify(this.skuViewList));
      // console.log('colorObj:' + JSON.stringify(colorObj))
      // console.log('sizeObj:' + JSON.stringify(sizeObj))
    },
    selectAttr(attr) {
        console.log('attr', attr)
        this.currentAttr = attr
        if(attr.skuImageUrl){
            this.mainImgs = attr.skuImageUrl
        }
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-detail-page {
    height: 100%;
    overflow-y: scroll;
  }
.item-header {
  height: 60px;
  margin-top: 20px;
  border-bottom: 1px solid #ebebeb;
  .inner {
    width: 1190px;
    height: 60px;
    margin: 0 auto;
    line-height: 40px;
    overflow: hidden;
  }
  .header-logo {
    width: 90px;
    height: 40px;
    line-height: 40px;
    font-size: 30px;
    text-align: center;
    float: left;
  }
  .header-name {
    float: left;
    margin-left: 15px;
    padding: 0 15px;
    height: 40px;
    border-left: 1px solid #e5e5e5;
    .shop-name {
      font-size: 16px;
      color: #333;
    }
    .shop-slogan {
      margin-left: 10px;
      max-width: 220px;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #999;
    }
  }
}
.item-detail {
  width: 1190px;
  margin: 0 auto;
  position: relative;
  margin-top: 20px;
  .left-area {
    float: left;
    width: 1200px;
    position: relative;
    .item-cover {
      position: absolute;
      top: 0;
      left: 20px;
      width: 408px;
      height: 540px;
      padding-left: 0;
      .main-select {
        position: absolute;
        top: 400px;
        left: 0;
        margin: 14px 0 0;
        li {
          position: relative;
          float: left;
          width: 70px;
          height: 70px;
          margin: 5px;
          border: 2px solid transparent;
          cursor: pointer;
          overflow: hidden;
          &.curr {
            border-color: #fb658a;
          }
          img {
            width: 70px;
            height: 70px;
          }
        }
      }
    }
    .item-main {
      background: #fff;
      position: relative;
      padding: 0 20px 20px 440px;
      min-height: 530px;
      .name {
        font-size: 18px;
        font-weight: 400;
        margin-bottom: 10px;
      }
      .price {
        padding: 15px 10px;
        background-color: #fbf1f0;
        font-size: 14px;
        position: relative;
        color: #999;
        .p-label {
          line-height: 1.2;
          overflow: hidden;
          margin-right: 20px;
        }
        .p-value-u {
          color: #ff4640;
          font-size: 26px;
        }
        .p-value-p {
          color: #ff4640;
          font-size: 26px;
          font-weight: bold;
          font-family: Barlow;
        }
      }
      .btn {
        float: left;
        margin-left: 15px;
        margin-top: 20px;
      }
      .param {
        color: #6c6c6c;
        font-size: 12px;
        border-top: 1px dotted #e5e5e5;
        padding: 10px 0;
        line-height: 30px;
        overflow: hidden;
        .key {
          float: left;
          width: 68px;
          padding-left: 10px;
        }
        .value {
          float: left;
          width: 665px;
        }
        &.sku {
          float: left;
          overflow: hidden;
          cursor: pointer;
          ul {
            width: 100%;
            overflow: hidden;
            li {
              &.color {
                float: left;
                position: relative;
                height: 30px;
                line-height: 26px;
                margin-right: 10px;
                background: #fff;
                padding: 0 5px;
                border: 2px solid #e5e5e5;
                margin-bottom: 10px;
                &.curr {
                  border-color: #ff4640;
                }
                &.selected::after {
                  content: '';
                  display: block;
                  bottom: 0;
                  right: 0;
                  position: absolute;
                  width: 15px;
                  height: 15px;
                  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAAXNSR0IArs4c6QAAAN5JREFUOBFjYKAQ/E3rrmehxIzfqd0d/xkY8pjINQRkAAPD/3KQfrIMQTaALEPQDSDZEGwGkGQILgOINgSfAUQZQsgAgobgMoDRVIOBuTuTgUFSGGQG7iiGGcBcGQNWCCNABjCFOTL87VvFwPD8LVgYazqBGQDTyBTpDGZiMwAkwQxTCKPRDfh/+joDk6cFAwMHKwOTvw2KC0B6GBkZ/zDCNINodAPgciL8DEwRzgz/Zm1iYPj1By4MYgAN+Q43BKcBKFowOSBDwGFCrgEwIxlB5QEwO4NzI0yQNPr/DwBTsF+3on/ZAQAAAABJRU5ErkJggg==)
                    no-repeat;
                }
              }

              &.size {
                width: 100%;
                .size-name {
                  display: inline-block;
                  width: 100px;
                  margin-right: 10px;
                  font-size: 12px;
                }
                .size-price {
                  display: inline-block;
                  width: 100px;
                  margin-right: 10px;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
      .item-selected {
        width: 100%;
        border: 1px solid #e1e1e1;
        line-height: 48px;
        position: relative;
        float: left;
        margin: 15px 0;
        .account-left {
          float: left;
          width: 379px;
          height: 48px;
          background: #f9f9f9;
          border-right: 1px solid #e1e1e1;
          text-align: center;
          &__num {
            font-size: 20px;
            color: #ef3664;
            font-weight: 600;
          }
          &__font {
            font-size: 14px;
            color: #ef3664;
          }
          &__price {
            margin-left: 24px;
            font-size: 20px;
            color: #ef3664;
            font-weight: 600;
          }
        }
        .account-right {
          float: left;
          height: 48px;
          width: 129px;
          text-align: center;
          cursor: pointer;
          color: #666;
        }
        .select-list {
          max-height: 330px;
          position: absolute;
          z-index: 100;
          bottom: 48px;
          right: -1px;
          min-width: 320px;
          border: 1px solid #d5d5d5;
          background-color: #fff;
          box-shadow: 0 -3px 3px -3px #d5d5d5;
          overflow: auto;
          color: #333;
          ul {
            li {
              line-height: 24px;
              border-top: 1px solid #e5e5e5;
              font-size: 12px;
              &:first-child {
                font-weight: 600;
                border-top: none;
              }
              .select-list {
                &__color {
                  display: inline-block;
                  width: 100px;
                  text-align: center;
                }
                &__size {
                  display: inline-block;
                  width: 100px;
                  text-align: center;
                }
                &__num {
                  display: inline-block;
                  width: 118px;
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }
    .item-container {
      width: 100%;
      .item-desc {
        float: right;
        width: 1000px;
        margin-right: 100px;
        .title {
          background-color: #f5f5f5;
          border: 1px solid #ebebeb;
          border-bottom: 0;
          cursor: pointer;
          height: 39px;
          line-height: 39px;
          font-size: 16px;
          color: #333;
          text-indent: 10px;
        }
        .content {
          border: 1px solid #ebebeb;
          #freighList {
              padding-top: 10px;
              padding-left: 10px;
          }
        }
        .sku {
          border-bottom: 1px solid #e5e5e5;
          margin: 0 20px;
          padding: 20px 0;
          overflow: hidden;
          height: auto;
          text-align: center;
          margin-left: 0;
          margin-right: 0;
          width: 100%;
          font-size: 12px;
          li {
            float: left;
            width: 235px;
            height: 22px;
            line-height: 22px;
            color: #6c6c6c;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .item-desc-html {
            text-align: center;
            p {
                img {
                    width: 100% !important;
                    height: auto !important;
                }
            }
        }
      }
    }
  }
  .right-area {
    float: right;
    width: 200px;
  }
}
.other-recommond {
  float: left;
  width: 200px;
  .title {
    padding: 0 10px;
    background-color: #f5f5f5;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    margin-bottom: 10px;
    position: relative;
    color: #333;
  }
}
.item-recommond {
  width: 200px;
  .title {
    padding: 0 10px;
    background-color: #f5f5f5;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    margin-bottom: 10px;
    position: relative;
    color: #333;
  }
}
</style>
