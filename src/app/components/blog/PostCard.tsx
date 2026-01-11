'use client';

import { Box } from '@/components/ui';
import type { Post } from '@/src/app/services/types';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
}

/**
 * 文章卡片组件（客户端组件）
 * 用于显示单篇文章的预览信息
 */
export function PostCard({ post }: PostCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Link href={`/posts/${post.slug}`}>
      <Box className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer">
        <Box className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {post.title}
          </h3>
          {post.summary && (
            <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
              {post.summary}
            </p>
          )}
          <Box className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
            {post.author && (
              <span className="text-gray-500 dark:text-gray-500">
                {post.author}
              </span>
            )}
            <span className="text-gray-500 dark:text-gray-500">
              {formatDate(post.createdAt)}
            </span>
            <span className="text-gray-500 dark:text-gray-500">
              {post.viewCount} 次浏览
            </span>
          </Box>
        </Box>
      </Box>
    </Link>
  );
}
