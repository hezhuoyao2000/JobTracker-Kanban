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
  BoardInfo,
} from '../types/backendtypes/auth';

// 本地存储的 key
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_ID: 'userId',
  USERNAME: 'username',
  DISPLAY_NAME: 'displayName',
  CURRENT_BOARD_ID: 'currentBoardId',
  CURRENT_BOARD_NAME: 'currentBoardName',
} as const;

/**
 * 保存用户信息到本地存储
 */
function saveUserInfo(response: LoginResponseDto | RegisterResponseDto): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
  localStorage.setItem(STORAGE_KEYS.USER_ID, response.userId);
  localStorage.setItem(STORAGE_KEYS.USERNAME, response.username);
  localStorage.setItem(STORAGE_KEYS.DISPLAY_NAME, response.displayName);

  // 保存当前看板信息（后端注册/登录时自动创建）
  if (response.currentBoard?.hasBoard) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_BOARD_ID, response.currentBoard.boardId);
    localStorage.setItem(STORAGE_KEYS.CURRENT_BOARD_NAME, response.currentBoard.boardName);
  }
}

/**
 * 获取当前登录用户信息
 */
export function getCurrentUser(): {
  userId: string | null;
  username: string | null;
  displayName: string | null;
} {
  if (typeof window === 'undefined') {
    return { userId: null, username: null, displayName: null };
  }
  return {
    userId: localStorage.getItem(STORAGE_KEYS.USER_ID),
    username: localStorage.getItem(STORAGE_KEYS.USERNAME),
    displayName: localStorage.getItem(STORAGE_KEYS.DISPLAY_NAME),
  };
}

/**
 * 获取当前看板信息
 */
export function getCurrentBoard(): BoardInfo | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const boardId = localStorage.getItem(STORAGE_KEYS.CURRENT_BOARD_ID);
  const boardName = localStorage.getItem(STORAGE_KEYS.CURRENT_BOARD_NAME);

  if (!boardId) {
    return null;
  }

  return {
    boardId,
    boardName: boardName || 'My Job Tracker',
    hasBoard: true,
  };
}

/**
 * 用户登录
 * @param username - 用户名
 * @param password - 密码
 * @returns 登录响应，包含 token 和用户信息
 */
export async function login(
  username: string,
  password: string
): Promise<LoginResponseDto> {
  const response = await publicApiCall<LoginResponseDto>('/auth/login', {
    username,
    password,
  } as LoginRequestDto);

  // 保存 token 和用户信息
  setToken(response.token);
  saveUserInfo(response);

  return response;
}

/**
 * 用户注册
 * @param username - 用户名（必填）
 * @param password - 密码（必填，至少6位）
 * @param displayName - 显示名称（可选）
 * @param email - 邮箱（可选）
 * @returns 注册响应，包含 token 和用户信息
 */
export async function register(
  username: string,
  password: string,
  displayName?: string,
  email?: string
): Promise<RegisterResponseDto> {
  const request: RegisterRequestDto = {
    username,
    password,
  };

  if (displayName) {
    request.displayName = displayName;
  }

  if (email) {
    request.email = email;
  }

  const response = await publicApiCall<RegisterResponseDto>(
    '/auth/register',
    request
  );

  // 保存 token 和用户信息
  setToken(response.token);
  saveUserInfo(response);

  return response;
}

/**
 * 用户登出
 * 清除本地存储的 token、用户信息和看板信息
 * 登出后留在当前页面，允许用户离线本地使用
 */
export function logout(): void {
  clearToken();
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.USERNAME);
    localStorage.removeItem(STORAGE_KEYS.DISPLAY_NAME);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_BOARD_ID);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_BOARD_NAME);
    // 留在当前页面，不自动跳转，允许用户离线使用
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
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
}
