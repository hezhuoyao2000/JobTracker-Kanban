/**
 * 后端原始 JSON 类型定义
 * 后端返回的字段名为 PascalCase（对应 C# 属性命名）
 */

/**
 * 后端返回的文章对象（原始格式）
 */
export interface BackendPost {
  Id: number;
  Title: string;
  Slug: string;
  Summary?: string | null;
  Content: string;
  CoverImage?: string | null;
  IsPublished: boolean;
  Author?: string | null;
  ViewCount: number;
  CategoryId?: number | null;
  CreatedAt: string; // ISO 时间字符串
  UpdatedAt: string; // ISO 时间字符串
  DeletedAt?: string | null; // ISO 时间字符串，null 表示未删除
}

/**
 * 后端分页响应格式
 */
export interface BackendListResponse<T> {
  Data: T[];
  Total: number;
  Page: number;
  PageSize: number;
  TotalPages: number;
}

/**
 * 后端错误响应格式
 * 注意：根据后端实际返回格式，可能是 Message 或 message
 */
export interface BackendErrorResponse {
  Message?: string;
  message?: string;
}
