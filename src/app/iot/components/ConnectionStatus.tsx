'use client';

/**
 * 连接状态指示器组件
 * 
 * 功能：
 * - 显示 SSE 连接状态（连接中/已连接/断开）
 * - 带颜色的状态点 + 文字标签
 */

import { ConnectionStatus as ConnectionStatusType } from '../types';

/** 组件 Props */
interface ConnectionStatusProps {
  /** 连接状态 */
  status: ConnectionStatusType;
}

/**
 * 连接状态指示器
 * 
 * 状态颜色：
 * - connecting: 黄色 + 闪烁动画
 * - connected: 绿色
 * - disconnected: 红色
 */
export function ConnectionStatus({ status }: ConnectionStatusProps) {
  /** 状态配置映射 */
  const statusConfig = {
    connecting: { label: '连接中...', color: 'bg-yellow-500 animate-pulse' },
    connected: { label: '已连接', color: 'bg-green-500' },
    disconnected: { label: '断开', color: 'bg-red-500' },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      {/* 状态指示点 */}
      <span className={`w-3 h-3 rounded-full ${config.color}`} />
      {/* 状态标签 */}
      <span className="text-sm text-gray-600">{config.label}</span>
    </div>
  );
}