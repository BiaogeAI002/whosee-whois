<script lang="ts">
  export let result: any;
</script>

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

<style>
  .query-meta {
    @apply mt-6 border-t border-gray-200 pt-4;
  }
  
  .meta-pills {
    @apply flex flex-wrap gap-2;
  }
  
  .meta-pill {
    @apply inline-flex items-center bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full;
  }
  
  .meta-label {
    @apply font-medium mr-1;
  }
  
  .meta-cached {
    @apply bg-amber-100 text-amber-700;
  }
  
  .meta-uncached {
    @apply bg-blue-100 text-blue-700;
  }
</style>
