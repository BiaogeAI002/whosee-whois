'use client';

import { Languages } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function LanguageToggle() {
  const t = useTranslations('common');
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (locale: string) => {
    document.cookie = `locale=${locale}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={t('language')}
      >
        <Languages className="h-[1.2rem] w-[1.2rem]" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 shadow-md">
          <button
            onClick={() => changeLanguage('en')}
            className="flex w-full items-center px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm"
          >
            🇺🇸 English
          </button>
          <button
            onClick={() => changeLanguage('zh')}
            className="flex w-full items-center px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm"
          >
            🇨🇳 中文
          </button>
        </div>
      )}
    </div>
  );
} 