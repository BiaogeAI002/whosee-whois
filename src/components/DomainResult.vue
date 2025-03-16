<!--
 * @Author: AsisYu 2773943729@qq.com
 * @Date: 2025-01-16 22:26:40
 * @LastEditors: AsisYu 2773943729@qq.com
 * @LastEditTime: 2025-01-18 22:10:04
 * @FilePath: \dmainwhoseek\src\components\DomainResult.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="domain-result" :class="{ loading: props.loading }">
    <div class="result-container" :class="{ 'is-visible': isVisible }">
      <!-- 加载状态 -->
      <div v-if="props.loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在查询域名信息...</p>
      </div>

      <!-- 结果内容 -->
      <template v-else>
        <div class="result-header">
          <div class="domain-info">
            <h2 class="domain-name">{{ props.query }}</h2>
            <div class="query-details">
              <span class="query-time">查询时间: {{ queryTime }}</span>
              <span class="query-duration" v-if="props.queryDuration">
                · 耗时: {{ formatDuration(props.queryDuration) }}
              </span>
            </div>
          </div>
          <div class="status-badge" :class="getDomainStatusBadge(props.results).class">
            {{ getDomainStatusBadge(props.results).text }}
          </div>
        </div>

        <div class="result-content" v-show="isVisible">
          <!-- 基本信息 -->
          <div class="info-section">
            <h3>基本信息</h3>
            <div class="info-grid">
              <!-- 第一行：创建时间和到期时间 -->
              <div class="info-item">
                <div class="info-label">创建时间</div>
                <div class="info-value">{{ formatDate(props.results.creationDate) }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">到期时间</div>
                <div class="info-value">
                  {{ formatDate(props.results.expiryDate) }}
                  <div class="expiry-time" :class="getExpiryClass(props.results.expiryDate)">
                    {{ calculateExpiryTime(props.results.expiryDate) }}
                  </div>
                </div>
              </div>

              <!-- 第二行：域名年龄和更新时间 -->
              <div class="info-item">
                <div class="info-label">域名年龄</div>
                <div class="info-value domain-age" 
                     :class="getAgeClass(new Date(props.results.creationDate).getFullYear())"
                     :title="`创建于 ${formatDate(props.results.creationDate)}`">
                  {{ calculateDomainAge(props.results.creationDate) }}
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">更新时间</div>
                <div class="info-value">
                  {{ props.results.updatedDate ? formatDate(props.results.updatedDate) : '暂无数据' }}
                </div>
              </div>
            </div>
          </div>

          <!-- 其他信息部分 -->
          <div class="info-section" v-if="props.results.registrar">
            <h3>其他信息</h3>
            <div class="info-grid">
              <div class="info-item" v-if="props.results.registrar">
                <div class="info-label">注册商</div>
                <div class="info-value">{{ props.results.registrar }}</div>
              </div>
              <!-- 其他信息项... -->
            </div>
          </div>

          <!-- 域名服务器 -->
          <div class="info-section" v-if="props.results.nameServers && props.results.nameServers.length">
            <h3>域名服务器</h3>
            <div class="name-servers">
              <div class="ns-item" v-for="(ns, index) in props.results.nameServers" :key="index">
                {{ ns }}
              </div>
            </div>
          </div>

          <!-- 域名状态 -->
          <div class="info-section" v-if="props.results.status && props.results.status.length">
            <h3>域名状态</h3>
            <div class="status-tags">
              <div class="status-tag" v-for="(status, index) in props.results.status" :key="index">
                {{ formatStatus(status) }}
              </div>
            </div>
          </div>

          <!-- 注册人信息部分 -->
          <div class="info-section" v-if="props.results.registrant">
            <h3>注册人信息</h3>
            <div class="info-grid">
              <div class="info-item" v-if="props.results.registrant.name">
                <div class="info-label">姓名</div>
                <div class="info-value">{{ props.results.registrant.name }}</div>
              </div>
              <div class="info-item" v-if="props.results.registrant.organization">
                <div class="info-label">组织</div>
                <div class="info-value">{{ props.results.registrant.organization }}</div>
              </div>
              <div class="info-item" v-if="props.results.registrant.email">
                <div class="info-label">邮箱</div>
                <div class="info-value">{{ props.results.registrant.email }}</div>
              </div>
              <div class="info-item" v-if="props.results.registrant.phone">
                <div class="info-label">电话</div>
                <div class="info-value">{{ props.results.registrant.phone }}</div>
              </div>
              <div class="info-item location-info" v-if="hasLocation(props.results.registrant)">
                <div class="info-label">地址</div>
                <div class="info-value">
                  {{ formatLocation(props.results.registrant) }}
                </div>
              </div>
            </div>
          </div>

          <!-- 技术信息部分 -->
          <div class="info-section" v-if="props.results.whoisServer || props.results.contactEmail">
            <h3>技术信息</h3>
            <div class="info-grid">
              <div class="info-item" v-if="props.results.whoisServer">
                <div class="info-label">WHOIS服务器</div>
                <div class="info-value">{{ props.results.whoisServer }}</div>
              </div>
              <div class="info-item" v-if="props.results.contactEmail">
                <div class="info-label">联系邮箱</div>
                <div class="info-value">{{ props.results.contactEmail }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  query: String,
  results: {
    type: Object,
    default: () => ({
      creationDate: null,
      expiryDate: null,
      updatedDate: null,
      registrar: null,
      nameServers: [],
      status: []
    })
  },
  loading: Boolean,
  queryDuration: Number
})

const formatDate = (date) => {
  if (!date) return '暂无数据'
  try {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (e) {
    return '数据格式错误'
  }
}

const formatStatus = (status) => {
  const statusMap = {
    'clientTransferProhibited': '禁止转移',
    'clientUpdateProhibited': '禁止更新',
    'clientDeleteProhibited': '禁止删除',
    'clientHold': '暂停解析',
    'serverTransferProhibited': '服务商禁止转移',
    'serverUpdateProhibited': '服务商禁止更新',
    'serverDeleteProhibited': '服务商禁止删除',
    'serverHold': '服务商暂停解析',
    'active': '正常',
    'inactive': '未激活',
    'pending': '待处理',
    'pendingDelete': '待删除',
    'pendingTransfer': '待转移',
    'pendingUpdate': '待更新',
    'pendingCreate': '待创建'
  }
  return statusMap[status] || status
}

// 判断是否为新注册域名（30天内注册）
const isNewlyRegistered = (creationDate) => {
  if (!creationDate) return false
  const created = new Date(creationDate)
  const now = new Date()
  const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24))
  return diffDays <= 30
}

// 获取域名状态标签
const getDomainStatusBadge = (results) => {
  if (!results) return { text: '未知', class: 'unknown' }
  
  if (results.available) {
    return { text: '可注册', class: 'available' }
  }
  
  if (isNewlyRegistered(results.creationDate)) {
    return { text: '新注册', class: 'new-registered' }
  }
  
  return { text: '已注册', class: 'registered' }
}

// 计算域名年龄
const calculateDomainAge = (creationDate) => {
  if (!creationDate) return null
  
  const created = new Date(creationDate)
  const now = new Date()
  
  const diffTime = Math.abs(now - created)
  const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365))
  const months = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
  const days = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
  
  let age = ''
  if (years > 0) age += `${years}年`
  if (months > 0) age += `${months}个月`
  if (days > 0) age += `${days}天`
  
  return age || '新注册'
}

// 获取年龄标签的样式类
const getAgeClass = (years) => {
  if (!years) return 'age-new'
  if (years < 1) return 'age-young'
  if (years < 3) return 'age-medium'
  if (years < 5) return 'age-mature'
  return 'age-old'
}

// 计算到期剩余时间
const calculateExpiryTime = (expiryDate) => {
  if (!expiryDate) return null
  
  const expiry = new Date(expiryDate)
  const now = new Date()
  
  const diffTime = expiry - now
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (days < 0) return '已过期'
  if (days === 0) return '今天到期'
  if (days <= 30) return `剩余 ${days} 天`
  
  const months = Math.floor(days / 30)
  const remainingDays = days % 30
  
  let result = ''
  if (months > 0) result += `${months}个月`
  if (remainingDays > 0) result += `${remainingDays}天`
  
  return `剩余 ${result}`
}

// 获取到期时间状态样式
const getExpiryClass = (expiryDate) => {
  if (!expiryDate) return 'expiry-unknown'
  
  const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
  
  if (days < 0) return 'expiry-expired'
  if (days <= 30) return 'expiry-urgent'
  if (days <= 90) return 'expiry-warning'
  return 'expiry-safe'
}

// 格式化查询时间
const formatQueryTime = () => {
  return new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 保存查询时间
const queryTime = formatQueryTime()

// 添加格式化耗时的函数
const formatDuration = (duration) => {
  if (!duration) return ''
  return duration < 1000 
    ? `${duration}ms`
    : `${(duration / 1000).toFixed(2)}s`
}

// 检查是否有地址信息
const hasLocation = (contact) => {
  return contact && (contact.country || contact.province || contact.city)
}

// 格式化地址信息
const formatLocation = (contact) => {
  const parts = []
  if (contact.country) parts.push(contact.country)
  if (contact.province) parts.push(contact.province)
  if (contact.city) parts.push(contact.city)
  return parts.join(' · ')
}

const isVisible = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    isVisible.value = true
  })
})
</script>

<style scoped>
.domain-result {
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.result-container {
  border-radius: 24px;
  background: rgb(30, 41, 59);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  overscroll-behavior: contain;
}

.result-container.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.result-header {
  padding: 1.5rem;
  background: rgb(23, 32, 47);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.domain-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.domain-name {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.5px;
}

.query-details {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.query-time {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-family: monospace;
  letter-spacing: 0.5px;
}

.query-duration {
  font-family: monospace;
  letter-spacing: 0.5px;
}

.status-badge {
  padding: 10px 24px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  width: fit-content;
  white-space: nowrap;
  margin-left: 16px;
  align-self: flex-start;
}

.registered {
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3);
  animation: warning-pulse 2s infinite;
}

.available {
  background: linear-gradient(135deg, #2ed573, #7bed9f);
  color: white;
  box-shadow: 0 4px 15px rgba(46, 213, 115, 0.3);
  animation: success-pulse 2s infinite;
}

.new-registered {
  background: linear-gradient(135deg, #3498db, #54a0ff);
  color: white;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  animation: info-pulse 2s infinite;
}

.unknown {
  background: linear-gradient(135deg, #636e72, #b2bec3);
  color: white;
  box-shadow: 0 4px 15px rgba(99, 110, 114, 0.3);
}

.info-section {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  margin: 1rem;
}

.info-section h3 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 20px;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 固定两列 */
  gap: 20px;
  margin-bottom: 32px;
}

.info-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-3px);
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.info-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-bottom: 8px;
}

.info-value {
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  font-weight: 500;
  margin-top: 8px;
}

.name-servers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.ns-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.status-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.status-tag {
  background: rgba(108, 92, 231, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 深色模式不需要特别处理，因为已经是深色主题 */
@media (prefers-color-scheme: dark) {
  .result-container {
    /* 深色模式下保持相同样式 */
  }
}

/* 添加悬停效果 */
.info-item:hover,
.ns-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
  transition: all 0.3s ease;
}

.status-tag:hover {
  transform: translateY(-1px);
  transition: all 0.3s ease;
}

/* 适配移动端 */
@media (max-width: 768px) {
  .domain-result {
    margin: 1rem auto;
    padding: 0 0.5rem;
  }

  .result-container {
    border-radius: 20px;
    background: rgb(30, 41, 59);
  }

  .result-header {
    padding: 1.2rem;
    background: rgb(23, 32, 47);
  }

  .info-section {
    padding: 1.2rem;
    margin: 0.8rem;
    background: rgba(35, 45, 65, 1);
    border-radius: 12px;
  }

  .domain-name {
    font-size: 1.5rem;
  }

  .status-badge {
    padding: 6px 16px;
    font-size: 14px;
    margin-left: 12px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .info-item {
    background: rgb(35, 45, 65);
  }

  .ns-item {
    background: rgb(40, 50, 70);
  }

  .status-tag {
    background: rgb(108, 92, 231);
  }
}

@media (max-width: 480px) {
  .result-container {
    border-radius: 16px;
  }

  .result-header {
    padding: 1rem;
  }

  .info-section {
    padding: 1rem;
    margin: 0.6rem;
    background: rgb(35, 45, 65);
  }

  .domain-name {
    font-size: 1.3rem;
  }

  .query-details {
    font-size: 0.8rem;
  }

  .status-badge {
    padding: 4px 12px;
    font-size: 13px;
    margin-left: 10px;
  }

  .info-label {
    font-size: 0.9rem;
  }

  .info-value {
    font-size: 0.9rem;
  }

  .name-servers {
    font-size: 0.9rem;
  }

  .status-tags {
    gap: 0.5rem;
  }

  .status-tag {
    font-size: 0.85rem;
    padding: 5px 10px;
    background: rgb(108, 92, 231);
  }

  .ns-item {
    padding: 10px 14px;
    background: rgb(40, 50, 70);
  }
}

/* 警告脉冲动画 */
@keyframes warning-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.4);
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 71, 87, 0);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 71, 87, 0);
    transform: scale(1);
  }
}

/* 成功脉冲动画 */
@keyframes success-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(46, 213, 115, 0.4);
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(46, 213, 115, 0);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(46, 213, 115, 0);
    transform: scale(1);
  }
}

/* 信息脉冲动画 */
@keyframes info-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4);
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(52, 152, 219, 0);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
    transform: scale(1);
  }
}

/* 悬停效果 */
.status-badge:hover {
  transform: translateY(-2px);
  filter: brightness(110%);
}

/* 适配移动端 */
@media (max-width: 768px) {
  .status-badge {
    padding: 8px 20px;
    font-size: 14px;
  }
}

/* 域名年龄样式 */
.domain-age {
  display: inline-flex;
  align-items: center;
  font-weight: 600 !important;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 14px !important;
}

.age-new {
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: white !important;
  animation: fade 2s infinite;
}

.age-young {
  background: linear-gradient(135deg, #0984e3, #00a8ff);
  color: white !important;
}

.age-medium {
  background: linear-gradient(135deg, #fdcb6e, #ffeaa7);
  color: #2d3436 !important;
}

.age-mature {
  background: linear-gradient(135deg, #fd79a8, #e84393);
  color: white !important;
}

.age-old {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white !important;
}

@keyframes fade {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* 添加工具提示样式 */
.domain-age {
  position: relative;
  cursor: help;
}

.domain-age::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
}

.domain-age:hover::after {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .domain-age {
    font-size: 13px !important;
    padding: 3px 6px;
  }
}

/* 到期时间样式 */
.expiry-time {
  margin-top: 8px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.expiry-expired {
  background: linear-gradient(135deg, #d63031, #ff7675);
  color: white;
  animation: pulse-warning 2s infinite;
}

.expiry-urgent {
  background: linear-gradient(135deg, #ff7675, #fab1a0);
  color: white;
}

.expiry-warning {
  background: linear-gradient(135deg, #fdcb6e, #ffeaa7);
  color: #2d3436;
}

.expiry-safe {
  background: linear-gradient(135deg, #00b894, #55efc4);
  color: white;
}

.expiry-unknown {
  background: linear-gradient(135deg, #636e72, #b2bec3);
  color: white;
}

@keyframes pulse-warning {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 日期容器样式 */
.dates-container {
  grid-column: span 2; /* 占据两列 */
}

.dates-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
}

.date-item {
  flex: 1;
  min-width: 0;
}

.date-divider {
  width: 1px;
  align-self: stretch;
  background: linear-gradient(to bottom, 
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  margin: 10px 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .dates-container {
    grid-column: span 1;
  }
  
  .dates-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .date-divider {
    width: 100%;
    height: 1px;
    margin: 0;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr; /* 移动端单列显示 */
    gap: 16px;
  }
  
  .info-section {
    margin-bottom: 24px;
  }
}

/* 添加暂无数据的样式 */
.info-value:empty::after,
.info-value:contains('暂无数据') {
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .domain-info {
    gap: 4px;
  }

  .domain-name {
    font-size: 22px;
  }

  .query-time {
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .query-details {
    font-size: 12px;
    flex-wrap: wrap;
  }
}

/* 注册人信息样式 */
.location-info {
  grid-column: span 2;
}

.info-value {
  word-break: break-word;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .location-info {
    grid-column: span 1;
  }
}
</style> 