/**
 * 前端应用类型定义
 * 前端使用的字段名为 camelCase
 */

/**
 * 前端使用的文章类型（日期字段为 Date 对象）
 */
export interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  coverImage: string | null;
  isPublished: boolean;
  author: string | null;
  viewCount: number;
  categoryId: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

/**
 * 前端分页结果类型
 */
export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

