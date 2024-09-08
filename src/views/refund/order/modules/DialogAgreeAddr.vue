<template>
    <div class="agree-addr-dialog">
        <el-dialog
            title="处理退货退款"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="512px">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" v-loading="dialogLoading">
                <el-form-item label="是否处理：">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="101">同意退货</el-radio>
                        <el-radio :label="102">拒绝退货</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="form.type == 102">
                    <el-form-item label="拒绝理由：" prop="rejectReasonCode" key="rejectReasonCode">
                        <el-select v-model="form.rejectReasonCode" placeholder="请选择拒绝类型" style="width: 100%;" @change="onReasonChange">
                            <el-option v-for="(item, index) in codeList" :key="index" :label="item.reason" :value="item.rejectReasonCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上传凭证：" prop="evidence" key="evidence" v-if="rejectItem.evidenceNeed === 'Y'">
                        <div class="uploader-content">
                            <div class="has-img" v-if="form.evidence">
                                <el-image
                                    style="width: 86px; height: 86px;"
                                    fit="cover"
                                    ref="evidenceImg"
                                    :src="evidenceUrl"
                                    :preview-src-list="[evidenceUrl]">
                                </el-image>
                                <div class="img-event">
                                    <i class="el-icon-view" @click="onImgView"></i>
                                    <span>|</span>
                                    <i class="el-icon-delete" @click="onImgDel"></i>
                                </div>
                            </div>
                            <el-upload
                                v-else
                                :headers="headers"
                                :show-file-list="false"
                                :before-upload="beforeImgUpload"
                                :on-success="handleImgSuccess"
                                class="avatar-uploader"
                                action="/admin/sys-file/upload"
                            >
                                <i class="el-icon-plus avatar-uploader-icon" />
                            </el-upload>
                            <div class="uploader-example" v-if="rejectItem.image">
                                <span class="title">凭证示例</span>
                                <el-image
                                    style="width: 86px; height: 86px;"
                                    :src="rejectItem.image" 
                                    fit="cover"
                                    :preview-src-list="[rejectItem.image]">
                                </el-image>
                            </div>
                        </div>
                        <div class="evidence-tip">
                            <div class="title">凭证要求</div>
                            <p>1，图片要求：图片大小5MB以内，格式支持jpg/jpeg/png；</p>
                            <p>2，凭证内容: {{rejectItem.evidenceDescription}}，详情参照上方示例图</p>
                        </div>
                    </el-form-item>
                    <el-form-item label="补充描述：" prop="reason" key="reason">
                        <el-input type="textarea" :rows="3" resize="none" v-model="form.reason" placeholder="请详细描述拒绝理由，或建议先与买家有好协商"></el-input>
                    </el-form-item>
                </template>
                <template v-if="form.type == 101">
                    <el-form-item label="退货地址：" prop="receiverAddressId" key="receiverAddressId">
                        <el-select
                            v-model="form.receiverAddressId"
                            placeholder="请选择退货地址"
                            style="width: 85%"
                            @visible-change="onVisChange"
                            filterable>
                            <el-option v-for="item in addressList" :key="item.addressId" :label="`${item.recieverName} ${item.receiverProvinc}${item.receiverCity}${item.receiverDistrict}`" :value="item.addressId"></el-option>
                        </el-select>
                        <el-button class="address-add-btn" type="text" @click="onAdd">新增</el-button>
                    </el-form-item>
                    <el-form-item v-if="currenAddr" label-width="18px">
                        <div class="addr-detail">{{`${currenAddr.recieverName} ${currenAddr.receiverProvinc}${currenAddr.receiverCity}${currenAddr.receiverDistrict}${currenAddr.receiverStreet}${currenAddr.receiverDetail}`}}</div>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button type="primary" @click="onAsync" plain round :loading="asyncLoading">同步地址</el-button> -->
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            class="add-addr-dialog"
            title="新增退货地址"
            :close-on-click-modal="false"
            :visible.sync="addDialog"
            @close="dialogVisible = true"
            width="512px">
            <el-form ref="addrForm" :model="addrForm" :rules="addrRules" label-width="100px">
                <el-form-item label="联系人：" prop="userName">
                    <el-input type="text" v-model.trim="addrForm.userName" placeholder="请输入联系人姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系电话：" prop="mobile">
                    <el-input type="text" v-model.trim="addrForm.mobile" placeholder="请输入联系人电话"></el-input>
                </el-form-item>
                <el-form-item label="退货地址：" prop="city">
                    <el-cascader
                        style="width: 100%"
                        v-model="addrForm.city"
                        :props="cityProps"
                        :options="cityOption">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址：" prop="detail">
                    <el-input type="textarea" :rows="3" resize="none" v-model="addrForm.detail" placeholder="请输入详细地址"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="onAddrSave" :loading="addrLoading">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { cityData } from '@/util/cityData'
import { throttle } from '@/scripts/utils/index';
import { rejectCodeList, syncAddress, awaitAddress, addressList, refundOperate, refundNewAddr, AfterSaleOperateDouDian } from '@/api/refund/order'
import store from "@/store"
import { isvalidatemobile } from "@/util/validate"
export default {
    components: {},
    watch: {
        dialogVisible (val, oldVal) {
            if (!val) {
                this.$nextTick(() => {
                    if (!this.addDialog) {
                        this.form = {
                            type: 101
                        }
                        this.rejectItem = {}
                        this.evidenceUrl = ''
                        this.$refs.form.resetFields()
                    }
                })
            }
        }
    },
    data() {
        const validatePhone = (rule, value, callback) => {
            if (isvalidatemobile(value)[0]) {
                callback(new Error(isvalidatemobile(value)[1]));
            } else {
                callback();
            }
        };
        return {
            dialogVisible: false,
            dialogLoading: false,
            imgDomain: "http://bucket.damaijia.co/",
            evidenceUrl: '',
            headers: {
                Authorization: "Bearer " + store.getters.access_token,
            },
            codeList: [],
            rejectItem: {},
            addDialog: false,
            form: {
                type: 101
            },
            addrForm: {},
            item: null,
            cityProps: {
                label: 'name',
                value: 'code'
            },
            asyncLoading: false,
            selectLoading: false,
            addressList: [],
            rules: {
                rejectReasonCode: [
                    { required: true, message: '请选择拒绝类型', trigger: 'change' }
                ],
                evidence: [
                    { required: true, message: '请上传拒绝凭证', trigger: 'change' }
                ],
                receiverAddressId: [
                    { required: true, message: '请选择退货地址', trigger: 'change' }
                ],
                reason: [
                    { required: true, message: '请填写拒绝原因', trigger: 'blur' }
                ]
            },
            addrRules: {
                userName: [
                    { required: true, message: '请输入联系人姓名', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, validator: validatePhone, trigger: 'blur' }
                ],
                city: [
                    { required: true, message: '请选择完整省市区', trigger: 'change' }
                ],
                detail: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' }
                ]
            },
            loading: false,
            addrLoading: false
        }
    },
    computed: {
        cityOption () {
            return cityData
        },
        currenAddr () {
            try {
                return this.addressList.filter(item => item.addressId === this.form.receiverAddressId)[0]
            } catch (err) {
                return null
            }
        }
    },
    methods: {
        onAdd () {
            console.log('add')
            this.addDialog = true
            this.dialogVisible = false
        },
        beforeImgUpload (file) {
            this.dialogLoading = true
            let width = 2048
            let height = 2048
            const isLt4M = file.size / 1024 / 1024 < 4
            if (!isLt4M) {
                this.$message.error('上传凭证大小不能超过 4MB!')
                return
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
                this.dialogLoading = false
                return file
            }, ()=>{
                this.dialogLoading = false
                this.$notify.error("图片尺寸规格要求：小于等于" + width + '*'+ height)
                return Promise.reject()
            })
            return isSize
        },
        handleImgSuccess(res, file) {
            this.evidenceUrl = `${this.imgDomain}${res.data.url}`
            this.$set(this.form, 'evidence', res.data.url)
        },
        onImgView () {
            this.$refs.evidenceImg.clickHandler()
        },
        onImgDel () {
            this.evidenceUrl = ''
            this.form.evidence = null
        },
        onReasonChange (code) {
            const item = this.codeList.filter(item => item.rejectReasonCode === code)[0]
            this.rejectItem = item
        },
        onSubmit () {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    this.loading = true
                    let params = {type: this.form.type, aftersaleIds: this.form.aftersaleIds, receiverAddressId: this.form.receiverAddressId}
                    if (params.type === 102) {
                        params = {
                            ...this.form,
                            remark: this.form.reason
                        }
                        if (this.form.evidence) {
                            params['evidenceUrl'] = [this.imgDomain + this.form.evidence]
                        }
                    }
                    try {
                        if (this.item.platform == 1) {
                            // 调用供应链接口
                            const { data } = await AfterSaleOperateDouDian(params)
                            this.onSaveSuccess(data)
                        } else {
                            const { data } = await refundOperate(params)
                            this.onSaveSuccess(data)
                        }
                    } catch (err) {
                        console.log('err', err)
                        this.loading = false
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        onSaveSuccess (data) {
            this.loading = false
            if (data.code == 0) {
                this.form = { type: 101 }
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.$emit('success')
            }
        },
        showEdit (data) {
            this.dialogVisible = true
            this.dialogLoading = true
            this.item = data
            this.form.aftersaleIds = [`${data.aftersaleId}`]
            // pkg 获取订单是否是为已签收订单 orderType过滤订单类型 aftersaleType 仅退款类型（未发货，已发货）aftersaleStatus（6， 11待商家处理状态）
            // if (data.returnAddressId) {
            //     this.$set(this.form, 'receiverAddressId', data.returnAddressId)
            // }
            // this.getAddrList()
            this.onAsync(false, data.returnAddressId)
            this.getCodeList(data.orderType, data.aftersaleType, data.aftersaleStatus)
        },
        // 同步地址
        async onAsync (showMsg = true, defaultId) {
            this.asyncLoading = true
            const { data } = await syncAddress({shopId: this.item.shopId})
            if (data.code === 0) {
                showMsg && this.$message.success('正在同步中，请稍后...')
                this.asyncLoading = false
                if (!defaultId) this.dialogLoading = false
                defaultId && this.getAddrList(defaultId)
            }
        },
        // 处理因同步问题导致的错误引导用户同步
        agienSync (msg) {
            this.$confirm(msg, '温馨提示', {
                customClass: 'address-sync-confirm',
                confirmButtonText: '开始同步',
                showCancelButton: false,
                closeOnClickModal: false,
                type: 'warning'
            }).then(res => {
                this.onAsync()
            })
        },
        // 新增退货地址
        onAddrSave () {
            this.$refs['addrForm'].validate(async (valid) => {
                if (valid) {
                    this.addrLoading = true
                    const {userName, mobile, detail, city} = this.addrForm
                    const params = {
                        userName,
                        mobile,
                        detail,
                        provinceId: city[0],
                        cityId: city[1],
                        townId: city[2],
                        streetId: city[3],
                        shopId: this.item.shopId
                    }
                    try {
                        const { data } = await refundNewAddr(params)
                        this.addrLoading = false
                        console.log('data', data)
                        if (data.code == 0) {
                            this.addrForm = {}
                            this.getAddrList()
                            this.$message.success('新增成功')
                            this.addDialog = false
                            this.$set(this.form, 'receiverAddressId', data.data)
                        } else if (data.code == 40001) {
                            this.addDialog = false
                            this.agienSync(data.msg)
                        }
                    } catch (err) {
                        this.addrLoading = false
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 下拉框显示时
        onVisChange (val) {
            val && this.getAddrList()
        },
        // 获取地址列表
        getAddrList: throttle(async function (addressId) {
            this.selectLoading = true
            const { data } = await addressList({current: 1, size: 99, shopId: this.item.shopId})
            this.addressList = data.data || []
            if (addressId) {
                console.log('addressId', addressId)
                // 需要匹配地址
                const matchItem = data.data.filter(item => item.addressId == addressId)
                matchItem.length && this.$set(this.form, 'receiverAddressId', addressId)
            }
            this.selectLoading = false
            this.dialogLoading = false
        }),
        async getCodeList (orderType, aftersaleType, aftersaleStatus) {
            const { data } = await rejectCodeList({current: 1, size: 99})
            this.codeList = data.data.records.filter(item => {
                return item.orderType == orderType
                &&item.aftersaleStatus == aftersaleStatus
                &&item.aftersaleType.indexOf(aftersaleType) > -1
            })
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
    .agree-addr-dialog {
        ::v-deep .el-dialog {
            border-radius: 10px;
            .el-loading-mask {
                position: absolute;
            }
            .el-dialog__header {
                padding: 15px 20px 15px;
                border-bottom: 1px solid #ededed;
                .el-dialog__title {
                    font-size: 15px;
                    font-weight: 500;
                }
            }
            .el-dialog__body {
                .el-form {
                    padding-left: 30px;
                    padding-right: 50px;
                    margin-top: 20px;
                    .address-add-btn {
                        margin-left: 15px;
                        font-weight: 500;
                    }
                    .addr-detail {
                        font-size: 12px;
                        color: #999;
                        font-weight: 500;
                    }
                    .uploader-content {
                        .has-img {
                            height: 86px;
                            display: inline-block;
                            position: relative;
                            border-radius: 6px;
                            outline: 2px solid rgb(70, 180, 109) !important;
                            overflow: hidden;
                            .img-event {
                                opacity: 0;
                                position: absolute;
                                bottom: 0;
                                left: 0;
                                right: 0;
                                background-color: #00000090;
                                color: #fff;
                                line-height: 26px;
                                display: flex;
                                align-items: center;
                                text-align: center;
                                i {
                                    flex: 1;
                                    cursor: pointer;
                                }
                            }
                        }
                        .has-img:hover {
                            .img-event {
                                opacity: 1;
                                transition: all 0.5s;
                            }
                        }
                        .avatar-uploader {
                            display: inline-block;
                            .el-upload {
                                height: 86px;
                                .avatar-uploader-icon {
                                    width: 86px !important;
                                    height: 86px !important;
                                    line-height: 86px !important;
                                }
                            }
                        }
                        .uploader-example {
                            display: inline-block;
                            vertical-align: top;
                            .title {
                                vertical-align: top;
                                margin: 0 20px;
                            }
                            .el-image {
                                border: 1px solid #ededed;
                                border-radius: 6px;
                            }
                        }
                    }
                    .evidence-tip {
                        color: #898B8E;
                        font-size: 12px;
                        line-height: 18px;
                        font-weight: 500;
                        margin-right: -30px;
                        .title {
                            font-weight: 600;
                        }
                    }
                }
            }
        }
        .add-addr-dialog {
            ::v-deep .el-dialog__body {
                .el-form {
                    padding-left: 40px;
                    padding-right: 50px;
                }
            }
        }
    }
</style>

<style lang="scss">
    .address-sync-confirm {
        vertical-align: baseline;
        margin-bottom: 85px;
    }
</style>