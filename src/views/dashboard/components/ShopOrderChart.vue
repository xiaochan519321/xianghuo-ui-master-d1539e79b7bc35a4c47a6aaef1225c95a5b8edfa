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
            datas: {},
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
            this.datas = data;
            this.$nextTick(() => {
                this.chart = echarts.init(this.$refs.chart);
                this.setOptions(data.xAxisData, data.seriesData, data.type);
            });
        },
        setOptions(xAxisData, seriesData, type) {
            const option = {
                tooltip: {
                    trigger: 'axis'
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
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        margin: 50,
                    },
                    axisLine: {
                        show: false,
                    },
                    data: xAxisData,
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: '',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: 'rgba(161, 128, 244, 0.05)',
                                }, {
                                    offset: 1,
                                    color: '#ece5fe',
                                }],
                                global: false,
                            },
                        },
                        itemStyle: {
                            color: '#a180f4',
                            opacity: 1,
                        },
                        lineStyle: {
                            width: 2,
                            color: '#a180f4',
                            shadowColor: '#a180f4',
                            shadowBlur: 8,
                        },
                        data: seriesData,
                    },
                ]
            };
            // type 1 店铺销售订单, 2 店铺销售额
            if (type === 2) {
                option.series[0].smooth = false;
                option.series[0].areaStyle.color.colorStops = [{
                    offset: 0,
                    color: 'rgba(158, 234, 133, 0.05)',
                }, {
                    offset: 1,
                    color: '#9EEA85',
                }];
                option.series[0].itemStyle = {
                    color: '#9EEA85',
                    opacity: 1,
                },
                    option.series[0].lineStyle = {
                        width: 2,
                        color: '#9EEA85',
                        shadowColor: '#9EEA85',
                        shadowBlur: 8,
                    };
            } else {
                option.yAxis = {
                    type: 'value',
                    minInterval: 1,
                };
            }

            this.chart.setOption(option);
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    .chart {
        width: 100%;
        height: 500px;
    }
}
</style>
