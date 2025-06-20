import type { DomainInfo, DNSInfo, HealthInfo, ScreenshotInfo } from '@/types';

// API 基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.whosee.me';
const API_VERSION = 'v1';

// 请求配置
const defaultHeaders = {
  'Content-Type': 'application/json',
  'User-Agent': 'Whosee-Client/1.0',
};

// 后端响应接口
interface ApiDomainResponse {
  domain: string;
  registrar?: string;
  status?: string | string[];
  creationDate?: string;
  updatedDate?: string;
  expiryDate?: string;
  nameServers?: string[];
  registrant?: ContactData;
  admin?: ContactData;
  tech?: ContactData;
  billing?: ContactData;
}

interface ContactData {
  name?: string;
  organization?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

interface ApiDnsResponse {
  domain: string;
  records?: {
    A?: DnsRecord[];
    AAAA?: DnsRecord[];
    MX?: MxRecord[];
    TXT?: DnsRecord[];
    NS?: DnsRecord[];
    CNAME?: DnsRecord[];
    SOA?: SoaRecord[];
    PTR?: DnsRecord[];
  };
}

interface DnsRecord {
  value: string;
  ttl?: number;
}

interface MxRecord extends DnsRecord {
  priority?: number;
  exchange?: string;
}

interface SoaRecord extends DnsRecord {
  primary?: string;
  admin?: string;
}

interface ApiHealthResponse {
  domain: string;
  status?: string;
  responseTime?: number;
  httpStatus?: number;
  sslStatus?: string;
  sslExpiry?: string;
  lastCheck?: string;
  ip?: string;
  location?: {
    country?: string;
    city?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

interface ApiScreenshotResponse {
  domain: string;
  desktop?: ScreenshotData;
  mobile?: ScreenshotData;
  tablet?: ScreenshotData;
}

interface ScreenshotData {
  url: string;
  captureTime?: string;
  fileSize?: number;
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
  const url = `${API_BASE_URL}/${API_VERSION}${endpoint}`;
  
  const config: RequestInit = {
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || `API request failed: ${response.status} ${response.statusText}`,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // 网络错误或其他错误
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// 域名 WHOIS 查询
export async function queryDomainInfo(domain: string): Promise<DomainInfo> {
  const response = await apiRequest<ApiDomainResponse>(`/whois?domain=${encodeURIComponent(domain)}`);
  
  // 将后端响应转换为前端格式
  return {
    domain: response.domain,
    registrar: response.registrar || 'Unknown',
    status: Array.isArray(response.status) ? response.status : [response.status].filter((s): s is string => Boolean(s)),
    created: response.creationDate || '',
    updated: response.updatedDate || '',
    expires: response.expiryDate || '',
    nameservers: response.nameServers || [],
    contacts: {
      registrant: response.registrant ? {
        name: response.registrant.name || '',
        organization: response.registrant.organization || '',
        email: response.registrant.email || '',
        phone: response.registrant.phone || '',
        address: response.registrant.address || '',
        city: response.registrant.city || '',
        state: response.registrant.state || '',
        country: response.registrant.country || '',
        postalCode: response.registrant.postalCode || '',
      } : undefined,
      admin: response.admin ? {
        name: response.admin.name || '',
        organization: response.admin.organization || '',
        email: response.admin.email || '',
        phone: response.admin.phone || '',
        address: response.admin.address || '',
        city: response.admin.city || '',
        state: response.admin.state || '',
        country: response.admin.country || '',
        postalCode: response.admin.postalCode || '',
      } : undefined,
      tech: response.tech ? {
        name: response.tech.name || '',
        organization: response.tech.organization || '',
        email: response.tech.email || '',
        phone: response.tech.phone || '',
        address: response.tech.address || '',
        city: response.tech.city || '',
        state: response.tech.state || '',
        country: response.tech.country || '',
        postalCode: response.tech.postalCode || '',
      } : undefined,
      billing: response.billing ? {
        name: response.billing.name || '',
        organization: response.billing.organization || '',
        email: response.billing.email || '',
        phone: response.billing.phone || '',
        address: response.billing.address || '',
        city: response.billing.city || '',
        state: response.billing.state || '',
        country: response.billing.country || '',
        postalCode: response.billing.postalCode || '',
      } : undefined,
    },
  };
}

// DNS 记录查询
export async function queryDNSInfo(domain: string): Promise<DNSInfo> {
  const response = await apiRequest<ApiDnsResponse>(`/dns?domain=${encodeURIComponent(domain)}`);
  
  return {
    domain: response.domain,
    records: {
      A: response.records?.A?.map((record) => ({
        type: 'A',
        value: record.value,
        ttl: record.ttl,
      })) || [],
      AAAA: response.records?.AAAA?.map((record) => ({
        type: 'AAAA',
        value: record.value,
        ttl: record.ttl,
      })) || [],
      MX: response.records?.MX?.map((record) => ({
        type: 'MX',
        value: record.value || record.exchange || '',
        ttl: record.ttl,
        priority: record.priority,
      })) || [],
      TXT: response.records?.TXT?.map((record) => ({
        type: 'TXT',
        value: record.value,
        ttl: record.ttl,
      })) || [],
      NS: response.records?.NS?.map((record) => ({
        type: 'NS',
        value: record.value,
        ttl: record.ttl,
      })) || [],
      CNAME: response.records?.CNAME?.map((record) => ({
        type: 'CNAME',
        value: record.value,
        ttl: record.ttl,
      })) || [],
      SOA: response.records?.SOA?.map((record) => ({
        type: 'SOA',
        value: record.value || `${record.primary} ${record.admin}` || '',
        ttl: record.ttl,
      })) || [],
      PTR: response.records?.PTR?.map((record) => ({
        type: 'PTR',
        value: record.value,
        ttl: record.ttl,
      })) || [],
    },
  };
}

// 健康检查
export async function queryHealthInfo(domain: string): Promise<HealthInfo> {
  const response = await apiRequest<ApiHealthResponse>(`/health?domain=${encodeURIComponent(domain)}`);
  
  return {
    domain: response.domain,
    status: response.status === 'online' ? 'online' : 'offline',
    responseTime: response.responseTime || 0,
    httpStatus: response.httpStatus || 0,
    sslStatus: (response.sslStatus === 'valid' || response.sslStatus === 'invalid') ? response.sslStatus : 'none',
    sslExpiry: response.sslExpiry,
    lastCheck: response.lastCheck || new Date().toISOString(),
    ip: response.ip,
    location: response.location ? {
      country: response.location.country,
      city: response.location.city,
      coordinates: response.location.coordinates ? {
        lat: response.location.coordinates.lat,
        lng: response.location.coordinates.lng,
      } : undefined,
    } : undefined,
  };
}

// 网站截图
export async function queryScreenshotInfo(domain: string): Promise<ScreenshotInfo> {
  const response = await apiRequest<ApiScreenshotResponse>(`/screenshot?domain=${encodeURIComponent(domain)}`);
  
  return {
    domain: response.domain,
    desktop: response.desktop ? {
      url: response.desktop.url,
      captureTime: response.desktop.captureTime || new Date().toISOString(),
      fileSize: response.desktop.fileSize || 0,
    } : undefined,
    mobile: response.mobile ? {
      url: response.mobile.url,
      captureTime: response.mobile.captureTime || new Date().toISOString(),
      fileSize: response.mobile.fileSize || 0,
    } : undefined,
    tablet: response.tablet ? {
      url: response.tablet.url,
      captureTime: response.tablet.captureTime || new Date().toISOString(),
      fileSize: response.tablet.fileSize || 0,
    } : undefined,
  };
}

// 批量查询（支持多种类型的查询）
export async function queryDomainAll(domain: string) {
  const requests = [
    queryDomainInfo(domain).catch(err => ({ error: err.message, type: 'domain' })),
    queryDNSInfo(domain).catch(err => ({ error: err.message, type: 'dns' })),
    queryHealthInfo(domain).catch(err => ({ error: err.message, type: 'health' })),
    queryScreenshotInfo(domain).catch(err => ({ error: err.message, type: 'screenshot' })),
  ];

  const [domainInfo, dnsInfo, healthInfo, screenshotInfo] = await Promise.all(requests);

  return {
    domain,
    domainInfo: 'error' in domainInfo ? null : domainInfo,
    dnsInfo: 'error' in dnsInfo ? null : dnsInfo,
    healthInfo: 'error' in healthInfo ? null : healthInfo,
    screenshotInfo: 'error' in screenshotInfo ? null : screenshotInfo,
    errors: [domainInfo, dnsInfo, healthInfo, screenshotInfo]
      .filter((result): result is { error: string; type: string } => 'error' in result)
      .reduce((acc, { type, error }) => ({ ...acc, [type]: error }), {}),
  };
}

// 导出错误类
export { ApiError }; 