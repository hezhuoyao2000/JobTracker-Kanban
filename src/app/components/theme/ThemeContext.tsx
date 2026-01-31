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

/** 页面级样式（背景渐变、默认正文色） */
const tokenBasedStyles = {
  background:
    'bg-gradient-to-b from-[var(--color-theme-background)] to-[var(--color-theme-backgroundEnd)]',
  textPrimary: 'text-[var(--color-text-primary)]',
};

/**
 * ThemeContext 提供的样式分类：
 * - text: 文字颜色（primary/secondary/muted/link/placeholder/button）
 * - themeClass: 背景、边框、阴影、focus 等（背景用 bg-，边框用 border-）
 * - font: 字体族（heading/body/mono）
 */
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  backgroundClass: string;
  textClass: string;
  /** 文字颜色 class */
  text: {
    primary: string;
    secondary: string;
    muted: string;
    link: string;
    placeholder: string;
    /** 按钮/强调色背景上的文字 */
    button: string;
  };
  /** 主题色 class（背景、边框、分割线、focus 等） */
  themeClass: {
    divider: string;
    border: string;
    borderBg: string;
    cardBg: string;
    cardBorder: string;
    tagBg: string;
    buttonBg: string;
    /** 强调色背景（选中态等） */
    accentBg: string;
    /** 强调色边框、文字（checkbox 勾选等） */
    accentBorder: string;
    accentText: string;
    /** 输入框 focus 环（与 focus:outline-none 配合） */
    accentFocusRing: string;
    /** 输入框 placeholder 颜色 */
    inputPlaceholder: string;
    /** 弹窗遮罩背景（color-mix 半透明） */
    overlayBackdrop: string;
    cardShadow: string;
  };
  /** 字体样式 class（heading / body / mono） */
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
        button: 'text-[var(--color-text-button)]',
      },
      themeClass: {
        divider: 'border-[var(--color-theme-divider)]',
        border: 'border-[var(--color-theme-border)]',
        borderBg: 'bg-[var(--color-theme-border)]',
        cardBg: 'bg-[var(--color-theme-cardBg)]',
        cardBorder: 'border-[var(--color-theme-cardBorder)]',
        tagBg: 'bg-[var(--color-theme-tagBg)]',
        buttonBg: 'bg-[var(--color-theme-buttonBg)]',
        accentBg: 'bg-[var(--color-theme-accent)]',
        accentBorder: 'border-[var(--color-theme-accent)]',
        accentText: 'text-[var(--color-theme-accent)]',
        accentFocusRing: 'focus:outline-none focus:ring-2 focus:ring-[var(--color-theme-accent)]',
        inputPlaceholder: 'placeholder:text-[var(--color-text-placeholder)]',
        overlayBackdrop: 'bg-[color-mix(in_srgb,var(--color-theme-background)_60%,transparent)]',
        cardShadow: 'shadow-card-hover',
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
