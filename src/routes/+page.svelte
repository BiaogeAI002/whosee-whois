<script lang="ts">
  import { onMount } from 'svelte';
  import SearchBox from '$lib/components/SearchBox.svelte';
  import StarField from '$lib/components/StarField.svelte';
  import { fade } from 'svelte/transition';
  import { whoisStore } from '$lib/stores/whois';
  import { dnsStore } from '$lib/stores/dns';
  
  // 订阅store
  $: whoisData = $whoisStore;
  $: dnsData = $dnsStore;
  
  let DomainResult;
  let DNSResult;
  let showResults = false;
  let activeTab = 'whois'; // 'whois' 或 'dns'
  
  // 懒加载结果组件
  onMount(async () => {
    DomainResult = (await import('$lib/components/DomainResult.svelte')).default;
    DNSResult = (await import('$lib/components/DNSResult.svelte')).default;
  });
  
  function handleSearch(event) {
    const { detail } = event;
    const domain = detail.query;
    
    // 只加载当前活动标签页所需的信息
    if (activeTab === 'whois' || !activeTab) {
      whoisStore.search(domain);
    } else if (activeTab === 'dns') {
      dnsStore.search(domain);
    }
    
    showResults = true;
  }
  
  function switchTab(tab) {
    activeTab = tab;
    
    // 当切换标签页时，如果数据尚未加载，则加载对应数据
    // 获取最新查询的域名，优先使用DNS查询的域名，因为它可能是最新的
    const latestDomain = dnsData?.domain || whoisData?.domain;
    if (latestDomain) {
      // 添加延迟以确保令牌已正确获取
      setTimeout(() => {
        if (tab === 'whois') {
          // 无论如何都查询当前域名的WHOIS信息
          whoisStore.search(latestDomain);
        } else if (tab === 'dns') {
          // 无论如何都查询当前域名的DNS记录
          dnsStore.search(latestDomain);
        }
      }, 100); // 短暂延迟以确保令牌处理完成
    }
  }
  // 获取当前年份
  const currentYear = new Date().getFullYear();
</script>

<svelte:head>
  <title>Whosee.me - 优雅的域名查询工具</title>
  <meta name="description" content="Whosee.me 是一个简单、优雅的域名查询工具，帮助您快速了解域名WHOIS信息和DNS记录。" />
</svelte:head>

<main class="min-h-screen bg-white relative overflow-hidden pb-footer">
  <div class="background-pattern absolute inset-0 opacity-5"></div>
  
  <div class="hero-section relative z-10 container mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center">
    <header class="brand-section text-center mb-12">
      <h1 class="text-5xl font-bold text-gray-800 mb-4">Whosee.me</h1>
      <p class="text-xl text-gray-600">优雅的域名查询工具</p>
    </header>
    
    <section class="search-section w-full max-w-2xl">
      <SearchBox on:search={handleSearch} />
    </section>
    
    {#if showResults && DomainResult && DNSResult}
      <div in:fade={{ duration: 300 }} class="w-full">
        <!-- 结果标签页 -->
        <div class="tabs-container mb-4 mt-8">
          <div class="tabs-header flex justify-center border-b border-gray-200">
            <button 
              class="tab-button px-6 py-3 font-medium {activeTab === 'whois' ? 'active-tab' : 'text-gray-500 hover:text-gray-800'} transition-colors" 
              on:click={() => switchTab('whois')}
            >
              WHOIS 信息
            </button>
            <button 
              class="tab-button px-6 py-3 font-medium {activeTab === 'dns' ? 'active-tab' : 'text-gray-500 hover:text-gray-800'} transition-colors" 
              on:click={() => switchTab('dns')}
            >
              DNS 记录
            </button>
          </div>
        </div>
        
        <!-- 标签页内容 -->
        {#if activeTab === 'whois'}
          <svelte:component this={DomainResult} />
        {:else if activeTab === 'dns'}
          <svelte:component this={DNSResult} />
        {/if}
      </div>
    {/if}
    
    <!-- 添加底部间距，确保内容不被footer遮挡 -->
    <div class="pb-16 md:pb-8"></div>
    
    <footer class="footer-section fixed bottom-0 left-0 right-0 p-4 text-center text-gray-600 bg-white/80 shadow-md border-t border-gray-200 z-50">
      <!-- 移动端不使用模糊效果 -->
      <div class="footer-blur hidden md:block absolute inset-0 backdrop-blur-sm -z-10"></div>
      <p class="text-sm">
        © {currentYear} Whosee.me | 
        <a href="/health" class="hover:text-gray-900 transition-colors mr-2">
          系统状态
        </a>
        <a href="https://github.com/AsisYu/domain-whois" target="_blank" rel="noopener" class="hover:text-gray-900 transition-colors">
          GitHub
        </a>
      </p>
    </footer>
  </div>
</main>

<style>
  .background-pattern {
    background-image: linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
    background-size: 32px 32px;
  }
  
  :global(html) {
    background-color: #ffffff;
  }
  
  .active-tab {
    @apply text-blue-700 font-bold border-b-2 border-blue-600 shadow-sm;
    position: relative;
  }
  
  /* 添加选择指示器 */
  .active-tab::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #2563eb; /* blue-600 */
    border-radius: 2px 2px 0 0;
  }
  
  /* 为底部添加足够的空间，防止内容被footer遮挡 */
  .pb-footer {
    padding-bottom: 60px; /* 默认底部间距 */
  }
  
  @media (max-width: 768px) {
    .hero-section {
      @apply py-8;
    }
    
    h1 {
      @apply text-4xl;
    }
    
    p {
      @apply text-lg;
    }
    
    /* 移动端增加更多底部间距 */
    .pb-footer {
      padding-bottom: 80px;
    }
  }
</style>
