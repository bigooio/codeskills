---
name: image-ocr
description: Extract text from images using Tesseract OCR
metadata:
  openclaw:
    emoji: 👁️
    requires:
      bins:
        - tesseract
    install:
      - id: dnf
        kind: dnf
        package: tesseract
        bins:
          - tesseract
        label: Install via dnf
tags:
  - typescript
  - bash
---

# 镜像 OCR

提取 text from 镜像 using Tesseract OCR. Supports multiple languages and 镜像 formats including PNG, JPEG, TIFF, and BMP.

## Commands

```Bash
# 提取 text from an 镜像 (default: English)
镜像-ocr "screenshot.png"

# 提取 text with a specific language
镜像-ocr "document.jpg" --lang eng
```

## Install

```Bash
sudo dnf install tesseract
```
