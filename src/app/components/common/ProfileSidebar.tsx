import { Box } from '@/components/ui';

/**
 * 个人信息栏组件（服务端组件）
 * 显示用户基本信息
 */
export function ProfileSidebar() {
  return (
    <Box className="w-full">
      <Box className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900">
        <Box className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            关于我
          </h2>
          <Box className="flex flex-col gap-2">
            <p className="text-gray-600 dark:text-gray-400">
              欢迎来到我的博客！
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              这里分享技术心得、生活感悟和有趣的故事。
            </p>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
