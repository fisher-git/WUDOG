import React, { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface FunnelChartProps {
  title?: string;
  data: Array<{ name: string; value: number }>;
  height?: number;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ title, data, height = 350 }) => {
  const option: EChartsOption = useMemo(
    () => ({
      title: {
        text: title,
        left: 'center',
        textStyle: { fontSize: 16, color: '#1B3A5C' },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}',
      },
      series: [
        {
          type: 'funnel',
          left: '10%',
          top: title ? 50 : 20,
          bottom: 20,
          width: '80%',
          min: 0,
          max: data.length > 0 ? data[0].value : 100,
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside',
            formatter: '{b}',
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid',
            },
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
          },
          emphasis: {
            label: {
              fontSize: 16,
            },
          },
          data,
        },
      ],
    }),
    [title, data],
  );

  return <ReactEChartsCore option={option} style={{ height }} notMerge />;
};

export default FunnelChart;
