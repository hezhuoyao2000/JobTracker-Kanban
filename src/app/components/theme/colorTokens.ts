/**
 * 主题颜色 Token（唯一数据源）
 *
 * 所有 UI 色彩由此派生，buildThemeVarsCss 会生成 --color-text-* 与 --color-theme-* CSS 变量。
 * ThemeProvider 将变量注入到 :root / [data-theme="light"] / [data-theme="dark"]，
 * 切换主题时通过 data-theme 切换生效的变量组。
 *
 * ## 扩展流程
 * 1. 在 textTokens（文字色）或 themeTokens（背景/边框等）中加新键，给出 light/dark hex
 * 2. 在 ThemeContext 的 text 或 themeClass 中补全对应 class（便于组件统一引用）
 * 3. 组件通过 useTheme() 使用 themeClass.xxx / text.xxx
 */

export type ThemeMode = 'light' | 'dark';

/** 按主题区分的色值 */
export type ThemedColor = { light: string; dark: string };

/** 字体颜色 Token */
export const textTokens = {
  /** 主正文色，默认 #4a3b2f */
  primary: { light: '#4a3b2f', dark: '#e8e2da' },
  /** 次要正文、副标题 */
  secondary: { light: '#6b5b4f', dark: '#c4bcb0' },
  /** 弱化、说明、占位符 */
  muted: { light: '#8a7d72', dark: '#9a8f84' },
  /** 链接色 */
  link: { light: '#2d6a9f', dark: '#6ba3d0' },
  /** 占位符（可后续与 muted 合并或细分） */
  placeholder: { light: '#a39b8f', dark: '#7a7268' },
  /** 按钮/强调色背景上的文字色（需保证与 accent 对比度） */
  button: { light: '#e8e2da', dark: '#1a1512' },
} as const satisfies Record<string, ThemedColor>;

/** 主题色 Token（背景、边框、分割线等） */
export const themeTokens = {
  /** 页面背景渐变起/止 */
  background: { light: '#f2efe7', dark: '#2b2822' },
  backgroundEnd: { light: '#f2efe7', dark: '#2b2822' },

  /** 分割线、边框 */
  divider: { light: '#e1d9c8', dark: '#3d3528' },
  border: { light: '#e1d9c8', dark: '#3d3528' },

  /** 强调色（选中态、focus ring、checkbox 等） */
  accent: { light: '#8b7355', dark: '#b89968' },

  /** 卡片背景 */
  cardBg: { light: '#ffffff', dark: '#3d3528' },
  /** 卡片/标签边框 */
  cardBorder: { light: '#dbd3c2', dark: '#dbd3c2' },

  /** 标签/输入框等浅背景块（与 buttonBg 区分：tag 更柔和） */
  tagBg: { light: '#f5f2eb', dark: '#4a4238' },
  /** 主按钮背景 */
  buttonBg: { light: '#8b7355', dark: '#b89968' },
} as const satisfies Record<string, ThemedColor>;

/**
 * 取当前主题下的字体色
 * @param key textTokens 的键
 * @param mode 'light' | 'dark'
 */
export function getTextColor(key: keyof typeof textTokens, mode: ThemeMode): string {
  return textTokens[key][mode];
}

/**
 * 取当前主题下的主题色
 * @param key themeTokens 的键
 * @param mode 'light' | 'dark'
 */
export function getThemeColor(key: keyof typeof themeTokens, mode: ThemeMode): string {
  return themeTokens[key][mode];
}

const prefixText = '--color-text-';
const prefixTheme = '--color-theme-';

/** 生成指定主题的 CSS 变量规则块（供 ThemeContext 注入用） */
export function buildThemeVarsCss(mode: ThemeMode): string {
  const lines: string[] = [];
  for (const k of Object.keys(textTokens) as (keyof typeof textTokens)[]) {
    lines.push(`${prefixText}${k}: ${textTokens[k][mode]};`);
  }
  for (const k of Object.keys(themeTokens) as (keyof typeof themeTokens)[]) {
    lines.push(`${prefixTheme}${k}: ${themeTokens[k][mode]};`);
  }
  const selector = mode === 'light' ? ':root, [data-theme="light"]' : '[data-theme="dark"]';
  return `${selector} { ${lines.join(' ')} }`;
}
