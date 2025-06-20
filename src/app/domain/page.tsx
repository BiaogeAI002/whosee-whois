'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { SearchBox } from '@/components/ui/search-box';
import { Globe, User, Server, Copy, Info, Clock, Shield, ExternalLink } from 'lucide-react';
import type { DomainInfo } from '@/types';
import { queryDomainInfo, ApiError } from '@/lib/api';
import { copyToClipboard, formatDateTime } from '@/lib/utils';

export default function DomainPage() {
  const t = useTranslations('domain');
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const initialQuery = searchParams?.get('q') || '';

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (domain: string) => {
    setLoading(true);
    setError(null);
    setDomainInfo(null);
    
    try {
      const result = await queryDomainInfo(domain);
      setDomainInfo(result);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to fetch domain information');
      }
      console.error('Domain query error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const statusInfo = [
    {
      status: 'clientTransferProhibited',
      title: '禁止转移',
      description: '域名被注册商锁定，防止意外转移',
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
    },
    {
      status: 'clientUpdateProhibited', 
      title: '禁止更新',
      description: '域名信息被锁定，防止恶意修改',
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
    },
    {
      status: 'clientDeleteProhibited',
      title: '禁止删除', 
      description: '域名受保护，防止意外删除',
      color: 'text-green-600 bg-green-100 dark:bg-green-900/20'
    },
    {
      status: 'serverHold',
      title: '服务器保留',
      description: '域名被注册局暂停，可能涉及争议',
      color: 'text-red-600 bg-red-100 dark:bg-red-900/20'
    }
  ];

  const relatedTools = [
    { name: 'DNS 查询', desc: '查看域名的 DNS 记录', href: '/dns', icon: Server },
    { name: '网站截图', desc: '获取网站页面截图', href: '/screenshot', icon: Globe },
    { name: 'SSL 检查', desc: '检查 SSL 证书状态', href: '#', icon: Shield },
    { name: '网站性能', desc: '分析网站加载速度', href: '#', icon: Clock }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题和搜索 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <Globe className="h-8 w-8 mr-3 text-blue-600" />
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            获取详细的域名 WHOIS 信息，包括注册详情、联系信息和域名状态
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

        {/* 域名信息显示 */}
        {domainInfo && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 主要信息 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 基本信息 */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  基本信息
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">域名</label>
                    <div className="mt-1 p-2 bg-muted rounded flex items-center justify-between">
                      <span className="font-mono">{domainInfo.domain}</span>
                      <button
                        onClick={() => handleCopy(domainInfo.domain, 'domain')}
                        className="p-1 hover:bg-accent rounded"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('registrar')}</label>
                    <p className="mt-1 p-2 bg-muted rounded">{domainInfo.registrar}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('created')}</label>
                    <p className="mt-1 p-2 bg-muted rounded">{formatDateTime(domainInfo.created)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('updated')}</label>
                    <p className="mt-1 p-2 bg-muted rounded">{formatDateTime(domainInfo.updated)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('expires')}</label>
                    <p className="mt-1 p-2 bg-muted rounded text-red-600 font-medium">{formatDateTime(domainInfo.expires)}</p>
                  </div>
                </div>
              </div>

              {/* 域名状态 */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  {t('status')}
                </h2>
                <div className="space-y-3">
                  {domainInfo.status.map((status, index) => {
                    const statusDetail = statusInfo.find(s => s.status === status);
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusDetail?.color || 'text-gray-600 bg-gray-100 dark:bg-gray-800'}`}>
                          {statusDetail?.title || status}
                        </div>
                        {statusDetail && (
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {statusDetail.description}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 域名服务器 */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  {t('nameservers')}
                </h2>
                <div className="space-y-2">
                  {domainInfo.nameservers.map((ns, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="font-mono">{ns}</span>
                      <button
                        onClick={() => handleCopy(ns, `ns-${index}`)}
                        className="p-1 hover:bg-accent rounded"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 联系信息 */}
              {Object.entries(domainInfo.contacts).map(([type, contact]) => {
                if (!contact) return null;
                return (
                  <div key={type} className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      {t(type as keyof typeof t)} 联系信息
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {contact.name && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">姓名</label>
                          <p className="mt-1 p-2 bg-muted rounded">{contact.name}</p>
                        </div>
                      )}
                      {contact.organization && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">组织</label>
                          <p className="mt-1 p-2 bg-muted rounded">{contact.organization}</p>
                        </div>
                      )}
                      {contact.email && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">邮箱</label>
                          <div className="mt-1 p-2 bg-muted rounded flex items-center justify-between">
                            <span>{contact.email}</span>
                            <button
                              onClick={() => handleCopy(contact.email!, `${type}-email`)}
                              className="p-1 hover:bg-accent rounded"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                      {contact.phone && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">电话</label>
                          <p className="mt-1 p-2 bg-muted rounded">{contact.phone}</p>
                        </div>
                      )}
                      {contact.address && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-muted-foreground">地址</label>
                          <p className="mt-1 p-2 bg-muted rounded">
                            {contact.address}
                            {contact.city && `, ${contact.city}`}
                            {contact.state && `, ${contact.state}`}
                            {contact.country && `, ${contact.country}`}
                            {contact.postalCode && ` ${contact.postalCode}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 侧边栏 */}
            <div className="space-y-6">
              {/* 域名状态说明 */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  状态说明
                </h3>
                <div className="space-y-3 text-sm">
                  {statusInfo.map((info, index) => (
                    <div key={index} className="space-y-1">
                      <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${info.color}`}>
                        {info.title}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{info.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 相关工具 */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">相关工具</h3>
                <div className="space-y-3">
                  {relatedTools.map((tool, index) => (
                    <a
                      key={index}
                      href={tool.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <tool.icon className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{tool.desc}</div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                    </a>
                  ))}
                </div>
              </div>

              {/* 查询统计 */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">查询统计</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">查询时间</span>
                    <span className="font-mono text-sm">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">响应时间</span>
                    <span className="font-mono text-sm">0.8s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">数据来源</span>
                    <span className="text-sm">WHOIS 数据库</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!domainInfo && !loading && !error && (
          <div className="text-center py-16">
            <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              开始域名查询
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              输入域名获取详细的 WHOIS 信息、注册详情和联系信息
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['google.com', 'github.com', 'vercel.com'].map((domain) => (
                <button
                  key={domain}
                  onClick={() => handleSearch(domain)}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  试试 {domain}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 复制成功提示 */}
        {copiedField && (
          <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg">
            已复制到剪贴板！
          </div>
        )}
      </div>
    </div>
  );
} 