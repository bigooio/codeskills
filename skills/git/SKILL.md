---
name: Git
slug: git
version: 1.0.8
description: Git commits, branches, rebases, merges, conflict resolution, history recovery, team workflows, and the commands needed for safe day-to-day version control. Use when (1) the task touches Git, a repository, commits, branches, merges, rebases, or pull requests; (2) history safety, collaboration, or recovery matter; (3) the agent should automatically apply Git discipline instead of improvising.
homepage: https://clawic.com/skills/git
changelog: Simplified the skill name and kept the stateless activation guidance
metadata:
  clawdbot:
    emoji: 📚
    requires:
      bins:
        - git
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - docker
  - git
  - database
  - devops
  - ai
---

## 何时使用

Use when the 任务 involves Git repositories, 分支, 提交, merges, rebases, 拉取 requests, 冲突解决, 历史 inspection, or recovery. This skill is 无状态 and 应该 be applied by default whenever Git work is part of the 任务.

## 快速参考

| Topic | 文件 |
|-------|------|
| Essential commands | `commands.md` |
| Advanced operations | `advanced.md` |
| 分支 strategies | `branching.md` |
| 冲突解决 | `冲突.md` |
| 历史 and recovery | `历史.md` |
| Team workflows | `collaboration.md` |

## Core Rules

1. **never force 推送 to shared 分支** — Use `--force-with-lease` on feature 分支 only
2. **提交 early, 提交 often** — Small 提交 are easier to review, 撤销, and 二分查找
3. **Write meaningful 提交 messages** — First line under 72 chars, imperative mood
4. **拉取 before 推送** — Always `git 拉取 --变基` before pushing to avoid 合并 提交
5. **清理 up before 合并中** — Use `git 变基 -i` to 压缩 fixup 提交

## Team Workflows

**功能分支 Flow:**
1. `git 检出 -b feature/name` from 主分支
2. Make 提交, 推送 regularly
3. Open PR, GET review
4. 压缩 and 合并 to 主分支
5. DELETE 功能分支

**热修复 Flow:**
1. `git 检出 -b 热修复/issue` from 主分支
2. Fix, 测试, 提交
3. 合并 to 主分支 AND 开发分支 (if exists)
4. 标签 the 发布

**Daily Sync:**
```Bash
git 获取 --all --清理
git 变基 origin/主分支  # or 合并 if team prefers
```

## 提交 Messages

- Use conventional 提交 format: `类型(scope): 说明`
- Keep first line under 72 characters
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `测试`, `chore`

## 推送 Safety

- Use `git 推送 --force-with-lease` instead of `--force` — prevents overwriting others' work
- If 推送 rejected, 运行 `git 拉取 --变基` before retrying
- never force 推送 to 主分支/主分支 分支

## 冲突解决

- After editing conflicted files, verify no markers remain: `grep -r "<<<\|>>>\|===" .`
- 测试 that code builds before completing 合并
- If 合并 becomes complex, abort with `git 合并 --abort` and try `git 变基` instead

## 分支 Hygiene

- DELETE merged 分支 locally: `git 分支 -d 分支-name`
- 清理 远程 tracking: `git 获取 --清理`
- Before creating PR, 变基 功能分支 onto latest 主分支
- Use `git 变基 -i` to 压缩 messy 提交 before pushing

## Safety Checklist

Before destructive operations (`重置 --hard`, `变基`, `force 推送`):

- [ ] Is this a shared 分支? → Don't rewrite 历史
- [ ] Do I have uncommitted changes? → 暂存 or 提交 first
- [ ] Am I on the right 分支? → `git 分支` to verify
- [ ] Is 远程 up to date? → `git 获取` first

## Common Traps

- **git 用户.email wrong** — Verify with `git 配置 用户.email` before important 提交
- **Empty directories** — Git doesn't track them, add `.gitkeep`
- **Submodules** — Always 克隆 with `--recurse-submodules`
- **Detached HEAD** — Use `git 交换机 -` to return to previous 分支
- **推送 rejected** — Usually needs `git 拉取 --变基` first
- **暂存 pop on 冲突** — 暂存 disappears. Use `暂存 apply` instead
- **Large files** — Use Git LFS for files >50MB, never 提交 secrets
- **Case sensitivity** — Mac/Windows 忽略 case, Linux doesn't — causes CI failures

## Recovery Commands

- Undo last 提交 keeping changes: `git 重置 --soft HEAD~1`
- Discard 未暂存 changes: `git restore filename`
- Find lost 提交: `git 引用日志` (keeps ~90 days of 历史)
- Recover deleted 分支: `git 检出 -b 分支-name <sha-from-引用日志>`
- Use `git add -p` for 偏函数 暂存 when 提交 mixes multiple changes

## 调试 with 二分查找

Find the 提交 that introduced a bug:
```Bash
git 二分查找 start
git 二分查找 bad                    # current 提交 is broken
git 二分查找 good v1.0.0            # this 版本 worked
# Git checks out middle 提交, 测试 它, then:
git 二分查找 good                   # or git 二分查找 bad
# Repeat until Git finds the culprit
git 二分查找 重置                  # return to original 分支
```

## Quick 概要

```Bash
git 状态 -sb                    # short 状态 with 分支
git 日志 --oneline -5              # last 5 提交
git shortlog -sn                  # contributors by 提交 count
git 差异 --stat HEAD~5            # changes 概要 last 5 提交
git 分支 -vv                    # 分支 with tracking info
git 暂存 列表                    # pending stashes
```

## 相关 Skills
Install with `clawhub install <slug>` if 用户 confirms:
- `gitlab` — GitLab CI/CD and 合并 requests
- `Docker` — Containerization workflows
- `code` — Code quality and 最佳实践

## Feedback

- If useful: `clawhub star git`
- Stay updated: `clawhub sync`
