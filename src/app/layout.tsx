import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { StructuredData } from '@/components/seo/structured-data';
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

// 动态元数据生成
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  const isEnglish = locale === 'en';
  const baseUrl = 'https://whosee.me';
  
  const metadata = {
    zh: {
      title: "Whosee - 专业域名查询工具",
      description: "快速全面的域名信息查询服务。获取 WHOIS 信息、DNS 记录、健康检查和网站截图。",
      keywords: ["域名", "whois", "dns", "查询", "域名检查", "网站健康"],
    },
    en: {
      title: "Whosee - Professional Domain Lookup Tool",
      description: "Fast and comprehensive domain information lookup service. Get WHOIS info, DNS records, health checks and website screenshots.",
      keywords: ["domain", "whois", "dns", "lookup", "domain check", "website health"],
    }
  };

  const currentMeta = metadata[locale as keyof typeof metadata];
  const currentUrl = isEnglish ? `${baseUrl}/en` : baseUrl;

  return {
    title: currentMeta.title,
    description: currentMeta.description,
    keywords: currentMeta.keywords,
    authors: [{ name: "Whosee Team" }],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: currentUrl,
      languages: {
        'zh': baseUrl,
        'en': `${baseUrl}/en`,
        'x-default': baseUrl,
      },
    },
    openGraph: {
      title: currentMeta.title,
      description: currentMeta.description,
      url: currentUrl,
      siteName: 'Whosee',
      type: 'website',
      locale: isEnglish ? 'en_US' : 'zh_CN',
      alternateLocale: isEnglish ? ['zh_CN'] : ['en_US'],
      images: [{
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: currentMeta.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: currentMeta.title,
      description: currentMeta.description,
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Hreflang标签 */}
        <link rel="alternate" hrefLang="zh" href="https://whosee.me" />
        <link rel="alternate" hrefLang="en" href="https://whosee.me/en" />
        <link rel="alternate" hrefLang="x-default" href="https://whosee.me" />
        
        {/* 预加载关键资源 */}
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//api.whosee.me" />
        <link rel="preconnect" href="https://api.whosee.me" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* 结构化数据 */}
        <StructuredData locale={locale} />
      </head>
      <body className={`${inter.variable} font-sans`} suppressHydrationWarning>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              <Navbar />
              <main>
                {children}
              </main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
