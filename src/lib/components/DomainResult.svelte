<script lang="ts">
  import { fade } from 'svelte/transition';
  import Badge from './common/Badge.svelte';
  import { whoisStore } from '$lib/stores/whois';
  import { screenshotStore } from '$lib/stores/screenshot';
  import { onMount } from 'svelte';
  
  // 导入拆分后的子组件
  import DomainInfo from './domain/DomainInfo.svelte';
  import DomainStatus from './domain/DomainStatus.svelte';
  import ScreenshotViewer from './screenshot/ScreenshotViewer.svelte';
  import QueryMeta from './domain/QueryMeta.svelte';
  
  // 使用$语法创建响应式订阅
  $: result = $whoisStore || { loading: false, error: null, registered: false, domain: '', nameServers: [], status: [] };
  $: screenshot = $screenshotStore;
  
  // 截图类型
  // $: screenshotType = screenshot?.type || 'website';
  
  // 截图是否已请求
  let screenshotRequested = false;
  
  // 监听result变化，当查询完成且有数据时自动获取截图
  $: if (result && !result.loading && !result.error && result.registered && !screenshotRequested) {
    // 标记已请求截图
    screenshotRequested = true;
    
    // 立即获取网站截图
    setTimeout(() => {
      // 先获取网站截图
      screenshotStore.getScreenshot();
      
      // 稍后获取IT狗截图，0.5秒后获取
      setTimeout(() => {
        screenshotStore.getItdogScreenshot();
      }, 500);
    }, 100);
  }
  
  // 当WHOIS查询结束时，重置截图请求标记
  $: if (result && result.loading) {
    screenshotRequested = false;
  }
  
  // 切换截图类型
  function toggleScreenshotType() {
    screenshotStore.toggleScreenshotType();
  }
  
  // 获取域名状态
  function getDomainStatus(result: any) {
    if (!result) return { type: 'unknown', text: '未知状态' };
    if (!result.registered) return { type: 'available', text: '域名可注册' };
    if (isNewlyRegistered(result.creationDate)) return { type: 'new-registered', text: '新注册域名' };
    return { type: 'registered', text: '已注册' };
  }
  
  // 判断域名是否新注册
  function isNewlyRegistered(creationDate: string): boolean {
    if (!creationDate) return false;
    const created = new Date(creationDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
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
    {#if result.registered}
      <!-- 域名基本信息组件 -->
      <DomainInfo {result} />
      
      <!-- 域名服务器和状态组件 -->
      <DomainStatus 
        nameServers={result.nameServers || []} 
        status={result.status || []} 
      />
      
      <!-- 截图功能组件 -->
      <ScreenshotViewer 
        screenshot={screenshot}
        onToggleScreenshotType={toggleScreenshotType}
      />
    {:else}
      <div class="empty-state">
        <p>该域名尚未被注册，立即注册以获得所有权！</p>
        <a href="https://www.namesilo.com/register.php?domain={result.domain}" target="_blank" rel="noopener" class="register-btn">
          立即注册
        </a>
      </div>
    {/if}
    
    <!-- 查询元数据信息组件 -->
    <QueryMeta {result} />
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
    @apply text-center py-12;
  }
  
  .error-text {
    @apply text-red-600 text-lg mb-4;
  }
  
  .retry-btn {
    @apply px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors;
  }
  
  .empty-state {
    @apply text-center py-8 text-gray-700;
  }
  
  .register-btn {
    @apply inline-block mt-4 px-6 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors;
  }
</style>