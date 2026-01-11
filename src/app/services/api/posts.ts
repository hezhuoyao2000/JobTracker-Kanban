/**
 * 文章相关 API 接口
 */

import apiClient from './client';
import type {
  BackendPost,
  BackendListResponse,
  Post,
  PagedResult,
} from '../types';
import {
  mapBackendPost,
  mapBackendList,
  mapToBackendPayload,
} from '../types/transformer';


/**
 * 获取文章列表（分页、可按关键字搜索）
 * @param page 页码（>=1），默认 1
 * @param pageSize 每页数量（1..100），默认 20
 * @param keyword 搜索关键字（可选）
 * @returns 分页的文章列表
 */
export async function getPosts(
  page = 1,
  pageSize = 20,
  keyword?: string
): Promise<PagedResult<Post>> {
  const params: Record<string, string | number> = { page, pageSize };
  if (keyword) {
    params.keyword = keyword;
  }

  const response = await apiClient.get<BackendListResponse<BackendPost>>(
    '/posts',
    { params }
  );

  return mapBackendList(response.data, mapBackendPost);
}


/**
 * 获取单篇文章（按 slug）
 * @param slug 文章 slug
 * @returns 文章对象
 */
export async function getPostBySlug(slug: string): Promise<Post> {
  const encodedSlug = encodeURIComponent(slug);
  const response = await apiClient.get<BackendPost>(`/posts/${encodedSlug}`);
  return mapBackendPost(response.data);
}


/**
 * 按分类获取文章
 * @param categoryId 分类 ID
 * @param page 页码，默认 1
 * @param pageSize 每页数量，默认 20
 * @returns 分页的文章列表
 */
export async function getPostsByCategory(
  categoryId: number,
  page = 1,
  pageSize = 20
): Promise<PagedResult<Post>> {
  const response = await apiClient.get<BackendListResponse<BackendPost>>(
    `/posts/category/${categoryId}`,
    {
      params: { page, pageSize },
    }
  );

  return mapBackendList(response.data, mapBackendPost);
}


/**
 * 创建文章的请求体类型
 */
export interface CreatePostPayload {
  title: string;
  slug: string;
  content: string;
  summary?: string | null;
  coverImage?: string | null;
  author?: string | null;
  categoryId?: number | null;
  isPublished?: boolean;
}

/**
 * 创建文章
 * @param payload 文章数据（title, slug, content 必填，其他可选）
 * @returns 创建的文章对象
 */
export async function createPost(payload: CreatePostPayload): Promise<Post> {
  // 将前端 camelCase 转换为后端 PascalCase
  const backendPayload = mapToBackendPayload(payload);
  const response = await apiClient.post<BackendPost>('/posts', backendPayload);
  return mapBackendPost(response.data);
}


/**
 * 更新文章的请求体类型
 */
export interface UpdatePostPayload {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary?: string | null;
  coverImage?: string | null;
  author?: string | null;
  categoryId?: number | null;
  isPublished?: boolean;
}

/**
 * 更新文章（全量）
 * @param id 文章 ID
 * @param payload 文章数据（body.id 必须与 URL id 一致）
 * @returns 更新后的文章对象
 */
export async function updatePost(
  id: number,
  payload: UpdatePostPayload
): Promise<Post> {
  // 确保 payload.id 与 URL 中的 id 一致
  const updatePayload = { ...payload, id };
  // 将前端 camelCase 转换为后端 PascalCase
  const backendPayload = mapToBackendPayload(updatePayload);
  const response = await apiClient.put<BackendPost>(
    `/posts/${id}`,
    backendPayload
  );
  return mapBackendPost(response.data);
}


/**
 * 切换发布状态
 * @param id 文章 ID
 * @returns 更新后的文章对象
 */
export async function togglePublish(id: number): Promise<Post> {
  const response = await apiClient.patch<BackendPost>(
    `/posts/${id}/publish`
  );
  return mapBackendPost(response.data);
}


/**
 * 软删除文章
 * @param id 文章 ID
 */
export async function deletePost(id: number): Promise<void> {
  await apiClient.delete(`/posts/${id}`);
}
