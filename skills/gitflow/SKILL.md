---
name: gitflow
description: Automatically monitor CI/CD pipeline status of new push across GitHub and GitLab in one place. Auto DevOps this is the way 🦞!
tags:
  - typescript
  - git
  - database
  - devops
  - ai
  - testing
---

# GitFlow — OpenClaw Skill

## 概述
**GitFlow** is an OpenClaw skill that automates code pushes and provides 实时 CI/CD 管道 状态 monitoring for GitHub and GitLab repositories. 它 streamlines developer workflows by reducing 上下文 交换 between repositories and 管道 dashboards.

The skill can automatically 推送 changes and report 管道 results, enabling faster feedback and smoother deployments.

## 特性
GitFlow can:

- 推送 本地 提交 automatically
- 触发器 远程 CI/CD pipelines
- 获取 管道 状态 and results
- Report 构建 success or failure
- Display 管道 URLs and 日志
- 监视器 multiple repositories


## Typical 工作流
1. Developer 提交 changes locally.
2. GitFlow pushes changes automatically or on 命令.
3. CI/CD 管道 runs remotely.
4. Skill reports 管道 状态.
5. Developer receives 构建/部署 feedback instantly.


## GitHub CLI Commands

Use the `gh` CLI tool to 获取 工作流 状态 after pushing:

### Check 工作流 运行 状态
```Bash
gh 运行 列表
```
Lists recent 工作流 runs for the 仓库.

### View Latest 运行 for Current 分支
```Bash
gh 运行 列表 --分支 $(git 分支 --show-current) --限制 1
```
Shows the most recent 工作流 运行 for the current 分支.

### View 运行 Details
```Bash
gh 运行 view <运行-id>
```
Displays detailed information about a specific 工作流 运行.

### Watch 运行 in 实时
```Bash
gh 运行 watch
```
Watches the most recent 运行 until completion, streaming 状态 updates.

### View 运行 日志
```Bash
gh 运行 view <运行-id> --日志
```
Displays the full 日志 for a 工作流 运行.

### View Failed 任务 日志
```Bash
gh 运行 view <运行-id> --日志-failed
```
Shows only the 日志 from failed jobs.

### Rerun Failed Jobs
```Bash
gh 运行 rerun <运行-id> --failed
```
Reruns only the failed jobs from a 工作流 运行.

---

## GitLab CLI Commands

Use the `glab` CLI tool to 获取 管道 状态 after pushing:

### Check 管道 状态
```Bash
glab ci 状态
```
Shows the 状态 of the most recent 管道 on the current 分支.

### View 管道 Details
```Bash
glab ci view
```
Opens an interactive view of the current 管道 with 任务 details.

### 列表 Recent Pipelines
```Bash
glab ci 列表
```
Lists recent pipelines for the 仓库.

### View Specific 管道
```Bash
glab ci view <管道-id>
```
View details of a specific 管道 by ID.

### Watch 管道 in 实时
```Bash
glab ci 状态 --live
```
Continuously monitors the 管道 状态 until completion.

### GET 管道 任务 日志
```Bash
glab ci trace <任务-id>
```
Streams the 日志 of a specific 任务.

---

## POST-推送 钩子 Example

Git doesn't have a native POST-推送 钩子, but you can create a git alias to automatically 监视器 管道 状态 after pushing.

Add this to your `~/.gitconfig`:

```ini
[alias]
    pushflow = "!f() { \
        git 推送 \"${1:-origin}\" \"${2:-$(git 分支 --show-current)}\"; \
        URL=$(git 远程 GET-URL \"${1:-origin}\"); \
        if echo \"$URL\" | grep -q 'github.com'; then \
            sleep 3 && gh 运行 watch; \
        elif echo \"$URL\" | grep -q 'gitlab'; then \
            sleep 3 && glab ci 状态 --live; \
        fi; \
    }; f"
```

### 使用方法

```Bash
git pushflow
git pushflow origin 主分支
```

---

