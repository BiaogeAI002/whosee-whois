# Whosee.me - 专业域名查询工具

一个现代化的域名信息查询平台，提供 WHOIS 信息查询、DNS 记录查询、网站截图等功能。

## ✨ 功能特性

### 🌐 域名信息查询
- 完整的 WHOIS 信息展示
- 域名注册详情 (注册商、注册人、管理员联系信息等)
- 域名状态和有效期信息
- 域名服务器列表
- 一键复制功能

### 🔍 DNS 记录查询
- 支持多种记录类型：A, AAAA, MX, TXT, NS, CNAME, SOA, PTR
- 详细的记录信息展示 (值、TTL、优先级等)
- 记录类型颜色标识和图标
- DNS 基础知识科普

### 📸 网站截图
- 多设备视图：桌面、手机、平板
- 高质量截图预览
- 设备规格详情显示
- 截图元数据 (文件大小、拍摄时间等)

### 📊 系统健康监控
- 实时服务状态监控
- 系统性能指标 (CPU、内存、磁盘使用率)
- 服务响应时间和可用性统计
- 自动刷新和告警

### 🎨 用户体验
- 🌙 明暗主题切换
- 🌍 中英文国际化支持
- 📱 完全响应式设计
- ⚡ 快速加载和交互
- 🎯 直观的用户界面

## 🛠️ 技术栈

### 前端框架
- **Next.js 15** - React 框架，支持 SSR 和 SSG
- **React 19** - 最新的 React 版本
- **TypeScript** - 类型安全的 JavaScript

### 样式和 UI
- **TailwindCSS 3.4** - 实用优先的 CSS 框架
- **Lucide React** - 现代化图标库
- **CSS 动画** - 流畅的交互动效

### 国际化和主题
- **next-intl** - 完整的国际化解决方案
- **next-themes** - 主题切换和持久化

### 开发工具
- **ESLint** - 代码质量检查
- **PostCSS** - CSS 后处理器
- **Autoprefixer** - 自动添加浏览器前缀

## 🚀 快速开始

### 环境要求
- Node.js 18.17 或更高版本
- npm 或 yarn 包管理器

### 安装依赖
```bash
cd whosee-nextjs
npm install
```

### 开发环境
```bash
npm run dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。

### 构建生产版本
```bash
npm run build
```

### 启动生产服务器
```bash
npm start
```

### 代码检查
```bash
npm run lint
```

## 📁 项目结构

```
whosee-nextjs/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── domain/            # 域名查询页面
│   │   ├── dns/               # DNS 查询页面
│   │   ├── screenshot/        # 截图页面
│   │   ├── health/            # 健康监控页面
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 首页
│   ├── components/            # React 组件
│   │   ├── ui/                # 通用 UI 组件
│   │   └── providers/         # 上下文提供者
│   ├── lib/                   # 工具库
│   │   ├── api.ts             # API 调用服务
│   │   └── utils.ts           # 通用工具函数
│   ├── messages/              # 国际化翻译文件
│   │   ├── en.json            # 英文翻译
│   │   └── zh.json            # 中文翻译
│   ├── types/                 # TypeScript 类型定义
│   └── i18n/                  # 国际化配置
├── public/                    # 静态资源
├── tailwind.config.ts         # TailwindCSS 配置
├── next.config.ts             # Next.js 配置
├── tsconfig.json              # TypeScript 配置
└── package.json               # 项目依赖
```

## 🔧 配置说明

### 环境变量
创建 `.env.local` 文件配置环境变量：

```bash
# API 基础 URL
NEXT_PUBLIC_API_URL=https://api.whosee.me

# 其他配置...
```

### API 集成
项目已包含完整的 API 调用架构 (`src/lib/api.ts`)，支持：
- 域名 WHOIS 查询
- DNS 记录查询
- 网站截图服务
- 健康检查接口

只需要将 API 端点配置到实际的后端服务即可。

## 📦 部署

### Vercel 部署
1. 将项目推送到 GitHub
2. 在 Vercel 控制台导入项目
3. 配置环境变量
4. 自动部署完成

### Docker 部署
```bash
# 构建镜像
docker build -t whosee-nextjs .

# 运行容器
docker run -p 3000:3000 whosee-nextjs
```

### 静态导出
```bash
npm run build
npm run export
```

## 🎯 功能亮点

### 1. 主题切换
- 支持明暗主题无缝切换
- 主题状态持久化存储
- 跟随系统主题设置

### 2. 国际化
- 完整的中英文支持
- 动态语言切换
- SEO 友好的多语言路由

### 3. 响应式设计
- 移动端优先设计
- 平板和桌面端适配
- 触摸友好的交互

### 4. 性能优化
- 代码分割和懒加载
- 图片优化和缓存
- 服务端渲染 (SSR)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- 项目主页：[whosee.me](https://whosee.me)
- 问题反馈：[GitHub Issues](https://github.com/username/whosee-whois/issues)

---
