/**
 * 应用配置
 * 集中管理所有环境变量和配置项
 */

// 从.env文件中获取配置
const API_PORT = import.meta.env.VITE_API_PORT || 3900;
const API_HOST = import.meta.env.VITE_API_HOST || 'localhost';
const API_PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';

// 构建API基础URL
const API_BASE_URL = `${API_PROTOCOL}://${API_HOST}:${API_PORT}`;

// 导出配置对象
export const config = {
  // API配置
  api: {
    baseUrl: API_BASE_URL,
    endpoints: {
      token: `${API_BASE_URL}/api/auth/token`,
      dns: `${API_BASE_URL}/api/dns`,
      whois: `${API_BASE_URL}/api/query`,
      health: `${API_BASE_URL}/api/health`
    }
  },
  
  // 认证配置
  auth: {
    tokenKey: 'auth_token',
    refreshInterval: 60 * 1000 // 60秒
  },
  
  // 缓存配置
  cache: {
    enabled: true,
    ttl: 30 * 60 * 1000 // 30分钟
  }
};

// 导出默认配置
export default config;
