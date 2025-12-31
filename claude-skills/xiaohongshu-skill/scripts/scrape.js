#!/usr/bin/env node
/**
 * 小红书帖子爬取脚本
 * 用法: node scrape.js "帖子URL"
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const url = process.argv[2];
if (!url) {
  console.error('用法: node scrape.js "帖子URL"');
  process.exit(1);
}

const cookiesPath = path.join(__dirname, '../xhs_cookies.json');
const resultsDir = path.join(__dirname, '../results');

// 确保结果目录存在
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

async function scrape() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  // 加载 cookies
  if (fs.existsSync(cookiesPath)) {
    try {
      const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf-8'));
      await context.addCookies(cookies);
    } catch (e) {
      console.log('⚠️  无法加载 cookies，需要重新登录');
    }
  }

  const page = await context.newPage();

  try {
    console.log(`\n正在访问: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    console.log('等待页面加载...');
    await page.waitForTimeout(30000);

    let pageTitle = await page.title();
    let currentUrl = page.url();
    console.log(`\n页面标题: ${pageTitle}`);
    console.log(`当前URL: ${currentUrl}`);

    // 如果被重定向或显示推荐内容，重新导航到目标 URL
    const targetItemId = url.match(/item\/([^\/\?]+)/)?.[1] || url.match(/explore\/([^\/\?]+)/)?.[1];
    if (currentUrl.includes('404') ||
        pageTitle.includes('你访问的页面不见了') ||
        pageTitle.includes('当前笔记暂时无法浏览') ||
        (targetItemId && !currentUrl.includes(targetItemId))) {
      console.log('⚠️  检测到页面限制或重定向，重新导航到目标 URL...');
      console.log(`目标 ID: ${targetItemId}`);

      // 重新导航到原始 URL
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      console.log('等待重新加载页面（25秒）...');
      await page.waitForTimeout(25000);

      pageTitle = await page.title();
      currentUrl = page.url();
      console.log(`重加载后页面标题: ${pageTitle}`);
      console.log(`重加载后当前URL: ${currentUrl}`);
    }
    console.log('');

    // 提取数据
    const data = await page.evaluate(() => {
      const result = {
        title: '',
        content: '',
        author: '',
        likes: '',
        collects: '',
        comments: '',
        shares: '',
        images: []
      };

      // 标题
      const titleSelectors = ['.title', 'h1', '.post-title', '.note-title'];
      for (const selector of titleSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          if (el.innerText && el.innerText.trim() && el.innerText.trim().length > 2) {
            result.title = el.innerText.trim();
            break;
          }
        }
        if (result.title) break;
      }

      // 作者
      const authorSelectors = ['.author-name', '.user-name', '.username'];
      for (const selector of authorSelectors) {
        const el = document.querySelector(selector);
        if (el && el.innerText && el.innerText.trim()) {
          result.author = el.innerText.trim();
          break;
        }
      }

      // 内容
      const contentSelectors = ['.note-text', '.post-content', '.content'];
      for (const selector of contentSelectors) {
        const el = document.querySelector(selector);
        if (el && el.innerText && el.innerText.trim() && el.innerText.trim().length > 10) {
          result.content = el.innerText.trim();
          break;
        }
      }

      // 互动数据
      const interactionElements = document.querySelectorAll('[class*="count"], [class*="like"], [class*="collect"]');
      interactionElements.forEach(el => {
        const text = el.innerText?.trim();
        const className = el.className;

        if (text && /^\d+(\.\d+[wk万])?$/.test(text.replace(/,/g, ''))) {
          if (className.includes('like') || text.includes('赞')) {
            result.likes = text;
          } else if (className.includes('collect') || text.includes('收藏')) {
            result.collects = text;
          } else if (className.includes('comment') || text.includes('评论')) {
            result.comments = text;
          } else if (className.includes('share') || text.includes('分享')) {
            result.shares = text;
          }
        }
      });

      // 图片
      const imgSelectors = ['.note-img img', '.post-images img'];
      const imgSet = new Set();
      for (const selector of imgSelectors) {
        const imgs = document.querySelectorAll(selector);
        imgs.forEach(img => {
          if (img.src && !img.src.includes('avatar') && !img.src.includes('logo')) {
            imgSet.add(img.src);
          }
        });
        if (imgSet.size > 0) break;
      }
      result.images = Array.from(imgSet);

      return result;
    });

    // 保存结果
    const timestamp = Date.now();
    const resultPath = path.join(resultsDir, `xhs_post_${timestamp}.json`);
    const output = {
      url,
      timestamp: new Date().toISOString(),
      data
    };

    fs.writeFileSync(resultPath, JSON.stringify(output, null, 2), 'utf-8');

    // 显示结果
    console.log('========== 帖子信息 ==========');
    console.log(`标题: ${data.title || '未找到'}`);
    console.log(`作者: ${data.author || '未找到'}`);
    console.log(`点赞: ${data.likes || '未找到'}`);
    console.log(`收藏: ${data.collects || '未找到'}`);
    console.log(`评论: ${data.comments || '未找到'}`);
    console.log(`分享: ${data.shares || '未找到'}`);
    console.log(`图片数量: ${data.images.length}`);
    if (data.content) {
      console.log(`\n内容预览:\n${data.content.substring(0, 200)}...`);
    }
    console.log('\n==============================\n');
    console.log(`✓ 已保存到: ${resultPath}`);

    // 保存 cookies
    const cookies = await context.cookies();
    fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2), 'utf-8');
    console.log('✓ 已保存登录信息');

  } finally {
    await browser.close();
  }
}

scrape().catch(console.error);
