/**
 * Axios 客户端配置
 * 包含 baseURL 配置、请求/响应拦截器和错误处理
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { BackendErrorResponse } from '../types';

/**
 * 获取 API base URL
 * 在服务端需要完整 URL，客户端可以使用相对路径
 */
function getBaseURL(): string {
  // 如果设置了 NEXT_PUBLIC_API_BASE_URL，客户端和服务端都使用它
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  // 服务端需要完整 URL
  if (typeof window === 'undefined') {
    // 服务端：优先使用 API_BASE_URL（服务端专用环境变量）
    if (process.env.API_BASE_URL) {
      return process.env.API_BASE_URL;
    }
    // 如果没有设置环境变量，使用默认开发环境 URL
    // 生产环境应该通过环境变量配置
    return 'http://localhost:5000/api/v1';
  }

  // 客户端：可以使用相对路径
  return '/api/v1';
}

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 预留：如果需要添加 token，可以在这里处理
    // 注意：服务端组件中无法使用 localStorage，需要在客户端组件中处理
    // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器（错误处理）
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<BackendErrorResponse>) => {
    // 提取错误信息
    let errorMessage = '发生未知错误，请稍后重试';

    if (error.response) {
      // 服务器返回了错误响应
      const errorData = error.response.data;
      // 后端可能返回 Message 或 message
      errorMessage =
        errorData?.Message || errorData?.message || errorMessage;
    } else if (error.request) {
      // 请求已发出但没有收到响应
      errorMessage = '网络错误，请检查网络连接';
    }

    // 注意：不在拦截器中使用 toast，因为：
    // 1. 服务端组件无法使用客户端库（react-toastify）
    // 2. 错误处理应该在调用方（客户端组件）中进行
    // 如果需要显示错误提示，请在客户端组件中捕获错误后使用 toast

    // 重新抛出错误，包含 message 字段，供调用方进一步处理
    return Promise.reject({
      message: errorMessage,
      originalError: error,
    });
  }
);

export default apiClient;
