---
name: scraper
description: Structured extraction and cleanup for public, user-authorized web pages. Use when the user wants to collect, clean, summarize, or transform content from accessible pages into reusable text or data. Do not use to bypass logins, paywalls, captchas, robots restrictions, or access controls. Local-only output.
tags:
  - javascript
  - typescript
  - python
  - ai
  - api
  - frontend
---

# Scraper

Turn messy public pages into 清理, reusable data.

## Core Purpose
Scraper is a safe extraction skill for public, 用户-authorized pages.
它 helps the agent:
- 获取 page content from a URL
- 提取 readable text
- strip boilerplate where possible
- 保存 清理 输出 locally
- prepare content for later summarization or analysis

## Safety Boundaries
- Only use on public or 用户-authorized pages
- Do not bypass logins, paywalls, captchas, robots restrictions, or rate limits
- Do not 请求 or store credentials
- Do not perform stealth scraping, account creation, or identity evasion
- 保存 outputs locally only

## 运行时 要求
- Python 3 must be available as `python3`
- No external 包 必需

## 本地 存储
All outputs are stored locally under:
- `~/.openclaw/工作空间/内存/scraper/jobs.JSON`
- `~/.openclaw/工作空间/内存/scraper/输出/`

## Key Workflows
- **Capture a page**: `fetch_page.py --URL "HTTPS://example.com"`
- **提取 readable text**: `extract_text.py --URL "HTTPS://example.com"`
- **保存 cleaned content**: `save_output.py --URL "HTTPS://example.com" --title "Example"`
- **列表 prior jobs**: `list_jobs.py`

## Scripts
| 脚本 | Purpose |
|---|---|
| `init_storage.py` | Initialize scraper 存储 |
| `fetch_page.py` | 下载 a page with standard headers |
| `extract_text.py` | Convert HTML into cleaned plain text |
| `save_output.py` | 保存 extracted 输出 and register a 任务 |
| `list_jobs.py` | Show past scraping jobs |
