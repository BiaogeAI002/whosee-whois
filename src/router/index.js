/*
 * @Author: AsisYu 2773943729@qq.com
 * @Date: 2025-01-16 22:26:27
 * @LastEditors: AsisYu 2773943729@qq.com
 * @LastEditTime: 2025-01-16 22:31:56
 * @FilePath: \dmainwhoseek\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: AsisYu 2773943729@qq.com
 * @Date: 2025-01-16 22:26:27
 * @LastEditors: AsisYu 2773943729@qq.com
 * @LastEditTime: 2025-01-16 22:26:33
 * @FilePath: \dmainwhoseek\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router 