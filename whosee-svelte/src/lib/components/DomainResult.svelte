<script lang="ts">
  import { onMount } from 'svelte';
  import Badge from './common/Badge.svelte';
  import { whoisStore } from '$lib/stores/whois';
  import { fade } from 'svelte/transition';
  
  // 使用$语法创建响应式订阅
  $: result = $whoisStore;
  
  // 添加调试日志
  $: if (result) {
    console.log('DomainResult: 收到WHOIS数据', result);
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
  {/if}
</div>

<style>
  .result-container {
    @apply max-w-4xl mx-auto mt-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20;
  }
  
  .result-header {
    @apply flex items-center justify-between mb-6;
  }
  
  .domain-name {
    @apply text-2xl font-bold text-white;
  }
  
  .info-grid {
    @apply grid grid-cols-2 gap-6;
  }
  
  .info-item {
    @apply p-4 bg-white/5 rounded-xl;
  }
  
  .label {
    @apply block text-sm text-white/60 mb-1;
  }
  
  .value {
    @apply text-lg text-white font-medium;
  }
  
  .value-list {
    @apply flex flex-wrap gap-2 mt-2;
  }
  
  .value-item {
    @apply px-2 py-1 bg-white/10 rounded-lg text-sm text-white;
  }
  
  .status-tags {
    @apply flex flex-wrap gap-2 mt-2;
  }
  
  .status-tag {
    @apply px-3 py-1.5 rounded-full text-sm text-white font-medium shadow-md;
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
    @apply mt-2 text-sm font-medium rounded-full px-3 py-1 inline-block;
  }
  
  .expiry-expired {
    @apply bg-red-500/20 text-red-400;
  }
  
  .expiry-urgent {
    @apply bg-orange-500/20 text-orange-400;
  }
  
  .expiry-warning {
    @apply bg-yellow-500/20 text-yellow-400;
  }
  
  .expiry-safe {
    @apply bg-green-500/20 text-green-400;
  }
  
  .expiry-unknown {
    @apply bg-gray-500/20 text-gray-400;
  }
  
  .empty-state {
    @apply text-center py-8;
  }
  
  .register-btn {
    @apply inline-block mt-4 px-6 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors;
  }
  
  .loading-state {
    @apply flex flex-col items-center justify-center py-12;
  }
  
  .loading-spinner {
    @apply w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4;
  }
  
  .loading-text {
    @apply text-white/80 text-lg;
  }
  
  .error-state {
    @apply flex flex-col items-center justify-center py-12 text-center;
  }
  
  .error-text {
    @apply text-red-400 text-lg mb-4;
  }
  
  .retry-btn {
    @apply px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors;
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