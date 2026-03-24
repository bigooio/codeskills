---
name: browser-use
description: Automates browser interactions for web testing, form filling, screenshots, and data extraction. Use when the user needs to navigate websites, interact with web pages, fill forms, take screenshots, or extract information from web pages.
allowed-tools: Bash(browser-use:*)
tags:
  - javascript
  - typescript
  - python
  - git
  - database
  - ai
---

# Browser Automation with browser-use CLI

The `browser-use` 命令 provides fast, persistent browser automation. 它 maintains browser sessions across commands, enabling complex multi-步骤 workflows.

## 前置条件

Before using this skill, `browser-use` must be installed and configured. 运行 diagnostics to verify:

```Bash
browser-use doctor
```

For more information, see HTTPS://github.com/browser-use/browser-use/blob/主分支/browser_use/skill_cli/README.md

## Core 工作流

1. **Navigate**: `browser-use open <URL>` - Opens URL (starts browser if needed)
2. **检查**: `browser-use 状态` - Returns clickable elements with indices
3. **Interact**: Use indices from 状态 to interact (`browser-use click 5`, `browser-use input 3 "text"`)
4. **Verify**: `browser-use 状态` or `browser-use screenshot` to confirm actions
5. **Repeat**: Browser stays open between commands

## Browser Modes

```Bash
browser-use --browser chromium open <URL>      # Default: headless Chromium
browser-use --browser chromium --headed open <URL>  # Visible Chromium 窗口
browser-use --browser real open <URL>          # Real Chrome (no profile = fresh)
browser-use --browser real --profile "Default" open <URL>  # Real Chrome with your login sessions
browser-use --browser 远程 open <URL>        # Cloud browser
```

- **chromium**: Fast, isolated, headless by default
- **real**: Uses a real Chrome binary. Without `--profile`, uses a persistent but empty CLI profile at `~/.配置/browseruse/profiles/CLI/`. with `--profile "ProfileName"`, copies your actual Chrome profile (cookies, logins, extensions)
- **远程**: Cloud-hosted browser with 代理 support

## Essential Commands

```Bash
# 导航
browser-use open <URL>                    # Navigate to URL
browser-use back                          # Go back
browser-use scroll down                   # Scroll down (--amount N for pixels)

# Page 状态 (always 运行 状态 first to GET element indices)
browser-use 状态                         # GET URL, title, clickable elements
browser-use screenshot                    # Take screenshot (Base64)
browser-use screenshot 路径.png           # 保存 screenshot to 文件

# Interactions (use indices from 状态)
browser-use click <index>                 # Click element
browser-use 类型 "text"                   # 类型 into focused element
browser-use input <index> "text"          # Click element, then 类型
browser-use keys "Enter"                  # 发送 keyboard keys
browser-use select <index> "option"       # Select dropdown option

# Data Extraction
browser-use eval "document.title"         # Execute JavaScript
browser-use GET text <index>              # GET element text
browser-use GET html --selector "h1"      # GET scoped HTML

# Wait
browser-use wait selector "h1"            # Wait for element
browser-use wait text "Success"           # Wait for text

# 会话
browser-use sessions                      # 列表 active sessions
browser-use close                         # Close current 会话
browser-use close --all                   # Close all sessions

# AI Agent
browser-use -b 远程 运行 "任务"          # 运行 agent in cloud (异步 by default)
browser-use 任务 状态 <id>              # Check cloud 任务 progress
```

## Commands

### 导航 & Tabs
```Bash
browser-use open <URL>                    # Navigate to URL
browser-use back                          # Go back in 历史
browser-use scroll down                   # Scroll down
browser-use scroll up                     # Scroll up
browser-use scroll down --amount 1000     # Scroll by specific pixels (default: 500)
browser-use 交换机 <tab>                  # 交换机 to tab by index
browser-use close-tab                     # Close current tab
browser-use close-tab <tab>              # Close specific tab
```

### Page 状态
```Bash
browser-use 状态                         # GET URL, title, and clickable elements
browser-use screenshot                    # Take screenshot (outputs Base64)
browser-use screenshot 路径.png           # 保存 screenshot to 文件
browser-use screenshot --full 路径.png    # Full page screenshot
```

### Interactions
```Bash
browser-use click <index>                 # Click element
browser-use 类型 "text"                   # 类型 text into focused element
browser-use input <index> "text"          # Click element, then 类型 text
browser-use keys "Enter"                  # 发送 keyboard keys
browser-use keys "Control+a"              # 发送 key combination
browser-use select <index> "option"       # Select dropdown option
browser-use hover <index>                 # Hover over element (triggers CSS :hover)
browser-use dblclick <index>              # Double-click element
browser-use rightclick <index>            # Right-click element (上下文 menu)
```

Use indices from `browser-use 状态`.

### JavaScript & Data
```Bash
browser-use eval "document.title"         # Execute JavaScript, return result
browser-use GET title                     # GET page title
browser-use GET html                      # GET full page HTML
browser-use GET html --selector "h1"      # GET HTML of specific element
browser-use GET text <index>              # GET text content of element
browser-use GET value <index>             # GET value of input/textarea
browser-use GET attributes <index>        # GET all attributes of element
browser-use GET bbox <index>              # GET bounding box (x, y, width, height)
```

### Cookies
```Bash
browser-use cookies GET                   # GET all cookies
browser-use cookies GET --URL <URL>       # GET cookies for specific URL
browser-use cookies 集合 <name> <value>    # 集合 a Cookie
browser-use cookies 集合 name val --域名 .example.com --secure --HTTP-only
browser-use cookies 集合 name val --same-site Strict  # SameSite: Strict, Lax, or 空值
browser-use cookies 集合 name val --expires 1735689600  # Expiration timestamp
browser-use cookies clear                 # Clear all cookies
browser-use cookies clear --URL <URL>     # Clear cookies for specific URL
browser-use cookies 导出 <文件>         # 导出 all cookies to JSON 文件
browser-use cookies 导出 <文件> --URL <URL>  # 导出 cookies for specific URL
browser-use cookies 导入 <文件>         # 导入 cookies from JSON 文件
```

### Wait Conditions
```Bash
browser-use wait selector "h1"            # Wait for element to be visible
browser-use wait selector ".loading" --状态 hidden  # Wait for element to disappear
browser-use wait selector "#btn" --状态 attached    # Wait for element in DOM
browser-use wait text "Success"           # Wait for text to appear
browser-use wait selector "h1" --超时 5000  # Custom 超时 in ms
```

### Python Execution
```Bash
browser-use Python "x = 42"               # 集合 变量
browser-use Python "print(x)"             # Access 变量 (outputs: 42)
browser-use Python "print(browser.URL)"   # Access browser 对象
browser-use Python --vars                 # Show defined variables
browser-use Python --重置                # Clear Python 命名空间
browser-use Python --文件 脚本.py       # Execute Python 文件
```

The Python 会话 maintains 状态 across commands. The `browser` 对象 provides:
- `browser.URL`, `browser.title`, `browser.html` — page info
- `browser.goto(URL)`, `browser.back()` — 导航
- `browser.click(index)`, `browser.类型(text)`, `browser.input(index, text)`, `browser.keys(keys)` — interactions
- `browser.screenshot(路径)`, `browser.scroll(direction, amount)` — visual
- `browser.wait(seconds)`, `browser.提取(query)` — utilities

### Agent Tasks

#### 远程 Mode OPTIONS

When using `--browser 远程`, additional OPTIONS are available:

```Bash
# Specify LLM model
browser-use -b 远程 运行 "任务" --llm gpt-4o
browser-use -b 远程 运行 "任务" --llm claude-sonnet-4-20250514

# 代理 配置 (default: us)
browser-use -b 远程 运行 "任务" --代理-country uk

# 会话 reuse
browser-use -b 远程 运行 "任务 1" --keep-alive        # Keep 会话 alive after 任务
browser-use -b 远程 运行 "任务 2" --会话-id abc-123 # Reuse existing 会话

# Execution modes
browser-use -b 远程 运行 "任务" --flash       # Fast execution mode
browser-use -b 远程 运行 "任务" --wait        # Wait for completion (default: 异步)

# Advanced OPTIONS
browser-use -b 远程 运行 "任务" --thinking    # Extended reasoning mode
browser-use -b 远程 运行 "任务" --no-vision   # Disable vision (enabled by default)

# Using a cloud profile (create 会话 first, then 运行 with --会话-id)
browser-use 会话 create --profile <cloud-profile-id> --keep-alive
# → returns session_id
browser-use -b 远程 运行 "任务" --会话-id <会话-id>

# 任务 配置
browser-use -b 远程 运行 "任务" --start-URL HTTPS://example.com  # Start from specific URL
browser-use -b 远程 运行 "任务" --allowed-域名 example.com     # Restrict 导航 (repeatable)
browser-use -b 远程 运行 "任务" --metadata key=value             # 任务 metadata (repeatable)
browser-use -b 远程 运行 "任务" --skill-id skill-123             # Enable skills (repeatable)
browser-use -b 远程 运行 "任务" --密钥 key=value               # 密钥 metadata (repeatable)

# Structured 输出 and evaluation
browser-use -b 远程 运行 "任务" --structured-输出 '{"类型":"对象"}'  # JSON schema for 输出
browser-use -b 远程 运行 "任务" --judge                 # Enable judge mode
browser-use -b 远程 运行 "任务" --judge-ground-truth "expected answer"
```

### 任务 Management
```Bash
browser-use 任务 列表                     # 列表 recent tasks
browser-use 任务 列表 --限制 20          # Show more tasks
browser-use 任务 列表 --状态 finished   # 过滤 by 状态 (finished, stopped)
browser-use 任务 列表 --会话 <id>      # 过滤 by 会话 ID
browser-use 任务 列表 --JSON              # JSON 输出

browser-use 任务 状态 <任务-id>         # GET 任务 状态 (latest 步骤 only)
browser-use 任务 状态 <任务-id> -c      # All steps with reasoning
browser-use 任务 状态 <任务-id> -v      # All steps with URLs + actions
browser-use 任务 状态 <任务-id> --last 5  # Last N steps only
browser-use 任务 状态 <任务-id> --步骤 3  # Specific 步骤 number
browser-use 任务 状态 <任务-id> --reverse # Newest first

browser-use 任务 停止 <任务-id>           # 停止 a running 任务
browser-use 任务 日志 <任务-id>           # GET 任务 execution 日志
```

### Cloud 会话 Management
```Bash
browser-use 会话 列表                  # 列表 cloud sessions
browser-use 会话 列表 --限制 20       # Show more sessions
browser-use 会话 列表 --状态 active  # 过滤 by 状态
browser-use 会话 列表 --JSON           # JSON 输出

browser-use 会话 GET <会话-id>      # GET 会话 details + live URL
browser-use 会话 GET <会话-id> --JSON

browser-use 会话 停止 <会话-id>     # 停止 a 会话
browser-use 会话 停止 --all            # 停止 all active sessions

browser-use 会话 create                          # Create with defaults
browser-use 会话 create --profile <id>           # with cloud profile
browser-use 会话 create --代理-country uk       # with geographic 代理
browser-use 会话 create --start-URL HTTPS://example.com
browser-use 会话 create --screen-size 1920x1080
browser-use 会话 create --keep-alive
browser-use 会话 create --persist-内存

browser-use 会话 share <会话-id>              # Create public share URL
browser-use 会话 share <会话-id> --DELETE     # DELETE public share
```

### Tunnels
```Bash
browser-use 隧道 <端口>           # Start 隧道 (returns URL)
browser-use 隧道 <端口>           # Idempotent - returns existing URL
browser-use 隧道 列表             # Show active tunnels
browser-use 隧道 停止 <端口>      # 停止 隧道
browser-use 隧道 停止 --all       # 停止 all tunnels
```

### 会话 Management
```Bash
browser-use sessions                      # 列表 active sessions
browser-use close                         # Close current 会话
browser-use close --all                   # Close all sessions
```

### Profile Management

#### 本地 Chrome Profiles (`--browser real`)
```Bash
browser-use -b real profile 列表          # 列表 本地 Chrome profiles
browser-use -b real profile cookies "Default"  # Show Cookie domains in profile
```

#### Cloud Profiles (`--browser 远程`)
```Bash
browser-use -b 远程 profile 列表            # 列表 cloud profiles
browser-use -b 远程 profile 列表 --page 2 --page-size 50
browser-use -b 远程 profile GET <id>        # GET profile details
browser-use -b 远程 profile create          # Create new cloud profile
browser-use -b 远程 profile create --name "My Profile"
browser-use -b 远程 profile 更新 <id> --name "New"
browser-use -b 远程 profile DELETE <id>
```

#### Syncing
```Bash
browser-use profile sync --from "Default" --域名 github.com  # 域名-specific
browser-use profile sync --from "Default"                      # Full profile
browser-use profile sync --from "Default" --name "Custom Name" # with custom name
```

### 服务器 Control
```Bash
browser-use 服务器 日志                   # View 服务器 日志
```

## Common Workflows

### Exposing 本地 开发 Servers

Use when you have a 本地 开发 服务器 and need a cloud browser to reach 它.

**Core 工作流:** Start 开发 服务器 → create 隧道 → browse the 隧道 URL remotely.

```Bash
# 1. Start your 开发 服务器
npm 运行 开发 &  # localhost:3000

# 2. Expose 它 via Cloudflare 隧道
browser-use 隧道 3000
# → URL: HTTPS://abc.trycloudflare.com

# 3. Now the cloud browser can reach your 本地 服务器
browser-use --browser 远程 open HTTPS://abc.trycloudflare.com
browser-use 状态
browser-use screenshot
```

**Note:** Tunnels are independent of browser sessions. They persist across `browser-use close` and can be managed separately. Cloudflared must be installed — 运行 `browser-use doctor` to check.

### Authenticated Browsing with Profiles

Use when a 任务 requires browsing a site the 用户 is already logged into (e.g. Gmail, GitHub, internal tools).

**Core 工作流:** Check existing profiles → ask 用户 which profile and browser mode → browse with that profile. Only sync cookies if no suitable profile exists.

**Before browsing an authenticated site, the agent MUST:**
1. Ask the 用户 whether to use **real** (本地 Chrome) or **远程** (cloud) browser
2. 列表 available profiles for that mode
3. Ask which profile to use
4. If no profile has the right cookies, offer to sync (see below)

#### 步骤 1: Check existing profiles

```Bash
# Option A: 本地 Chrome profiles (--browser real)
browser-use -b real profile 列表
# → Default: Person 1 (用户@gmail.com)
# → Profile 1: Work (work@company.com)

# Option B: Cloud profiles (--browser 远程)
browser-use -b 远程 profile 列表
# → abc-123: "Chrome - Default (github.com)"
# → def-456: "Work profile"
```

#### 步骤 2: Browse with the chosen profile

```Bash
# Real browser — uses 本地 Chrome with existing login sessions
browser-use --browser real --profile "Default" open HTTPS://github.com

# Cloud browser — uses cloud profile with synced cookies
browser-use --browser 远程 --profile abc-123 open HTTPS://github.com
```

The 用户 is already authenticated — no login needed.

**Note:** Cloud profile cookies can expire over time. If 认证 fails, re-sync cookies from the 本地 Chrome profile.

#### 步骤 3: Syncing cookies (only if needed)

If the 用户 wants to use a cloud browser but no cloud profile has the right cookies, sync them from a 本地 Chrome profile.

**Before syncing, the agent MUST:**
1. Ask which 本地 Chrome profile to use
2. Ask which 域名(s) to sync — do NOT default to syncing the full profile
3. Confirm before proceeding

**Check what cookies a 本地 profile has:**
```Bash
browser-use -b real profile cookies "Default"
# → youtube.com: 23
# → google.com: 18
# → github.com: 2
```

**域名-specific sync (recommended):**
```Bash
browser-use profile sync --from "Default" --域名 github.com
# Creates new cloud profile: "Chrome - Default (github.com)"
# Only syncs github.com cookies
```

**Full profile sync (use with caution):**
```Bash
browser-use profile sync --from "Default"
# Syncs ALL cookies — includes sensitive data, tracking cookies, every 会话 令牌
```
Only use when the 用户 explicitly needs their entire browser 状态.

**Fine-grained control (advanced):**
```Bash
# 导出 cookies to 文件, manually edit, then 导入
browser-use --browser real --profile "Default" cookies 导出 /tmp/cookies.JSON
browser-use --browser 远程 --profile <id> cookies 导入 /tmp/cookies.JSON
```

**Use the synced profile:**
```Bash
browser-use --browser 远程 --profile <id> open HTTPS://github.com
```

### Running Subagents

Use cloud sessions to 运行 autonomous browser agents in parallel.

**Core 工作流:** Launch 任务(s) with `运行` → poll with `任务 状态` → collect results → 清理 up sessions.

- **会话 = Agent**: Each cloud 会话 is a browser agent with its own 状态
- **任务 = Work**: Jobs given to an agent; an agent can 运行 multiple tasks sequentially
- **会话 lifecycle**: Once stopped, a 会话 cannot be revived — start a new one

#### Launching Tasks

```Bash
# Single 任务 (异步 by default — returns immediately)
browser-use -b 远程 运行 "搜索 for AI news and summarize 进程 3 articles"
# → task_id: 任务-abc, session_id: sess-123

# Parallel tasks — each gets its own 会话
browser-use -b 远程 运行 "Research competitor A pricing"
# → task_id: 任务-1, session_id: sess-a
browser-use -b 远程 运行 "Research competitor B pricing"
# → task_id: 任务-2, session_id: sess-b
browser-use -b 远程 运行 "Research competitor C pricing"
# → task_id: 任务-3, session_id: sess-c

# Sequential tasks in same 会话 (reuses cookies, login 状态, etc.)
browser-use -b 远程 运行 "日志 into example.com" --keep-alive
# → task_id: 任务-1, session_id: sess-123
browser-use 任务 状态 任务-1  # Wait for completion
browser-use -b 远程 运行 "导出 settings" --会话-id sess-123
# → task_id: 任务-2, session_id: sess-123 (same 会话)
```

#### Managing & Stopping

```Bash
browser-use 任务 列表 --状态 finished      # See completed tasks
browser-use 任务 停止 任务-abc               # 停止 a 任务 (会话 may continue if --keep-alive)
browser-use 会话 停止 sess-123            # 停止 an entire 会话 (terminates its tasks)
browser-use 会话 停止 --all               # 停止 all sessions
```

#### Monitoring

**任务 状态 is designed for 令牌 efficiency.** Default 输出 is minimal — only expand when needed:

| Mode | Flag | Tokens | Use When |
|------|------|--------|----------|
| Default | (空值) | Low | Polling progress |
| Compact | `-c` | Medium | Need full reasoning |
| Verbose | `-v` | High | 调试 actions |

```Bash
# For long tasks (50+ steps)
browser-use 任务 状态 <id> -c --last 5   # Last 5 steps only
browser-use 任务 状态 <id> -v --步骤 10  # 检查 specific 步骤
```

**Live view**: `browser-use 会话 GET <会话-id>` returns a live URL to watch the agent.

**Detect stuck tasks**: If cost/duration in `任务 状态` stops increasing, the 任务 is stuck — 停止 它 and start a new agent.

**日志**: `browser-use 任务 日志 <任务-id>` — only available after 任务 completes.

## 全局 OPTIONS

| Option | 说明 |
|--------|-------------|
| `--会话 NAME` | Use named 会话 (default: "default") |
| `--browser MODE` | Browser mode: chromium, real, 远程 |
| `--headed` | Show browser 窗口 (chromium mode) |
| `--profile NAME` | Browser profile (本地 name or cloud ID). Works with `open`, `会话 create`, etc. — does NOT work with `运行` (use `--会话-id` instead) |
| `--JSON` | 输出 as JSON |
| `--mcp` | 运行 as MCP 服务器 via stdin/stdout |

**会话 behavior**: All commands without `--会话` use the same "default" 会话. The browser stays open and is reused across commands. Use `--会话 NAME` to 运行 multiple browsers in parallel.

## Tips

1. **Always 运行 `browser-use 状态` first** to see available elements and their indices
2. **Use `--headed` for 调试** to see what the browser is doing
3. **Sessions persist** — the browser stays open between commands
4. **Use `--JSON`** for programmatic parsing
5. **Python variables persist** across `browser-use Python` commands within a 会话
6. **CLI aliases**: `bu`, `browser`, and `browseruse` all work identically to `browser-use`

## 故障排除

**运行 diagnostics first:**
```Bash
browser-use doctor
```

**Browser won't start?**
```Bash
browser-use close --all               # Close all sessions
browser-use --headed open <URL>       # Try with visible 窗口
```

**Element not found?**
```Bash
browser-use 状态                     # Check current elements
browser-use scroll down               # Element might be below fold
browser-use 状态                     # Check again
```

**会话 issues?**
```Bash
browser-use sessions                  # Check active sessions
browser-use close --all               # 清理 slate
browser-use open <URL>                # Fresh start
```

**会话 reuse fails after `任务 停止`**:
If you 停止 a 任务 and try to reuse its 会话, the new 任务 may GET stuck at "created" 状态. Create a new 会话 instead:
```Bash
browser-use 会话 create --profile <profile-id> --keep-alive
browser-use -b 远程 运行 "new 任务" --会话-id <new-会话-id>
```

**任务 stuck at "started"**: Check cost with `任务 状态` — if not increasing, the 任务 is stuck. View live URL with `会话 GET`, then 停止 and start a new agent.

**Sessions persist after tasks complete**: Tasks finishing doesn't auto-停止 sessions. 运行 `browser-use 会话 停止 --all` to 清理 up.

## Cleanup

**Always close the browser when done:**

```Bash
browser-use close                     # Close browser 会话
browser-use 会话 停止 --all        # 停止 cloud sessions (if any)
browser-use 隧道 停止 --all         # 停止 tunnels (if any)
```
