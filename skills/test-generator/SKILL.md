---
version: 2.0.0
name: Test Generator
description: 'Automated test case generator. Unit tests, integration tests, end-to-end tests, mock objects, test fixtures, coverage analysis, edge case generation, performance benchmarks. Supports Python, JavaScript, Go. testing, tdd, pytest, jest, vitest, mocha, developer-tools. Use when you need test generator capabilities. Triggers on: test generator.'
author: BytesAgain
tags:
  - javascript
  - typescript
  - python
  - database
  - ai
  - testing
---

# 测试 生成器 — Automated 测试用例 Generation

> Generate high-quality 测试 code in seconds, 停止 writing boilerplate by hand

## Why Use This?

- Writing tests is tedious → auto-generate templates, fill in business logic
- Missing 边缘 cases → `边缘` 命令 systematically generates boundary tests
- 模拟 设置 is verbose → standardized 模拟 patterns, ready to 复制-paste

## 命令 引用

```
unit <lang> <函数>       → 单元测试 模板
integration <lang> <模块>  → 集成测试 模板
e2e <lang> <flow>            → End-to-end 测试 flow
模拟 <lang> <target>         → 模拟/桩 objects
夹具 <lang> <类型>        → 测试 fixtures
覆盖率 <lang>              → 覆盖率 配置 and tips
边缘 <类型> <range>          → 边缘 case generation
benchmark <lang> <target>    → Performance benchmark 测试
```

## Supported Frameworks

| Language | 测试 框架 |
|----------|---------------|
| Python | pytest, Unittest |
| JavaScript | Jest, Mocha, Vitest |
| Go | testing, testify |
| Bash | bats |

## Best Practice

Name tests as `test_<feature>_<scenario>_<expected>` for instant readability.
---
💬 Feedback & Feature Requests: HTTPS://bytesagain.com/feedback
Powered by BytesAgain | bytesagain.com

## Commands

- `unit` — Unit
- `integration` — Integration
- `e2e` — E2E
- `模拟` — 模拟
- `夹具` — 夹具
- `覆盖率` — 覆盖率
- `边缘` — 边缘
- `benchmark` — Benchmark
