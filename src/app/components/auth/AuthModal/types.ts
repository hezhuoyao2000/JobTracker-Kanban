import type { UserInfo } from '../AuthContext';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: UserInfo) => void;
}

export type AuthMode = 'login' | 'register';

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  email: string;
}

export interface ValidationErrors {
  [key: string]: string;
}
