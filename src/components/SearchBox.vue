<template>
  <div class="search-container" 
      :class="{ 
        'is-expanded': isExpanded,
        'initial-load': isInitialLoad,
        'is-transitioning': isTransitioning
      }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @transitionend="handleTransitionEnd">
    <div class="search-box" 
        @click="handleClick"
    >
      <i class="fas fa-search search-icon"></i>
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        :placeholder="placeholder"
        @keyup.enter="handleSearch"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div v-if="query" class="clear-icon" @click.stop="clearInput">
        <i class="fas fa-times"></i>
      </div>
      <button 
        class="search-button"
        :disabled="!query.trim()"
        @click.stop="handleSearch"
      >
        查询
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

const query = ref('')
const isExpanded = ref(false)
const isInitialLoad = ref(true)
const inputRef = ref(null)
const placeholder = ref('请输入要查询的域名...')
const expandTimeout = ref(null)
const collapseTimeout = ref(null)
const isTransitioning = ref(false)
const emit = defineEmits(['search', 'searchComplete', 'expand'])

// 页面加载动画
onMounted(() => {
  setTimeout(() => {
    isInitialLoad.value = false
  }, 1000)
})

// 鼠标悬停处理
const handleMouseEnter = () => {
  if (!query.value) {
    // 清除收起的定时器
    if (collapseTimeout.value) {
      clearTimeout(collapseTimeout.value)
      collapseTimeout.value = null
    }
    expandSearch()
  }
}

// 鼠标离开处理
const handleMouseLeave = () => {
  if (!query.value && !inputRef.value?.matches(':focus')) {
    if (isTransitioning.value) return
    handleCollapse()
  }
}

// 处理点击事件
const handleClick = (e) => {
  if (isTransitioning.value) return
  if (!isExpanded.value) {
    expandSearch()
  } else if (!e.target.closest('input, button, .clear-icon')) {
    // 如果点击的不是输入框、按钮或清除图标，则收起搜索框
    handleCollapse()
  }
}

// 收起搜索框
const handleCollapse = () => {
  if (isTransitioning.value || query.value) return
  isTransitioning.value = true
  isExpanded.value = false
  emit('expand', false)
  setTimeout(() => {
    isTransitioning.value = false
  }, 500)
}

const expandSearch = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  
  // 清除现有的定时器
  if (collapseTimeout.value) {
    clearTimeout(collapseTimeout.value)
    collapseTimeout.value = null
  }
  
  // 设置展开的定时器
  expandTimeout.value = setTimeout(() => {
    isExpanded.value = true
    emit('expand', true)
    expandTimeout.value = null
    // 聚焦输入框
    setTimeout(() => {
      inputRef.value?.focus()
      isTransitioning.value = false
    }, 300)  // 增加延迟确保动画完成
  }, 50)
}

const clearInput = () => {
  query.value = ''
  inputRef.value?.focus()
}

const handleFocus = () => {
  placeholder.value = '例如：example.com'
}

const handleBlur = () => {
  if (!query.value) {
    placeholder.value = '请输入要查询的域名...'
  }
}

const processAndValidateDomain = (input) => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, domain: '' }
  }

  let domain = input.toLowerCase()
  domain = domain.replace(/[<>'"&]/g, '')
  domain = domain.replace(/^(https?:\/\/)?(www\.)?/i, '')
  domain = domain.split('/')[0].split('?')[0]
  
  const parts = domain.split('.')
  if (parts.length > 2) {
    domain = parts.slice(-2).join('.')
    ElMessage.info(`已自动转换为主域名: ${domain}`)
  }

  const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z]{2,})+$/
  const isValid = domainRegex.test(domain) && domain.length <= 253
  
  return { isValid, domain }
}

const handleSearch = () => {
  const input = query.value.trim()
  if (!input) {
    ElMessage.warning('请输入域名')
    return
  }

  const { isValid, domain } = processAndValidateDomain(input)
  
  if (!isValid) {
    ElMessage.error('请输入正确的域名格式，如：example.com')
    return
  }

  query.value = domain
  emit('search', domain)
  setTimeout(() => {
    emit('searchComplete')
  }, 100)
}

// 监听过渡结束
const handleTransitionEnd = () => {
  if (!isExpanded.value) {
    isTransitioning.value = false
  }
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (expandTimeout.value) clearTimeout(expandTimeout.value)
  if (collapseTimeout.value) clearTimeout(collapseTimeout.value)
})
</script>

<style scoped>
/* 初始加载动画 */
.search-container.initial-load {
  animation: popIn 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-15deg);
    backdrop-filter: blur(0);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1) rotate(5deg);
    backdrop-filter: blur(5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0);
    backdrop-filter: blur(10px);
  }
}

.search-container {
  width: 60px;
  height: 60px;
  position: relative;
  transition: width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  border-radius: 30px;
  overflow: hidden;
  transform-origin: center center;
  margin: 0 auto;
  will-change: width;
  user-select: none;  /* 防止文本选择影响点击 */
}

.search-container.is-expanded {
  width: min(600px, 90vw);
  transition-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
}

.search-box {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 30px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0);
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  cursor: pointer;
  padding-left: 20px;
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0);
  position: relative;
  z-index: 1;
  pointer-events: auto;
}

/* 添加背景模糊层 */
.search-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: -1;
  background: rgba(255, 255, 255, 0);
  transition: all 0.3s ease-out;
  animation: frostedGlass 0.3s ease-out forwards;
}

@keyframes frostedGlass {
  0% {
    background: rgba(255, 255, 255, 0);
    backdrop-filter: blur(0);
    border-color: rgba(255, 255, 255, 0);
    box-shadow: 0 2px 10px rgba(255, 255, 255, 0);
  }
  100% {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(10px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);
  }
}

/* 添加波纹动画效果 */
.search-box::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1000px;
  height: 1000px;
  background: radial-gradient(circle, 
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.15) 20%,
    rgba(255, 255, 255, 0.1) 40%,
    transparent 60%
  );
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  z-index: -1;
  transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
              opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.search-box:hover::before {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
}

.search-box:hover::after {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

.search-container.is-expanded .search-box::before {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
}

.search-container.is-expanded .search-box {
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);
}

.search-icon {
  color: white;
  font-size: 1.4rem;
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  opacity: 0.9;
  position: relative;
  z-index: 2;
}

.search-box:hover .search-icon {
  opacity: 1;
  transform: scale(1.1) rotate(-10deg);
}

input {
  flex: 1;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 16px;
  padding: 0 20px;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: auto !important;
}

.is-expanded input {
  opacity: 1;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.clear-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: auto !important;
}

.clear-icon:hover {
  color: white;
  transform: rotate(90deg);
}

.search-button {
  height: 100%;
  min-width: 80px;
  width: 20%;
  background: linear-gradient(135deg, #6dd4ff 0%, #ffa196 100%);
  border: none;
  color: white;
  font-size: clamp(14px, 4vw, 16px);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateX(100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  pointer-events: auto !important;
}

/* 更新光效果 */
.search-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: 0.5s;
}

.search-button:hover::before {
  left: 100%;
}

.is-expanded .search-button {
  opacity: 1;
  transform: translateX(0);
  box-shadow: 0 4px 15px rgba(33, 136, 255, 0.3);
  position: relative;
  right: 0;
  flex-shrink: 0;
}

.search-button:hover {
  /* 更新悬浮状态的渐变色 */
  background: linear-gradient(135deg, #6dd4ff 0%, #ffa196 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(33, 136, 255, 0.4);
}

.search-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(33, 136, 255, 0.3);
}

.search-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  /* 更新禁用状态的渐变色 */
  background: linear-gradient(135deg, #ffa196 0%, #6dd4ff 100%);
  box-shadow: none;
  transform: none;
}

.search-button:disabled:hover {
  transform: none;
  box-shadow: none;
}

/* 未展开时的搜索图标动画 */
.search-container:not(.is-expanded) .search-icon {
  animation: float-search 3s ease-in-out infinite;
}

@keyframes float-search {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  25% {
    transform: translate(2px, -2px) rotate(5deg) scale(1.1);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-5deg) scale(1.05);
  }
  75% {
    transform: translate(-2px, -1px) rotate(3deg) scale(1.08);
  }
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .search-container {
    width: 50px;
    height: 50px;
  }
  .search-icon {
    font-size: 1.2rem;
  }

  input {
    font-size: 14px;
    padding: 0 10px;
  }

  .search-button {
    min-width: 60px;
    width: 25%;
    padding: 0;
    font-size: 14px;
    letter-spacing: 0;
  }

  /* 确保按钮在展开状态下正确显示 */
  .search-container.is-expanded .search-button {
    transform: translateX(0);
    opacity: 1;
    position: relative;
    right: 0;
  }
}

/* 超小屏幕适配 */
@media (max-width: 375px) {
  .search-button {
    min-width: 50px;
    width: 22%;
    font-size: 13px;
  }
}

/* 平板适配 */
@media (min-width: 769px) and (max-width: 1024px) {
  .search-container.is-expanded {
    width: 450px;
  }
  .search-button {
    min-width: 70px;
    width: 22%;
  }
}

/* 禁用过渡中的点击 */
.search-container.is-transitioning {
  pointer-events: none;
  cursor: default;
}

.search-box input {
  pointer-events: auto !important;
}

.search-button {
  pointer-events: auto !important;
}

.clear-icon {
  pointer-events: auto !important;
}
</style>