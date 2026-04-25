'use client';

/**
 * 设备流数据 Hook
 * 
 * 功能：
 * - 通过 SSE (Server-Sent Events) 建立与后端的持久连接
 * - 实时接收设备推送的温湿度、转速等数据
 * - 管理连接状态和最新数据
 */

import { useEffect, useRef, useState } from 'react';
import { DeviceReading, LatestData, ConnectionStatus } from '../types';
import apiClient from '../../services/api/client';

/** SSE 端点 URL */
const SSE_URL = `${apiClient.defaults.baseURL}/iot/stream`;

/**
 * 图表数据点类型
 * 用于实时趋势图表的绘制
 */
export interface DataPoint {
  time: number;  // 时间戳 (毫秒)
  temp: number; // 温度值
  rpm: number;  // 转速值
}

/**
 * Hook 配置选项
 */
export interface UseDeviceStreamOptions {
  /** 自定义 SSE 端点 URL */
  url?: string;
  /** 数据接收回调函数 */
  onData?: (point: DataPoint) => void;
}

/**
 * Hook 返回值
 */
export interface UseDeviceStreamReturn {
  /** 最新设备数据 */
  latestData: LatestData | null;
  /** SSE 连接状态 */
  connectionStatus: ConnectionStatus;
}

/** 默认的空回调函数 */
const defaultOnData = () => {};

/**
 * 设备流数据 Hook
 * 
 * 使用方式：
 * const { latestData, connectionStatus } = useDeviceStream({
 *   onData: (point) => { ... }
 * });
 * 
 * @param options - 配置选项
 * @returns latestData 和 connectionStatus
 */
export function useDeviceStream(options: UseDeviceStreamOptions = {}): UseDeviceStreamReturn {
  const url = options.url || SSE_URL;
  const onData = options.onData || defaultOnData;

  // 连接状态管理
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  // 最新数据管理
  const [latestData, setLatestData] = useState<LatestData | null>(null);
  // EventSource 实例引用
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // 避免 SSR 环境执行
    if (typeof window === 'undefined') return;

    // 创建 SSE 连接
    const es = new EventSource(url);
    eventSourceRef.current = es;

    // 监听设备数据事件
    es.addEventListener('device-data', (e) => {
      try {
        // 解析 JSON 数据
        const reading: DeviceReading = JSON.parse(e.data);
        // 转换时间戳为毫秒
        const timestamp = reading.timestamp ? new Date(reading.timestamp).getTime() : Date.now();

        // 更新最新数据状态
        setLatestData({
          ...reading,
          receivedAt: timestamp,
        });

        // 触发数据回调
        onData({
          time: timestamp,
          temp: reading.temperature,
          rpm: reading.rpm,
        });
      } catch (err) {
        console.error('Parse SSE data error:', err);
      }
    });

    // 连接打开回调
    es.onopen = () => {
      setConnectionStatus('connected');
    };

    // 连接错误回调
    es.onerror = (err) => {
      console.warn('SSE connection error:', err);
      setConnectionStatus('disconnected');
    };

    // 清理函数：关闭连接
    return () => {
      es.close();
    };
  }, [url, onData]);

  return {
    latestData,
    connectionStatus,
  };
}