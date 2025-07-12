/**
 * ===================================
 * 📋 Next.js 配置文件（精简版）
 * ===================================
 * 
 * 只保留必需的配置，其他交给 Next.js 自动处理
 * 环境变量会自动从 .env.local 读取，无需手动配置
 */

import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// 🌍 多语言支持插件
const withNextIntl = createNextIntlPlugin();

// 环境检测
const isDevelopment = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {

  // 🚀 开发环境代理配置 - 解决 CORS 问题
  async rewrites() {
    if (isDevelopment) {
      const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3900';
      
      return [
        {
          source: '/api/:path*',
          destination: `${backendApiUrl}/api/:path*`,
        },
        {
          source: '/static/:path*',
          destination: `${backendApiUrl}/static/:path*`,
        },
      ];
    }
    return [];
  },

  // 🖼️ 图片域名配置 - 允许外部图片加载
  images: {
    remotePatterns: [
      // 本地开发环境
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',  // Strapi CMS
      },
      // 生产环境
      {
        protocol: 'https',
        hostname: 'api.whosee.me',
      },
      // 动态添加自定义 Strapi 域名
      ...(process.env.NEXT_PUBLIC_STRAPI_URL && !process.env.NEXT_PUBLIC_STRAPI_URL.includes('localhost') ? [{
        protocol: new URL(process.env.NEXT_PUBLIC_STRAPI_URL).protocol.replace(':', '') as 'http' | 'https',
        hostname: new URL(process.env.NEXT_PUBLIC_STRAPI_URL).hostname,
        port: new URL(process.env.NEXT_PUBLIC_STRAPI_URL).port || undefined,
      }] : []),
    ],
  },

  // 🛡️ 安全头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

};

export default withNextIntl(nextConfig);
