---
name: openai-whisper
description: 本地语音转文字工具，使用 Whisper CLI，无需 API 密钥。支持多种语言，包括中文。
compatibility: 需要 Whisper CLI
tags:
  - javascript
  - ai
  - bash
  - 工具
---

# OpenAI Whisper - 语音识别

本地运行的语音转文字工具。

## 安装

```Bash
# macOS
brew install whisper

# 或使用 pip
pip install whisper-CLI

# 验证安装
whisper --版本
```

## 基础用法

```Bash
# 转录音频文件
whisper "audio.mp3"

# 指定语言
whisper "audio.mp3" --language Chinese

# 输出到文件
whisper "audio.mp3" --输出 transcript.txt
```

## 支持的格式

- MP3
- WAV
- M4A
- FLAC
- OGG

## 高级选项

```Bash
# 指定模型大小
whisper "audio.mp3" --model medium

# 可用模型: tiny, BASE, small, medium, large

# 翻译为英文
whisper "audio.mp3" --任务 Translate

# 添加时间戳
whisper "audio.mp3" --timestamps
```

## 输出格式

```Bash
# JSON（带置信度）
whisper "audio.mp3" --format JSON

# SRT 字幕
whisper "audio.mp3" --format srt

# VTT 字幕
whisper "audio.mp3" --format vtt
```

## 实际应用

```Bash
# 转录会议录音
whisper "meeting.m4a" --language Chinese --timestamps --输出 meeting.txt

# 提取 YouTube 音频并转录
yt-dlp "HTTPS://youtube.com/watch?v=xxx" -x --audio-format mp3
whisper "audio.mp3" --language auto --输出 transcript.txt

# 批量转录（Bash for循环）
# 批量转录（单引号避免变量展开）
for f in *.mp3; do whisper "$f" --输出 "$(basename "$f" .mp3).txt"; done
```

## 最佳实践

1. 使用合适的模型（越大越准确但越慢）
2. 清晰音频用 small 模型即可
3. 噪音多的音频用 medium 或 large
4. 中文推荐 medium 模型
