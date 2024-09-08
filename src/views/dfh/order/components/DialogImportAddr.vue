<template>
    <div class="import-dialog-content">
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            :title="platform == 1 ? '导入订单' : '导入小红书订单'"
            width="400px"
            class="import-dialog">
            <!-- <el-row v-if="step == 1" class="import-platform my15">
                <el-col :span="12">
                    <div class="text-center py12 platform-col" :class="platform == 1 ? 'active' : ''" @click="platform = 1">
                        <img src="/img/icon_dd.png" class="mt4" width="50" alt="">
                        <div class="font14 mt15">抖店订单</div>
                        <i class="xiconfont xicon-uf_check" v-if="platform == 1"></i>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="text-center py12 platform-col" :class="platform == 2 ? 'active' : ''" @click="platform = 2">
                        <img src="/img/icon_xhs.png" width="60" alt="">
                        <div class="font14 mt9">小红书订单</div>
                        <i class="xiconfont xicon-uf_check" v-if="platform == 2"></i>
                    </div>
                </el-col>
            </el-row> -->
            <div class="img-box" v-loading="dialogLoading" v-if="platform == 1">
                <div class="font13 color-red text-left lh18 mb8">
                    各位客官，订单是外部导入，不经过本平台审核，请确保订单与发货地址匹配
                </div>
                <div class="text-left">
                    <el-button type="text" icon="el-icon-download" @click="onDownTemplate(1)">模版1</el-button>
                    <el-button type="text" icon="el-icon-download" @click="onDownTemplate(2)">模版2</el-button>
                </div>
                <el-upload
                    drag
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="beforeImgUpload"
                    class="excel-uploader"
                    accept=".xls,.xlsx"
                    action=""
                    >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将Excel文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">请选择xls，xlsx格式的文件上传，且不超过1M</div>
                </el-upload>
            </div>
            <div class="img-box" v-loading="dialogLoading" v-else-if="platform == 2">
                <div class="font13 color-red text-left lh18 mb8">
                    各位客官，订单是外部导入，不经过本平台审核，请确保订单与发货地址匹配
                </div>
                <el-upload
                    drag
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="beforeXhsImgUpload"
                    class="excel-uploader"
                    accept=".xls,.xlsx"
                    action=""
                    >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将Excel文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">请选择xls，xlsx格式的文件上传，且不超过1M</div>
                </el-upload>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { readFile } from '@/util/util'
import * as XLSX from 'xlsx/xlsx.mjs'
import { importOrderAddr, fileImportOrderInfo } from '@/api/dfh/order'
export default {
    components: {
    },
    data() {
        return {
            dialogVisible: false,
            dialogLoading: false,
            loading: false,
            item: {},
            platform: 1
        }
    },
    watch: {
        dialogVisible (val, oldVal) {
            if (!val) {
                setTimeout(() => {
                    this.platform = 1
                }, 300)
            }
        },
    },
    computed: {},
    methods: {
        // 处理小红书文件流数据
        async beforeXhsImgUpload (file) {
            this.dialogLoading = true
            console.log('file', file)
            const isLt1M = file.size / 1024 / 1024 < 1
            if (!isLt1M) {
                this.$message.error('导入小红书订单大小不能超过 1MB!')
                this.dialogLoading = false
                return
            }
            //选择excel文件后，并读取其内容（文件流）
            setTimeout(async () => {
                try {
                    let dataBinary = await readFile(file.raw)
                    if (dataBinary != null) {
                        // 将整个文件以二进制形式读取
                        let workBook = XLSX.read(dataBinary, { type: 'binary', cellDates: true })
                        // 工作表数量
                        let workBookLen = workBook.SheetNames.length
                        // excel工作簿内容
                        let excelBook = []
                        //读取每个sheets表
                        for (let i = 0; i < workBookLen; i++) {
                            let workSheet = workBook.Sheets[workBook.SheetNames[i]]
                            const data = XLSX.utils.sheet_to_json(workSheet, {
                                defval: null,            //单元格为空时的默认值
                                raw: false,             //使用w的值而不是v
                                dateNF: 'yyyy-MM-dd'   //日期格式
                            })
                            excelBook.push(...data)
                        }
                        
                        // 处理数据，校验属于可用性
                        const resultData = this.handleXhsImportData(excelBook)
                        console.log('resultData', resultData)
                        if (resultData.err.length) {
                            const errIndex = resultData.err.join(',')
                            this.$alert(`数据中第${errIndex}条数据不符合导入规范，请检查收件人信息是否完善后再尝试重新导入！`, '温馨提示', {
                                confirmButtonText: '我知道了',
                                callback: () => {
                                    this.dialogLoading = false
                                }
                            })
                        } else {
                            // 数据校验通过，上传数据
                            this.onXhsSubmit(resultData.data)
                        }
                    }
                } catch (err) {
                    this.$alert(`啊哦，服务器打瞌睡了，请联系管理员！${err}`, '温馨提示', {
                        confirmButtonText: '我知道了',
                        callback: () => {
                            this.dialogLoading = false
                        }
                    })
                }
            }, 100)
        },
        // 校验小红书excel数据
        handleXhsImportData (data) {
            const errIndex = []
            const result = data.map((item, index) => {
                const regroupData = {
                    orderId: item['订单号'],
                    postReceiver: item['收件人姓名'],
                    postTel: item['收件人电话'],
                    detail: item['收件人地址'],
                    province: item['省'],
                    city: item['市'],
                    town: item['区'],
                    itemNum: item['SKU件数'],
                    skuId: this.hashCode(`xhs_${item['规格ID']}`),
                    spec: item['SKU规格'],
                    shopId: this.hashCode(item['店铺名称']) + '',
                    shopName: item['店铺名称'],
                    productName: this.replaceAll(item['SKU名称'], item['SKU规格'], ''),
                    purchaseRemark: item['用户备注'],
                    orderAmount: item['商品总价(元)'] ? Number(item['商品总价(元)'] || 0) * 100 : 0,
                    payAmount: item['用户实付金额(元)'] ? Number(item['用户实付金额(元)'] || 0) * 100 : 0,
                    promotionShopAmount: item['店铺优惠(元)'] ? Number(item['店铺优惠(元)'] || 0) * 100 : 0,
                    promotionPlatformAmount: item['平台优惠(元)'] ? Number(item['平台优惠(元)'] || 0) * 100 : 0,
                    createTime: item['订单创建时间']
                }
                const {orderId, postReceiver, postTel, province, city, town, itemNum, detail, skuId, spec, shopId, createTime} = regroupData
                // 校验数据中必填内容
                if (!orderId || !postReceiver || !postTel || !province || !city || !town || !itemNum || !detail || !skuId || !spec || !createTime || !shopId) {
                    errIndex.push(index + 1)
                }
                return regroupData
            })
            return {
                err: errIndex,
                data: result
            }
        },
        // md5转唯一id
        hashCode (str) {
            let hash = 0
            if (str.length == 0) return hash
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i)
                hash = ((hash << 5) - hash) + char
                hash = hash & hash
            }
            return Math.abs(hash)
        },
        // 匹配一个字符串，并把它替换成另一个字符串
        replaceAll (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace)
        },
        // 处理文件流数据
        async beforeImgUpload (file) {
            this.dialogLoading = true
            console.log('file', file)
            const isLt1M = file.size / 1024 / 1024 < 1
            if (!isLt1M) {
                this.$message.error('导入代发订单大小不能超过 1MB!')
                this.dialogLoading = false
                return
            }
            //选择excel文件后，并读取其内容（文件流）
            setTimeout(async () => {
                try {
                    let dataBinary = await readFile(file.raw)
                    if (dataBinary != null) {
                        // 将整个文件以二进制形式读取
                        let workBook = XLSX.read(dataBinary, { type: 'binary', cellDates: true })
                        // 工作表数量
                        let workBookLen = workBook.SheetNames.length
                        // excel工作簿内容
                        let excelBook = []
                        //读取每个sheets表
                        for (let i = 0; i < workBookLen; i++) {
                            let workSheet = workBook.Sheets[workBook.SheetNames[i]]
                            const data = XLSX.utils.sheet_to_json(workSheet, {
                                defval: null,            //单元格为空时的默认值
                                raw: false,             //使用w的值而不是v
                                dateNF: 'yyyy-MM-dd'   //日期格式
                            })
                            excelBook.push(...data)
                        }
                        
                        // 处理数据，校验属于可用性
                        const resultData = this.handleImportData(excelBook)
                        if (resultData.err.length) {
                            const errIndex = resultData.err.join(',')
                            this.$alert(`数据中第${errIndex}条数据不符合导入规范，请检查收件人信息是否完善后再尝试重新导入！`, '温馨提示', {
                                confirmButtonText: '我知道了',
                                callback: () => {
                                    this.dialogLoading = false
                                }
                            })
                        } else {
                            // 数据校验通过，上传数据
                            this.onSubmit(resultData.data)
                        }
                        // console.log({
                        //     name: file.name,
                        //     length: workBookLen,
                        //     data: excelBook
                        // })
                    }
                } catch (err) {
                    this.$alert(`啊哦，服务器打瞌睡了，请联系管理员！${err}`, '温馨提示', {
                        confirmButtonText: '我知道了',
                        callback: () => {
                            this.dialogLoading = false
                        }
                    })
                }
            }, 100)
        },
        // 校验数据
        handleImportData (data) {
            const errIndex = []
            const result = data.map((item, index) => {
               const regroupData = {
                  orderId: item['订单号'],
                  allDetailText: item['收件人地址'],
                  province: item['省'],
                  city: item['市'],
                  town: item['区'],
                  street: item['街道'],
                  encryptDetailText: item['详细地址'],
                  postReceiver: item['收件人姓名'] || item['收件人'],
                  postTel: item['电话收件人电话'] || item['收件人手机号']
              };
              const {orderId, postReceiver, postTel, province, city, town, encryptDetailText, allDetailText} = regroupData
              // 校验数据中必填内容
              if (!orderId || !postReceiver || !postTel || !((province && city && town && encryptDetailText) || allDetailText)) {
                  errIndex.push(index + 1)
              }
              return regroupData
            })
            return {
                err: errIndex,
                data: result
            }
        },
        async onSubmit (obj) {
            console.log('obj', obj)
            try {
                const { data } = await importOrderAddr({importDecryptVOList: obj})
                console.log('data', data)
                this.dialogLoading = false
                if (data.code === 0) {
                    this.$message.success(data.data)
                }
            } catch (err) {
                this.dialogLoading = false
            }
        },
        async onXhsSubmit (obj) {
            console.log('obj', obj)
            try {
                const { data } = await fileImportOrderInfo({fileImportOrderInfo: obj})
                console.log('data', data)
                this.dialogLoading = false
                if (data.code === 0) {
                    this.$message.success(data.data)
                }
            } catch (err) {
                this.dialogLoading = false
            }
        },
        showModel (type) {
            this.dialogVisible = true
            this.platform = type
        },
        onDownTemplate (type) {
            switch (type) {
                case 1:
                    window.location.href = 'https://bucket.damaijia.co/%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF%E4%B8%80.xls'
                break;
                case 2:
                    window.location.href = 'https://bucket.damaijia.co/%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF%E4%BA%8C.xls'
                break;
            }
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
}
</script>
<style lang="scss">
.import-dialog-content {
    .import-dialog {
        .el-dialog {
            border-radius: 10px;
            .el-dialog__header {
                padding: 15px 20px 5px;
                .el-dialog__title {
                    font-size: 15px;
                    font-weight: 500;
                }
            }
            .el-dialog__body {
                position: relative;
                text-align: center;
                padding: 5px 20px;
                font-size: 16px;
                color: #333;
                .platform-col {
                    width: 100px;
                    margin: 0 auto;
                    border-radius: 5px;
                    border: 1px solid #fff;
                    cursor: pointer;
                    position: relative;
                    i {
                        position: absolute;
                        right: -1px;
                        bottom: 0px;
                        color: rgb(70, 180, 109);
                    }
                }
                .platform-col:hover {
                    border: 1px solid rgb(70, 180, 109);
                }
                .platform-col.active {
                    border: 1px solid rgb(70, 180, 109);
                }
                .img-box {
                    .el-loading-mask {
                        position: absolute;
                    }
                    .excel-uploader {
                        .el-upload__tip {
                            font-size: 13px;
                            text-align: left;
                        }
                    }
                }
            }
        }
    }
}
</style>