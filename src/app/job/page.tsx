'use client';

import { useState } from 'react';
import { KanbanBox } from '../components/kanban/KanbanBox';
import { FormEditWindow } from '../components/kanban/FormEditWindow';
import { PreviewWindow } from '../components/kanban/PreviewWindow';
import { AuthModal } from '../components/kanban/auth/AuthModal';
import { ModeIndicator } from '../components/kanban/ModeIndicator';
import { useBoardContext } from '../components/kanban/context/BoardContext';
import { useTheme } from '../components/theme/ThemeContext';
import { ThemeSwitch } from '../components/theme/ThemeSwitch';
import { Divider } from '@/components/ui/divider';
import { AddNewButton } from '../components/kanban/AddNewButton';
import { AuthProvider, useAuth } from '../components/kanban/auth/AuthContext';
import { UserMenu } from '../components/kanban/auth/UserMenu';
import Link from 'next/link';
import { House } from 'lucide-react';


/**
 * JobPage 内容组件
 * 使用 AuthProvider 提供的上下文
 */
function JobPageContent() {
  const { backgroundClass, text, themeClass, font } = useTheme();
  const { formInstanceId } = useBoardContext();
  const { loginSuccess } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className={`h-screen overflow-hidden ${backgroundClass} flex flex-col`}>
      <div className="flex-1 flex flex-col min-h-0 w-full max-w-screen-2xl mx-auto px-6 py-6 gap-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center shrink-0">
          
          <div className="flex items-center gap-5 h-full">
            <Link
              href="/"
              aria-label="Back to home"
              className={`inline-flex items-end justify-center rounded-full ${text.secondary} hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
            >
              <House className="w-9 h-9" />
            </Link>
            <Divider
              orientation="vertical"
              className={`self-stretch border ${themeClass.divider}`}
            />
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
