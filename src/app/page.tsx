import { Box } from '@/components/ui';
import { PostList } from './components/blog/PostList';
import { ProfileSidebar } from './components/common/ProfileSidebar';
import { getPosts } from './services/api/posts';
import type { Post } from './services/types';

/**
 * 主页组件（服务端组件）
 * 获取文章列表并渲染左右两栏布局
 */
export default async function Home() {
  // 服务端获取文章列表，如果后端不可用则使用空数组
  let posts: Post[] = [];
  
  try {
    const postsResult = await getPosts(1, 10);
    posts = postsResult.data.filter((post) => post.isPublished);
  } catch {
    // 后端不可用时，使用空数组，页面仍可正常显示
    // 前端可以独立运行，不依赖后端连接
    posts = [];
  }

  return (
    <Box className="min-h-screen bg-white dark:bg-black">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Box className="flex flex-col lg:flex-row items-start gap-6">
          {/* 左栏：文章列表（宽） */}
          <Box className="flex-1 w-full lg:w-auto">
            <Box className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                最新文章
              </h1>
              <PostList posts={posts} />
            </Box>
          </Box>

          {/* 右栏：个人信息栏（窄） */}
          <Box className="w-full lg:w-80 flex-shrink-0">
            <ProfileSidebar />
          </Box>
        </Box>
      </main>
    </Box>
  );
}
