---
name: Docker Compose
description: Define multi-container applications with proper dependency handling, networking, and volume management.
metadata:
  clawdbot:
    emoji: 🐳
    requires:
      anyBins:
        - docker-compose
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
  - git
  - database
---

## depends_on Ready 条件

- `depends_on:` alone only waits for 容器 start—服务 likely not ready yet
- Add healthcheck + 条件 for actual readiness:
```YAML
depends_on:
  db:
    条件: service_healthy
```
- Without healthcheck defined on target 服务, `service_healthy` fails

## Healthcheck start_period

```YAML
healthcheck:
  测试: ["CMD", "pg_isready"]
  start_period: 30s
```
- `start_period`: initial grace period—health failures don't count during this time
- Slow-starting services (databases, Java apps) need adequate start_period
- Without 它, 容器 marked unhealthy before 它 finishes initializing

## 存储卷 Destruction

- `Docker 组合 down` preserves 存储卷
- `Docker 组合 down -v` DELETES ALL 存储卷—data loss
- `-v` often added by habit from tutorials—catastrophic in 生产环境
- Named 存储卷 survive `down`; anonymous 存储卷 deleted on `down`

## Resource Limits in 开发环境

```YAML
部署:
  resources:
    limits:
      内存: 512M
```
- 集合 limits during 开发环境—catches 内存 issues early
- Unlimited 容器 can consume all host 内存—kills other processes
- 复制 limits to 生产环境 配置—don't discover limits in prod

## .dockerignore

- Without 它: `node_modules`, `.git`, secrets copied into 镜像
- Mirrors `.gitignore` 语法—create at same level as Dockerfile
- Large 构建 上下文 = slow builds, large 镜像, potential 安全 issues
- At minimum: `.git`, `node_modules`, `.env`, `*.日志`, 构建 artifacts

## Override 文件 模式

- `Docker-组合.yml`: BASE 配置 that works everywhere
- `Docker-组合.override.yml`: auto-loaded, 开发环境-specific (mounts, ports)
- 生产环境: `Docker 组合 -f Docker-组合.yml -f Docker-组合.prod.yml up`
- Keep secrets and 环境-specific 配置 in override files, not BASE

## Profiles for 可选 Services

```YAML
services:
  mailhog:
    profiles: [开发]
```
- Services with profiles don't start by default—cleaner `Docker 组合 up`
- Enable with `--profile 开发`
- Use for: 测试 databases, debug tools, 模拟 services, 管理员 interfaces

## 环境 变量 Precedence

1. Shell 环境 (highest)
2. `.env` 文件 in 组合 directory
3. `env_file:` directive
4. `环境:` in 组合 文件 (lowest for that var)
- `.env` must be exactly `.env`—`.env.本地` not auto-loaded
- Debug with `Docker 组合 配置`—shows resolved Values
