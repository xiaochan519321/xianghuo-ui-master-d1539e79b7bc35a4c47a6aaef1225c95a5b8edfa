<template>
    <div class="import-dialog-content">
        <el-dialog
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            title="导入其他订单"
            width="400px"
            class="import-dialog">
            <div class="img-box" v-loading="dialogLoading">
                <div class="font13 color-red text-left lh18 mb8">
                    各位客官，订单是外部导入，不经过本平台审核，请确保订单与发货地址匹配
                </div>
                <div class="text-left">
                    <el-button type="text" icon="el-icon-download" @click="onDownTemplate(1)">下载模版</el-button>
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
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { readFile } from '@/util/util'
import * as XLSX from 'xlsx/xlsx.mjs'
import { fileImportOrderInfo } from '@/api/dfh/order'
import { mapState } from 'vuex'
import md5 from 'js-md5'
import AddressParse from 'address-parse'

export default {
    components: {
    },
    data() {
        return {
            dialogVisible: false,
            dialogLoading: false,
            loading: false,
            item: {},
            platform: 1,
            ssqData: []
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
    computed: {
        ...mapState({
            my: state => state.user.my
        }),
    },
    methods: {
        // 处理小红书文件流数据
        async beforeImgUpload (file) {
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
                        const resultData = this.handleImportData(excelBook)
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
                            this.onSubmit(resultData.data)
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
        handleImportData (data) {
            const errIndex = []
            const result = data.map((item, index) => {
                const ssqRes = this.handleAutoEncrypt(item['收货地址'])
                const regroupData = {
                    orderId: `QT${this.hashOrderCode(item, index)}`,
                    postReceiver: item['收件人名字'],
                    postTel: item['手机号码'],
                    detail: item['收货地址'],
                    province: ssqRes.province,
                    city: ssqRes.city,
                    town: ssqRes.area,
                    itemNum: item['下单件数'],
                    skuId: this.hashCode(`${this.my.userId}${item['规格ID']}`),
                    spec: item['商品规格'],
                    shopId: this.my.userId,
                    shopName: '其他平台',
                    productName: item['商品标题'],
                    purchaseRemark: '',
                    orderAmount: 0,
                    payAmount: 0,
                    promotionShopAmount: 0,
                    promotionPlatformAmount: 0,
                    createTime: ''
                }
                const {orderId, postReceiver, postTel, itemNum, detail, skuId, spec, province, city, town} = regroupData
                // 校验数据中必填内容
                if (!orderId || !postReceiver || !postTel || !itemNum || !detail || !skuId || !spec || !province || !city || !town) {
                    errIndex.push(index + 1)
                }
                return regroupData
            })
            return {
                err: errIndex,
                data: result
            }
        },
        // 订单生成唯一ID规则
        hashOrderCode (item, index) {
            const hashStr = `${item['收件人名字']}${item['手机号码']}${item['收货地址']}${item['下单件数']}${item['规格ID']}${item['商品规格']}${item['商品标题']}${index}`
            const md5Str = md5(hashStr)
            return this.hashCode(md5Str)
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
        async onSubmit (obj) {
            console.log('obj', obj)
            try {
                const { data } = await fileImportOrderInfo({fileImportOrderInfo: obj, bType: '102'})
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
                    window.location.href = 'https://bucket.damaijia.co/%E5%85%B6%E5%AE%83%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%8801.xlsx'
                break;
            }
        },

        // 自动识别地址
        handleAutoEncrypt (address) {
            if (!address) {
                return {}
            }
            const [result] = AddressParse.parse(address)
            let province = ''
            let city = ''
            let area = ''
            try {
                //   匹配省
                this.ssqData.some(pro => {
                    if (pro.label === result.province) {
                            province = pro.label
                            //   匹配市
                            pro.children && pro.children.some(cit => {
                                if (cit.label === result.city) {
                                    city = cit.label
                                    cit.children && cit.children.some(are => {
                                        if (are.label === result.area) {
                                            area = are.label
                                            return true
                                        }
                                    })
                                    return true
                                }
                            })
                            return true
                    }
                })
            } catch (err) {
                province = ''
                city = ''
                area = ''
            }
            console.log('province', province)
            console.log('city', city)
            console.log('area', area)
            return {
                province,
                city,
                area
            }
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        var ssqData = require('.././data.json')
        this.ssqData = ssqData
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