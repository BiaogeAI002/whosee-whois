# 🔒 依赖安全管理指南

## 📋 概述

本文档说明如何处理项目中的依赖安全问题，特别是 Dependabot 自动更新失败的情况。

## 🚨 当前安全问题

### esbuild 漏洞 (GHSA-67mh-4wv8-2f99)
- **严重性**: 中等
- **影响**: 开发服务器请求读取漏洞
- **受限原因**: Strapi 5.18.0 要求 esbuild@^0.21.3，安全版本需要 0.25.0+
- **状态**: 等待 Strapi 更新

### koa 漏洞 (GHSA-jgmv-j7ww-jx2x)
- **严重性**: 中等
- **影响**: 开放重定向via Referrer Header
- **解决方案**: 可通过 npm overrides 临时修复

### tmp 漏洞 (GHSA-52f5-9888-hmc6)
- **严重性**: 中等
- **影响**: 符号链接任意文件写入
- **解决方案**: 升级相关依赖

## 🛠️ 解决策略

### 1. 立即缓解措施

#### 使用 npm overrides 强制更新安全版本
在 `package.json` 中添加：

```json
{
  "overrides": {
    "koa": "^2.17.0",
    "tmp": "^0.3.0"
  }
}
```

#### 在 CMS package.json 中添加：

```json
{
  "overrides": {
    "koa": "^2.17.0",
    "tmp": "^0.3.0",
    "esbuild": "^0.21.5"
  }
}
```

### 2. 开发环境安全措施

#### 限制开发服务器网络访问
```javascript
// next.config.ts 中添加安全配置
const nextConfig = {
  // 限制开发服务器只监听本地
  experimental: {
    allowedRevalidateHeaderKeys: ['authorization'],
  },
};
```

#### CMS 安全配置
```javascript
// cms/config/middlewares.ts
export default [
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://localhost:3000'], // 只允许前端访问
    },
  },
];
```

### 3. 自动化安全检查

#### GitHub Actions 工作流
使用项目中的 `dependency-security-fix.yml` 工作流：

1. **仅审计**: 检查安全状况
2. **非破坏性修复**: 安全更新不会破坏功能
3. **强制修复**: 包含可能的破坏性更新

#### 运行安全检查
```bash
# 手动触发安全检查
# 在 GitHub Actions 页面选择 "手动安全依赖修复" workflow
# 选择适当的修复类型
```

### 4. 监控和跟踪

#### 设置安全通知
1. 启用 GitHub Security Advisories
2. 配置 Dependabot 安全更新
3. 设置邮件通知

#### 定期审计
```bash
# 前端依赖审计
npm audit --audit-level=moderate

# CMS 依赖审计
cd cms && npm audit --audit-level=moderate

# 生成详细报告
npm audit --json > audit-report.json
```

## 🔄 处理 Dependabot 失败

### 常见失败原因

1. **版本冲突**: 依赖要求的版本与安全版本冲突
2. **破坏性变更**: 更新会导致功能破坏
3. **无可用修复**: 暂无安全补丁版本

### 处理步骤

#### 1. 分析失败原因
```bash
# 查看 Dependabot 日志
# GitHub Repository → Security → Dependabot alerts
```

#### 2. 评估安全影响
- 漏洞严重性（Critical > High > Medium > Low）
- 影响范围（生产环境 vs 开发环境）
- 利用可能性

#### 3. 选择处理策略

**高危漏洞**:
- 立即使用 npm overrides 强制更新
- 临时禁用受影响功能
- 寻找替代依赖

**中等漏洞**:
- 配置 Dependabot 忽略规则
- 定期跟踪上游修复进度
- 实施缓解措施

**低危漏洞**:
- 暂时忽略
- 在下次大版本更新时一并处理

## 📚 最佳实践

### 1. 预防措施

#### 依赖管理
- 定期更新依赖（但不要自动更新主版本）
- 使用 `package-lock.json` 锁定版本
- 审查新依赖的安全记录

#### 安全配置
```json
// .npmrc 配置
audit-level=moderate
fund=false
```

#### 开发环境隔离
- 使用容器化开发环境
- 限制网络访问权限
- 启用安全扫描工具

### 2. 应急响应

#### 发现高危漏洞时
1. 立即评估影响范围
2. 实施临时缓解措施
3. 通知团队成员
4. 制定修复计划
5. 测试修复效果
6. 更新文档和流程

#### 沟通模板
```markdown
## 🚨 安全漏洞通知

**漏洞**: [漏洞名称]
**严重性**: [Critical/High/Medium/Low]
**影响组件**: [受影响的依赖]
**影响范围**: [生产/开发/测试环境]

**立即行动**:
- [ ] 评估影响
- [ ] 实施缓解措施
- [ ] 测试修复方案

**后续跟踪**:
- [ ] 监控上游修复
- [ ] 更新安全流程
- [ ] 文档更新
```

### 3. 长期策略

#### 依赖架构优化
- 减少依赖数量
- 选择维护活跃的依赖
- 避免深度依赖链

#### 安全自动化
- 集成安全扫描到 CI/CD
- 自动化安全报告
- 建立安全指标监控

## 🔍 调试和监控

### 查看当前安全状况
```bash
# 快速安全检查
npm audit --audit-level=high

# 详细安全报告
npm audit --json | jq '.vulnerabilities'

# 检查特定依赖
npm audit --audit-level=moderate | grep esbuild
```

### 跟踪修复进度
- GitHub Security 页面
- Dependabot dashboard
- npm audit 定期检查

## 📞 获取帮助

### 内部资源
1. 查看项目 `TROUBLESHOOTING.md`
2. 运行自动化安全检查工作流
3. 咨询开发团队

### 外部资源
1. [GitHub Security Advisories](https://github.com/advisories)
2. [npm Security](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities)
3. [Strapi Security](https://strapi.io/security)

---

**最后更新**: 2024-12-19  
**维护者**: Whosee Development Team  
**版本**: 1.0.0
