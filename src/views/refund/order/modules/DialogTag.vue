<template>
    <el-dialog
        class="tag-dialog"
        title="订单标记"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        @close="onClose"
        width="512px">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="top">
            <el-form-item label="标记类型" prop="orderSignId">
                <el-button class="tag-add-btn" type="primary" @click="onAddTag" v-if="radioList.length < 10">添加标记</el-button>
                <el-radio-group v-model="form.orderSignId" v-if="radioList.length">
                    <div class="radio-item" v-for="(item, index) in radioList" :key="index">
                        <template v-if="item.edit || item.add">
                            <el-input type="text" size="mini" v-model="item.orderSignName" maxlength="8" show-word-limit></el-input>
                            <el-button size="mini" type="primary" @click.stop="onItemSave(index)">保存</el-button>
                            <el-button size="mini" @click.stop="onItemCancel(index)">取消</el-button>
                        </template>
                        <template v-else>
                            <el-radio :label="item.orderSignId">{{item.orderSignName}}</el-radio>
                            <i class="el-icon-edit-outline edit-icon" @click="onItemEdit(index)"></i>
                            <i class="el-icon-delete del-icon" @click="onItemDel(index)"></i>
                        </template>
                    </div>
                </el-radio-group>
                <el-empty v-else description="暂无标记类型"></el-empty>
            </el-form-item>
            <el-form-item label="备注内容">
                <el-input
                    type="textarea"
                    :rows="3"
                    resize="none"
                    placeholder="请输入备注"
                     maxlength="100"
                     show-word-limit
                    v-model="form.orderSignRemark">
                </el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit" :loading="loading">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { signFetchList, addObj, delObj, putObj, bindObj } from '@/api/dfh/sign'
export default {
    components: {},
    data() {
        return {
            dialogVisible: false,
            form: {},
            rules: {
                orderSignId: [
                    { required: true, message: '标记类型不能为空', trigger: 'change' }
                ]
            },
            loading: false,
            radioList: [],
            editLabel: '',
            orderId: ''
        }
    },
    computed: {},
    methods: {
        onAddTag () {
            this.radioList.unshift({add: 1})
        },
        onClose () {
            this.form = {}
            this.orderId = ''
        },
        onSubmit () {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    this.loading = true
                    const params = {
                        orderId: this.orderId,
                        orderSignId: this.form.orderSignId,
                        orderSignRemark: this.form.orderSignRemark
                    }
                    try {
                        const { data } = await bindObj(params)
                        this.loading = false
                        if (data.code == 0) {
                            this.form = {}
                            this.dialogVisible = false
                            this.$message.success('标记成功')
                            this.$emit('success')
                        }
                    } catch (err) {
                        this.loading = false
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            });
        },
        showEdit (item) {
            this.orderId = item.relatedId
            if (item.orderSignId) {
                this.form = {
                    orderSignId: item.orderSignId,
                    orderSignRemark: item.orderSignRemark
                }
            }
            this.dialogVisible = true
        },
        onItemEdit (index) {
            const editStatus = this.radioList.filter(item => {
                return item.edit || item.add
            })
            if (editStatus.length) {
                this.$message.warning('当前正在编辑，请先保存！')
                return
            }
            const item = this.radioList[index]
            this.editLabel = item.orderSignName
            this.$set(this.radioList, index, {...item, edit: 1})
        },
        async onItemSave (index) {
            const item = this.radioList[index]
            if (item.add) {
                if (!item.orderSignName) return this.$message.warning('请输入标记名称')
                const { data } = await addObj(item)
                if (data.code == 0) {
                    item.add = 0
                    delete item.add
                }
                item.orderSignId = data.data
            } else {
                const { data } = await putObj(item)
                if (data.code == 0) {
                    item.edit = 0
                }
            }
        },
        onItemCancel (index) {
            const item = this.radioList[index]
            if (item.add) {
                this.radioList.splice(index, 1)
            }
            item.edit = 0
            item.orderSignName = this.editLabel
        },
        onItemDel (index) {
            const item = this.radioList[index]
            this.$confirm(`您正在删除${item.orderSignName}标记`, '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data } = await delObj(item.orderSignId)
                this.radioList.splice(index, 1)
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
            })
        },
        async onLoadList () {
            const { data } = await signFetchList()
            this.radioList = data.data.records || []
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.onLoadList()
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
    },
    //生命周期 - 销毁完成
    destroyed() {},
}
</script>

<style lang="scss" scoped>
    .tag-dialog {
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
            padding: 10px 20px;
            .el-form {
                .el-empty {
                    padding: 0;
                    .el-empty__image {
                        width: 60px;
                    }
                    .el-empty__description {
                        margin-top: 0;
                    }
                }
                .tag-add-btn {
                    position: absolute;
                    right: 0;
                    top: -42px;
                }
                .el-radio-group {
                    display: block;
                    min-height: 100px;
                    max-height: 180px;
                    overflow-y: scroll;
                }
                .radio-item {
                    padding: 8px;
                    border-radius: 5px;
                    display: flex;
                    align-items: center;
                    .el-input {
                        margin-right: 20px;
                        .el-input__icon {
                            display: none;
                        }
                    }
                    .el-button {
                        padding: 5px 10px;
                    }
                    .el-radio {
                        margin-right: 0;
                        flex: 1;
                    }
                    i {
                        font-size: 17px;
                        margin-left: 8px;
                        cursor: pointer;
                        display: none;
                    }
                    i:hover {
                        color: rgb(70, 180, 109);
                    }
                }
                .radio-item:hover {
                    background-color: #ededed;
                    i {
                        display: block;
                    }
                }
            }
        }
    }
</style>