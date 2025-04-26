<script lang="ts">
  import { onMount } from 'svelte';
  import { healthStore } from '$lib/stores/health.js';
  
  // 订阅健康数据
  $: healthData = $healthStore;
  
  // 自动加载详细健康数据
  onMount(() => {
    healthStore.checkDetailedHealth();
  });
  
  // 刷新健康数据
  function refreshHealth() {
    healthStore.checkDetailedHealth();
  }
  
  // 格式化时间
  function formatTime(timeString: string): string {
    try {
      const date = new Date(timeString);
      return date.toLocaleString();
    } catch (e) {
      return timeString;
    }
  }
  
  // 决定状态显示的样式
  function getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'up':
        return 'text-green-600 bg-green-100 border-green-300';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'down':
        return 'text-red-600 bg-red-100 border-red-300';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  }
  
  // 决定状态图标
  function getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'up':
        return '✓';
      case 'degraded':
        return '⚠';
      case 'down':
        return '✕';
      default:
        return '?';
    }
  }
</script>

<div class="health-result w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold text-gray-800">系统健康状态</h2>
    <button 
      on:click={refreshHealth} 
      class="refresh-button px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center transition-colors"
      disabled={healthData.loading}
    >
      {#if healthData.loading}
        <span class="loading-spinner mr-2"></span>
        更新中...
      {:else}
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        刷新
      {/if}
    </button>
  </div>
  
  {#if healthData.error}
    <div class="error-message bg-red-100 border border-red-300 text-red-700 p-4 rounded mb-6">
      <p><strong>获取健康状态失败:</strong> {healthData.error}</p>
    </div>
  {/if}
  
  {#if healthData.status}
    <!-- 总体信息 -->
    <div class="overview-section mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="status-card p-4 border rounded-lg flex-1 min-w-[180px]">
          <h3 class="text-gray-600 text-sm font-medium mb-2">总体状态</h3>
          <div class="flex items-center">
            <span class={`status-badge px-3 py-1 rounded-full text-sm font-medium border ${getStatusClass(healthData.status)}`}>
              <span class="mr-1">{getStatusIcon(healthData.status)}</span>
              {healthData.status.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div class="version-card p-4 border rounded-lg flex-1 min-w-[180px]">
          <h3 class="text-gray-600 text-sm font-medium mb-2">系统版本</h3>
          <p class="text-base font-medium text-gray-800">{healthData.version || 'N/A'}</p>
        </div>
        
        <div class="time-card p-4 border rounded-lg flex-1 min-w-[180px]">
          <h3 class="text-gray-600 text-sm font-medium mb-2">最近检查时间</h3>
          <p class="text-base font-medium text-gray-800">{formatTime(healthData.lastCheckTime || healthData.time || '')}</p>
        </div>
      </div>
    </div>
    
    <!-- WHOIS 服务健康状态 -->
    {#if healthData.services && healthData.services.whois}
      <div class="whois-section mb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">WHOIS 服务</h3>
        
        <div class="status-card p-4 border rounded-lg mb-4">
          <div class="flex justify-between items-center">
            <div>
              <h4 class="text-gray-700 font-semibold">服务状态</h4>
              <p class="text-gray-600 text-sm mt-1">
                可用: {healthData.services.whois.available}/{healthData.services.whois.total}
              </p>
            </div>
            <span class={`status-badge px-3 py-1 rounded-full text-sm font-medium border ${getStatusClass(healthData.services.whois.status)}`}>
              <span class="mr-1">{getStatusIcon(healthData.services.whois.status)}</span>
              {healthData.services.whois.status.toUpperCase()}
            </span>
          </div>
        </div>
        
        {#if healthData.services.whois.providers}
          <div class="providers-section">
            <h4 class="text-gray-700 font-semibold mb-2">提供商详情</h4>
            <div class="providers-table overflow-x-auto">
              <table class="min-w-full border-collapse">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">提供商</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">响应时间</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">调用计数</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">最近使用</th>
                  </tr>
                </thead>
                <tbody>
                  {#each Object.entries(healthData.services.whois.providers) as [provider, details]}
                    <tr class="border-t">
                      <td class="py-4 px-4 text-sm font-medium text-gray-800">{provider}</td>
                      <td class="py-4 px-4">
                        <span class={`status-badge px-2 py-1 rounded-full text-xs font-medium border ${getStatusClass(details.available ? 'up' : 'down')}`}>
                          <span class="mr-1">{getStatusIcon(details.available ? 'up' : 'down')}</span>
                          {details.available ? '可用' : '不可用'}
                        </span>
                      </td>
                      <td class="py-4 px-4 text-sm text-gray-600">
                        {details.responseTime ? `${details.responseTime}ms` : 'N/A'}
                      </td>
                      <td class="py-4 px-4 text-sm text-gray-600">
                        {details.callCount || 0} / 错误: {details.errorCount || 0}
                      </td>
                      <td class="py-4 px-4 text-sm text-gray-600">
                        {formatTime(details.lastUsed || '')}
                      </td>
                    </tr>
                    {#if details.testResults && details.testResults.length > 0}
                      <tr class="border-t bg-gray-50">
                        <td colspan="5" class="py-3 px-4">
                          <div class="test-results">
                            <h5 class="text-sm font-medium text-gray-700 mb-2">测试结果</h5>
                            {#each details.testResults as test}
                              <div class="test-result p-3 bg-white rounded border mb-2 last:mb-0">
                                <div class="flex justify-between">
                                  <span class="text-sm font-medium text-gray-800">域名: {test.domain}</span>
                                  <span class="text-xs text-gray-500">{formatTime(test.timestamp || '')}</span>
                                </div>
                                <p class="text-sm text-gray-600 mt-1">{test.message}</p>
                                {#if test.resultSummary}
                                  <div class="result-summary mt-2 text-xs text-gray-600">
                                    <p>创建日期: {test.resultSummary.creationDate || 'N/A'}</p>
                                    <p>到期日期: {test.resultSummary.expiryDate || 'N/A'}</p>
                                    <p>注册商: {test.resultSummary.registrar || 'N/A'}</p>
                                  </div>
                                {/if}
                              </div>
                            {/each}
                          </div>
                        </td>
                      </tr>
                    {/if}
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {/if}
      </div>
    {/if}
    
    <!-- DNS 服务健康状态 -->
    {#if healthData.services && healthData.services.dns}
      <div class="dns-section mb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">DNS 服务</h3>
        
        <div class="status-card p-4 border rounded-lg mb-4">
          <div class="flex justify-between items-center">
            <div>
              <h4 class="text-gray-700 font-semibold">服务状态</h4>
              <p class="text-gray-600 text-sm mt-1">
                可用: {healthData.services.dns.available}/{healthData.services.dns.total}
              </p>
            </div>
            <span class={`status-badge px-3 py-1 rounded-full text-sm font-medium border ${getStatusClass(healthData.services.dns.status)}`}>
              <span class="mr-1">{getStatusIcon(healthData.services.dns.status)}</span>
              {healthData.services.dns.status.toUpperCase()}
            </span>
          </div>
        </div>
        
        {#if healthData.services.dns.servers && healthData.services.dns.servers.length > 0}
          <div class="dns-servers-section">
            <h4 class="text-gray-700 font-semibold mb-2">DNS服务器详情</h4>
            <div class="dns-servers-table overflow-x-auto">
              <table class="min-w-full border-collapse">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">服务器</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">响应时间</th>
                  </tr>
                </thead>
                <tbody>
                  {#each healthData.services.dns.servers as server}
                    <tr class="border-t">
                      <td class="py-4 px-4 text-sm font-medium text-gray-800">{server.name}</td>
                      <td class="py-4 px-4">
                        <span class={`status-badge px-2 py-1 rounded-full text-xs font-medium border ${getStatusClass(server.status)}`}>
                          <span class="mr-1">{getStatusIcon(server.status)}</span>
                          {server.status.toUpperCase()}
                        </span>
                      </td>
                      <td class="py-4 px-4 text-sm text-gray-600">
                        {server.responseTime ? `${server.responseTime}ms` : 'N/A'}
                      </td>
                    </tr>
                    {#if server.testResults && server.testResults.length > 0}
                      <tr class="border-t bg-gray-50">
                        <td colspan="3" class="py-3 px-4">
                          <div class="test-results">
                            <h5 class="text-sm font-medium text-gray-700 mb-2">测试结果</h5>
                            {#each server.testResults as test}
                              <div class="test-result p-3 bg-white rounded border mb-2 last:mb-0">
                                <div class="flex justify-between">
                                  <span class="text-sm font-medium text-gray-800">域名: {test.domain}</span>
                                  <span class="text-xs text-gray-500">{formatTime(test.timestamp || '')}</span>
                                </div>
                                <p class="text-sm text-gray-600 mt-1">{test.message}</p>
                                {#if test.ips && test.ips.length > 0}
                                  <div class="mt-2 text-xs text-gray-600">
                                    <p>解析IP: {test.ips.join(', ')}</p>
                                    <p>响应时间: {test.responseTime}ms</p>
                                  </div>
                                {/if}
                              </div>
                            {/each}
                          </div>
                        </td>
                      </tr>
                    {/if}
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {/if}
      </div>
    {/if}
    
    <!-- 截图服务健康状态 -->
    {#if healthData.services && healthData.services.screenshot}
      <div class="screenshot-section mb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">截图服务</h3>
        
        <div class="status-card p-4 border rounded-lg mb-4">
          <div class="flex justify-between items-center">
            <div>
              <h4 class="text-gray-700 font-semibold">服务状态</h4>
              <p class="text-gray-600 text-sm mt-1">
                可用: {healthData.services.screenshot.available}/{healthData.services.screenshot.total}
              </p>
            </div>
            <span class={`status-badge px-3 py-1 rounded-full text-sm font-medium border ${getStatusClass(healthData.services.screenshot.status)}`}>
              <span class="mr-1">{getStatusIcon(healthData.services.screenshot.status)}</span>
              {healthData.services.screenshot.status.toUpperCase()}
            </span>
          </div>
        </div>
        
        {#if healthData.services.screenshot.servers && healthData.services.screenshot.servers.length > 0}
          <div class="screenshot-servers">
            {#each healthData.services.screenshot.servers as server}
              <div class="server-details p-4 border rounded-lg mb-4">
                <h4 class="text-gray-700 font-semibold mb-3">{server.name}</h4>
                
                {#if server.testResults && server.testResults.length > 0}
                  <div class="test-results">
                    <h5 class="text-sm font-medium text-gray-700 mb-2">测试结果</h5>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {#each server.testResults as test}
                        <div class="test-result p-3 bg-gray-50 rounded border">
                          <div class="flex justify-between">
                            <span class="text-sm font-medium text-gray-800">{test.url}</span>
                            <span class={`status-badge px-2 py-1 rounded-full text-xs font-medium border ${getStatusClass(test.success ? 'up' : 'down')}`}>
                              {test.success ? '可访问' : '不可访问'}
                            </span>
                          </div>
                          <div class="mt-2 text-xs text-gray-600">
                            <p>状态码: {test.statusCode}</p>
                            <p>响应时间: {test.responseTime}ms</p>
                            <p>测试时间: {formatTime(test.timestamp || '')}</p>
                          </div>
                          {#if test.message}
                            <p class="mt-1 text-sm text-gray-600">{test.message}</p>
                          {/if}
                        </div>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
    
    <!-- ITDog服务健康状态 -->
    {#if healthData.services && healthData.services.itdog}
      <div class="itdog-section mb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ITDog 测速服务</h3>
        
        <div class="status-card p-4 border rounded-lg mb-4">
          <div class="flex justify-between items-center">
            <div>
              <h4 class="text-gray-700 font-semibold">服务状态</h4>
              <p class="text-gray-600 text-sm mt-1">
                可用: {healthData.services.itdog.available}/{healthData.services.itdog.total}
              </p>
            </div>
            <span class={`status-badge px-3 py-1 rounded-full text-sm font-medium border ${getStatusClass(healthData.services.itdog.status)}`}>
              <span class="mr-1">{getStatusIcon(healthData.services.itdog.status)}</span>
              {healthData.services.itdog.status.toUpperCase()}
            </span>
          </div>
        </div>
        
        {#if healthData.services.itdog.servers && healthData.services.itdog.servers.length > 0}
          <div class="itdog-servers">
            {#each healthData.services.itdog.servers as server}
              <div class="server-details p-4 border rounded-lg mb-4">
                <h4 class="text-gray-700 font-semibold mb-2">{server.name}</h4>
                <div class="status-info flex items-center mb-3">
                  <span class="text-gray-600 text-sm mr-3">状态:</span>
                  <span class={`status-badge px-2 py-1 rounded-full text-xs font-medium border ${getStatusClass(server.status)}`}>
                    <span class="mr-1">{getStatusIcon(server.status)}</span>
                    {server.status.toUpperCase()}
                  </span>
                </div>
                
                {#if server.responseTime}
                  <div class="mb-3">
                    <span class="text-gray-600 text-sm">响应时间: </span>
                    <span class="text-gray-800 font-medium">{server.responseTime}ms</span>
                  </div>
                {/if}
                
                {#if server.testResults && server.testResults.length > 0}
                  <div class="test-results">
                    <h5 class="text-sm font-medium text-gray-700 mb-2">测试结果</h5>
                    {#each server.testResults as test}
                      <div class="test-result p-3 bg-gray-50 rounded border mb-2 last:mb-0">
                        <div class="flex justify-between">
                          <span class="text-sm font-medium text-gray-800">{test.url || '请求测试'}</span>
                          <span class="text-xs text-gray-500">{formatTime(test.timestamp || '')}</span>
                        </div>
                        <div class="mt-2 text-xs text-gray-600">
                          <p>响应时间: {test.responseTime}ms</p>
                        </div>
                        {#if test.message}
                          <p class="mt-2 text-sm text-gray-600">{test.message}</p>
                        {/if}
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  {:else if healthData.loading}
    <div class="loading-section py-12 text-center">
      <div class="loading-spinner mx-auto mb-4"></div>
      <p class="text-gray-600">正在加载健康状态...</p>
    </div>
  {:else}
    <div class="empty-state py-12 text-center">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="text-gray-600">暂无健康状态数据，请点击刷新按钮重试。</p>
    </div>
  {/if}
</div>

<style>
  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(59, 130, 246, 0.3);
    border-radius: 50%;
    border-top-color: rgb(59, 130, 246);
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
</style>
