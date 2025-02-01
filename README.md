# domain-whois

<p align="center">
  <img src="docs/images/logo.png" alt="domain-whois Logo" width="200"/>
</p>

<p align="center">
  <a href="https://github.com/AsisYu/domain-whois/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/AsisYu/domain-whois" alt="license"/>
  </a>
  <a href="https://github.com/AsisYu/domain-whois/issues">
    <img src="https://img.shields.io/github/issues/AsisYu/domain-whois" alt="issues"/>
  </a>
  <a href="https://github.com/AsisYu/domain-whois/stargazers">
    <img src="https://img.shields.io/github/stars/AsisYu/domain-whois" alt="stars"/>
  </a>
</p>

domain-whois 是一个现代化的域名 WHOIS 信息查询系统，提供快速、可靠、安全的域名注册信息查询服务。

## ✨ 功能特点

- 🚀 多数据源支持 (WhoisXML API、WhoisFreaks)
- 💾 Redis 缓存加速查询
- 🎨 现代化 UI 设计
- 📱 响应式布局，支持移动端
- 🔒 完善的安全机制
  - JWT 认证
  - 请求速率限制
  - IP 黑名单
  - 安全响应头
  - CORS 保护

## 🛠️ 技术栈

### 前端
- Vue 3 - 渐进式 JavaScript 框架
- Vue Router - 官方路由管理器
- Element Plus - UI 组件库
- Axios - HTTP 客户端
- TypeScript - 类型安全

### 后端
- Go 1.21+ - 高性能后端语言
- Gin - Web 框架
- Redis - 缓存和速率限制
- JWT - 身份认证

## 📁 项目结构

```
├── server/              # Go后端服务
│   ├── handlers/        # 请求处理器
│   ├── middleware/      # 中间件
│   │   ├── auth.go     # JWT认证
│   │   ├── cors.go     # CORS配置
│   │   ├── security.go # 安全头
│   │   └── ...
│   ├── providers/      # WHOIS服务提供者
│   ├── services/       # 业务逻辑
│   └── main.go         # 入口文件
├── src/                # Vue前端项目
│   ├── api/           # API请求
│   ├── components/    # Vue组件
│   ├── views/         # 页面视图
│   └── App.vue        # 根组件
└── docs/              # 文档
```

## 🚀 快速开始

### 环境要求

- Node.js >= 14
- Go >= 1.21
- Redis >= 6.0

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/AsisYu/domain-whois.git
cd domain-whois
```

2. 安装前端依赖
```bash
npm install
```

3. 安装后端依赖
```bash
cd server
go mod download
```

4. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填写必要的配置
```

5. 启动服务
```bash
# 前端开发服务器
npm run serve

# 后端服务
cd server
go run main.go
```

## 🔒 安全特性

- JWT 短期令牌认证
- 请求速率限制
- IP 自动封禁
- XSS 防护
- 请求验证
- 安全响应头
- 监控告警

## 📖 API 文档

### 认证
```http
POST /api/auth/token
```

### 域名查询
```http
POST /api/query
Authorization: Bearer <token>
Content-Type: application/json

{
  "domain": "example.com"
}
```

### 响应示例
```json
{
  "domain": "example.com",
  "registrar": "Example Registrar",
  "creationDate": "2020-01-01",
  "expiryDate": "2025-01-01",
  "status": "active"
}
```

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

AsisYu - [@AsisYu](https://github.com/AsisYu) - 2773943729@qq.com

## 🙏 致谢

- [WhoisXML API](https://www.whoisxmlapi.com/)
- [WhoisFreaks](https://whoisfreaks.com/)
- [Gin Framework](https://gin-gonic.com/)
- [Vue.js](https://vuejs.org/)
- 所有项目贡献者

## 📊 状态

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/AsisYu/domain-whois/security.yml)
![GitHub last commit](https://img.shields.io/github/last-commit/AsisYu/domain-whois)
