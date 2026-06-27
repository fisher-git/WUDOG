import React, { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface BarChartProps {
  title?: string;
  xData: string[];
  series: Array<{ name: string; data: number[] }>;
  height?: number;
  horizontal?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ title, xData, series, height = 350, horizontal = false }) => {
  const option: EChartsOption = useMemo(
    () => ({
      title: {
        text: title,
        left: 'center',
        textStyle: { fontSize: 16, color: '#1B3A5C' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        bottom: 0,
        data: series.map((s) => s.name),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: title ? 50 : 20,
        containLabel: true,
      },
      xAxis: horizontal
        ? { type: 'value' as const }
        : {
            type: 'category' as const,
            data: xData,
            axisLabel: { rotate: 30 },
          },
      yAxis: horizontal
        ? { type: 'category' as const, data: xData }
        : { type: 'value' as const },
      series: series.map((s) => ({
        name: s.name,
        type: 'bar' as const,
        data: s.data,
        barMaxWidth: 40,
      })),
    }),
    [title, xData, series, horizontal],
  );

  return <ReactEChartsCore option={option} style={{ height }} notMerge />;
};

export default BarChart;
