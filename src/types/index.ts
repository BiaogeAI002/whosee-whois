export interface DomainInfo {
  domain: string;
  available: boolean;
  registrar: string;
  status: string[];
  created: string;
  updated: string;
  expires: string;
  nameservers: string[];
  sourceProvider?: string;
  protocol?: string;
  contacts: {
    registrant?: ContactInfo;
    admin?: ContactInfo;
    tech?: ContactInfo;
    billing?: ContactInfo;
  };
}

export interface ContactInfo {
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

export interface DNSRecord {
  type: string;
  value: string;
  ttl?: number;
  priority?: number;
}

export interface DNSInfo {
  domain: string;
  status: string;
  records: {
    A?: DNSRecord[];
    AAAA?: DNSRecord[];
    MX?: DNSRecord[];
    TXT?: DNSRecord[];
    NS?: DNSRecord[];
    CNAME?: DNSRecord[];
    SOA?: DNSRecord[];
    PTR?: DNSRecord[];
  };
  testResults?: any;
  cached?: boolean;
  cacheTime?: string;
}

export interface HealthInfo {
  status: string;
  version?: string;
  timestamp: string;
  services?: {
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

export interface ScreenshotInfo {
  domain: string;
  status: string;
  imageUrl?: string;
  imageData?: string;
  title?: string;
  timestamp: string;
  testResults?: any;
  desktop?: {
    url: string;
    captureTime: string;
    fileSize: number;
  };
  mobile?: {
    url: string;
    captureTime: string;
    fileSize: number;
  };
  tablet?: {
    url: string;
    captureTime: string;
    fileSize: number;
  };
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  meta?: {
    cached?: boolean;
    cachedAt?: string;
    processingTimeMs?: number;
  };
}

export interface SearchResult {
  domain: string;
  available?: boolean;
  domainInfo?: DomainInfo;
  dnsInfo?: DNSInfo;
  healthInfo?: HealthInfo;
  screenshotInfo?: ScreenshotInfo;
}

export type QueryType = 'domain' | 'rdap' | 'dns' | 'health' | 'screenshot' | 'itdog';

export interface QueryState {
  domain: string;
  loading: boolean;
  error: string | null;
  results: {
    domain?: DomainInfo;
    rdap?: DomainInfo;
    dns?: DNSInfo;
    health?: HealthInfo;
    screenshot?: ScreenshotInfo;
    itdog?: ScreenshotInfo;
  };
}

// 新增：API错误接口
export interface ApiErrorResponse {
  error: string;
  message: string;
  timestamp: string;
  path?: string;
}

// 新增：JWT认证相关
export interface AuthTokenResponse {
  token: string;
} 