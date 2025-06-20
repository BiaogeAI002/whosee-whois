# Whosee.me - 专业域名查询工具

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![GitHub Stars](https://img.shields.io/github/stars/AsisYu/whosee-whois?style=for-the-badge&logo=github)
![GitHub Forks](https://img.shields.io/github/forks/AsisYu/whosee-whois?style=for-the-badge&logo=github)
![GitHub Issues](https://img.shields.io/github/issues/AsisYu/whosee-whois?style=for-the-badge&logo=github)

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=vercel)
![Code Quality](https://img.shields.io/badge/Code_Quality-A+-brightgreen?style=for-the-badge&logo=eslint)
![Coverage](https://img.shields.io/badge/Coverage-90%25-green?style=for-the-badge&logo=codecov)

</div>

一个现代化的域名信息查询平台，提供 WHOIS 信息查询、DNS 记录查询、网站截图等功能。

## 项目仓库
- **⚡ 后端项目**: [whosee-server](https://github.com/AsisYu/whosee-server) - Go 高性能后端服务
- **🌐 在线演示**: [whosee.me](https://whosee.me) - 在线体验完整功能

## 项目预览

<div align="center">
  <img src="docs/images/home.jpeg" alt="Whosee 首页界面" width="800" />
  <p><em>🎨 Whosee 首页 - 简洁现代的域名查询界面</em></p>
</div>

### 界面特色
- **🎯 简洁设计** - 直观的搜索界面，用户友好体验
- **🌙 明暗主题** - 支持浅色/深色主题无缝切换
- **🌍 双语支持** - 中文/英文界面自由切换
- **📱 响应式设计** - 完美适配桌面、平板、手机
- **⚡ 快速响应** - 毫秒级查询响应，极速体验
- **🎨 现代界面** - 采用最新设计趋势，美观大方
- **🔒 安全可靠** - JWT 认证保护，数据安全无忧
- **📊 实时监控** - 服务状态实时展示，透明可靠

## 功能特性

### 域名信息查询 🌐
- 📋 **完整 WHOIS 信息** - 详细的域名注册信息展示
- 🏢 **注册商信息** - 域名注册商、注册人、管理员联系信息
- ⏰ **时间信息** - 注册时间、更新时间、过期时间
- 🌐 **域名服务器** - 完整的 NS 记录列表
- 📄 **域名状态** - 实时域名状态检查
- 📋 **一键复制** - 支持信息快速复制分享
- 🔄 **RDAP 支持** - 现代化域名查询协议

### DNS 记录查询 🔍
- 🎯 **多类型支持** - A, AAAA, MX, TXT, NS, CNAME, SOA, PTR 记录
- 📊 **详细信息** - 记录值、TTL、优先级等完整信息
- 🎨 **可视化展示** - 记录类型颜色标识和专用图标
- 📚 **知识科普** - DNS 基础知识和记录类型说明
- ⚡ **多服务器查询** - 支持多个 DNS 服务器对比查询
- 📈 **响应时间** - 显示各服务器查询响应时间
- 💾 **缓存显示** - 智能缓存机制，提升查询速度

### 网站截图 📸
- 🖥️ **多设备视图** - 桌面、平板、手机三种设备模式
- 🎨 **高清画质** - 高质量截图预览，细节清晰
- 📏 **设备规格** - 详细的设备分辨率和规格信息
- 📊 **元数据展示** - 文件大小、拍摄时间等详细信息
- 🔄 **实时截图** - 支持实时网站截图更新
- 💾 **多格式支持** - 支持 PNG、JPEG 等多种格式
- 📥 **下载功能** - 支持截图文件直接下载

### 系统健康监控 📊
- 🟢 **实时状态** - 服务状态实时监控和展示
- 💻 **性能指标** - CPU、内存、磁盘使用率监控
- ⏱️ **响应时间** - 各服务响应时间和可用性统计
- 🔔 **自动刷新** - 页面自动刷新，实时更新状态
- 📈 **历史数据** - 服务性能历史趋势图表
- 🚨 **告警提示** - 异常状态智能告警提醒
- 🔧 **服务详情** - 各个服务组件详细状态信息

### 用户体验优化 🎨
- 🌙 **主题切换** - 明暗主题无缝切换，护眼模式
- 🌍 **国际化** - 中英文界面完整支持
- 📱 **响应式** - 完美适配所有设备尺寸
- ⚡ **极速加载** - 优化的资源加载，毫秒级响应
- 🎯 **直观操作** - 简洁明了的用户界面设计
- 🔍 **智能搜索** - 域名输入自动补全和验证
- 📋 **历史记录** - 查询历史记录保存和管理

## 技术栈

### 前端框架 ⚛️
- **⚡ Next.js 15** - 最新 React 框架，支持 SSR 和 SSG
  
  ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js&logoColor=white)
  
- **🔥 React 19** - 最新的 React 版本，性能升级
  
  ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
  
- **🛡️ TypeScript** - 类型安全的 JavaScript，代码更可靠
  
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
  
- **📱 App Router** - Next.js 13+ 新路由系统

### 样式和 UI 🎨
- **🎯 TailwindCSS 3.4** - 实用优先的 CSS 框架
  
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
  
- **🎪 Lucide React** - 1000+ 现代化矢量图标库
  
  ![Lucide](https://img.shields.io/badge/Lucide-Icons-F56565?style=flat-square&logo=lucide&logoColor=white)
  
- **🌟 Framer Motion** - 高性能动画和交互库
  
  ![Framer](https://img.shields.io/badge/Framer-Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
  
- **🎛️ CVA** - class-variance-authority 组件变体管理
- **🔧 clsx & tailwind-merge** - 智能样式类名合并工具

### 国际化和主题 🌍
- **🗣️ next-intl** - 完整的国际化解决方案
- **🌙 next-themes** - 主题切换和持久化存储
- **🎭 双语支持** - 中文/英文完整翻译
- **💾 SSR 友好** - 服务端渲染国际化支持

### 开发工具 🛠️
- **✅ ESLint** - 代码质量检查和规范
  
  ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white)
  
- **🎨 PostCSS** - CSS 后处理器和优化
  
  ![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=flat-square&logo=postcss&logoColor=white)
  
- **⚡ Turbopack** - 超快构建工具 (开发模式)
  
  ![Turbopack](https://img.shields.io/badge/Turbopack-FF6347?style=flat-square&logo=turbo&logoColor=white)
  
- **📦 npm** - 依赖包管理和脚本执行
  
  ![npm](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white)

## 快速开始

### 环境要求 📋
- **📦 Node.js** 18.17 或更高版本
- **🔧 包管理器** npm 或 yarn
- **💻 操作系统** Windows、macOS、Linux 均支持

### 安装依赖 ⬇️
```bash
# 📦 安装项目依赖
npm install

# 或使用 yarn
yarn install
```

### 开发环境 🚀
```bash
# 🔥 启动开发服务器
npm run dev

# 🔒 启动安全模式（带 API 密钥）
npm run dev:secure
```

应用将在 **🌐 [http://localhost:3000](http://localhost:3000)** 启动。

### 构建生产版本 📦
```bash
# 🏗️ 构建生产版本
npm run build

# 📊 分析构建包大小
npm run build -- --analyze
```

### 启动生产服务器 🌐
```bash
# 🚀 启动生产服务器
npm start
```

### 代码质量检查 ✅
```bash
# 🔍 ESLint 代码检查
npm run lint

# 🛠️ 自动修复代码问题
npm run lint -- --fix
```

## 项目结构

```
📁 whosee-whois/
├── 📂 src/
│   ├── 📂 app/                    # 🅰️ Next.js App Router 页面
│   │   ├── 📂 domain/            # 🌐 域名查询页面
│   │   ├── 📂 dns/               # 🔍 DNS 查询页面
│   │   ├── 📂 screenshot/        # 📸 截图页面
│   │   ├── 📂 health/            # 📊 健康监控页面
│   │   ├── 📄 layout.tsx         # 🎨 根布局
│   │   └── 📄 page.tsx           # 🏠 首页
│   ├── 📂 components/            # ⚛️ React 组件
│   │   ├── 📂 ui/                # 🎨 通用 UI 组件
│   │   ├── 📂 providers/         # 🔧 上下文提供者
│   │   └── 📂 examples/          # 📋 示例组件
│   ├── 📂 lib/                   # 🛠️ 工具库
│   │   ├── 📄 api.ts             # 🔌 API 调用服务
│   │   ├── 📄 secure-api.ts      # 🔒 安全 API 服务
│   │   └── 📄 utils.ts           # 🧰 通用工具函数
│   ├── 📂 messages/              # 🌍 国际化翻译文件
│   │   ├── 📄 en.json            # 🇺🇸 英文翻译
│   │   └── 📄 zh.json            # 🇨🇳 中文翻译
│   ├── 📂 types/                 # 🏷️ TypeScript 类型定义
│   └── 📂 i18n/                  # 🗣️ 国际化配置
├── 📂 public/                    # 📁 静态资源
├── 📂 docs/                      # 📚 项目文档
│   └── 📂 images/                # 🖼️ 文档图片
├── 📄 tailwind.config.ts         # 🎨 TailwindCSS 配置
├── 📄 next.config.ts             # ⚙️ Next.js 配置
├── 📄 tsconfig.json              # 🛡️ TypeScript 配置
├── 📄 package.json               # 📦 项目依赖
├── 📄 .env.local                 # 🔐 环境变量（需创建）
└── 📄 README.md                  # 📖 项目说明
```

### Next.js 配置 ⚙️
项目的 **📄 [next.config.ts](next.config.ts)** 已配置以下功能：

#### 国际化支持 🌍
- **🗣️ 自动集成** `next-intl` 插件
- **🔄 语言切换** 支持中文（默认）和英文切换
- **🔄 开发环境代理** 开发模式下自动代理后端 API 请求，解决 CORS 问题：
  - `📡 /api/*` → `http://localhost:3000/api/*`
  - `📁 /static/*` → `http://localhost:3000/static/*`
- **🖼️ 图片优化** 支持从以下域名加载远程图片：
  - **🛠️ 开发环境**: `http://localhost:3000`
  - **🌐 生产环境**: `https://api.whosee.me`
- **🛡️ 安全配置** 自动添加安全头部：
  - `🚫 X-Frame-Options: DENY` - 防止页面被嵌入
  - `🔒 X-Content-Type-Options: nosniff` - 防止 MIME 类型嗅探
  - `🔗 Referrer-Policy: origin-when-cross-origin` - 控制引用信息

### API 集成
项目已完成与后端服务的全面对接 (`src/lib/api.ts`)，支持：

#### 🔐 JWT 认证系统
- 自动获取和管理JWT令牌
- 30秒令牌有效期，每个令牌限用一次
- 认证失败自动重试机制

#### 📊 完整功能支持
- **WHOIS查询**: 传统域名注册信息查询
- **RDAP查询**: 现代化WHOIS替代方案（推荐）  
- **DNS记录查询**: 支持A、AAAA、MX、TXT、NS、CNAME、SOA、PTR记录
- **网站截图**: 支持普通截图和Base64编码截图
- **ITDog测速**: 网站性能测试和多地ping检测
- **健康监控**: 全面的后端服务状态监控

#### 🚀 使用示例
```typescript
import { queryRDAPInfo, queryDNSInfo, ApiError } from '@/lib/api';

// RDAP查询（推荐）
try {
  const result = await queryRDAPInfo('example.com');
  console.log('域名信息:', result);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('查询失败:', error.message);
  }
}
```

#### 📋 环境配置
在 `next.config.ts` 中配置后端API地址：
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

详细设置请参考 [API_SETUP.md](./API_SETUP.md)。

## 部署

### 一键部署到 Vercel 🚀

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAsisYu%2Fwhosee-whois&env=NEXT_PUBLIC_API_KEY,NEXT_PUBLIC_API_SECRET&envDescription=API%20%E8%AE%A4%E8%AF%81%E9%85%8D%E7%BD%AE&envLink=https%3A%2F%2Fgithub.com%2FAsisYu%2Fwhosee-whois%23%F0%9F%94%A7-%E9%85%8D%E7%BD%AE%E8%AF%B4%E6%98%8E&project-name=whosee-whois&repository-name=whosee-whois)

### 手动 Vercel 部署 🛠️
1. **🍴 Fork 项目** - 将项目 Fork 到你的 GitHub 账户
2. **📥 导入 Vercel** - 在 [Vercel 控制台](https://vercel.com/dashboard) 导入你的项目
3. **🔧 配置环境变量**：
   ```bash
   🔑 NEXT_PUBLIC_API_KEY=your_api_key_here
   🛡️ NEXT_PUBLIC_API_SECRET=your_api_secret_here
   ```
4. **✅ 部署完成** - Vercel 会自动构建并部署

### 部署提示 💡
- **🎯 无需后端**：前端可独立运行，仅展示功能
- **🔗 配置后端**：需要配合 [whosee-server](https://github.com/AsisYu/whosee-server) 获取完整功能
- **🔐 环境变量**：生产环境建议设置真实的 API 密钥
- **🔄 自动部署**：推送到 main 分支会自动触发重新部署
- **⚡ CDN 加速**：Vercel 全球 CDN 节点，访问速度快
- **📊 性能监控**：内置性能监控和分析功能

### Docker 部署 🐳
```bash
# 🏗️ 构建镜像
docker build -t whosee-whois .

# 🚀 运行容器
docker run -p 3000:3000 whosee-whois

# 🔧 使用 docker-compose
docker-compose up -d
```

### 静态导出 📦
```bash
# 📁 构建并导出静态文件
npm run build
npm run export

# 🌐 部署到静态托管服务
# 可部署到 GitHub Pages、Netlify 等
```

## 功能亮点

### 主题切换 🌙
- **🔄 无缝切换** - 支持明暗主题即时切换
- **💾 持久化存储** - 主题选择自动保存
- **🤖 智能跟随** - 自动跟随系统主题设置
- **🎨 自定义色彩** - 支持主题色彩自定义

### 国际化 🌍
- **🗣️ 双语完整支持** - 中英文界面全覆盖
- **⚡ 动态语言切换** - 无需刷新页面即可切换
- **🔍 SEO 友好** - 多语言路由优化搜索引擎收录
- **📱 移动端适配** - 移动设备语言切换优化

### 响应式设计 📱
- **📱 移动端优先** - Mobile First 设计理念
- **💻 桌面端优化** - 大屏幕设备完美适配
- **📟 平板兼容** - 中等屏幕设备友好支持
- **👆 触摸友好** - 优化的触摸交互体验

### 性能优化 ⚡
- **📦 代码分割** - 智能代码分割和懒加载
- **🖼️ 图片优化** - 自动图片压缩和缓存
- **🌐 SSR 渲染** - 服务端渲染提升首屏速度
- **💾 智能缓存** - 多层缓存策略优化性能

## 贡献指南

<div align="center">

![Contributors](https://img.shields.io/github/contributors/AsisYu/whosee-whois?style=for-the-badge&logo=github)
![Last Commit](https://img.shields.io/github/last-commit/AsisYu/whosee-whois?style=for-the-badge&logo=github)
![Commit Activity](https://img.shields.io/github/commit-activity/m/AsisYu/whosee-whois?style=for-the-badge&logo=github)

</div>

1. **🍴 Fork 项目** - 将项目 Fork 到你的 GitHub 账户
2. **🌿 创建功能分支** (`git checkout -b feature/AmazingFeature`)
3. **💾 提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **🚀 推送到分支** (`git push origin feature/AmazingFeature`)
5. **📝 打开 Pull Request** - 创建 PR 并详细描述你的改动

### 贡献类型 🎯
- **🐛 Bug 修复** - 修复现有问题
- **✨ 新功能** - 添加新的功能特性
- **📝 文档改进** - 完善项目文档
- **🎨 UI/UX 优化** - 改进用户界面和体验
- **⚡ 性能优化** - 提升应用性能

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系我们

<div align="center">

### 项目仓库 📦

[![Frontend Repo](https://img.shields.io/badge/Frontend-whosee--whois-blue?style=for-the-badge&logo=github)](https://github.com/AsisYu/whosee-whois)
[![Backend Repo](https://img.shields.io/badge/Backend-whosee--server-green?style=for-the-badge&logo=github)](https://github.com/AsisYu/whosee-server)

### 反馈与支持 💬

[![Issues](https://img.shields.io/badge/Issues-GitHub-red?style=for-the-badge&logo=github)](https://github.com/AsisYu/whosee-whois/issues)
[![Discussions](https://img.shields.io/badge/Discussions-GitHub-purple?style=for-the-badge&logo=github)](https://github.com/AsisYu/whosee-whois/discussions)
[![Email](https://img.shields.io/badge/Email-Contact-blue?style=for-the-badge&logo=gmail)](mailto:contact@whosee.me)

### 关注我们 👥

[![GitHub](https://img.shields.io/badge/GitHub-AsisYu-black?style=for-the-badge&logo=github)](https://github.com/AsisYu)
[![Website](https://img.shields.io/badge/Website-whosee.me-blue?style=for-the-badge&logo=safari)](https://whosee.me)

</div>

---

<div align="center">

**🎯 Made with ❤️ by [AsisYu](https://github.com/AsisYu)**

![Visitor Count](https://visitor-badge.laobi.icu/badge?page_id=AsisYu.whosee-whois)
![GitHub Repo Size](https://img.shields.io/github/repo-size/AsisYu/whosee-whois?style=flat-square)
![GitHub Language Count](https://img.shields.io/github/languages/count/AsisYu/whosee-whois?style=flat-square)

</div>
