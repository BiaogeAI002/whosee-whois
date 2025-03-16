# Domain WHOIS Lookup

<p align="center">
  <img src="docs/images/logo.png" alt="Domain WHOIS Logo" width="200"/>
</p>

<p align="center">
  <a href="https://whosee.me">
    <img src="https://img.shields.io/badge/Demo-whosee.me-blue?style=flat-square" alt="Live Demo"/>
  </a>
  <a href="https://github.com/AsisYu/whosee-whois/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/AsisYu/whosee-whois?style=flat-square" alt="license"/>
  </a>
  <a href="https://github.com/AsisYu/whosee-whois/issues">
    <img src="https://img.shields.io/github/issues/AsisYu/whosee-whois?style=flat-square" alt="issues"/>
  </a>
  <a href="https://github.com/AsisYu/whosee-whois/stargazers">
    <img src="https://img.shields.io/github/stars/AsisYu/whosee-whois?style=flat-square" alt="stars"/>
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

- 🌐 全球域名查询支持
  - 支持所有顶级域名（TLD）查询
  - 多语言域名（IDN）支持
  - 实时域名可用性检测

- 🚀 多重数据源整合
  - WhoisXML API 官方数据源
  - WhoisFreaks 专业数据源
  - 智能数据源切换和故障转移

- ⚡️ 高性能缓存系统
  - Redis 智能缓存策略
  - 基于域名到期时间的动态缓存
  - 自动缓存清理和更新机制

- 🎨 现代化用户界面
  - 简洁优雅的设计风格
  - 深色模式支持
  - 实时查询反馈
  - 查询历史记录

- 📱 全平台适配
  - 响应式布局设计
  - 移动端优化体验
  - 触摸屏友好操作
  - 跨浏览器兼容

- 🔒 企业级安全防护
  - JWT 身份认证系统
  - IP 智能风控
  - 自适应速率限制
  - 请求加密传输
  - 防 DDoS 攻击
  - 完整的 CORS 策略
  - 安全响应头配置

- 📊 专业数据展示
  - 域名注册详情
  - 所有者信息展示
  - 服务器状态监控
  - 域名健康分析
  - 到期提醒功能

- 🔄 高可用性保障
  - 服务自动恢复
  - 负载均衡支持
  - 故障转移机制
  - 实时监控告警

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
whosee-whois/
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
git clone https://github.com/AsisYu/whosee-whois.git

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
  <img src="https://contrib.rocks/image?repo=AsisYu/whosee-whois" />
</p>

---

<p align="center">如果这个项目对你有帮助，请考虑给它一个 Star ⭐️</p>
