<script lang="ts">
  export let nameServers: string[] = [];
  export let status: string[] = [];
  
  // 格式化状态
  function formatStatus(status: string): string {
    // 转换为小写并移除任何空格
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, '');
    
    const statusMap: Record<string, string> = {
      'clienttransferprohibited': '禁止转移',
      'clientupdateprohibited': '禁止更新',
      'clientdeleteprohibited': '禁止删除',
      'clienthold': '暂停解析',
      'servertransferprohibited': '服务商禁止转移',
      'serverupdateprohibited': '服务商禁止更新',
      'serverdeleteprohibited': '服务商禁止删除',
      'serverhold': '服务商暂停解析',
      'active': '正常',
      'inactive': '未激活',
      'pending': '待处理',
      'pendingdelete': '待删除',
      'pendingtransfer': '待转移',
      'pendingupdate': '待更新',
      'pendingcreate': '待创建'
    };
    return statusMap[normalizedStatus] || status;
  }
  
  // 获取状态标签的样式类
  function getStatusClass(status: string): string {
    // 转换为小写并移除任何空格
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, '');
    
    const statusClassMap: Record<string, string> = {
      'clienttransferprohibited': 'status-client-transfer',
      'clientupdateprohibited': 'status-client-update',
      'clientdeleteprohibited': 'status-client-delete',
      'clienthold': 'status-client-hold',
      'servertransferprohibited': 'status-server-transfer',
      'serverupdateprohibited': 'status-server-update',
      'serverdeleteprohibited': 'status-server-delete',
      'serverhold': 'status-server-hold',
      'active': 'status-active',
      'inactive': 'status-inactive',
      'pending': 'status-pending',
      'pendingdelete': 'status-pending-delete',
      'pendingtransfer': 'status-pending-transfer',
      'pendingupdate': 'status-pending-update',
      'pendingcreate': 'status-pending-create'
    };
    return statusClassMap[normalizedStatus] || 'status-default';
  }
</script>

<div class="domain-status">
  {#if nameServers?.length}
    <div class="info-item">
      <span class="label">域名服务器</span>
      <div class="value-list">
        {#each nameServers as ns}
          <span class="value-item">{ns}</span>
        {/each}
      </div>
    </div>
  {/if}
  
  {#if status?.length}
    <div class="info-item">
      <span class="label">域名状态</span>
      <div class="status-tags">
        {#each status as status}
          <span class="status-tag {getStatusClass(status)}">{formatStatus(status)}</span>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .domain-status {
    width: 100%;
    margin-top: 1.5rem;
    background-color: white;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
    border: 1px solid #f3f4f6;
    padding: 1.5rem;
  }
  
  .info-item {
    margin-bottom: 1.5rem;
  }
  
  .info-item:last-child {
    margin-bottom: 0;
  }
  
  .label {
    font-size: 0.85rem;
    color: #6b7280;
    margin-bottom: 0.75rem;
    display: block;
    font-weight: 500;
    letter-spacing: 0.02em;
  }
  
  .value-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .value-item {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1e40af;
    padding: 0.5rem 0.85rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(147, 197, 253, 0.4);
    transition: all 0.2s ease;
  }
  
  .value-item:hover {
    background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
    transform: translateY(-2px);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  }
  
  .status-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .status-tag {
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.4rem 0.9rem;
    border-radius: 9999px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    letter-spacing: 0.01em;
    white-space: nowrap;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
  }
  
  .status-tag:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  /* 客户端状态 */
  .status-client-transfer {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }
  
  .status-client-update {
    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  }
  
  .status-client-delete {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  }
  
  .status-client-hold {
    background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  }
  
  /* 服务商状态 */
  .status-server-transfer {
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  }
  
  .status-server-update {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  }
  
  .status-server-delete {
    background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  }
  
  .status-server-hold {
    background: linear-gradient(135deg, #d946ef 0%, #c026d3 100%);
  }
  
  /* 活动状态 */
  .status-active {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  }
  
  .status-inactive {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  }
  
  /* 待处理状态 */
  .status-pending {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  
  .status-pending-delete {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }
  
  .status-pending-transfer {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  }
  
  .status-pending-update {
    background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
  }
  
  .status-pending-create {
    background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%);
  }
  
  .status-default {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  }
  
  .status-warning {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  }
  
  /* 添加光泽动画效果 */
  .status-tag::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(0deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    transform: rotate(30deg);
    animation: shimmer 3s infinite;
  }
  
  @keyframes shimmer {
    0% {
      transform: translateX(-100%) rotate(30deg);
    }
    100% {
      transform: translateX(100%) rotate(30deg);
    }
  }
</style>
