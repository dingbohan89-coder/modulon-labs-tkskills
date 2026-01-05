# ⚡ 快速配置卡片

> 3 步完成配置，立即可用！

---

## 📋 前置检查

```bash
# 检查 Node.js
node --version  # 应显示 v18.x.x 或更高

# 检查项目
cd "TikTok Skills"
ls            # 应看到 tiktok-skill
```

---

## 🚀 3 步配置

### 步骤 1：安装依赖（2 分钟）

```bash
cd "TikTok Skills"
cd tiktok-skill && npm install && cd ..
```

### 步骤 2：配置 skillsPath（1 分钟）

#### Windows

**找到文件：**
```
C:\Users\你的用户名\AppData\Roaming\Cursor\User\globalStorage\mcp.json
```

**添加配置：**
```json
{
  "skillsPath": "C:\\Users\\YourName\\TikTok Skills"
}
```

#### Mac/Linux

**找到文件：**
```
~/Library/Application Support/Cursor/User/globalStorage/mcp.json
```

**添加配置：**
```json
{
  "skillsPath": "/Users/yourname/TikTok Skills"
}
```

### 步骤 3：重启 Claude Code（30 秒）

1. 完全关闭 Claude Code/Cursor
2. 重新打开

---

## ✅ 验证配置

在 Claude Code 中输入：

```
你可以做什么？
```

**应包含：**
- tiktok-video-scraper (TikTok爬虫)

---

## 🔑 首次登录（仅一次）

```bash
cd tiktok-skill
node scripts/login.js
# 在浏览器中登录，然后按 Ctrl+C
```

---

## 🎯 开始使用
### 在 Claude Code 中

```
你：帮我爬取这个 TikTok 视频 https://...
Claude：[自动调用 Skill]
```

### 命令行

```bash
cd tiktok-skill
node scripts/scrape.js "视频URL"
```

---

## ⚠️ 常见错误
| 错误 | 解决方案 |
|-----|---------|
| 找不到 mcp.json | 手动创建该文件 |
| 识别不到 Skills | 检查路径是否使用绝对路径 |
| 模块未找到 | 运行 `npm install` |
| 登录失败 | 删除 cookies.json 重新登录 |

---

## 📞 需要帮助？

查看详细文档：`SETUP_GUIDE.md`

---

**快速配置，立即使用！** 🚀

