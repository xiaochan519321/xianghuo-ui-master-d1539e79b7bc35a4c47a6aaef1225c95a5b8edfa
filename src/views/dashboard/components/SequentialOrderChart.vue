<template>
    <div class="container" v-loading="loading">
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
        ...mapGetters([
            'isCollapse'
        ]),
    },
    // watch: {
    //     isCollapse(val) {
    //         if (val) {
    //             const timer = setInterval(() => {
    //                 this.chart.resize();
    //                 setTimeout(() => {
    //                     clearInterval(timer);
    //                 }, 1000);
    //             }, 10)
    //         }
    //     },
    // },
    created() {

    },
    mounted() {
    },
    methods: {
        initData(data) {
            this.$nextTick(() => {
                this.chart = echarts.init(this.$refs.chart);
                this.setOptions(data.days, data.lastData, data.beforeData, data.legendData);
            });
        },
        setOptions(days, lastData, beforeData, legendData) {
            const option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    icon: 'circle',
                    left: 30,
                    data: legendData
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: days,
                    minInterval: 1,
                    axisLabel: {
                        margin: 40,
                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    }
                },
                yAxis: {
                    type: 'value',
                    minInterval: 1,
                },
                series: [
                    {
                        name: legendData[0],
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: 'rgba(255, 151, 0, 0.05)',
                                }, {
                                    offset: 1,
                                    color: '#fefaf0',
                                }],
                                global: false,
                            },
                        },
                        itemStyle: {
                            color: '#FF9700',
                            opacity: 1,
                        },
                        lineStyle: {
                            width: 2,
                            color: '#FF9700',
                            shadowColor: '#FF9700',
                            shadowBlur: 8,
                        },
                        data: beforeData,
                    },
                    {
                        name: legendData[1],
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: 'rgba(0, 132, 255, 0.05)',

                                }, {
                                    offset: 1,
                                    color: '#f1f6f9',
                                }],
                                global: false,
                            },
                        },
                        itemStyle: {
                            color: '#0084FF',
                            opacity: 1,
                        },
                        lineStyle: {
                            width: 2,
                            color: '#0084FF',
                            shadowColor: '#0084FF',
                            shadowBlur: 8,
                        },
                        data: lastData,
                    },
                ]
            };
            this.chart.setOption(option);
        },

    },
};
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    .chart {
        width: 100%;
        height: 500px;
    }
}
</style>
