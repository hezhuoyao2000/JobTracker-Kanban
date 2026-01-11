'use client';

/**
 * Toast 工具函数
 * 用于在客户端组件中显示错误提示
 * 
 * 注意：此文件只能在客户端组件中使用
 */

import { toast } from 'react-toastify';

/**
 * 显示错误提示
 * @param message 错误消息
 */
export function showError(message: string) {
  toast.error(message);
}

/**
 * 显示成功提示
 * @param message 成功消息
 */
export function showSuccess(message: string) {
  toast.success(message);
}

/**
 * 显示信息提示
 * @param message 信息消息
 */
export function showInfo(message: string) {
  toast.info(message);
}

/**
 * 显示警告提示
 * @param message 警告消息
 */
export function showWarning(message: string) {
  toast.warning(message);
}
