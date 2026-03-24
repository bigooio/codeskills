---
name: nano-pdf
description: 使用 nano-pdf CLI 通过自然语言指令编辑 PDF 文件。支持提取文本、填写表单、合并文件等操作。
compatibility: 需要 nano-pdf CLI
tags:
  - ai
  - testing
  - bash
  - 工具
---

# Nano PDF - PDF 处理工具

通过自然语言指令处理 PDF 文件。

## 基础配置

```bash
# 安装
npm install -g nano-pdf

# 查看帮助
nano-pdf --help
```

## 文本提取

```bash
# 提取所有文本
nano-pdf extract "document.pdf"

# 提取指定页面
nano-pdf extract "document.pdf" --pages 1-5

# 提取到文件
nano-pdf extract "document.pdf" --output text.txt
```

## 表单处理

```bash
# 填写表单
nano-pdf fill "form.pdf" --data '{"name": "张三", "email": "test@example.com"}' --output filled.pdf

# 查看表单字段
nano-pdf fields "form.pdf"

# 展平表单（锁定填写内容）
nano-pdf flatten "filled.pdf" --output final.pdf
```

## PDF 操作

```bash
# 合并多个 PDF
nano-pdf merge "file1.pdf" "file2.pdf" --output combined.pdf

# 拆分 PDF
nano-pdf split "document.pdf" --pages 1,3,5

# 旋转页面
nano-pdf rotate "document.pdf" --pages 1 --angle 90

# 删除页面
nano-pdf delete "document.pdf" --pages 2,4
```

## 自然语言指令

```bash
# 用自然语言描述操作
nano-pdf "从第5页提取所有文本"
nano-pdf "把前3页合并到 report.pdf"
nano-pdf "在每一页底部添加页码"
```

## 最佳实践

1. 处理前备份原文件
2. 使用 --output 指定输出文件名
3. 复杂操作先用 --preview 预览
4. 批处理时使用通配符
