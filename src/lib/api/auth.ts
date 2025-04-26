/**
 * 认证服务
 * 用于获取和管理API访问令牌
 */
import { config } from '$lib/config';

// 存储令牌信息
interface TokenInfo {
  token: string;
  expiresAt: number; // 过期时间戳
}

// 缓存的令牌
let cachedToken: TokenInfo | null = null;

/**
 * 获取访问令牌
 * 如果有缓存的有效令牌，则返回缓存的令牌
 * 否则，从服务器获取新令牌
 */
export async function getToken(): Promise<string> {
  // 检查是否有缓存的有效令牌
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    // 使用缓存的令牌
    return cachedToken.token;
  }

  // 获取新令牌
  try {
    // 从服务器获取新令牌
    const response = await fetch(config.api.endpoints.token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`获取令牌失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // 解析JWT令牌以获取过期时间
    // 令牌格式: header.payload.signature
    const payload = JSON.parse(atob(data.token.split('.')[1]));
    const expiresAt = payload.exp * 1000; // 转换为毫秒
    
    // 缓存令牌，提前5秒过期以确保安全
    cachedToken = {
      token: data.token,
      expiresAt: expiresAt - 5000
    };
    
    return data.token;
  } catch (error) {
    throw error;
  }
}

/**
 * 获取新的访问令牌（不使用缓存）
 * 每次调用都会从服务器获取新令牌
 */
export async function getFreshToken(): Promise<string> {
  try {
    // 获取全新令牌
    const response = await fetch(config.api.endpoints.token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`获取令牌失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    throw error;
  }
}

/**
 * 创建带有认证头的fetch请求
 * @param url 请求URL
 * @param options 请求选项
 * @param useFreshToken 是否使用全新令牌（不使用缓存）
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}, useFreshToken: boolean = false): Promise<Response> {
  const token = useFreshToken ? await getFreshToken() : await getToken();
  
  // 合并headers
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  
  // 返回fetch请求
  return fetch(url, {
    ...options,
    headers
  });
}
