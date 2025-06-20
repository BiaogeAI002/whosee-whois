'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { SearchBox } from '@/components/ui/search-box';
import { Camera, Monitor, Smartphone, Tablet, Download, Clock, Info, Globe, Server, Zap, Settings } from 'lucide-react';
import type { ScreenshotInfo } from '@/types';
import { queryScreenshotInfo, ApiError } from '@/lib/api';
import { formatDateTime, formatBytes } from '@/lib/utils';

export default function ScreenshotPage() {
  const t = useTranslations('screenshot');
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [screenshotInfo, setScreenshotInfo] = useState<ScreenshotInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');

  const initialQuery = searchParams?.get('q') || '';

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (domain: string) => {
    setLoading(true);
    setError(null);
    setScreenshotInfo(null);
    
    try {
      const result = await queryScreenshotInfo(domain);
      setScreenshotInfo(result);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to capture screenshots');
      }
      console.error('Screenshot query error:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewOptions = [
    { 
      key: 'desktop' as const, 
      label: t('desktop'), 
      icon: Monitor,
      description: '桌面版视图 (1920×1080)',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
    },
    { 
      key: 'mobile' as const, 
      label: t('mobile'), 
      icon: Smartphone,
      description: '手机版视图 (375×667)',
      color: 'text-green-600 bg-green-50 dark:bg-green-900/20'
    },
    { 
      key: 'tablet' as const, 
      label: t('tablet'), 
      icon: Tablet,
      description: '平板版视图 (768×1024)',
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
    },
  ];

  const screenshotTools = [
    { name: '域名信息', desc: '查看 WHOIS 信息', href: '/domain', icon: Globe },
    { name: 'DNS 查询', desc: '查看 DNS 记录', href: '/dns', icon: Server },
    { name: '性能分析', desc: '网站性能测试', href: '#', icon: Zap },
    { name: '网站监控', desc: '持续监控网站', href: '#', icon: Clock }
  ];

  const deviceSpecs = {
    desktop: {
      resolution: '1920 × 1080',
      userAgent: 'Chrome Desktop',
      viewport: '1920 × 1080',
      devicePixelRatio: '1.0'
    },
    mobile: {
      resolution: '375 × 667',
      userAgent: 'iPhone Safari',
      viewport: '375 × 667',
      devicePixelRatio: '2.0'
    },
    tablet: {
      resolution: '768 × 1024',
      userAgent: 'iPad Safari',
      viewport: '768 × 1024',
      devicePixelRatio: '2.0'
    }
  };

  const currentScreenshot = screenshotInfo?.[selectedView];
  const currentSpec = deviceSpecs[selectedView];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题和搜索 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <Camera className="h-8 w-8 mr-3 text-purple-600" />
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            获取网站在不同设备上的截图，支持桌面、手机和平板三种视图模式
          </p>
          <SearchBox 
            onSearch={handleSearch} 
            loading={loading}
            className="mb-8"
          />
        </div>

        {/* 错误信息 */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* 截图结果显示 */}
        {screenshotInfo && (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* 主要内容 */}
            <div className="lg:col-span-3">
              {/* 设备选择器 */}
              <div className="bg-card rounded-lg border p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  选择设备视图
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {viewOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedView === option.key;
                    const screenshot = screenshotInfo[option.key];
                    
                    return (
                      <button
                        key={option.key}
                        onClick={() => setSelectedView(option.key)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon className={`h-6 w-6 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                          <span className={`font-medium ${isSelected ? 'text-blue-900 dark:text-blue-100' : ''}`}>
                            {option.label}
                          </span>
                          {screenshot && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                              已就绪
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {option.description}
                        </p>
                        {screenshot && (
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            大小: {formatBytes(screenshot.fileSize)}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 截图显示 */}
              {currentScreenshot && (
                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      {viewOptions.find(opt => opt.key === selectedView)?.label} 截图
                    </h3>
                    <button
                      onClick={() => window.open(currentScreenshot.url, '_blank')}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>下载截图</span>
                    </button>
                  </div>

                  {/* 截图预览 */}
                  <div className="relative bg-muted rounded-lg overflow-hidden mb-4">
                    <div className="aspect-video flex items-center justify-center min-h-[400px]">
                      <div className="text-center p-8">
                        <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg font-medium">
                          {screenshotInfo.domain} 截图预览
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {selectedView === 'desktop' && '桌面版视图'}
                          {selectedView === 'mobile' && '手机版视图'}
                          {selectedView === 'tablet' && '平板版视图'}
                        </p>
                        <div className="mt-4 inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                          <Clock className="h-4 w-4 mr-2" />
                          拍摄于 {formatDateTime(currentScreenshot.captureTime)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 截图详细信息 */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        截图信息
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">文件大小</span>
                          <span className="font-mono">{formatBytes(currentScreenshot.fileSize)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">拍摄时间</span>
                          <span className="font-mono">{formatDateTime(currentScreenshot.captureTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">图片格式</span>
                          <span>PNG</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">压缩质量</span>
                          <span>高质量</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3 flex items-center">
                        <Monitor className="h-4 w-4 mr-2" />
                        设备规格
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">分辨率</span>
                          <span className="font-mono">{currentSpec.resolution}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">用户代理</span>
                          <span>{currentSpec.userAgent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">视口大小</span>
                          <span className="font-mono">{currentSpec.viewport}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">像素比</span>
                          <span>{currentSpec.devicePixelRatio}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 其他设备的截图缩略图 */}
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                {viewOptions.map((option) => {
                  const screenshot = screenshotInfo[option.key];
                  if (!screenshot || option.key === selectedView) return null;
                  
                  const Icon = option.icon;
                  
                  return (
                    <button
                      key={option.key}
                      onClick={() => setSelectedView(option.key)}
                      className="bg-card rounded-lg border p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <div className="aspect-video bg-muted rounded flex items-center justify-center mb-2">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatBytes(screenshot.fileSize)} • {formatDateTime(screenshot.captureTime)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 侧边栏 */}
            <div className="space-y-6">
              {/* 截图设置说明 */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  截图设置
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">桌面版</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      模拟 Chrome 浏览器在 1920×1080 分辨率下的显示效果
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">手机版</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      模拟 iPhone 设备在 375×667 分辨率下的显示效果
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">平板版</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      模拟 iPad 设备在 768×1024 分辨率下的显示效果
                    </p>
                  </div>
                </div>
              </div>

              {/* 相关工具 */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">相关工具</h3>
                <div className="space-y-3">
                  {screenshotTools.map((tool, index) => (
                    <a
                      key={index}
                      href={tool.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <tool.icon className="h-5 w-5 text-purple-600" />
                      <div className="flex-1">
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{tool.desc}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* 截图统计 */}
              {screenshotInfo && (
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4">截图统计</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">目标域名</span>
                      <span className="font-mono text-sm">{screenshotInfo.domain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">截图数量</span>
                      <span className="font-medium">
                        {[screenshotInfo.desktop, screenshotInfo.mobile, screenshotInfo.tablet].filter(Boolean).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">总文件大小</span>
                      <span className="font-mono text-sm">
                        {formatBytes([screenshotInfo.desktop, screenshotInfo.mobile, screenshotInfo.tablet]
                          .filter(Boolean)
                          .reduce((total, shot) => total + (shot?.fileSize || 0), 0))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">拍摄时间</span>
                      <span className="font-mono text-sm">{new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!screenshotInfo && !loading && !error && (
          <div className="text-center py-16">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              开始网站截图
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              输入网站域名，获取在不同设备上的显示截图
            </p>
            
            {/* 截图示例 */}
            <div className="mb-8">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">热门网站截图：</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {['github.com', 'vercel.com', 'tailwindcss.com', 'nextjs.org'].map((domain) => (
                  <button
                    key={domain}
                    onClick={() => handleSearch(domain)}
                    className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                  >
                    截图 {domain}
                  </button>
                ))}
              </div>
            </div>

            {/* 功能特色 */}
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-card rounded-lg border p-6">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Monitor className="h-5 w-5 mr-2 text-blue-600" />
                  多设备支持
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  支持桌面、手机、平板三种设备视图，全面了解网站在不同设备上的显示效果。
                </p>
              </div>
              <div className="bg-card rounded-lg border p-6">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-purple-600" />
                  高质量截图
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  使用先进的无头浏览器技术，确保截图的准确性和高质量，真实反映网站外观。
                </p>
              </div>
              <div className="bg-card rounded-lg border p-6">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Download className="h-5 w-5 mr-2 text-green-600" />
                  便捷下载
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  支持一键下载截图，方便保存和分享，适用于设计参考、竞品分析等场景。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 