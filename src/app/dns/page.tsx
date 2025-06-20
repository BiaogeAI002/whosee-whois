'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { SearchBox } from '@/components/ui/search-box';
import { Server, Copy, Info, Globe, Shield, Clock, ExternalLink, Zap } from 'lucide-react';
import type { DNSInfo } from '@/types';
import { queryDNSInfo, ApiError } from '@/lib/api';
import { copyToClipboard } from '@/lib/utils';

export default function DNSPage() {
  const t = useTranslations('dns');
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [dnsInfo, setDnsInfo] = useState<DNSInfo | null>(null);
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
    setDnsInfo(null);
    
    try {
      const result = await queryDNSInfo(domain);
      setDnsInfo(result);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to fetch DNS information');
      }
      console.error('DNS query error:', err);
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

  const recordTypes = [
    'A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'PTR'
  ] as const;

  const recordTypeInfo = {
    A: { 
      name: 'A 记录', 
      desc: '指向 IPv4 地址',
      icon: '🌐',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
    },
    AAAA: { 
      name: 'AAAA 记录', 
      desc: '指向 IPv6 地址',
      icon: '🔗',
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
    },
    MX: { 
      name: 'MX 记录', 
      desc: '邮件服务器',
      icon: '📧',
      color: 'text-green-600 bg-green-50 dark:bg-green-900/20'
    },
    TXT: { 
      name: 'TXT 记录', 
      desc: '文本验证记录',
      icon: '📄',
      color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20'
    },
    NS: { 
      name: 'NS 记录', 
      desc: '域名服务器',
      icon: '🏢',
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
    },
    CNAME: { 
      name: 'CNAME 记录', 
      desc: '别名记录',
      icon: '🔄',
      color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20'
    },
    SOA: { 
      name: 'SOA 记录', 
      desc: '权威起始记录',
      icon: '👑',
      color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
    },
    PTR: { 
      name: 'PTR 记录', 
      desc: '反向解析记录',
      icon: '🔄',
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20'
    }
  };

  const dnsTools = [
    { name: '域名信息', desc: '查看 WHOIS 信息', href: '/domain', icon: Globe },
    { name: '网站截图', desc: '获取网站页面截图', href: '/screenshot', icon: Server },
    { name: 'SSL 检查', desc: '检查 SSL 证书', href: '#', icon: Shield },
    { name: '性能测试', desc: '网站速度测试', href: '#', icon: Zap }
  ];



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题和搜索 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
            <Server className="h-8 w-8 mr-3 text-green-600" />
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            查询域名的所有 DNS 记录，包括 A、AAAA、MX、TXT、NS、CNAME 等记录类型
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

        {/* DNS 记录显示 */}
        {dnsInfo && (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* 主要内容 */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {recordTypes.map((recordType) => {
                  const records = dnsInfo.records[recordType];
                  if (!records || records.length === 0) return null;

                  const typeInfo = recordTypeInfo[recordType];
                  
                  return (
                    <div key={recordType} className="bg-card rounded-lg border p-6">
                      <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <span className="text-2xl mr-3">{typeInfo.icon}</span>
                        <div>
                          <div className="flex items-center space-x-3">
                            <span>{typeInfo.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                              {records.length} 条记录
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {typeInfo.desc}
                          </p>
                        </div>
                      </h2>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border/50">
                              <th className="text-left py-3 font-medium">{t('type')}</th>
                              <th className="text-left py-3 font-medium">{t('value')}</th>
                              <th className="text-left py-3 font-medium">{t('ttl')}</th>
                              {recordType === 'MX' && <th className="text-left py-3 font-medium">{t('priority')}</th>}
                              <th className="text-left py-3 font-medium">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {records.map((record, index) => (
                              <tr key={index} className="border-b border-border/30 hover:bg-muted/50">
                                <td className="py-3">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${typeInfo.color}`}>
                                    {record.type}
                                  </span>
                                </td>
                                <td className="py-3 font-mono text-sm break-all max-w-xs">
                                  {record.value}
                                </td>
                                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                                  {record.ttl ? `${record.ttl}s` : '-'}
                                </td>
                                {recordType === 'MX' && (
                                  <td className="py-3 text-sm font-medium">
                                    {record.priority || '-'}
                                  </td>
                                )}
                                <td className="py-3">
                                  <button
                                    onClick={() => handleCopy(record.value, `${recordType}-${index}`)}
                                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                                    title="复制记录值"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 侧边栏 */}
            <div className="space-y-6">
              {/* 记录类型说明 */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  记录类型说明
                </h3>
                <div className="space-y-3">
                  {Object.entries(recordTypeInfo).map(([type, info]) => (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{info.icon}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${info.color}`}>
                          {info.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                        {info.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 相关工具 */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">相关工具</h3>
                <div className="space-y-3">
                  {dnsTools.map((tool, index) => (
                    <a
                      key={index}
                      href={tool.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <tool.icon className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{tool.desc}</div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-green-600" />
                    </a>
                  ))}
                </div>
              </div>

              {/* 查询统计 */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">查询信息</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">查询域名</span>
                    <span className="font-mono text-sm">{dnsInfo?.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">记录总数</span>
                    <span className="font-medium">
                      {Object.values(dnsInfo?.records || {}).reduce((total, records) => total + (records?.length || 0), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">查询时间</span>
                    <span className="font-mono text-sm">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">DNS 服务器</span>
                    <span className="text-sm">系统默认</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!dnsInfo && !loading && !error && (
          <div className="text-center py-16">
            <Server className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              开始 DNS 查询
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              输入域名查看其所有 DNS 记录，包括 A、MX、TXT、CNAME 等记录类型
            </p>
            
            {/* 快速查询示例 */}
            <div className="mb-8">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">快速查询示例：</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {['google.com', 'github.com', 'cloudflare.com', 'vercel.com'].map((domain) => (
                  <button
                    key={domain}
                    onClick={() => handleSearch(domain)}
                    className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                  >
                    查询 {domain}
                  </button>
                ))}
              </div>
            </div>

            {/* DNS 基础知识 */}
            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-card rounded-lg border p-6">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-600" />
                  什么是 DNS？
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  DNS（域名系统）将人类可读的域名转换为计算机可理解的 IP 地址，是互联网的重要基础设施。
                </p>
              </div>
              <div className="bg-card rounded-lg border p-6">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-600" />
                  TTL 是什么？
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  TTL（生存时间）表示 DNS 记录可以被缓存的时间长度，较短的 TTL 意味着更快的更新传播。
                </p>
              </div>
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