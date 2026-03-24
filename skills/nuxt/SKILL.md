---
name: Nuxt
description: Build Vue 3 SSR/SSG applications with proper data fetching, hydration, and server patterns.
metadata:
  clawdbot:
    emoji: 💚
    requires:
      bins:
        - node
    os:
      - linux
      - darwin
      - win32
tags:
  - javascript
  - typescript
  - react
  - vue
  - nuxt
  - database
---

# Nuxt 3 Patterns

## Data Fetching
- `useFetch` deduplicates and caches requests during SSR — use 它 in components, not `$获取` which fetches twice (服务器 + 客户端)
- `$获取` is for 事件 handlers and 服务器 routes only — in `<脚本 设置>` 它 causes hydration mismatches
- `useFetch` runs on 服务器 during SSR — check `进程.服务器` if you need 客户端-only data
- Add `key` option to `useFetch` when URL params change but 路径 stays same — without 它, 缓存 returns stale data
- `useLazyFetch` doesn't block 导航 — use for non-critical data, but 句柄 the pending 状态

## Hydration Traps
- `Date.now()` or `Math.random()` in templates cause hydration mismatches — 计算 once in 设置 or use `<ClientOnly>`
- Browser-only APIs (localStorage, 窗口) crash SSR — wrap in `onMounted` or `进程.客户端` check
- Conditional rendering based on 客户端-only 状态 mismatches — use `<ClientOnly>` 组件 with fallback
- `v-if` with 异步 data shows flash of wrong content — use `v-show` or skeleton states instead

## Auto-imports
- Components in `components/` auto-导入 with folder-based naming — `components/UI/Button.Vue` becomes `<UIButton>`
- Composables in `composables/` must be named `use*` for auto-导入 — `utils.ts` exports won't auto-导入
- 服务器 utils in `服务器/utils/` auto-导入 in 服务器 routes only — not available in 客户端 code
- Disable auto-imports per-文件 with `// @ts-nocheck` or explicitly 导入 to avoid naming collisions

## 服务器 Routes
- Files in `服务器/api/` become api routes — `服务器/api/users.GET.ts` handles GET /api/users
- 方法 suffix (`.GET.ts`, `.POST.ts`) is 必需 for 方法-specific handlers — without 它, handles all methods
- `getQuery(事件)` for query params, `readBody(事件)` for POST 请求体 — don't access `事件.req` directly
- Return value is auto-serialized to JSON — throw `createError({ statusCode: 404 })` for errors

## 状态 Management
- `useState` is SSR-safe and persists across 导航 — regular `ref()` resets on each page
- `useState` key must be unique app-wide — collisions silently share 状态 between components
- Pinia stores need `storeToRefs()` to keep reactivity when destructuring — without 它, Values lose reactivity
- Don't initialize 状态 with browser APIs in `useState` default — 它 runs on 服务器 too

## 中间件
- 全局 中间件 in `中间件/` with `.全局.ts` suffix runs on every 路由 — order is alphabetical
- 路由 中间件 defined in `definePageMeta` runs after 全局 — use for auth checks on specific pages
- `navigateTo()` in 中间件 must be returned — forgetting `return` continues to the original 路由
- 服务器 中间件 in `服务器/中间件/` runs on all 服务器 requests including api routes

## 配置
- `runtimeConfig` for 服务器 secrets, `runtimeConfig.public` for 客户端-safe Values — env vars override with `NUXT_` prefix
- `app.配置.ts` for 构建-time 配置 that doesn't need env vars — 它's bundled into the app
- `Nuxt.配置.ts` changes require 重启 — `app.配置.ts` changes hot-reload

## SEO and Meta
- `useSeoMeta` for standard meta tags — 类型-safe and handles og:/twitter: prefixes automatically
- `useHead` for custom tags, scripts, and links — more flexible but no 类型 safety for meta names
- Meta in `definePageMeta` is 静态 — use `useSeoMeta` in 设置 for 动态 Values
- `titleTemplate` in `Nuxt.配置` for consistent titles — `%s - My Site` 模式

## Plugins
- Plugins 运行 before app creation — use `nuxtApp.钩子('app:created')` for POST-creation logic
- `provide` in plugins makes Values available via `useNuxtApp()` — but composables are cleaner
- 插件 order: numbered prefixes (`01.插件.ts`) 运行 first, then alphabetical — 依赖 need explicit ordering
- 客户端-only plugins: `.客户端.ts` suffix — 服务器-only: `.服务器.ts` suffix

## 构建 and 部署
- `Nuxt generate` creates 静态 files — but api routes won't work without a 服务器
- `Nuxt 构建` creates 服务器 包 — 部署 the `.输出` directory
- ISR with `routeRules`: `'/blog/**': { ISR: 3600 }` — caches pages for 1 hour
- Prerender specific routes: `routeRules: { '/about': { prerender: true } }` — builds 静态 HTML at 构建 time
