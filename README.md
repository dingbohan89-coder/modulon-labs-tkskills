# TikTok Skills

> 模块实验室（熙硅科技）出品的 TikTok Claude Skill，支持提取视频信息、作者数据和互动指标

---

## 🧭 公司与沟通
- 模块实验室（熙硅科技）提供的 TikTok Skill，可在 Claude Code/Cursor 中直接使用
- 交流与合作请联系微信：`siliconluo`

---

## 📁 项目结构

```
TikTok Skills/
│
├── 📘 文档
│   ├── README.md                  # 本文件
│   ├── SETUP_GUIDE.md             # 详细配置指南 ⭐ 推荐从这里开始
│   └── QUICK_SETUP.md             # 快速配置卡片
│
└── 📦 tiktok-skill/               # TikTok Skill
    ├── SKILL.md                   # Skill 定义文件
    ├── package.json               # NPM 依赖配置
    ├── results/                   # 爬取结果目录
    └── scripts/
        └── scrape.js              # 标准爬虫脚本
```

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd "TikTok Skills"
cd tiktok-skill && npm install && cd ..
```

### 2. 配置 Claude Code

**编辑 `~/.claude-code/settings.json`：**

```json
{
  "skillsPath": "你的完整路径/TikTok Skills"
}
```

**Windows 示例：**
```json
{
  "skillsPath": "C:\\Users\\YourName\\TikTok Skills"
}
```

**Mac/Linux 示例：**
```json
{
  "skillsPath": "/Users/yourname/TikTok Skills"
}
```

### 3. 重启 Claude Code

完全关闭并重新打开 Claude Code/Cursor

---

## ✅ 验证配置

在 Claude Code 中输入：
```
你可以做什么？
```

应看到：
- tiktok-video-scraper (TikTok爬虫)

---

## 🔑 首次使用（登录）

```bash
cd tiktok-skill
node scripts/scrape.js "任意TikTok视频URL"
# 首次运行会打开浏览器，请手动登录
# 登录后 cookies 会自动保存
```

---

## 💡 使用方法

### 在 Claude Code 中

```
你：帮我爬取这个 TikTok 视频 https://...
Claude：[自动调用 tiktok-video-scraper Skill]
```

### 命令行直接使用

```bash
cd tiktok-skill
node scripts/scrape.js "视频URL"
```

---

## 📚 详细文档

| 文档 | 说明 |
|-----|------|
| **SETUP_GUIDE.md** | 完整配置指南（包含详细步骤和故障排除） |
| **QUICK_SETUP.md** | 快速配置卡片（一步到位） |
| **tiktok-skill/SKILL.md** | TikTok Skill 技术文档 |

---

## ✨ 功能特性

### TikTok Skill

- ✅ **内容提取**：标题、作者、描述、音乐标签
- ✅ **互动数据**：点赞、评论、分享、收藏数
- ✅ **自动登录**：首次手动登录，后续自动恢复
- ✅ **结果保存**：JSON 格式保存到 `results/` 目录

---

## ⚠️ 注意事项

1. **登录要求**：首次使用必须手动登录，之后会自动保存登录状态
2. **数据限制**：预览数/播放量等受平台 API 限制，可能无法获取
3. **私密内容**：私密或删除的内容无法访问
4. **频率限制**：过于频繁的请求可能导致临时限制
5. **合规使用**：请遵守相关平台服务条款

---

## 🛠️ 技术栈

- **Node.js** - JavaScript 运行环境
- **Playwright** - 浏览器自动化框架
- **Claude Skills** - Claude Code 技能系统（基于文件系统）

---

## 🎯 快速开始

**推荐阅读顺序：**

1. 👉 查看 [**SETUP_GUIDE.md**](SETUP_GUIDE.md) - 完整配置指南
2. 👉 查看 [**QUICK_SETUP.md**](QUICK_SETUP.md) - 快速配置卡片
3. 👉 安装依赖并配置 Claude Code
4. 👉 运行 `scrape.js` 完成首次登录
5. 🎉 开始使用！

---

## 📄 使用协议（请务必阅读）
- 可免费使用、修改，在公司内部或商业场景中使用
- 禁止对外售卖、禁止以自有品牌封闭分发或另行授权
- 可转发分享项目，但需保留原项目出处与许可声明
- 不得二次买卖或将本项目作为独立商品售卖
- 使用产生的后果由使用者自行承担，请遵守 TikTok 平台条款与法律法规

---

## 🔗 相关链接

- [Claude Code 官方文档](https://github.com/anthropics/claude-code)
- [Playwright 官方文档](https://playwright.dev/)
- [项目配置指南](SETUP_GUIDE.md)

---

**最后更新：** 2026年01月05日

🚀 **祝使用愉快！**
