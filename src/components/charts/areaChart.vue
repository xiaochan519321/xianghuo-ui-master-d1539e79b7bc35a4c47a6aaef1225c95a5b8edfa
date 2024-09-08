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
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: option.legendData
                },
                grid: {
                    left: '0',
                    right: '2%',
                    bottom: '0',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: option.xAxisData || [1, 2, 3, 4, 5, 6, 7]
                },
                yAxis: {
                    type: 'value'
                },
                // '#419eff', '#4141e9', '#ffbb62', '#24c2dc'
                series: option.series.map(item => {
                    return {
                        name: item.name,
                        data: item.values || [],
                        type: 'line',
                        itemStyle: {
                            color: item.theme
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: item.themeStart
                                },
                                {
                                    offset: 1,
                                    color: item.themeEnd
                                }
                            ])
                        }
                    }
                })
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
