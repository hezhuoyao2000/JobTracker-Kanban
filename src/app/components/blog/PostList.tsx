import { Box } from '@/components/ui';
import { PostCard } from './PostCard';
import type { Post } from '@/src/app/services/types';

interface PostListProps {
  posts: Post[];
}

/**
 * 文章列表组件（服务端组件）
 * 用于显示文章列表
 */
export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <Box className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col gap-4 w-full">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Box>
  );
}
