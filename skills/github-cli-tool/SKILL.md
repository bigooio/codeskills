---
name: github-cli-tool
description: GitHub 官方命令行工具 gh CLI。适用于通过终端管理 GitHub 仓库、创建 PR、审查代码、管理 Issues 等，无需打开浏览器。
compatibility: 需要安装 gh CLI (brew install gh)，需要已登录 GitHub 账号
---

# gh CLI - GitHub 命令行工具

gh 是 GitHub 官方命令行工具，可以完成大部分 GitHub 网页操作。

## 安装

```bash
# macOS
brew install gh

# Linux
sudo apt install gh

# Windows
winget install GitHub.cli
```

## 登录认证

```bash
# 交互式登录
gh auth login

# 或使用 token 登录
gh auth login --with-token < token.txt
```

## 常用命令

### PR 管理

```bash
# 创建 PR
gh pr create --title "feat: new feature" --body "描述"

# 查看 PR 列表
gh pr list

# 查看 PR 状态
gh pr status

# 查看 PR 详情
gh pr view 123

# 合并 PR
gh pr merge 123

# 查看 PR 差异
gh pr diff 123
```

### Issue 管理

```bash
# 创建 Issue
gh issue create --title "Bug: xxx" --body "描述"

# 查看 Issue 列表
gh issue list

# 查看 Issue 详情
gh issue view 456
```

### 仓库管理

```bash
# 克隆仓库
gh repo clone owner/repo

# 查看仓库信息
gh repo view

# 创建仓库
gh repo create my-repo --public

# fork 仓库
gh repo fork owner/repo
```

### 代码审查

```bash
# 审查 PR
gh pr review 123 --approve

# 添加评论
gh pr review 123 --comment -b "LGTM!"

# 请求变更
gh pr review 123 --request-changes -b "需要修改"
```

## 快捷工作流

```bash
# 1. 创建特性分支
git checkout -b feat/xxx

# 2. 开发并提交
git add . && git commit -m "feat: xxx"

# 3. 推送到远程
git push -u origin feat/xxx

# 4. 创建 PR
gh pr create --fill

# 5. 审查
gh pr review 123 --comment

# 6. 合并后清理
gh pr merge 123 --squash && git branch -d feat/xxx
```

## 最佳实践

1. `gh pr create --fill` 自动用提交信息填充 PR
2. `gh pr status` 查看当前分支的 PR 状态
3. 使用 `gh alias set` 创建常用命令别名
4. `gh api` 可以直接调用 GitHub API
