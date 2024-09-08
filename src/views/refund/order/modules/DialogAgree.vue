<template>
    <el-dialog
        class="agree-dialog"
        title="处理仅退款"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        v-loading="dialogLoading"
        width="512px">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="是否处理：">
                <el-radio-group v-model="form.type" @change="onTypeChange">
                    <el-radio :label="201">同意退款</el-radio>
                    <el-radio :label="202">拒绝退款</el-radio>
                </el-radio-group>
            </el-form-item>
            <template v-if="form.type == 202">
                <el-form-item label="拒绝理由：" prop="rejectReasonCode" key="rejectReasonCode">
                    <el-select v-model="form.rejectReasonCode" placeholder="请选择拒绝理由" style="width: 100%;" @change="onReasonChange">
                        <el-option v-for="(item, index) in codeList" :key="index" :label="item.reason" :value="item.rejectReasonCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上传凭证：" prop="evidence" v-if="rejectItem.evidenceNeed === 'Y'" key="evidence">
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
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit" :loading="loading">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { rejectCodeList, refundOperate, AfterSaleOperateDouDian } from '@/api/refund/order'
import store from "@/store"
export default {
    components: {},
    watch: {
        dialogVisible (val, oldVal) {
            if (!val) {
                this.form = {
                    type: 201
                }
                this.rejectItem = {}
                this.evidenceUrl = ''
                this.$refs.form.resetFields()
            }
        }
    },
    data() {
        return {
            dialogVisible: false,
            dialogLoading: false,
            form: {
                type: 201
            },
            imgDomain: "http://bucket.damaijia.co/",
            evidenceUrl: '',
            headers: {
                Authorization: "Bearer " + store.getters.access_token,
            },
            codeList: [],
            rejectItem: {},
            rules: {
                rejectReasonCode: [
                    { required: true, message: '请选择拒绝类型', trigger: 'change' }
                ],
                evidence: [
                    { required: true, message: '请上传拒绝凭证', trigger: 'change' }
                ],
                reason: [
                    { required: true, message: '请填写拒绝原因', trigger: 'blur' }
                ]
            },
            loading: false,
            noReject: false,
            item: {}
        }
    },
    computed: {},
    methods: {
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
        onTypeChange (val) {
            console.log('val', val)
            if (this.noReject) {
                this.$alert('有商品未发货，无法直接拒绝此退款申请。 若您实际已发货，可上传发货单号并及时向消费者沟通说明。发货后将默认驳回消费者退款申请。若您实际还未发货，请及时同意退款。如果未经买家同意, 平台介入后核实是您的责任, 将进行处罚。', '温馨提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.form.type = 201
                    }
                })
            }
        },
        onSubmit () {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let params = {type: this.form.type, aftersaleIds: this.form.aftersaleIds}
                    if (params.type === 202) {
                        params = {
                            ...this.form,
                            remark: this.form.reason
                        }
                        if (this.form.evidence) {
                            params['evidenceUrl'] = [this.imgDomain + this.form.evidence]
                        }
                    }
                    this.loading = true
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
                this.form = { type: 201 }
                this.dialogVisible = false
                this.$message.success('操作成功')
                this.$emit('success')
            }
        },
        showEdit (item) {
            this.dialogVisible = true
            this.item = item
            this.form.aftersaleIds = [item.aftersaleId]
            // 如果订单为未发货仅退款，不可以发起拒绝
            this.noReject = item.aftersaleType == 2
            // pkg 获取订单是否是为已签收订单 orderType过滤订单类型 aftersaleType 仅退款类型（未发货，已发货）aftersaleStatus（6， 11待商家处理状态）
            this.getCodeList(item.orderType, item.aftersaleType, item.aftersaleStatus)
            
        },
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
    .agree-dialog {
        border-radius: 10px;
        ::v-deep .el-dialog__header {
            padding: 15px 20px 15px;
            border-bottom: 1px solid #ededed;
            .el-dialog__title {
                font-size: 15px;
                font-weight: 500;
            }
        }
        ::v-deep .el-dialog__body {
            .el-form {
                padding-left: 30px;
                padding-right: 40px;
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
</style>