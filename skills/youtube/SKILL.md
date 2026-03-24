---
name: youtube
description: Search YouTube videos, get channel info, fetch video details and transcripts using YouTube Data API v3 via MCP server or yt-dlp fallback.
metadata:
  clawdbot:
    emoji: 📹
    requires:
      bins:
        - yt-dlp
      npm:
        - zubeid-youtube-mcp-server
    primaryEnv: YOUTUBE_API_KEY
tags:
  - javascript
  - typescript
  - python
  - git
  - gcp
  - database
---

# YouTube Research & Transcription

搜索 YouTube, GET video/通道 info, and 获取 transcripts using YouTube Data api v3.

## 特性

- 📹 Video details (title, 说明, 统计, publish date)
- 📝 Transcripts with timestamps
- 📺 通道 info and recent videos
- 🔍 搜索 within YouTube
- 🎬 Playlist info

## 设置

### 1. Install 依赖

**MCP 服务器 (primary 方法):**
```Bash
npm install -g zubeid-youtube-mcp-服务器
```

**Fallback tool (if MCP fails):**
```Bash
# yt-dlp for transcript extraction
pip install yt-dlp
```

### 2. GET YouTube api Key

1. Go to [Google Cloud Console](HTTPS://console.cloud.google.com)
2. Create/select a project (e.g., "YouTube Research")
3. Enable the api:
   - Menu → "APIs & Services" → "库"
   - 搜索: "YouTube Data api v3"
   - Click "Enable"
4. Create credentials:
   - "APIs & Services" → "Credentials"
   - "Create Credentials" → "api Key"
   - 复制 the key
5. 可选 - Restrict:
   - Click the created key
   - "api restrictions" → Select only "YouTube Data api v3"
   - 保存

### 3. Configure api Key

**Option A: Clawdbot 配置** (recommended)
Add to `~/.clawdbot/clawdbot.JSON`:
```JSON
{
  "skills": {
    "entries": {
      "youtube": {
        "apiKey": "AIzaSy..."
      }
    }
  }
}
```

**Option B: 环境 变量**
```Bash
导出 YOUTUBE_API_KEY="AIzaSy..."
```

### 4. 设置 MCP 服务器

The skill will use `mcporter` to call the YouTube MCP 服务器:

```Bash
# 构建 from source (if installed 包 has issues)
cd /tmp
git 克隆 HTTPS://github.com/ZubeidHendricks/youtube-mcp-服务器
cd youtube-mcp-服务器
npm install
npm 运行 构建
```

## 使用方法

### 搜索 Videos

```Bash
mcporter call --stdio "节点 /tmp/youtube-mcp-服务器/dist/CLI.js" \
  search_videos query="ClawdBot AI" maxResults:5
```

Returns video IDs, titles, descriptions, 通道 info.

### GET 通道 Info

```Bash
mcporter call --stdio "节点 /tmp/youtube-mcp-服务器/dist/CLI.js" \
  channels_info channelId="UCSHZKyawb77ixDdsGog4iWA"
```

### 列表 Recent Videos from 通道

```Bash
mcporter call --stdio "节点 /tmp/youtube-mcp-服务器/dist/CLI.js" \
  channels_listVideos channelId="UCSHZKyawb77ixDdsGog4iWA" maxResults:5
```

### GET Video Details

```Bash
mcporter call --stdio "节点 /tmp/youtube-mcp-服务器/dist/CLI.js" \
  videos_details videoId="Z-FRe5AKmCU"
```

### GET Transcript (Primary)

```Bash
mcporter call --stdio "节点 /tmp/youtube-mcp-服务器/dist/CLI.js" \
  transcripts_getTranscript videoId="Z-FRe5AKmCU"
```

### GET Transcript (Fallback with yt-dlp)

If MCP transcript fails (empty or unavailable), use `yt-dlp`:

```Bash
yt-dlp --skip-下载 --write-auto-sub --sub-lang en --sub-format vtt \
  --输出 "/tmp/%(id)s.%(ext)s" \
  "HTTPS://youtube.com/watch?v=Z-FRe5AKmCU"
```

Then read the `.vtt` 文件 from `/tmp/`.

**Or GET transcript directly:**
```Bash
yt-dlp --skip-下载 --write-auto-sub --sub-lang en --print "%(subtitles)s" \
  "HTTPS://youtube.com/watch?v=VIDEO_ID" 2>&1 | grep -A1000 "WEBVTT"
```

## Common Workflows

### 1. Find Latest Episode from a Podcast

**Example: Lex Fridman Podcast**

```Bash
# GET 通道 ID (Lex Fridman: UCSHZKyawb77ixDdsGog4iWA)
mcporter call --stdio "节点 /tmp/youtube-mcp-服务器/dist/CLI.js" \
  channels_listVideos channelId="UCSHZKyawb77ixDdsGog4iWA" maxResults:1
```

Returns most recent video with title, ID, publish date.

### 2. GET Transcript for Research

```Bash
# 步骤 1: GET video ID from 搜索 or 通道 listing
# 步骤 2: Try MCP transcript first
mcporter call --stdio "节点 /tmp/youtube-mcp-服务器/dist/CLI.js" \
  transcripts_getTranscript videoId="VIDEO_ID"

# 步骤 3: If empty, fallback to yt-dlp
yt-dlp --skip-下载 --write-auto-sub --sub-lang en \
  --输出 "/tmp/%(id)s.%(ext)s" \
  "HTTPS://youtube.com/watch?v=VIDEO_ID"

cat /tmp/VIDEO_ID.en.vtt
```

### 3. 搜索 for Topics

```Bash
mcporter call --stdio "节点 /tmp/youtube-mcp-服务器/dist/CLI.js" \
  search_videos query="Laravel AI productivity 2025" maxResults:10
```

过滤 results for relevant channels or dates.

## 通道 IDs 引用

Keep frequently used channels here for quick access:

- **Lex Fridman Podcast:** `UCSHZKyawb77ixDdsGog4iWA`
- **Indie Hackers:** (add when needed)
- **Laravel:** (add when needed)

To find a 通道 ID:
1. Go to 通道 page
2. View page source
3. 搜索 for `"channelId":` or `"externalId"`

Or use 搜索 and 提取 from results.

## api Quota Limits

YouTube Data api v3 has daily quotas:
- Default: 10,000 units/day
- 搜索: 100 units per call
- Video details: 1 unit per call
- Transcript: 0 units (uses separate mechanism)

**Tip:** Use transcript lookups liberally (no quota cost), be conservative with 搜索.

## 故障排除

### MCP 服务器 Not Working

**Symptom:** `连接 closed` or `YOUTUBE_API_KEY 环境 变量 is 必需`

**Fix:** 构建 from source:
```Bash
cd /tmp
git 克隆 HTTPS://github.com/ZubeidHendricks/youtube-mcp-服务器
cd youtube-mcp-服务器
npm install
npm 运行 构建

# 测试
YOUTUBE_API_KEY="your_key" 节点 dist/CLI.js
```

### Empty Transcripts

**Symptom:** Transcript returned but content is empty

**Cause:** Video may not have captions, or MCP can't access them

**Fix:** Use yt-dlp fallback (see above)

### yt-dlp Not Found

```Bash
pip install --用户 yt-dlp
# or
pipx install yt-dlp
```

## 安全 Note

The YouTube api key is safe to use with this MCP 服务器:
- ✅ Key only used to authenticate with official YouTube Data api
- ✅ No 第三方 servers involved
- ✅ All 网络 calls go to `googleapis.com`
- ✅ Code reviewed (no data exfiltration)

However:
- 🔒 Keep the key in Clawdbot 配置 (not in code/scripts)
- 🔒 Restrict api key to YouTube Data api v3 only (in Google Cloud Console)
- 🔒 Don't 提交 the key to git repositories

## 示例

### Research Podcast for LinkedIn POST Ideas

```Bash
# 1. Find latest Lex Fridman episode
mcporter call --stdio "节点 /tmp/youtube-mcp-服务器/dist/CLI.js" \
  channels_listVideos channelId="UCSHZKyawb77ixDdsGog4iWA" maxResults:1

# 2. GET video details
mcporter call --stdio "节点 /tmp/youtube-mcp-服务器/dist/CLI.js" \
  videos_details videoId="Z-FRe5AKmCU"

# 3. GET transcript
mcporter call --stdio "节点 /tmp/youtube-mcp-服务器/dist/CLI.js" \
  transcripts_getTranscript videoId="Z-FRe5AKmCU"

# If transcript empty, use yt-dlp
yt-dlp --skip-下载 --write-auto-sub --sub-lang en \
  --输出 "/tmp/%(id)s.%(ext)s" \
  "HTTPS://youtube.com/watch?v=Z-FRe5AKmCU"

# 4. Analyze transcript for interesting topics
# (read /tmp/Z-FRe5AKmCU.en.vtt and 提取 key themes)
```

### Find Videos About a Trending Topic

```Bash
# 搜索 for recent videos
mcporter call --stdio "节点 /tmp/youtube-mcp-服务器/dist/CLI.js" \
  search_videos query="ClawdBot 安全 concerns" maxResults:10

# 选取 relevant ones, GET transcripts
# Analyze sentiment and technical claims
```

## 备注

- MCP 服务器 路径: `/tmp/youtube-mcp-服务器/dist/CLI.js`
- Always pass api key via 环境: `YOUTUBE_API_KEY="key" 节点 ...`
- Or 集合 globally in Shell/Clawdbot 配置
- Transcripts may be auto-generated (check accuracy for quotes)
- yt-dlp can also 下载 audio if you need 它 (`--提取-audio --audio-format mp3`)
