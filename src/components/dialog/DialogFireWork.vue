<template>
    <div class='fire-work' v-show="visible">
        <div class="stage-container">
            <div class="canvas-container">
                <canvas id="trails-canvas"></canvas>
                <canvas id="main-canvas"></canvas>
            </div>
        </div>
    </div>
</template>

<script>
// import { handlePointerStart } from '@/scripts/firework/index'
let handlePointerStart = null
export default {
    components: {},
    data() {
        return {
            visible: false
        }
    },
    computed: {},
    methods: {
        start () {
            // 展示画布
            this.visible = true
            handlePointerStart = require('@/scripts/firework/index').handlePointerStart
            // 引入烟花
            console.log('handlePointerStart', handlePointerStart)
            let x = window.innerWidth / 2
            // 绽放烟花
            handlePointerStart({x: x - 300, y: 250, type: 'start', onCanvas: true, config: {shell: 'Strobe'}})
            handlePointerStart({x: x + 300, y: 300, type: 'start', onCanvas: true, config: {shell: 'Floral'}})
            // 隐藏画布
            setTimeout(() => {
                this.visible = false
            }, 6000)
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        // const { handlePointerStart } = require('@/scripts/firework/index')
        // console.log('handlePointerStart', handlePointerStart)
    },
    //生命周期 - 销毁完成
    destroyed() {
        handlePointerStart = null
    },
}
</script>
<style lang="scss" scoped>
.fire-work {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .stage-container {
        width: 100%;
        height: 100%;
    }
}
</style>