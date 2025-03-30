/**
 * Whosee.me - 截图 API Service
 * 提供域名测速截图功能
 */

// 截图查询结果接口
export interface ScreenshotResult {
  success: boolean;
  imageUrl?: string;
  fromCache?: boolean;
  error?: string;
  message?: string;
}

/**
 * 获取域名测速截图
 * @param domain 要查询的域名
 * @returns 截图查询结果
 */
export async function getScreenshot(domain: string): Promise<ScreenshotResult> {
  try {
    const startTime = Date.now();
    const response = await fetch(`/api/screenshot/${domain}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `截图生成失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 打印后端返回的原始数据，用于调试
    console.log('截图API返回数据:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('截图请求错误:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}