<template>
    <el-dialog class="dialog" :visible.sync="visible_" width="40%">
        <div slot="title" class="title-wrap">
            <span class="title">添加隔离订单</span>
            <span class="tips">（最多可搜索100个订单号）</span>
        </div>
        <div class="filter-order">
            <div class="content">
                <el-input
                    type="textarea"
                    :rows="8"
                    placeholder="请输入订单号（多个用逗号分隔或者回车换行，支持Excel复制粘贴）"
                    v-model="orderData"
                    clearable
                ></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button class="btn" type="primary" @click="submit">搜索</el-button>
                <el-button class="btn" @click="orderData = ''">清空</el-button>
            </span>
        </div>
    </el-dialog>
</template>

<script>

export default {
    name: 'filterOrder',
    props: {
        visible: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            orderData: '',
        }
    },
    computed: {
        visible_: {
            get() {
                return this.visible;
            },
            set(newVal) {
                return this.$emit('close');
            },
        },
    },
    methods: {
        submit() {
          if(!this.orderData){
            this.$message.error("请填写订单号")
            return false
          }
          let filterOrderIds = this.orderData.replaceAll(" ","").replaceAll("\r","").replaceAll("\n",",").replaceAll("，",",")
          console.log(filterOrderIds)
          filterOrderIds = filterOrderIds.split(",").filter(item=>item)
          if(!filterOrderIds || filterOrderIds.length<1){
            this.$message.error("请填写订单号")
            return false
          }else if(filterOrderIds.length>100){
            this.$message.error("最多可搜索100个订单号")
            return false
          }
          this.$emit('filter', filterOrderIds);
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
