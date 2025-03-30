<script lang="ts">
  import { onMount } from 'svelte';
  import Badge from './common/Badge.svelte';
  import { whoisStore } from '$lib/stores/whois';
  import { screenshotStore } from '$lib/stores/screenshot';
  import { fade } from 'svelte/transition';
  
  // 使用$语法创建响应式订阅
  $: result = $whoisStore;
  $: screenshot = $screenshotStore;
  
  // 添加调试日志
  $: if (result) {
    console.log('DomainResult: 收到WHOIS数据', result);
  }
  
  // 获取域名测速截图
  function getScreenshot() {
    if (result && result.domain) {
      screenshotStore.getScreenshot(result.domain);
    }
  }
  
  function isNewlyRegistered(creationDate: string): boolean {
    if (!creationDate) return false;
    const created = new Date(creationDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }
  
  function getDomainStatus(result: any) {
    if (!result) return { type: 'unknown', text: '未知状态' };
    if (!result.registered) return { type: 'available', text: '域名可注册' };
    if (isNewlyRegistered(result.creationDate)) return { type: 'new-registered', text: '新注册域名' };
    return { type: 'registered', text: '已注册' };
  }
  
  function formatDate(date: string | null): string {
    if (!date) return '未知';
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  function calculateDomainAge(creationDate: string | null): string {
    if (!creationDate) return '未知';
    const created = new Date(creationDate);
    const now = new Date();
    const years = now.getFullYear() - created.getFullYear();
    const months = now.getMonth() - created.getMonth();
    
    if (years > 0) {
      return `${years}年${months > 0 ? months + '个月' : ''}`;
    }
    return `${months}个月`;
  }
  
  function calculateExpiryTime(expiryDate: string | null): string {
    if (!expiryDate) return '未知';
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '已过期';
    if (diffDays === 0) return '今天到期';
    if (diffDays <= 30) return `剩余 ${diffDays} 天`;
    
    // 更精确的月份计算
    const months = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;
    
    let result = '';
    if (months > 0) {
      result += `${months}个月`;
      if (remainingDays > 0) result += ` ${remainingDays}天`;
    } else {
      result += `${remainingDays}天`;
    }
    
    return `剩余 ${result}`;
  }
  
  function getExpiryClass(expiryDate: string | null): string {
    if (!expiryDate) return 'expiry-unknown';
    
    const days = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'expiry-expired';
    if (days <= 30) return 'expiry-urgent';
    if (days <= 90) return 'expiry-warning';
    return 'expiry-safe';
  }
  
  function formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'clientTransferProhibited': '禁止转移',
      'clientUpdateProhibited': '禁止更新',
      'clientDeleteProhibited': '禁止删除',
      'clientHold': '暂停解析',
      'serverTransferProhibited': '服务商禁止转移',
      'serverUpdateProhibited': '服务商禁止更新',
      'serverDeleteProhibited': '服务商禁止删除',
      'serverHold': '服务商暂停解析',
      'active': '正常',
      'inactive': '未激活',
      'pending': '待处理',
      'pendingDelete': '待删除',
      'pendingTransfer': '待转移',
      'pendingUpdate': '待更新',
      'pendingCreate': '待创建'
    };
    return statusMap[status] || status;
  }
  
  // 获取状态标签的样式类
  function getStatusClass(status: string): string {
    const statusClassMap: Record<string, string> = {
      'clientTransferProhibited': 'status-protected',
      'clientUpdateProhibited': 'status-protected',
      'clientDeleteProhibited': 'status-protected',
      'clientHold': 'status-warning',
      'serverTransferProhibited': 'status-protected',
      'serverUpdateProhibited': 'status-protected',
      'serverDeleteProhibited': 'status-protected',
      'serverHold': 'status-warning',
      'active': 'status-active',
      'inactive': 'status-inactive',
      'pending': 'status-pending',
      'pendingDelete': 'status-danger',
      'pendingTransfer': 'status-pending',
      'pendingUpdate': 'status-pending',
      'pendingCreate': 'status-pending'
    };
    return statusClassMap[status] || 'status-default';
  }
</script>

<div class="result-container" in:fade={{ duration: 300 }}>
  {#if result.loading}
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在查询域名信息...</p>
    </div>
  {:else if result.error}
    <div class="error-state">
      <p class="error-text">查询失败: {result.error}</p>
      <button class="retry-btn" on:click={() => whoisStore.search(result.domain)}>重试</button>
    </div>
  {:else}
    <div class="result-header">
      <h2 class="domain-name">{result.domain}</h2>
      <Badge {...getDomainStatus(result)} />
    </div>
    
    {#if result.registered}
      <div class="info-grid">
        <div class="info-item">
          <span class="label">注册时间</span>
          <span class="value">{formatDate(result.creationDate)}</span>
        </div>
        
        <div class="info-item">
          <span class="label">到期时间</span>
          <span class="value">{formatDate(result.expiryDate)}</span>
          <div class="expiry-time {getExpiryClass(result.expiryDate)}">
            {calculateExpiryTime(result.expiryDate)}
          </div>
        </div>
        
        <div class="info-item">
          <span class="label">域名年龄</span>
          <span class="value">{calculateDomainAge(result.creationDate)}</span>
        </div>
        
        <div class="info-item">
          <span class="label">更新时间</span>
          <span class="value">{formatDate(result.lastUpdated)}</span>
        </div>
        
        {#if result.registrar}
          <div class="info-item col-span-2">
            <span class="label">注册商</span>
            <span class="value">{result.registrar}</span>
          </div>
        {/if}
        {#if result.nameServers?.length}
          <div class="info-item col-span-2">
            <span class="label">域名服务器</span>
            <div class="value-list">
              {#each result.nameServers as ns}
                <span class="value-item">{ns}</span>
              {/each}
            </div>
          </div>
        {/if}
        
        {#if result.status?.length}
          <div class="info-item col-span-2">
            <span class="label">域名状态</span>
            <div class="status-tags">
              {#each result.status as status}
                <span class="status-tag {getStatusClass(status)}">{formatStatus(status)}</span>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {:else}
      <div class="empty-state">
        <p>该域名尚未被注册，立即注册以获得所有权！</p>
        <a href="https://www.namesilo.com/register.php?domain={result.domain}" target="_blank" rel="noopener" class="register-btn">
          立即注册
        </a>
      </div>
    {/if}
    
    <!-- 截图功能区域 -->
    {#if !result.loading && !result.error && result.registered}
      <div class="screenshot-section">
        <button class="screenshot-btn" on:click={getScreenshot}>
          {#if screenshot && screenshot.loading}
            <span class="loading-icon"></span> 生成截图中...
          {:else}
            <span class="camera-icon">📷</span> 获取测速截图
          {/if}
        </button>
        
        {#if screenshot && !screenshot.loading && screenshot.success}
          <div class="screenshot-result" in:fade={{ duration: 300 }}>
            <h3 class="screenshot-title">域名测速截图</h3>
            <div class="screenshot-image-container">
              <img src={screenshot.imageUrl} alt="{result.domain}测速截图" class="screenshot-image" />
            </div>
            <div class="screenshot-info">
              <span class="screenshot-cache-status {screenshot.fromCache ? 'cached' : 'fresh'}">
                {screenshot.fromCache ? '使用缓存截图' : '实时生成截图'}
              </span>
            </div>
          </div>
        {/if}
        
        {#if screenshot && !screenshot.loading && !screenshot.success}
          <div class="screenshot-error" in:fade={{ duration: 300 }}>
            <p>截图生成失败: {screenshot.error}</p>
            <button class="retry-btn" on:click={getScreenshot}>重试</button>
          </div>
        {/if}
      </div>
    {/if}
    
    <!-- 查询元数据信息 -->
    {#if !result.loading && !result.error}
      <div class="query-meta">
        <div class="meta-pills">
          <span class="meta-pill">
            <span class="meta-label">查询时间:</span>
            <span class="meta-value">{result.queryTime || new Date().toLocaleString('zh-CN')}</span>
          </span>
          
          <span class="meta-pill">
            <span class="meta-label">查询耗时:</span>
            <span class="meta-value">{result.queryDuration ? `${result.queryDuration}ms` : '未知'}</span>
          </span>
          
          <span class="meta-pill {result.fromCache ? 'meta-cached' : 'meta-uncached'}">
            <span class="meta-label">缓存状态:</span>
            <span class="meta-value">{result.fromCache ? '已缓存' : '未缓存'}</span>
          </span>
          
          {#if result.fromCache && result.cacheTime}
            <span class="meta-pill meta-cached">
              <span class="meta-label">缓存时间:</span>
              <span class="meta-value">{result.cacheTime}</span>
            </span>
          {/if}
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .result-container {
    @apply max-w-4xl mx-auto mt-8 p-6 bg-gradient-to-br from-gray-50/90 to-white/90 rounded-2xl border border-gray-200/80 shadow-lg transition-all duration-500;
  }
  
  @media (min-width: 769px) {
    .result-container {
      @apply backdrop-blur-md;
    }
  }
  
  /* 截图功能样式 */
  .screenshot-section {
    @apply mt-8 pt-6 border-t border-gray-200/50;
  }
  
  .screenshot-btn {
    @apply px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2;
  }
  
  .camera-icon {
    @apply text-xl;
  }
  
  .loading-icon {
    @apply w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin;
  }
  
  .screenshot-result {
    @apply mt-6 p-4 bg-white/90 rounded-xl border border-gray-200 shadow-md;
  }
  
  @media (min-width: 769px) {
    .screenshot-result {
      @apply backdrop-blur-sm;
    }
  }
  
  .screenshot-title {
    @apply text-lg font-medium text-gray-700 mb-4;
  }
  
  .screenshot-image-container {
    @apply overflow-hidden rounded-lg border border-gray-200 shadow-inner bg-gray-50;
  }
  
  @media (max-width: 768px) {
    .screenshot-image {
      @apply max-h-[300px] object-contain;
    }
  }
  
  .screenshot-image {
    @apply w-full h-auto object-contain;
  }
  
  .screenshot-info {
    @apply mt-3 flex justify-end;
  }
  
  .screenshot-cache-status {
    @apply px-3 py-1 rounded-full text-xs font-medium;
  }
  
  .screenshot-cache-status.cached {
    @apply bg-blue-50 text-blue-600 border border-blue-200;
  }
  
  .screenshot-cache-status.fresh {
    @apply bg-green-50 text-green-600 border border-green-200;
  }
  
  .screenshot-error {
    @apply mt-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-center;
  }
  
  /* 查询元数据样式 */
  .query-meta {
    @apply mt-6 pt-4 border-t border-gray-200/50;
  }
  
  .meta-pills {
    @apply flex flex-wrap gap-2 justify-end;
  }
  
  @media (max-width: 768px) {
    .meta-pills {
      @apply justify-center;
    }
    
    .meta-pill {
      @apply text-xs;
    }
  }
  
  .meta-pill {
    @apply px-3 py-1 bg-gray-100/80 rounded-full text-xs text-gray-600 border border-gray-200/50 shadow-sm flex items-center gap-1 transition-all duration-300 hover:shadow-md hover:bg-gray-100;
  }
  
  .meta-label {
    @apply font-medium text-gray-500;
  }
  
  .meta-value {
    @apply font-medium;
  }
  
  .meta-cached {
    @apply bg-blue-50/80 text-blue-600 border-blue-200/50;
  }
  
  .meta-uncached {
    @apply bg-amber-50/80 text-amber-600 border-amber-200/50;
  }
  
  .result-header {
    @apply flex items-center justify-between mb-6;
  }
  
  .domain-name {
    @apply text-2xl font-bold text-gray-800;
  }
  
  .info-grid {
    @apply grid grid-cols-2 gap-6;
  }
  
  @media (max-width: 768px) {
    .info-grid {
      @apply grid-cols-1 gap-4;
    }
    
    .info-item.col-span-2 {
      @apply col-span-1;
    }
  }
  
  .info-item {
    @apply p-5 bg-white/90 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white;
  }
  
  @media (min-width: 769px) {
    .info-item {
      @apply backdrop-blur-sm;
    }
  }
  
  .label {
    @apply block text-sm text-gray-500 mb-1;
  }
  
  .value {
    @apply text-lg text-gray-800 font-medium;
  }
  
  .value-list {
    @apply flex flex-wrap gap-2 mt-2;
  }
  
  .value-item {
    @apply px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full text-sm text-gray-700 border border-gray-200/50 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 hover:from-gray-100 hover:to-gray-200;
  }
  
  .status-tags {
    @apply flex flex-wrap gap-2 mt-2;
  }
  
  .status-tag {
    @apply px-4 py-1.5 rounded-full text-sm text-white font-medium shadow-md border border-white/20 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:brightness-110;
  }
  
  @media (min-width: 769px) {
    .status-tag {
      @apply backdrop-blur-sm;
    }
  }
  
  .status-active {
    @apply bg-gradient-to-r from-green-500 to-emerald-500;
  }
  
  .status-protected {
    @apply bg-gradient-to-r from-blue-500 to-indigo-500;
  }
  
  .status-pending {
    @apply bg-gradient-to-r from-amber-500 to-orange-500;
  }
  
  .status-warning {
    @apply bg-gradient-to-r from-orange-500 to-red-500;
  }
  
  .status-danger {
    @apply bg-gradient-to-r from-red-500 to-pink-500;
  }
  
  .status-inactive {
    @apply bg-gradient-to-r from-gray-500 to-slate-500;
  }
  
  .status-default {
    @apply bg-gradient-to-r from-purple-500 to-indigo-500;
  }
  
  .expiry-time {
    @apply mt-2 text-sm font-medium rounded-full px-4 py-1.5 inline-block border shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105;
  }
  
  .expiry-expired {
    @apply bg-gradient-to-r from-red-500/10 to-red-500/20 text-red-500 border-red-200;
  }
  
  .expiry-urgent {
    @apply bg-gradient-to-r from-orange-500/10 to-orange-500/20 text-orange-500 border-orange-200;
  }
  
  .expiry-warning {
    @apply bg-gradient-to-r from-yellow-500/10 to-yellow-500/20 text-yellow-600 border-yellow-200;
  }
  
  .expiry-safe {
    @apply bg-gradient-to-r from-green-500/10 to-green-500/20 text-green-600 border-green-200;
  }
  
  .expiry-unknown {
    @apply bg-gradient-to-r from-gray-500/10 to-gray-500/20 text-gray-600 border-gray-200;
  }
  
  .empty-state {
    @apply text-center py-8 text-gray-700;
  }
  
  .register-btn {
    @apply inline-block mt-4 px-6 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors;
  }
  
  .loading-state {
    @apply flex flex-col items-center justify-center py-12;
  }
  
  .loading-spinner {
    @apply w-12 h-12 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mb-4;
  }
  
  .loading-text {
    @apply text-gray-600 text-lg;
  }
  
  .error-state {
    @apply flex flex-col items-center justify-center py-12 text-center;
  }
  
  .error-text {
    @apply text-red-500 text-lg mb-4;
  }
  
  .retry-btn {
    @apply px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 transition-colors;
  }
  
  @media (max-width: 768px) {
    .result-container {
      @apply mx-4 p-4;
    }
    
    .info-grid {
      @apply grid-cols-1;
    }
    
    .domain-name {
      @apply text-xl;
    }
  }
</style>