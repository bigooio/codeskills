---
name: git-essentials
description: Essential Git commands and workflows for version control, branching, and collaboration.
homepage: https://git-scm.com/
metadata:
  clawdbot:
    emoji: 🌳
    requires:
      bins:
        - git
tags:
  - typescript
  - git
  - ai
  - testing
  - api
  - frontend
---

# Git Essentials

Essential Git commands for 版本 control and collaboration.

## Initial 设置

```Bash
# Configure 用户
git 配置 --全局 用户.name "Your Name"
git 配置 --全局 用户.email "your@email.com"

# Initialize 仓库
git init

# 克隆 仓库
git 克隆 HTTPS://github.com/用户/repo.git
git 克隆 HTTPS://github.com/用户/repo.git custom-name
```

## Basic 工作流

### 暂存 and committing
```Bash
# Check 状态
git 状态

# Add files to 暂存
git add 文件.txt
git add .
git add -A  # All changes including deletions

# 提交 changes
git 提交 -m "提交 message"

# Add and 提交 in one 步骤
git 提交 -am "Message"

# 修改 last 提交
git 提交 --修改 -m "New message"
git 提交 --修改 --no-edit  # Keep message
```

### Viewing changes
```Bash
# Show 未暂存 changes
git 差异

# Show 已暂存 changes
git 差异 --已暂存

# Show changes in specific 文件
git 差异 文件.txt

# Show changes between 提交
git 差异 commit1 commit2
```

## Branching & 合并中

### 分支 management
```Bash
# 列表 分支
git 分支
git 分支 -a  # Include 远程 分支

# Create 分支
git 分支 feature-name

# 交换机 分支
git 检出 feature-name
git 交换机 feature-name  # Modern alternative

# Create and 交换机
git 检出 -b feature-name
git 交换机 -c feature-name

# DELETE 分支
git 分支 -d 分支-name
git 分支 -D 分支-name  # Force DELETE

# Rename 分支
git 分支 -m old-name new-name
```

### 合并中
```Bash
# 合并 分支 into current
git 合并 feature-name

# 合并 with no fast-forward
git 合并 --no-ff feature-name

# Abort 合并
git 合并 --abort

# Show 合并 冲突
git 差异 --name-only --差异-过滤=U
```

## 远程 Operations

### Managing remotes
```Bash
# 列表 remotes
git 远程 -v

# Add 远程
git 远程 add origin HTTPS://github.com/用户/repo.git

# Change 远程 URL
git 远程 集合-URL origin HTTPS://github.com/用户/new-repo.git

# 删除 远程
git 远程 删除 origin
```

### Syncing with 远程
```Bash
# 获取 from 远程
git 获取 origin

# 拉取 changes (获取 + 合并)
git 拉取

# 拉取 with 变基
git 拉取 --变基

# 推送 changes
git 推送

# 推送 new 分支
git 推送 -u origin 分支-name

# Force 推送 (careful!)
git 推送 --force-with-lease
```

## 历史 & 日志

### Viewing 历史
```Bash
# Show 提交 历史
git 日志

# One line per 提交
git 日志 --oneline

# with graph
git 日志 --graph --oneline --all

# Last N 提交
git 日志 -5

# 提交 by author
git 日志 --author="Name"

# 提交 in date range
git 日志 --since="2 weeks ago"
git 日志 --until="2024-01-01"

# 文件 历史
git 日志 -- 文件.txt
```

### Searching 历史
```Bash
# 搜索 提交 messages
git 日志 --grep="bug fix"

# 搜索 code changes
git 日志 -S "function_name"

# Show who changed each line
git 追溯 文件.txt

# Find 提交 that introduced bug
git 二分查找 start
git 二分查找 bad
git 二分查找 good 提交-哈希
```

## Undoing Changes

### Working directory
```Bash
# Discard changes in 文件
git restore 文件.txt
git 检出 -- 文件.txt  # Old way

# Discard all changes
git restore .
```

### 暂存 area
```Bash
# Unstage 文件
git restore --已暂存 文件.txt
git 重置 HEAD 文件.txt  # Old way

# Unstage all
git 重置
```

### 提交
```Bash
# Undo last 提交 (keep changes)
git 重置 --soft HEAD~1

# Undo last 提交 (discard changes)
git 重置 --hard HEAD~1

# 撤销 提交 (create new 提交)
git 撤销 提交-哈希

# 重置 to specific 提交
git 重置 --hard 提交-哈希
```

## Stashing

```Bash
# 暂存 changes
git 暂存

# 暂存 with message
git 暂存 保存 "Work in progress"

# 列表 stashes
git 暂存 列表

# Apply latest 暂存
git 暂存 apply

# Apply and 删除 暂存
git 暂存 pop

# Apply specific 暂存
git 暂存 apply 暂存@{2}

# DELETE 暂存
git 暂存 drop 暂存@{0}

# Clear all stashes
git 暂存 clear
```

## 变基中

```Bash
# 变基 current 分支
git 变基 主分支

# Interactive 变基 (last 3 提交)
git 变基 -i HEAD~3

# Continue after resolving 冲突
git 变基 --continue

# Skip current 提交
git 变基 --skip

# Abort 变基
git 变基 --abort
```

## Tags

```Bash
# 列表 tags
git 标签

# Create lightweight 标签
git 标签 v1.0.0

# Create annotated 标签
git 标签 -a v1.0.0 -m "版本 1.0.0"

# 标签 specific 提交
git 标签 v1.0.0 提交-哈希

# 推送 标签
git 推送 origin v1.0.0

# 推送 all tags
git 推送 --tags

# DELETE 标签
git 标签 -d v1.0.0
git 推送 origin --DELETE v1.0.0
```

## Advanced Operations

### 摘取
```Bash
# Apply specific 提交
git 摘取 提交-哈希

# 摘取 without committing
git 摘取 -n 提交-哈希
```

### Submodules
```Bash
# Add 子模块
git 子模块 add HTTPS://github.com/用户/repo.git 路径/

# Initialize submodules
git 子模块 init

# 更新 submodules
git 子模块 更新

# 克隆 with submodules
git 克隆 --recursive HTTPS://github.com/用户/repo.git
```

### 清理
```Bash
# Preview files to be deleted
git 清理 -n

# DELETE untracked files
git 清理 -f

# DELETE untracked files and directories
git 清理 -fd

# Include ignored files
git 清理 -fdx
```

## Common Workflows

**功能分支 工作流:**
```Bash
git 检出 -b feature/new-feature
# Make changes
git add .
git 提交 -m "Add new feature"
git 推送 -u origin feature/new-feature
# Create PR, then after 合并:
git 检出 主分支
git 拉取
git 分支 -d feature/new-feature
```

**热修复 工作流:**
```Bash
git 检出 主分支
git 拉取
git 检出 -b 热修复/critical-bug
# Fix bug
git 提交 -am "Fix critical bug"
git 推送 -u origin 热修复/critical-bug
# After 合并:
git 检出 主分支 && git 拉取
```

**Syncing 分叉:**
```Bash
git 远程 add upstream HTTPS://github.com/original/repo.git
git 获取 upstream
git 检出 主分支
git 合并 upstream/主分支
git 推送 origin 主分支
```

## Useful Aliases

Add to `~/.gitconfig`:
```ini
[alias]
    st = 状态
    co = 检出
    br = 分支
    ci = 提交
    unstage = 重置 HEAD --
    last = 日志 -1 HEAD
    visual = 日志 --graph --oneline --all
    修改 = 提交 --修改 --no-edit
```

## Tips

- 提交 often, perfect later (interactive 变基)
- Write meaningful 提交 messages
- Use `.gitignore` for files to exclude
- never force 推送 to shared 分支
- 拉取 before starting work
- Use feature 分支, not 主分支
- 变基 feature 分支 before 合并中
- Use `--force-with-lease` instead of `--force`

## Common Issues

**Undo accidental 提交:**
```Bash
git 重置 --soft HEAD~1
```

**Recover deleted 分支:**
```Bash
git 引用日志
git 检出 -b 分支-name <提交-哈希>
```

**Fix wrong 提交 message:**
```Bash
git 提交 --修改 -m "Correct message"
```

**Resolve 合并 冲突:**
```Bash
# Edit files to resolve 冲突
git add resolved-files
git 提交  # Or git 合并 --continue
```

## Documentation

Official docs: HTTPS://git-scm.com/doc
Pro Git book: HTTPS://git-scm.com/book
Visual Git guide: HTTPS://marklodato.github.io/visual-git-guide/
