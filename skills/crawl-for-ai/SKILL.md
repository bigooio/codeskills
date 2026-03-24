---
name: crawl-for-ai
description: Web scraping using local Crawl4AI instance. Use for fetching full page content with JavaScript rendering. Better than Tavily for complex pages. Unlimited usage.
version: 1.0.1
author: Ania
requiresEnv:
  - CRAWL4AI_URL
metadata:
  clawdbot:
    emoji: 🕷️
    requires:
      bins:
        - node
tags:
  - javascript
  - typescript
  - ai
  - api
  - frontend
  - backend
---

# Crawl4AI Web Scraper

本地 Crawl4AI instance for full web page extraction with JavaScript rendering.

## Endpoints

**代理 (端口 11234)** — 清理 输出, OpenWebUI-compatible
- Returns: `[{page_content, metadata}]`
- Use for: Simple content extraction

**Direct (端口 11235)** — Full 输出 with all data
- Returns: `{results: [{markdown, html, links, media, ...}]}`
- Use for: When you need links, media, or other metadata

## 使用方法

```Bash
# Via 脚本
节点 {baseDir}/scripts/crawl4ai.js "URL"
节点 {baseDir}/scripts/crawl4ai.js "URL" --JSON
```

**脚本 OPTIONS:**
- `--JSON` — Full JSON 响应

**输出:** 清理 markdown from the page.

## 配置

**必需 环境 变量:**

- `CRAWL4AI_URL` — Your Crawl4AI instance URL (e.g., `HTTP://localhost:11235`)

**可选:**

- `CRAWL4AI_KEY` — api key if your instance requires 认证

## 特性

- **JavaScript rendering** — Handles 动态 content
- **Unlimited 使用方法** — 本地 instance, no api limits
- **Full content** — HTML, markdown, links, media, tables
- **Better than Tavily** for complex pages with JS

## api

Uses your 本地 Crawl4AI instance REST api. Auth 请求头 only sent if `CRAWL4AI_KEY` is 集合.