'use client';

import { useState } from 'react';
import { KanbanBox } from '../components/kanban/KanbanBox';
import { FormEditWindow } from '../components/kanban/FormEditWindow';
import { PreviewWindow } from '../components/kanban/PreviewWindow';
import { AuthModal } from '../components/auth/AuthModal';
import { useBoardContext } from '../components/kanban/context/BoardContext';
import { useTheme } from '../components/theme/ThemeContext';
import { ThemeSwitch } from '../components/theme/ThemeSwitch';
import { Divider } from '@/components/ui/divider';
import { AddNewButton } from '../components/kanban/AddNewButton';
import { AuthProvider, useAuth } from '../components/auth/AuthContext';
import { UserMenu } from '../components/auth/UserMenu';

/**
 * 数据模式指示器组件
 */
function ModeIndicator() {
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

/**
 * JobPage 内容组件
 * 使用 AuthProvider 提供的上下文
 */
function JobPageContent() {
  const { backgroundClass, text, themeClass, font } = useTheme();
  const { formInstanceId, mode } = useBoardContext();
  const { loginSuccess } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className={`h-screen overflow-hidden ${backgroundClass} flex flex-col`}>
      <div className="flex-1 flex flex-col min-h-0 w-full max-w-screen-2xl mx-auto px-6 py-6 gap-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <h2 className={`${font.heading} ${text.primary} text-3xl font-bold`}>
              Job tracker
            </h2>
            <ModeIndicator />
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <AddNewButton />
            <ThemeSwitch />
            <UserMenu onLoginClick={() => setIsAuthOpen(true)} />
          </div>
        </div>

        <Divider
          orientation="horizontal"
          className={`shrink-0 border ${themeClass.divider}`}
        />

        {/* 主内容区 */}
        <KanbanBox />
        <FormEditWindow key={formInstanceId} />
        <PreviewWindow />

        {/* 登录弹窗 */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={loginSuccess}
        />
      </div>
    </div>
  );
}

/**
 * JobPage 主组件
 * 包裹 AuthProvider 提供认证上下文
 */
export default function JobPage() {
  return (
    <AuthProvider>
      <JobPageContent />
    </AuthProvider>
  );
}
