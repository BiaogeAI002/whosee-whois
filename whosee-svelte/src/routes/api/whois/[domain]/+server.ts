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
    
    const apiEndpoint = env.API_ENDPOINT || 'http://localhost:3000/api/query';
    console.log(`WHOIS查询: 开始查询域名 ${domain}`);
    console.log(`API端点: ${apiEndpoint}`);
    
    // 调用后端API进行WHOIS查询
    const requestBody = { domain };
    console.log('请求参数:', JSON.stringify(requestBody));
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.API_TOKEN}`
      },
      body: JSON.stringify(requestBody)
    }).catch(error => {
      console.error('网络请求错误:', error.message);
      if (error.cause) {
        console.error('错误原因:', error.cause.code);
        console.error('详细错误:', error.cause.errors);
      }
      throw error;
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API请求失败: 状态码 ${response.status}, 响应内容:`, errorText);
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const whoisData = await response.json();
    console.log(`WHOIS查询: 完成查询域名 ${domain}`);
    console.log('API响应数据:', JSON.stringify(whoisData, null, 2));
    return json(whoisData);
  } catch (error) {
    console.error('WHOIS查询处理错误:', error);
    return json({ error: '服务器内部错误' }, { status: 500 });
  }
};