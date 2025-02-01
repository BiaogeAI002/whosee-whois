<template>
  <div class="star-field">
    <div v-for="(star, index) in stars" 
         :key="index" 
         class="star"
         :style="star.style"
         :class="star.class">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stars = ref([])

onMounted(() => {
  // 创建100个星星
  for (let i = 0; i < 100; i++) {
    stars.value.push({
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        backgroundColor: getRandomColor(),
        width: `${Math.random() * 3 + 2}px`,
        height: `${Math.random() * 3 + 2}px`
      },
      class: `move-${Math.floor(Math.random() * 5)}`
    })
  }
})

function getRandomColor() {
  const colors = [
    '#fff', // 白色
    '#ffd700', // 金色
    '#ff69b4', // 粉色
    '#00ffff', // 青色
    '#7fffd4', // 碧绿色
    '#9370db'  // 紫色
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
}

.star {
  position: absolute;
  border-radius: 50%;
  animation: twinkle 0.5s infinite;  /* 快速闪烁 */
}

/* 快速闪烁动画 */
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

/* 结合闪烁和移动的动画 */
.move-0 {
  animation: twinkle 0.5s infinite, move0 12s infinite;
}

.move-1 {
  animation: twinkle 0.5s infinite, move1 15s infinite;
}

.move-2 {
  animation: twinkle 0.5s infinite, move2 18s infinite;
}

.move-3 {
  animation: twinkle 0.5s infinite, move3 13s infinite;
}

.move-4 {
  animation: twinkle 0.5s infinite, move4 16s infinite;
}

@keyframes move0 {
  0% { transform: translate(0, 0); }
  25% { transform: translate(15px, 15px); }
  50% { transform: translate(-10px, 20px); }
  75% { transform: translate(-15px, 8px); }
  100% { transform: translate(0, 0); }
}

@keyframes move1 {
  0% { transform: translate(0, 0); }
  33% { transform: translate(-20px, 15px); }
  66% { transform: translate(20px, -15px); }
  100% { transform: translate(0, 0); }
}

@keyframes move2 {
  0% { transform: translate(0, 0); }
  25% { transform: translate(20px, -20px); }
  50% { transform: translate(8px, 15px); }
  75% { transform: translate(-15px, -8px); }
  100% { transform: translate(0, 0); }
}

@keyframes move3 {
  0% { transform: translate(0, 0); }
  33% { transform: translate(-15px, -15px) rotate(60deg); }
  66% { transform: translate(15px, 15px) rotate(-60deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

@keyframes move4 {
  0% { transform: translate(0, 0); }
  25% { transform: translate(15px, 0); }
  50% { transform: translate(15px, 15px); }
  75% { transform: translate(0, 15px); }
  100% { transform: translate(0, 0); }
}
</style>