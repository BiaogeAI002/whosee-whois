import { writable } from 'svelte/store';
import { queryDNS } from '$lib/api/dns';
import type { DNSResult, DNSRecord } from '$lib/api/dns';

// DNS查询状态接口
interface DNSState {
  domain: string;
  records: DNSRecord[];
  loading: boolean;
  error: string | null;
  queryTime: string | null;
  isCached: boolean;
  cacheTime: string | null;
  queryDuration: number | null;
}

// 初始状态
const initialState: DNSState = {
  domain: '',
  records: [],
  loading: false,
  error: null,
  queryTime: null,
  isCached: false,
  cacheTime: null,
  queryDuration: null
};

// 创建可写存储
function createDNSStore() {
  const { subscribe, set, update } = writable<DNSState>(initialState);

  return {
    subscribe,
    
    // 重置状态
    reset: () => set(initialState),
    
    // 查询域名DNS记录
    search: async (domain: string) => {
      if (!domain) return;
      
      // 更新状态为加载中
      update(state => ({
        ...state,
        domain,
        loading: true,
        error: null
      }));
      
      try {
        // 调用API查询DNS记录
        const result = await queryDNS(domain);
        
        // 更新状态为成功
        update(state => ({
          ...state,
          records: result.records,
          loading: false,
          queryTime: result.queryTime,
          isCached: result.isCached,
          cacheTime: result.cacheTime,
          queryDuration: result.queryDuration || null
        }));
      } catch (error) {
        // 更新状态为错误
        update(state => ({
          ...state,
          loading: false,
          error: error instanceof Error ? error.message : '未知错误'
        }));
      }
    }
  };
}

// 导出DNS存储
export const dnsStore = createDNSStore();
