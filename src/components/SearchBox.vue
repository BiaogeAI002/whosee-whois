<template>
  <div class="search-container">
    <div class="search-box">
      <div class="search-icon-wrapper">
        <i class="fas fa-search search-icon"></i>
      </div>
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        placeholder="请输入要查询的域名..."
        @keyup.enter="handleSearch"
        class="search-input"
      />
      <div v-if="query" class="clear-icon" @click.stop="clearInput">
        <i class="fas fa-times"></i>
      </div>
      <div class="search-button-container">
        <button 
          class="search-button"
          :disabled="!query.trim()"
          @click.stop="handleSearch"
        >
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
    <div class="search-history" v-if="searchHistory.length > 0">
      <span class="history-label">历史记录：</span>
      <div class="history-list">
        <button 
          v-for="(domain, index) in searchHistory" 
          :key="index"
          @click="fillExample(domain)"
          class="history-button"
        >
          {{ domain }}
        </button>
        <button 
          v-if="searchHistory.length > 0"
          @click="clearHistory"
          class="clear-history-button"
        >
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const query = ref('')
const inputRef = ref(null)
const searchHistory = ref([])
const emit = defineEmits(['search', 'searchComplete', 'expand'])

// 从本地存储加载历史记录
onMounted(() => {
  try {
    const savedHistory = localStorage.getItem('searchHistory')
    if (savedHistory) {
      searchHistory.value = JSON.parse(savedHistory)
    }
  } catch (error) {
    console.error('加载历史记录失败:', error)
  }
})

// 保存历史记录到本地存储
const saveHistory = () => {
  try {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
  } catch (error) {
    console.error('保存历史记录失败:', error)
  }
}

// 添加到历史记录
const addToHistory = (domain) => {
  // 如果已存在，先移除旧记录
  const index = searchHistory.value.indexOf(domain)
  if (index !== -1) {
    searchHistory.value.splice(index, 1)
  }
  
  // 添加到最前面
  searchHistory.value.unshift(domain)
  
  // 限制历史记录数量为10个
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }
  
  saveHistory()
}

// 清除历史记录
const clearHistory = () => {
  searchHistory.value = []
  saveHistory()
  ElMessage.success('历史记录已清空')
}

// 清除输入
const clearInput = () => {
  query.value = ''
  inputRef.value?.focus()
}

// 处理域名验证
const processAndValidateDomain = (input) => {
  if (!input || !input.trim()) {
    ElMessage.warning('请输入要查询的域名')
    return null
  }
  
  // 简单验证域名格式
  const domain = input.trim().toLowerCase()
  const domainRegex = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/
  
  if (!domainRegex.test(domain)) {
    ElMessage.warning('请输入有效的域名格式')
    return null
  }
  
  return domain
}

// 处理搜索
const handleSearch = () => {
  const domain = processAndValidateDomain(query.value)
  if (!domain) return
  
  // 添加到历史记录
  addToHistory(domain)
  
  emit('search', domain)
  
  // 模拟搜索完成
  setTimeout(() => {
    emit('searchComplete', {
      domain,
      results: {}
    })
  }, 1000)
}

// 填充示例
const fillExample = (example) => {
  query.value = example
  inputRef.value?.focus()
}
</script>

<style scoped>
.search-container {
  width: 100%;
  max-width: 700px;
  position: relative;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(30, 41, 59, 0.98);
  border-radius: 16px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1);
  height: 56px;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  background: rgba(35, 45, 65, 0.98);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.search-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
}

.search-icon {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
}

.search-input {
  flex: 1;
  height: 100%;
  padding: 0 20px;
  font-size: 1rem;
  background: transparent;
  color: #fff;
  letter-spacing: 0.3px;
  border: none;
  outline: none;
  font-weight: normal;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.clear-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.2s ease;
}

.clear-icon:hover {
  color: rgba(255, 255, 255, 0.7);
}

.search-button-container {
  height: 100%;
  display: flex;
  align-items: center;
}

.search-button {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4299E1, #667EEA);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 
    0 2px 4px rgba(66, 153, 225, 0.2);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  background: linear-gradient(135deg, #4299E1, #667EEA);
  box-shadow: none;
}

.search-button i {
  font-size: 0.9rem;
}

.search-button:hover {
  transform: translateY(-1px);
  box-shadow: 
    0 6px 12px rgba(66, 153, 225, 0.4);
  background: linear-gradient(135deg, #4299E1, #7F9CF5);
}

.search-history {
  display: flex;
  flex-direction: column;
  margin-top: 0.8rem;
  padding: 0;
}

.history-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.history-button {
  background: rgba(23, 32, 47, 0.9);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.history-button:hover {
  background: rgba(23, 32, 47, 0.95);
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.clear-history-button {
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.4rem;
  border-radius: 50%;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin-left: auto;
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .search-container {
    width: calc(100% - 20px);
    margin: 0 10px;
  }

  .search-box {
    height: 46px;
    border-radius: 23px;
    background: rgb(30, 41, 59);
    padding: 3px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: none;
  }
  
  .search-button {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin-right: 3px;
    background: linear-gradient(135deg, #3B82F6, #6366F1);
    box-shadow: none;
  }
  
  .search-input {
    font-size: 0.95rem;
    padding: 0 15px;
    letter-spacing: 0.2px;
    color: #fff;
  }
  
  .search-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  .search-icon-wrapper {
    padding-left: 15px;
  }
  
  .search-icon {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .clear-icon {
    width: 32px;
    height: 32px;
    color: rgba(255, 255, 255, 0.5);
  }

  .history-list {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: 8px;
    padding: 4px 0;
  }
  
  .history-list::-webkit-scrollbar {
    display: none;
  }
  
  .history-button {
    flex-shrink: 0;
    padding: 4px 10px;
    font-size: 13px;
    border-radius: 15px;
    background: rgba(23, 32, 47, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.12);
    white-space: nowrap;
    color: rgba(255, 255, 255, 0.85);
    box-shadow: none;
  }

  .history-button:active {
    background: rgba(35, 45, 65, 0.95);
  }

  .clear-history-button {
    width: 24px;
    height: 24px;
    font-size: 0.75rem;
    background: rgba(255, 59, 48, 0.2);
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .search-box {
    height: 42px;
    border-radius: 21px;
    background: rgb(30, 41, 59);
  }
  
  .search-button {
    width: 36px;
    height: 36px;
    border-radius: 18px;
  }
  
  .search-input {
    font-size: 0.9rem;
    padding: 0 12px;
    letter-spacing: 0.2px;
  }
  
  .search-icon-wrapper {
    padding-left: 12px;
  }
  
  .clear-icon {
    width: 28px;
    height: 28px;
  }
  
  .history-button {
    padding: 3px 8px;
    font-size: 0.8rem;
    border-radius: 12px;
    background: rgba(23, 32, 47, 0.95);
  }
  
  .search-history {
    margin-top: 0.6rem;
  }
  
  .history-label {
    font-size: 0.8rem;
    margin-bottom: 0.3rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .clear-history-button {
    width: 22px;
    height: 22px;
    font-size: 0.7rem;
  }
}

/* 优化触摸设备的交互 */
@media (hover: none) {
  .search-button:active {
    opacity: 0.9;
    transform: none;
    background: linear-gradient(135deg, #3B82F6, #6366F1);
  }
  
  .search-box:focus-within {
    transform: none;
    background: rgb(30, 41, 59);
    border-color: rgba(255, 255, 255, 0.12);
  }
}
</style>