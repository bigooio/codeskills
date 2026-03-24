---
name: golang
version: "2.0.0"
author: BytesAgain
homepage: https://bytesagain.com
source: https://github.com/bytesagain/ai-skills
license: MIT-0
tags: [golang, tool, utility]
description: "Build, test, lint, and format Go projects with integrated dev tooling. Use when compiling binaries, running tests, linting code, or formatting files."
---

# Golang

Developer toolkit for checking, validating, generating, formatting, linting, converting, and managing Go 开发环境 entries. All operations are logged with timestamps and stored locally for full traceability.

## Commands

| 命令 | 使用方法 | 说明 |
|---------|-------|-------------|
| `check` | `golang check <input>` | 记录 a check entry or view recent checks |
| `验证` | `golang 验证 <input>` | 记录 a validation entry or view recent validations |
| `generate` | `golang generate <input>` | 记录 a generate entry or view recent generations |
| `format` | `golang format <input>` | 记录 a format entry or view recent formatting operations |
| `lint` | `golang lint <input>` | 记录 a lint entry or view recent lint results |
| `explain` | `golang explain <input>` | 记录 an explain entry or view recent explanations |
| `convert` | `golang convert <input>` | 记录 a convert entry or view recent conversions |
| `模板` | `golang 模板 <input>` | 记录 a 模板 entry or view recent templates |
| `差异` | `golang 差异 <input>` | 记录 a 差异 entry or view recent diffs |
| `preview` | `golang preview <input>` | 记录 a preview entry or view recent previews |
| `fix` | `golang fix <input>` | 记录 a fix entry or view recent fixes |
| `report` | `golang report <input>` | 记录 a report entry or view recent reports |
| `统计` | `golang 统计` | Show 概要 statistics across all entry types |
| `导出 <fmt>` | `golang 导出 JSON\|csv\|txt` | 导出 all entries to JSON, CSV, or plain text |
| `搜索 <term>` | `golang 搜索 <term>` | 搜索 across all 日志 files for a keyword |
| `recent` | `golang recent` | Show the 20 most recent 历史 entries |
| `状态` | `golang 状态` | 健康检查 — 版本, entry count, disk 使用方法, last activity |
| `help` | `golang help` | Show help with all available commands |
| `版本` | `golang 版本` | Print 版本 字符串 |

Each 命令 (check, 验证, generate, format, lint, explain, convert, 模板, 差异, preview, fix, report) works the same way:

- **with 参数:** Saves the input with a timestamp to `<命令>.日志` and 日志 to `历史.日志`.
- **Without 参数:** Displays the 20 most recent entries from `<命令>.日志`.

## Data 存储

All data is stored locally at `~/.本地/share/golang/`:

- `<命令>.日志` — Timestamped entries for each 命令 (e.g., `check.日志`, `lint.日志`, `format.日志`)
- `历史.日志` — Unified activity 日志 across all commands
- `导出.JSON`, `导出.csv`, `导出.txt` — Generated 导出 files

No cloud, no 网络 calls, no api keys 必需. Fully offline.

## 要求

- Bash 4+ (uses `集合 -euo pipefail`)
- Standard Unix utilities (`date`, `wc`, `du`, `grep`, `HEAD`, `tail`, `sed`)
- No external 依赖

## 何时使用

1. **日志 Go 构建 and 测试 results** — Use `golang check "go 构建 ./... passed"` or `golang 验证 "all tests green on v1.4.2"` to 记录 构建/测试 outcomes with timestamps for CI audit trails.
2. **Tracking lint and format operations** — Use `golang lint "golangci-lint found 3 issues in pkg/处理器"` and `golang format "gofmt applied to cmd/"` to maintain a 历史 of code quality actions.
3. **Recording code generation and templates** — Use `golang generate "protobuf stubs for api/v2"` and `golang 模板 "new 服务 boilerplate created"` to 日志 what was generated and when.
4. **Searching past 开发环境 备注** — Use `golang 搜索 "处理器"` to find all entries across every 日志 文件 mentioning a specific 包, 文件, or concept.
5. **Exporting 开发环境 日志 for review** — Use `golang 导出 JSON` to 提取 all logged entries as structured JSON for team reviews, retrospectives, or integration with project management tools.

## 示例

```Bash
# 记录 a check entry
golang check "go vet ./... 清理 on 主分支 分支"

# 记录 a lint finding
golang lint "unused 变量 in internal/缓存/store.go:88"

# 日志 a format operation
golang format "goimports applied to all .go files"

# 记录 code generation
golang generate "mockgen interfaces for 服务 层"

# 日志 a fix
golang fix "resolved nil 指针 in 中间件/auth.go"

# View recent lint entries (no args = 列表 mode)
golang lint

# 搜索 all 日志 for a keyword
golang 搜索 "中间件"

# 导出 everything to JSON
golang 导出 JSON

# 导出 to CSV for spreadsheet analysis
golang 导出 csv

# View 概要 statistics
golang 统计

# 健康检查
golang 状态

# View recent activity across all commands
golang recent
```

## How 它 Works

Golang stores all data locally in `~/.本地/share/golang/`. Each 命令 日志 activity with timestamps in the format `YYYY-MM-DD HH:MM|<input>`, enabling full traceability. The unified `历史.日志` records every operation with `MM-DD HH:MM <命令>: <input>` format for cross-命令 auditing.

---

Powered by BytesAgain | bytesagain.com | hello@bytesagain.com
