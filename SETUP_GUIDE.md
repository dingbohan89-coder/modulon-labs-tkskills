# 🚀 Claude Skills 配置指南

> TikTok Claude Skill 完整配置说明（模块实验室/熙硅科技）

---

## 📋 前置要求
开始前请确保：
1) Node.js ≥ 18  
2) Claude Code 或 Cursor（带 Claude Code 插件）  
3) Git（可选，便于克隆）

---

## 📦 获取项目
**方式 A：Git 克隆**
```bash
git clone <项目地址> "TikTok Skills"
cd "TikTok Skills"
```

**方式 B：下载 ZIP**
1. 下载并解压到任意路径，例如 `~/TikTok Skills`
2. 进入解压后的目录

---

## 🔧 安装依赖
```bash
cd "TikTok Skills"
cd tiktok-skill && npm install && cd ..
```

如果安装缓慢，可使用国内镜像：
```bash
npm install --registry=https://registry.npmmirror.com
```

---

## ⚙️ 配置 Claude Code
找到或创建配置文件：
- Windows: `C:\Users\<你>\AppData\Roaming\Cursor\User\globalStorage\mcp.json`
- Mac: `~/Library/Application Support/Cursor/User/globalStorage/mcp.json`
- Linux: `~/.config/Cursor/User/globalStorage/mcp.json`

写入（请替换为你的绝对路径）：
```json
{
  "skillsPath": "你的完整路径/TikTok Skills"
}
```

---

## 🔄 重启并验证
1) 完全关闭 Claude Code/Cursor  
2) 重新打开  
3) 在对话中输入：
```
你可以做什么？
```
应看到 `tiktok-video-scraper (TikTok爬虫)`

---

## 🔑 首次使用（登录）
```bash
cd "TikTok Skills"/tiktok-skill
node scripts/login.js   # 浏览器中手动登录后按 Ctrl+C
```
Cookies 会自动保存，后续调用无需再次登录。

---

## 📁 目录结构
```
TikTok Skills/
├── README.md
├── SETUP_GUIDE.md
├── QUICK_SETUP.md
└── tiktok-skill/
    ├── SKILL.md
    ├── package.json
    ├── results/
    └── scripts/
        ├── scrape.js
        └── login.js
```

---

## 🧭 使用示例
### 在 Claude Code 中
```
你：帮我爬取这个 TikTok 视频 https://www.tiktok.com/@user/video/123...
Claude：[自动调用 tiktok-video-scraper Skill]
```

### 命令行
```bash
cd "TikTok Skills"/tiktok-skill
node scripts/scrape.js "视频URL"
```

---

## 🐛 常见问题
- **识别不到 Skills**：确认 skillsPath 为绝对路径且指向包含 `tiktok-skill` 的目录；重启应用。  
- **模块未找到/依赖缺失**：进入 `tiktok-skill` 重新运行 `npm install`。  
- **登录失效**：删除 `tiktok-skill/tiktok_cookies.json` 后重新执行 `node scripts/login.js`。  
- **爬取失败**：检查链接是否可访问、网络状况、或等待更长加载时间。

---

## 🎯 配置检查清单
- [ ] Node.js 已安装（v18+）  
- [ ] 已获取项目并进入 `TikTok Skills` 目录  
- [ ] 运行 `cd tiktok-skill && npm install`  
- [ ] `mcp.json` 已写入绝对路径的 skillsPath  
- [ ] 重启后能看到 `tiktok-video-scraper`  
- [ ] `node scripts/login.js` 完成首次登录

---

## 📞 获取帮助
1. 查看 `SKILL.md` 与本指南  
2. 确认路径、依赖、重启步骤  
3. 联系微信：`siliconluo`

---

**最后更新：** 2026年01月05日  
**版本：** 1.0.0

