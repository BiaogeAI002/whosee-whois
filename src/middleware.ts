import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 检测语言：如果路径以 /en 开头则为英文，否则为中文
  const isEnglishPath = pathname.startsWith('/en');
  const locale = isEnglishPath ? 'en' : 'zh';
  
  // 设置自定义头部，供 i18n 使用
  const response = NextResponse.next();
  response.headers.set('x-locale', locale);
  response.headers.set('x-pathname', pathname);
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$|robots.txt|sitemap.xml).*)'
  ]
}; 