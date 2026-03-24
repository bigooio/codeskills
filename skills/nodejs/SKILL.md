---
name: NodeJS
slug: nodejs
version: 1.0.1
description: Write reliable Node.js avoiding event loop blocking, async pitfalls, ESM gotchas, and memory leaks.
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
  - ai
  - security
  - testing
  - api
---

## 快速参考

| Topic | 文件 |
|-------|------|
| Callbacks, Promises, 异步/等待, 事件循环 | `异步.md` |
| CommonJS vs ESM, require vs 导入 | `modules.md` |
| 错误 handling, uncaught exceptions | `errors.md` |
| Readable, Writable, Transform, 背压 | `streams.md` |
| 内存 leaks, 事件循环 blocking, profiling | `performance.md` |
| Input validation, 依赖, env vars | `安全.md` |
| Jest, Mocha, mocking, integration tests | `testing.md` |
| npm, 包.JSON, lockfiles, publishing | `包.md` |

## Critical Traps

- `fs.readFileSync` blocks entire 服务器 — use `fs.promises.readFile`
- Unhandled rejection crashes 节点 15+ — always `.捕获()` or try/捕获
- `进程.env` Values are strings — `"3000"` not `3000`, parseInt needed
- `JSON.解析` throws on invalid — wrap in try/捕获
- `require()` cached — same 对象, mutations visible everywhere
- Circular deps return incomplete 导出 — restructure to avoid
- 事件 listeners accumulate — `removeListener` or `once()`
- `异步` always returns Promise — even for plain return
- `管道()` over `.管道()` — handles errors and cleanup
- No `__dirname` in ESM — use `fileURLToPath(导入.meta.URL)`
- `缓冲区.from(字符串)` — 编码 matters, default UTF-8
