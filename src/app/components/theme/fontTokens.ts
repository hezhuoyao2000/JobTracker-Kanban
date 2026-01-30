/**
 * 字体 Token：统一管理字体加载、CSS 变量与 Tailwind 用法
 *
 * ## 功能
 * 1. 用 next/font 加载字体，并绑定到 CSS 变量（--font-heading / --font-body / --font-mono）
 * 2. 提供 fontVars、fontClass 供组件按语义使用字体
 * 3. 导出 fontVariableClassNames，供 RootLayout 挂在 <body> 上，使全局可用
 *
 * ## 使用方式
 * - **Layout**：从本文件导入 fontVariableClassNames，给 <body className={fontVariableClassNames}> 即可。
 * - **组件**：className="font-heading" | "font-body" | "font-mono"，或 className={fontClass.heading} 等。
 * - **换字体**：只改下方 fonts 里的 next/font 配置（换字体名、variable 名等），其余不用动。
 * - **新增角色**：加一套 fontVars/fontClass 键、fonts 配置、tailwind theme.extend.fontFamily，再把新 font.variable 并入 fontVariableClassNames。
 */

import {
  IBM_Plex_Sans,
  Lora,
  Playfair_Display,
} from 'next/font/google';

/**
 * next/font 要求：字体加载器必须在模块顶层调用并赋给 const，不能写在对象字面量里。
 * 先为每个角色单独声明 const，再组成 fonts 供下游使用。
 */
const fontHeading = Playfair_Display({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});
const fontBody = Lora({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});
const fontMono = IBM_Plex_Sans({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

/** 各字体角色的 next/font 实例；variable 与 CSS 变量一一对应 */
const fonts = {
  heading: fontHeading,
  body: fontBody,
  mono: fontMono,
} as const;

/**
 * 所有字体 CSS 变量对应类名的组合，供 RootLayout 挂在 <body> 上。
 * 使用：<body className={`${fontVariableClassNames} antialiased`}>
 */
export const fontVariableClassNames = [
  fonts.heading.variable,
  fonts.body.variable,
  fonts.mono.variable,
].join(' ');

/** CSS 变量名，与 tailwind theme.extend.fontFamily 中的 var(--font-*) 一致 */
export const fontVars = {
  heading: '--font-heading',
  body: '--font-body',
  mono: '--font-mono',
} as const;

/** 对应 Tailwind font-* 类名，与 theme.extend.fontFamily 一致；组件内用 font-heading / font-body / font-mono */
export const fontClass = {
  heading: 'font-heading',
  body: 'font-body',
  mono: 'font-mono',
} as const;
