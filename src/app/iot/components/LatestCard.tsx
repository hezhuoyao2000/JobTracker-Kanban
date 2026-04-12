'use client';

/**
 * 最新数据卡片组件
 * 
 * 功能：
 * - 显示设备 ID
 * - 显示最新温度读数（红色高亮）
 * - 显示最新转速读数（绿色高亮）
 * - 显示数据接收时间
 */

import { LatestData } from '../types';

/** 组件 Props */
interface LatestCardProps {
  /** 最新设备数据 */
  data: LatestData | null;
}

/**
 * 最新数据卡片
 * 
 * 使用网格布局显示三个数据项：
 * 1. 设备 ID
 * 2. 温度 (°C) - 红色
 * 3. 转速 (RPM) - 绿色
 */
export function LatestCard({ data }: LatestCardProps) {
  /** 格式化时间显示 */
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 设备 ID 卡片 */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">设备 ID</p>
        <p className="text-xl font-semibold text-gray-800">{data?.deviceId || '-'}</p>
      </div>

      {/* 温度卡片 - 红色高亮 */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">温度</p>
        <p className="text-3xl font-bold text-red-600">
          {data?.temperature !== undefined ? `${data.temperature.toFixed(1)} °C` : '-'}
        </p>
      </div>

      {/* 转速卡片 - 绿色高亮 */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">转速</p>
        <p className="text-3xl font-bold text-green-600">
          {data?.rpm !== undefined ? `${data.rpm} RPM` : '-'}
        </p>
      </div>

      {/* 最后更新时间 */}
      {data && (
        <div className="md:col-span-3 text-center text-sm text-gray-400">
          最后更新: {formatTime(data.receivedAt)}
        </div>
      )}
    </div>
  );
}