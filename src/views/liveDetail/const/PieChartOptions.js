export default function (seriesData) {
    return {
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(46, 47, 51, .9)',
            borderWidth: 0,
            textStyle: {
                color: 'rgba(255, 255, 255, 1)',
            },
            formatter: function (params) {
                return `${params.marker}<span>${params.name}：</span><span>${params.percent}%</span>`;
            },
        },
        legend: {
            icon: 'circle',
            orient: 'vertical',
            right: '30',
            itemWidth: 15,
            textStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
            },
        },
        series: [
            {
                type: 'pie',
                radius: [55, 100],
                data: seriesData,
            }
        ],
    };
};
