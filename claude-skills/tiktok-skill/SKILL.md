---
name: tiktok-video-scraper
description: Scrapes TikTok videos to extract content, author info, and engagement metrics (likes, comments, shares, favorites). Use when user wants to scrape TikTok videos, extract video data, or analyze TikTok content.
---

# TikTok Video Scraper

## Quick Start

Scrape a TikTok video by URL:

```bash
node scripts/scrape.js "https://www.tiktok.com/@username/video/VIDEO_ID"
```

Output saved to: `results/tiktok_video_TIMESTAMP.json`

## First Time Setup

### Install Dependencies

```bash
cd tiktok-skill
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
2. Opens the video URL in a browser
3. Waits for page to fully load (20 seconds)
4. Extracts data from the page DOM and embedded JSON
5. Saves results to JSON file
6. Updates cookies for next use

## Available Scripts

### scrape.js - Main Scraper

Scrapes a single video:

```bash
node scripts/scrape.js "VIDEO_URL"
```

**Extracts:**
- Title/Description
- Author (@username)
- Author URL
- Likes (点赞数)
- Comments (评论数)
- Shares (分享数)
- Favorites (收藏数)
- Hashtags
- View count (if available)

**Output format:**
```json
{
  "url": "video_url",
  "timestamp": "2025-12-31T...",
  "data": {
    "title": "video_title",
    "description": "video_description",
    "author": "username",
    "authorUrl": "https://www.tiktok.com/@username",
    "likes": "1.3K",
    "comments": "11",
    "shares": "430",
    "favorites": "1064",
    "views": "",
    "hashtags": ["tag1", "tag2"]
  }
}
```

### get-stats.js - Statistics Only

Fetches engagement metrics only:

```bash
node scripts/get-stats.js "VIDEO_URL"
```

**Output:**
```json
{
  "url": "video_url",
  "timestamp": "2025-12-31T...",
  "stats": {
    "likes": "1.3K",
    "comments": "11",
    "shares": "430",
    "favorites": "1064",
    "views": ""
  }
}
```

## Data Limitations

**Platform Restrictions:**
- ❌ **View count** (播放量) - Only visible to video creator, cannot be extracted
- ✅ **Likes/Comments/Shares/Favorites** - Usually available
- ⚠️ **Hashtags** - Extracted when available in description

**Access Issues:**
Some videos may be unavailable due to:
- Private account settings
- Regional restrictions
- Video removed
- Age restrictions

## Directory Structure

```
tiktok-skill/
├── SKILL.md              # This file
├── scripts/
│   ├── scrape.js         # Main scraper
│   ├── get-stats.js      # Stats extraction
│   └── login.js          # Login helper
├── results/              # Scraped data (auto-created)
└── tiktok_cookies.json   # Saved login state (auto-created)
```

## Troubleshooting

### Data extraction incomplete

**Possible causes:**
1. Login state expired
2. Video is private or restricted
3. Page structure changed

**Solutions:**
```bash
# Delete old cookies and re-login
rm tiktok_cookies.json
node scripts/login.js
```

### Browser doesn't open

Make sure Playwright Chromium is installed:
```bash
npx playwright install chromium
```

### Extraction fails or times out

1. Check if the video URL is accessible in a browser
2. Verify you're logged in to the correct account
3. Try waiting longer - increase timeout in scripts/scrape.js

## Examples

### Example 1: Scrape a Video

```bash
node scripts/scrape.js "https://www.tiktok.com/@goodluck0311/video/7523066743128968455"
```

**Result:** `results/tiktok_video_1767173479719.json`

### Example 2: Get Statistics Only

```bash
node scripts/get-stats.js "https://www.tiktok.com/@goodluck0311/video/7523066743128968455"
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
- Handles dynamic content and JavaScript rendering
- Works with logged-in sessions
- Reliable for complex web apps

**Data Extraction Methods:**
1. **Primary**: Extract from embedded JSON in page source (`__RENDER_DATA__`, `__UNIVERSAL_DATA_FOR_REHYDRATION__`)
2. **Fallback**: Parse DOM elements with `[data-e2e]` attributes
3. **Final**: Extract from meta tags

**Wait Times:**
- 20 seconds default for page load
- Ensures all JavaScript content is loaded
- Can be adjusted in scripts/scrape.js

## Best Practices

1. **Always log in from a real account** - Some content requires login
2. **Respect rate limits** - Add delays between requests
3. **Check cookies periodically** - Re-login if scraping fails
4. **Verify URLs** - Make sure videos are public when sharing scripts
5. **Handle errors gracefully** - Check for extraction failures in results

## Related Skills

For Xiaohongshu scraping, see: `../xiaohongshu-skill/SKILL.md`
