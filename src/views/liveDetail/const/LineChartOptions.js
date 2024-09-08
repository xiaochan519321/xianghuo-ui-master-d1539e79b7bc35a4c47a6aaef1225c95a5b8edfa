export default function (datas) {
    const { days, orders, purchaseOrders, returnOrders, shipmentOrders } = datas;
    const legendData = ['订单数量', '采购数量', '发货数量', '退单数量'];
    return {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            icon: 'rect',
            align: 'auto',
            data: legendData,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
            },
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
            // 订单数量
            {
                name: legendData[0],
                type: 'line',
                stack: 'Total',
                smooth: true,
                // areaStyle: {
                //     color: {
                //         type: 'linear',
                //         x: 0,
                //         y: 0,
                //         x2: 0,
                //         y2: 1,
                //         colorStops: [{
                //             offset: 0,
                //             color: 'rgba(255, 151, 0, 0.05)',
                //         }, {
                //             offset: 1,
                //             color: '#fefaf0',
                //         }],
                //         global: false,
                //     },
                // },
                itemStyle: {
                    color: '#49CDF0',
                    opacity: 1,
                },
                // lineStyle: {
                //     width: 2,
                //     color: '#49CDF0',
                //     shadowColor: '#49CDF0',
                //     shadowBlur: 8,
                // },
                data: orders,
            },
            // 采购数量
            {
                name: legendData[1],
                type: 'line',
                stack: 'Total',
                smooth: true,
                // areaStyle: {
                //     color: {
                //         type: 'linear',
                //         x: 0,
                //         y: 0,
                //         x2: 0,
                //         y2: 1,
                //         colorStops: [{
                //             offset: 0,
                //             color: 'rgba(0, 132, 255, 0.05)',

                //         }, {
                //             offset: 1,
                //             color: '#f1f6f9',
                //         }],
                //         global: false,
                //     },
                // },
                itemStyle: {
                    color: '#ED538A',
                    opacity: 1,
                },
                // lineStyle: {
                //     width: 2,
                //     color: '#ED538A',
                //     shadowColor: '#ED538A',
                //     shadowBlur: 8,
                // },
                data: purchaseOrders,
            },
            // 发货数量
            {
                name: legendData[2],
                type: 'line',
                stack: 'Total',
                smooth: true,
                // areaStyle: {
                //     color: {
                //         type: 'linear',
                //         x: 0,
                //         y: 0,
                //         x2: 0,
                //         y2: 1,
                //         colorStops: [{
                //             offset: 0,
                //             color: 'rgba(0, 132, 255, 0.05)',

                //         }, {
                //             offset: 1,
                //             color: '#f1f6f9',
                //         }],
                //         global: false,
                //     },
                // },
                itemStyle: {
                    color: '#74A2FF',
                    opacity: 1,
                },
                // lineStyle: {
                //     width: 2,
                //     color: '#74A2FF',
                //     shadowColor: '#74A2FF',
                //     shadowBlur: 8,
                // },
                data: shipmentOrders,
            },
            // 退单数量
            {
                name: legendData[3],
                type: 'line',
                stack: 'Total',
                smooth: true,
                // areaStyle: {
                //     color: {
                //         type: 'linear',
                //         x: 0,
                //         y: 0,
                //         x2: 0,
                //         y2: 1,
                //         colorStops: [{
                //             offset: 0,
                //             color: 'rgba(0, 132, 255, 0.05)',

                //         }, {
                //             offset: 1,
                //             color: '#f1f6f9',
                //         }],
                //         global: false,
                //     },
                // },
                itemStyle: {
                    color: '#64E0B5',
                    opacity: 1,
                },
                // lineStyle: {
                //     width: 2,
                //     color: '#64E0B5',
                //     shadowColor: '#64E0B5',
                //     shadowBlur: 8,
                // },
                data: returnOrders,
            },
        ]
    };
};
