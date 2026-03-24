---
name: pdf
description: Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms. When Claude needs to fill in a PDF form or programmatically process, generate, or analyze PDF documents at scale.
license: Proprietary. LICENSE.txt has complete terms
tags:
  - javascript
  - typescript
  - python
  - aws
  - ai
  - frontend
---

# PDF Processing Guide

## 概述

This guide covers essential PDF processing operations using Python libraries and 命令-line tools. For advanced 特性, JavaScript libraries, and detailed 示例, see 引用.md. If you need to fill out a PDF form, read forms.md and follow its instructions.

## 快速开始

```Python
from pypdf 导入 PdfReader, PdfWriter

# Read a PDF
reader = PdfReader("document.pdf")
print(f"Pages: {len(reader.pages)}")

# 提取 text
text = ""
for page in reader.pages:
    text += page.extract_text()
```

## Python Libraries

### pypdf - Basic Operations

#### 合并 PDFs
```Python
from pypdf 导入 PdfWriter, PdfReader

writer = PdfWriter()
for pdf_file in ["doc1.pdf", "doc2.pdf", "doc3.pdf"]:
    reader = PdfReader(pdf_file)
    for page in reader.pages:
        writer.add_page(page)

with open("merged.pdf", "wb") as 输出:
    writer.write(输出)
```

#### Split PDF
```Python
reader = PdfReader("input.pdf")
for i, page in enumerate(reader.pages):
    writer = PdfWriter()
    writer.add_page(page)
    with open(f"page_{i+1}.pdf", "wb") as 输出:
        writer.write(输出)
```

#### 提取 Metadata
```Python
reader = PdfReader("document.pdf")
meta = reader.metadata
print(f"Title: {meta.title}")
print(f"Author: {meta.author}")
print(f"Subject: {meta.subject}")
print(f"Creator: {meta.creator}")
```

#### Rotate Pages
```Python
reader = PdfReader("input.pdf")
writer = PdfWriter()

page = reader.pages[0]
page.rotate(90)  # Rotate 90 degrees clockwise
writer.add_page(page)

with open("rotated.pdf", "wb") as 输出:
    writer.write(输出)
```

### pdfplumber - Text and Table Extraction

#### 提取 Text with Layout
```Python
导入 pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        print(text)
```

#### 提取 Tables
```Python
with pdfplumber.open("document.pdf") as pdf:
    for i, page in enumerate(pdf.pages):
        tables = page.extract_tables()
        for j, table in enumerate(tables):
            print(f"Table {j+1} on page {i+1}:")
            for row in table:
                print(row)
```

#### Advanced Table Extraction
```Python
导入 pandas as pd

with pdfplumber.open("document.pdf") as pdf:
    all_tables = []
    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            if table:  # Check if table is not empty
                df = pd.DataFrame(table[1:], columns=table[0])
                all_tables.append(df)

# Combine all tables
if all_tables:
    combined_df = pd.concat(all_tables, ignore_index=True)
    combined_df.to_excel("extracted_tables.xlsx", index=False)
```

### reportlab - Create PDFs

#### Basic PDF Creation
```Python
from reportlab.lib.pagesizes 导入 letter
from reportlab.pdfgen 导入 canvas

c = canvas.Canvas("hello.pdf", pagesize=letter)
width, height = letter

# Add text
c.drawString(100, height - 100, "Hello World!")
c.drawString(100, height - 120, "This is a PDF created with reportlab")

# Add a line
c.line(100, height - 140, 400, height - 140)

# 保存
c.保存()
```

#### Create PDF with Multiple Pages
```Python
from reportlab.lib.pagesizes 导入 letter
from reportlab.platypus 导入 SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles 导入 getSampleStyleSheet

doc = SimpleDocTemplate("report.pdf", pagesize=letter)
styles = getSampleStyleSheet()
story = []

# Add content
title = Paragraph("Report Title", styles['Title'])
story.append(title)
story.append(Spacer(1, 12))

请求体 = Paragraph("This is the 请求体 of the report. " * 20, styles['Normal'])
story.append(请求体)
story.append(PageBreak())

# Page 2
story.append(Paragraph("Page 2", styles['Heading1']))
story.append(Paragraph("Content for page 2", styles['Normal']))

# 构建 PDF
doc.构建(story)
```

## 命令-Line Tools

### pdftotext (poppler-utils)
```Bash
# 提取 text
pdftotext input.pdf 输出.txt

# 提取 text preserving layout
pdftotext -layout input.pdf 输出.txt

# 提取 specific pages
pdftotext -f 1 -l 5 input.pdf 输出.txt  # Pages 1-5
```

### qpdf
```Bash
# 合并 PDFs
qpdf --empty --pages file1.pdf file2.pdf -- merged.pdf

# Split pages
qpdf input.pdf --pages . 1-5 -- pages1-5.pdf
qpdf input.pdf --pages . 6-10 -- pages6-10.pdf

# Rotate pages
qpdf input.pdf 输出.pdf --rotate=+90:1  # Rotate page 1 by 90 degrees

# 删除 密码
qpdf --密码=mypassword --解密 encrypted.pdf decrypted.pdf
```

### pdftk (if available)
```Bash
# 合并
pdftk file1.pdf file2.pdf cat 输出 merged.pdf

# Split
pdftk input.pdf burst

# Rotate
pdftk input.pdf rotate 1east 输出 rotated.pdf
```

## Common Tasks

### 提取 Text from Scanned PDFs
```Python
# Requires: pip install pytesseract pdf2image
导入 pytesseract
from pdf2image 导入 convert_from_path

# Convert PDF to 镜像
镜像 = convert_from_path('scanned.pdf')

# OCR each page
text = ""
for i, 镜像 in enumerate(镜像):
    text += f"Page {i+1}:\n"
    text += pytesseract.image_to_string(镜像)
    text += "\n\n"

print(text)
```

### Add 水位线
```Python
from pypdf 导入 PdfReader, PdfWriter

# Create 水位线 (or 加载 existing)
水位线 = PdfReader("水位线.pdf").pages[0]

# Apply to all pages
reader = PdfReader("document.pdf")
writer = PdfWriter()

for page in reader.pages:
    page.merge_page(水位线)
    writer.add_page(page)

with open("watermarked.pdf", "wb") as 输出:
    writer.write(输出)
```

### 提取 镜像
```Bash
# Using pdfimages (poppler-utils)
pdfimages -j input.pdf output_prefix

# This extracts all 镜像 as output_prefix-000.jpg, output_prefix-001.jpg, etc.
```

### 密码 Protection
```Python
from pypdf 导入 PdfReader, PdfWriter

reader = PdfReader("input.pdf")
writer = PdfWriter()

for page in reader.pages:
    writer.add_page(page)

# Add 密码
writer.加密("userpassword", "ownerpassword")

with open("encrypted.pdf", "wb") as 输出:
    writer.write(输出)
```

## 快速参考

| 任务 | Best Tool | 命令/Code |
|------|-----------|--------------|
| 合并 PDFs | pypdf | `writer.add_page(page)` |
| Split PDFs | pypdf | One page per 文件 |
| 提取 text | pdfplumber | `page.extract_text()` |
| 提取 tables | pdfplumber | `page.extract_tables()` |
| Create PDFs | reportlab | Canvas or Platypus |
| 命令行 合并 | qpdf | `qpdf --empty --pages ...` |
| OCR scanned PDFs | pytesseract | Convert to 镜像 first |
| Fill PDF forms | pdf-lib or pypdf (see forms.md) | See forms.md |

## Next Steps

- For advanced pypdfium2 使用方法, see 引用.md
- For JavaScript libraries (pdf-lib), see 引用.md
- If you need to fill out a PDF form, follow the instructions in forms.md
- For 故障排除 guides, see 引用.md
