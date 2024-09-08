<template>
    <el-dialog class="dialog" :visible.sync="visible_" width="40%" :close-on-click-modal="false">
        <div slot="title" class="title-wrap">
            <span class="title">{{status == 1 ? '添加隔离商品' : '取消隔离商品'}}</span>
            <span class="tips">（最多可搜索100个商品ID）</span>
        </div>
        <div class="filter-order">
            <div class="content">
                <el-input
                    type="textarea"
                    :rows="8"
                    placeholder="请输入商品ID（多个用逗号分隔或者回车换行，支持Excel复制粘贴）"
                    v-model="orderData"
                    clearable
                ></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button class="btn" type="primary" @click="onSave" :loading="loading">确 定</el-button>
                <el-button class="btn" @click="orderData = ''">清 空</el-button>
            </span>
        </div>
    </el-dialog>
</template>

<script>

import { batchIsolation } from '@/api/dfh/product'
export default {
    name: 'filterOrder',
    data() {
        return {
            orderData: '',
            visible_: false,
            loading: false,
            status: 0
        }
    },
    computed: {
    },
    methods: {
        showEdit (status) {
            this.visible_ = true
            this.status = status
        },
        onSave() {
            const that = this
            if(!this.orderData){
                this.$message.error("请填写商品ID")
                return false
            }
            let filterOrderIds = this.orderData.replaceAll(" ","").replaceAll("\r","").replaceAll("\n",",").replaceAll("，",",")
            console.log('filterOrderIds', filterOrderIds)
            filterOrderIds = filterOrderIds.split(",")
            const message = this.status == 1 ? '是否确定将当前填写的商品进行隔离？' : '是否确定将当前填写的商品进行取消隔离？'
            this.$confirm(message, '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async function () {
                const params = {
                    isolationStatus: that.status,
                    productIds: filterOrderIds
                }
                const { data } = await batchIsolation(params)
                console.log('data', data)
                if (data.code == 0) {
                    that.$message.success('操作成功')
                    that.visible_ = false
                    that.$emit('success')
                    that.orderData = ''
                }
            })
        }
    },
    created() {

    }
}
</script>

<style lang="scss" scoped>
.dialog {
    .title-wrap {
        color: #fff;
        font-weight: 600;
        .tips {
            color: #fff;
        }
    }
    ::v-deep .el-dialog__header {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }
    ::v-deep .el-dialog {
        border-radius: 10px;
    }
    ::v-deep .el-dialog__header {
        background-color: #1890ff;
    }

    ::v-deep .el-dialog__close {
        color: #fff;
        font-size: 20px;
    }

    .dialog-footer {
        margin-top: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        .btn {
            width: 87px;
            height: 30px;

            &:nth-child(2) {
                margin-left: 20px;
            }
        }
    }
}
</style>
