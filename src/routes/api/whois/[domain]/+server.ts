/**
 * WHOIS API路由处理程序
 * 处理域名WHOIS查询请求
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

/**
 * GET 处理程序 - 处理WHOIS查询请求
 */
export const GET: RequestHandler = async ({ params }) => {
  try {
    const { domain } = params;
    
    if (!domain) {
      console.log('WHOIS查询: 缺少域名参数');
      return json({ error: '缺少域名参数' }, { status: 400 });
    }
    
    console.log(`WHOIS查询: 开始查询域名 ${domain}`);
    
    // 先获取临时token，然后再调用WHOIS查询API
    // 获取临时token
    const tokenResponse = await fetch(`${env.API_ENDPOINT.replace('/query', '')}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!tokenResponse.ok) {
      throw new Error(`获取临时token失败: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }
    
    const tokenData = await tokenResponse.json();
    const tempToken = tokenData.token;
    
    // 使用临时token调用后端API进行WHOIS查询
    const response = await fetch(env.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tempToken}`
      },
      body: JSON.stringify({ domain })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const whoisData = await response.json();
    console.log(`WHOIS查询: 完成查询域名 ${domain}`);
    return json(whoisData);
  } catch (error) {
    console.error('WHOIS查询处理错误:', error);
    return json({ error: '服务器内部错误' }, { status: 500 });
  }
};