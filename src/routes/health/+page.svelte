<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import HealthResult from '$lib/components/HealthResult.svelte';
  
  let showContent = false;
  
  onMount(() => {
    showContent = true;
  });
</script>

<svelte:head>
  <title>系统健康状态 - Whosee.me</title>
  <meta name="description" content="查看Whosee.me域名查询服务的健康状态和系统性能信息" />
</svelte:head>

<main class="min-h-screen bg-white relative overflow-hidden pb-footer">
  <div class="background-pattern absolute inset-0 opacity-5"></div>
  
  <div class="health-dashboard relative z-10 container mx-auto px-4 py-16">
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">系统健康状态</h1>
        <p class="text-gray-600 mt-2">查看Whosee.me域名查询服务的实时状态信息</p>
      </div>
      
      <div class="mt-4 md:mt-0">
        <a href="/" class="inline-flex items-center px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          返回首页
        </a>
      </div>
    </div>
    
    {#if showContent}
      <div in:fade={{ duration: 300 }}>
        <HealthResult />
      </div>
      
      <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 class="text-lg font-medium text-blue-800 mb-2">关于健康检查</h2>
        <p class="text-blue-700">
          此页面展示了Whosee.me域名查询服务的实时健康状态，包括WHOIS服务提供商的可用性和性能指标。
          数据每5分钟自动更新一次，您也可以点击"刷新"按钮手动获取最新状态。
        </p>
      </div>
    {/if}
  </div>
</main>

<style>
  .background-pattern {
    background-image: linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
    background-size: 32px 32px;
  }
  
  .pb-footer {
    padding-bottom: 60px;
  }
  
  @media (max-width: 768px) {
    .pb-footer {
      padding-bottom: 80px;
    }
  }
</style>
