/*
 * @Author: AsisYu 2773943729@qq.com
 * @Date: 2025-01-12 16:47:39
 * @LastEditors: AsisYu 2773943729@qq.com
 * @LastEditTime: 2025-01-18 01:19:17
 * @FilePath: \dmainwhoseek\vue.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        },
        onProxyReq: function(proxyReq) {
          // 添加调试日志
          console.log('Proxy request headers:', proxyReq.getHeaders())
        }
      }
    }
  }
})
