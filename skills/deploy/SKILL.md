---
name: Deploy
description: Ship applications reliably with CI/CD, rollback strategies, and zero-downtime deployment patterns.
metadata:
  clawdbot:
    emoji: 🚀
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

# 部署 Rules

## Pre-部署 Checklist
- Tests passing in CI — never 部署 with failing tests
- 环境变量 集合 in target — missing secrets cause silent failures
- 数据库 migrations 运行 before code 部署 — new code expecting new schema fails
- 回滚 plan ready — know exactly how to 撤销 before you need to

## 部署 Strategies
- **Rolling**: 更新 instances one by one — safe, slower, no extra resources
- **Blue-green**: full parallel 环境, instant 交换机 — fast 回滚, 2x resources
- **Canary**: 路由 percentage to new 版本 — 捕获 issues early, complex 路由
- Choose based on risk tolerance and resources — no universal best

## Zero-Downtime Deploys
- Health checks must pass before traffic routes — unhealthy instances stay out
- Graceful shutdown: finish in-flight requests before terminating
- 数据库 changes must be backwards compatible — old code still running during 部署
- 会话 handling: sticky sessions or external 会话 store — don't lose 用户 状态

## CI/CD 管道
- 构建 once, 部署 everywhere — same 制品 to 暂存 and prod
- 缓存 依赖 between builds — 保存 minutes per 部署
- Parallel steps where possible — tests, linting, 安全 scans
- Fail fast: quick checks first — don't wait for slow tests to 捕获 typos
- Pin 操作 versions with SHA — tags can change unexpectedly

## 环境 Management
- 暂存 mirrors prod — different configs cause "works in 暂存" bugs
- Secrets in 密钥 管理节点, not 环境 files — rotation without redeploy
- Feature 标志 decouple 部署 from 发布 — ship dark, enable later
- 配置 as code in 版本 control — except secrets

## 数据库 Migrations
- Migrations must be backwards compatible during 部署 窗口
- Add columns nullable first, then backfill, then add constraint
- never rename columns in one 步骤 — add new, migrate data, 删除 old
- 测试 migrations on prod-size data — 10 rows is fast, 10 million isn't
- 回滚 脚本 for every 迁移

## 回滚
- Automated 回滚 on 健康检查 failure
- Keep previous 版本 artifacts available — can't 回滚 what you deleted
- 数据库 rollbacks are hard — design migrations to not need them
- Feature 标志 for instant 回滚 of functionality without 部署
- Document 回滚 procedure — panic time is not learning time

## Monitoring POST-部署
- Watch 错误 rates for 15 minutes after 部署 — most issues surface quickly
- Compare key metrics to pre-部署 baseline
- Alerting on anomalies: 延迟 spike, 错误 rate increase
- 日志 correlation: trace requests through systems
- 用户-facing smoke tests after 部署

## Platform-Specific

### 容器
- 镜像 tagged with git SHA — know exactly what's running
- 健康检查 端点 that verifies 依赖
- Resource limits 集合 — prevent runaway 容器

### 无服务器
- Cold start optimization — keep bundles small
- Provisioned 并发 for 延迟-sensitive paths
- 超时 集合 appropriately — default is often too short

### 静态 Sites
- CDN 缓存 invalidation after 部署
- Immutable assets with content hashes — 缓存 forever
- Preview deploys for PRs

## Common Mistakes
- Deploying Friday afternoon — issues surface when nobody's watching
- No 回滚 plan — hoping nothing goes wrong isn't a 策略
- Mixing code and 迁移 deploys — one thing at a time
- Manual 部署 steps — if 它's not automated, 它's wrong sometimes
- Deploying without monitoring — you won't know 它's broken until users complain
