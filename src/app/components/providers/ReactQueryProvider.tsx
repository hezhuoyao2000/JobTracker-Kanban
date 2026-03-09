'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // 全局默认配置
        staleTime: 5 * 60 * 1000, // 5分钟内数据视为新鲜
        retry: 1, // 失败时重试1次
        refetchOnWindowFocus: false, // 窗口聚焦时不自动刷新
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
