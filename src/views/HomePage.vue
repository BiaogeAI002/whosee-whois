<template>
    <main class="home">
      <div class="hero-section">
        <StarField />
        <header class="brand-section">
          <div class="logo-container">
            <div class="peace-logo" aria-label="域名查 Logo">🔍</div>
            <h1 class="brand-name">域名查 - 专业的域名信息查询工具</h1>
          </div>
          <p class="brand-description" aria-label="网站描述">
            快速查询域名注册信息、到期时间、持有人等关键信息。支持全球域名查询，让您的域名管理更轻松。
          </p>
        </header>
        
        <section class="search-section" aria-label="域名搜索区域">
          <div class="search-bubble-container">
            <transition name="bubble">
              <div v-if="!isExpanded" class="search-bubble" role="tooltip">
                在这里开始查询域名 ✨
              </div>
            </transition>
          </div>
          <SearchBox 
            @search="handleSearch" 
            @searchComplete="scrollToResult"
            @expand="handleExpand"
          />
        </section>
        
        <footer class="footer-section">
          <div class="footer-left">
            <nav class="social-links" aria-label="社交媒体链接">
              <a href="#" class="social-link" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
              <a href="#" class="social-link" aria-label="Pinterest"><i class="fab fa-pinterest"></i></a>
              <a href="#" class="social-link">500px</a>
              <a href="#" class="social-link" aria-label="联系邮箱"><i class="fas fa-envelope"></i></a>
            </nav>
            
            <nav class="nav-links" aria-label="页面导航">
              <a href="#" v-for="(link, index) in navLinks" :key="index" 
                 :aria-label="link">/ {{ link }}</a>
            </nav>
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
  import StarField from '../components/StarField.vue'
  import { whoisQuery } from '../api/whois'
  import { useHead } from '@vueuse/head'
  
  const searchQuery = ref('')
  const showResults = ref(false)
  const searchResults = ref(null)
  const loading = ref(false)
  const isExpanded = ref(false)
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
  
  const navLinks = [
    '域名注册查询',
    '域名价值评估',
    'Whois查询',
    '域名安全检测',
    '域名交易平台',
    '域名备案查询'
  ]
  
  const handleExpand = (expanded) => {
    isExpanded.value = expanded
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
    title: '域名查 - 专业的域名信息查询工具',
    meta: [
      {
        name: 'description',
        content: '域名查提供全球域名Whois信息查询服务，快速查询域名注册信息、到期时间、持有人等关键信息。支持批量查询，让您的域名管理更轻松。'
      },
      {
        name: 'keywords',
        content: '域名查询,whois查询,域名信息,域名工具,域名查,域名注册信息,域名到期查询'
      },
      {
        property: 'og:title',
        content: '域名查 - 专业的域名信息查询工具'
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
        href: 'https://你的域名.com'  // 替换为实际域名
      }
    ]
  })
  </script>
  
  <style scoped>
  .home {
    min-height: 100vh;
    background-color: #020b1c;
    position: relative;
    z-index: 1;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-y: none;
  }
  
  .hero-section {
    height: 100vh;
    position: relative;
    display: block;
    padding: 0;
    overflow: hidden;
    background: url('@/assets/images/particles.jpg') center center;
    background-size: cover;
    background-attachment: fixed;
    will-change: transform;
    transform: translateZ(0);
  }
  
  .hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(
        circle at top right,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 25%
      ),
      linear-gradient(
        70deg,
        rgba(27, 31, 39, 0.9) 10%,
        rgba(0, 0, 0, 0.449) 30%,
        rgba(70, 74, 83, 0.134) 40%,
        rgba(2, 11, 28, 0.089) 100%,
        transparent 100%
      );
    pointer-events: none;
  }
  
  .brand-section {
    position: absolute;
    top: 20%;
    left: 2rem;
    z-index: 2;
    max-width: 500px;
    padding: 2rem;
    border-radius: 0 1rem 1rem 0;
    animation: brandAppear 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    will-change: transform, opacity;
    transform: translateZ(0);
  }
  
  .brand-section::after {
    content: '';
    display: block;
    clear: both;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    animation: logoFloat 3s ease-in-out infinite;
  }
  
  .peace-logo {
    font-size: 2.5rem;
    color: white;
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
    animation: logoSpin 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform-origin: center center;
  }
  
  .brand-name {
    color: white;
    font-size: 2rem;
    margin: 0;
    animation: textReveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    animation-delay: 0.4s;
    opacity: 0;
    animation-fill-mode: forwards;
  }
  
  .brand-description {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    display: inline-block;
    animation: 
      fadeSlideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s backwards,
      textFloat 4s ease-in-out 1.4s infinite;
    opacity: 0;
    animation-fill-mode: forwards;
  }
  
  h1 {
    color: white;
    margin-bottom: 3rem;
    font-size: 3.5rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    animation: fadeInDown 1s ease-out;
  }
  
  .search-box {
    margin: 0 auto;
    max-width: 800px;
    padding-top: 1rem;
  }
  
  @keyframes float {
    from { transform: translateY(0); }
    to { transform: translateY(-100%); }
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
    will-change: opacity;
    transform: translateZ(0);
    backface-visibility: hidden;
  }
  
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  
  @media (max-width: 768px) {
    .brand-section {
      top: 20%;
      left: 1rem;
      right: 1rem;
      transform: none;
    }

    .brand-description {
      font-size: 0.9rem;
    }

    .peace-logo {
      font-size: 2rem;
      width: 40px;
      height: 40px;
    }

    .brand-name {
      font-size: 1.5rem;
    }
  }
  
  .footer-section {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 2rem;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    background: linear-gradient(
      to top,
      rgba(2, 11, 28, 0.95) 0%,
      rgba(2, 11, 28, 0.8) 30%,
      transparent 100%
    );
    animation: fadeInUp 1s ease-out 0.5s backwards;
  }
  
  .footer-left {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }
  
  .social-links {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }
  
  .nav-links {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }
  
  .nav-links a {
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    position: relative;
    padding-bottom: 2px;
  }
  
  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 1px;
    background: white;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  .nav-links a:hover::after {
    width: 100%;
  }
  
  .social-link {
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    position: relative;
  }
  
  .social-link::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: scale(0);
    transition: transform 0.3s ease;
  }
  
  .social-link:hover::before {
    transform: scale(1);
  }
  
  .social-link:hover {
    color: white;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
  
  .scroll-down {
    margin-left: 1rem;
    font-size: 1rem;
    animation: bounce 2s infinite;
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  @media (max-width: 768px) {
    .footer-section {
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    
    .footer-left {
      align-items: center;
    }
    
    .nav-links {
      justify-content: center;
      text-align: center;
    }
  }
  
  .footer-right {
    position: relative;
  }
  
  .search-section {
    position: absolute;
    bottom: 200px;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
    padding: 0 20px;
  }
  
  .search-bubble-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    padding: 0 20px;
  }
  
  .search-bubble {
    position: relative;
    background: rgba(255, 255, 255, 0.95);
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 14px;
    color: #333;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
    pointer-events: none;
    animation: bubbleFloat 3s ease-in-out infinite;
    text-align: center;
    transform-origin: bottom center;
    margin: 0 auto;
    max-width: min(600px, 90vw);
  }
  
  .search-bubble::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    width: 12px;
    height: 12px;
    background: rgba(255, 255, 255, 0.95);
    transform: translateX(-50%) rotate(45deg);
  }
  
  @keyframes bubbleFloat {
    0%, 100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    50% {
      opacity: 0.8;
      transform: translateY(-10px) scale(1.02);
    }
  }
  
  @media (max-width: 768px) {
    .search-section {
      bottom: 200px;
    }
    
    .search-bubble-container {
      position: relative;
      height: 40px;
      margin: 0 auto 15px;
    }
    
    .search-bubble {
      width: 50%;
      min-width: 160px;
      font-size: 12px;
      padding: 6px 12px;
      line-height: 1.4;
      white-space: normal;
      margin: 0 auto;
    }

    .search-bubble::after {
      bottom: -5px;
      width: 10px;
      height: 10px;
    }
  }

  /* 超小屏幕适配 */
  @media (max-width: 375px) {
    .search-bubble {
      width: 60%;
      min-width: 140px;
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-100px) translateY(-50%);
    }
    to {
      opacity: 1;
      transform: translateX(0) translateY(-50%);
    }
  }
  
  /* 气泡动画 */
  .bubble-enter-active {
    animation: bubbleIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  
  .bubble-leave-active {
    animation: bubbleOut 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  
  @keyframes bubbleIn {
    0% {
      opacity: 0;
      transform: translateY(10px) scale(0.9);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes bubbleOut {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
  }
  
  /* 品牌区域动画 */
  @keyframes brandAppear {
    0% {
      opacity: 0;
      transform: translateX(-50px) scale(0.9);
      background: rgba(255, 255, 255, 0);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
      background: rgba(255, 255, 255, 0.05);
    }
  }
  
  /* Logo浮动动画 */
  @keyframes logoFloat {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  /* Logo旋转动画 */
  @keyframes logoSpin {
    0% {
      opacity: 0;
      transform: scale(0.3) rotate(-180deg);
    }
    50% {
      transform: scale(1.2) rotate(10deg);
    }
    100% {
      opacity: 1;
      transform: scale(1) rotate(0);
    }
  }
  
  /* 文字显现动画 */
  @keyframes textReveal {
    0% {
      opacity: 0;
      transform: translateX(-20px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  /* 描述文字动画 */
  @keyframes fadeSlideUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* 文字浮动动画 */
  @keyframes textFloat {
    0%, 100% {
      transform: translateY(0);
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }
    25% {
      transform: translateY(-3px);
      text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);
    }
    75% {
      transform: translateY(3px);
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
    }
  }
  </style>