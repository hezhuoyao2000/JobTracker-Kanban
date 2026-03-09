'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from './AuthContext';

interface UserMenuProps {
  onLoginClick: () => void;
}

export function UserMenu({ onLoginClick }: UserMenuProps) {
  const { text, font, themeClass } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 使用 useLayoutEffect 确保在客户端渲染前设置状态
  // 这样可以避免 hydration mismatch，同时不会触发级联渲染警告
  useEffect(() => {
    // 使用 requestAnimationFrame 延迟到下一次渲染帧
    const timer = requestAnimationFrame(() => {
      setIsClient(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  // 点击外部关闭菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 在客户端挂载前显示占位符，确保服务端和客户端渲染一致
  if (!isClient) {
    return (
      <button
        type="button"
        className={`p-2 rounded-xl ${themeClass.tagBg} ${text.primary} hover:opacity-80 transition-all flex items-center gap-2`}
        aria-label="加载中"
        disabled
      >
        <User size={20} />
        <span className={`text-sm font-medium hidden sm:inline ${font.body}`}>
          加载中
        </span>
      </button>
    );
  }

  // 处理登出
  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // 未登录状态 - 显示登录按钮
  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={onLoginClick}
        className={`p-2 rounded-xl ${themeClass.tagBg} ${text.primary} hover:opacity-80 transition-all flex items-center gap-2`}
        aria-label="登录/注册"
      >
        <User size={20} />
        <span className={`text-sm font-medium hidden sm:inline ${font.body}`}>
          登录
        </span>
      </button>
    );
  }

  // 已登录状态 - 显示用户信息下拉菜单
  return (
    <div ref={menuRef} className="relative z-50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl ${themeClass.tagBg} ${text.primary} hover:opacity-80 transition-all flex items-center gap-2`}
        aria-label="用户菜单"
        aria-expanded={isOpen}
      >
        <div
          className={`w-7 h-7 rounded-full ${themeClass.buttonBg} ${text.button} flex items-center justify-center text-sm font-bold`}
        >
          {user?.displayName?.charAt(0).toUpperCase() ||
            user?.username?.charAt(0).toUpperCase() ||
            'U'}
        </div>
        <span
          className={`text-sm font-medium hidden sm:inline max-w-[100px] truncate ${font.body}`}
        >
          {user?.displayName || user?.username}
        </span>
        <ChevronDown
          size={16}
          className={`${text.muted} transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg border z-50 ${themeClass.cardBg} ${themeClass.cardBorder} py-2 animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* 用户信息头部 */}
          <div
            className={`px-4 py-3 border-b ${themeClass.divider} mb-2`}
          >
            <p className={`text-sm font-medium ${text.primary} ${font.body}`}>
              {user?.displayName || user?.username}
            </p>
            <p className={`text-xs ${text.muted} truncate`}>@{user?.username}</p>
          </div>

          {/* 菜单项 */}
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full px-4 py-2 text-left flex items-center gap-3 ${text.primary} hover:${themeClass.tagBg} transition-colors`}
          >
            <LogOut size={18} className={text.muted} />
            <span className={`text-sm ${font.body}`}>退出登录</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
