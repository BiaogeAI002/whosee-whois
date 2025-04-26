/**
 * Whosee.me - Health API Service
 * 提供系统健康状态检查功能
 */

import { authenticatedFetch } from './auth';
import { config } from '$lib/config';

// 健康检查结果接口
export interface HealthResult {
  status: string;
  version?: string;
  uptime?: number;
  memoryUsage?: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  // 其他健康信息字段
  [key: string]: any;
}

/**
 * 检查系统健康状态（基本）
 * @returns 健康检查结果
 */
export async function checkHealth(): Promise<HealthResult> {
  try {
    const startTime = Date.now();
    const endpoint = config.api.endpoints.health;
    console.log(`检查健康状态: ${endpoint}`);
    
    const response = await authenticatedFetch(endpoint);
    const endTime = Date.now();
    const queryDuration = endTime - startTime;
    
    if (!response.ok) {
      throw new Error(`健康检查失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      ...data,
      queryTime: new Date().toISOString(),
      queryDuration
    };
  } catch (error) {
    console.error('健康检查错误:', error);
    throw error;
  }
}

/**
 * 检查系统详细健康状态
 * @returns 详细健康检查结果
 */
export async function checkDetailedHealth(): Promise<HealthResult> {
  try {
    const startTime = Date.now();
    const endpoint = `${config.api.endpoints.health}?detailed=true`;
    console.log(`检查详细健康状态: ${endpoint}`);
    
    const response = await authenticatedFetch(endpoint);
    const endTime = Date.now();
    const queryDuration = endTime - startTime;
    
    if (!response.ok) {
      throw new Error(`详细健康检查失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      ...data,
      queryTime: new Date().toISOString(),
      queryDuration
    };
  } catch (error) {
    console.error('详细健康检查错误:', error);
    throw error;
  }
}
