import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale } from '@/i18n/config';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Navbar } from '@/components/ui/navbar';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Whosee - 专业域名查询工具",
  description: "快速全面的域名信息查询服务。获取 WHOIS 信息、DNS 记录、健康检查和网站截图。",
  keywords: ["域名", "whois", "dns", "查询", "域名检查", "网站健康"],
  authors: [{ name: "Whosee Team" }],
  metadataBase: new URL('https://whosee.me'),
  openGraph: {
    title: "Whosee - 专业域名查询工具",
    description: "快速全面的域名信息查询服务",
    url: 'https://whosee.me',
    siteName: 'Whosee',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Whosee - 专业域名查询工具",
    description: "快速全面的域名信息查询服务",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value || defaultLocale;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              <Navbar />
              <main>
                {children}
              </main>
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
