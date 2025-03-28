<script lang="ts">
  export let type: 'available' | 'registered' | 'new-registered' | 'unknown' = 'unknown';
  export let text: string;
  
  // 状态到样式的映射
  const typeClasses = {
    'available': 'bg-gradient-to-r from-green-400 to-green-500 pulse-success',
    'registered': 'bg-gradient-to-r from-blue-400 to-blue-500',
    'new-registered': 'bg-gradient-to-r from-purple-400 to-purple-500 pulse-info',
    'unknown': 'bg-gradient-to-r from-gray-400 to-gray-500',
  };
</script>

<div class="badge {typeClasses[type]}">
  {text}
</div>

<style>
  .badge {
    display: inline-block;
    padding: 0.5rem 1.25rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.875rem;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .pulse-success {
    animation: pulse-success 2s infinite;
  }
  
  .pulse-info {
    animation: pulse-info 2s infinite;
  }
  
  @keyframes pulse-success {
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
  
  @keyframes pulse-info {
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
  
  @media (max-width: 768px) {
    .badge {
      padding: 0.375rem 1rem;
      font-size: 0.8125rem;
    }
  }
</style> 