import { writable } from 'svelte/store';
import { queryWhois } from '$lib/api';
import type { WhoisResult } from '$lib/api';

export interface WhoisInfo extends WhoisResult {
  loading?: boolean;
  error?: string;
  queryTime?: string;      // 查询时间
  queryDuration?: number;  // 查询耗时(毫秒)
  fromCache?: boolean;     // 是否来自缓存
  cacheTime?: string | null;      // 缓存时间
}

function createWhoisStore() {
  const { subscribe, set, update } = writable<WhoisInfo | null>(null);
  
  return {
    subscribe,
    search: async (domain: string) => {
      try {
        // 设置加载状态
        set({ domain, loading: true } as WhoisInfo);
        
        // 调用API服务
        const data = await queryWhois(domain);
        set({ ...data, loading: false });
      } catch (error) {
        set({ 
          domain, 
          loading: false, 
          error: error instanceof Error ? error.message : '查询失败',
          registered: false,
          creationDate: null,
          expiryDate: null,
          registrar: null,
          nameServers: [],
          status: [],
          lastUpdated: null
        });
      }
    },
    reset: () => set(null)
  };
}

export const whoisStore = createWhoisStore();