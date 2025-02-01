/*
 * @Author: AsisYu 2773943729@qq.com
 * @Date: 2025-01-17 21:10:54
 * @LastEditors: AsisYu 2773943729@qq.com
 * @LastEditTime: 2025-01-18 01:02:08
 * @FilePath: \dmainwhoseek\src\api\whois.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'

// API 基础配置
const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 获取JWT Token
async function getToken() {
  try {
    const response = await api.post('/auth/token')
    return response.token
  } catch (error) {
    console.error('Failed to get token:', error)
    throw new Error('认证失败')
  }
}

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    const errorMessage = error.response?.data?.error || '请求失败，请稍后重试'
    ElMessage.error(errorMessage)
    return Promise.reject(error)
  }
)

// Whois 查询接口
export const whoisQuery = async (domain) => {
  try {
    if (!domain || typeof domain !== 'string') {
      throw new Error('无效的域名')
    }
    
    // 域名格式验证
    domain = domain.trim().toLowerCase()
    const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z]{2,})+$/
    if (!domainRegex.test(domain) || domain.length > 253) {
      throw new Error('无效的域名格式')
    }

    // 获取token并发送请求
    const token = await getToken()
    return await api.post('/query', { domain }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  } catch (error) {
    throw new Error(error.response?.data?.error || '查询失败，请稍后重试')
  }
} 