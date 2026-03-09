'use client';

import { useState, useCallback } from 'react';
import { login, register } from '../../../../services/api/auth';
import type { UserInfo } from '../AuthContext';
import type {
  AuthMode,
  LoginFormData,
  RegisterFormData,
  ValidationErrors,
  AuthModalProps,
} from './types';

export function useAuthModal({ onClose, onLoginSuccess }: Omit<AuthModalProps, 'isOpen'>) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginForm, setLoginForm] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    username: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    email: '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const resetForms = useCallback(() => {
    setLoginForm({ username: '', password: '' });
    setRegisterForm({
      username: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      email: '',
    });
    setValidationErrors({});
    setError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, []);

  const handleModeSwitch = useCallback(
    (newMode: AuthMode) => {
      setMode(newMode);
      resetForms();
    },
    [resetForms]
  );

  const validateLoginForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    if (!loginForm.username.trim()) {
      errors.username = '用户名不能为空';
    }

    if (!loginForm.password) {
      errors.password = '密码不能为空';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [loginForm]);

  const validateRegisterForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    if (!registerForm.username.trim()) {
      errors.username = '用户名不能为空';
    } else if (registerForm.username.length < 3) {
      errors.username = '用户名至少3个字符';
    }

    if (!registerForm.password) {
      errors.password = '密码不能为空';
    } else if (registerForm.password.length < 6) {
      errors.password = '密码至少6位';
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致';
    }

    if (registerForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      errors.email = '邮箱格式不正确';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [registerForm]);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!validateLoginForm()) {
        return;
      }

      setIsLoading(true);

      try {
        const response = await login(loginForm.username, loginForm.password);
        const userInfo: UserInfo = {
          userId: response.userId,
          username: response.username,
          displayName: response.displayName,
        };
        onLoginSuccess?.(userInfo);
        onClose();
        resetForms();
      } catch (err) {
        setError(err instanceof Error ? err.message : '登录失败，请重试');
      } finally {
        setIsLoading(false);
      }
    },
    [loginForm, validateLoginForm, onLoginSuccess, onClose, resetForms]
  );

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!validateRegisterForm()) {
        return;
      }

      setIsLoading(true);

      try {
        const response = await register(
          registerForm.username,
          registerForm.password,
          registerForm.displayName || undefined,
          registerForm.email || undefined
        );
        const userInfo: UserInfo = {
          userId: response.userId,
          username: response.username,
          displayName: response.displayName,
        };
        onLoginSuccess?.(userInfo);
        onClose();
        resetForms();
      } catch (err) {
        setError(err instanceof Error ? err.message : '注册失败，请重试');
      } finally {
        setIsLoading(false);
      }
    },
    [registerForm, validateRegisterForm, onLoginSuccess, onClose, resetForms]
  );

  const handleClose = useCallback(() => {
    onClose();
    resetForms();
  }, [onClose, resetForms]);

  return {
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
  };
}
