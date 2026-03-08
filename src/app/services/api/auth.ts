/**
 * 认证相关 API 服务
 * 包含登录、注册、Token 刷新等功能
 */

import { publicApiCall, setToken, clearToken } from './client';
import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from '../types/backendtypes/auth';

/**
 * 用户登录
 * @param userId - 用户 ID
 * @returns 登录响应，包含 token 和用户信息
 */
export async function login(userId: string): Promise<LoginResponseDto> {
  const response = await publicApiCall<LoginResponseDto>('/auth/login', {
    userId,
  } as LoginRequestDto);
  
  // 保存 token
  setToken(response.token);
  
  return response;
}

/**
 * 用户注册
 * @param username - 用户名（必填）
 * @param displayName - 显示名称（可选）
 * @param email - 邮箱（可选）
 * @returns 注册响应，包含 token 和用户信息
 */
export async function register(
  username: string,
  displayName?: string,
  email?: string
): Promise<RegisterResponseDto> {
  const request: RegisterRequestDto = {
    username,
  };
  
  if (displayName) {
    request.displayName = displayName;
  }
  
  if (email) {
    request.email = email;
  }
  
  const response = await publicApiCall<RegisterResponseDto>('/auth/register', request);
  
  // 保存 token
  setToken(response.token);
  
  return response;
}

/**
 * 用户登出
 * 清除本地存储的 token
 */
export function logout(): void {
  clearToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

/**
 * 检查用户是否已登录
 * @returns 是否已登录
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return !!localStorage.getItem('token');
}
