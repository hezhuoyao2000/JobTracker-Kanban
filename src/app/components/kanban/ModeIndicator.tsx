'use client';

import { useBoardContext } from './context/BoardContext';

/**
 * 数据模式指示器组件
 */
export function ModeIndicator() {
  const { mode } = useBoardContext();

  if (mode === 'online') {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        云端模式
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
      <span className="w-2 h-2 rounded-full bg-amber-500" />
      本地模式
    </div>
  );
}
