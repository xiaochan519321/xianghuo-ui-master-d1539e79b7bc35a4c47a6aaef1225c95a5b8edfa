<template>
    <div class="succeed-container">
        <el-result icon="success" :title="`你的手机号：${phone} 注册成功`">
            <template slot="extra">
                <div>
                    <div class="img-box">
                        <img v-if="siteConfig" :src="siteConfig.contactQrcode" alt />
                    </div>
                    <div class="tips">
                        <span>请联系客服激活账号</span>
                    </div>
                </div>
            </template>
        </el-result>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    props: {
        phone: {
            type: String,
            default: '',
        }
    },
    methods: {
    },
    computed: {
        ...mapGetters(['siteConfig'])
    },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.succeed-container {
    .tips {
        margin-top: 24px;
        font-size: 20px;
        font-weight: 600;
        color: #f7b62d;
    }
    .img-box {
        width: 182px;
        height: 185px;
        padding: 15px;
        border: 1px solid #bbb6b6;
        border-radius: 10px;
    }
    & ::v-deep .el-result {
        padding: 0 20px;
    }
    &::v-deep .el-result__extra {
        margin-top: 10px;
    }
}
</style>
