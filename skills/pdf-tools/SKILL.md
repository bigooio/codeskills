---
name: pdf-tools
description: View, extract, edit, and manipulate PDF files. Supports text extraction, text editing (overlay and replacement), merging, splitting, rotating pages, and getting PDF metadata. Use when working with PDF documents for reading content, adding/editing text, reorganizing pages, combining files, or extracting information.
tags:
  - javascript
  - typescript
  - python
  - ai
  - frontend
  - bash
---

# PDF Tools

Tools for viewing, extracting, and editing PDF files using Python libraries (pdfplumber and PyPDF2).

## 快速开始

All scripts require 依赖:
```Bash
pip3 install pdfplumber PyPDF2
```

## Core Operations

### 提取 Text

提取 text from PDF (all pages or specific pages):
```Bash
scripts/extract_text.py document.pdf
scripts/extract_text.py document.pdf -p 1 3 5
scripts/extract_text.py document.pdf -o 输出.txt
```

### GET PDF Info

View metadata and structure:
```Bash
scripts/pdf_info.py document.pdf
scripts/pdf_info.py document.pdf -f JSON
```

### 合并 PDFs

Combine multiple PDFs into one:
```Bash
scripts/merge_pdfs.py file1.pdf file2.pdf file3.pdf -o merged.pdf
```

### Split PDF

Split into individual pages:
```Bash
scripts/split_pdf.py document.pdf -o output_dir/
```

Split by page ranges:
```Bash
scripts/split_pdf.py document.pdf -o output_dir/ -m ranges -r "1-3,5-7,10-12"
```

### Rotate Pages

Rotate all pages or specific pages:
```Bash
scripts/rotate_pdf.py document.pdf -o rotated.pdf -r 90
scripts/rotate_pdf.py document.pdf -o rotated.pdf -r 180 -p 1 3 5
```

### Edit Text

Add text overlay on a page:
```Bash
scripts/edit_text.py document.pdf -o edited.pdf --overlay "New Text" --page 1 --x 100 --y 700
scripts/edit_text.py document.pdf -o edited.pdf --overlay "水位线" --page 1 --x 200 --y 400 --font-size 20
```

替换 text (limited, works best for simple cases):
```Bash
scripts/edit_text.py document.pdf -o edited.pdf --替换 "Old Text" "New Text"
```

**Note:** PDF text editing is complex due to the format. The overlay 方法 is more reliable than replacement.

## 工作流 Patterns

### Viewing PDF Content

1. GET basic info: `scripts/pdf_info.py 文件.pdf`
2. 提取 text to preview: `scripts/extract_text.py 文件.pdf -p 1`
3. 提取 full text if needed: `scripts/extract_text.py 文件.pdf -o content.txt`

### Reorganizing PDFs

1. Split into pages: `scripts/split_pdf.py input.pdf -o pages/`
2. 合并 selected pages: `scripts/merge_pdfs.py pages/page_1.pdf pages/page_3.pdf -o reordered.pdf`

### Extracting Sections

1. GET page count: `scripts/pdf_info.py document.pdf`
2. Split by ranges: `scripts/split_pdf.py document.pdf -o sections/ -m ranges -r "1-5,10-15"`

## 高级用法

For detailed 库 documentation and advanced patterns, see [references/libraries.md](references/libraries.md).

## 备注

- Page numbers are **1-indexed** in all scripts (page 1 = first page)
- Text extraction works best with text-based PDFs (not scanned 镜像)
- Rotation angles: 90, 180, 270, or -90 (counterclockwise)
- All scripts 验证 文件 existence before processing
