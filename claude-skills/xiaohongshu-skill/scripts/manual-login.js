#!/usr/bin/env node
/**
 * 小红书手动登录脚本
 * 用法: node manual-login.js
 *
 * 此脚本会打开浏览器并等待您手动登录
 * 登录完成后，按 Ctrl+C 保存 cookies
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const cookiesPath = path.join(__dirname, '../xhs_cookies.json');

async function manualLogin() {
  console.log('========================================');
  console.log('  小红书手动登录工具');
  console.log('========================================\n');
  console.log('📝 使用说明:');
  console.log('1. 浏览器将自动打开');
  console.log('2. 请手动完成登录操作');
  console.log('3. 登录成功后，访问几个帖子页面');
  console.log('4. 完成后按 Ctrl+C 退出并保存 cookies\n');
  console.log('========================================\n');

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
    timezoneId: 'Asia/Shanghai'
  });

  // 隐藏 webdriver 特征
  const page = await context.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined
    });
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5]
    });
    window.chrome = { runtime: {} };
  });

  // 访问小红书首页
  console.log('正在打开小红书首页...\n');
  await page.goto('https://www.xiaohongshu.com', {
    waitUntil: 'domcontentloaded'
  });

  console.log('✓ 浏览器已打开，请开始登录流程...\n');

  // 监听退出信号
  process.on('SIGINT', async () => {
    console.log('\n\n正在保存 cookies...');

    const cookies = await context.cookies();
    fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2), 'utf-8');

    console.log(`✓ 已保存 ${cookies.length} 个 cookies 到: ${cookiesPath}`);
    console.log('✓ 登录信息已保存，现在可以使用爬虫脚本了\n');

    await browser.close();
    process.exit(0);
  });

  // 保持浏览器运行
  console.log('💡 提示: 完成登录后按 Ctrl+C 退出\n');

  // 定期显示提醒
  let dotCount = 0;
  const reminder = setInterval(() => {
    process.stdout.write('\r等待登录中' + '.'.repeat(dotCount % 4) + '    ');
    dotCount++;
  }, 1000);

  // 等待用户手动操作
  await new Promise(() => {});
}

manualLogin().catch(console.error);
