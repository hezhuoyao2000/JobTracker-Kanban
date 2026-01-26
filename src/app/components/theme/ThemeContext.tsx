'use client';
import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

type Theme = 'light' | 'dark';

// 主题样式配置
const themeStyles = {
  light: {
    background: 'bg-gradient-to-b from-[#fff2e2] to-[#e9e5dd]',
    text: 'text-gray-900',
  },
  dark: {
    background: 'bg-gradient-to-b from-[#1a1612] to-[#2d2418]',
    text: 'text-gray-100',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  backgroundClass: string;
  textClass: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const backgroundClass = useMemo(() => themeStyles[theme].background, [theme]);
  const textClass = useMemo(() => themeStyles[theme].text, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, backgroundClass, textClass }}>
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
