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

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">

<div>

### 🌐 全球域名查询支持
- 支持所有主流顶级域名查询
- 实时域名可用性检测
- 快速响应的查询接口

### 🚀 双重数据源保障
- WhoisXML API 数据源
- WhoisFreaks 备用数据源
- 智能故障切换机制

### ⚡️ 智能缓存策略
- Redis 高性能缓存
- 基于域名到期时间的动态缓存时间
  - 15天内到期：1小时缓存
  - 30天内到期：6小时缓存
  - 90天内到期：12小时缓存
  - 其他情况：24小时缓存

### 🎨 简洁的用户界面
- 清晰的查询结果展示
- 响应式布局设计
- 直观的操作体验

</div>

<div>

### 🔒 安全防护机制
- JWT 身份认证
- 请求速率限制
- IP 风控策略
- 标准的 CORS 配置
- 安全响应头

### 📊 专业信息展示
- 注册商信息
- 域名状态
- 创建/更新/过期时间
- 域名服务器信息
- 注册人联系信息

### 📱 全平台适配
- 响应式布局设计
- 移动端优化体验
- 触摸屏友好操作
- 跨浏览器兼容

### 🔄 高可用性保障
- 服务自动恢复
- 负载均衡支持
- 故障转移机制
- 实时监控告警

</div>

</div>

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
# 克隆前端项目
git clone https://github.com/AsisYu/whosee-whois.git

# 克隆后端项目
git clone https://github.com/AsisYu/whosee-server.git

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
