import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { checkHealth, checkDetailedHealth } from '$lib/api/health';
import type { HealthResult } from '$lib/api/health';

export interface HealthState extends HealthResult {
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// 初始状态
const initialState: HealthState = {
  status: '',
  loading: false,
  error: null,
  lastUpdated: null
};

function createHealthStore() {
  const { subscribe, set, update } = writable<HealthState>(initialState);

  return {
    subscribe,
    
    /**
     * 检查健康状态 (基本)
     * @returns {Promise<HealthResult|null>} 健康检查数据或null（出错时）
     */
    checkHealth: async (): Promise<HealthResult | null> => {
      if (!browser) return null;
      
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // 调用API服务
        const data = await checkHealth();
        
        update(state => ({
          ...state,
          ...data,
          loading: false,
          lastUpdated: new Date(),
        }));
        
        return data;
      } catch (error) {
        console.error('Health check error:', error);
        update(state => ({
          ...state,
          loading: false,
          error: error instanceof Error ? error.message : '未知错误',
        }));
        return null;
      }
    },
    
    /**
     * 检查详细健康状态
     * @returns {Promise<HealthResult|null>} 健康检查数据或null（出错时）
     */
    checkDetailedHealth: async (): Promise<HealthResult | null> => {
      if (!browser) return null;
      
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // 调用API服务
        const data = await checkDetailedHealth();
        
        update(state => ({
          ...state,
          ...data,
          loading: false,
          lastUpdated: new Date(),
        }));
        
        return data;
      } catch (error) {
        console.error('Detailed health check error:', error);
        update(state => ({
          ...state,
          loading: false,
          error: error instanceof Error ? error.message : '未知错误',
        }));
        return null;
      }
    },
    
    /**
     * 重置状态
     */
    reset: (): void => {
      set(initialState);
    }
  };
}

export const healthStore = createHealthStore();
