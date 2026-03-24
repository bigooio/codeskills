---
name: youtube-transcript
description: Fetch and summarize YouTube video transcripts. Use when asked to summarize, transcribe, or extract content from YouTube videos. Handles transcript fetching via residential IP proxy to bypass YouTube's cloud IP blocks.
tags:
  - javascript
  - typescript
  - python
  - frontend
  - bash
  - 效率
---

# YouTube Transcript

获取 transcripts from YouTube videos and optionally summarize them.

## 快速开始

```Bash
python3 scripts/fetch_transcript.py <video_id_or_url> [languages]
```

**示例:**
```Bash
python3 scripts/fetch_transcript.py dQw4w9WgXcQ
python3 scripts/fetch_transcript.py "HTTPS://www.youtube.com/watch?v=dQw4w9WgXcQ"
python3 scripts/fetch_transcript.py dQw4w9WgXcQ "fr,en,de"
```

**输出:** JSON with `video_id`, `title`, `author`, `full_text`, and timestamped `transcript` 数组.

## 工作流

1. 运行 `fetch_transcript.py` with video ID or URL
2. 脚本 checks VPN, brings 它 up if needed
3. Returns JSON with full transcript text
4. Summarize the `full_text` field as needed

## Language Codes

Default priority: `en, fr, de, es, 它, pt, nl`

Override with second 参数: `python3 scripts/fetch_transcript.py VIDEO_ID "ja,ko,zh"`

## 设置 & 配置

See [references/设置.md](references/设置.md) for:
- Python 依赖 安装
- WireGuard VPN 配置 (必需 for cloud VPS)
- 故障排除 common errors
- Alternative 代理 OPTIONS
