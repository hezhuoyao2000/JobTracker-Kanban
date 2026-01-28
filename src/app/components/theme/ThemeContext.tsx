'use client';
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  ReactNode,
} from 'react';
import { buildThemeVarsCss } from './colorTokens';
import { fontClass } from './fontTokens';

type Theme = 'light' | 'dark';

/** 基于 colorTokens 的 CSS 变量，背景/字体随 data-theme 切换 */
const tokenBasedStyles = {
  background:
    'bg-gradient-to-b from-[var(--color-theme-background)] to-[var(--color-theme-backgroundEnd)]',
  /** 主正文色，兼容旧用法 */
  textPrimary: 'text-[var(--color-text-primary)]',
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  /** 背景渐变 class（沿用旧名，已改为 token） */
  backgroundClass: string;
  /** 主正文色 class（沿用旧名，已改为 token） */
  textClass: string;
  /** 语义化字体色 class，便于扩展 */
  text: {
    primary: string;
    secondary: string;
    muted: string;
    link: string;
    placeholder: string;
  };
  /** 主题色 class（边框、分割线等） */
  themeClass: {
    divider: string;
    border: string;
  };
  /** 字体 class（heading / body / mono） */
  font: {
    heading: string;
    body: string;
    mono: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STYLE_ID = 'theme-tokens';

function ensureThemeStyleNode(): HTMLStyleElement {
  let el = typeof document !== 'undefined' ? document.getElementById(STYLE_ID) : null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    el.setAttribute('data-theme-tokens', '');
    document.head.appendChild(el);
  }
  return el as HTMLStyleElement;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const style = ensureThemeStyleNode();
    style.textContent = [buildThemeVarsCss('light'), buildThemeVarsCss('dark')].join('\n');
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo<ThemeContextType>(
    () => ({
      theme,
      toggleTheme,
      backgroundClass: tokenBasedStyles.background,
      textClass: tokenBasedStyles.textPrimary,
      text: {
        primary: 'text-[var(--color-text-primary)]',
        secondary: 'text-[var(--color-text-secondary)]',
        muted: 'text-[var(--color-text-muted)]',
        link: 'text-[var(--color-text-link)]',
        placeholder: 'text-[var(--color-text-placeholder)]',
      },
      themeClass: {
        divider: 'border-[var(--color-theme-divider)]',
        border: 'border-[var(--color-theme-border)]',
      },
      font: {
        heading: fontClass.heading,
        body: fontClass.body,
        mono: fontClass.mono,
      },
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
