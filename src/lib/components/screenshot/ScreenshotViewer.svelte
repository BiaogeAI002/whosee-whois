<script lang="ts">
  import { fade } from 'svelte/transition';
  import { screenshotStore } from '$lib/stores/screenshot';
  
  // 接收从父组件传递的属性
  export let screenshot: any = $screenshotStore;
  export let onToggleScreenshotType: () => void;
  
  // 从screenshot对象获取类型
  $: screenshotType = screenshot?.type || 'website';
  
  function toggleScreenshotType() {
    if (onToggleScreenshotType) {
      onToggleScreenshotType();
    } else {
      screenshotStore.toggleScreenshotType();
    }
  }
  
  // 重试获取截图
  function retryScreenshot() {
    if (screenshotType === 'website') {
      screenshotStore.getScreenshot();
    } else {
      screenshotStore.getItdogScreenshot();
    }
  }
</script>

<div class="screenshot-section">
  {#if !screenshot}
    <div class="screenshot-waiting" in:fade={{ duration: 300 }}>
      <div class="waiting-indicator">
        <span class="waiting-icon"></span>
        <span class="waiting-text">等待查询完成后获取截图...</span>
      </div>
    </div>
  {:else if screenshot.loading}
    <div class="screenshot-loading" in:fade={{ duration: 300 }}>
      <div class="loading-indicator">
        <span class="loading-icon"></span>
        <span class="loading-text">正在生成{screenshotType === 'website' ? '网站截图' : '测速截图'}...</span>
      </div>
    </div>
  {:else if !screenshot.success}
    <div class="screenshot-error" in:fade={{ duration: 300 }}>
      <p class="error-title">{screenshot.error || '截图生成失败'}</p>
      {#if screenshot.message}
        <p class="error-message">{screenshot.message}</p>
      {/if}
      <button class="retry-btn" on:click={retryScreenshot}>
        重试
      </button>
    </div>
  {:else}
    <div class="screenshot-result" in:fade={{ duration: 300 }}>
      <h3 class="screenshot-title">
        {screenshotType === 'website' ? '网站截图' : '测速截图'}
        <button class="toggle-btn" on:click={toggleScreenshotType} title="切换截图类型">
          切换到{screenshotType === 'website' ? '测速截图' : '网站截图'}
        </button>
      </h3>
      <div class="screenshot-image-container">
        <img src={screenshot.imageUrl} 
             alt="{screenshot.domain || ''}的{screenshotType === 'website' ? '网站截图' : '测速截图'}" 
             class="screenshot-image" 
             loading="lazy" />
      </div>
      <div class="screenshot-info">
        <span class="screenshot-cache-status {screenshot.fromCache ? 'cached' : 'fresh'}">
          {screenshot.fromCache ? '使用缓存截图' : '实时生成截图'}
        </span>
        <button class="refresh-btn" on:click={retryScreenshot} title="刷新截图">
          🔄
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  /* 截图功能样式 */
  .screenshot-section {
    @apply mt-8 border-t border-gray-200 pt-6;
  }
  
  .screenshot-result {
    @apply mt-2 bg-white/80 rounded-xl p-4 border border-gray-200 shadow-sm;
  }
  
  .screenshot-title {
    @apply text-lg font-medium text-gray-800 mb-3 flex items-center justify-between;
  }
  
  .toggle-btn {
    @apply text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors;
  }
  
  .screenshot-image-container {
    @apply rounded-lg overflow-hidden border border-gray-200 bg-gray-50;
  }
  
  .screenshot-image {
    @apply w-full h-auto max-h-[500px] object-contain;
  }
  
  .screenshot-info {
    @apply mt-3 flex items-center justify-between text-sm;
  }
  
  .screenshot-cache-status {
    @apply px-2 py-1 rounded-full text-xs;
  }
  
  .cached {
    @apply bg-amber-50 text-amber-600 border border-amber-200;
  }
  
  .fresh {
    @apply bg-green-50 text-green-600 border border-green-200;
  }
  
  .refresh-btn {
    @apply p-1 rounded-full hover:bg-gray-100 transition-colors;
  }
  
  .screenshot-error {
    @apply mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-center;
  }
  
  .screenshot-error .error-title {
    @apply text-red-600 font-medium mb-2;
  }
  
  .screenshot-error .error-message {
    @apply text-red-500 text-sm mb-3;
  }
  
  .retry-btn {
    @apply px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors;
  }
  
  .screenshot-loading, .screenshot-waiting {
    @apply mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center;
  }
  
  .loading-indicator, .waiting-indicator {
    @apply flex items-center justify-center gap-2;
  }
  
  .loading-icon, .waiting-icon {
    @apply w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin;
  }
  
  .loading-text {
    @apply text-blue-600 font-medium;
  }
  
  .waiting-text {
    @apply text-gray-600 font-medium;
  }
</style>
