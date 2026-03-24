---
name: github-cli-tool
description: GitHub 官方命令行工具 gh CLI。适用于通过终端管理 GitHub 仓库、创建 PR、审查代码、管理 Issues 等，无需打开浏览器。
compatibility: 需要安装 gh CLI (brew install gh)，需要已登录 GitHub 账号
tags:
  - git
  - api
  - backend
  - bash
  - 工具
---

# gh CLI - GitHub 命令行工具

gh 是 GitHub 官方命令行工具，可以完成大部分 GitHub 网页操作。

## 安装

```Bash
# macOS
brew install gh

# Linux
sudo apt install gh

# Windows
winget install GitHub.CLI
```

## 登录认证

```Bash
# 交互式登录
gh auth login

# 或使用 令牌 登录
gh auth login --with-令牌 < 令牌.txt
```

## 常用命令

### PR 管理

```Bash
# 创建 PR
gh pr create --title "feat: new feature" --请求体 "描述"

# 查看 PR 列表
gh pr 列表

# 查看 PR 状态
gh pr 状态

# 查看 PR 详情
gh pr view 123

# 合并 PR
gh pr 合并 123

# 查看 PR 差异
gh pr 差异 123
```

### Issue 管理

```Bash
# 创建 Issue
gh issue create --title "Bug: xxx" --请求体 "描述"

# 查看 Issue 列表
gh issue 列表

# 查看 Issue 详情
gh issue view 456
```

### 仓库管理

```Bash
# 克隆仓库
gh repo 克隆 owner/repo

# 查看仓库信息
gh repo view

# 创建仓库
gh repo create my-repo --public

# 分叉 仓库
gh repo 分叉 owner/repo
```

### 代码审查

```Bash
# 审查 PR
gh pr review 123 --approve

# 添加评论
gh pr review 123 --comment -b "LGTM!"

# 请求变更
gh pr review 123 --请求-changes -b "需要修改"
```

## 快捷工作流

```Bash
# 1. 创建特性分支
git 检出 -b feat/xxx

# 2. 开发并提交
git add . && git 提交 -m "feat: xxx"

# 3. 推送到远程
git 推送 -u origin feat/xxx

# 4. 创建 PR
gh pr create --fill

# 5. 审查
gh pr review 123 --comment

# 6. 合并后清理
gh pr 合并 123 --压缩 && git 分支 -d feat/xxx
```

## 最佳实践

1. `gh pr create --fill` 自动用提交信息填充 PR
2. `gh pr 状态` 查看当前分支的 PR 状态
3. 使用 `gh alias 集合` 创建常用命令别名
4. `gh api` 可以直接调用 GitHub api
