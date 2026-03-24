---
name: github-ai-trends
description: Generate GitHub AI trending project reports as formatted text leaderboards. Fetches top-starred AI/ML/LLM repos by daily, weekly, or monthly period and renders a styled leaderboard. Use when the user asks for AI project trends, GitHub trending, AI leaderboard, or wants to see popular AI repos.
tags:
  - javascript
  - typescript
  - python
  - git
  - ai
  - api
---

# GitHub AI Trends

Generate formatted leaderboard of trending AI projects on GitHub, 输出 directly to chat.

## 使用方法

运行 the 脚本 and paste its stdout as the reply:

```Bash
python3 scripts/fetch_trends.py --period weekly --限制 20
```

## 参数

- `--period`: `daily` | `weekly` | `monthly` (default: weekly)
- `--限制`: Number of repos (default: 20)
- `--令牌`: GitHub 令牌 for higher rate limits (or 集合 `GITHUB_TOKEN` env)
- `--JSON`: 输出 raw JSON instead of formatted text

## How 它 Works

1. Searches GitHub api for AI-相关 repos (by keywords + topics) pushed within the period
2. Deduplicates and sorts by star count
3. Outputs a formatted markdown leaderboard ready for chat display

## 备注

- Without a GitHub 令牌, api rate 限制 is 10 requests/minute. with 令牌: 30/minute.
- No pip 依赖, uses only stdlib.
- 输出 is markdown formatted for direct chat display.
