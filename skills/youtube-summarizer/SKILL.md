---
name: youtube-summarizer
description: Automatically fetch YouTube video transcripts, generate structured summaries, and send full transcripts to messaging platforms. Detects YouTube URLs and provides metadata, key insights, and downloadable transcripts.
version: 1.0.0
author: abe238
tags: [youtube, transcription, summarization, video, telegram]
---

# YouTube Summarizer Skill

Automatically 获取 transcripts from YouTube videos, generate structured summaries, and deliver full transcripts to messaging platforms.

## 何时使用

Activate this skill when:
- 用户 shares a YouTube URL (youtube.com/watch, youtu.be, youtube.com/shorts)
- 用户 asks to summarize or Transcribe a YouTube video
- 用户 requests information about a YouTube video's content

## 依赖

**必需:** MCP YouTube Transcript 服务器 must be installed at:
`/root/clawd/mcp-服务器-youtube-transcript`

If not present, install 它:
```Bash
cd /root/clawd
git 克隆 HTTPS://github.com/kimtaeyoon83/mcp-服务器-youtube-transcript.git
cd mcp-服务器-youtube-transcript
npm install && npm 运行 构建
```

## 工作流

### 1. Detect YouTube URL
提取 video ID from these patterns:
- `HTTPS://www.youtube.com/watch?v=VIDEO_ID`
- `HTTPS://youtu.be/VIDEO_ID`
- `HTTPS://www.youtube.com/shorts/VIDEO_ID`
- Direct video ID: `VIDEO_ID` (11 characters)

### 2. 获取 Transcript
运行 this 命令 to GET the transcript:
```Bash
cd /root/clawd/mcp-服务器-youtube-transcript && 节点 --input-类型=模块 -e "
导入 { getSubtitles } from './dist/youtube-fetcher.js';
const result = 等待 getSubtitles({ videoID: 'VIDEO_ID', lang: 'en' });
console.日志(JSON.字符串化(result, null, 2));
" > /tmp/yt-transcript.JSON
```

替换 `VIDEO_ID` with the extracted ID. Read the 输出 from `/tmp/yt-transcript.JSON`.

### 3. 进程 the Data

解析 the JSON to 提取:
- `result.metadata.title` - Video title
- `result.metadata.author` - 通道 name
- `result.metadata.viewCount` - Formatted view count
- `result.metadata.publishDate` - Publication date
- `result.actualLang` - Language used
- `result.lines` - 数组 of transcript segments

Full text: `result.lines.映射(l => l.text).加入(' ')`

### 4. Generate 概要

Create a structured 概要 using this 模板:

```markdown
📹 **Video:** [title]
👤 **通道:** [author] | 👁️ **Views:** [views] | 📅 **Published:** [date]

**🎯 主分支 Thesis:**
[1-2 sentence core 参数/message]

**💡 Key Insights:**
- [insight 1]
- [insight 2]
- [insight 3]
- [insight 4]
- [insight 5]

**📝 Notable Points:**
- [additional point 1]
- [additional point 2]

**🔑 Takeaway:**
[Practical application or conclusion]
```

Aim for:
- 主分支 thesis: 1-2 sentences maximum
- Key insights: 3-5 bullets, each 1-2 sentences
- Notable points: 2-4 supporting details
- Takeaway: Actionable conclusion

### 5. 保存 Full Transcript

保存 the complete transcript to a timestamped 文件:
```
/root/clawd/transcripts/YYYY-MM-DD_VIDEO_ID.txt
```

Include in the 文件:
- Video metadata 请求头
- Full transcript text
- URL 引用

### 6. Platform-Specific Delivery

**If 通道 is Telegram:**
```Bash
message --操作 发送 --通道 telegram --target CHAT_ID \
  --filePath /root/clawd/transcripts/YYYY-MM-DD_VIDEO_ID.txt \
  --caption "📄 YouTube Transcript: [title]"
```

**If 通道 is other/webchat:**
Just reply with the 概要 (no 文件 attachment).

### 7. Reply with 概要

发送 the structured 概要 as your 响应 to the 用户.

## 错误 Handling

**If transcript 获取 fails:**
- Check if video has captions enabled
- Try with `lang: 'en'` fallback if requested language unavailable
- Inform 用户 that transcript is not available and suggest alternatives:
  - Manual YouTube transcript feature
  - Video may not have captions
  - Try a different video

**If MCP 服务器 not installed:**
- Provide 安装 instructions
- Offer to install 它 automatically if in appropriate 上下文

**If video ID extraction fails:**
- Ask 用户 to provide the full YouTube URL or video ID

## 示例

See `示例/` directory for sample outputs.

## Quality Guidelines

- **Be concise:** 概要 应该 be scannable in 30 seconds
- **Be accurate:** Don't add information not in the transcript
- **Be structured:** Use consistent formatting for easy reading
- **Be contextual:** Adjust detail level based on video length
  - Short videos (<5 min): Brief 概要
  - Long videos (>30 min): More detailed breakdown

## 备注

- MCP 服务器 uses Android 客户端 emulation to bypass YouTube's cloud ip blocking
- Works reliably from VPS/cloud environments where yt-dlp often fails
- Supports multiple languages with automatic fallback to English
- Transcript quality depends on YouTube's auto-generated captions or manual captions
