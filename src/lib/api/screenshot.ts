/**
 * Whosee.me - 截图 API Service
 * 提供域名测速截图功能
 */

// 导入认证相关函数
import { authenticatedFetch } from './auth';
import { config } from '$lib/config';

// 截图查询结果接口
export interface ScreenshotResult {
  success: boolean;
  imageUrl?: string;
  fromCache?: boolean;
  error?: string;
  message?: string;
}

// 元素截图请求接口
export interface ElementScreenshotRequest {
  url: string;
  selector: string;
  wait?: number; // 等待时间（秒）
}

/**
 * 获取域名测速截图
 * @param domain 要查询的域名
 * @returns 截图查询结果
 */
export async function getScreenshot(domain: string): Promise<ScreenshotResult> {
  try {
    console.log(`开始获取域名截图: ${domain}`);
    const startTime = Date.now();
    
    // 构建API URL - 使用配置的API端点
    const apiUrl = `${config.api.baseUrl}/api/screenshot/${domain}`;
    console.log(`请求截图API: ${apiUrl}`);
    
    // 使用认证的fetch请求
    const response = await authenticatedFetch(apiUrl, {}, true);
    const duration = Date.now() - startTime;
    
    // 检查响应状态
    if (!response.ok) {
      console.error(`截图API请求失败: HTTP ${response.status} ${response.statusText}`);
      
      // 尝试解析错误响应
      try {
        const errorData = await response.json();
        console.error('截图API错误详情:', errorData);
        
        // 即使是500错误，也尝试使用后端返回的错误信息
        if (errorData && (errorData.error || errorData.message)) {
          return {
            success: false,
            error: errorData.error || '截图生成失败',
            message: errorData.message
          };
        }
        
        throw new Error(errorData.error || `截图生成失败: ${response.status} ${response.statusText}`);
      } catch (parseError) {
        // 如果无法解析JSON，返回原始错误
        throw new Error(`截图生成失败: ${response.status} ${response.statusText}`);
      }
    }
    
    // 解析响应数据
    let data: ScreenshotResult;
    try {
      const textData = await response.text();
      console.log('截图API原始响应:', textData);
      data = JSON.parse(textData);
      
      // 处理相对路径的图片URL，转换为完整URL
      if (data.success && data.imageUrl && data.imageUrl.startsWith('/')) {
        // 提取API基础URL的域名部分 (协议://主机名:端口)
        const baseUrlParts = config.api.baseUrl.split('/');
        const baseUrlDomain = baseUrlParts.slice(0, 3).join('/');
        data.imageUrl = `${baseUrlDomain}${data.imageUrl}`;
        console.log('截图URL已转换为完整路径:', data.imageUrl);
      }
    } catch (parseError) {
      console.error('截图API响应解析失败:', parseError);
      throw new Error('无法解析API响应');
    }
    
    // 打印后端返回的原始数据，用于调试
    console.log(`截图API请求完成，耗时: ${duration}ms`);
    console.log('截图API返回数据:', data);
    
    return data;
  } catch (error) {
    console.error('截图请求错误:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

/**
 * 获取itdog测速截图
 * @param domain 要查询的域名
 * @returns 截图查询结果
 */
export async function getItdogScreenshot(domain: string): Promise<ScreenshotResult> {
  try {
    console.log(`开始获取itdog测速截图: ${domain}`);
    const startTime = Date.now();
    
    // 构建API URL - 使用配置的API端点
    const apiUrl = `${config.api.baseUrl}/api/screenshot/itdog/${domain}`;
    console.log(`请求itdog测速截图API: ${apiUrl}`);
    
    // 使用认证的fetch请求
    const response = await authenticatedFetch(apiUrl, {}, true);
    const duration = Date.now() - startTime;
    
    // 检查响应状态
    if (!response.ok) {
      console.error(`itdog测速截图API请求失败: HTTP ${response.status} ${response.statusText}`);
      
      // 尝试解析错误响应
      try {
        const errorData = await response.json();
        console.error('itdog测速截图API错误详情:', errorData);
        
        // 即使是500错误，也尝试使用后端返回的错误信息
        if (errorData && (errorData.error || errorData.message)) {
          return {
            success: false,
            error: errorData.error || 'itdog测速截图生成失败',
            message: errorData.message
          };
        }
        
        throw new Error(errorData.error || `itdog测速截图生成失败: ${response.status} ${response.statusText}`);
      } catch (parseError) {
        // 如果无法解析JSON，返回原始错误
        throw new Error(`itdog测速截图生成失败: ${response.status} ${response.statusText}`);
      }
    }
    
    // 解析响应数据
    let data: ScreenshotResult;
    try {
      const textData = await response.text();
      console.log('itdog测速截图API原始响应:', textData);
      data = JSON.parse(textData);
      
      // 处理相对路径的图片URL，转换为完整URL
      if (data.success && data.imageUrl && data.imageUrl.startsWith('/')) {
        // 提取API基础URL的域名部分 (协议://主机名:端口)
        const baseUrlParts = config.api.baseUrl.split('/');
        const baseUrlDomain = baseUrlParts.slice(0, 3).join('/');
        data.imageUrl = `${baseUrlDomain}${data.imageUrl}`;
        console.log('itdog测速截图URL已转换为完整路径:', data.imageUrl);
      }
    } catch (parseError) {
      console.error('itdog测速截图API响应解析失败:', parseError);
      throw new Error('无法解析API响应');
    }
    
    // 打印后端返回的原始数据，用于调试
    console.log(`itdog测速截图API请求完成，耗时: ${duration}ms`);
    console.log('itdog测速截图API返回数据:', data);
    
    return data;
  } catch (error) {
    console.error('itdog测速截图请求错误:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

/**
 * 获取itdog测速截图(Base64格式)
 * @param domain 要查询的域名
 * @returns 截图查询结果，包含Base64编码的图片数据
 */
export async function getItdogScreenshotBase64(domain: string): Promise<ScreenshotResult> {
  try {
    console.log(`开始获取itdog测速截图(Base64): ${domain}`);
    const startTime = Date.now();
    
    // 构建API URL - 使用配置的API端点
    const apiUrl = `${config.api.baseUrl}/api/screenshot/itdog/base64/${domain}`;
    console.log(`请求itdog测速截图(Base64)API: ${apiUrl}`);
    
    // 使用认证的fetch请求
    const response = await authenticatedFetch(apiUrl, {}, true);
    const duration = Date.now() - startTime;
    
    // 检查响应状态
    if (!response.ok) {
      console.error(`itdog测速截图(Base64)API请求失败: HTTP ${response.status} ${response.statusText}`);
      
      // 尝试解析错误响应
      try {
        const errorData = await response.json();
        console.error('itdog测速截图(Base64)API错误详情:', errorData);
        
        // 即使是500错误，也尝试使用后端返回的错误信息
        if (errorData && (errorData.error || errorData.message)) {
          return {
            success: false,
            error: errorData.error || 'itdog测速截图(Base64)生成失败',
            message: errorData.message
          };
        }
        
        throw new Error(errorData.error || `itdog测速截图(Base64)生成失败: ${response.status} ${response.statusText}`);
      } catch (parseError) {
        // 如果无法解析JSON，返回原始错误
        throw new Error(`itdog测速截图(Base64)生成失败: ${response.status} ${response.statusText}`);
      }
    }
    
    // 解析响应数据
    let data: ScreenshotResult;
    try {
      const textData = await response.text();
      console.log('itdog测速截图(Base64)API原始响应:', textData.substring(0, 100) + '...');
      data = JSON.parse(textData);
      
      // 注意：Base64格式不需要处理相对路径问题，因为数据直接包含在响应中
    } catch (parseError) {
      console.error('itdog测速截图(Base64)API响应解析失败:', parseError);
      throw new Error('无法解析API响应');
    }
    
    // 打印后端返回的原始数据，用于调试
    console.log(`itdog测速截图(Base64)API请求完成，耗时: ${duration}ms`);
    console.log('itdog测速截图(Base64)API返回数据:', data);
    
    return data;
  } catch (error) {
    console.error('itdog测速截图(Base64)请求错误:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

/**
 * 获取网页元素截图
 * @param request 元素截图请求参数
 * @returns 截图查询结果
 */
export async function getElementScreenshot(request: ElementScreenshotRequest): Promise<ScreenshotResult> {
  try {
    console.log(`开始获取元素截图: ${request.url}, 选择器: ${request.selector}`);
    const startTime = Date.now();
    
    // 构建API URL - 使用配置的API端点
    const apiUrl = `${config.api.baseUrl}/api/screenshot/element`;
    console.log(`请求元素截图API: ${apiUrl}`);
    
    // 使用认证的fetch请求
    const response = await authenticatedFetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }, true);
    const duration = Date.now() - startTime;
    
    // 检查响应状态
    if (!response.ok) {
      console.error(`元素截图API请求失败: HTTP ${response.status} ${response.statusText}`);
      
      // 尝试解析错误响应
      try {
        const errorData = await response.json();
        console.error('元素截图API错误详情:', errorData);
        
        // 即使是500错误，也尝试使用后端返回的错误信息
        if (errorData && (errorData.error || errorData.message)) {
          return {
            success: false,
            error: errorData.error || '元素截图生成失败',
            message: errorData.message
          };
        }
        
        throw new Error(errorData.error || `元素截图生成失败: ${response.status} ${response.statusText}`);
      } catch (parseError) {
        // 如果无法解析JSON，返回原始错误
        throw new Error(`元素截图生成失败: ${response.status} ${response.statusText}`);
      }
    }
    
    // 解析响应数据
    let data: ScreenshotResult;
    try {
      const textData = await response.text();
      console.log('元素截图API原始响应:', textData);
      data = JSON.parse(textData);
      
      // 处理相对路径的图片URL，转换为完整URL
      if (data.success && data.imageUrl && data.imageUrl.startsWith('/')) {
        // 提取API基础URL的域名部分 (协议://主机名:端口)
        const baseUrlParts = config.api.baseUrl.split('/');
        const baseUrlDomain = baseUrlParts.slice(0, 3).join('/');
        data.imageUrl = `${baseUrlDomain}${data.imageUrl}`;
        console.log('元素截图URL已转换为完整路径:', data.imageUrl);
      }
    } catch (parseError) {
      console.error('元素截图API响应解析失败:', parseError);
      throw new Error('无法解析API响应');
    }
    
    // 打印后端返回的原始数据，用于调试
    console.log(`元素截图API请求完成，耗时: ${duration}ms`);
    console.log('元素截图API返回数据:', data);
    
    return data;
  } catch (error) {
    console.error('元素截图请求错误:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

/**
 * 获取Base64编码的元素截图
 * @param request 元素截图请求参数
 * @returns 截图查询结果，包含Base64编码的图片数据
 */
export async function getElementScreenshotBase64(request: ElementScreenshotRequest): Promise<ScreenshotResult> {
  try {
    console.log(`开始获取Base64元素截图: ${request.url}, 选择器: ${request.selector}`);
    const startTime = Date.now();
    
    // 构建API URL - 使用配置的API端点
    const apiUrl = `${config.api.baseUrl}/api/screenshot/element/base64`;
    console.log(`请求Base64元素截图API: ${apiUrl}`);
    
    // 使用认证的fetch请求
    const response = await authenticatedFetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }, true);
    const duration = Date.now() - startTime;
    
    // 检查响应状态
    if (!response.ok) {
      console.error(`Base64元素截图API请求失败: HTTP ${response.status} ${response.statusText}`);
      
      // 尝试解析错误响应
      try {
        const errorData = await response.json();
        console.error('Base64元素截图API错误详情:', errorData);
        
        // 即使是500错误，也尝试使用后端返回的错误信息
        if (errorData && (errorData.error || errorData.message)) {
          return {
            success: false,
            error: errorData.error || 'Base64元素截图生成失败',
            message: errorData.message
          };
        }
        
        throw new Error(errorData.error || `Base64元素截图生成失败: ${response.status} ${response.statusText}`);
      } catch (parseError) {
        // 如果无法解析JSON，返回原始错误
        throw new Error(`Base64元素截图生成失败: ${response.status} ${response.statusText}`);
      }
    }
    
    // 解析响应数据
    let data: ScreenshotResult;
    try {
      const textData = await response.text();
      console.log('Base64元素截图API原始响应:', textData.substring(0, 100) + '...');
      data = JSON.parse(textData);
      
      // 注意：Base64格式不需要处理相对路径问题，因为数据直接包含在响应中
    } catch (parseError) {
      console.error('Base64元素截图API响应解析失败:', parseError);
      throw new Error('无法解析API响应');
    }
    
    // 打印后端返回的原始数据，用于调试
    console.log(`Base64元素截图API请求完成，耗时: ${duration}ms`);
    console.log('Base64元素截图API返回数据:', data);
    
    return data;
  } catch (error) {
    console.error('Base64元素截图请求错误:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}