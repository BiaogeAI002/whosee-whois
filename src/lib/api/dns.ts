/**
 * Whosee.me - DNS API Service
 * 提供域名DNS记录查询功能
 */

// DNS记录接口
export interface DNSRecord {
  type: string;
  value: string;
  priority?: number;
}

// DNS查询结果接口
export interface DNSResult {
  domain: string;
  records: DNSRecord[];
  queryTime: string;
  isCached: boolean;
  cacheTime: string | null;
  queryDuration?: number;
  loading?: boolean;
  error?: any;
}

import { authenticatedFetch } from './auth';
import { config } from '$lib/config';

/**
 * 查询域名DNS记录
 * @param domain 要查询的域名
 * @returns DNS查询结果
 */
export async function queryDNS(domain: string): Promise<DNSResult> {
  try {
    const startTime = Date.now();
    // 使用认证的API端点，并获取全新令牌
    // 修复URL格式，确保问号正确添加
    const url = new URL(config.api.endpoints.dns);
    url.searchParams.append('domain', domain);
    console.log('DNS查询URL:', url.toString());
    
    const response = await authenticatedFetch(url.toString(), {}, true);
    const endTime = Date.now();
    const queryDuration = endTime - startTime;
    
    if (!response.ok) {
      throw new Error(`查询失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 获取缓存状态
    const xCacheHeader = response.headers.get('X-Cache');
    console.log('DNS查询 - X-Cache响应头:', xCacheHeader);
    
    // 修改缓存状态判断逻辑
    let fromCache = false;
    
    // 优先使用响应体中的is_cached字段
    if (data.is_cached === true) {
      fromCache = true;
      console.log('DNS查询 - 使用响应体中的is_cached字段判断缓存状态: true');
    } 
    // 如果响应体中没有is_cached字段，则使用HTTP头
    else if (xCacheHeader === 'HIT') {
      fromCache = true;
      console.log('DNS查询 - 使用HTTP头X-Cache判断缓存状态: HIT');
    } else {
      console.log('DNS查询 - 缓存状态判断结果: 未缓存');
      console.log('- data.is_cached:', data.is_cached);
      console.log('- X-Cache:', xCacheHeader);
    }
    
    // 构建结果对象
    const result: DNSResult = {
      domain: data.domain,
      records: data.records || [],
      queryTime: data.query_time || new Date().toLocaleString('zh-CN'),
      isCached: fromCache,
      cacheTime: fromCache ? data.cache_time : null,
      queryDuration: queryDuration,
      loading: false,
      error: null
    };
    
    // 添加详细的日志记录，帮助调试
    console.log('DNS查询结果:', {
      '域名': domain,
      '响应状态': response.status,
      '响应头': {
        'X-Cache': xCacheHeader,
        '所有响应头': Array.from(response.headers.entries()).reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {} as Record<string, string>)
      },
      '原始数据': data,
      'data.is_cached值': data.is_cached,
      'fromCache值': fromCache,
      '记录数量': data.records?.length || 0,
      '记录详情': data.records || []
    });
    
    return result;
  } catch (error) {
    // 记录错误但不显示在控制台
    throw error;
  }
}
