import { Box } from '@/components/ui';
import { PostList } from './components/blog/PostList';
import { ProfileSidebar } from './components/common/ProfileSidebar';

/**
 * 主页组件（服务端组件）
 * 获取文章列表并渲染左右两栏布局
 */
export default async function Home() {
 


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
              <PostList posts={[]} />
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
