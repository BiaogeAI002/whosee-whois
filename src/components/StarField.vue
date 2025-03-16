<template>
  <div class="star-field">
    <div v-for="(star, index) in stars" 
         :key="index" 
         class="star"
         :style="star.style"
         :class="star.class">
    </div>
    <div class="glow-effect top-right"></div>
    <div class="glow-effect bottom-left"></div>
    <div class="shooting-star" v-for="(star, index) in shootingStars" :key="`shooting-${index}`" :style="star.style"></div>
    <div class="nebula nebula-1"></div>
    <div class="nebula nebula-2"></div>
    <div class="nebula nebula-3"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const stars = ref([])
const shootingStars = ref([])
let shootingStarInterval

onMounted(() => {
  // 创建200个星星
  for (let i = 0; i < 200; i++) {
    stars.value.push({
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        backgroundColor: getRandomColor(),
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        opacity: Math.random() * 0.8 + 0.2
      },
      class: `move-${Math.floor(Math.random() * 5)}`
    })
  }
  
  // 定期创建流星
  createShootingStar()
  shootingStarInterval = setInterval(createShootingStar, 8000)
})

onUnmounted(() => {
  clearInterval(shootingStarInterval)
})

function createShootingStar() {
  const startX = Math.random() * 100
  const startY = Math.random() * 30
  const angle = Math.random() * 45 + 20 // 20-65度角
  const length = Math.random() * 150 + 100 // 100-250px长度
  const duration = Math.random() * 2 + 1 // 1-3秒
  const delay = Math.random() * 5 // 0-5秒延迟
  
  const newStar = {
    style: {
      left: `${startX}%`,
      top: `${startY}%`,
      transform: `rotate(${angle}deg)`,
      width: `${length}px`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`
    }
  }
  
  shootingStars.value.push(newStar)
  
  // 移除流星，避免DOM元素过多
  setTimeout(() => {
    const index = shootingStars.value.indexOf(newStar)
    if (index > -1) {
      shootingStars.value.splice(index, 1)
    }
  }, (duration + delay + 0.5) * 1000)
}

function getRandomColor() {
  const colors = [
    'rgba(255, 255, 255, 0.9)', // 白色
    'rgba(255, 215, 0, 0.8)',   // 金色
    'rgba(52, 152, 219, 0.8)',  // 蓝色
    'rgba(155, 89, 182, 0.8)',  // 紫色
    'rgba(52, 231, 228, 0.8)',  // 青色
    'rgba(46, 204, 113, 0.8)'   // 绿色
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
</script>

<style scoped>
.star-field {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.star {
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.4);
  animation: twinkle 3s infinite ease-in-out;
}

/* 闪烁动画 */
@keyframes twinkle {
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 结合闪烁和移动的动画 - 减慢动画速度以减轻性能负担 */
.move-0 {
  animation: twinkle 4s infinite ease-in-out, move0 40s infinite ease-in-out;
}

.move-1 {
  animation: twinkle 5s infinite ease-in-out, move1 45s infinite ease-in-out;
}

.move-2 {
  animation: twinkle 6s infinite ease-in-out, move2 50s infinite ease-in-out;
}

.move-3 {
  animation: twinkle 4.5s infinite ease-in-out, move3 42s infinite ease-in-out;
}

.move-4 {
  animation: twinkle 5.5s infinite ease-in-out, move4 48s infinite ease-in-out;
}

/* 星星移动路径 */
@keyframes move0 {
  0% { transform: translate(0, 0) scale(0.8); }
  25% { transform: translate(10px, 10px) scale(1.2); }
  50% { transform: translate(20px, 0) scale(0.8); }
  75% { transform: translate(10px, -10px) scale(1.2); }
  100% { transform: translate(0, 0) scale(0.8); }
}

@keyframes move1 {
  0% { transform: translate(0, 0) scale(0.8); }
  25% { transform: translate(-15px, 10px) scale(1.2); }
  50% { transform: translate(-25px, 0) scale(0.8); }
  75% { transform: translate(-15px, -10px) scale(1.2); }
  100% { transform: translate(0, 0) scale(0.8); }
}

@keyframes move2 {
  0% { transform: translate(0, 0) scale(0.8); }
  25% { transform: translate(15px, 15px) scale(1.2); }
  50% { transform: translate(0, 25px) scale(0.8); }
  75% { transform: translate(-15px, 15px) scale(1.2); }
  100% { transform: translate(0, 0) scale(0.8); }
}

@keyframes move3 {
  0% { transform: translate(0, 0) scale(0.8); }
  25% { transform: translate(-10px, -15px) scale(1.2); }
  50% { transform: translate(0, -25px) scale(0.8); }
  75% { transform: translate(10px, -15px) scale(1.2); }
  100% { transform: translate(0, 0) scale(0.8); }
}

@keyframes move4 {
  0% { transform: translate(0, 0) scale(0.8); }
  33% { transform: translate(15px, -10px) scale(1.2); }
  66% { transform: translate(-15px, -10px) scale(0.8); }
  100% { transform: translate(0, 0) scale(0.8); }
}

/* 发光效果 */
.glow-effect {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: glow 15s infinite ease-in-out;
}

.top-right {
  top: -100px;
  right: -100px;
  background: radial-gradient(circle, rgba(52, 152, 219, 0.8) 0%, transparent 70%);
}

.bottom-left {
  bottom: -100px;
  left: -100px;
  background: radial-gradient(circle, rgba(155, 89, 182, 0.8) 0%, transparent 70%);
  animation-delay: 7.5s;
}

@keyframes glow {
  0%, 100% {
    opacity: 0.15;
    transform: scale(1);
  }
  50% {
    opacity: 0.25;
    transform: scale(1.2);
  }
}

/* 流星 */
.shooting-star {
  position: absolute;
  height: 2px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0));
  animation: shooting 3s linear forwards;
  opacity: 0;
}

@keyframes shooting {
  0% {
    opacity: 0;
    transform: translateX(0) translateY(0);
  }
  10% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(100px) translateY(100px);
  }
}

/* 星云效果 */
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.07;
  animation: nebula-float 30s infinite ease-in-out;
}

.nebula-1 {
  width: 400px;
  height: 400px;
  top: 10%;
  right: 10%;
  background: radial-gradient(circle, rgba(52, 152, 219, 0.6) 0%, transparent 70%);
}

.nebula-2 {
  width: 350px;
  height: 350px;
  bottom: 15%;
  left: 15%;
  background: radial-gradient(circle, rgba(155, 89, 182, 0.6) 0%, transparent 70%);
  animation-delay: 10s;
}

.nebula-3 {
  width: 300px;
  height: 300px;
  top: 40%;
  left: 30%;
  background: radial-gradient(circle, rgba(46, 204, 113, 0.5) 0%, transparent 70%);
  animation-delay: 20s;
}

@keyframes nebula-float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, 20px) scale(1.1);
  }
  50% {
    transform: translate(0, 40px) scale(1);
  }
  75% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* 针对低性能设备的优化 */
@media (prefers-reduced-motion: reduce) {
  .star, .move-0, .move-1, .move-2, .move-3, .move-4, 
  .glow-effect, .shooting-star, .nebula {
    animation: none !important;
  }
}
</style>