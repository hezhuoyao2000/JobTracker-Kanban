/**
 * 认证相关 DTO 类型定义
 * 对应后端认证接口的请求和响应
 */

/**
 * 登录请求 DTO
 */
export interface LoginRequestDto {
  userId: string;
}

/**
 * 登录响应 DTO
 */
export interface LoginResponseDto {
  userId: string;
  token: string;
  tokenType: string;
}

/**
 * 注册请求 DTO
 */
export interface RegisterRequestDto {
  username: string;
  displayName?: string;
  email?: string;
}

/**
 * 注册响应 DTO
 */
export interface RegisterResponseDto {
  userId: string;
  username: string;
  token: string;
  tokenType: string;
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
