'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { toast } from 'react-toastify';
import {
  getCurrentUser,
  isAuthenticated as checkIsAuthenticated,
  logout as authLogout,
} from '../../services/api/auth';
import { notifyAuthChange } from '../kanban/hooks/useBoard';

/**
 * 用户信息接口
 */
export interface UserInfo {
  userId: string;
  username: string;
  displayName: string;
}

/**
 * 认证上下文类型
 */
interface AuthContextType {
  /** 当前用户信息，未登录时为 null */
  user: UserInfo | null;
  /** 是否已登录 */
  isAuthenticated: boolean;
  /** 是否正在加载（用于初始状态恢复） */
  isLoading: boolean;
  /** 登录成功后调用，更新用户信息 */
  loginSuccess: (userInfo: UserInfo) => void;
  /** 登出 */
  logout: () => void;
  /** 刷新用户信息（从 localStorage 重新读取） */
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 从 localStorage 读取用户信息
 */
function readUserFromStorage(): UserInfo | null {
  if (typeof window === 'undefined') return null;

  const userData = getCurrentUser();
  if (!userData.userId || !userData.username) {
    return null;
  }

  return {
    userId: userData.userId,
    username: userData.username,
    displayName: userData.displayName || userData.username,
  };
}

/**
 * 初始化用户状态
 * 在组件渲染时同步执行，避免在 effect 中 setState
 */
function initializeUserState(): { user: UserInfo | null; isLoading: boolean } {
  if (typeof window === 'undefined') {
    return { user: null, isLoading: false };
  }

  const storedUser = readUserFromStorage();
  if (storedUser && checkIsAuthenticated()) {
    return { user: storedUser, isLoading: false };
  }
  return { user: null, isLoading: false };
}

/**
 * 认证上下文 Provider
 * 管理用户登录状态，提供全局访问
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const initialState = initializeUserState();
  const [user, setUser] = useState<UserInfo | null>(initialState.user);
  const [isLoading] = useState(initialState.isLoading);

  // 监听 storage 事件，处理多标签页同步
  useEffect(() => {
    function handleStorageChange() {
      const storedUser = readUserFromStorage();
      if (storedUser && checkIsAuthenticated()) {
        setUser(storedUser);
      } else {
        setUser(null);
      }
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * 登录成功回调
   * 同时触发认证状态变化事件，通知 BoardProvider 加载后端数据
   */
  const loginSuccess = useCallback((userInfo: UserInfo) => {
    setUser(userInfo);
    // 触发认证状态变化事件
    notifyAuthChange(true);
    // 提示用户已切换到云端模式
    toast.success(`欢迎回来，${userInfo.displayName || userInfo.username}！已切换到云端模式`, {
      position: 'top-right',
      autoClose: 3000,
    });
  }, []);

  /**
   * 登出
   * 同时触发认证状态变化事件，通知看板组件
   */
  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    // 触发认证状态变化事件
    notifyAuthChange(false);
    // 提示用户已切换到本地模式
    toast.info('已退出登录，切换到本地模式。您的数据保存在浏览器本地。', {
      position: 'top-right',
      autoClose: 4000,
    });
  }, []);

  /**
   * 刷新用户信息
   */
  const refreshUser = useCallback(() => {
    const storedUser = readUserFromStorage();
    if (storedUser && checkIsAuthenticated()) {
      setUser(storedUser);
    } else {
      setUser(null);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    loginSuccess,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * 使用认证上下文的 Hook
 * @throws 如果在 AuthProvider 外部使用会抛出错误
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
