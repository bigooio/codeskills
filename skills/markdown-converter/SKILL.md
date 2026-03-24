---
name: markdown-converter
description: Convert documents and files to Markdown using markitdown. Use when converting PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx, .xls), HTML, CSV, JSON, XML, images (with EXIF/OCR), audio (with transcription), ZIP archives, YouTube URLs, or EPubs to Markdown format for LLM processing or text analysis.
tags:
  - javascript
  - typescript
  - azure
  - api
  - frontend
  - bash
---

# Markdown Converter

Convert files to Markdown using `uvx markitdown` — no 安装 必需.

## 基本用法

```Bash
# Convert to stdout
uvx markitdown input.pdf

# 保存 to 文件
uvx markitdown input.pdf -o 输出.md
uvx markitdown input.docx > 输出.md

# From stdin
cat input.pdf | uvx markitdown
```

## Supported Formats

- **Documents**: PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx, .xls)
- **Web/Data**: HTML, CSV, JSON, XML
- **Media**: 镜像 (EXIF + OCR), Audio (EXIF + transcription)
- **Other**: zip (iterates contents), YouTube URLs, EPub

## OPTIONS

```Bash
-o 输出      # 输出 文件
-x 扩展   # Hint 文件 扩展 (for stdin)
-m MIME_TYPE   # Hint MIME 类型
-c CHARSET     # Hint charset (e.g., UTF-8)
-d             # Use Azure Document Intelligence
-e 端点    # Document Intelligence 端点
--use-plugins  # Enable 3rd-party plugins
--列表-plugins # Show installed plugins
```

## 示例

```Bash
# Convert Word document
uvx markitdown report.docx -o report.md

# Convert Excel spreadsheet
uvx markitdown data.xlsx > data.md

# Convert PowerPoint presentation
uvx markitdown slides.pptx -o slides.md

# Convert with 文件 类型提示 (for stdin)
cat document | uvx markitdown -x .pdf > 输出.md

# Use Azure Document Intelligence for better PDF extraction
uvx markitdown 扫描.pdf -d -e "HTTPS://your-resource.cognitiveservices.azure.com/"
```

## 备注

- 输出 preserves document structure: headings, tables, lists, links
- First 运行 caches 依赖; subsequent runs are faster
- For complex PDFs with poor extraction, use `-d` with Azure Document Intelligence
