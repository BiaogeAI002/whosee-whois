<template>
  <main class="home">
    <div class="background-grid"></div>
    <div class="background-glow">
      <div class="glow-effect glow-1"></div>
      <div class="glow-effect glow-2"></div>
      <div class="glow-effect glow-3"></div>
    </div>
    <div class="hero-section">
      <header class="brand-section">
        <div class="logo-container">
          <div class="logo-wrapper">
            <div class="peace-logo" aria-label="W Logo">W</div>
            <div class="logo-glow"></div>
          </div>
          <h1 class="brand-name">W is Whois Lookup</h1>
          <p class="brand-description">专业的域名信息查询工具</p>
          <div class="brand-tagline">快速、准确、专业的域名信息查询服务</div>
        </div>
      </header>
      
      <section class="search-section" aria-label="域名搜索区域">
        <div class="search-options">
          <label class="option-label">
            <input type="checkbox" checked disabled />
            <span>Domain</span>
          </label>
          <label class="option-label">
            <input type="checkbox" checked disabled />
            <span>IPv4</span>
          </label>
          <label class="option-label">
            <input type="checkbox" checked disabled />
            <span>IPv6</span>
          </label>
          <label class="option-label">
            <input type="checkbox" checked disabled />
            <span>ASN</span>
          </label>
          <label class="option-label">
            <input type="checkbox" checked disabled />
            <span>CIDR</span>
          </label>
        </div>
        <SearchBox 
          @search="handleSearch" 
          @searchComplete="scrollToResult"
        />
        <div class="search-info">
          <span class="version-info">→ 1.1.1</span>
        </div>
      </section>
      
      <footer class="footer-section">
        <div class="footer-left">
          <p class="copyright">© 2025 whosee.me - All Rights Reserved</p>
          <div class="footer-links">
            <a 
              href="https://github.com/AsisYu/whosee-whois" 
              target="_blank" 
              rel="noopener noreferrer"
              class="footer-link"
            >
              <i class="fab fa-github"></i>
              <span>开源项目</span>
            </a>
          </div>
        </div>
        <div class="footer-right">
          <a href="#" class="home-icon">
            <i class="fas fa-home"></i>
          </a>
        </div>
      </footer>
    </div>
    <transition name="fade">
      <DomainResult 
        v-if="showResults" 
        :query="searchQuery"
        :results="searchResults"
        :loading="loading"
        :queryDuration="queryDuration"
        ref="resultRef"
      />
    </transition>
  </main>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import SearchBox from '../components/SearchBox.vue'
import DomainResult from '../components/DomainResult.vue'
import { whoisQuery } from '../api/whois'
import { useHead } from '@vueuse/head'

const searchQuery = ref('')
const showResults = ref(false)
const searchResults = ref(null)
const loading = ref(false)
const resultRef = ref(null)
const queryDuration = ref(0)

const handleSearch = async (query) => {
  searchQuery.value = query
  showResults.value = true
  loading.value = true
  queryDuration.value = 0
  
  try {
    const startTime = performance.now()
    searchResults.value = await whoisQuery(query)
    const endTime = performance.now()
    queryDuration.value = Math.round(endTime - startTime)
    
    if (!searchResults.value) {
      throw new Error('未获取到查询结果')
    }
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = null
    // 不在这里显示错误消息，因为已经在 API 层处理了
  } finally {
    loading.value = false
  }
}

const scrollToResult = () => {
  requestAnimationFrame(() => {
    const startPosition = window.pageYOffset
    const targetPosition = resultRef.value.$el.offsetTop
    const distance = targetPosition - startPosition
    const duration = 600
    let startTime = null
    
    const animation = currentTime => {
      if (!startTime) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      
      const ease = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      
      window.scrollTo({
        top: startPosition + distance * ease(progress),
        behavior: 'auto'
      })
      
      if (progress < 1) {
        requestAnimationFrame(animation)
      }
    }
    
    requestAnimationFrame(animation)
  })
}

const disableAnimationsDuringScroll = () => {
  document.body.classList.add('is-scrolling')
  clearTimeout(window.scrollTimeout)
  window.scrollTimeout = setTimeout(() => {
    document.body.classList.remove('is-scrolling')
  }, 150)
}

onMounted(() => {
  window.addEventListener('scroll', disableAnimationsDuringScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', disableAnimationsDuringScroll)
  clearTimeout(window.scrollTimeout)
})

// SEO 配置
useHead({
  title: 'W is Whois Lookup - whosee.me',
  meta: [
    {
      name: 'description',
      content: 'W is Whois Lookup 提供全球域名Whois信息查询服务，快速查询域名注册信息、到期时间、持有人等关键信息。支持批量查询，让您的域名管理更轻松。'
    },
    {
      name: 'keywords',
      content: '域名查询,whois查询,域名信息,域名工具,域名查,域名注册信息,域名到期查询'
    },
    {
      property: 'og:title',
      content: 'W is Whois Lookup - whosee.me'
    },
    {
      property: 'og:description',
      content: '快速查询域名注册信息、到期时间、持有人等关键信息。支持全球域名查询，让您的域名管理更轻松。'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      name: 'robots',
      content: 'index, follow'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://whosee.me'
    }
  ]
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0A1222 0%, #0D1526 100%);
  color: #fff;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 60px; /* 为固定footer留出空间 */
}

.home::-webkit-scrollbar {
  width: 8px;
}

.home::-webkit-scrollbar-track {
  background: transparent;
}

.home::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.background-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.4;
}

.background-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  overflow: hidden;
}

.glow-effect {
  position: absolute;
  width: 1000px;
  height: 1000px;
  border-radius: 50%;
  filter: blur(150px);
  opacity: 0.08;
  pointer-events: none;
  mix-blend-mode: screen;
}

.glow-1 {
  top: -30%;
  left: -20%;
  background: linear-gradient(45deg, #4299E1, #667EEA);
  animation: moveGlow1 35s infinite alternate;
}

.glow-2 {
  bottom: -40%;
  right: -20%;
  background: linear-gradient(45deg, #7E5CEF, #9F7AEA);
  animation: moveGlow2 40s infinite alternate;
}

.glow-3 {
  top: 20%;
  left: 40%;
  background: linear-gradient(45deg, #3182CE, #4299E1);
  animation: moveGlow3 30s infinite alternate;
}

@keyframes moveGlow1 {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(3%, 3%) scale(1.05);
  }
}

@keyframes moveGlow2 {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(-3%, -3%) scale(1.1);
  }
}

@keyframes moveGlow3 {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(-2%, 2%) scale(0.98);
  }
}

.brand-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  flex: 1;
  position: relative;
  z-index: 3;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.logo-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.peace-logo {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  font-size: 3rem;
  background: linear-gradient(135deg, #4299E1, #667EEA);
  box-shadow: 
    0 20px 40px rgba(66, 153, 225, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  animation: logoFloat 6s ease-in-out infinite;
}

.logo-glow {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(52, 152, 219, 0.4) 0%, transparent 70%);
  filter: blur(15px);
  z-index: 1;
}

.brand-name {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 1.5rem 0 1rem;
  background: linear-gradient(to right, #4299E1, #9F7AEA);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-align: center;
  letter-spacing: -1px;
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.brand-description {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0.5rem 0;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.brand-tagline {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.8rem;
  max-width: 500px;
  text-align: center;
  line-height: 1.6;
}

.search-section {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(23, 32, 47, 0.95);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.2);
}

.search-options {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  padding: 0.8rem 1.2rem;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.option-label {
  display: flex;
  align-items: center;
  margin: 0 0.8rem;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
}

.option-label:hover {
  background: rgba(255, 255, 255, 0.1);
}

.option-label input {
  margin-right: 0.3rem;
}

.search-info {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  max-width: 700px;
}

.version-info {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(30, 41, 59, 0.5);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  gap: 2rem;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: rgba(23, 32, 47, 0.98);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 100;
  height: 60px; /* 固定footer高度 */
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.copyright {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.footer-link span {
  display: inline-block;
}

.footer-link:hover {
  color: rgba(255, 255, 255, 0.9);
}

.footer-link i {
  font-size: 1rem;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.home-icon {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.home-icon:hover {
  color: rgba(255, 255, 255, 0.9);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home {
    padding-bottom: 50px;
  }

  .hero-section {
    padding: 1.5rem;
  }

  .brand-section {
    padding: 1.5rem 0;
  }
  
  .brand-name {
    font-size: 2.8rem;
  }
  
  .brand-description {
    font-size: 1.1rem;
  }
  
  .brand-tagline {
    font-size: 0.9rem;
    margin-top: 0.8rem;
  }
  
  .search-section {
    padding: 1.2rem;
    margin: 0 10px;
    width: calc(100% - 20px);
    background: rgba(23, 32, 47, 0.98);
  }
  
  .search-options {
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 1rem;
    padding: 0.5rem;
    background: rgba(30, 41, 59, 0.7);
  }
  
  .option-label {
    margin: 0.2rem 0.4rem;
    font-size: 0.9rem;
  }
  
  .peace-logo {
    width: 90px;
    height: 90px;
    font-size: 3rem;
  }
  
  .footer-section {
    padding: 0.8rem 1.5rem;
    background: rgba(23, 32, 47, 0.98);
    height: 50px;
  }
  
  .footer-links {
    display: flex;
    margin-left: 1rem;
  }
  
  .footer-link {
    font-size: 1rem;
  }
  
  .footer-link span {
    display: none;
  }
}

@media (max-width: 480px) {
  .home {
    padding-bottom: 45px;
  }

  .hero-section {
    padding: 1rem;
  }

  .brand-section {
    padding: 1rem 0;
  }
  
  .peace-logo {
    width: 80px;
    height: 80px;
    font-size: 2.5rem;
  }
  
  .brand-name {
    font-size: 2.2rem;
  }
  
  .brand-description {
    font-size: 1rem;
  }
  
  .brand-tagline {
    font-size: 0.8rem;
    margin-top: 0.6rem;
  }
  
  .search-section {
    padding: 0.8rem;
    border-radius: 20px;
  }
  
  .search-options {
    margin-bottom: 0.8rem;
    padding: 0.4rem;
    border-radius: 12px;
  }
  
  .option-label {
    font-size: 0.8rem;
    margin: 0.15rem 0.3rem;
    padding: 0.3rem 0.6rem;
  }
  
  .version-info {
    font-size: 0.75rem;
    padding: 0.25rem 0.6rem;
    background: rgba(30, 41, 59, 0.7);
  }
  
  .footer-section {
    padding: 0.8rem 1rem;
    gap: 0.5rem;
    height: 45px;
  }
  
  .copyright {
    font-size: 0.7rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .footer-links {
    margin-left: 0.5rem;
  }
  
  .footer-link {
    font-size: 0.9rem;
  }
  
  .home-icon {
    font-size: 1rem;
    padding: 0.5rem;
  }
}

/* 添加淡入淡出动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 添加 logo 动画 */
@keyframes logoGlow {
  0% {
    box-shadow: 
      0 15px 35px rgba(52, 152, 219, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset,
      0 0 30px rgba(155, 89, 182, 0.4);
  }
  100% {
    box-shadow: 
      0 15px 35px rgba(52, 152, 219, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.2) inset,
      0 0 50px rgba(155, 89, 182, 0.6);
  }
}

/* 添加动态背景元素 */
.background-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #fff;
  border-radius: 50%;
  opacity: 0;
  animation: twinkle var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

.meteor {
  position: absolute;
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0.8), transparent);
  transform: rotate(-45deg);
  animation: meteor 3s linear infinite;
  animation-delay: var(--delay);
}

.nebula {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: nebulaFloat 20s ease-in-out infinite;
}

.nebula-1 {
  top: 10%;
  left: 20%;
  background: radial-gradient(circle, rgba(78, 159, 242, 0.3), transparent 70%);
  animation-delay: 0s;
}

.nebula-2 {
  bottom: 20%;
  right: 10%;
  background: radial-gradient(circle, rgba(155, 89, 182, 0.3), transparent 70%);
  animation-delay: -5s;
}

@keyframes gradientMove {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

@keyframes meteor {
  0% {
    transform: translate(0, 0) rotate(-45deg);
    opacity: 1;
  }
  100% {
    transform: translate(-200px, 200px) rotate(-45deg);
    opacity: 0;
  }
}

@keyframes nebulaFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, 30px) scale(1.1);
  }
}
</style>