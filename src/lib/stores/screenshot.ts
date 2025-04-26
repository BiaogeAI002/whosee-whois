import { writable, get } from 'svelte/store';
import type { Subscriber } from 'svelte/store';
import { getScreenshot, getItdogScreenshot } from '$lib/api';
import type { ScreenshotResult } from '$lib/api';
import { whoisStore } from './whois';

export interface ScreenshotInfo extends ScreenshotResult {
  loading?: boolean;
  domain?: string;
  type?: 'website' | 'itdog'; // 截图类型：网站截图或itdog测速截图
}

// 创建一个存储当前显示类型的store
const currentTypeStore = writable<'website' | 'itdog'>('website');
// 创建网站截图存储
const websiteScreenshotStore = writable<ScreenshotInfo | null>(null);
// 创建测速截图存储
const itdogScreenshotStore = writable<ScreenshotInfo | null>(null);

function createScreenshotStore() {
  // 创建统一的store接口
  const screenshotStore = {
    // 获取当前查询的域名
    getCurrentDomain: (): string | null => {
      const whoisInfo = get(whoisStore);
      return whoisInfo?.domain || null;
    },
    
    // 订阅函数，返回当前显示类型对应的截图信息
    subscribe: (callback: Subscriber<ScreenshotInfo | null>) => {
      // 同时订阅三个store
      const unsubCurrentType = currentTypeStore.subscribe(() => updateCallback());
      const unsubWebsite = websiteScreenshotStore.subscribe(() => updateCallback());
      const unsubItdog = itdogScreenshotStore.subscribe(() => updateCallback());
      
      // 更新回调函数
      function updateCallback() {
        const type = get(currentTypeStore);
        const screenshot = type === 'website' 
          ? get(websiteScreenshotStore)
          : get(itdogScreenshotStore);
        callback(screenshot);
      }
      
      // 立即执行一次
      updateCallback();
      
      // 返回取消订阅函数
      return () => {
        unsubCurrentType();
        unsubWebsite();
        unsubItdog();
      };
    },
    
    // 获取网站截图
    getScreenshot: async (domain?: string) => {
      try {
        // 如果没有提供域名，使用当前查询的域名
        const targetDomain = domain || screenshotStore.getCurrentDomain();
        if (!targetDomain) {
          console.error('ScreenshotStore: 无法获取截图，域名为空');
          websiteScreenshotStore.set({ 
            loading: false, 
            success: false,
            type: 'website',
            error: '无法获取截图，域名为空'
          });
          return;
        }
        
        console.log('ScreenshotStore: 开始获取网站截图', targetDomain);
        // 设置加载状态
        websiteScreenshotStore.set({ 
          domain: targetDomain, 
          loading: true, 
          success: false, 
          type: 'website' 
        });
        
        // 调用API服务
        const data = await getScreenshot(targetDomain);
        console.log('ScreenshotStore: 获取网站截图成功', data);
        websiteScreenshotStore.set({ 
          ...data, 
          domain: targetDomain, 
          loading: false, 
          type: 'website' 
        });
      } catch (error) {
        console.error('获取网站截图失败:', error);
        websiteScreenshotStore.set({ 
          domain: domain || screenshotStore.getCurrentDomain() || undefined, 
          loading: false, 
          success: false,
          type: 'website',
          error: error instanceof Error ? error.message : '获取网站截图失败'
        });
      }
    },
    
    // 获取itdog测速截图
    getItdogScreenshot: async (domain?: string) => {
      try {
        // 如果没有提供域名，使用当前查询的域名
        const targetDomain = domain || screenshotStore.getCurrentDomain();
        if (!targetDomain) {
          console.error('ScreenshotStore: 无法获取itdog测速截图，域名为空');
          itdogScreenshotStore.set({ 
            loading: false, 
            success: false,
            type: 'itdog',
            error: '无法获取itdog测速截图，域名为空'
          });
          return;
        }
        
        console.log('ScreenshotStore: 开始获取itdog测速截图', targetDomain);
        // 设置加载状态
        itdogScreenshotStore.set({ 
          domain: targetDomain, 
          loading: true, 
          success: false, 
          type: 'itdog' 
        });
        
        // 调用API服务
        const data = await getItdogScreenshot(targetDomain);
        console.log('ScreenshotStore: 获取itdog测速截图成功', data);
        itdogScreenshotStore.set({ 
          ...data, 
          domain: targetDomain, 
          loading: false, 
          type: 'itdog' 
        });
      } catch (error) {
        console.error('获取itdog测速截图失败:', error);
        itdogScreenshotStore.set({ 
          domain: domain || screenshotStore.getCurrentDomain() || undefined, 
          loading: false, 
          success: false,
          type: 'itdog',
          error: error instanceof Error ? error.message : '获取itdog测速截图失败'
        });
      }
    },
    
    // 切换截图类型
    toggleScreenshotType: () => {
      const currentType = get(currentTypeStore);
      const newType = currentType === 'website' ? 'itdog' : 'website';
      console.log('ScreenshotStore: 切换截图类型', currentType, '->', newType);
      
      // 仅更新当前显示类型，不修改截图数据
      currentTypeStore.set(newType);
      
      // 如果目标类型没有截图，且有域名，则自动获取
      const domain = screenshotStore.getCurrentDomain();
      if (domain) {
        if (newType === 'website' && !get(websiteScreenshotStore)) {
          setTimeout(() => screenshotStore.getScreenshot(domain), 0);
        } else if (newType === 'itdog' && !get(itdogScreenshotStore)) {
          setTimeout(() => screenshotStore.getItdogScreenshot(domain), 0);
        }
      }
    },
    
    // 获取当前显示的截图类型
    getCurrentType: (): 'website' | 'itdog' => {
      return get(currentTypeStore);
    },
    
    // 清除截图
    reset: () => {
      currentTypeStore.set('website');
      websiteScreenshotStore.set(null);
      itdogScreenshotStore.set(null);
    }
  };
  
  // 监听whoisStore变化，当域名变更时重置截图
  let lastQueryDomain: string | null = null;
  whoisStore.subscribe(whoisInfo => {
    const currentDomain = whoisInfo?.domain || null;
    
    // 如果域名变更了，重置截图
    if (currentDomain && lastQueryDomain && currentDomain !== lastQueryDomain) {
      console.log('ScreenshotStore: 域名已变更，重置截图', lastQueryDomain, '->', currentDomain);
      screenshotStore.reset();
    }
    
    // 更新上次查询的域名
    lastQueryDomain = currentDomain;
  });
  
  return screenshotStore;
}

export const screenshotStore = createScreenshotStore();