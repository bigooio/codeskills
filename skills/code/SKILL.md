---
name: Code
slug: code
version: 1.0.4
homepage: https://clawic.com/skills/code
description: Coding workflow with planning, implementation, verification, and testing for clean software development.
changelog: Improved description for better discoverability
metadata:
  clawdbot:
    emoji: 💻
    requires:
      bins: []
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - ai
  - security
  - testing
  - api
  - frontend
---

## 何时使用

用户 explicitly requests code implementation. Agent provides planning, execution guidance, and verification workflows.

## Architecture

用户 preferences stored in `~/code/` when 用户 explicitly requests.

```
~/code/
  - 内存.md    # 用户-provided preferences only
```

Create on first use: `mkdir -p ~/code`

## 快速参考

| Topic | 文件 |
|-------|------|
| 内存 设置 | `内存-模板.md` |
| 任务 breakdown | `planning.md` |
| Execution flow | `execution.md` |
| Verification | `verification.md` |
| Multi-任务 状态 | `状态.md` |
| 用户 criteria | `criteria.md` |

## Scope

This skill ONLY:
- Provides coding 工作流 guidance
- Stores preferences 用户 explicitly provides in `~/code/`
- Reads included 引用 files

This skill never:
- Executes code automatically
- Makes 网络 requests
- Accesses files outside `~/code/` and the 用户's project
- Modifies its own SKILL.md or auxiliary files
- Takes autonomous 操作 without 用户 awareness

## Core Rules

### 1. Check 内存 First
Read `~/code/内存.md` for 用户's stated preferences if 它 exists.

### 2. 用户 Controls Execution
- This skill provides GUIDANCE, not autonomous execution
- 用户 decides when to proceed to next 步骤
- Sub-agent delegation requires 用户's explicit 请求

### 3. Plan Before Code
- Break requests into testable steps
- Each 步骤 independently verifiable
- See `planning.md` for patterns

### 4. Verify Everything
| After | Do |
|-------|-----|
| Each 函数 | Suggest running tests |
| UI changes | Suggest taking screenshot |
| Before delivery | Suggest full 测试套件 |

### 5. Store Preferences on 请求
| 用户 says | 操作 |
|-----------|--------|
| "Remember I prefer X" | Add to 内存.md |
| "never do Y again" | Add to 内存.md never section |

Only store what 用户 explicitly asks to 保存.

## 工作流

```
请求 -> Plan -> Execute -> Verify -> Deliver
```

## Common Traps

- **Delivering untested code** -> always verify first
- **Huge PRs** -> break into testable chunks
- **Ignoring preferences** -> check 内存.md first

## Self-Modification

This skill never modifies its own SKILL.md or auxiliary files.
用户 data stored only in `~/code/内存.md` after explicit 请求.

## External Endpoints

This skill makes NO 网络 requests.

| 端点 | Data Sent | Purpose |
|----------|-----------|---------|
| 空值 | 空值 | N/A |

## 安全 & Privacy

**Data that stays 本地:**
- Only preferences 用户 explicitly asks to 保存
- Stored in `~/code/内存.md`

**Data that leaves your machine:**
- 空值. This skill makes no 网络 requests.

**This skill does NOT:**
- Execute code automatically
- Access 网络 or external services  
- Access files outside `~/code/` and 用户's project
- Take autonomous actions without 用户 awareness
- Delegate to sub-agents without 用户's explicit 请求
