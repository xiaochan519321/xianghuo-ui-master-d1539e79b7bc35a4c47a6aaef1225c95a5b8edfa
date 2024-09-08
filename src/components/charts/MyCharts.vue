<template>
    <div class="charts" ref="charts" :style="setStyle"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    props: {
        width: {
            type: String,
            default: '100%',
        },
        height: {
            type: String,
            default: '500px',
        },
    },
    data() {
        return {
            charts: null,
        };
    },
    computed: {
        setStyle() {
            return {
                width: this.width,
                height: this.height,
            };
        },
    },
    mounted() {
    },
    methods: {
        dispose () {
            if (!this.charts) this.charts.dispose()
            this.charts = null
        },
        initData(options) {
            if (!this.charts) this.charts = echarts.init(this.$refs.charts);
            setTimeout(() => {
                this.charts.clear()
                this.charts.resize()
                this.charts.setOption(options)
            }, 300)
        },
    },
};
</script>
