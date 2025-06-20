'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SearchBox } from '@/components/ui/search-box';
import { Globe, Server, Camera, ArrowRight, Shield, Clock, Users, TrendingUp, Zap, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const t = useTranslations('home');
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (domain: string) => {
    setSearchLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSearchLoading(false);
    
    // Redirect to domain page with the search result
    window.location.href = `/domain?q=${encodeURIComponent(domain)}`;
  };

  const features = [
    {
      icon: Globe,
      title: t('features.domain.title'),
      description: t('features.domain.description'),
      href: '/domain',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      icon: Server,
      title: t('features.dns.title'),
      description: t('features.dns.description'),
      href: '/dns',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      icon: Camera,
      title: t('features.screenshot.title'),
      description: t('features.screenshot.description'),
      href: '/screenshot',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
  ];

  const stats = [
    { icon: Users, value: '10K+', label: '活跃用户' },
    { icon: Clock, value: '99.9%', label: '服务可用性' },
    { icon: TrendingUp, value: '1M+', label: '查询次数' },
    { icon: Shield, value: '24/7', label: '安全监控' },
  ];

  const highlights = [
    { icon: Zap, title: '极速查询', desc: '毫秒级响应，实时获取域名信息' },
    { icon: Shield, title: '安全可靠', desc: '企业级安全保障，数据加密传输' },
    { icon: Globe, title: '全球覆盖', desc: '支持全球 TLD 域名查询' },
    { icon: Star, title: '专业级', desc: '提供详细的技术信息和分析' },
  ];

  const popularDomains = [
    'google.com', 'github.com', 'stackoverflow.com', 'npm.js.org',
    'vercel.com', 'cloudflare.com', 'aws.amazon.com', 'microsoft.com'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium mb-4">
                🚀 专业域名查询工具
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('title')}
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>

            <div className="max-w-2xl mx-auto mb-12">
              <SearchBox 
                onSearch={handleSearch} 
                loading={searchLoading}
                className="shadow-2xl"
              />
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-3">
                    <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 核心功能 */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              强大的功能特性
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              提供全面的域名信息查询服务，助您深入了解任何域名的详细信息
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link href={feature.href}>
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600 group-hover:-translate-y-1">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${feature.bgColor} mb-6`}>
                        <Icon className={`h-8 w-8 ${feature.color}`} />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {feature.description}
                      </p>
                      
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                        了解更多
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* 特色亮点 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4">
                  <highlight.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {highlight.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {highlight.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 热门域名示例 */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              热门域名查询
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              点击下方域名快速查看详细信息
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {popularDomains.map((domain, index) => (
              <motion.button
                key={domain}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                onClick={() => window.location.href = `/domain?q=${domain}`}
                className="px-4 py-2 bg-white dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {domain}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* 使用教程 */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              如何使用
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              简单三步，快速获取域名详细信息
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: '输入域名', desc: '在搜索框中输入您要查询的域名' },
              { step: '02', title: '选择功能', desc: '选择 WHOIS、DNS 或截图功能' },
              { step: '03', title: '查看结果', desc: '获取详细的域名信息和分析报告' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-6 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              准备开始域名查询了吗？
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              立即使用我们的专业域名查询工具，发现任何域名的详细信息
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/domain"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                开始域名查询
              </Link>
              <Link
                href="/dns"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
              >
                检查 DNS 记录
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
