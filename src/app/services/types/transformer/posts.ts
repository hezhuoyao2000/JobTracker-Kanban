/**
 * 文章相关的类型转换工具
 * 负责后端类型（PascalCase）和前端类型（camelCase）之间的转换
 */

import type {
  BackendPost,
  BackendListResponse,
  Post,
  PagedResult,
} from '../index';
import type {
  CreatePostPayload,
  UpdatePostPayload,
} from '../../api/posts';

/**
 * 将后端文章对象转换为前端文章对象
 * 负责字段名转换（PascalCase -> camelCase）和数据类型转换
 */
export function mapBackendPost(raw: BackendPost): Post {
  return {
    id: raw.Id,
    title: raw.Title,
    slug: raw.Slug,
    summary: raw.Summary ?? null,
    content: raw.Content,
    coverImage: raw.CoverImage ?? null,
    isPublished: !!raw.IsPublished,
    author: raw.Author ?? null,
    viewCount: Number(raw.ViewCount ?? 0),
    categoryId: raw.CategoryId ?? null,
    createdAt: new Date(raw.CreatedAt),
    updatedAt: new Date(raw.UpdatedAt),
    deletedAt: raw.DeletedAt ? new Date(raw.DeletedAt) : null,
  };
}

/**
 * 将后端分页响应转换为前端分页结果
 * 通用函数，可应用于任何类型的分页数据
 */
export function mapBackendList<TRaw, T>(
  raw: BackendListResponse<TRaw>,
  mapper: (r: TRaw) => T
): PagedResult<T> {
  return {
    data: raw.Data.map(mapper),
    total: raw.Total,
    page: raw.Page,
    pageSize: raw.PageSize,
    totalPages: raw.TotalPages,
  };
}

/**
 * 将前端 camelCase 请求体转换为后端 PascalCase 格式
 * 用于创建和更新文章的请求
 */
export function mapToBackendPayload(
  payload: CreatePostPayload | UpdatePostPayload
): Record<string, unknown> {
  const backendPayload: Record<string, unknown> = {
    Title: payload.title,
    Slug: payload.slug,
    Content: payload.content,
    Summary: payload.summary ?? null,
    CoverImage: payload.coverImage ?? null,
    Author: payload.author ?? null,
    CategoryId: payload.categoryId ?? null,
    IsPublished: payload.isPublished ?? false,
  };

  // UpdatePostPayload 包含 id 字段，需要包含在请求体中
  if ('id' in payload && payload.id !== undefined) {
    backendPayload.Id = payload.id;
  }

  return backendPayload;
}
