#!/usr/bin/env node
/**
 * 小红书帖子爬取脚本（反检测版）
 * 用法: node scrape-stealth.js "帖子URL"
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const url = process.argv[2];
if (!url) {
  console.error('用法: node scrape-stealth.js "帖子URL"');
  process.exit(1);
}

const cookiesPath = path.join(__dirname, '../xhs_cookies.json');
const resultsDir = path.join(__dirname, '../results');

if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

async function scrape() {
  console.log('========================================');
  console.log('  小红书帖子爬取工具（反检测版）');
  console.log('========================================\n');

  // 使用更多反检测措施启动浏览器
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--window-position=0,0',
      '--window-size=1280,720'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    permissions: ['geolocation', 'notifications']
  });

  // 加载 cookies
  if (fs.existsSync(cookiesPath)) {
    try {
      const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf-8'));
      console.log(`✓ 已加载 ${cookies.length} 个 cookies`);
      await context.addCookies(cookies);
    } catch (e) {
      console.log('⚠️  无法加载 cookies:', e.message);
    }
  }

  const page = await context.newPage();

  // 隐藏 webdriver 特征
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined
    });
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5]
    });
    Object.defineProperty(navigator, 'languages', {
      get: () => ['zh-CN', 'zh', 'en']
    });
    window.chrome = {
      runtime: {}
    };
  });

  try {
    console.log(`\n正在访问: ${url}`);
    console.log('等待页面加载...\n');

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // 等待页面完全加载
    console.log('等待页面完全加载（30秒）...');
    await page.waitForTimeout(30000);

    // 检查页面状态
    let title = await page.title();
    let currentUrl = page.url();
    console.log(`页面标题: ${title}`);
    console.log(`当前URL: ${currentUrl}\n`);

    // 如果被重定向或显示推荐内容，重新导航到目标 URL
    const targetItemId = url.match(/item\/([^\/\?]+)/)?.[1] || url.match(/explore\/([^\/\?]+)/)?.[1];
    if (currentUrl.includes('404') ||
        title.includes('你访问的页面不见了') ||
        title.includes('当前笔记暂时无法浏览') ||
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

      // 更新页面信息
      title = await page.title();
      currentUrl = page.url();
      console.log(`重加载后页面标题: ${title}`);
      console.log(`重加载后当前URL: ${currentUrl}\n`);
    }

    // 提取数据
    console.log('开始提取数据...\n');
    const postData = await page.evaluate(() => {
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

      // 检查页面文本内容
      const bodyText = document.body.innerText;

      // 检查是否是错误页面
      if (bodyText.includes('笔记暂时无法浏览') || bodyText.includes('你访问的页面不见了')) {
        console.log('页面显示: 笔记暂时无法浏览');
        result.title = '当前笔记暂时无法浏览';
        return result;
      }

      // 标题
      const titleSelectors = [
        '.title',
        'h1',
        '.post-title',
        '.note-title',
        '.note-content h1',
        '.note-detail h1',
        '[class*="title"] h1'
      ];

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
      const authorSelectors = [
        '.author-name',
        '.user-name',
        '.username',
        '[class*="author"] [class*="name"]',
        'span[class*="nickname"]'
      ];

      for (const selector of authorSelectors) {
        const el = document.querySelector(selector);
        if (el && el.innerText && el.innerText.trim()) {
          result.author = el.innerText.trim();
          break;
        }
      }

      // 内容
      const contentSelectors = [
        '.note-text',
        '.post-content',
        '.content',
        '.desc',
        '[class*="note"] [class*="content"]',
        '[class*="detail"] [class*="desc"]'
      ];

      for (const selector of contentSelectors) {
        const el = document.querySelector(selector);
        if (el && el.innerText && el.innerText.trim()) {
          const text = el.innerText.trim();
          if (text.length > 10) {
            result.content = text;
            break;
          }
        }
      }

      // 互动数据
      const interactionElements = document.querySelectorAll('[class*="count"], [class*="like"], [class*="collect"], [class*="comment"], [class*="share"]');
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
      const imgSelectors = [
        '.note-img img',
        '.post-images img',
        'img[class*="image"]',
        '[class*="note"] img',
        '[class*="detail"] img'
      ];

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
      data: postData
    };

    fs.writeFileSync(resultPath, JSON.stringify(output, null, 2), 'utf-8');

    // 显示结果
    console.log('========================================');
    console.log('  帖子信息');
    console.log('========================================\n');
    console.log(`标题: ${postData.title || '未找到'}`);
    console.log(`作者: ${postData.author || '未找到'}`);
    console.log(`点赞: ${postData.likes || '未找到'}`);
    console.log(`收藏: ${postData.collects || '未找到'}`);
    console.log(`评论: ${postData.comments || '未找到'}`);
    console.log(`分享: ${postData.shares || '未找到'}`);
    console.log(`图片数量: ${postData.images.length}`);

    if (postData.content && postData.content.length > 0) {
      console.log(`\n内容预览:\n${postData.content.substring(0, 200)}...`);
    }

    if (postData.images.length > 0) {
      console.log(`\n图片链接:`);
      postData.images.slice(0, 3).forEach((img, i) => {
        console.log(`  ${i + 1}. ${img.substring(0, 80)}...`);
      });
      if (postData.images.length > 3) {
        console.log(`  ... 还有 ${postData.images.length - 3} 张图片`);
      }
    }

    console.log('\n==============================\n');
    console.log(`✓ 已保存到: ${resultPath}`);

    // 保存 cookies
    const cookies = await context.cookies();
    fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2), 'utf-8');
    console.log(`✓ 已保存 ${cookies.length} 个 cookies`);

  } catch (error) {
    console.error('\n❌ 爬取错误:', error.message);
  } finally {
    console.log('\n--- 3秒后关闭浏览器 ---');
    await page.waitForTimeout(3000);
    await browser.close();
  }
}

scrape().catch(console.error);
