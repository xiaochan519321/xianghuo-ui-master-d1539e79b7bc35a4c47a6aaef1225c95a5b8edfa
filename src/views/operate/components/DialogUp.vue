<template>
    <div class="operate-dialog-up" v-if="dialogVisible">
        <div class="content text-center">
            <img class="bg-img" src="/img/bg_operate.png" width="175" height="241" alt="">
            <div class="mt30">
                <p class="mb30 font18" style="font-weight: 500;">此功能需要开通旗舰版及以上会员才能使用</p>
                <el-button round type="primary" size="medium" @click="$router.push('/members/index')">现在升级</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
            dialogVisible: false,
            loading: false,
            options: {
                height: 200,
                width: 200,
            }
        }
    },
    watch: {
        dialogVisible (val, oldVal) {
            if (!val) {
                this.$emit('close')
            }
        },
    },
    computed: {},
    methods: {
        onClose () {
            this.dialogVisible = false
        },
        showModel (data) {
            this.dialogVisible = true
        }

    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
}
</script>
<style lang="scss">
.operate-dialog-up {
    position: absolute;
    width: 100%;
    min-height: 100%;
    background-color: rgba(255,255,255,0.3);
    backdrop-filter: blur(5px);
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2000;
    .content {
        position: absolute;
        left: 50%;
        top: 38%;
        transform: translate(-50%, -50%);
    }
}
</style>