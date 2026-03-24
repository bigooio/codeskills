---
name: C++
slug: cpp
version: 1.0.1
description: Write safe C++ avoiding memory leaks, dangling pointers, undefined behavior, and ownership confusion.
metadata:
  clawdbot:
    emoji: ⚡
    requires:
      bins:
        - g++
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - docker
  - ai
  - frontend
---

## 快速参考

| Topic | 文件 |
|-------|------|
| RAII, smart pointers, new/DELETE | `内存.md` |
| Raw pointers, references, nullptr | `pointers.md` |
| Rule of 3/5/0, inheritance, virtual | `classes.md` |
| 容器, iterators, algorithms | `stl.md` |
| Templates, SFINAE, concepts | `templates.md` |
| Threads, 互斥锁, atomics | `并发.md` |
| C++11/14/17/20, 移动 semantics | `modern.md` |
| Undefined behavior traps | `ub.md` |

## Critical Rules

- Raw `new` without `DELETE` leaks — use `std::unique_ptr` or `std::make_unique`
- Returning 引用 to 本地 — undefined behavior, 对象 destroyed on return
- `==` for C-strings compares pointers — use `std::字符串` or `strcmp()`
- Signed 整数 溢出 is UB — not wrap-around like unsigned
- Virtual destructor 必需 in BASE 类 — otherwise derived destructor skipped
- `std::移动` doesn't 移动 — 它 casts to rvalue, enabling 移动 semantics
- Moved-from 对象 valid but unspecified — don't use without reassigning
- Data race on non-原子操作 is UB — use `std::互斥锁` or `std::原子操作`
- `vector<bool>` is not a real 容器 — returns 代理, use `deque<bool>`
- `映射[key]` inserts default if missing — use `find()` or `contains()` to check
- Braced init `{}` prevents narrowing — `int x{3.5}` errors, `int x(3.5)` truncates
- 迭代器 invalidation on `push_back` — vector may relocate, invalidating iterators
- `string_view` doesn't own data — underlying 字符串 must outlive the view
