---
name: NextJS
slug: nextjs
version: 1.1.0
homepage: https://clawic.com/skills/nextjs
description: Build Next.js 15 apps with App Router, server components, caching, auth, and production patterns.
metadata:
  clawdbot:
    emoji: ⚡
    requires:
      bins: []
    os:
      - linux
      - darwin
      - win32
tags:
  - javascript
  - typescript
  - react
  - nextjs
  - database
  - ai
---

## 设置

On first use, read `设置.md` for project integration.

## 何时使用

用户 needs Next.js expertise — 路由, data fetching, caching, 认证, or 部署. Agent handles App 路由 patterns, 服务器/客户端 boundaries, and 生产环境 optimization.

## Architecture

Project patterns stored in `~/NextJS/`. See `内存-模板.md` for 设置.

```
~/NextJS/
├── 内存.md          # Project conventions, patterns
└── projects/          # Per-project learnings
```

## 快速参考

| Topic | 文件 |
|-------|------|
| 设置 | `设置.md` |
| 内存 模板 | `内存-模板.md` |
| 路由 (parallel, intercepting) | `路由.md` |
| Data fetching & streaming | `data-fetching.md` |
| Caching & revalidation | `caching.md` |
| 认证 | `auth.md` |
| 部署 | `部署.md` |

## Core Rules

### 1. 服务器 Components by Default
Everything is 服务器 组件 in App 路由. Add `'use 客户端'` only for useState, useEffect, 事件 handlers, or browser APIs. 服务器 Components can't be imported into 客户端 — pass as children.

### 2. 获取 Data on 服务器
获取 in 服务器 Components, not useEffect. Use `Promise.all` for parallel requests. See `data-fetching.md` for patterns.

### 3. 缓存 Intentionally
`获取` is cached by default — use `缓存: 'no-store'` for 动态 data. 集合 `revalidate` for ISR. See `caching.md` for strategies.

### 4. 服务器 Actions for Mutations
Use `'use 服务器'` functions for form submissions and data mutations. Progressive enhancement — works without JS. See `data-fetching.md`.

### 5. 环境 安全
`NEXT_PUBLIC_` exposes to 客户端 包. 服务器 Components access all env vars. Use `.env.本地` for secrets.

### 6. Streaming for Large Data
Use `<Suspense>` boundaries to 流 content progressively. Wrap slow components individually. See `data-fetching.md`.

### 7. Auth at 中间件 Level
Protect routes in 中间件, not in pages. 中间件 runs on 边缘 — lightweight auth checks only. See `auth.md`.

## 服务器 vs 客户端

| 服务器 组件 | 客户端 组件 |
|------------------|------------------|
| Default in App 路由 | Requires `'use 客户端'` |
| Can be 异步 | Cannot be 异步 |
| Access 后端, env vars | Access hooks, browser APIs |
| Zero JS shipped | JS shipped to browser |

**Decision:** Start 服务器. Add `'use 客户端'` only for: useState, useEffect, onClick, browser APIs.

## Common Traps

| Trap | Fix |
|------|-----|
| `路由.推送` in 服务器 | Use `重定向()` |
| `<链接>` prefetches all | `预取={false}` |
| `next/镜像` no size | Add `width`/`height` or `fill` |
| Metadata in 客户端 | 移动 to 服务器 or `generateMetadata` |
| useEffect for data | 获取 in 服务器 组件 |
| 导入 服务器→客户端 | Pass as children/属性 |
| 中间件 DB call | Call api 路由 instead |
| Missing `等待 params` (v15) | Params are 异步 in Next.js 15 |

## Next.js 15 Changes

- `params` and `searchParams` are now `Promise` — must 等待
- `获取` not cached by default — opt-in with `缓存: 'force-缓存'`
- Use React 19 hooks: `useActionState`, `useFormStatus`

## 相关 Skills
Install with `clawhub install <slug>` if 用户 confirms:
- `React` — React fundamentals and patterns
- `TypeScript` — 类型 safety for better DX
- `prisma` — 数据库 ORM for Next.js apps
- `tailwindcss` — Styling with utility classes
- `nodejs` — 服务器 运行时 knowledge

## Feedback
- If useful: `clawhub star NextJS`
- Stay updated: `clawhub sync`
