<template>
    <div class='market-dialog'>
        <el-dialog title="请选择前往的服务市场" :visible.sync="marketDialog" width="512px" top="20%" :close-on-click-modal="false">
            <el-radio-group v-model="marketType">
                <el-radio :label="index" v-for="(item, index) in marketList" :key="index">{{item.name}}</el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="marketDialog = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">前 往</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            marketDialog: false,
            marketType: 0,
            marketList: []
        }
    },
    computed: {},
    methods: {
        showEdit (list) {
            this.marketDialog = true
            this.marketList = list
        },
        onSubmit () {
            console.log('submit')
            this.marketDialog = false
            console.log('marketList', this.marketList)
            const url = this.marketList[this.marketType].authUrl
            if (window.electron) {
            // 发送到electron进行跳转
                window.electron.send({key: 'chromeUrl', url: url})
            } else {
                window.open(url)
            }
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
.market-dialog {
    ::v-deep .el-dialog {
        border-radius: 10px;
        .el-dialog__header {
            padding: 15px 20px 15px;
            border-bottom: 1px solid #ededed;
            .el-dialog__title {
                font-size: 15px;
                font-weight: 500;
            }
        }
        .el-dialog__body {
            text-align: center;
            padding: 70px 30px 50px;
        }
    }
}
</style>