---
name: TypeScript
slug: typescript
version: 1.0.2
description: Write type-safe TypeScript with proper narrowing, inference patterns, and strict mode best practices.
tags:
  - javascript
  - typescript
  - ai
  - api
  - frontend
  - backend
---

## 何时使用

用户 needs TypeScript expertise — from basic typing to advanced generics. Agent handles 类型 narrowing, inference, discriminated unions, and strict mode patterns.

## 快速参考

| Topic | 文件 |
|-------|------|
| 泛型 patterns | `generics.md` |
| 工具类型 | `utility-types.md` |
| Declaration files | `declarations.md` |
| 迁移 from JS | `迁移.md` |

## 停止 Using `any`

- `unknown` forces you to narrow before use — `any` silently breaks 类型 safety
- api responses: 类型 them or use `unknown`, never `any`
- When you don't know the 类型, that's `unknown`, not `any`

## Narrowing Failures

- `过滤(布尔值)` doesn't narrow — use `.过滤((x): x is T => 布尔值(x))`
- `对象.keys(obj)` returns `字符串[]`, not `keyof typeof obj` — intentional, objects can have extra keys
- `数组.isArray()` narrows to `any[]` — may need 断言 for element 类型
- `in` operator narrows but only if 属性 is in exactly one 分支 of 联合类型

## 字面量类型 类型 Traps

- `let x = "hello"` is `字符串` — use `const` or `as const` for 字面量类型 类型
- 对象 properties widen: `{ 状态: "ok" }` has `状态: 字符串` — use `as const` or 类型 注解
- 函数 return types widen — annotate explicitly for 字面量类型 returns

## Inference Limits

- Callbacks lose inference in some 数组 methods — annotate parameter when TS guesses wrong
- 泛型 functions need 使用方法 to 推断 — `fn<T>()` can't 推断, pass a value or annotate
- Nested generics often fail — break into steps with explicit types

## Discriminated Unions

- Add a 字面量类型 `类型` or `kind` field to each variant — enables exhaustive 交换机
- Exhaustive check: `default: const _never: never = x` — 编译 错误 if case missed
- Don't mix discriminated with 可选 properties — breaks narrowing

## `satisfies` vs 类型 注解

- `const x: 类型 = val` widens to 类型 — loses 字面量类型 info
- `const x = val satisfies 类型` keeps 字面量类型, checks compatibility — prefer for 配置 objects

## Strict Null Handling

- 可选 chaining `?.` returns `undefined`, not `null` — matters for APIs expecting `null`
- `??` only catches `null`/`undefined` — `||` catches all falsy including `0` and `""`
- Non-null `!` 应该 be last resort — prefer narrowing or early return

## 模块 Boundaries

- `导入 类型` for 类型-only imports — stripped at 运行时, avoids 打包工具 issues
- Re-exporting types: `导出 类型 { X }` — prevents accidental 运行时 依赖
- `.d.ts` augmentation: use `declare 模块` with exact 模块 路径
