/**
 * 截图API路由处理程序
 * 处理域名截图请求
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { env } from '$env/dynamic/private';

// 确保截图目录存在
const screenshotDir = path.join(process.cwd(), 'static', 'screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

/**
 * GET 处理程序 - 处理截图请求
 */
export const GET: RequestHandler = async ({ params }) => {
  try {
    const { domain } = params;
    
    if (!domain) {
      console.log('截图请求: 缺少域名参数');
      return json({ error: '缺少域名参数' }, { status: 400 });
    }
    
    console.log(`截图请求: 开始为域名 ${domain} 生成截图`);
    
    // 检查是否已有截图缓存
    const screenshotPath = path.join(screenshotDir, `${domain}.png`);
    const cacheTime = 24 * 60 * 60 * 1000; // 24小时缓存
    
    if (fs.existsSync(screenshotPath)) {
      const stats = fs.statSync(screenshotPath);
      const fileAge = Date.now() - stats.mtimeMs;
      
      // 如果截图文件存在且未过期，直接返回缓存路径
      if (fileAge < cacheTime) {
        console.log(`截图请求: 使用缓存的截图 ${domain}`);
        return json({ 
          success: true, 
          imageUrl: `/screenshots/${domain}.png`,
          fromCache: true
        });
      }
    }
    
    // 启动浏览器
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      // 创建新页面
      const page = await browser.newPage();
      
      // 设置更大的视口以确保内容完全可见
      await page.setViewport({ width: 1920, height: 1080 });

      // 导航到目标网页
      await page.goto(`https://www.itdog.cn/ping/${domain}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // 等待"单次测试"按钮出现
      await page.waitForSelector('.btn.btn-primary.ml-3.mb-3', {
        visible: true,
        timeout: 10000
      });

      // 点击"单次测试"按钮
      await page.click('.btn.btn-primary.ml-3.mb-3');

      // 等待进度条出现并完成
      await page.waitForFunction(() => {
        const progressBar = document.querySelector('.progress-bar');
        const nodeNum = document.querySelector('#check_node_num');
        if (!progressBar || !nodeNum) return false;
        
        // 获取当前进度值和总节点数
        const current = parseInt(progressBar.getAttribute('aria-valuenow') || '0');
        const total = parseInt(nodeNum.textContent || '0');
        
        // 确保进度值有效且达到总数
        return total > 0 && current === total;
      }, { 
        timeout: 60000,
        polling: 1000 // 每秒检查一次
      });

      // 额外等待一段时间确保地图更新
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 获取目标元素 - 整行包含地图和数据表格
      const element = await page.$('.col-12.mt-3 .row');
      
      if (element) {
        // 截取元素
        await element.screenshot({
          path: screenshotPath,
          omitBackground: true,
          // 确保捕获完整内容
          captureBeyondViewport: true
        });
        console.log(`截图请求: 完成域名 ${domain} 的截图`);
      } else {
        throw new Error('未找到目标元素');
      }

      return json({ 
        success: true, 
        imageUrl: `/screenshots/${domain}.png`,
        fromCache: false
      });
    } finally {
      // 确保浏览器关闭
      await browser.close();
    }
  } catch (error) {
    console.error('截图处理错误:', error);
    return json({ 
      error: '截图生成失败', 
      message: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
};