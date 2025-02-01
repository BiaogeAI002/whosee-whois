/*
 * @Author: AsisYu 2773943729@qq.com
 * @Date: 2025-01-17 21:22:04
 * @LastEditors: AsisYu 2773943729@qq.com
 * @LastEditTime: 2025-01-18 01:02:03
 * @FilePath: \dmainwhoseek\server\middleware\cors.go
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
package middleware

import "github.com/gin-gonic/gin"

func Cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		// 仅允许特定域名
		allowedOrigins := map[string]bool{
			"http://localhost:8080": true, // Vue开发环境
			"http://localhost:3000": true, // 开发环境
		}

		if allowedOrigins[origin] {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			c.Writer.Header().Set("Access-Control-Allow-Headers",
				"Content-Type, Authorization, X-Requested-With")
			c.Writer.Header().Set("Access-Control-Max-Age", "86400")
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		}

		// 处理预检请求
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
