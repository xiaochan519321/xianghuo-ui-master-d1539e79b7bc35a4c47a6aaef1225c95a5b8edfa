<template>
    <el-dialog class="dialog" :visible.sync="visible_" width="50%" :close-on-click-modal="false">
        <div slot="title" class="title-wrap">
            <span class="title">批量添加Token号</span>
        </div>
        <div class="filter-order">
            <div class="content">
                <el-input
                    type="textarea"
                    :rows="10"
                    placeholder="请输入文本格式为手机号、UID、token直接粘贴到这里"
                    v-model="orderData"
                    clearable
                ></el-input>
            </div>
            <div class="demo-tips mt15">
                示例: 请将文本里的：手机号----UID----Token复制粘贴到面板一行一个，若没有手机号可不填
            </div>
            <div class="color-red font12 mt10">
                注意：Token号导入后暂不可更改每日下单量，务必在导入前确认，每日下单量可前往个人号设置中配置
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button class="btn" @click="orderData = ''">清 空</el-button>
                <el-button class="btn" type="primary" @click="onSave" :loading="loading">确 定</el-button>
            </span>
        </div>
    </el-dialog>
</template>

<script>
import { importTokens } from '@/api/dfh/privateAccount'
export default {
    name: 'filterOrder',
    data() {
        return {
            orderData: '',
            visible_: false,
            loading: false,
        }
    },
    computed: {
    },
    methods: {
        showModel () {
            this.visible_ = true
        },
        onSave() {
            const that = this
            let errItem = null
            if(!this.orderData){
                this.$message.warning("请先填写token")
                return false
            }
            let filterOrderIds = this.orderData.replaceAll(" ","").replaceAll("\r\n","").replaceAll("\r","").replaceAll("\n",",").replaceAll("，",",")
            filterOrderIds = filterOrderIds.split(",")
            try {
                filterOrderIds.forEach((item, index) => {
                    if (item && item.indexOf('--') == -1) {
                        errItem = item
                        throw Error(index)
                    }
                })
            } catch (index) {
                console.log('idex', index)
                if (index) {
                    index = index.toString().replace('Error: ', '')
                    this.$confirm(`<div>第${index - 0 + 1}行<span style='color: red;'>${errItem}</span>格式有误,请检查是否存在换行或者空格！</div>`, '温馨提示', {
                        confirmButtonText: '知道了',
                        showCancelButton: false,
                        closeOnClickModal: false,
                        dangerouslyUseHTMLString: true,
                        type: 'warning'
                    }).then(() => {
                        return
                    })
                    return
                }
            }
            console.log('filterOrderIds', filterOrderIds)
            const message = '是否确定将当前填写token号进行导入'
            this.$confirm(message, '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning'
            }).then(async function () {
                const params = {
                    tokens: filterOrderIds
                }
                const { data } = await importTokens(params)
                console.log('data', data)
                if (data.code == 0) {
                    that.$message.success('正在导入中，请稍后刷新列表查看结果!')
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
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        padding: 15px 20px;
        .el-dialog__headerbtn {
            top: 12px;
        }
    }
    ::v-deep .el-dialog {
        border-radius: 5px;
        .demo-tips {
            font-size: 12px;
            color: #1890ff;
        }
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
