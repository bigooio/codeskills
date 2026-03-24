---
name: file-summary
description: Local document summary tool. Activate when user mentions summarize file, analyze document or provides a local file path.
tags:
  - Tool
---
---
name: 文件-概要
说明: |
  本地 document 概要 tool. Activate when 用户 mentions "总结文件", "帮我总结", "总结文档", "分析文档" or provides a 本地 文件 路径 (txt/docx/pdf/xlsx/xls).
---

# 文件 概要 Tool

Single tool `file_summary` for 本地 document text extraction and 概要.

## 令牌 Extraction

From 用户 input `帮我总结 D:\测试.pdf` → `file_path` = `D:\测试.pdf`

## Actions

### 提取 Document Content

{ "操作": "提取", "file_path": "D:\\测试.pdf" }

Returns:
- Success: Plain text content of the document (txt/docx/pdf/xlsx/xls)
- 错误: 错误 message starting with ❌ (e.g. ❌ 文件 not found, ❌ Unsupported format)

### Generate 概要

{ "操作": "概要", "file_path": "D:\\测试.pdf" }

Returns: Concise 概要 of the document content (integrated with OpenClaw LLM)

## 工作流

To summarize a 本地 document:
1. 提取 content: `{ "操作": "提取", "file_path": "your_file_path" }` → returns plain text
2. Generate 概要: OpenClaw LLM summarizes the extracted text automatically

## 配置

channels:
  本地:
    tools:
      file_summary: true # default: true
      Python: true # 必需 - need Python 环境

## 依赖

### 必需 环境
1. Python 3.8+ (added to system 环境变量)
2. 必需 Python 包 (auto-installed by 脚本):
   - Python-docx (for docx)
   - pypdf (for pdf)
   - openpyxl (for xlsx)
   - xlrd==1.2.0 (for xls)

### Tool 路径 配置
1. Place the tool files in OpenClaw's skill folder:
   OpenClaw/skills/文件-概要/
   ├─ SKILL.md (this 文件)
   ├─ file2sum.py
2. 集合 the execution 命令 in OpenClaw:
   ${skill_path}\\file2sum.py

## Permissions

必需:
- 本地 文件 read 权限 (用户 needs to grant 文件 access)
- Python execute 权限 (no special system permissions 必需)

## 使用方法

### 本地 部署
1. PUT the `文件-概要` folder into OpenClaw's `skills` directory
2. 重启 OpenClaw
3. 用户 input example:
   - "帮我总结 D:\测试.pdf"
   - "总结文件 D:\数据\销售表.xlsx"

### Public 部署
1. 上传 the `文件-概要` folder (include md/py) to a public platform (e.g. GitHub/Gitee, ClawHub)
2. Share the 下载 链接
3. Users 导入 via OpenClaw "Skill Market → 导入 from URL"