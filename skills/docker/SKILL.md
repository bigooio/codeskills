---
name: Docker
slug: docker
version: 1.0.4
homepage: https://clawic.com/skills/docker
description: Docker containers, images, Compose stacks, networking, volumes, debugging, production hardening, and the commands that keep real environments stable. Use when (1) the task touches Docker, Dockerfiles, images, containers, or Compose; (2) build reliability, runtime behavior, logs, ports, volumes, or security matter; (3) the agent needs Docker guidance and should apply it by default.
changelog: Simplified the skill name and kept the stateless activation guidance
metadata:
  clawdbot:
    emoji: 🐳
    requires:
      bins:
        - docker
    os:
      - linux
      - darwin
      - win32
tags:
  - javascript
  - typescript
  - python
  - docker
  - database
  - devops
---

## 何时使用

Use when the 任务 involves Docker, Dockerfiles, 容器 builds, 组合, 镜像 publishing, networking, 存储卷, 日志, 调试, or 生产环境 容器 operations. This skill is 无状态 and 应该 be applied directly whenever Docker work appears.

## 快速参考

| Topic | 文件 |
|-------|------|
| Essential commands | `commands.md` |
| Dockerfile patterns | `镜像.md` |
| 组合 编排 | `组合.md` |
| Networking & 存储卷 | `基础设施.md` |
| 安全 加固 | `安全.md` |

## Core Rules

### 1. Pin 镜像 Versions
- `Python:3.11.5-slim` not `Python:latest`
- Today's latest differs from tomorrow's — breaks immutable builds

### 2. Combine 运行 Commands
- `apt-GET 更新 && apt-GET install -y pkg` in ONE 层
- Separate layers = stale 包 缓存 weeks later

### 3. Non-root by Default
- Add `用户 nonroot` in Dockerfile
- Running as root fails 安全 scans and platform policies

### 4. 集合 Resource Limits
- `-m 512m` on every 容器
- OOM killer strikes without warning otherwise

### 5. Configure 日志 Rotation
- Default JSON-文件 driver has no size 限制
- One chatty 容器 fills disk and crashes host

## 镜像 Traps

- 多阶段 builds: forgotten `--from=建造者` copies from wrong stage silently
- 复制 before 运行 invalidates 缓存 on every 文件 change — 复制 要求 first, install, then 复制 code
- `ADD` extracts archives automatically — use `复制` unless you need extraction
- 构建 args visible in 镜像 历史 — never use for secrets

## 运行时 Traps

- `localhost` inside 容器 is 容器's localhost — 绑定 to `0.0.0.0`
- 端口 already in use: previous 容器 still stopping — wait or force 删除
- Exit code 137 = OOM killed, 139 = segfault — check with `Docker 检查 --format='{{.状态.ExitCode}}'`
- No Shell in distroless 镜像 — `Docker cp` files out or use debug sidecar

## Networking Traps

- 容器 DNS only works on custom 网络 — default 桥接 can't resolve names
- Published ports 绑定 to `0.0.0.0` — use `127.0.0.1:5432:5432` for 本地-only
- 僵尸进程 connections from killed 容器 — 集合 health checks and 重启 policies

## 组合 Traps

- `depends_on` waits for 容器 start, not 服务 ready — use `条件: service_healthy`
- `.env` 文件 in wrong directory silently ignored — must be next to Docker-组合.yml
- 存储卷 mounts overwrite 容器 files — empty host dir = empty 容器 dir
- YAML anchors don't work across files — use multiple 组合 files instead

## 存储卷 Traps

- Anonymous 存储卷 accumulate silently — use named 存储卷
- 绑定 mounts have 权限 issues — 容器 用户 must 匹配 host 用户
- `Docker system 清理` doesn't 删除 named 存储卷 — add `--存储卷` flag
- Stopped 容器 data persists until 容器 removed

## Resource Leaks

- Dangling 镜像 grow unbounded — `Docker 镜像 清理` regularly
- 构建 缓存 grows forever — `Docker 建造者 清理` reclaims space
- Stopped 容器 consume disk — `Docker 容器 清理` or `--rm` on 运行
- 网络 pile up from 组合 projects — `Docker 网络 清理`

## Secrets and 安全

- ENV and 复制 bake secrets into 层 历史 permanently — use secrets mount or 运行时 env
- `--特权模式` disables all 安全 — almost never needed, find specific capability instead
- 镜像 from unknown registries may be malicious — verify sources
- 构建 args visible in 镜像 历史 — don't use for secrets

## 调试

- Exit code 137 = OOM killed, 139 = segfault — check `Docker 检查 --format='{{.状态.ExitCode}}'`
- 容器 won't start: check 日志 even for failed 容器 — `Docker 日志 <容器>`
- No Shell in distroless 镜像 — `Docker cp` files out or use debug sidecar
- 检查 filesystem of dead 容器 — `Docker cp deadcontainer:/路径 ./本地`

## 相关 Skills
Install with `clawhub install <slug>` if 用户 confirms:
- `devops` — 部署 pipelines
- `linux` — host system management
- `服务器` — 服务器 administration

## Feedback

- If useful: `clawhub star Docker`
- Stay updated: `clawhub sync`
