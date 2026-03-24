---
name: obsidian
description: 操作 Obsidian 保险库（纯 Markdown 笔记）并通过 obsidian-cli 自动化。支持笔记创建、搜索、标签管理、双向链接等功能。
compatibility: 需要 Obsidian 和 obsidian-cli
tags:
  - ai
  - bash
---

# Obsidian 集成

操作 Obsidian 保险库中的 Markdown 笔记。

## 基础配置

```bash
# 初始化保险库
obsidian init --path ~/Obsidian/Vault

# 打开保险库
obsidian open --vault "MyVault"
```

## 笔记操作

```bash
# 创建笔记
obsidian note create "新笔记" --folder "日记"

# 读取笔记
obsidian note read "日记/2024-01-01.md"

# 更新笔记
obsidian note update "日记/2024-01-01.md" --content "新内容"

# 删除笔记
obsidian note delete "日记/2024-01-01.md"
```

## 搜索和查询

```bash
# 全文搜索
obsidian search "关键词"

# 按标签搜索
obsidian search --tag "工作"

# 按日期范围搜索
obsidian search --date "2024-01" --date "2024-12"
```

## 标签管理

```bash
# 添加标签
obsidian tag add "日记/2024-01-01.md" --tags "日记,工作"

# 列出所有标签
obsidian tag list

# 查找带标签的笔记
obsidian tag find "工作"
```

## 双向链接

```bash
# 创建链接
obsidian link create "笔记A.md" --to "笔记B.md"

# 查看反向链接
obsidian link backlinks "笔记B.md"

# 解决孤立笔记
obsidian link orphans
```

## 模板

```bash
# 使用模板创建笔记
obsidian note create "日志" --template "daily"

# 创建模板
obsidian template create "my-template" --content "# {{title}}\n\n日期: {{date}}"
```

## 最佳实践

1. 使用文件夹组织笔记结构
2. 合理使用标签而非嵌套文件夹
3. 利用双向链接构建知识网络
4. 定期整理孤立笔记
