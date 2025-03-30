<script lang="ts">
  import { onMount } from 'svelte';
  import SearchBox from '$lib/components/SearchBox.svelte';
  import StarField from '$lib/components/StarField.svelte';
  import { fade } from 'svelte/transition';
  import { whoisStore } from '$lib/stores/whois';
  
  let DomainResult;
  let showResults = false;
  
  // 懒加载结果组件
  onMount(async () => {
    DomainResult = (await import('$lib/components/DomainResult.svelte')).default;
  });
  
  function handleSearch(event) {
    const { detail } = event;
    whoisStore.search(detail.query);
    showResults = true;
  }
</script>

<svelte:head>
  <title>Whosee.me - 优雅的WHOIS查询工具</title>
  <meta name="description" content="Whosee.me 是一个简单、优雅的WHOIS域名查询工具，帮助您快速了解域名注册状态、年龄和到期时间等信息。" />
</svelte:head>

<main class="min-h-screen bg-white relative overflow-hidden">
  <div class="background-pattern absolute inset-0 opacity-5"></div>
  
  <div class="hero-section relative z-10 container mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center">
    <header class="brand-section text-center mb-12">
      <h1 class="text-5xl font-bold text-gray-800 mb-4">Whosee.me</h1>
      <p class="text-xl text-gray-600">优雅的WHOIS查询工具</p>
    </header>
    
    <section class="search-section w-full max-w-2xl">
      <SearchBox on:search={handleSearch} />
    </section>
    
    {#if showResults && DomainResult}
      <div in:fade={{ duration: 300 }} class="w-full">
        <svelte:component this={DomainResult} />
      </div>
    {/if}
    
    <footer class="footer-section fixed bottom-0 left-0 right-0 p-4 text-center text-gray-600 bg-white/80 shadow-md border-t border-gray-200">
      <!-- 移动端不使用模糊效果 -->
      <div class="footer-blur hidden md:block absolute inset-0 backdrop-blur-sm -z-10"></div>
      <p class="text-sm">
        © 2024 Whosee.me | 
        <a href="https://github.com/your-username/whosee-whois" target="_blank" rel="noopener" class="hover:text-gray-900 transition-colors">
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
  }
</style>
