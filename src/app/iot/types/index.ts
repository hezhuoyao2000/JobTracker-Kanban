/**
 * 设备读数数据类型
 * 来自后端 SSE 流推送的原始数据结构
 */
export interface DeviceReading {
  deviceId: string;
  temperature: number;
  rpm: number;
  timestamp: string;
  rawTemperature: number;
  rawRpm: number;
}

/**
 * 最新数据展示类型
 * 扩展 DeviceReading，添加前端接收时间戳
 */
export interface LatestData extends DeviceReading {
  receivedAt: number;
}

/**
 * SSE 连接状态枚举
 * - connecting: 正在建立连接
 * - connected: 连接成功
 * - disconnected: 连接断开
 */
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';