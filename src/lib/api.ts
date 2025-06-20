import type { DomainInfo, DNSInfo, HealthInfo, ScreenshotInfo, DNSRecord } from '@/types';

// API 基础配置 - 参考原项目方案
// 开发环境：使用相对路径，让Next.js代理转发请求
// 生产环境：使用完整API地址
const isDevelopment = typeof window !== 'undefined' 
  ? window.location.hostname === 'localhost' 
  : process.env.NODE_ENV !== 'production';

const API_BASE_URL = isDevelopment ? '' : 'http://localhost:3000';

// 调试信息
console.log('🚀 API Strategy:', isDevelopment ? 'Using Next.js Proxy' : 'Direct API calls');
console.log('🔗 API Base URL:', `"${API_BASE_URL}"`);
console.log('🌍 Environment:', isDevelopment ? 'development' : 'production');

// 请求配置
const defaultHeaders = {
  'Content-Type': 'application/json',
  'User-Agent': 'Whosee-Client/1.0',
};

// JWT Token 管理
class TokenManager {
  private static token: string | null = null;
  private static tokenExpiry: number = 0;

  static async getToken(): Promise<string> {
    // 检查token是否还有效（提前5秒过期）
    const now = Date.now();
    if (this.token && now < this.tokenExpiry - 5000) {
      return this.token;
    }

    // 获取新token - 参考后端auth.go，获取token时不需要X-API-KEY
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Whosee-Client/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get token: ${response.status}`);
      }

      const data = await response.json();
      this.token = data.token;
      
      // JWT token有效期30秒
      this.tokenExpiry = now + 30 * 1000;
      
      return this.token!
    } catch (error) {
      console.error('获取JWT token失败:', error);
      throw new ApiError(401, '认证失败，无法获取访问令牌');
    }
  }

  static clearToken(): void {
    this.token = null;
    this.tokenExpiry = 0;
  }
}

// 后端API响应格式
interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    timestamp: string;
    cached?: boolean;
    cachedAt?: string;
    processingTimeMs?: number;
    processing?: number;
  };
}

// 后端域名查询响应
interface ApiDomainResponse {
  available: boolean;
  domain: string;
  registrar?: string;
  creationDate?: string;
  expiryDate?: string;
  updatedDate?: string;
  status?: string[];
  nameServers?: string[];
  statusCode?: number;
  statusMessage?: string;
  sourceProvider?: string;
  protocol?: string;
}

// 后端DNS响应（实际格式）
interface ApiDnsResponse {
  CloudflareDNS?: DNSServerResult;
  GoogleDNS?: DNSServerResult;
  '中国DNS'?: DNSServerResult;
  cacheTime?: string;
  isCached?: boolean;
  [key: string]: DNSServerResult | string | boolean | undefined;
}

interface DNSServerResult {
  available: boolean;
  responseTime: number;
  testResults: Array<{
    domain: string;
    ips: string[];
    message: string;
    responseTime: number;
    success: boolean;
    timestamp: string;
  }>;
  testSuccessful: boolean;
}

// 后端健康检查响应
interface ApiHealthResponse {
  status: string;
  version: string;
  time: string;
  services: {
    redis?: {
      status: string;
      latency?: number;
      lastCheck?: string;
    };
    dns?: {
      status: string;
      total?: number;
      available?: number;
      servers?: Array<{
        server: string;
        status: string;
        responseTime?: number;
      }>;
      lastCheck?: string;
    };
    whois?: {
      status: string;
      total?: number;
      available?: number;
      testSuccessful?: number;
      providers?: Record<string, {
        available: boolean;
        testSuccessful: boolean;
        responseTime?: number;
        statusCode?: number;
        callCount?: number;
        lastUsed?: string;
      }>;
      lastCheck?: string;
    };
    screenshot?: {
      status: string;
      total?: number;
      available?: number;
      servers?: Array<{
        service: string;
        status: string;
        mode?: string;
        lastUsed?: string;
      }>;
      lastCheck?: string;
    };
    itdog?: {
      status: string;
      total?: number;
      available?: number;
      servers?: Array<{
        service: string;
        status: string;
        endpoint?: string;
        lastCheck?: string;
      }>;
      lastCheck?: string;
    };
  };
  lastCheck?: string;
}

// 后端截图响应
interface ApiScreenshotResponse {
  domain: string;
  imageUrl?: string;
  imageData?: string;
  status: string;
  title?: string;
  timestamp: string;
}

// 通用错误处理
class ApiError extends Error {
  constructor(public status: number, message: string, public response?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

// 通用请求函数
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 开发环境下打印完整URL，便于调试
  if (process.env.NODE_ENV === 'development') {
    console.log('🌐 Full URL:', `"${url}"`);
    console.log('📍 Base URL:', `"${API_BASE_URL}"`);
    console.log('🛤️ Endpoint:', `"${endpoint}"`);
  }
  
  // 为需要认证的接口添加JWT token
  const needsAuth = !endpoint.includes('/api/health') && !endpoint.includes('/api/auth/token');
  const headers: Record<string, string> = { ...defaultHeaders };
  
  // 合并用户提供的headers
  if (options.headers) {
    Object.assign(headers, options.headers);
  }
  
  if (needsAuth) {
    try {
      const token = await TokenManager.getToken();
      headers['Authorization'] = `Bearer ${token}`;
      
      // 添加X-API-KEY用于IP白名单验证（实际API调用时需要）
      headers['X-API-KEY'] = process.env.NEXT_PUBLIC_API_KEY || 'default-api-key-for-development';
    } catch (error) {
      throw new ApiError(401, '认证失败');
    }
  }

  const config: RequestInit = {
    headers,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // 尝试解析错误响应
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        // 忽略JSON解析错误
      }

      // 如果是认证错误，清除token
      if (response.status === 401) {
        TokenManager.clearToken();
      }

      const errorMessage = errorData.message || errorData.error || 
                          `API请求失败: ${response.status} ${response.statusText}`;
      
      throw new ApiError(response.status, errorMessage, errorData);
    }

    const data = await response.json();
    
    // 检查API响应格式
    if (data.success === false) {
      throw new ApiError(
        response.status,
        data.error || data.message || '请求失败',
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // 网络错误或其他错误
    throw new ApiError(0, `网络错误: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

// 域名 WHOIS 查询
export async function queryDomainInfo(domain: string): Promise<DomainInfo> {
  const response = await apiRequest<ApiResponse<ApiDomainResponse>>(`/api/v1/whois/${encodeURIComponent(domain)}`);
  
  const data = response.data;
  if (!data) {
    throw new ApiError(500, '未收到有效的响应数据');
  }

  // 将后端响应转换为前端格式
  return {
    domain: data.domain,
    available: data.available,
    registrar: data.registrar || '未知',
    status: data.status || [],
    created: data.creationDate || '',
    updated: data.updatedDate || '',
    expires: data.expiryDate || '',
    nameservers: data.nameServers || [],
    sourceProvider: data.sourceProvider,
    protocol: data.protocol,
    // 简化联系人信息（后端暂未提供详细联系人信息）
    contacts: {},
  };
}

// RDAP 查询（新增）
export async function queryRDAPInfo(domain: string): Promise<DomainInfo> {
  const response = await apiRequest<ApiResponse<ApiDomainResponse>>(`/api/v1/rdap/${encodeURIComponent(domain)}`);
  
  const data = response.data;
  if (!data) {
    throw new ApiError(500, '未收到有效的响应数据');
  }

  return {
    domain: data.domain,
    available: data.available,
    registrar: data.registrar || '未知',
    status: data.status || [],
    created: data.creationDate || '',
    updated: data.updatedDate || '',
    expires: data.expiryDate || '',
    nameservers: data.nameServers || [],
    sourceProvider: data.sourceProvider,
    protocol: data.protocol || 'RDAP',
    contacts: {},
  };
}

// DNS 记录查询
export async function queryDNSInfo(domain: string): Promise<DNSInfo> {
  const response = await apiRequest<ApiResponse<ApiDnsResponse>>(`/api/v1/dns/${encodeURIComponent(domain)}`);
  
  const data = response.data;
  if (!data) {
    throw new ApiError(500, '未收到有效的响应数据');
  }

  // 转换DNS服务器测试结果为标准DNS记录格式
  const records: DNSInfo['records'] = {};
  let overallStatus = 'success';
  
  // 从所有DNS服务器的测试结果中提取A记录
  const aRecords: DNSRecord[] = [];
  
  Object.entries(data).forEach(([serverName, serverData]) => {
    if (serverName === 'cacheTime' || serverName === 'isCached') return;
    
    // 类型保护：确保serverData是DNSServerResult类型
    if (serverData && typeof serverData === 'object' && 'testSuccessful' in serverData) {
      const dnsResult = serverData as DNSServerResult;
      
      if (dnsResult.testSuccessful && dnsResult.testResults) {
        dnsResult.testResults.forEach((result: any) => {
          if (result.success && result.ips) {
            result.ips.forEach((ip: string) => {
              // 避免重复IP
              if (!aRecords.find(record => record.value === ip)) {
                aRecords.push({
                  type: 'A',
                  value: ip,
                  ttl: 300, // 默认TTL
                });
              }
            });
          }
        });
      } else {
        overallStatus = 'partial';
      }
    }
  });

  if (aRecords.length > 0) {
    records.A = aRecords;
  } else {
    overallStatus = 'error';
  }

  return {
    domain,
    records,
    status: overallStatus,
    // 添加原始测试结果供前端显示详细信息
    testResults: data,
    cached: data.isCached,
    cacheTime: data.cacheTime,
  };
}

// 健康检查查询
export async function queryHealthInfo(detailed: boolean = false): Promise<HealthInfo> {
  const response = await apiRequest<ApiHealthResponse>(`/api/health${detailed ? '?detailed=true' : ''}`);
  
  return {
    status: response.status,
    version: response.version,
    timestamp: response.time,
    services: response.services,
    lastCheck: response.lastCheck,
  };
}

// 网站截图查询
export async function queryScreenshotInfo(domain: string): Promise<ScreenshotInfo> {
  const response = await apiRequest<ApiResponse<ApiScreenshotResponse>>(`/api/v1/screenshot/${encodeURIComponent(domain)}`);
  
  const data = response.data;
  if (!data) {
    throw new ApiError(500, '未收到有效的响应数据');
  }

  return {
    domain: data.domain,
    imageUrl: data.imageUrl,
    status: data.status,
    title: data.title,
    timestamp: data.timestamp,
  };
}

// Base64截图查询
export async function queryScreenshotBase64(domain: string): Promise<ScreenshotInfo> {
  const response = await apiRequest<{ 
    success: boolean;
    domain: string;
    imageData: string;
    title?: string;
    timestamp: string;
    processingTime?: number;
  }>(`/api/v1/screenshot/base64/${encodeURIComponent(domain)}`);
  
  return {
    domain: response.domain,
    imageData: response.imageData,
    status: response.success ? 'success' : 'error',
    title: response.title,
    timestamp: response.timestamp,
  };
}

// ITDog测速查询
export async function queryITDogInfo(domain: string): Promise<ScreenshotInfo> {
  const response = await apiRequest<ApiResponse<ApiScreenshotResponse>>(`/api/v1/itdog/${encodeURIComponent(domain)}`);
  
  const data = response.data;
  if (!data) {
    throw new ApiError(500, '未收到有效的响应数据');
  }

  return {
    domain: data.domain,
    imageUrl: data.imageUrl,
    status: data.status,
    timestamp: data.timestamp,
  };
}

// ITDog Base64查询
export async function queryITDogBase64(domain: string): Promise<ScreenshotInfo> {
  const response = await apiRequest<{
    success: boolean;
    domain: string;
    imageData: string;
    testResults?: any;
    timestamp: string;
    processingTime?: number;
  }>(`/api/v1/itdog/base64/${encodeURIComponent(domain)}`);
  
  return {
    domain: response.domain,
    imageData: response.imageData,
    status: response.success ? 'success' : 'error',
    timestamp: response.timestamp,
    testResults: response.testResults,
  };
}

// 综合查询（可选择查询类型）
export async function queryDomainAll(domain: string, options: {
  includeWhois?: boolean;
  includeRDAP?: boolean;
  includeDNS?: boolean;
  includeScreenshot?: boolean;
  includeITDog?: boolean;
} = {}) {
  const {
    includeWhois = true,
    includeRDAP = false,
    includeDNS = true,
    includeScreenshot = false,
    includeITDog = false,
  } = options;

  const results: any = {};
  const errors: any = {};

  // 并发执行多个查询
  const promises: Array<Promise<void>> = [];

  if (includeWhois) {
    promises.push(
      queryDomainInfo(domain)
        .then(data => { results.whois = data; })
        .catch(error => { errors.whois = error.message; })
    );
  }

  if (includeRDAP) {
    promises.push(
      queryRDAPInfo(domain)
        .then(data => { results.rdap = data; })
        .catch(error => { errors.rdap = error.message; })
    );
  }

  if (includeDNS) {
    promises.push(
      queryDNSInfo(domain)
        .then(data => { results.dns = data; })
        .catch(error => { errors.dns = error.message; })
    );
  }

  if (includeScreenshot) {
    promises.push(
      queryScreenshotInfo(domain)
        .then(data => { results.screenshot = data; })
        .catch(error => { errors.screenshot = error.message; })
    );
  }

  if (includeITDog) {
    promises.push(
      queryITDogInfo(domain)
        .then(data => { results.itdog = data; })
        .catch(error => { errors.itdog = error.message; })
    );
  }

  await Promise.all(promises);

  return {
    domain,
    results,
    errors,
    timestamp: new Date().toISOString(),
  };
}

// 导出错误类
export { ApiError };

// 导出Token管理器（用于调试）
export { TokenManager }; 