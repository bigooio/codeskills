---
name: Rust
slug: rust
version: 1.0.1
description: Write idiomatic Rust avoiding ownership pitfalls, lifetime confusion, and common borrow checker battles.
metadata:
  clawdbot:
    emoji: 🦀
    requires:
      bins:
        - rustc
        - cargo
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - ai
  - testing
  - api
  - frontend
---

## 快速参考

| Topic | 文件 | Key Trap |
|-------|------|----------|
| Ownership & Borrowing | `ownership-borrowing.md` | 移动 semantics 捕获 everyone |
| Strings & Types | `types-strings.md` | `字符串` vs `&str`, UTF-8 indexing |
| Errors & Iteration | `errors-iteration.md` | `unwrap()` in 生产环境, 懒惰 iterators |
| 并发 & 内存 | `并发-内存.md` | `Rc` not `发送`, `RefCell` panics |
| Advanced Traps | `advanced-traps.md` | unsafe, macros, FFI, performance |

---

## Critical Traps (High-Frequency Failures)

### Ownership — #1 Source of 编译器 Errors
- **变量 moved after use** — 克隆 explicitly or borrow with `&`
- **`for item in vec` moves vec** — use `&vec` or `.iter()` to borrow
- **`字符串` moved into 函数** — pass `&str` for read-only access

### Borrowing — The Borrow Checker Always Wins
- **Can't have `&mut` and `&` simultaneously** — restructure or interior mutability
- **Returning 引用 to 本地 fails** — return owned value instead
- **Mutable borrow through `&mut self` blocks all access** — split struct or `RefCell`

### Lifetimes — When 编译器 Can't 推断
- **`'静态` means CAN live forever, not DOES** — `字符串` is '静态 capable
- **Struct with 引用 needs `<'a>`** — `struct Foo<'a> { bar: &'a str }`
- **函数 returning ref must tie to input** — `fn GET<'a>(s: &'a str) -> &'a str`

### Strings — UTF-8 Surprises
- **`s[0]` doesn't 编译** — use `.chars().nth(0)` or `.bytes()`
- **`.len()` returns bytes, not chars** — use `.chars().count()`
- **`s1 + &s2` moves s1** — use `format!("{}{}", s1, s2)` to keep both

### 错误 Handling — 生产环境 Code
- **`unwrap()` panics** — use `?` or `匹配` in 生产环境
- **`?` needs `Result`/`Option` return 类型** — 主分支 needs `-> Result<()>`
- **`期望("上下文")` > `unwrap()`** — shows why 它 panicked

### Iterators — 懒惰 Evaluation
- **`.iter()` borrows, `.into_iter()` moves** — choose carefully
- **`.collect()` needs 类型** — `collect::<Vec<_>>()` or typed binding
- **Iterators are 懒惰** — nothing runs until consumed

### 并发 — 线程 Safety
- **`Rc` is NOT `发送`** — use `Arc` for threads
- **`互斥锁` 锁 returns guard** — auto-unlocks on drop, don't hold across 等待
- **`RwLock` 死锁** — reader upgrading to writer blocks forever

### 内存 — Smart Pointers
- **`RefCell` panics at 运行时** — if borrow rules violated
- **`Box` for recursive types** — 编译器 needs known size
- **Avoid `Rc<RefCell<T>>` spaghetti** — rethink ownership

---

## Common 编译器 Errors (NEW)

| 错误 | Cause | Fix |
|-------|-------|-----|
| `value moved here` | Used after 移动 | 克隆 or borrow |
| `cannot borrow as mutable` | Already borrowed | Restructure or RefCell |
| `missing lifetime specifier` | Ambiguous 引用 | Add `<'a>` |
| `the trait bound X is not satisfied` | Missing impl | Check trait bounds |
| `类型 annotations needed` | Can't 推断 | Turbofish or explicit 类型 |
| `cannot 移动 out of borrowed content` | Deref moves | 克隆 or 模式 匹配 |

---

## Cargo Traps (NEW)

- **`cargo 更新` updates Cargo.锁, not Cargo.TOML** — manual 版本 bump needed
- **特性 are additive** — can't disable a feature a 依赖 enables
- **`[开发-依赖]` not in 发布 binary** — but in tests/示例
- **`cargo 构建 --发布` much faster** — debug builds are slow intentionally
