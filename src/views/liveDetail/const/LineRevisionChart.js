export default function (datas) {
    const { days, shops, orders, purchaseOrders } = datas;
    const legendData = ['店铺数量', '销售订单', '采购订单'];
    return {
        tooltip: {
            trigger: 'axis'
        },
        animationEasing: 'quadraticIn',
        animationDuration: 3000,
        animationEasingUpdate: 'quadraticIn',
        legend: {
            icon: 'circle',
            align: 'auto',
            data: legendData,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                color: '#fff',
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '0',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: days,
            minInterval: 1,
            axisLabel: {
                color: '#fff'
            },
            axisTick: { // X轴线 刻度线 
                show: false,
            },
            splitLine: {  
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: 'rgba(255,255,255,0.2)'
                }
            },
            axisLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            minInterval: 1,
            axisLabel: {
                color: '#fff'
            },
            splitLine:{  
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: 'rgba(255,255,255,0.2)'
                }  
            }
        },
        series: [
            // 店铺数量
            {
                name: legendData[0],
                type: 'line',
                smooth: true,
                itemStyle: {
                    color: '#0facd5',
                    opacity: 1,
                },
                data: shops,
            },
            // 销售订单
            {
                name: legendData[1],
                type: 'line',
                smooth: true,
                itemStyle: {
                    color: 'rgb(70, 180, 109)',
                    opacity: 1,
                },
                data: orders,
            },
            // 采购订单
            {
                name: legendData[2],
                type: 'line',
                smooth: true,
                itemStyle: {
                    color: 'red',
                    opacity: 1,
                },
                data: purchaseOrders,
            },
        ]
    };
};
