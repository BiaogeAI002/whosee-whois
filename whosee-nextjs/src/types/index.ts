export interface DomainInfo {
  domain: string;
  registrar: string;
  status: string[];
  created: string;
  updated: string;
  expires: string;
  nameservers: string[];
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
}

export interface HealthInfo {
  domain: string;
  status: 'online' | 'offline';
  responseTime: number;
  httpStatus: number;
  sslStatus: 'valid' | 'invalid' | 'none';
  sslExpiry?: string;
  lastCheck: string;
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

export interface ScreenshotInfo {
  domain: string;
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
  timestamp: string;
}

export interface SearchResult {
  domain: string;
  available: boolean;
  domainInfo?: DomainInfo;
  dnsInfo?: DNSInfo;
  healthInfo?: HealthInfo;
  screenshotInfo?: ScreenshotInfo;
}

export type QueryType = 'domain' | 'dns' | 'health' | 'screenshot';

export interface QueryState {
  domain: string;
  loading: boolean;
  error: string | null;
  results: {
    domain?: DomainInfo;
    dns?: DNSInfo;
    health?: HealthInfo;
    screenshot?: ScreenshotInfo;
  };
} 