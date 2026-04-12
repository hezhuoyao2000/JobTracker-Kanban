'use client';

/**
 * IoT 设备监控仪表盘主页面
 * 
 * 功能：
 * - 通过 SSE (Server-Sent Events) 实时接收设备数据
 * - 显示最新温度和转速数据
 * - 使用 ECharts 绘制实时趋势图表
 */

import { useRef, useCallback } from 'react';
import { useDeviceStream, DataPoint } from './hooks/useDeviceStream';
import { ConnectionStatus } from './components/ConnectionStatus';
import { LatestCard } from './components/LatestCard';
import { RealtimeChart } from './components/RealtimeChart';

/**
 * IoT 仪表盘页面组件
 * 
 * 使用 ref 存储实时数据点，通过 useDeviceStream hook 建立 SSE 连接，
 * 将接收到的数据传递给 RealtimeChart 进行可视化展示
 */
export default function IotDashboardPage() {
  /**
   * 数据缓冲区，使用 ref 避免不必要的重渲染
   * 数据点会被定时批量刷新到图表中
   */
  const bufferRef = useRef<DataPoint[]>([]);

  /**
   * SSE 数据回调处理器
   * 每次收到新数据点时，将其推入缓冲区
   */
  const handleData = useCallback((point: DataPoint) => {
    bufferRef.current.push(point);
  }, []);

  /**
   * 设备流 hook
   * 管理 SSE 连接状态和最新数据
   */
  const { latestData, connectionStatus } = useDeviceStream({
    onData: handleData,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题与连接状态指示器 */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">IoT 设备监控仪表盘</h1>
          <ConnectionStatus status={connectionStatus} />
        </div>

        {/* 最新数据卡片：显示设备ID、温度、转速 */}
        <LatestCard data={latestData} />

        {/* 实时趋势图表区域 */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <RealtimeChart bufferRef={bufferRef} />
        </div>
      </div>
    </div>
  );
}