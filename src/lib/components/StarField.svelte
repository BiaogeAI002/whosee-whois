<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  let stars = [];
  let shootingStars = [];
  let shootingStarInterval;
  
  function createStar() {
    return {
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
    };
  }
  
  function getRandomColor() {
    const colors = [
      'rgba(255, 255, 255, 0.8)',
      'rgba(173, 216, 230, 0.8)',
      'rgba(240, 248, 255, 0.8)',
      'rgba(255, 223, 186, 0.8)',
      'rgba(255, 192, 203, 0.8)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  function createShootingStar() {
    const left = Math.random() * 100;
    const top = Math.random() * 50;
    const angle = Math.random() * 45 - 22.5;
    
    shootingStars = [...shootingStars, {
      style: {
        left: `${left}%`,
        top: `${top}%`,
        transform: `rotate(${angle}deg)`,
        animationDuration: `${Math.random() * 2 + 1}s`,
        animationDelay: `${Math.random() * 5}s`
      }
    }];
    
    // 移除旧的流星
    setTimeout(() => {
      shootingStars = shootingStars.slice(1);
    }, 3000);
  }
  
  onMount(() => {
    // 创建200个星星
    for (let i = 0; i < 200; i++) {
      stars = [...stars, createStar()];
    }
    
    // 定期创建流星
    createShootingStar();
    shootingStarInterval = setInterval(createShootingStar, 8000);
  });
  
  onDestroy(() => {
    clearInterval(shootingStarInterval);
  });
</script>

<div class="star-field">
  {#each stars as star, index (index)}
    <div 
      class="star {star.class}"
      style="left: {star.style.left}; 
             top: {star.style.top}; 
             animation-delay: {star.style.animationDelay}; 
             background-color: {star.style.backgroundColor}; 
             width: {star.style.width}; 
             height: {star.style.height}; 
             opacity: {star.style.opacity};"
    ></div>
  {/each}
  
  <div class="glow-effect top-right"></div>
  <div class="glow-effect bottom-left"></div>
  
  {#each shootingStars as star, index (index)}
    <div 
      class="shooting-star"
      style="left: {star.style.left}; 
             top: {star.style.top}; 
             transform: {star.style.transform}; 
             animation-duration: {star.style.animationDuration}; 
             animation-delay: {star.style.animationDelay};"
    ></div>
  {/each}
  
  <div class="nebula nebula-1"></div>
  <div class="nebula nebula-2"></div>
  <div class="nebula nebula-3"></div>
</div>

<style>
  .star-field {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;
  }
  
  .star {
    position: absolute;
    border-radius: 50%;
    animation: twinkle 4s infinite ease-in-out;
  }
  
  .move-0 { animation: twinkle 3s infinite ease-in-out; }
  .move-1 { animation: twinkle 4s infinite ease-in-out; }
  .move-2 { animation: twinkle 5s infinite ease-in-out; }
  .move-3 { animation: twinkle 6s infinite ease-in-out; }
  .move-4 { animation: twinkle 7s infinite ease-in-out; }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.2; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  
  .glow-effect {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(111, 63, 251, 0.2) 0%, rgba(70, 41, 159, 0.1) 40%, transparent 70%);
    filter: blur(20px);
  }
  
  .top-right {
    top: -100px;
    right: -100px;
  }
  
  .bottom-left {
    bottom: -100px;
    left: -100px;
  }
  
  .shooting-star {
    position: absolute;
    width: 100px;
    height: 2px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
    animation: shooting 3s linear forwards;
  }
  
  @keyframes shooting {
    0% { transform: translateX(0) translateY(0) rotate(0); opacity: 0; }
    10% { opacity: 1; }
    100% { transform: translateX(500px) translateY(300px) rotate(0); opacity: 0; }
  }
  
  .nebula {
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.15;
  }
  
  .nebula-1 {
    top: 20%;
    left: 10%;
    background: radial-gradient(circle, rgba(111, 63, 251, 0.4) 0%, rgba(111, 63, 251, 0.1) 70%, transparent 100%);
    animation: float 20s infinite ease-in-out;
  }
  
  .nebula-2 {
    bottom: 10%;
    right: 20%;
    background: radial-gradient(circle, rgba(251, 63, 223, 0.4) 0%, rgba(251, 63, 223, 0.1) 70%, transparent 100%);
    animation: float 25s infinite ease-in-out reverse;
  }
  
  .nebula-3 {
    top: 50%;
    right: 30%;
    background: radial-gradient(circle, rgba(63, 251, 237, 0.4) 0%, rgba(63, 251, 237, 0.1) 70%, transparent 100%);
    animation: float 30s infinite ease-in-out;
  }
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(50px, 25px); }
    50% { transform: translate(0, 50px); }
    75% { transform: translate(-50px, 25px); }
  }
</style>