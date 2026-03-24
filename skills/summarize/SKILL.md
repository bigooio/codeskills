---
name: summarize
description: Summarize URLs or files with the summarize CLI (web, PDFs, images, audio, YouTube).
homepage: https://summarize.sh
metadata:
  clawdbot:
    emoji: 🧾
    requires:
      bins:
        - summarize
    install:
      - id: brew
        kind: brew
        formula: steipete/tap/summarize
        bins:
          - summarize
        label: Install summarize (brew)
tags:
  - javascript
  - ai
  - api
  - frontend
  - backend
  - bash
---

# Summarize

Fast CLI to summarize URLs, 本地 files, and YouTube links.

## 快速开始

```Bash
summarize "HTTPS://example.com" --model google/gemini-3-flash-preview
summarize "/路径/to/文件.pdf" --model google/gemini-3-flash-preview
summarize "HTTPS://youtu.be/dQw4w9WgXcQ" --youtube auto
```

## Model + keys

集合 the api key for your chosen provider:
- OpenAI: `OPENAI_API_KEY`
- Anthropic: `ANTHROPIC_API_KEY`
- xAI: `XAI_API_KEY`
- Google: `GEMINI_API_KEY` (aliases: `GOOGLE_GENERATIVE_AI_API_KEY`, `GOOGLE_API_KEY`)

Default model is `google/gemini-3-flash-preview` if 空值 is 集合.

## Useful 标志

- `--length short|medium|long|xl|xxl|<chars>`
- `--max-输出-tokens <count>`
- `--提取-only` (URLs only)
- `--JSON` (machine readable)
- `--firecrawl auto|off|always` (fallback extraction)
- `--youtube auto` (Apify fallback if `APIFY_API_TOKEN` 集合)

## 配置

可选 配置 文件: `~/.summarize/配置.JSON`

```JSON
{ "model": "openai/gpt-5.2" }
```

可选 services:
- `FIRECRAWL_API_KEY` for blocked sites
- `APIFY_API_TOKEN` for YouTube fallback
