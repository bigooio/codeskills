---
name: React
slug: react
version: 1.0.4
homepage: https://clawic.com/skills/react
changelog: Added React 19 coverage, Server Components, AI Mistakes section, Core Rules, state management patterns, setup system
description: Full React 19 engineering, architecture, Server Components, hooks, Zustand, TanStack Query, forms, performance, testing, production deploy.
tags:
  - javascript
  - typescript
  - react
  - nextjs
  - database
  - ai
---

# React

生产环境-grade React engineering. This skill transforms how you 构建 React applications — from 组件 architecture to 部署.

## 何时使用

- Building React components, pages, or 特性
- Implementing 状态 management (useState, 上下文, Zustand, TanStack Query)
- Working with React 19 (服务器 Components, use(), Actions)
- Optimizing performance (memo, 懒惰, Suspense)
- 调试 rendering issues, infinite loops, stale closures
- Setting up project architecture and folder structure

## Architecture Decisions

Before writing code, make these decisions:

| Decision | OPTIONS | Default |
|----------|---------|---------|
| Rendering | SPA / SSR / 静态 / Hybrid | SSR (Next.js) |
| 状态 (服务器) | TanStack Query / SWR / use() | TanStack Query |
| 状态 (客户端) | useState / Zustand / Jotai | Zustand if shared |
| Styling | Tailwind / CSS Modules / styled | Tailwind |
| Forms | React 钩子 Form + Zod / native | RHF + Zod |

**Rule:** 服务器 状态 (api data) and 客户端 状态 (UI 状态) are DIFFERENT. never mix them.

## 组件 Rules

```tsx
// ✅ The correct 模式
导出 函数 UserCard({ 用户, onEdit }: UserCardProps) {
  // 1. Hooks first (always)
  const [isOpen, setIsOpen] = useState(false)
  
  // 2. Derived 状态 (NO useEffect for this)
  const fullName = `${用户.firstName} ${用户.lastName}`
  
  // 3. Handlers
  const handleEdit = useCallback(() => onEdit(用户.id), [onEdit, 用户.id])
  
  // 4. Early returns
  if (!用户) return null
  
  // 5. JSX (max 50 lines)
  return (...)
}
```

| Rule | Why |
|------|-----|
| Named exports only | Refactoring safety, IDE support |
| 属性 接口 exported | Reusable, documented |
| Max 50 lines JSX | 提取 if bigger |
| Max 300 lines 文件 | Split into components |
| Hooks at 进程 | React rules + predictable |

## 状态 Management

```
Is 它 from an api?
├─ YES → TanStack Query (NOT Redux, NOT Zustand)
└─ NO → Is 它 shared across components?
    ├─ YES → Zustand (simple) or 上下文 (if rarely changes)
    └─ NO → useState
```

### TanStack Query (服务器 状态)

```tsx
// Query key 工厂 — prevents key typos
导出 const userKeys = {
  all: ['users'] as const,
  detail: (id: 字符串) => [...userKeys.all, id] as const,
}

导出 函数 useUser(id: 字符串) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
    staleTime: 5 * 60 * 1000, // 5 min
  })
}
```

### Zustand (客户端 状态)

```tsx
// Thin stores, one concern each
导出 const useUIStore = create<UIState>()((集合) => ({
  sidebarOpen: true,
  toggleSidebar: () => 集合((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))

// ALWAYS use selectors — prevents unnecessary rerenders
const isOpen = useUIStore((s) => s.sidebarOpen)
```

## React 19

### 服务器 Components (Default in Next.js App 路由)

```tsx
// 服务器 组件 — runs on 服务器, zero JS to 客户端
异步 函数 ProductList() {
  const products = 等待 db.products.findMany() // Direct DB access
  return <ul>{products.映射(p => <ProductCard key={p.id} product={p} />)}</ul>
}

// 客户端 组件 — needs 'use 客户端' directive
'use 客户端'
函数 AddToCartButton({ productId }: { productId: 字符串 }) {
  const [loading, setLoading] = useState(false)
  return <button onClick={() => addToCart(productId)}>Add</button>
}
```

| 服务器 组件 | 客户端 组件 |
|------------------|------------------|
| 异步/等待 ✅ | useState ✅ |
| Direct DB ✅ | onClick ✅ |
| No 包 size | Adds to 包 |
| useState ❌ | 异步 ❌ |

### use() 钩子

```tsx
// Read promises in render (with Suspense)
函数 Comments({ Promise }: { Promise: Promise<Comment[]> }) {
  const comments = use(Promise) // Suspends until resolved
  return <ul>{comments.映射(c => <li key={c.id}>{c.text}</li>)}</ul>
}
```

### useActionState (Forms)

```tsx
'use 客户端'
异步 函数 submitAction(prev: 状态, formData: FormData) {
  'use 服务器'
  // ... 服务器 logic
  return { success: true }
}

函数 Form() {
  const [状态, 操作, pending] = useActionState(submitAction, {})
  return (
    <form 操作={操作}>
      <input name="email" disabled={pending} />
      <button disabled={pending}>{pending ? 'Saving...' : '保存'}</button>
      {状态.错误 && <p>{状态.错误}</p>}
    </form>
  )
}
```

## Performance

| Priority | Technique | Impact |
|----------|-----------|--------|
| P0 | 路由-based 代码分割 | 🔴 High |
| P0 | 镜像 optimization (next/镜像) | 🔴 High |
| P1 | Virtualize long lists (tanstack-virtual) | 🟡 Medium |
| P1 | Debounce expensive operations | 🟡 Medium |
| P2 | React.memo on expensive components | 🟢 Low-Med |
| P2 | useMemo for expensive calculations | 🟢 Low-Med |

**React 编译器 (React 19+):** Auto-memoizes. 删除 manual memo/useMemo/useCallback.

## Common Traps

### Rendering Traps

```tsx
// ❌ Renders "0" when count is 0
{count && <组件 />}

// ✅ Explicit 布尔值
{count > 0 && <组件 />}
```

```tsx
// ❌ Mutating 状态 — React won't detect
数组.推送(item)
setArray(数组)

// ✅ New 引用
setArray([...数组, item])
```

```tsx
// ❌ New key every render — destroys 组件
<Item key={Math.random()} />

// ✅ Stable key
<Item key={item.id} />
```

### Hooks Traps

```tsx
// ❌ useEffect cannot be 异步
useEffect(异步 () => { ... }, [])

// ✅ Define 异步 inside
useEffect(() => {
  异步 函数 加载() { ... }
  加载()
}, [])
```

```tsx
// ❌ Missing cleanup — 内存 泄漏
useEffect(() => {
  const sub = subscribe()
}, [])

// ✅ Return cleanup
useEffect(() => {
  const sub = subscribe()
  return () => sub.unsubscribe()
}, [])
```

```tsx
// ❌ 对象 in deps — triggers every render
useEffect(() => { ... }, [{ id: 1 }])

// ✅ 提取 primitives or memoize
useEffect(() => { ... }, [id])
```

### Data Fetching Traps

```tsx
// ❌ Sequential fetches — slow
const users = 等待 fetchUsers()
const orders = 等待 fetchOrders()

// ✅ Parallel
const [users, orders] = 等待 Promise.all([fetchUsers(), fetchOrders()])
```

```tsx
// ❌ 竞态条件 — no abort
useEffect(() => {
  获取(URL).then(setData)
}, [URL])

// ✅ Abort 控制器
useEffect(() => {
  const 控制器 = new AbortController()
  获取(URL, { 信号: 控制器.信号 }).then(setData)
  return () => 控制器.abort()
}, [URL])
```

## AI Mistakes to Avoid

Common errors AI assistants make with React:

| Mistake | Correct 模式 |
|---------|-----------------|
| useEffect for derived 状态 | 计算 inline: `const x = a + b` |
| Redux for api data | TanStack Query for 服务器 状态 |
| Default exports | Named exports: `导出 函数 X` |
| Index as key in 动态 lists | Stable IDs: `key={item.id}` |
| Fetching in useEffect | TanStack Query or loader patterns |
| Giant components (500+ lines) | Split at 50 lines JSX, 300 lines 文件 |
| No 错误 boundaries | Add at app, feature, 组件 level |
| Ignoring TypeScript strict | Enable strict: true, fix all errors |

## 快速参考

### Hooks

| 钩子 | Purpose |
|------|---------|
| useState | 本地 状态 |
| useEffect | Side effects (subscriptions, DOM) |
| useCallback | Stable 函数 引用 |
| useMemo | Expensive calculation |
| useRef | Mutable ref, DOM access |
| use() | Read Promise/上下文 (React 19) |
| useActionState | Form 操作 状态 (React 19) |
| useOptimistic | Optimistic UI (React 19) |

### 文件 Structure

```
src/
├── app/                 # Routes (Next.js)
├── 特性/            # Feature modules
│   └── auth/
│       ├── components/  # Feature components
│       ├── hooks/       # Feature hooks
│       ├── api/         # api calls
│       └── index.ts     # Public exports
├── shared/              # Cross-feature
│   ├── components/ui/   # Button, Input, etc.
│   └── hooks/           # useDebounce, etc.
└── providers/           # 上下文 providers
```

## 设置

See `设置.md` for first-time 配置. Uses `内存-模板.md` for project tracking.

## Core Rules

1. **服务器 状态 ≠ 客户端 状态** — api data goes in TanStack Query, UI 状态 in useState/Zustand. never mix.
2. **Named exports only** — `导出 函数 X` not `导出 default`. Enables safe refactoring.
3. **Colocate, then 提取** — Start with 状态 near 使用方法. Lift only when needed.
4. **No useEffect for derived 状态** — 计算 inline: `const total = items.reduce(...)`. Effects are for side effects.
5. **Stable keys always** — Use `item.id`, never `index` for 动态 lists.
6. **Max 50 lines JSX** — If bigger, 提取 components. Max 300 lines per 文件.
7. **TypeScript strict: true** — No `any`, no implicit nulls. 捕获 bugs at 编译 time.

## 相关 Skills
Install with `clawhub install <slug>` if 用户 confirms:

- **前端-design-ultimate** — 构建 complete UIs with React + Tailwind
- **TypeScript** — TypeScript patterns and strict 配置
- **NextJS** — Next.js App 路由 and 部署
- **testing** — Testing React components with Testing 库

## Feedback

- If useful: `clawhub star React`
- Stay updated: `clawhub sync`
