'use client';

import React from 'react';
import { User, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import type { LoginFormData, ValidationErrors } from './types';

interface LoginFormProps {
  formData: LoginFormData;
  validationErrors: ValidationErrors;
  showPassword: boolean;
  isLoading: boolean;
  onFormChange: (form: LoginFormData) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({
  formData,
  validationErrors,
  showPassword,
  isLoading,
  onFormChange,
  onTogglePassword,
  onSubmit,
}: LoginFormProps) {
  const { text, themeClass } = useTheme();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* 用户名 */}
      <div className="space-y-2">
        <label
          htmlFor="login-username"
          className={`block text-sm font-medium ${text.secondary}`}
        >
          用户名
        </label>
        <div className="relative">
          <User
            size={18}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${text.muted}`}
          />
          <input
            id="login-username"
            type="text"
            value={formData.username}
            onChange={(e) =>
              onFormChange({ ...formData, username: e.target.value })
            }
            placeholder="请输入用户名"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
              validationErrors.username
                ? 'border-red-500'
                : themeClass.border
            } ${themeClass.tagBg} ${text.primary} ${themeClass.inputPlaceholder} ${themeClass.accentFocusRing} transition-all`}
          />
        </div>
        {validationErrors.username && (
          <p className="text-xs text-red-500">{validationErrors.username}</p>
        )}
      </div>

      {/* 密码 */}
      <div className="space-y-2">
        <label
          htmlFor="login-password"
          className={`block text-sm font-medium ${text.secondary}`}
        >
          密码
        </label>
        <div className="relative">
          <Lock
            size={18}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${text.muted}`}
          />
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) =>
              onFormChange({ ...formData, password: e.target.value })
            }
            placeholder="请输入密码"
            className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
              validationErrors.password
                ? 'border-red-500'
                : themeClass.border
            } ${themeClass.tagBg} ${text.primary} ${themeClass.inputPlaceholder} ${themeClass.accentFocusRing} transition-all`}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${text.muted} hover:opacity-80 transition-all`}
            aria-label={showPassword ? '隐藏密码' : '显示密码'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {validationErrors.password && (
          <p className="text-xs text-red-500">{validationErrors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-xl font-medium ${themeClass.buttonBg} ${text.button} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all`}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            登录中...
          </>
        ) : (
          '登录'
        )}
      </button>
    </form>
  );
}
