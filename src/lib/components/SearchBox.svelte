<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  let query = '';
  let searchHistory: string[] = [];
  let isInvalid = false;
  let errorMessage = '';
  let suggestedDomain = '';
  let showSuggestion = false;
  
  onMount(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      searchHistory = JSON.parse(storedHistory);
    }
    
    // 尝试加载punycode库（用于处理中文域名）
    loadPunycodeScript();
  });
  
  // 动态加载punycode库
  function loadPunycodeScript() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/punycode@2.1.1/punycode.min.js';
    script.async = true;
    document.head.appendChild(script);
  }
  
  // 转换中文域名为punycode（如果已加载punycode库）
  function convertToPunycode(domain: string): string {
    if ((window as any).punycode && /[\u4e00-\u9fa5]/.test(domain)) {
      try {
        // 分割域名和顶级域名
        const parts = domain.split('.');
        
        // 转换每个部分（除顶级域名外）
        const converted = parts.map((part, index) => {
          // 只转换包含中文字符的部分
          if (/[\u4e00-\u9fa5]/.test(part)) {
            return 'xn--' + (window as any).punycode.encode(part);
          }
          return part;
        });
        
        return converted.join('.');
      } catch (e) {
        console.error('中文域名转换失败:', e);
        return domain;
      }
    }
    return domain;
  }
  
  // 验证并格式化域名
  function normalizeDomain(input: string): { valid: boolean; domain: string; message: string } {
    // 移除开头和结尾的空白字符
    let domain = input.trim();
    
    // 如果输入为空
    if (!domain) {
      return { valid: false, domain: '', message: '请输入域名' };
    }
    
    // 1. 处理URL格式（移除协议和路径）
    if (domain.includes('://')) {
      try {
        const url = new URL(domain);
        domain = url.hostname;
      } catch (e) {
        // 如果URL解析失败，尝试简单移除常见前缀
        domain = domain.replace(/^https?:\/\//, '');
      }
    }
    
    // 2. 移除"www."前缀
    domain = domain.replace(/^www\./, '');
    
    // 3. 移除路径、查询参数和锚点
    domain = domain.split('/')[0].split('?')[0].split('#')[0];
    
    // 4. 处理端口号
    domain = domain.split(':')[0];
    
    // 5. 处理二级域名情况
    // 如果用户输入了形如 "子域名.example.com" 的内容，只保留主域名
    const domainParts = domain.split('.');
    if (domainParts.length > 2) {
      // 检查是否是主流顶级域名后有额外部分的情况 (如 example.com.cn)
      const lastTwoParts = domainParts.slice(-2).join('.');
      const commonTLDs = ['.com', '.net', '.org', '.edu', '.gov', '.mil', '.io', '.co'];
      const isCommonTLD = commonTLDs.some(tld => lastTwoParts.endsWith(tld));
      
      if (!isCommonTLD) {
        // 保留最后两部分作为主域名 (如 "example.com")
        const mainDomain = domainParts.slice(-2).join('.');
        
        // 记录建议
        suggestedDomain = mainDomain;
        
        // 仍然返回用户输入的完整域名，让用户选择是否要使用主域名
        return { 
          valid: true, 
          domain, 
          message: `检测到您输入的是二级域名，主域名是 ${mainDomain}`
        };
      }
    }
    
    // 6. 转换中文域名为punycode
    domain = convertToPunycode(domain);
    
    // 7. 验证域名格式
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?$/;
    if (!domainRegex.test(domain)) {
      return { valid: false, domain, message: '请输入有效的域名格式' };
    }
    
    return { valid: true, domain, message: '' };
  }
  
  // 处理搜索操作
  function handleSearch(useSuggestion = false) {
    // 使用建议的域名或用户输入
    const inputToUse = useSuggestion && suggestedDomain ? suggestedDomain : query;
    const trimmedQuery = inputToUse.trim();
    if (!trimmedQuery) return;
    
    // 重置错误状态和建议
    isInvalid = false;
    errorMessage = '';
    showSuggestion = false;
    
    // 验证并格式化域名
    const result = normalizeDomain(trimmedQuery);
    
    if (!result.valid) {
      isInvalid = true;
      errorMessage = result.message;
      return;
    }
    
    // 检查是否有建议且不是手动选择了建议
    if (result.message && !useSuggestion) {
      suggestedDomain = result.domain.split('.').slice(-2).join('.');
      showSuggestion = true;
      return;
    }
    
    // 使用格式化后的域名
    const normalizedDomain = result.domain;
    
    // 添加到搜索历史
    if (!searchHistory.includes(normalizedDomain)) {
      searchHistory = [normalizedDomain, ...searchHistory].slice(0, 5);
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    
    // 更新输入框为规范化的域名
    query = normalizedDomain;
    
    dispatch('search', { query: normalizedDomain });
  }
  
  // 清空输入
  function clearInput() {
    query = '';
    isInvalid = false;
    errorMessage = '';
    showSuggestion = false;
  }
  
  // 使用建议的域名
  function useMainDomain() {
    query = suggestedDomain;
    handleSearch();
  }
</script>

<div class="search-container">
  <div class="search-box">
    <span class="search-icon">🔍</span>
    
    <input
      bind:value={query}
      type="text"
      placeholder="请输入要查询的域名..."
      on:keydown={(e) => e.key === 'Enter' && handleSearch()}
      class="w-full px-4 py-3 pl-12 text-lg bg-gray-100 rounded-full border {isInvalid ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 {isInvalid ? 'focus:ring-red-400' : 'focus:ring-gray-400'}"
      on:input={() => {
        isInvalid = false;
        showSuggestion = false;
      }}
    />
    
    {#if query}
      <button 
        class="clear-btn absolute right-16 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        on:click={clearInput}
      >
        ✕
      </button>
    {/if}
    
    <button 
      class="search-btn absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!query.trim()} 
      on:click={() => handleSearch()}
    >
      搜索
    </button>
  </div>
  
  {#if isInvalid && errorMessage}
    <div class="error-message text-red-500 mt-2 text-sm" transition:fly={{ y: 10, duration: 200 }}>
      {errorMessage}
    </div>
  {/if}

  {#if showSuggestion && suggestedDomain}
    <div class="suggestion-message mt-2 text-amber-700 flex items-center bg-amber-50 p-2 rounded-lg" transition:fly={{ y: 10, duration: 200 }}>
      <div class="flex-1">
        检测到您输入的是二级域名，是否要查询主域名 <strong>{suggestedDomain}</strong>？
      </div>
      <div class="flex gap-2">
        <button 
          class="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm"
          on:click={() => useMainDomain()}
        >
          使用主域名
        </button>
        <button 
          class="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md text-sm"
          on:click={() => handleSearch(false)}
        >
          使用完整域名
        </button>
      </div>
    </div>
  {/if}
  
  {#if searchHistory.length > 0}
    <div 
      class="search-history mt-4 text-gray-600"
      transition:fly={{ y: 10, duration: 200 }}
    >
      <span class="history-label text-sm">历史记录:</span>
      
      <div class="history-items flex gap-2 mt-2 flex-wrap">
        {#each searchHistory as item}
          <button 
            class="history-item px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-full transition-colors text-gray-700"
            on:click={() => { query = item; handleSearch(); }}
          >
            {item}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .search-container {
    @apply w-full max-w-2xl mx-auto;
  }
  
  .search-box {
    @apply relative;
  }
  
  .search-icon {
    @apply absolute left-4 top-1/2 -translate-y-1/2 text-gray-500;
  }
</style>