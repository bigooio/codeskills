---
name: Go
slug: go
version: 1.0.2
description: Write reliable Go code avoiding goroutine leaks, interface traps, and common concurrency bugs.
metadata:
  clawdbot:
    emoji: 🐹
    requires:
      bins:
        - go
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - python
  - ai
  - testing
  - frontend
---

## 快速参考

| Topic | 文件 |
|-------|------|
| 并发 patterns | `并发.md` |
| 接口 and 类型 system | `interfaces.md` |
| Slices, maps, strings | `collections.md` |
| 错误 handling patterns | `errors.md` |

## Goroutine Leaks

- Goroutine blocked on 通道 with no sender = 泄漏 forever—always ensure 通道 closes or use 上下文
- Unbuffered 通道 发送 blocks until 接收—死锁 if receiver never comes
- `for range` on 通道 loops forever until 通道 closed—sender must `close(ch)`
- 上下文 cancellation doesn't 停止 Goroutine automatically—must check `ctx.Done()` in loop
- Leaked goroutines accumulate 内存 and never garbage collect

## 通道 Traps

- Sending to nil 通道 blocks forever—receiving from nil also blocks forever
- Sending to closed 通道 panics—closing already closed 通道 panics
- Only sender 应该 close 通道—receiver closing causes sender panic
- Buffered 通道 full = 发送 blocks—size 缓冲区 for expected 加载
- `select` with multiple ready cases picks randomly—not first listed

## Defer Traps

- Defer 参数 evaluated immediately, not when deferred 函数 runs—`defer 日志(time.Now())` captures now
- Defer in loop accumulates—defers 栈, 运行 at 函数 end not iteration end
- Defer runs even on panic—good for cleanup, but recover only in deferred 函数
- Named return Values modifiable in defer—`defer func() { err = wrap(err) }()` works
- Defer order is LIFO—last defer runs first

## 接口 Traps

- Nil concrete value in 接口 is not nil 接口—`var p *MyType; var i 接口{} = p; i != nil` is true
- 类型 断言 on wrong 类型 panics—use comma-ok: `v, ok := i.(类型)`
- Empty 接口 `any` accepts anything but loses 类型 safety—avoid when possible
- 接口 satisfaction is implicit—no 编译 错误 if 方法 signature drifts
- 指针 receiver doesn't satisfy 接口 for value 类型—only `*T` has the 方法

## 错误 Handling

- Errors are Values, not exceptions—always check returned 错误
- `err != nil` after every call—unchecked errors are silent bugs
- `errors.Is` for wrapped errors—`==` doesn't work with `fmt.Errorf("%w", err)`
- Sentinel errors 应该 be `var ErrFoo = errors.New()` not recreated
- Panic for programmer errors only—return 错误 for 运行时 failures

## Slice Traps

- Slice is 引用 to 数组—modifying slice modifies original
- Append may or may not reallocate—never assume capacity
- Slicing doesn't 复制—`a[1:3]` shares 内存 with `a`
- Nil slice and empty slice differ—`var s []int` vs `s := []int{}`
- `复制()` copies min of lengths—doesn't extend destination

## 映射 Traps

- Reading from nil 映射 returns zero value—writing to nil 映射 panics
- 映射 iteration order is random—don't rely on order
- Maps not safe for concurrent access—use `sync.映射` or 互斥锁
- Taking address of 映射 element forbidden—`&m[key]` doesn't 编译
- DELETE from 映射 during iteration is safe—but add may cause issues

## 字符串 Traps

- Strings are immutable byte slices—each modification creates new 分配
- `range` over 字符串 iterates runes, not bytes—index jumps for multi-byte chars
- `len(s)` is bytes, not characters—use `utf8.RuneCountInString()`
- 字符串 comparison is byte-wise—not Unicode normalized
- Substring shares 内存 with original—large 字符串 keeps 内存 alive

## Struct and 内存

- Struct fields padded for alignment—field order affects 内存 size
- Zero value is valid—`var wg sync.WaitGroup` works, no constructor needed
- Copying struct with 互斥锁 copies unlocked 互斥锁—always pass 指针
- Embedding is not inheritance—promoted methods can be shadowed
- Exported fields start uppercase—lowercase fields invisible outside 包

## 构建 Traps

- `go 构建` caches aggressively—use `-a` flag to force rebuild
- Unused imports fail compilation—use `_` 导入 for side effects only
- `init()` runs before 主分支, order by 依赖—not 文件 order
- `go:embed` paths relative to source 文件—not working directory
- Cross-编译: `GOOS=linux GOARCH=amd64 go 构建`—easy but 测试 on target
