/*
 * @Author: AsisYu 2773943729@qq.com
 * @Date: 2025-01-12 16:47:39
 * @LastEditors: AsisYu 2773943729@qq.com
 * @LastEditTime: 2025-01-17 23:06:01
 * @FilePath: \dmainwhoseek\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import { createHead } from '@vueuse/head'

const app = createApp(App)
const head = createHead()

// 防止 XSS
app.config.globalProperties.$sanitize = (html) => {
  return html.replace(/[&<>"']/g, (match) => {
    const escape = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }
    return escape[match]
  })
}

// 添加全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err)
  ElMessage.error('操作失败，请刷新页面重试')
}

app.use(router)
app.use(ElementPlus)
app.use(head)

app.mount('#app')
