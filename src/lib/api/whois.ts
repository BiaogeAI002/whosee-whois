/**
 * Whosee.me - WHOIS API Service
 * 提供域名WHOIS信息查询功能
 */

import { authenticatedFetch } from './auth';
import { config } from '$lib/config';

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
  // 查询元数据
  queryTime?: string;
  queryDuration?: number;
  fromCache?: boolean;
  cacheTime?: string | null;
}

/**
 * 查询域名WHOIS信息
 * @param domain 要查询的域名
 * @returns WHOIS查询结果
 */
export async function queryWhois(domain: string): Promise<WhoisResult> {
  try {
    const startTime = Date.now();
    // 使用全新令牌进行认证
    const response = await authenticatedFetch(`${config.api.endpoints.whois}?domain=${encodeURIComponent(domain)}`, {}, true);
    const endTime = Date.now();
    const queryDuration = endTime - startTime;
    
    if (!response.ok) {
      throw new Error(`查询失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 获取缓存状态
    const xCacheHeader = response.headers.get('X-Cache');
    console.log('X-Cache响应头:', xCacheHeader); // 添加单独的日志
    
    // 修改缓存状态判断逻辑
    let fromCache = false;
    
    // 优先使用响应体中的isCached字段
    if (data.isCached === true) {
      fromCache = true;
      console.log('使用响应体中的isCached字段判断缓存状态: true');
    } 
    // 如果响应体中没有isCached字段，则使用HTTP头
    else if (xCacheHeader === 'HIT') {
      fromCache = true;
      console.log('使用HTTP头X-Cache判断缓存状态: HIT');
    } else {
      console.log('缓存状态判断结果: 未缓存');
      console.log('- data.isCached:', data.isCached);
      console.log('- X-Cache:', xCacheHeader);
    }
    
    // 映射后端返回的字段到前端期望的格式
    const result: WhoisResult = {
      domain: data.domain,
      registered: !data.available, // 修改这里：后端使用available字段，前端使用registered字段
      creationDate: data.creationDate || null, // 修复：直接使用creationDate
      expiryDate: data.expiryDate || null,
      registrar: data.registrar || null,
      nameServers: data.nameServers || [],
      status: Array.isArray(data.status) ? data.status : [data.status].filter(Boolean), // 确保status始终是数组
      lastUpdated: data.updatedDate || null, // 修复：使用updatedDate字段
      registrant: data.registrant,
      admin: data.admin,
      tech: data.tech,
      // 使用本地时间格式而非ISO格式的UTC时间
      queryTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }),
      queryDuration,
      // 使用修改后的缓存状态判断结果
      fromCache: fromCache,
      cacheTime: data.cacheTime || null
    };
    
    // 添加详细的日志记录，帮助调试
    console.log('WHOIS查询原始响应:', {
      '域名': domain,
      '响应状态': response.status,
      '响应头': {
        'X-Cache': xCacheHeader,
        'Content-Type': response.headers.get('Content-Type'),
        '所有响应头': Array.from(response.headers.entries()).reduce<Record<string, string>>((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {})
      },
      '原始数据': data,
      'data.isCached类型': typeof data.isCached,
      'data.isCached值': data.isCached,
      'fromCache值': fromCache
    });
    
    // 添加详细的日志记录，帮助调试
    console.log('WHOIS查询结果处理:', {
      '域名': domain,
      '原始数据': data,
      '处理后数据': result,
      'HTTP头': {
        'X-Cache': xCacheHeader
      },
      '缓存状态': {
        'data.isCached类型': typeof data.isCached,
        'data.isCached值': data.isCached,
        'fromCache(HTTP头)': fromCache,
        '最终fromCache': result.fromCache,
        '判断表达式': `${data.isCached === true} || ${fromCache === true} = ${data.isCached === true || fromCache === true}`
      }
    });
    
    return result;
  } catch (error) {
    // 记录错误但不显示在控制台
    throw error;
  }
}

/**
 * 根据域名状态获取缓存时间描述
 * @param domain 域名
 * @returns 缓存时间描述
 */
function getCacheTimeString(domain: string): string {
  // 这里简化处理，实际应该从服务端获取
  // 已注册域名缓存30天，未注册域名缓存7天
  return '最长30天';
}