export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  // 添加反向代理支持配置
  url: env('FRONTEND_URL', 'http://localhost'),
  // 如果使用反向代理，建议设置管理面板的 URL
  serveAdminPanel: env.bool('SERVE_ADMIN', true),
});
