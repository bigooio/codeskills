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

```Bash
# 登录 GitHub
gh auth login

# 验证登录状态
gh auth 状态
```

## PR 管理

```Bash
# 查看 PR 状态
gh pr 状态

# 查看特定 PR 详情
gh pr view 123

# 创建 PR
gh pr create --title "feat: 新功能" --请求体 "描述"

# 查看 CI 状态
gh pr checks 55 --repo owner/repo

# 合并 PR
gh pr 合并 123 --压缩

# 查看 PR 差异
gh pr 差异 123
```

## CI/CD 运行

```Bash
# 列出最近的 工作流 runs
gh 运行 列表 --repo owner/repo --限制 10

# 查看特定 运行 及失败步骤
gh 运行 view <运行-id> --repo owner/repo

# 查看失败步骤的日志
gh 运行 view <运行-id> --repo owner/repo --日志-failed
```

## Issue 管理

```Bash
# 列出 Issues
gh issue 列表 --repo owner/repo

# 创建 Issue
gh issue create --title "Bug: xxx" --请求体 "描述"

# 查看 Issue
gh issue view 456
```

## api 高级查询

```Bash
# 获取 PR 特定字段
gh api repos/owner/repo/pulls/55 --jq '.title, .状态, .用户.login'

# 列出所有字段
gh issue 列表 --repo owner/repo --JSON number,title,状态 --jq '.[] | "\(.number): \(.title)"'
```

## 快捷工作流

```Bash
# 1. 创建特性分支并推送
git 检出 -b feat/xxx
git 推送 -u origin feat/xxx

# 2. 创建 PR
gh pr create --fill

# 3. 查看 CI 状态
gh pr checks 123 --repo owner/repo

# 4. 合并并清理
gh pr 合并 123 --压缩 && git 分支 -d feat/xxx
```

## 最佳实践

1. `--fill` 自动用提交信息填充 PR
2. `--JSON --jq` 格式化输出便于脚本处理
3. `gh alias 集合` 创建常用命令别名
4. 优先在 git 目录中操作，自动识别仓库
