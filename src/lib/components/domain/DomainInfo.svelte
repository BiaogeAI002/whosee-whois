<script lang="ts">
  import Badge from '../common/Badge.svelte';
  
  export let result: any;
  
  // 获取域名状态
  function getDomainStatus(result: any): { type: 'unknown' | 'available' | 'registered' | 'new-registered'; text: string } {
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
  
  // 格式化日期
  function formatDate(date: string | null): string {
    if (!date) return '未知';
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // 计算域名年龄
  function calculateDomainAge(creationDate: string | null): string {
    if (!creationDate) return '未知';
    const created = new Date(creationDate);
    const now = new Date();
    const years = now.getFullYear() - created.getFullYear();
    const months = now.getMonth() - created.getMonth();
    
    if (years > 0) {
      return `${years}年${months > 0 ? months + '个月' : ''}`;
    }
    return `${months}个月`;
  }
  
  // 计算到期时间
  function calculateExpiryTime(expiryDate: string | null): string {
    if (!expiryDate) return '未知';
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '已过期';
    if (diffDays === 0) return '今天到期';
    if (diffDays <= 30) return `剩余 ${diffDays} 天`;
    
    // 更精确的月份计算
    const months = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;
    
    let result = '';
    if (months > 0) {
      result += `${months}个月`;
      if (remainingDays > 0) result += ` ${remainingDays}天`;
    } else {
      result += `${remainingDays}天`;
    }
    
    return `剩余 ${result}`;
  }
  
  // 获取到期时间样式类
  function getExpiryClass(expiryDate: string | null): string {
    if (!expiryDate) return 'expiry-unknown';
    
    const days = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'expiry-expired';
    if (days <= 30) return 'expiry-urgent';
    if (days <= 90) return 'expiry-warning';
    return 'expiry-safe';
  }
  
  // 获取日期状态样式类
  function getDatePillClass(date: string | null): string {
    if (!date) return 'pill-unknown';
    
    const dateObj = new Date(date);
    const now = new Date();
    const diffYears = now.getFullYear() - dateObj.getFullYear();
    
    if (diffYears < 1) return 'pill-new';
    if (diffYears < 3) return 'pill-recent';
    if (diffYears < 5) return 'pill-established';
    return 'pill-old';
  }
  
  // 获取注册商样式类
  function getRegistrarPillClass(registrar: string | null): string {
    if (!registrar) return 'pill-unknown';
    
    const popularRegistrars = [
      'GoDaddy', 'Namecheap', 'Cloudflare', 'Google', 'Amazon', 
      'Alibaba', 'Tencent', '阿里云', '腾讯云', '华为云'
    ];
    
    for (const popular of popularRegistrars) {
      if (registrar.includes(popular)) return 'pill-popular';
    }
    
    return 'pill-standard';
  }
</script>

<div class="domain-info">
  <div class="result-header">
    <h2 class="domain-name">{result.domain}</h2>
    <Badge {...getDomainStatus(result)} />
  </div>
  
  {#if result.registered}
    <div class="info-grid">
      <div class="info-item">
        <span class="label">注册时间</span>
        <span class="value">
          {formatDate(result.creationDate)}
          <span class="pill {getDatePillClass(result.creationDate)}">
            {result.creationDate ? new Date(result.creationDate).getFullYear() : '未知'}
          </span>
        </span>
      </div>
      
      <div class="info-item">
        <span class="label">到期时间</span>
        <span class="value">
          {formatDate(result.expiryDate)}
          <span class="pill {getExpiryClass(result.expiryDate)}">
            {calculateExpiryTime(result.expiryDate)}
          </span>
        </span>
      </div>
      
      <div class="info-item">
        <span class="label">域名年龄</span>
        <span class="value">
          {calculateDomainAge(result.creationDate)}
          <span class="pill {getDatePillClass(result.creationDate)}">
            {result.creationDate ? '已注册' : '未知'}
          </span>
        </span>
      </div>
      
      <div class="info-item">
        <span class="label">更新时间</span>
        <span class="value">
          {formatDate(result.lastUpdated)}
          <span class="pill {getDatePillClass(result.lastUpdated)}">
            {result.lastUpdated ? '最近更新' : '未知'}
          </span>
        </span>
      </div>
      
      {#if result.registrar}
        <div class="info-item">
          <span class="label">注册商</span>
          <span class="value">
            {result.registrar}
            <span class="pill {getRegistrarPillClass(result.registrar)}">
              {result.registrar ? '注册商' : '未知'}
            </span>
          </span>
        </div>
      {/if}
    </div>
  {:else}
    <div class="empty-state">
      <p>该域名尚未被注册，立即注册以获得所有权！</p>
      <a href="https://www.namesilo.com/register.php?domain={result.domain}" target="_blank" rel="noopener" class="register-btn">
        立即注册
      </a>
    </div>
  {/if}
</div>

<style>
  .domain-info {
    width: 100%;
    background-color: white;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
    border: 1px solid #f3f4f6;
    padding: 1.5rem;
  }
  
  .result-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.75rem;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .domain-name {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1f2937;
    word-break: break-all;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    letter-spacing: -0.02em;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  @media (min-width: 768px) {
    .info-grid {
      grid-template-columns: 1fr 1fr;
    }
    
    .registrar-item {
      grid-column: span 2;
    }
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    padding: 1.25rem;
    background-color: white;
    border-radius: 0.75rem;
    border: 1px solid #f3f4f6;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }
  
  .info-item:hover {
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05);
    background-color: white;
    transform: translateY(-2px);
  }
  
  .label {
    font-size: 0.85rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
    font-weight: 500;
    letter-spacing: 0.02em;
  }
  
  .value {
    font-size: 1.125rem;
    color: #1f2937;
    font-weight: 600;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
    line-height: 1.4;
  }
  
  .pill {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.35rem 0.85rem;
    border-radius: 9999px;
    color: white;
    display: inline-flex;
    align-items: center;
    letter-spacing: 0.02em;
    white-space: nowrap;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  }
  
  /* 到期时间样式 */
  .expiry-expired {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }
  
  .expiry-urgent {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  }
  
  .expiry-warning {
    background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
  }
  
  .expiry-safe {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  }
  
  .expiry-unknown {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  }
  
  /* 日期药丸样式 */
  .pill-new {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }
  
  .pill-recent {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  }
  
  .pill-established {
    background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
  }
  
  .pill-old {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    position: relative;
    overflow: hidden;
  }
  
  .pill-old::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(0deg, transparent, rgba(255, 255, 255, 0.2), transparent);
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
  
  .pill-unknown {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  }
  
  /* 注册商药丸样式 */
  .pill-popular {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    position: relative;
    overflow: hidden;
  }
  
  .pill-popular::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(0deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: rotate(30deg);
    animation: shimmer 3s infinite;
  }
  
  .pill-standard {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
  
  .empty-state {
    text-align: center;
    padding: 2.5rem 1rem;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 0.75rem;
    border: 1px dashed #d1d5db;
  }
  
  .register-btn {
    margin-top: 1.25rem;
    display: inline-block;
    padding: 0.65rem 1.75rem;
    background: linear-gradient(to right, #22c55e, #14b8a6);
    color: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);
    font-weight: 600;
    transition: all 0.3s;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  }
  
  .register-btn:hover {
    background: linear-gradient(to right, #16a34a, #0d9488);
    box-shadow: 0 4px 8px rgba(34, 197, 94, 0.4);
    transform: translateY(-2px);
  }
</style>
