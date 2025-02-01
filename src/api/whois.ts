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

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    ElMessage.error(error.response?.data?.message || '服务器错误，请稍后重试')
    return Promise.reject(error)
  }
)

// 联系人信息接口
interface Contact {
  name?: string
  organization?: string
  email?: string
  phone?: string
  country?: string
  province?: string
  city?: string
}

// Whois 查询结果接口
export interface WhoisResult {
  available: boolean
  domain: string
  registrar?: string
  creationDate?: string
  expiryDate?: string
  status?: string[]
  nameServers?: string[]
  updatedDate?: string
  registrant?: Contact
  admin?: Contact
  tech?: Contact
  whoisServer?: string
  domainAge?: number
  contactEmail?: string
}

// Whois 查询接口
export const whoisQuery = async (domain: string): Promise<WhoisResult> => {
  try {
    return await api.get(`/whois/${domain}`)
  } catch (error) {
    console.error('Whois query failed:', error)
    throw error
  }
} 