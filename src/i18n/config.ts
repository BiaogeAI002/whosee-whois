export const locales = ['zh', 'en'] as const;
export const defaultLocale = 'zh' as const;

export type Locale = typeof locales[number];

// Locale 映射配置 - 前端 locale 到 CMS locale 的映射
export const localeMapping = {
  // 前端使用简洁的 locale，CMS 使用完整的 locale
  'zh': 'zh-CN',  // 中文：前端用 zh，CMS 用 zh-CN
  'en': 'en',     // 英文：保持一致
} as const;

// 反向映射 - CMS locale 到前端 locale
export const reverseLocaleMapping = {
  'zh-CN': 'zh',
  'en': 'en',
} as const;

/**
 * 将前端 locale 转换为 CMS locale
 * @param frontendLocale 前端使用的 locale (zh, en)
 * @returns CMS 使用的 locale (zh-CN, en)
 */
export function toCMSLocale(frontendLocale: string): string {
  return localeMapping[frontendLocale as keyof typeof localeMapping] || frontendLocale;
}

/**
 * 将 CMS locale 转换为前端 locale
 * @param cmsLocale CMS 使用的 locale (zh-CN, en)
 * @returns 前端使用的 locale (zh, en)
 */
export function toFrontendLocale(cmsLocale: string): string {
  return reverseLocaleMapping[cmsLocale as keyof typeof reverseLocaleMapping] || cmsLocale;
}

/**
 * 检查是否为有效的前端 locale
 */
export function isValidFrontendLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * 检查是否为有效的 CMS locale
 */
export function isValidCMSLocale(locale: string): boolean {
  return Object.values(localeMapping).includes(locale as any);
} 