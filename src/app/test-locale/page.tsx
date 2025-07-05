'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function TestLocalePage() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">语言测试页面</h1>
        
        <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <strong>当前语言 (useLocale):</strong> {locale}
          </div>
          
          <div>
            <strong>当前路径:</strong> {pathname}
          </div>
          
          <div>
            <strong>翻译测试:</strong> {t('language')}
          </div>
          
          <div>
            <strong>搜索文本:</strong> {t('search')}
          </div>
          
          <div>
            <strong>加载文本:</strong> {t('loading')}
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="font-semibold mb-2">测试说明:</h2>
          <ul className="text-sm space-y-1">
            <li>• 点击导航栏的语言切换按钮</li>
            <li>• 检查URL是否正确变化 (中文: /test-locale, 英文: /en/test-locale)</li>
            <li>• 验证页面内容是否正确翻译</li>
            <li>• 确认没有hydration错误</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 