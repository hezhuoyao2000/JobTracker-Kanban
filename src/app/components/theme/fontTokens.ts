/**
 * 字体 Token
 * 语义化字体角色，对应 CSS 变量 --font-heading / --font-body / --font-mono。
 * layout 中通过 next/font 将具体字体绑定到这些变量；此处仅定义用法与扩展方式。
 *
 * ## 当前映射（在 layout 中配置）
 * - heading -> Playfair Display（衬线，标题）
 * - body    -> Open Sans（无衬线，正文、UI）
 * - mono    -> Geist Mono（等宽，代码、数字）
 *
 * ## 以后怎么扩展
 * 1. 新角色：在 fontClass 加键（如 display、caption），在 layout 增加对应 next/font 与 variable，
 *    在 globals.css 的 body 或 @theme 中可做 fallback，Tailwind theme.extend.fontFamily 增加对应项。
 * 2. 换字体：只改 layout 里 next/font 的绑定（即哪款字体写到 --font-heading 等），本文件不用动。
 * 3. 组件用法：className={font.heading} 或直接 font-heading / font-body / font-mono。
 */

export const fontVars = {
  heading: '--font-heading',
  body: '--font-body',
  mono: '--font-mono',
} as const;

/** 对应 Tailwind font-* 类名，与 theme.extend.fontFamily 一致 */
export const fontClass = {
  heading: 'font-heading',
  body: 'font-body',
  mono: 'font-mono',
} as const;
