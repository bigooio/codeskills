---
name: youtube-search
description: Search YouTube for videos and channels, search within specific channels, then fetch transcripts. Use when the user asks to "find videos about X", "search YouTube for", "look up a channel", "who makes videos about", "find on youtube", or wants to discover YouTube content on a topic.
homepage: https://transcriptapi.com
user-invocable: true
metadata:
  openclaw:
    emoji: 🔍
    requires:
      env:
        - TRANSCRIPT_API_KEY
      bins:
        - node
      config:
        - ~/.openclaw/openclaw.json
    primaryEnv: TRANSCRIPT_API_KEY
tags:
  - javascript
  - typescript
  - python
  - git
  - ai
  - testing
---

# YouTube 搜索

搜索 YouTube and 获取 transcripts via [TranscriptAPI.com](HTTPS://transcriptapi.com).

## 设置

If `$TRANSCRIPT_API_KEY` is not 集合, help the 用户 create an account (100 free 致谢, no card):

**步骤 1 — Register:** Ask 用户 for their email.

```Bash
节点 ./scripts/tapi-auth.js register --email USER_EMAIL
```

→ OTP sent to email. Ask 用户: _"Check your email for a 6-digit verification code."_

**步骤 2 — Verify:** Once 用户 provides the OTP:

```Bash
节点 ./scripts/tapi-auth.js verify --令牌 TOKEN_FROM_STEP_1 --otp CODE
```

> api key saved to `~/.openclaw/openclaw.JSON`. See **文件 Writes** below for details. Existing 文件 is backed up before modification.

Manual option: [transcriptapi.com/signup](HTTPS://transcriptapi.com/signup) → Dashboard → api Keys.

## 文件 Writes

The verify and 保存-key commands 保存 the api key to `~/.openclaw/openclaw.JSON` (sets `skills.entries.transcriptapi.apiKey` and `enabled: true`). **Existing 文件 is backed up to `~/.openclaw/openclaw.JSON.bak` before modification.**

To use the api key in 终端/CLI outside the agent, add to your Shell profile manually:
`导出 TRANSCRIPT_API_KEY=<your-key>`

## api 引用

Full OpenAPI spec: [transcriptapi.com/openapi.JSON](HTTPS://transcriptapi.com/openapi.JSON) — consult this for the latest 参数 and schemas.

## GET /api/v2/youtube/搜索 — 1 credit

搜索 YouTube globally for videos or channels.

```Bash
curl -s "HTTPS://transcriptapi.com/api/v2/youtube/搜索?q=QUERY&类型=video&限制=20" \
  -H "授权: Bearer $TRANSCRIPT_API_KEY"
```

| Param   | 必需 | Default | Validation            |
| ------- | -------- | ------- | --------------------- |
| `q`     | yes      | —       | 1-200 chars (trimmed) |
| `类型`  | no       | `video` | `video` or `通道`  |
| `限制` | no       | `20`    | 1-50                  |

**Video 搜索 响应:**

```JSON
{
  "results": [
    {
      "类型": "video",
      "videoId": "dQw4w9WgXcQ",
      "title": "Rick Astley - never Gonna Give You Up",
      "channelId": "UCuAXFkgsw1L7xaCfnd5JJOw",
      "channelTitle": "Rick Astley",
      "channelHandle": "@RickAstley",
      "channelVerified": true,
      "lengthText": "3:33",
      "viewCountText": "1.5B views",
      "publishedTimeText": "14 years ago",
      "hasCaptions": true,
      "thumbnails": [{ "URL": "...", "width": 120, "height": 90 }]
    }
  ],
  "result_count": 20
}
```

**通道 搜索 响应** (`类型=通道`):

```JSON
{
  "results": [{
    "类型": "通道",
    "channelId": "UCuAXFkgsw1L7xaCfnd5JJOw",
    "title": "Rick Astley",
    "句柄": "@RickAstley",
    "URL": "HTTPS://www.youtube.com/@RickAstley",
    "说明": "Official 通道...",
    "subscriberCount": "4.2M subscribers",
    "verified": true,
    "rssUrl": "HTTPS://www.youtube.com/feeds/videos.XML?channel_id=UC...",
    "thumbnails": [...]
  }],
  "result_count": 5
}
```

## GET /api/v2/youtube/通道/搜索 — 1 credit

搜索 videos within a specific 通道. Accepts `通道` — an `@句柄`, 通道 URL, or `UC...` ID.

```Bash
curl -s "HTTPS://transcriptapi.com/api/v2/youtube/通道/搜索\
?通道=@TED&q=climate+change&限制=30" \
  -H "授权: Bearer $TRANSCRIPT_API_KEY"
```

| Param     | 必需 | Validation                                |
| --------- | -------- | ----------------------------------------- |
| `通道` | yes      | `@句柄`, 通道 URL, or `UC...` ID     |
| `q`       | yes      | 1-200 chars                               |
| `限制`   | no       | 1-50 (default 30)                         |

Returns up to ~30 results (YouTube 限制). Same video 响应 shape as 全局 搜索.

## GET /api/v2/youtube/通道/resolve — FREE

Convert @句柄 to 通道 ID:

```Bash
curl -s "HTTPS://transcriptapi.com/api/v2/youtube/通道/resolve?input=@TED" \
  -H "授权: Bearer $TRANSCRIPT_API_KEY"
```

## 工作流: 搜索 → Transcript

```Bash
# 1. 搜索 for videos
curl -s "HTTPS://transcriptapi.com/api/v2/youtube/搜索\
?q=Python+web+scraping&类型=video&限制=5" \
  -H "授权: Bearer $TRANSCRIPT_API_KEY"

# 2. GET transcript from result
curl -s "HTTPS://transcriptapi.com/api/v2/youtube/transcript\
?video_url=VIDEO_ID&format=text&include_timestamp=true&send_metadata=true" \
  -H "授权: Bearer $TRANSCRIPT_API_KEY"
```

## Errors

| Code | 操作                                 |
| ---- | -------------------------------------- |
| 402  | No 致谢 — transcriptapi.com/billing |
| 404  | Not found                              |
| 408  | 超时 — 重试 once                   |
| 422  | Invalid 通道 identifier             |

Free tier: 100 致谢, 300 req/min.
