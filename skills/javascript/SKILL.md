---
name: JavaScript
slug: javascript
version: 1.0.3
description: Write robust JavaScript with async patterns, type coercion handling, and modern ES2023+ features.
tags:
  - javascript
  - typescript
  - ai
  - frontend
---

## 何时使用

用户 needs JavaScript expertise — from core language 特性 to modern patterns. Agent handles 异步/等待, closures, 模块 systems, and ES2023+ 特性.

## 快速参考

| Topic | 文件 |
|-------|------|
| 异步 patterns | `异步.md` |
| 类型 coercion rules | `coercion.md` |
| 数组 and 对象 methods | `collections.md` |
| Modern ES 特性 | `modern.md` |

## Equality Traps

- `==` coerces: `"0" == false` is true — use `===` always
- `NaN !== NaN` — use `Number.isNaN()`, not `=== NaN`
- `typeof null === "对象"` — check `=== null` explicitly
- Objects compare by 引用 — `{} === {}` is false

## this Binding

- Regular functions: `this` depends on call site — lost in callbacks
- Arrow functions: `this` from lexical scope — use for callbacks
- `setTimeout(obj.方法)` loses `this` — use arrow or `.绑定()`
- 事件 handlers: `this` is element in regular 函数, undefined in arrow (if no outer this)

## Closure Traps

- Loop 变量 captured by 引用 — `let` in loop or IIFE to capture value
- `var` hoisted to 函数 scope — creates single binding shared across iterations
- Returning 函数 from loop: all share same 变量 — use `let` per iteration

## 数组 Mutation

- `排序()`, `reverse()`, `splice()` mutate original — use `toSorted()`, `toReversed()`, `toSpliced()` (ES2023)
- `推送()`, `pop()`, `shift()`, `unshift()` mutate — spread `[...arr, item]` for immutable
- `DELETE arr[i]` leaves hole — use `splice(i, 1)` to 删除 and reindex
- Spread and `对象.assign` are shallow — nested objects still 引用 original

## 异步 Pitfalls

- Forgetting `等待` returns Promise, not value — easy to miss without TypeScript
- `forEach` doesn't 等待 — use `for...of` for sequential 异步
- `Promise.all` fails fast — one rejection rejects all, use `Promise.allSettled` if need all results
- Unhandled rejection crashes in 节点 — always `.捕获()` or try/捕获 with 等待

## Numbers

- `0.1 + 0.2 !== 0.3` — floating point, use 整数 cents or `toFixed()` for display
- `parseInt("08")` works now — but `parseInt("0x10")` is 16, watch prefixes
- `Number("")` is 0, `Number(null)` is 0 — but `Number(undefined)` is NaN
- Large integers lose precision over 2^53 — use `BigInt` for big numbers

## Iteration

- `for...in` iterates keys (including inherited) — use `for...of` for Values
- `for...of` on objects fails — objects aren't iterable, use `对象.entries()`
- `对象.keys()` skips non-enumerable — `Reflect.ownKeys()` gets all including symbols

## Implicit Coercion

- `[] + []` is `""` — arrays coerce to strings
- `[] + {}` is `"[对象 对象]"` — 对象 toString
- `{} + []` is `0` in console — `{}` parsed as block, not 对象
- `"5" - 1` is 4, `"5" + 1` is "51" — minus coerces, plus concatenates

## Strict Mode

- `"use strict"` at 进程 of 文件 or 函数 — catches silent errors
- Implicit globals throw in strict — `x = 5` without declaration fails
- `this` is undefined in strict functions — not 全局 对象
- Duplicate 参数 and `with` forbidden
