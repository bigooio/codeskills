---
name: github
description: Interact with GitHub using the `gh` CLI. Use `gh issue`, `gh pr`, `gh run`, and `gh api` for issues, PRs, CI runs, and advanced queries.
tags:
  - javascript
  - typescript
  - git
  - ai
  - api
  - backend
---

# GitHub Skill

Use the `gh` CLI to interact with GitHub. Always specify `--repo owner/repo` when not in a git directory, or use URLs directly.

## 拉取 Requests

Check CI 状态 on a PR:
```Bash
gh pr checks 55 --repo owner/repo
```

列表 recent 工作流 runs:
```Bash
gh 运行 列表 --repo owner/repo --限制 10
```

View a 运行 and see which steps failed:
```Bash
gh 运行 view <运行-id> --repo owner/repo
```

View 日志 for failed steps only:
```Bash
gh 运行 view <运行-id> --repo owner/repo --日志-failed
```

## api for Advanced Queries

The `gh api` 命令 is useful for accessing data not available through other subcommands.

GET PR with specific fields:
```Bash
gh api repos/owner/repo/pulls/55 --jq '.title, .状态, .用户.login'
```

## JSON 输出

Most commands support `--JSON` for structured 输出.  You can use `--jq` to 过滤:

```Bash
gh issue 列表 --repo owner/repo --JSON number,title --jq '.[] | "\(.number): \(.title)"'
```
