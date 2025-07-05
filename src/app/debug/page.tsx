'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function DebugPage() {
  const pathname = usePathname();
  const t = useTranslations('common');
  
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'zh';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🐛 调试信息</h1>
        
        <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <strong>当前路径:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{pathname}</code>
          </div>
          
          <div>
            <strong>检测到的语言:</strong> <span className="font-mono text-blue-600">{currentLocale}</span>
          </div>
          
          <div>
            <strong>next-intl翻译测试:</strong> {t('search')}
          </div>
          
          <div>
            <strong>时间戳:</strong> {new Date().toLocaleString()}
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h2 className="font-semibold mb-2 text-green-800 dark:text-green-200">✅ 路由修复状态</h2>
          <ul className="text-sm space-y-1 text-green-700 dark:text-green-300">
            <li>• 中文页面: / (应该可以访问)</li>
            <li>• 英文页面: /en/ (应该可以访问)</li>
            <li>• 语言切换: 导航栏右上角</li>
            <li>• 页面翻译: 通过next-intl自动处理</li>
          </ul>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">🔄 语言切换测试</h2>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-white dark:bg-gray-700 rounded border">
              <strong>测试步骤:</strong>
              <ol className="mt-2 space-y-1 list-decimal list-inside">
                <li>点击导航栏右上角的语言切换按钮</li>
                <li>观察图标变为转圈加载状态</li>
                <li>页面应该刷新并显示新语言</li>
                <li>URL应该正确更新（中文无前缀，英文有/en前缀）</li>
                <li>页面内容应该完全翻译</li>
              </ol>
            </div>
            
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
              <strong>⚠️ 预期行为:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>语言切换会强制刷新页面（这是正常的）</li>
                <li>切换过程中按钮会显示加载状态</li>
                <li>切换后页面内容会完全重新加载为新语言</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <h2 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">🔗 测试链接</h2>
          <div className="space-y-2 text-sm">
            <div><a href="/" className="text-blue-600 hover:underline">中文首页: /</a></div>
            <div><a href="/en" className="text-blue-600 hover:underline">英文首页: /en</a></div>
            <div><a href="/domain" className="text-blue-600 hover:underline">中文域名页: /domain</a></div>
            <div><a href="/en/domain" className="text-blue-600 hover:underline">英文域名页: /en/domain</a></div>
            <div><a href="/test-locale" className="text-blue-600 hover:underline">语言测试页: /test-locale</a></div>
            <div><a href="/en/test-locale" className="text-blue-600 hover:underline">Language Test: /en/test-locale</a></div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="font-semibold mb-2">🛠️ 技术说明</h2>
          <div className="text-sm space-y-2">
            <p><strong>修复方案:</strong> 使用 window.location.href 强制页面刷新</p>
            <p><strong>原因:</strong> 确保中间件重新执行，重新加载翻译文件</p>
            <p><strong>用户体验:</strong> 添加加载状态指示器，防止重复点击</p>
          </div>
        </div>
      </div>
    </div>
  );
} 