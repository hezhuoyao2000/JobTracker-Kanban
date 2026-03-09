'use client';

import React from 'react';
import { User, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import type { RegisterFormData, ValidationErrors } from './types';

interface RegisterFormProps {
  formData: RegisterFormData;
  validationErrors: ValidationErrors;
  showPassword: boolean;
  showConfirmPassword: boolean;
  isLoading: boolean;
  onFormChange: (form: RegisterFormData) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function RegisterForm({
  formData,
  validationErrors,
  showPassword,
  showConfirmPassword,
  isLoading,
  onFormChange,
  onTogglePassword,
  onToggleConfirmPassword,
  onSubmit,
}: RegisterFormProps) {
  const { text, themeClass } = useTheme();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* 用户名 */}
      <div className="space-y-2">
        <label
          htmlFor="register-username"
          className={`block text-sm font-medium ${text.secondary}`}
        >
          用户名 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User
            size={18}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${text.muted}`}
          />
          <input
            id="register-username"
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
          htmlFor="register-password"
          className={`block text-sm font-medium ${text.secondary}`}
        >
          密码 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock
            size={18}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${text.muted}`}
          />
          <input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) =>
              onFormChange({ ...formData, password: e.target.value })
            }
            placeholder="至少6位密码"
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

      {/* 确认密码 */}
      <div className="space-y-2">
        <label
          htmlFor="register-confirm-password"
          className={`block text-sm font-medium ${text.secondary}`}
        >
          确认密码 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock
            size={18}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${text.muted}`}
          />
          <input
            id="register-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) =>
              onFormChange({ ...formData, confirmPassword: e.target.value })
            }
            placeholder="再次输入密码"
            className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
              validationErrors.confirmPassword
                ? 'border-red-500'
                : themeClass.border
            } ${themeClass.tagBg} ${text.primary} ${themeClass.inputPlaceholder} ${themeClass.accentFocusRing} transition-all`}
          />
          <button
            type="button"
            onClick={onToggleConfirmPassword}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${text.muted} hover:opacity-80 transition-all`}
            aria-label={showConfirmPassword ? '隐藏密码' : '显示密码'}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {validationErrors.confirmPassword && (
          <p className="text-xs text-red-500">{validationErrors.confirmPassword}</p>
        )}
      </div>

      {/* 显示名称 */}
      <div className="space-y-2">
        <label
          htmlFor="displayName"
          className={`block text-sm font-medium ${text.secondary}`}
        >
          显示名称
        </label>
        <input
          id="displayName"
          type="text"
          value={formData.displayName}
          onChange={(e) =>
            onFormChange({ ...formData, displayName: e.target.value })
          }
          placeholder="请输入显示名称（可选）"
          className={`w-full px-4 py-3 rounded-xl border ${themeClass.border} ${themeClass.tagBg} ${text.primary} ${themeClass.inputPlaceholder} ${themeClass.accentFocusRing} transition-all`}
        />
      </div>

      {/* 邮箱 */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className={`block text-sm font-medium ${text.secondary}`}
        >
          邮箱
        </label>
        <div className="relative">
          <Mail
            size={18}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${text.muted}`}
          />
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              onFormChange({ ...formData, email: e.target.value })
            }
            placeholder="请输入邮箱（可选）"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
              validationErrors.email
                ? 'border-red-500'
                : themeClass.border
            } ${themeClass.tagBg} ${text.primary} ${themeClass.inputPlaceholder} ${themeClass.accentFocusRing} transition-all`}
          />
        </div>
        {validationErrors.email && (
          <p className="text-xs text-red-500">{validationErrors.email}</p>
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
            注册中...
          </>
        ) : (
          '注册'
        )}
      </button>
    </form>
  );
}
