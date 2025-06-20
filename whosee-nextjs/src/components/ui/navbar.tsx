'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { LanguageToggle } from './language-toggle';
import { cn } from '@/lib/utils';
import { Globe, Server, Camera, Activity } from 'lucide-react';

export function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const navItems = [
    {
      href: '/domain',
      label: t('domain'),
      icon: Globe,
    },
    {
      href: '/dns',
      label: t('dns'),
      icon: Server,
    },
    {
      href: '/screenshot',
      label: t('screenshot'),
      icon: Camera,
    },
    {
      href: '/health',
      label: t('health'),
      icon: Activity,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/40 dark:border-gray-800/40 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-gray-900/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Globe className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl">Whosee</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </div>
    </nav>
  );
} 