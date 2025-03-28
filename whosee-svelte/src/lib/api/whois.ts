/**
 * Whosee.me - WHOIS API Service
 * 提供域名WHOIS信息查询功能
 */

// WHOIS查询结果接口
export interface WhoisResult {
  domain: string;
  registered: boolean;
  creationDate: string | null;
  expiryDate: string | null; // 修改为与服务器端一致的字段名
  registrar: string | null;
  nameServers: string[];
  status: string[];
  lastUpdated: string | null;
  registrant?: {
    name?: string;
    organization?: string;
    email?: string;
    country?: string;
  };
  admin?: {
    email?: string;
  };
  tech?: {
    email?: string;
  };
}

/**
 * 查询域名WHOIS信息
 * @param domain 要查询的域名
 * @returns WHOIS查询结果
 */
export async function queryWhois(domain: string): Promise<WhoisResult> {
  try {
    const response = await fetch(`/api/whois/${domain}`);
    
    if (!response.ok) {
      throw new Error(`查询失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 打印后端返回的原始数据，用于调试
    console.log('后端返回的原始WHOIS数据:', JSON.stringify(data, null, 2));
    
    // 映射后端返回的字段到前端期望的格式
    return {
      domain: data.domain,
      registered: !data.available, // 转换available到registered（值相反）
      creationDate: data.creationDate,
      expiryDate: data.expiryDate, // 直接使用expiryDate字段
      registrar: data.registrar,
      nameServers: data.nameServers || [],
      status: data.status || [],
      lastUpdated: data.updatedDate, // 映射updatedDate到lastUpdated
      registrant: data.registrant,
      admin: data.admin,
      tech: data.tech
    };
  } catch (error) {
    console.error('WHOIS查询错误:', error);
    throw error;
  }
}