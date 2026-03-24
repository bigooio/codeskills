---
name: openai-whisper
description: 本地语音转文字工具，使用 Whisper CLI，无需 API 密钥。支持多种语言，包括中文。
compatibility: 需要 Whisper CLI
---

# OpenAI Whisper - 语音识别

本地运行的语音转文字工具。

## 安装

```bash
# macOS
brew install whisper

# 或使用 pip
pip install whisper-cli

# 验证安装
whisper --version
```

## 基础用法

```bash
# 转录音频文件
whisper "audio.mp3"

# 指定语言
whisper "audio.mp3" --language Chinese

# 输出到文件
whisper "audio.mp3" --output transcript.txt
```

## 支持的格式

- MP3
- WAV
- M4A
- FLAC
- OGG

## 高级选项

```bash
# 指定模型大小
whisper "audio.mp3" --model medium

# 可用模型: tiny, base, small, medium, large

# 翻译为英文
whisper "audio.mp3" --task translate

# 添加时间戳
whisper "audio.mp3" --timestamps
```

## 输出格式

```bash
# JSON（带置信度）
whisper "audio.mp3" --format json

# SRT 字幕
whisper "audio.mp3" --format srt

# VTT 字幕
whisper "audio.mp3" --format vtt
```

## 实际应用

```bash
# 转录会议录音
whisper "meeting.m4a" --language Chinese --timestamps --output meeting.txt

# 提取 YouTube 音频并转录
yt-dlp "https://youtube.com/watch?v=xxx" -x --audio-format mp3
whisper "audio.mp3" --language auto --output transcript.txt

# 批量转录（bash for循环）
# 批量转录（单引号避免变量展开）
for f in *.mp3; do whisper "$f" --output "$(basename "$f" .mp3).txt"; done
```

## 最佳实践

1. 使用合适的模型（越大越准确但越慢）
2. 清晰音频用 small 模型即可
3. 噪音多的音频用 medium 或 large
4. 中文推荐 medium 模型
