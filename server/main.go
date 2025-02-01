/*
 * @Author: AsisYu 2773943729@qq.com
 * @Date: 2025-01-18 19:57:27
 * @LastEditors: AsisYu 2773943729@qq.com
 * @LastEditTime: 2025-01-18 22:38:29
 * @FilePath: \dmainwhoseek\server\main.go
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
package main

import (
	"dmainwhoseek/handlers"
	"dmainwhoseek/middleware"
	"dmainwhoseek/providers"
	"dmainwhoseek/services"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// 自定义日志格式
func setupLogger() {
	// 设置日志格式，包含时间戳、文件信息和日志级别
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	// 创建日志文件
	logFile, err := os.OpenFile(
		fmt.Sprintf("logs/server_%s.log", time.Now().Format("2006-01-02")),
		os.O_CREATE|os.O_WRONLY|os.O_APPEND,
		0666,
	)
	if err != nil {
		log.Printf("警告: 无法创建日志文件: %v", err)
		return
	}

	// 同时输出到控制台和文件
	log.SetOutput(logFile)
}

func main() {
	// 设置日志
	setupLogger()

	// 加载 .env 文件
	if err := godotenv.Load(); err != nil {
		log.Printf("警告: 未找到 .env 文件: %v", err)
	}

	// 设置 gin 模式
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()

	// 初始化 Redis
	rdb := handlers.InitRedis()
	log.Println("Redis 连接成功")

	// CORS必须在其他中间件之前
	r.Use(middleware.Cors())
	r.Use(middleware.ErrorHandler()) // 错误处理应该在前面
	r.Use(gin.Recovery())
	r.Use(middleware.Security())
	r.Use(middleware.RateLimit(rdb))
	r.Use(middleware.EnhancedLogging())
	r.Use(middleware.Monitoring(rdb))

	// 初始化WHOIS管理器
	whoisManager := services.NewWhoisManager(rdb)
	whoisManager.AddProvider(providers.NewWhoisFreaksProvider())
	whoisManager.AddProvider(providers.NewWhoisXMLProvider())

	// API 路由组
	api := r.Group("/api")
	{
		// 健康检查
		api.GET("/health", func(c *gin.Context) {
			log.Printf("健康检查请求 | IP: %s", c.ClientIP())
			c.JSON(200, gin.H{"status": "up"})
		})

		// 获取临时token的端点 - 无需认证
		api.POST("/auth/token", middleware.GenerateToken(rdb))

		// 需要认证的路由
		authorized := api.Group("")
		authorized.Use(middleware.AuthRequired(rdb))
		{
			authorized.POST("/query", func(c *gin.Context) {
				var req struct {
					Domain string `json:"domain" binding:"required"`
				}

				if err := c.ShouldBindJSON(&req); err != nil {
					c.JSON(400, gin.H{"error": "Invalid request format"})
					return
				}

				response, err, cached := whoisManager.Query(req.Domain)
				if err != nil {
					c.JSON(500, gin.H{"error": err.Error()})
					return
				}

				if cached {
					c.Header("X-Cache", "HIT")
				} else {
					c.Header("X-Cache", "MISS")
				}

				c.JSON(200, response)
			})
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
		log.Println("未设置 PORT 环境变量，使用默认端口 3000")
	}

	log.Printf("服务器启动于端口 %s | 模式: %s", port, gin.Mode())

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("服务器启动失败: %v", err)
	}
}
