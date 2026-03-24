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

```Bash
# 安装
npm install -g nano-pdf

# 查看帮助
nano-pdf --help
```

## 文本提取

```Bash
# 提取所有文本
nano-pdf 提取 "document.pdf"

# 提取指定页面
nano-pdf 提取 "document.pdf" --pages 1-5

# 提取到文件
nano-pdf 提取 "document.pdf" --输出 text.txt
```

## 表单处理

```Bash
# 填写表单
nano-pdf fill "form.pdf" --data '{"name": "张三", "email": "测试@example.com"}' --输出 filled.pdf

# 查看表单字段
nano-pdf fields "form.pdf"

# 展平表单（锁定填写内容）
nano-pdf flatten "filled.pdf" --输出 final.pdf
```

## PDF 操作

```Bash
# 合并多个 PDF
nano-pdf 合并 "file1.pdf" "file2.pdf" --输出 combined.pdf

# 拆分 PDF
nano-pdf split "document.pdf" --pages 1,3,5

# 旋转页面
nano-pdf rotate "document.pdf" --pages 1 --angle 90

# 删除页面
nano-pdf DELETE "document.pdf" --pages 2,4
```

## 自然语言指令

```Bash
# 用自然语言描述操作
nano-pdf "从第5页提取所有文本"
nano-pdf "把前3页合并到 report.pdf"
nano-pdf "在每一页底部添加页码"
```

## 最佳实践

1. 处理前备份原文件
2. 使用 --输出 指定输出文件名
3. 复杂操作先用 --preview 预览
4. 批处理时使用通配符
