/**
 * 认证相关 DTO 类型定义
 * 对应后端认证接口的请求和响应
 */

/**
 * 看板信息（登录/注册响应中包含）
 */
export interface BoardInfo {
  boardId: string;
  boardName: string;
  hasBoard: boolean;
}

/**
 * 登录请求 DTO
 * 变更：2026-03-08 改为 username + password
 */
export interface LoginRequestDto {
  username: string;
  password: string;
}

/**
 * 登录响应 DTO
 * 变更：2026-03-08 增加 username 和 displayName 字段
 * 变更：2026-03-09 增加 currentBoard 字段
 */
export interface LoginResponseDto {
  userId: string;
  username: string;
  displayName: string;
  token: string;
  tokenType: string;
  currentBoard: BoardInfo;
}

/**
 * 注册请求 DTO
 * 变更：2026-03-08 password 变为必填字段
 */
export interface RegisterRequestDto {
  username: string;
  password: string;
  displayName?: string;
  email?: string;
}

/**
 * 注册响应 DTO
 * 变更：2026-03-08 增加 displayName 字段
 * 变更：2026-03-09 增加 currentBoard 字段
 */
export interface RegisterResponseDto {
  userId: string;
  username: string;
  displayName: string;
  token: string;
  tokenType: string;
  currentBoard: BoardInfo;
}

/**
 * Token 刷新请求 DTO
 */
export interface RefreshTokenRequestDto {
  refreshToken: string;
}

/**
 * Token 刷新响应 DTO
 */
export interface RefreshTokenResponseDto {
  token: string;
  refreshToken: string;
  tokenType: string;
}
