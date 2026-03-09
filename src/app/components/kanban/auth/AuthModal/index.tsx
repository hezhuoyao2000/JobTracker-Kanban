'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../../theme/ThemeContext';
import { useAuthModal } from './useAuthModal';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import type { AuthModalProps, AuthMode } from './types';

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const { text, font, themeClass } = useTheme();
  const {
    mode,
    isLoading,
    error,
    showPassword,
    showConfirmPassword,
    loginForm,
    registerForm,
    validationErrors,
    setShowPassword,
    setShowConfirmPassword,
    setLoginForm,
    setRegisterForm,
    handleModeSwitch,
    handleLogin,
    handleRegister,
    handleClose,
  } = useAuthModal({ onClose, onLoginSuccess });

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 ${themeClass.overlayBackdrop}`}
    >
      <div
        className={`w-full max-w-md overflow-hidden flex flex-col rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 ${themeClass.cardBg} border ${themeClass.cardBorder}`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b ${themeClass.divider} flex items-center justify-between ${themeClass.tagBg}`}
        >
          <h2 className={`text-xl ${font.heading} font-bold ${text.primary}`}>
            {mode === 'login' ? '欢迎回来' : '创建账户'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className={`p-1 ${text.muted} hover:opacity-80 rounded-full transition-all`}
            aria-label="关闭"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* 错误提示 */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <LoginForm
              formData={loginForm}
              validationErrors={validationErrors}
              showPassword={showPassword}
              isLoading={isLoading}
              onFormChange={setLoginForm}
              onTogglePassword={() => setShowPassword(!showPassword)}
              onSubmit={handleLogin}
            />
          ) : (
            <RegisterForm
              formData={registerForm}
              validationErrors={validationErrors}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              isLoading={isLoading}
              onFormChange={setRegisterForm}
              onTogglePassword={() => setShowPassword(!showPassword)}
              onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
              onSubmit={handleRegister}
            />
          )}

          {/* 切换模式 */}
          <div className={`text-center text-sm ${text.secondary}`}>
            {mode === 'login' ? (
              <>
                还没有账户？{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('register' as AuthMode)}
                  className={`${text.link} hover:opacity-80 font-medium transition-colors`}
                >
                  立即注册
                </button>
              </>
            ) : (
              <>
                已有账户？{' '}
                <button
                  type="button"
                  onClick={() => handleModeSwitch('login' as AuthMode)}
                  className={`${text.link} hover:opacity-80 font-medium transition-colors`}
                >
                  立即登录
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
