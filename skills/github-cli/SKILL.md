---
name: github-cli
description: 使用 gh CLI 与 GitHub 交互。通过 gh issue、gh pr、gh run 和 gh api 管理议题、PR、CI 运行及高级查询。适用于需要操作 GitHub 仓库、管理 PR、查看 CI 状态、查询 Issues 等场景。
compatibility: 需要安装 gh CLI (brew install gh)
tags:
  - javascript
  - git
  - devops
  - ai
  - api
  - backend
---

# GitHub CLI 工具

使用 `gh` CLI 与 GitHub 交互。操作仓库时建议指定 `--repo owner/repo`，或在 git 目录中自动识别。

## 基础配置

```bash
# 登录 GitHub
gh auth login

# 验证登录状态
gh auth status
```

## PR 管理

```bash
# 查看 PR 状态
gh pr status

# 查看特定 PR 详情
gh pr view 123

# 创建 PR
gh pr create --title "feat: 新功能" --body "描述"

# 查看 CI 状态
gh pr checks 55 --repo owner/repo

# 合并 PR
gh pr merge 123 --squash

# 查看 PR 差异
gh pr diff 123
```

## CI/CD 运行

```bash
# 列出最近的 workflow runs
gh run list --repo owner/repo --limit 10

# 查看特定 run 及失败步骤
gh run view <run-id> --repo owner/repo

# 查看失败步骤的日志
gh run view <run-id> --repo owner/repo --log-failed
```

## Issue 管理

```bash
# 列出 Issues
gh issue list --repo owner/repo

# 创建 Issue
gh issue create --title "Bug: xxx" --body "描述"

# 查看 Issue
gh issue view 456
```

## API 高级查询

```bash
# 获取 PR 特定字段
gh api repos/owner/repo/pulls/55 --jq '.title, .state, .user.login'

# 列出所有字段
gh issue list --repo owner/repo --json number,title,state --jq '.[] | "\(.number): \(.title)"'
```

## 快捷工作流

```bash
# 1. 创建特性分支并推送
git checkout -b feat/xxx
git push -u origin feat/xxx

# 2. 创建 PR
gh pr create --fill

# 3. 查看 CI 状态
gh pr checks 123 --repo owner/repo

# 4. 合并并清理
gh pr merge 123 --squash && git branch -d feat/xxx
```

## 最佳实践

1. `--fill` 自动用提交信息填充 PR
2. `--json --jq` 格式化输出便于脚本处理
3. `gh alias set` 创建常用命令别名
4. 优先在 git 目录中操作，自动识别仓库
