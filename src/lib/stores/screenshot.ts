import { writable } from 'svelte/store';
import { getScreenshot } from '$lib/api';
import type { ScreenshotResult } from '$lib/api';

export interface ScreenshotInfo extends ScreenshotResult {
  loading?: boolean;
  domain?: string;
}

function createScreenshotStore() {
  const { subscribe, set, update } = writable<ScreenshotInfo | null>(null);
  
  return {
    subscribe,
    getScreenshot: async (domain: string) => {
      try {
        console.log('ScreenshotStore: 开始获取域名截图', domain);
        // 设置加载状态
        set({ domain, loading: true, success: false } as ScreenshotInfo);
        
        // 调用API服务
        const data = await getScreenshot(domain);
        console.log('ScreenshotStore: 获取截图成功', data);
        set({ ...data, domain, loading: false });
      } catch (error) {
        console.error('获取截图失败:', error);
        set({ 
          domain, 
          loading: false, 
          success: false,
          error: error instanceof Error ? error.message : '获取截图失败'
        });
      }
    },
    reset: () => set(null)
  };
}

export const screenshotStore = createScreenshotStore();