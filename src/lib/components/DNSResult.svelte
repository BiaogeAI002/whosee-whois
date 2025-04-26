<script lang="ts">
  import { onMount } from 'svelte';
  import Badge from './common/Badge.svelte';
  import { dnsStore } from '$lib/stores/dns';
  import { fade, fly } from 'svelte/transition';
  
  // 使用$语法创建响应式订阅
  $: result = $dnsStore;
  
  // 获取DNS记录类型的颜色
  function getDNSTypeColor(type: string): string {
    const typeColorMap: Record<string, string> = {
      'A': 'dns-type-a',
      'AAAA': 'dns-type-aaaa',
      'MX': 'dns-type-mx',
      'NS': 'dns-type-ns',
      'TXT': 'dns-type-txt',
      'CNAME': 'dns-type-cname',
      'SOA': 'dns-type-soa',
      'PTR': 'dns-type-ptr',
      'SRV': 'dns-type-srv',
      'CAA': 'dns-type-caa'
    };
    return typeColorMap[type] || 'dns-type-default';
  }
  
  // 格式化DNS记录类型名称
  function formatDNSType(type: string): string {
    const typeDescMap: Record<string, string> = {
      'A': 'A (IPv4地址)',
      'AAAA': 'AAAA (IPv6地址)',
      'MX': 'MX (邮件服务器)',
      'NS': 'NS (域名服务器)',
      'TXT': 'TXT (文本记录)',
      'CNAME': 'CNAME (别名)',
      'SOA': 'SOA (起始授权)',
      'PTR': 'PTR (指针)',
      'SRV': 'SRV (服务)',
      'CAA': 'CAA (证书授权)'
    };
    return typeDescMap[type] || type;
  }
  
  // 格式化DNS记录值
  function formatDNSValue(record: any): string {
    // 如果是MX记录，添加优先级信息
    if (record.type === 'MX' && record.priority !== undefined) {
      return `${record.value} (优先级: ${record.priority})`;
    }
    return record.value;
  }
</script>

<div class="dns-result-container" in:fade={{ duration: 300 }}>
  {#if result.loading}
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在查询DNS记录...</p>
    </div>
  {:else if result.error}
    <div class="error-state">
      <p class="error-text">查询失败: {result.error}</p>
      <button class="retry-btn" on:click={() => dnsStore.search(result.domain)}>重试</button>
    </div>
  {:else if result.records && result.records.length > 0}
    <div class="result-header">
      <h2 class="domain-name">{result.domain} 的DNS记录</h2>
      <Badge type="info" text={`共 ${result.records.length} 条记录`} />
    </div>
    
    <div class="dns-records">
      {#each result.records as record, i}
        <div class="dns-record" in:fly={{ y: 20, delay: i * 30, duration: 300 }}>
          <div class="record-type {getDNSTypeColor(record.type)}">
            {record.type}
          </div>
          <div class="record-value">
            <div class="value-text">{formatDNSValue(record)}</div>
            <div class="record-info">
              <span class="record-type-desc">{formatDNSType(record.type)}</span>
              {#if 'ttl' in record}
                <span class="record-ttl">TTL: {record.ttl}秒</span>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    {#if !result.loading && !result.error && result.records.length > 0}
      <div class="query-meta">
        <div class="meta-pills">
          <span class="meta-pill">
            <span class="meta-label">查询时间:</span>
            <span class="meta-value">{result.queryTime}</span>
          </span>
          {#if result.queryDuration !== null}
            <span class="meta-pill speed">
              <span class="meta-label">查询耗时:</span>
              <span class="meta-value">{result.queryDuration}ms</span>
            </span>
          {/if}
          {#if result.isCached}
            <span class="meta-pill cached">
              <span class="meta-label">缓存:</span>
              <span class="meta-value">命中 ({result.cacheTime})</span>
            </span>
          {:else}
            <span class="meta-pill no-cache">
              <span class="meta-label">缓存:</span>
              <span class="meta-value">未命中</span>
            </span>
          {/if}
        </div>
      </div>
    {:else if !result.loading && !result.error && result.records.length === 0}
      <div class="no-records">
        <p>未找到DNS记录</p>
      </div>
    {/if}
  {:else if !result.loading && !result.error}
    <div class="no-records">
      <p>未找到DNS记录</p>
    </div>
  {/if}
</div>

<style>
  .dns-result-container {
    width: 100%;
    max-width: 4xl;
    margin: 2rem auto;
    padding: 1.75rem;
    background: white;
    border-radius: 1rem;
    border: 1px solid rgba(226, 232, 240, 0.9);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
    transition: all 0.3s ease;
  }
  
  .result-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.75rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(226, 232, 240, 0.7);
  }
  
  .domain-name {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    letter-spacing: -0.02em;
  }
  
  .dns-records {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
  
  .dns-record {
    display: flex;
    align-items: flex-start;
    padding: 1.25rem;
    background-color: white;
    border-radius: 0.75rem;
    border: 1px solid rgba(226, 232, 240, 0.9);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02);
    transition: all 0.3s ease;
  }
  
  .dns-record:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
  }
  
  .record-type {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    min-width: 3.5rem;
    height: 2rem;
    padding: 0 1rem;
    margin-right: 1rem;
    font-weight: 600;
    font-size: 0.875rem;
    border-radius: 0.5rem;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  }
  
  /* DNS记录类型特定样式 */
  .dns-type-a {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: 1px solid rgba(59, 130, 246, 0.2);
  }
  
  .dns-type-aaaa {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    border: 1px solid rgba(99, 102, 241, 0.2);
  }
  
  .dns-type-mx {
    background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
    border: 1px solid rgba(168, 85, 247, 0.2);
  }
  
  .dns-type-ns {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    border: 1px solid rgba(34, 197, 94, 0.2);
  }
  
  .dns-type-txt {
    background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
    border: 1px solid rgba(234, 179, 8, 0.2);
  }
  
  .dns-type-cname {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    border: 1px solid rgba(249, 115, 22, 0.2);
  }
  
  .dns-type-soa {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border: 1px solid rgba(239, 68, 68, 0.2);
  }
  
  .dns-type-ptr {
    background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
    border: 1px solid rgba(236, 72, 153, 0.2);
  }
  
  .dns-type-srv {
    background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
    border: 1px solid rgba(20, 184, 166, 0.2);
  }
  
  .dns-type-caa {
    background: linear-gradient(135deg, #64748b 0%, #475569 100%);
    border: 1px solid rgba(100, 116, 139, 0.2);
  }
  
  .dns-type-default {
    background: linear-gradient(135deg, #64748b 0%, #475569 100%);
    border: 1px solid rgba(100, 116, 139, 0.2);
  }
  
  .record-value {
    flex: 1;
  }
  
  .value-text {
    color: #334155;
    font-weight: 500;
    word-break: break-all;
    line-height: 1.5;
  }
  
  .record-info {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #64748b;
  }
  
  .record-type-desc {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background-color: rgba(226, 232, 240, 0.9);
    color: #1e293b;
    border-radius: 0.375rem;
    font-weight: 500;
  }
  
  .record-ttl {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background-color: rgba(219, 234, 254, 0.9);
    color: #1e293b;
    border-radius: 0.375rem;
    font-weight: 500;
  }
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 0;
  }
  
  .loading-spinner {
    width: 3rem;
    height: 3rem;
    border: 0.25rem solid rgba(59, 130, 246, 0.2);
    border-top: 0.25rem solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .loading-text {
    color: #64748b;
    font-weight: 500;
  }
  
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 0;
  }
  
  .error-text {
    color: #ef4444;
    margin-bottom: 1rem;
    font-weight: 500;
  }
  
  .retry-btn {
    padding: 0.5rem 1.5rem;
    background: linear-gradient(to right, #3b82f6, #2563eb);
    color: white;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  }
  
  .retry-btn:hover {
    background: linear-gradient(to right, #2563eb, #1d4ed8);
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.4);
  }
  
  .no-records {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem 0;
    color: #64748b;
    font-weight: 500;
    background-color: rgba(248, 250, 252, 0.5);
    border-radius: 0.75rem;
    border: 1px dashed #cbd5e1;
  }
  
  .query-meta {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(226, 232, 240, 0.7);
  }
  
  .meta-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .meta-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.875rem;
    background-color: rgba(241, 245, 249, 0.9);
    color: #1e293b;
    border-radius: 9999px;
    font-size: 0.75rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
  }
  
  .meta-pill:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  }
  
  .meta-pill.cached {
    background: linear-gradient(135deg, rgba(187, 247, 208, 0.9) 0%, rgba(134, 239, 172, 0.9) 100%);
    color: #064e3b;
  }
  
  .meta-pill.speed {
    background: linear-gradient(135deg, rgba(224, 231, 255, 0.9) 0%, rgba(199, 210, 254, 0.9) 100%);
    color: #1e3a8a;
  }
  
  .meta-pill.no-cache {
    background: linear-gradient(135deg, rgba(254, 226, 226, 0.9) 0%, rgba(254, 202, 202, 0.9) 100%);
    color: #7f1d1d;
  }
  
  .meta-label {
    font-weight: 600;
    margin-right: 0.25rem;
  }
  
  .meta-value {
    color: inherit;
    opacity: 0.9;
  }
</style>
