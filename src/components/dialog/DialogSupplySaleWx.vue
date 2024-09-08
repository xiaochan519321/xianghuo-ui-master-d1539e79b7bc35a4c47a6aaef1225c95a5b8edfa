<template>
    <div class="dialog-wx-supply">
        <el-dialog width="334px" :visible="visible" @close="visible = false">
            <div class="px20 flex flex-col items-center">
                <div class="font16 font-w-600">
                    <span>供应链专属负责人</span>
                </div>
                <div class="code p10 mt10">
                    <el-image src="/img/wx/supply_sale.png" style="width: 200px; height: 200px;"/>
                </div>
                <p class="mt15 lh20 font13">
                    <span>如有疑问，请添加我们的企业微信及时沟通</span>
                </p>
            </div>
        </el-dialog>
    </div>
</template>

<script>

export default {
    components: {
    },
    data() {
        return {
            visible: false,
        };
    },
    computed: {
    },
    mounted() {
        this.$bus.$on('supply-banner-dialog', () => {
            this.visible = true
        })
    },
    beforeDestroy() {
        this.$bus.$off('supply-banner-dialog')
    },
    methods: {
        showModel () {
            this.visible = true
        }
    },
};
</script>

<style lang="scss" scoped>
.dialog-wx-supply {
    ::v-deep .el-dialog {
        border-radius: 10px;
        .el-dialog__body {
            padding: 20px;
            height: 334px !important;
        }
    }
    .color-l {
        color: $themeColor;
    }
}
</style>
