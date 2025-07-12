 # Whosee WHOIS - Strapi 5 文档中心

欢迎来到 Whosee WHOIS 项目的 Strapi 5 文档中心！这里包含了完整的安装、配置、集成和故障排除指南。

## 📚 文档目录

### 🚀 [主要指南 - STRAPI5_GUIDE.md](./STRAPI5_GUIDE.md)
**完整的 Strapi 5 集成指南**
- 项目概述和架构
- 安装与配置步骤
- 内容类型设置
- 多语言配置
- 前端集成
- 部署指南

### 🔌 [API 集成 - API_INTEGRATION.md](./API_INTEGRATION.md) 
**详细的 API 集成文档**
- API 客户端设置
- 数据查询方法
- 查询参数构建
- 错误处理
- 使用示例和最佳实践

### 🔄 [迁移指南 - MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
**从 Strapi 4 到 Strapi 5 的迁移指南**
- 主要变化说明
- 数据结构对比
- 代码更新步骤
- 迁移检查清单
- 常见迁移问题

### 🔧 [故障排除 - TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
**常见问题解决方案**
- API 响应问题
- 认证和权限问题
- 多语言问题
- 性能优化
- 调试技巧

## 🎯 快速开始

### 新手入门
1. 阅读 [主要指南](./STRAPI5_GUIDE.md) 了解整体架构
2. 按照安装步骤设置开发环境
3. 查看 [API 集成文档](./API_INTEGRATION.md) 学习如何调用 API

### 迁移现有项目
1. 查看 [迁移指南](./MIGRATION_GUIDE.md) 了解主要变化
2. 按步骤更新代码
3. 使用 [故障排除指南](./TROUBLESHOOTING.md) 解决问题

### 遇到问题
1. 首先查看 [故障排除指南](./TROUBLESHOOTING.md)
2. 检查相关的 API 文档
3. 参考具体的配置步骤

## 🛠️ 技术栈概览

```
┌─────────────────────────────────────────────────────────────┐
│                    Whosee WHOIS 架构                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Next.js 15    │◄──►│   Strapi 5      │                │
│  │   (前端应用)     │    │   (Headless CMS) │               │
│  │  localhost:3000 │    │  localhost:1337 │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                       │                        │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │  • React 19     │    │  • SQLite/PG    │                │
│  │  • TypeScript   │    │  • i18n Plugin  │                │
│  │  • Tailwind CSS │    │  • Upload Plugin│                │
│  │  • next-intl    │    │  • REST API     │                │
│  └─────────────────┘    └─────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📋 核心功能

### 博客系统
- ✅ 多语言文章管理 (中文/英文)
- ✅ 分类和标签系统
- ✅ 富文本编辑器
- ✅ SEO 优化
- ✅ 图片上传和管理
- ✅ RSS Feed 生成

### 内容管理
- ✅ 拖拽式内容编辑
- ✅ 发布状态管理
- ✅ 版本控制
- ✅ 媒体库管理
- ✅ 用户权限控制

### API 集成
- ✅ REST API
- ✅ GraphQL 支持
- ✅ 认证和授权
- ✅ 数据验证
- ✅ 错误处理

## 🌟 重要更新 (Strapi 5)

### 主要变化
- **扁平化数据结构**: 移除了 `attributes` 包装层
- **新增 documentId**: 更好的多语言文档管理
- **改进的关系处理**: 简化了关系数据访问
- **更好的性能**: 优化了查询和响应速度

### 迁移要点
```typescript
// Strapi 4 (旧)
const title = post.attributes.title;
const category = post.attributes.category?.data?.attributes?.name;

// Strapi 5 (新)  
const title = post.title;
const category = post.category?.name;
```

## 📖 使用说明

### 开发环境启动

```bash
# 1. 启动 CMS (终端 1)
cd cms
npm run develop

# 2. 启动前端 (终端 2)
npm run dev

# 3. 访问应用
# 前端: http://localhost:3000
# CMS 管理: http://localhost:1337/admin
```

### 常用 API 示例

```typescript
// 获取博客文章列表
const posts = await getBlogPosts({
  locale: 'zh',
  pagination: { pageSize: 10 },
  populate: '*'
});

// 根据 slug 获取文章
const post = await getBlogPostBySlug('my-article', 'zh');

// 获取分类列表
const categories = await getBlogCategories('zh');
```

## 🎨 最佳实践

### API 调用
- 使用类型安全的 API 客户端
- 实现适当的错误处理
- 添加加载状态管理
- 使用缓存优化性能

### 多语言处理
- 正确映射前端和 CMS 语言代码
- 提供语言回退机制
- 测试所有语言版本

### 性能优化
- 只获取需要的字段
- 使用分页减少数据量
- 实现适当的缓存策略
- 优化图片加载

## 🤝 贡献指南

### 文档更新
如果您发现文档有误或需要补充，请：
1. 创建 Issue 说明问题
2. 提交 Pull Request 修复
3. 更新相关的示例代码

### 问题反馈
遇到问题时，请提供：
- 详细的错误信息
- 重现步骤
- 环境信息 (Node.js 版本、操作系统等)
- 相关的配置文件

## 📞 获取帮助

### 官方资源
- [Strapi 5 官方文档](https://docs.strapi.io/dev-docs/intro)
- [Next.js 文档](https://nextjs.org/docs)
- [next-intl 文档](https://next-intl-docs.vercel.app/)

### 社区支持
- [Strapi Discord](https://discord.strapi.io/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/strapi)
- [GitHub Issues](https://github.com/strapi/strapi/issues)

### 项目相关
如有项目特定问题，请查看：
1. [故障排除指南](./TROUBLESHOOTING.md)
2. 项目的 GitHub Issues
3. 开发团队联系方式

---

**文档版本**: 1.0.0  
**最后更新**: 2024-12-19  
**维护者**: Whosee Development Team

## 📝 更新日志

### v1.0.0 (2024-12-19)
- ✅ 完成 Strapi 5 主要指南
- ✅ 添加 API 集成详细文档  
- ✅ 创建迁移指南
- ✅ 编写故障排除指南
- ✅ 建立文档索引结构