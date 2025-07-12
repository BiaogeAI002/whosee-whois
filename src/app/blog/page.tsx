import { redirect } from 'next/navigation';

export default function BlogRedirect() {
  // 重定向到默认语言（中文）的博客页面
  redirect('/zh/blog');
} 