---
name: xiaohongshu-scraper
description: Scrapes Xiaohongshu (Little Red Book) posts to extract content, author info, and engagement metrics (likes, comments, shares, favorites). Use when user wants to scrape Xiaohongshu posts, extract post data, or analyze Xiaohongshu content.
---

# Xiaohongshu Post Scraper

## Quick Start

Scrape a Xiaohongshu post by URL:

```bash
node scripts/scrape.js "https://www.xiaohongshu.com/discovery/item/POST_ID"
```

Output saved to: `results/xhs_post_TIMESTAMP.json`

## First Time Setup

### Install Dependencies

```bash
cd xiaohongshu-skill
npm install
```

### Login (Required)

```bash
node scripts/login.js
```

This opens a browser window. Complete the login process manually. Cookies are saved automatically for future use.

## How It Works

The scraper uses Playwright to automate a real browser:

1. Loads saved cookies (or prompts for login)
2. Opens the post URL in a browser
3. Waits for page to fully load (20 seconds)
4. Extracts data from the page DOM
5. Saves results to JSON file
6. Updates cookies for next use

## Available Scripts

### scrape.js - Main Scraper

Scrapes a single post:

```bash
node scripts/scrape.js "POST_URL"
```

**Extracts:**
- Title
- Author
- Content/body text
- Images (URLs)
- Likes (点赞数)
- Favorites (收藏数)
- Comments (评论数)
- Shares (分享数)

**Output format:**
```json
{
  "url": "post_url",
  "timestamp": "2025-12-31T...",
  "data": {
    "title": "post_title",
    "author": "author_name",
    "content": "post_content",
    "likes": "1.4万",
    "collects": "number",
    "comments": "number",
    "shares": "number",
    "images": ["url1", "url2", ...]
  }
}
```

### get-stats.js - Statistics Only

Fetches engagement metrics only:

```bash
node scripts/get-stats.js "POST_URL"
```

**Output:**
```json
{
  "url": "post_url",
  "timestamp": "2025-12-31T...",
  "stats": {
    "likes": "1.4万",
    "collects": "number",
    "comments": "number",
    "shares": "number"
  }
}
```

## Data Limitations

**Platform Restrictions:**
- ❌ **View count** (预览量/浏览量) - Not publicly displayed, cannot be extracted
- ⚠️ **Comments/Shares** - Occasionally unavailable (~80% success rate)
- ✅ **Likes/Favorites** - Usually available

**Access Issues:**
Some posts may show "当前笔记暂时无法浏览" (Post temporarily unavailable) due to:
- Post deleted by author
- Post set to private/followers-only
- Account restrictions
- Regional limitations

## Directory Structure

```
xiaohongshu-skill/
├── SKILL.md              # This file
├── scripts/
│   ├── scrape.js         # Main scraper
│   ├── get-stats.js      # Stats extraction
│   └── login.js          # Login helper
├── results/              # Scraped data (auto-created)
└── xhs_cookies.json      # Saved login state (auto-created)
```

## Troubleshooting

### Post shows "无法浏览" (Unavailable)

**Possible causes:**
1. Login state expired
2. Post is private or deleted
3. Requires specific account to view

**Solutions:**
```bash
# Delete old cookies and re-login
rm xhs_cookies.json
node scripts/login.js
```

### Browser doesn't open

Make sure Playwright Chromium is installed:
```bash
npx playwright install chromium
```

### Extraction fails

1. Check if the post URL is accessible in a browser
2. Verify you're logged in to the correct account
3. Try waiting longer - increase timeout in scripts/scrape.js

## Examples

### Example 1: Scrape a Single Post

```bash
node scripts/scrape.js "https://www.xiaohongshu.com/discovery/item/6476b9c20000000011011309"
```

**Result:** `results/xhs_post_1767173214027.json`

### Example 2: Get Statistics Only

```bash
node scripts/get-stats.js "https://www.xiaohongshu.com/discovery/item/6476b9c20000000011011309"
```

**Result:** Just the engagement metrics

### Example 3: Batch Scraping

```bash
# Create a list of URLs
cat urls.txt | while read url; do
  node scripts/scrape.js "$url"
done
```

## Technical Notes

**Technology Stack:**
- Playwright - Browser automation
- Node.js - Runtime environment
- Chromium - Headless browser

**Why Playwright:**
- Simulates real user behavior
- Handles dynamic content
- Works with logged-in sessions
- Reliable for JavaScript-heavy sites

**Wait Times:**
- 20 seconds default for page load
- Ensures all content is loaded
- Can be adjusted in scripts/scrape.js

## Best Practices

1. **Always log in from a real account** - Some content requires login
2. **Respect rate limits** - Add delays between requests
3. **Check cookies periodically** - Re-login if scraping fails
4. **Verify URLs** - Make sure posts are public when sharing scripts
5. **Handle errors gracefully** - Check for "无法浏览" in results

## Related Skills

For TikTok scraping, see: `../tiktok-skill/SKILL.md`
