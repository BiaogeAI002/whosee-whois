# Domain WHOIS Lookup

<p align="center">
  <img src="docs/images/logo.png" alt="Domain WHOIS Logo" width="200"/>
</p>

<p align="center">
  <a href="https://whosee.me">
    <img src="https://img.shields.io/badge/Demo-whosee.me-blue?style=flat-square" alt="Live Demo"/>
  </a>
  <a href="https://github.com/AsisYu/domain-whois/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/AsisYu/domain-whois?style=flat-square" alt="license"/>
  </a>
  <a href="https://github.com/AsisYu/domain-whois/issues">
    <img src="https://img.shields.io/github/issues/AsisYu/domain-whois?style=flat-square" alt="issues"/>
  </a>
  <a href="https://github.com/AsisYu/domain-whois/stargazers">
    <img src="https://img.shields.io/github/stars/AsisYu/domain-whois?style=flat-square" alt="stars"/>
  </a>
</p>

<p align="center">
  <b>🔍 快速、可靠、安全的域名 WHOIS 信息查询系统</b>
</p>

<p align="center">
  <a href="https://whosee.me">在线体验</a> •
  <a href="#✨-功能特点">功能特点</a> •
  <a href="#🚀-快速开始">快速开始</a> •
  <a href="#📖-api-文档">API 文档</a> •
  <a href="#🤝-贡献指南">贡献指南</a>
</p>

## ✨ 功能特点

- 🌐 支持全球域名查询
- 🚀 多数据源整合 (WhoisXML API、WhoisFreaks)
- ⚡️ Redis 智能缓存
- 🎨 简洁优雅的用户界面
- 📱 完美支持移动端
- 🔒 企业级安全防护
  - JWT 身份认证
  - 智能速率限制
  - IP 风控系统
  - 安全响应头
  - CORS 防护

## 🎯 在线体验

访问 [whosee.me](https://whosee.me) 立即体验！

## 🛠️ 技术栈

### 前端
<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js"/>
  <img src="https://img.shields.io/badge/Element_Plus-Latest-409EFF?style=for-the-badge&logo=element&logoColor=white" alt="Element Plus"/>
  <img src="https://img.shields.io/badge/TypeScript-Latest-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
</p>

### 后端
<p align="center">
  <img src="https://img.shields.io/badge/Go-1.21+-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go"/>
  <img src="https://img.shields.io/badge/Redis-6.0+-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"/>
  <img src="https://img.shields.io/badge/Gin-Latest-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Gin"/>
</p>

## 📁 项目结构

```
domain-whois/
├── 📂 server/           # Go 后端服务
│   ├── handlers/        # API 处理器
│   ├── middleware/      # 中间件组件
│   ├── providers/      # WHOIS 服务提供者
│   └── services/       # 核心业务逻辑
├── 📂 web/             # Vue 前端项目
│   ├── src/           # 源代码
│   ├── public/        # 静态资源
│   └── components/    # Vue 组件
└── 📂 docs/            # 项目文档
```

## 🚀 快速开始

### 环境要求

- Node.js ≥ 14
- Go ≥ 1.21
- Redis ≥ 6.0

### 一键部署

```bash
# 克隆项目
git clone https://github.com/AsisYu/domain-whois.git

# 安装依赖
make install

# 启动服务
make run
```

更多部署细节请参考 [部署文档](docs/deployment.md)

## 📖 API 文档

### 获取查询令牌
```http
POST /api/auth/token
```

### 查询域名信息
```http
POST /api/query
Authorization: Bearer <token>

{
  "domain": "example.com"
}
```

完整 API 文档请访问 [API 文档](docs/api.md)

## 🤝 贡献指南

我们欢迎所有形式的贡献，无论是新功能、文档改进还是 bug 修复。

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add: amazing feature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 开源协议

本项目采用 [MIT](LICENSE) 开源协议

## 👨‍💻 作者

AsisYu ([GitHub](https://github.com/AsisYu) | [Email](mailto:2773943729@qq.com))

## 🌟 致谢

感谢所有为本项目做出贡献的开发者！

<p align="center">
  <img src="https://contrib.rocks/image?repo=AsisYu/domain-whois" />
</p>

---

<p align="center">如果这个项目对你有帮助，请考虑给它一个 Star ⭐️</p>
