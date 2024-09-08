<template>
    <div class="container">
        <div class="chart" ref="chart"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as echarts from 'echarts';

export default {
    props: {
        loading: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            chart: null,
        };
    },
    computed: {
    },
    created() {

    },
    mounted() {
    },
    methods: {
        initData(option) {
            if (this.chart) this.chart.clear()
            this.$nextTick(() => {
                this.chart = echarts.init(this.$refs.chart)
                this.setOptions(option)
            });
        },
        setOptions(option) {
            const chartOption = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    data: option.legend
                    // [{name: '个人版', icon: 'circle'}]
                },
                color: ['#419eff', '#4141e9', '#ffbb62', '#24c2dc'],
                series: [
                    {
                        name: '会员情况',
                        type: 'pie',
                        radius: '50%',
                        data: option.data || [],
                        label: {
                            show: true,
                            position: 'outside',
                            formatter: '{b} {c} ({d}%)'
                        }
                    }
                ]
            }
            this.chart.setOption(chartOption)
        },

    },
    beforeDestroy () {
        this.chart.dispose()
    }
};
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    .chart {
        width: 100%;
        height: 100%;
    }
}
</style>
