'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Globe, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const pathname = usePathname();
  
  // 使用state来避免hydration不匹配
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<'zh' | 'en'>('zh');
  const [switching, setSwitching] = useState(false);

  // 在客户端挂载后设置语言状态
  useEffect(() => {
    setMounted(true);
    const locale = pathname.startsWith('/en') ? 'en' : 'zh';
    setCurrentLocale(locale);
  }, [pathname]);
  
  const switchLanguage = (locale: 'zh' | 'en') => {
    // 如果已经是当前语言，不需要切换
    if (locale === currentLocale) return;
    
    setSwitching(true);
    
    let newPath = pathname;
    
    // 先移除现有的语言前缀
    if (newPath.startsWith('/en')) {
      newPath = newPath.replace('/en', '') || '/';
    }
    
    // 根据 next-intl 的 as-needed 模式添加语言前缀
    if (locale === 'en') {
      newPath = `/en${newPath}`;
    }
    // 中文不需要前缀（默认语言）
    
    // 使用 window.location.href 强制刷新页面，确保重新加载翻译内容
    window.location.href = newPath;
  };

  // 在组件挂载前显示默认状态，避免hydration不匹配
  if (!mounted) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        
        <div className="flex rounded-md border border-gray-200 dark:border-gray-700">
          <button
            className="rounded-r-none px-2 py-1 text-xs font-medium transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            中文
          </button>
          
          <button
            className="rounded-l-none border-l border-gray-200 px-2 py-1 text-xs font-medium transition-colors dark:border-gray-700 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            EN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {switching ? (
        <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
      ) : (
        <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      )}
      
      <div className="flex rounded-md border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => switchLanguage('zh')}
          disabled={switching}
          className={cn(
            "rounded-r-none px-2 py-1 text-xs font-medium transition-colors",
            switching && "opacity-50 cursor-not-allowed",
            currentLocale === 'zh'
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          )}
        >
          中文
        </button>
        
        <button
          onClick={() => switchLanguage('en')}
          disabled={switching}
          className={cn(
            "rounded-l-none border-l border-gray-200 px-2 py-1 text-xs font-medium transition-colors dark:border-gray-700",
            switching && "opacity-50 cursor-not-allowed",
            currentLocale === 'en'
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          )}
        >
          EN
        </button>
      </div>
    </div>
  );
} 