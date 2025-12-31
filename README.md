# 小红书 & TikTok Claude Skills

> 使用 Claude Skills 架构爬取小红书和 TikTok 内容，支持提取帖子/视频信息、作者数据和互动指标

---

## 📁 项目结构

```
claude-skills/
│
├── 📘 文档
│   ├── README.md                  # 本文件
│   ├── SETUP_GUIDE.md             # 详细配置指南 ⭐ 推荐从这里开始
│   └── QUICK_SETUP.md             # 快速配置卡片
│
├── 📦 xiaohongshu-skill/          # 小红书 Skill
│   ├── SKILL.md                   # Skill 定义文件
│   ├── package.json               # NPM 依赖配置
│   ├── results/                   # 爬取结果目录
│   └── scripts/                   # 可执行脚本
│       ├── scrape.js              # 标准爬虫脚本
│       ├── scrape-stealth.js      # 反检测版本（推荐）
│       ├── scrape-human.js        # 人类行为模拟版本
│       └── manual-login.js        # 手动登录工具
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
cd claude-skills
cd xiaohongshu-skill && npm install && cd ..
cd tiktok-skill && npm install && cd ..
```

### 2. 配置 Claude Code

**编辑 `~/.claude-code/settings.json`：**

```json
{
  "skillsPath": "你的完整路径/claude-skills"
}
```

**Windows 示例：**
```json
{
  "skillsPath": "C:\\Users\\YourName\\claude-skills"
}
```

**Mac/Linux 示例：**
```json
{
  "skillsPath": "/Users/yourname/claude-skills"
}
```

### 3. 重启 Claude Code

完全关闭并重新打开 Claude Code

---

## ✅ 验证配置

在 Claude Code 中输入：
```
你可以做什么？
```

应看到：
- xiaohongshu-scraper (小红书爬虫)
- tiktok-video-scraper (TikTok爬虫)

---

## 🔑 首次使用（登录）

### 小红书登录

```bash
cd xiaohongshu-skill
node scripts/manual-login.js
# 1. 浏览器会自动打开
# 2. 手动完成登录操作
# 3. 访问几个帖子确保登录成功
# 4. 按 Ctrl+C 保存 cookies
```

### TikTok 登录

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
你：帮我爬取这个小红书帖子 https://...
Claude：[自动调用 xiaohongshu-scraper Skill]
```

### 命令行直接使用

**小红书：**
```bash
cd xiaohongshu-skill

# 标准版本
node scripts/scrape.js "帖子URL"

# 反检测版本（推荐，应对反爬虫）
node scripts/scrape-stealth.js "帖子URL"

# 人类行为模拟版本（高级）
node scripts/scrape-human.js "帖子URL"
```

**TikTok：**
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
| **xiaohongshu-skill/SKILL.md** | 小红书 Skill 技术文档 |
| **tiktok-skill/SKILL.md** | TikTok Skill 技术文档 |

---

## ✨ 功能特性

### 小红书 Skill

- ✅ **内容提取**：标题、作者、正文、图片链接
- ✅ **互动数据**：点赞、收藏、评论、分享数
- ✅ **反爬虫策略**：
  - 标准爬虫（scrape.js）
  - 反检测版本（scrape-stealth.js）- 推荐使用
  - 人类行为模拟（scrape-human.js）- 高级版本
- ✅ **登录状态**：自动保存和恢复 cookies
- ✅ **结果保存**：JSON 格式保存到 `results/` 目录

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
4. **反爬虫**：小红书有较强的反爬虫机制，建议使用反检测版本
5. **频率限制**：过于频繁的请求可能导致临时限制
6. **合规使用**：仅供学习交流，请遵守相关平台服务条款

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
4. 👉 运行 `manual-login.js` 完成首次登录
5. 🎉 开始使用！

---

## 📄 许可证

本项目仅供学习交流使用，请遵守相关平台的服务条款和法律法规。使用本工具产生的任何后果由使用者自行承担。

---

## 🔗 相关链接

- [Claude Code 官方文档](https://github.com/anthropics/claude-code)
- [Playwright 官方文档](https://playwright.dev/)
- [项目配置指南](SETUP_GUIDE.md)

---

**最后更新：** 2025年12月31日

🚀 **祝使用愉快！**
