<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  let query = '';
  let searchHistory: string[] = [];
  
  onMount(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      searchHistory = JSON.parse(storedHistory);
    }
  });
  
  function handleSearch() {
    if (!query.trim()) return;
    
    // 添加到搜索历史
    if (!searchHistory.includes(query)) {
      searchHistory = [query, ...searchHistory].slice(0, 5);
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    
    dispatch('search', { query });
  }
  
  function clearInput() {
    query = '';
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
      class="w-full px-4 py-3 pl-12 text-lg bg-gray-100 rounded-full border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
      on:click={handleSearch}
    >
      搜索
    </button>
  </div>
  
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