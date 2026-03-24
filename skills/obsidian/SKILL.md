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

```Bash
# 初始化保险库
obsidian init --路径 ~/Obsidian/Vault

# 打开保险库
obsidian open --Vault "MyVault"
```

## 笔记操作

```Bash
# 创建笔记
obsidian note create "新笔记" --folder "日记"

# 读取笔记
obsidian note read "日记/2024-01-01.md"

# 更新笔记
obsidian note 更新 "日记/2024-01-01.md" --content "新内容"

# 删除笔记
obsidian note DELETE "日记/2024-01-01.md"
```

## 搜索和查询

```Bash
# 全文搜索
obsidian 搜索 "关键词"

# 按标签搜索
obsidian 搜索 --标签 "工作"

# 按日期范围搜索
obsidian 搜索 --date "2024-01" --date "2024-12"
```

## 标签管理

```Bash
# 添加标签
obsidian 标签 add "日记/2024-01-01.md" --tags "日记,工作"

# 列出所有标签
obsidian 标签 列表

# 查找带标签的笔记
obsidian 标签 find "工作"
```

## 双向链接

```Bash
# 创建链接
obsidian 链接 create "笔记A.md" --to "笔记B.md"

# 查看反向链接
obsidian 链接 backlinks "笔记B.md"

# 解决孤立笔记
obsidian 链接 orphans
```

## 模板

```Bash
# 使用模板创建笔记
obsidian note create "日志" --模板 "daily"

# 创建模板
obsidian 模板 create "my-模板" --content "# {{title}}\n\n日期: {{date}}"
```

## 最佳实践

1. 使用文件夹组织笔记结构
2. 合理使用标签而非嵌套文件夹
3. 利用双向链接构建知识网络
4. 定期整理孤立笔记
