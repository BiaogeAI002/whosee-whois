import axios from 'axios'
import { ElMessage } from 'element-plus'
import { SecurityUtils } from './security'

// 请求计数器
const requestCounter = {
  count: 0,
  lastReset: Date.now(),
  maxRequests: 20,  // 每分钟最大请求数
  timeWindow: 60000 // 1分钟时间窗口
}

// 速率限制检查
const checkRateLimit = () => {
  const now = Date.now()
  if (now - requestCounter.lastReset >= requestCounter.timeWindow) {
    requestCounter.count = 0
    requestCounter.lastReset = now
  }

  if (requestCounter.count >= requestCounter.maxRequests) {
    throw new Error('请求过于频繁，请稍后再试')
  }
  
  requestCounter.count++
}

// 创建 axios 实例
const createSecureApi = () => {
  const api = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL || '/api',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest' // 防止 CSRF
    }
  })

  // 请求拦截器
  api.interceptors.request.use(
    config => {
      try {
        checkRateLimit()
        
        // 添加安全头部
        const nonce = SecurityUtils.generateNonce();
        const timestamp = Date.now();
        
        config.headers['X-Nonce'] = nonce;
        config.headers['X-Timestamp'] = timestamp;
        config.headers['X-Signature'] = SecurityUtils.generateSignature(
          config.method.toUpperCase(),
          config.url,
          config.data || {},
          timestamp,
          nonce,
          process.env.VUE_APP_API_SECRET
        );
        
        return config;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    error => Promise.reject(error)
  )

  // 响应拦截器
  api.interceptors.response.use(
    response => {
      // 只返回必要的数据
      return response.data
    },
    error => {
      // 统一错误处理
      let message = '请求失败，请稍后重试'
      
      if (error.message === '请求过于频繁，请稍后再试') {
        message = error.message
      } else if (error.response) {
        switch (error.response.status) {
          case 429:
            message = '请求过于频繁，请稍后再试'
            break
          case 403:
            message = '没有权限进行此操作'
            break
          case 404:
            message = '请求的资源不存在'
            break
        }
      }

      ElMessage.error(message)
      return Promise.reject(new Error(message))
    }
  )

  return api
}

export const secureApi = createSecureApi() 