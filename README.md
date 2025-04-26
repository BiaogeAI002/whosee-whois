# 🌐 Whosee.me - 优雅的域名查询工具

<div align="center">
  
  ![Whosee.me Logo](https://img.shields.io/badge/Whosee.me-域名查询工具-blue?style=for-the-badge&logo=internetexplorer)
  
  [![Svelte](https://img.shields.io/badge/Svelte-4.2-FF3E00?style=flat-square&logo=svelte)](https://svelte.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
  
</div>

Whosee.me是一个简单、优雅的域名查询工具，帮助您快速了解域名的WHOIS信息、DNS记录等详细数据。

## ✨ 项目特点

- 🔍 快速查询任意域名的WHOIS信息
- 🌐 查询域名的DNS记录
- 🖼️ 支持域名截图功能
  - 🛠️ 增强的错误处理，当网站无法访问时提供友好提示
  - 🔄 自动在域名变更时清除上一次的截图结果
- 🚀 高效的缓存机制，加速查询过程
- 🎨 现代化UI设计，优雅的用户体验
- 📱 完全响应式，支持各种设备
- 🔄 自动保存搜索历史
- ⚡ 基于Svelte构建，性能卓越

## 🛠️ 技术栈

<table>
  <tr>
    <th>前端</th>
    <th>后端</th>
  </tr>
  <tr>
    <td>
      <ul>
        <li>🔧 <b>框架</b>：Svelte + SvelteKit</li>
        <li>🎭 <b>UI组件</b>：Skeleton UI</li>
        <li>🎨 <b>样式处理</b>：TailwindCSS</li>
        <li>🏗️ <b>构建工具</b>：Vite</li>
        <li>📝 <b>开发语言</b>：TypeScript</li>
        <li>📸 <b>截图工具</b>：Puppeteer</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>🚀 <b>框架</b>：Gin (Go)</li>
        <li>⚡ <b>缓存</b>：Redis</li>
        <li>🔐 <b>认证</b>：JWT</li>
        <li>🔌 <b>API集成</b>：WHOIS API, DNS查询</li>
      </ul>
    </td>
  </tr>
</table>

## 📂 项目架构

这是前端仓库，后端代码位于单独的仓库 [whosee-server](https://github.com/AsisYu/whosee-server)。

```
src/                # 前端源代码
├── lib/            # 共享库文件
│   ├── api/        # API接口
│   ├── components/ # 可复用组件
│   ├── stores/     # 状态管理
│   └── utils/      # 工具函数
└── routes/         # 页面路由
```

### 🧩 主要组件

- **🔍 SearchBox**: 搜索框组件，支持历史记录功能
- **📋 DomainResult**: WHOIS信息展示组件
  - 集成截图功能，支持普通截图和测速截图
  - 优化的错误处理，显示详细的错误信息和重试选项
- **🌐 DNSResult**: DNS记录展示组件
- **🏷️ Badge**: 通用状态标签组件

## 🔌 API接口

前端通过以下API接口与后端通信，后端实现位于 [whosee-server](https://github.com/AsisYu/whosee-server) 仓库。

### WHOIS查询

```
GET /api/query?domain={domain}
```

### DNS查询

```
GET /api/dns?domain={domain}
```

### 域名截图

```
GET /api/screenshot/{domain}         # 普通网站截图
GET /api/screenshot/itdog/{domain}   # ITDog测速截图
POST /api/screenshot/element         # 网页元素截图
```

## 📥 安装指南

### 环境要求

- Node.js 18.0.0 或更高版本
- npm 9.0.0 或更高版本

### 安装依赖

```bash
# 安装依赖
npm install
```

### 截图功能依赖

本项目使用Puppeteer实现域名截图功能。Puppeteer是一个Node库，它提供了一个高级API来通过DevTools Protocol控制Chromium或Chrome。

```bash
# 安装Puppeteer
npm install puppeteer
```

注意事项：
- 首次安装Puppeteer时会下载Chromium浏览器（约170MB），请确保网络连接良好
- 如果遇到Chromium下载问题，可以设置环境变量跳过下载：`PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`
- 如果跳过下载，需要手动指定Chrome浏览器路径：
  ```js
  const browser = await puppeteer.launch({
    executablePath: '/path/to/Chrome'
  });
  ```

### 环境配置

创建环境配置文件 `.env`：

```
API_PORT=3900
API_HOST=localhost
API_PROTOCOL=http
```

### 开发服务器

启动开发服务器：

```bash
npm run dev
```

在浏览器中打开：

```bash
npm run dev -- --open
```

### 构建项目

创建生产版本：

```bash
npm run build
```

预览生产构建：

```bash
npm run preview
```

## 🔗 后端设置

后端代码位于单独的仓库 [whosee-server](https://github.com/AsisYu/whosee-server)，请参考该仓库的README文件获取安装和配置指南。

## 🤝 贡献指南

欢迎提交问题和功能请求！如果您想贡献代码，请先创建一个issue讨论您的想法。

## 📄 许可证

[MIT](LICENSE)
