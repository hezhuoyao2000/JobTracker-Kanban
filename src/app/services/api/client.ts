/**
 * API 客户端配置
 * 基于 axios 的 HTTP 客户端，包含认证拦截器和错误处理
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

// API 基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Token 存储键名
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * 统一 API 响应格式
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 获取存储的 Token
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * 设置 Token
 */
export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * 清除 Token
 */
export function clearToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

/**
 * 获取 Refresh Token
 */
export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
}

/**
 * 设置 Refresh Token
 */
export function setRefreshToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证头
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 刷新 Token 的函数
const refreshAuthLogic = async (failedRequest: AxiosError) => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearToken();
    // 留在当前页面，不自动跳转，允许用户离线使用
    return Promise.reject(failedRequest);
  }

  try {
    const response = await axios.post<ApiResponse<{ token: string; refreshToken: string }>>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken }
    );

    if (response.data.code === 200) {
      const { token, refreshToken: newRefreshToken } = response.data.data;
      setToken(token);
      setRefreshToken(newRefreshToken);

      if (failedRequest.response?.config.headers) {
        failedRequest.response.config.headers.Authorization = `Bearer ${token}`;
      }

      return Promise.resolve();
    }
  } catch (error) {
    clearToken();
    // 留在当前页面，不自动跳转，允许用户离线使用
    return Promise.reject(error);
  }
};

// 配置自动刷新拦截器
createAuthRefreshInterceptor(apiClient, refreshAuthLogic, {
  statusCodes: [401, 403],
  pauseInstanceWhileRefreshing: true,
});

// 响应拦截器 - 统一错误处理
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const { data } = response;
    
    // 业务错误处理
    if (data.code !== 200) {
      const error = new Error(data.message || '请求失败');
      (error as Error & { code: number; response: AxiosResponse }).code = data.code;
      (error as Error & { code: number; response: AxiosResponse }).response = response;
      return Promise.reject(error);
    }
    
    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // 根据状态码处理错误
      switch (status) {
        case 401:
          // 未认证，清除 token 但不跳转，允许用户离线使用
          clearToken();
          console.log('认证已过期，已切换到离线模式');
          break;
        case 403:
          console.error('权限不足');
          break;
        case 404:
          console.error('资源不存在:', data?.message);
          break;
        case 500:
          console.error('服务器错误:', data?.message);
          break;
        default:
          console.error(`请求错误 ${status}:`, data?.message || error.message);
      }
      
      return Promise.reject({
        code: status,
        message: data?.message || error.message,
        data: data?.data,
      });
    }
    
    // 网络错误
    if (error.request) {
      console.error('网络错误，请检查网络连接');
      return Promise.reject({
        code: 0,
        message: '网络错误，请检查网络连接',
        data: null,
      });
    }
    
    return Promise.reject({
      code: -1,
      message: error.message,
      data: null,
    });
  }
);

/**
 * 通用 API 请求方法
 */
export async function apiCall<T>(
  endpoint: string,
  data?: unknown,
  config?: Omit<InternalAxiosRequestConfig, 'url' | 'data'>
): Promise<T> {
  const response = await apiClient.post<ApiResponse<T>>(endpoint, data, config);
  return response.data.data;
}

/**
 * 无需认证的 API 请求（用于登录/注册）
 */
export async function publicApiCall<T>(
  endpoint: string,
  data?: unknown,
  config?: Omit<InternalAxiosRequestConfig, 'url' | 'data'>
): Promise<T> {
  const response = await axios.post<ApiResponse<T>>(`${API_BASE_URL}${endpoint}`, data, {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
  });
  
  if (response.data.code !== 200) {
    throw new Error(response.data.message || '请求失败');
  }
  
  return response.data.data;
}

export default apiClient;
