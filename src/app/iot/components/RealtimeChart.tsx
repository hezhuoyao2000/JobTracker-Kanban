'use client';

/**
 * 实时趋势图表组件
 * 
 * 功能：
 * - 使用 ECharts 绘制双 Y 轴图表（温度 + 转速）
 * - 通过定时批量刷新机制优化性能
 * - 支持窗口大小变化自适应
 */

import { useEffect, useRef, useCallback } from 'react';
import * as echarts from 'echarts';

/** 数据展示时间窗口 (毫秒) = 5分钟 */
const TIME_WINDOW = 5 * 60 * 1000;
/** 缓冲区刷新间隔 (毫秒) */
const FLUSH_INTERVAL = 200;

/** 图表数据点 */
interface DataPoint {
  time: number;  // 时间戳
  temp: number; // 温度
  rpm: number;  // 转速
}

/** 组件 Props */
interface RealtimeChartProps {
  /** 数据缓冲区引用 */
  bufferRef: React.MutableRefObject<DataPoint[]>;
}

/**
 * 实时趋势图表组件
 * 
 * 使用双 Y 轴显示：
 * - 左侧 Y 轴：温度 (°C)，蓝色
 * - 右侧 Y 轴：转速 (RPM)，绿色
 */
export function RealtimeChart({ bufferRef }: RealtimeChartProps) {
  // Chart DOM 容器引用
  const chartRef = useRef<HTMLDivElement>(null);
  // ECharts 实例引用
  const chartInstance = useRef<echarts.ECharts | null>(null);
  // 刷新定时器引用
  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // 温度数据序列
  const tempSeriesRef = useRef<Array<[number, number]>>([]);
  // 转速数据序列
  const rpmSeriesRef = useRef<Array<[number, number]>>([]);

  /**
   * 刷新缓冲区数据到图表
   * 
   * 优化策略：
   * - 定时批量刷新，避免频繁重绘
   * - 根据时间窗口自动清理旧数据（保留最近 5 分钟）
   */
  const flushBuffer = useCallback(() => {
    const chart = chartInstance.current;
    if (!chart) return;

    const buffer = bufferRef.current;
    if (buffer.length === 0) return;

    // 清空缓冲区
    bufferRef.current = [];

    // 将数据点添加到序列
    for (const point of buffer) {
      tempSeriesRef.current.push([point.time, point.temp]);
      rpmSeriesRef.current.push([point.time, point.rpm]);
    }

    // 获取最新数据的时间作为 X 轴右边界
    const latestTime = tempSeriesRef.current.length > 0 
      ? tempSeriesRef.current[tempSeriesRef.current.length - 1][0] 
      : Date.now();
    // X 轴左边界为最新时间向前 5 分钟
    const minTime = latestTime - TIME_WINDOW;
    
    // 过滤掉超出时间窗口的数据点
    tempSeriesRef.current = tempSeriesRef.current.filter(([time]) => time >= minTime);
    rpmSeriesRef.current = rpmSeriesRef.current.filter(([time]) => time >= minTime);

    let savedLegend: { selected?: Record<string, boolean> } | undefined;
    try {
      const opts = chart.getOption();
      savedLegend = Array.isArray(opts?.legend) ? opts.legend[0] : undefined;
    } catch {
      // 忽略类型错误
    }

    // 更新图表数据，固定 X 轴窗口避免线图被持续压缩
    chart.setOption({
      legend: savedLegend?.selected ? { selected: savedLegend.selected } : undefined,
      xAxis: {
        min: minTime,
        max: latestTime,
      },
      series: [
        { name: 'Temperature', data: tempSeriesRef.current },
        { name: 'RPM', data: rpmSeriesRef.current },
      ],
    }, { lazyUpdate: true });
  }, [bufferRef]);

  /**
   * 初始化 ECharts 实例
   * 
   * 配置：
   * - 关闭动画以提升性能
   * - 双 Y 轴分别显示温度和转速
   * - 响应窗口调整和容器尺寸变化
   */
  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化 ECharts，使用 Canvas 渲染器
    chartInstance.current = echarts.init(chartRef.current, undefined, {
      renderer: 'canvas',
    });

    // 图表配置
    const initialMaxTime = Date.now();
    const option: echarts.EChartsOption = {
      animation: false,  // 关闭动画提升性���
      tooltip: {
        trigger: 'axis',
        confine: true,
      },
      legend: {
        data: ['Temperature', 'RPM'],
        top: 10,
      },
      grid: {
        left: 60,
        right: 60,
        top: 50,
        bottom: 40,
      },
      xAxis: {
        type: 'time',
        min: initialMaxTime - TIME_WINDOW,
        max: initialMaxTime,
        axisLabel: {
          formatter: '{HH}:{mm}:{ss}',
        },
      },
      // 双 Y 轴配置
      yAxis: [
        {
          type: 'value',
          name: '°C',
          position: 'left',
          axisLine: { show: true, lineStyle: { color: '#5470c6' } },
          axisLabel: { formatter: '{value} °C' },
        },
        {
          type: 'value',
          name: 'RPM',
          position: 'right',
          axisLine: { show: true, lineStyle: { color: '#91cc75' } },
          axisLabel: { formatter: '{value}' },
        },
      ],
      series: [
        {
          name: 'Temperature',
          type: 'line',
          showSymbol: false,
          yAxisIndex: 0,
          data: [],
          lineStyle: { width: 2 },
        },
        {
          name: 'RPM',
          type: 'line',
          showSymbol: false,
          yAxisIndex: 1,
          data: [],
          lineStyle: { width: 2 },
        },
      ],
    };

    chartInstance.current.setOption(option);

    // 窗口大小变化时调整图表尺寸
    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);

    // 容器尺寸变化时调整图表尺寸
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartRef.current);

    // 启动定时刷新
    flushTimerRef.current = setInterval(flushBuffer, FLUSH_INTERVAL);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (flushTimerRef.current) {
        clearInterval(flushTimerRef.current);
        flushTimerRef.current = null;
      }
    };
  }, [flushBuffer]);

  /**
   * 组件卸载时释放 ECharts 实例
   */
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  return (
    <div ref={chartRef} className="w-full h-[400px]" />
  );
}
