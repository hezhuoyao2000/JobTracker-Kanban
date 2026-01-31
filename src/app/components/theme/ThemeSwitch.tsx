'use client';
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Box } from '@/components/ui/box';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';

/**
 * 主题切换开关组件
 * 用于在深色模式和浅色模式之间切换
 */
export function ThemeSwitch() {
  const { theme, toggleTheme, themeClass } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <Box className={`flex-row items-center h-12 gap-2 px-3 rounded-full backdrop-blur-md shadow-lg border ${themeClass.cardBg} ${themeClass.border}`}>
      <Sun 
        className={`w-5 h-5 transition-all duration-300 ${
          isDarkMode ? 'text-slate-500 rotate-0' : 'text-amber-500 rotate-12'
        }`} 
      />
      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
        trackColor={{ false: '#E2E8F0', true: '#475569' }}
        thumbColor={isDarkMode ? '#1E293B' : '#FFFFFF'}
        className="scale-110"
      />
      <Moon 
        className={`w-5 h-5 transition-all duration-300 ${
          isDarkMode ? 'text-blue-400 rotate-12' : 'text-slate-400 rotate-0'
        }`} 
      />
    </Box>
  );
}