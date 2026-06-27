import React, { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface LineChartProps {
  title?: string;
  xData: string[];
  series: Array<{ name: string; data: number[] }>;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ title, xData, series, height = 350 }) => {
  const option: EChartsOption = useMemo(
    () => ({
      title: {
        text: title,
        left: 'center',
        textStyle: { fontSize: 16, color: '#1B3A5C' },
      },
      tooltip: {
        trigger: 'axis',
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
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel: { rotate: 45 },
      },
      yAxis: {
        type: 'value',
      },
      series: series.map((s) => ({
        name: s.name,
        type: 'line' as const,
        data: s.data,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
      })),
    }),
    [title, xData, series],
  );

  return <ReactEChartsCore option={option} style={{ height }} notMerge />;
};

export default LineChart;
