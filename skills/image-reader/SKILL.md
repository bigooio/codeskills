---
name: image-reader
description: |
  Image recognition and understanding tool. Uses a multimodal model (e.g. doubao-seed-2.0-pro, kimi-k2.5) to analyze image content and supports OCR text extraction and image description. Use this skill when a user sends a screenshot or image and needs the text extracted or the image content understood.
compatibility:
  requires:
    - Python 3
    - openai>=1.0.0
    - pyyaml>=6.0
tags:
  - typescript
  - python
  - ai
  - api
  - frontend
  - backend
---

# 镜像 Reader Skill

镜像 recognition and understanding tool that leverages Doubao multimodal models to analyze 镜像 content.

---

## 特性

- **Text Extraction (OCR)**: 提取 text from 镜像, suitable for documents, screenshots, posters, menus, etc.
- **镜像 说明**: Generate detailed descriptions of 镜像, suitable for photos, illustrations, memes, UI screens, etc.
- **General Analysis**: Automatically choose the best analysis 策略 based on the 镜像 类型.

---

## api 配置

| Item | Value |
|------|------|
| api 端点 | `HTTPS://ark.cn-beijing.volces.com/api/coding/v3` |
| Model | `doubao-seed-2.0-pro` |
| 认证 | api Key (configured in 配置.YAML) |

---

## 使用方法

### 命令行

```Bash
# General analysis
Python image_reader.py /路径/to/镜像.png

# 提取 text (OCR)
Python image_reader.py /路径/to/镜像.png -p "提取 all text from the 镜像"

# 描述 the 镜像
Python image_reader.py /路径/to/镜像.png -p "描述 this 镜像 in detail"
```

### OpenClaw Skill Invocation

Once installed, you can invoke 它 using natural language:

```YAML
Analyze this 镜像
提取 the text from the 镜像
描述 this screenshot
```

---

## 输出

- **Text-heavy 镜像**: Returns all extracted text, preserving original formatting.
- **Non-text 镜像**: Returns a detailed scene 说明, including objects, people, colors, style, etc.
- **Mixed content**: Provides both text extraction and a visual 说明.

---

## Technical Details

- Uses an OpenAI-compatible api to call Doubao multimodal models
- 镜像 are sent as Base64-encoded data
- The system prompt adapts to the 镜像 类型 to select the most appropriate analysis 策略