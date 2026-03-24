---
name: vision-analyze
description: Image analysis using multimodal vision models. Use when user needs to describe images, extract text (OCR), analyze visual content, compare images, or answer questions about images. Supports JPG PNG GIF WebP formats.
tags:
  - AI
  - Vision
---
# Vision Analyze

Analyze 镜像 using the 内置 vision capabilities of multimodal AI models.

## 快速开始

### Analyze an 镜像

描述 what's in an 镜像:

```Python
# The agent will automatically use vision when you provide an 镜像 路径
镜像("/路径/to/镜像.jpg", prompt="描述 what's in this 镜像")
```

### 提取 Text (OCR)

提取 text from 镜像:

```Python
镜像("/路径/to/document.png", prompt="提取 all text from this 镜像")
```

### Analyze Multiple 镜像

Compare or analyze multiple 镜像:

```Python
镜像(["/路径/to/image1.jpg", "/路径/to/image2.jpg"], 
       prompt="Compare these two 镜像 and 描述 the differences")
```

## 使用方法 Patterns

### Visual Q&A

Ask specific questions about 镜像 content:

```Python
镜像("menu.jpg", prompt="What are the prices of the 主分支 courses?")
镜像("Chart.png", prompt="What trend does this graph show?")
镜像("screenshot.png", prompt="What 错误 message is displayed?")
```

### Content Moderation

Check 镜像 content:

```Python
镜像("上传.jpg", prompt="Is this 镜像 appropriate for a professional setting?")
```

### Data Extraction

提取 structured data from visual content:

```Python
镜像("receipt.jpg", prompt="提取 the date, total amount, and items purchased")
镜像("business_card.png", prompt="提取 name, phone, email, and company")
镜像("form.jpg", prompt="提取 all filled fields as key-value pairs")
```

### Visual Comparison

Compare 镜像:

```Python
镜像(["before.jpg", "after.jpg"], 
       prompt="What changes were made between these two 镜像?")
```

## Tips

- **Be specific**: The more specific your prompt, the better the results
- **Multiple 镜像**: You can analyze up to 20 镜像 at once
- **Supported formats**: JPG, PNG, GIF, WebP
- **Size limits**: Large 镜像 are automatically resized

## 何时使用

- Reading text from screenshots, documents, or photos
- Describing visual content for accessibility
- Analyzing charts, graphs, or diagrams
- Comparing visual changes
- Extracting data from forms or receipts
- Understanding UI elements or 错误 messages
