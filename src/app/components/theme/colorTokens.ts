/**
 * 主题颜色与字体颜色 Token
 * 唯一数据源，所有 UI 色彩由此派生。
 *
 * ## 以后怎么扩展
 * 1. 字体色：在 textTokens 里加新键（如 error、success），给出 light / dark 的 hex。
 * 2. 主题色：在 themeTokens 里加新键（如 cardBg、overlay），同上。
 * 3. ThemeContext 的 text / themeClass 若用了新键，需在 ThemeContext 里追加对应 class
 *    （如 text.error、themeClass.cardBg），否则组件直接用 style={{ color: getTextColor('error', theme) }} 或
 *    className="text-[var(--color-text-error)]" 即可（变量由 buildThemeVarsCss 自动生成）。
 * 4. 改已有色值：只改本文件里的 hex，无需动别处。
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
  // 扩展示例：error, success, warning, inverse ...
} as const satisfies Record<string, ThemedColor>;

/** 主题色 Token（背景、边框、分割线等） */
export const themeTokens = {
  /** 背景渐变起/止（当前与背景一致） */
  background: { light: '#f2efe7', dark: '#2b2822' },
  backgroundEnd: { light: '#f2efe7', dark: '#2b2822' },

  /** 分割线、边框 */
  divider: { light: '#e1d9c8', dark: '#3d3528' },
  /** 边框（与 divider 可共用，预留细分） */
  border: { light: '#e1d9c8', dark: '#3d3528' },
  /** 强调色（按钮、高亮等） */
  accent: { light: '#8b7355', dark: '#b89968' },

  /** 卡片背景 **/
  cardBg: { light: '#ffffff', dark: '#3d3528' },
  cardBorder: { light: '#dbd3c2', dark: '#dbd3c2' },

  /** 标签容器背景（地点、链接等标签块）；夜间略亮于卡片，保持暖棕调 */
  tagBg: { light: '#f5f2eb', dark: '#4a4238' },
  // 扩展：overlay, ...
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
