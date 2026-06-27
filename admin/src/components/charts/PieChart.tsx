import React, { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface PieChartProps {
  title?: string;
  data: Array<{ name: string; value: number }>;
  height?: number;
  radius?: string | string[];
  roseType?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
  title,
  data,
  height = 350,
  radius = '70%',
  roseType = false,
}) => {
  const option: EChartsOption = useMemo(
    () => ({
      title: {
        text: title,
        left: 'center',
        textStyle: { fontSize: 16, color: '#1B3A5C' },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        bottom: 0,
        type: 'scroll',
      },
      series: [
        {
          type: 'pie',
          radius,
          roseType: roseType ? 'radius' : undefined,
          center: ['50%', '50%'],
          data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            formatter: '{b}: {d}%',
          },
        },
      ],
    }),
    [title, data, radius, roseType],
  );

  return <ReactEChartsCore option={option} style={{ height }} notMerge />;
};

export default PieChart;
