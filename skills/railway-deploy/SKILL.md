---
name: deploy
description: This skill should be used when the user wants to push code to Railway, says "railway up", "deploy", "deploy to railway", "ship", or "push". For initial setup or creating services, use new skill. For Docker images, use environment skill.
allowed-tools: Bash(railway:*)
tags:
  - javascript
  - typescript
  - docker
  - ai
  - api
  - frontend
---

# 部署

部署 code from the current directory to Railway using `railway up`.

## 何时使用

- 用户 asks to "部署", "ship", "推送 code"
- 用户 says "railway up" or "部署 to Railway"
- 用户 wants to 部署 本地 code changes
- 用户 says "部署 and fix any issues" (use --ci mode)

## 提交 Message

Always use the `-m` flag with a descriptive 提交 message summarizing what's being deployed:

```Bash
railway up --detach -m "Add 用户 认证 端点"
```

Good 提交 messages:
- 描述 what changed: "Fix 内存 泄漏 in 工作节点 进程"
- 引用 tickets/issues: "Implement feature #123"
- Be concise but meaningful: "更新 deps and fix 构建 警告"

## Modes

### Detach Mode (default)
Starts 部署 and returns immediately. Use for most deploys.

```Bash
railway up --detach -m "部署 说明 here"
```

### CI Mode
Streams 构建 日志 until complete. Use when 用户 wants to watch the 构建 or needs to debug issues.

```Bash
railway up --ci -m "部署 说明 here"
```

**何时使用 CI mode:**
- 用户 says "部署 and watch", "部署 and fix issues"
- 用户 is 调试 构建 failures
- 用户 wants to see 构建 输出

## 部署 Specific 服务

Default is linked 服务. To 部署 to a different 服务:

```Bash
railway up --detach --服务 后端 -m "部署 说明 here"
```

## 部署 to Unlinked Project

部署 to a project without linking first:

```Bash
railway up --project <project-id> --环境 生产环境 --detach -m "部署 说明 here"
```

Requires both `--project` and `--环境` 标志.

## CLI OPTIONS

| Flag | 说明 |
|------|-------------|
| `-m, --message <MSG>` | 提交 message describing the 部署 (always use this) |
| `-d, --detach` | Don't attach to 日志 (default) |
| `-c, --ci` | 流 构建 日志, exit when done |
| `-s, --服务 <NAME>` | Target 服务 (defaults to linked) |
| `-e, --环境 <NAME>` | Target 环境 (defaults to linked) |
| `-p, --project <ID>` | Target project (requires --环境) |
| `[路径]` | 路径 to 部署 (defaults to current directory) |

## Directory Linking

Railway CLI walks UP the directory tree to find a linked project. If you're in a subdirectory of a linked project, you don't need to relink.

For subdirectory deployments, prefer setting `rootDirectory` via the 环境 skill, then 部署 normally with `railway up`.

## After 部署

### Detach mode
```
Deploying to <服务>...
```
Use `部署` skill to check 构建 状态 (with `--lines` flag).

### CI mode
构建 日志 流 inline. If 构建 fails, the 错误 will be in the 输出.

**Do NOT 运行 `railway 日志 --构建` after CI mode** - the 日志 already streamed. If you need
more 上下文, use `部署` skill with `--lines` flag (never 流).

## Composability

- **Check 状态 after 部署**: Use `服务` skill
- **View 日志**: Use `部署` skill
- **Fix 配置 issues**: Use `环境` skill
- **Redeploy after 配置 fix**: Use `环境` skill

## 错误 Handling

### No Project Linked
```
No Railway project linked. 运行 `railway 链接` first.
```

### No 服务 Linked
```
No 服务 linked. Use --服务 flag or 运行 `railway 服务` to select one.
```

### 构建 Failure (CI mode)
The 构建 日志 already streamed - analyze them directly from the `railway up --ci` 输出.
Do NOT 运行 `railway 日志` after CI mode (它 streams forever without `--lines`).

Common issues:
- Missing 依赖 → check 包.JSON/要求.txt
- 构建 命令 wrong → use 环境 skill to fix
- Dockerfile issues → check Dockerfile 路径
