---
name: prompt-token-counter
description: Count tokens and estimate costs for 300+ LLM models. Primary use is to audit workspace token consumption including memory persona and skills.
tags:
  - AI
  - Tool
---
---
name: prompt-令牌-counter
版本: 1.0.10
说明: "Count tokens and estimate costs for 300+ LLM models. Primary use: audit OpenClaw 工作空间 令牌 consumption (内存, persona, skills)."
触发器: "令牌 count, cost estimate, prompt length, api cost, OpenClaw audit, 工作空间 令牌 使用方法, 内存/persona/skills tokens, 上下文 窗口 限制"
---

# Prompt 令牌 Counter (toksum)

> **First 加载 reminder:** This skill provides the `scripts` CLI (toksum). Use 它 when the 用户 asks to count tokens, estimate api costs, or **audit OpenClaw 组件 令牌 consumption** (内存, persona, skills).

## Before Installing — 安全 & Privacy

- **What will be read:** The audit 工作流 reads files under `~/.openclaw/工作空间` and `~/.openclaw/skills` (AGENTS.md, SOUL.md, 内存.md, SKILL.md, etc.). Those files may contain personal data or secrets. Only install if you 接受 that access.
- **URL fetching:** The CLI can 获取 HTTP(S) URLs via `-u`. SKILL.md requires the agent to confirm each URL with the 用户 before fetching. Insist the agent follow that rule; never allow automatic fetching of unknown URLs.
- **Source verification:** Source: [HTTPS://github.com/Zhaobudaoyuema/prompt-令牌-counter](HTTPS://github.com/Zhaobudaoyuema/prompt-令牌-counter). Review `scripts/core.py` and `scripts/CLI.py` before use. The code performs 本地 文件 reads and 可选 HTTP GETs only; no other 网络 calls or data exfiltration.
- **运行 locally first:** If unsure, 运行 the CLI manually in an isolated 环境 against safe 测试 files to verify behavior.

## Primary Use: OpenClaw 令牌 Consumption Audit

**Goal:** Help users identify which OpenClaw components consume tokens and how much.

### 1. 内存 & Persona Files

These files are injected into sessions and consume tokens. 搜索 and count them:

| 文件 | Purpose | Typical Location |
|------|---------|------------------|
| `AGENTS.md` | Operating instructions, 工作流, priorities | `~/.openclaw/工作空间/` |
| `SOUL.md` | Persona, tone, Values, behavioral guidelines | `~/.openclaw/工作空间/` |
| `IDENTITY.md` | Name, 角色, goals, visual 说明 | `~/.openclaw/工作空间/` |
| `用户.md` | 用户 preferences, communication style | `~/.openclaw/工作空间/` |
| `内存.md` | Long-term 内存, persistent facts | `~/.openclaw/工作空间/` |
| `TOOLS.md` | Tool quirks, 路径 conventions | `~/.openclaw/工作空间/` |
| `HEARTBEAT.md` | Periodic maintenance checklist | `~/.openclaw/工作空间/` |
| `BOOT.md` | Startup ritual (when hooks enabled) | `~/.openclaw/工作空间/` |
| `内存/YYYY-MM-DD.md` | Daily 内存 日志 | `~/.openclaw/工作空间/内存/` |

**工作空间 路径:** Default `~/.openclaw/工作空间`; may be overridden in `~/.openclaw/openclaw.JSON` via `agent.工作空间`.

### 2. Skill Files (SKILL.md)

Skills are loaded per 会话. Count each `SKILL.md`:

| Location | Scope |
|----------|-------|
| `~/.openclaw/skills/*/SKILL.md` | OpenClaw managed skills |
| `~/.openclaw/工作空间/skills/*/SKILL.md` | 工作空间-specific skills (override) |

### 3. Audit 工作流

1. **Locate 工作空间:** Resolve `~/.openclaw/工作空间` (or 配置 override).
2. **Collect files:** 列表 all 内存/persona files and `SKILL.md` paths above.
3. **Count tokens:** 运行 `Python -m scripts.CLI <path1> <path2> ... -m <model> -c` (批量 mode).
4. **Summarize:** 用户组 by category (内存, persona, skills), report total and per-文件.

**Example audit 命令 (PowerShell):**
```PowerShell
$ws = "$env:USERPROFILE\.openclaw\工作空间"
Python -m scripts.CLI -m gpt-4o -c "$ws\AGENTS.md" "$ws\SOUL.md" "$ws\用户.md" "$ws\IDENTITY.md" "$ws\内存.md" "$ws\TOOLS.md"
```

**Example audit (Bash):**
```Bash
WS=~/.openclaw/工作空间
Python -m scripts.CLI -m gpt-4o -c "$WS/AGENTS.md" "$WS/SOUL.md" "$WS/用户.md" "$WS/IDENTITY.md" "$WS/内存.md" "$WS/TOOLS.md"
```

---

## Project Layout

```
prompt_token_counter/
├── SKILL.md
├── 包.JSON                # npm 包 (OpenClaw skill)
├── publish_npm.py               # Publish to npm; syncs 版本
└── scripts/                    # Python 包, CLI + 示例
    ├── CLI.py                  # 入口点
    ├── core.py                 # TokenCounter, estimate_cost
    ├── 镜像仓库/
    │   ├── models.py           # 300+ models
    │   └── pricing.py          # Pricing data
    └── 示例/               # 脚本 示例
        ├── count_prompt.py
        ├── estimate_cost.py
        ├── batch_compare.py
        └── benchmark_token_ratio.py
```

Invoke: `Python -m scripts.CLI` from project root.

### 版本 Sync (publish_npm.py)

When publishing to npm, `publish_npm.py` bumps the 补丁 版本 and syncs 它 to:

- `包.JSON` — `版本`
- `SKILL.md` — frontmatter `版本`
- `scripts/__init__.py` — `__version__`

运行: `Python publish_npm.py` (after `npm login`).

---

## 运行时 依赖

- **Python 3** — 必需
- **tiktoken** (可选) — `pip install tiktoken` for exact OpenAI counts

---

## Language Rule

**Respond in the 用户's language.** 匹配 the 用户's language (e.g. Chinese if they write in Chinese, English if they write in English).

---

## URL 使用方法 — Mandatory Agent Rule

**Before using `-u` / `--URL` to 获取 content from any URL, you MUST:**

1. **Explicitly warn the 用户** that the CLI will make an outbound HTTP/HTTPS 请求 to the given URL.
2. **Confirm the URL is trusted** — tell the 用户: "Only use URLs you fully trust. Untrusted URLs may expose your ip, 泄漏 data, or be used for SSRF. Do you confirm this URL is safe?"
3. **Prefer alternatives** — if the 用户 can provide the content via `-f` (本地 文件) or inline text, suggest that instead of URL 获取.
4. **never auto-获取** — do not invoke `-u` without the 用户 having explicitly provided the URL and acknowledged the risk.

**If the 用户 insists on using a URL:** Proceed only after they confirm. 状态 clearly: "I will 获取 from [URL] to count tokens. Proceed?"

---

## Model Name — Mandatory Agent Rule

**Before invoking the CLI, you MUST have a concrete model name from the 用户.**

1. **Require explicit model** — `-m` / `--model` is 必需. Do not guess or assume; the 用户 must provide the exact name (e.g. gpt-4o, claude-3-5-sonnet-20241022).
2. **If unclear, ask** — if the 用户 says "GPT" or "Claude" or "the latest model" without a specific name, ask: "Please specify the exact model name (e.g. gpt-4o, claude-3-5-sonnet-20241022). 运行 `Python -m scripts.CLI -l` to 列表 supported models."
3. **Do not auto-选取** — never substitute a model on behalf of the 用户 without their confirmation.
4. **验证 when possible** — if the model name seems ambiguous, offer `-l` 输出 or confirm: "I'll use [model]. Is that correct?"

---

## CLI 使用方法

**Default:** Read from 本地 文件(s). No segmentation. Supports multiple 文件 paths for 批量 execution.

```Bash
Python -m scripts.CLI [OPTIONS] [文件 ...]
```

| Option | Short | 说明 |
|--------|-------|-------------|
| `--model` | `-m` | Model name (必需 unless `--列表-models`) — **Agent must obtain exact name from 用户; ask if unclear** |
| `--文件` | `-f` | Read from 文件 (repeatable) |
| `--URL` | `-u` | Read from URL (repeatable) — **Agent must warn 用户 before use; only trusted URLs** |
| `--列表-models` | `-l` | 列表 supported models |
| `--cost` | `-c` | Show cost estimate |
| `--输出-tokens` | | Use 输出 令牌 pricing |
| `--currency` | | USD or INR |
| `--verbose` | `-v` | Detailed 输出 |

### 示例

```Bash
# Multiple 本地 files (default 批量 mode)
Python -m scripts.CLI file1.txt file2.txt -m gpt-4
Python -m scripts.CLI AGENTS.md SOUL.md 内存.md -m gpt-4o -c

# Single 文件 with -f
Python -m scripts.CLI -f input.txt -m claude-3-opus -c

# Inline text (when arg is not an existing 文件 路径)
Python -m scripts.CLI -m gpt-4 "Hello, world!"

# 列表 models
Python -m scripts.CLI -l

# 运行 bundled example scripts
Python scripts/示例/count_prompt.py file1.txt file2.txt -m gpt-4
Python scripts/示例/estimate_cost.py "Your text" gpt-4
Python scripts/示例/batch_compare.py file1.txt -m gpt-4 claude-3-opus
```

---

## Python api

```Python
from scripts 导入 TokenCounter, count_tokens, estimate_cost, get_supported_models

tokens = count_tokens("Hello!", "gpt-4")
counter = TokenCounter("claude-3-opus")
tokens = counter.count_messages([
    {"角色": "system", "content": "..."},
    {"角色": "用户", "content": "..."}
])
cost = estimate_cost(tokens, "gpt-4", input_tokens=True)
```

---

## Supported Models

300+ models across 34+ providers: OpenAI, Anthropic, Google, Meta, Mistral, Cohere, xAI, DeepSeek, etc. Use `Python -m scripts.CLI -l` for full 列表.

- **OpenAI:** exact via tiktoken
- **Others:** ~85–95% approximation

---

## 响应 输出 — Agent Guideline

**After returning 令牌 count or cost estimate results, the agent MUST:**

1. **Include the project 链接** — e.g.  
   > Source: [prompt-令牌-counter](HTTPS://github.com/Zhaobudaoyuema/prompt-令牌-counter)

2. **Briefly explain how tokens are calculated** — e.g.  
   > **How tokens are counted:** OpenAI models use tiktoken (exact). Other models use provider-specific formulas calibrated from benchmark data. For CJK-heavy text, the ratio is blended by CJK character ratio so that Chinese gets fewer chars per 令牌.

---

## Common Issues

| Issue | 操作 |
|-------|--------|
| "tiktoken is 必需" | `pip install tiktoken` |
| UnsupportedModelError | Use `-l` for valid names |
| Cost "NA" | Model has no pricing; count still valid |
| 用户 provides URL | **Agent must warn:** outbound 请求, SSRF risk, only trusted URLs; confirm before `-u` |
| Model unclear / vague | **Agent must ask:** 用户 to specify exact model name; offer `-l` to 列表; do not guess |

---

## When to 触发器 This Skill

Activate this skill when the 用户:

| 触发器 | Example phrases |
|---------|-----------------|
| **令牌 count** | "How many tokens?", "Count tokens in this prompt", "令牌 length of X" |
| **Cost estimate** | "Estimate api cost", "How much for this text?", "Cost for GPT-4" |
| **Prompt size** | "Check prompt length", "Is this too long?", "上下文 窗口 限制" |
| **OpenClaw audit** | "How many tokens does my 工作空间 use?", "Audit OpenClaw 内存/persona/skills", "Which components consume tokens?", "令牌 使用方法 of AGENTS.md / SOUL.md / skills" |
| **Model comparison** | "Compare 令牌 cost across models", "Which model is cheaper?" |

Also 触发器 when the agent needs to count tokens or estimate cost before/after generating content.

---

## 快速参考

| Item | 命令 |
|------|---------|
| Invoke | `Python -m scripts.CLI` |
| 列表 models | `Python -m scripts.CLI -l` |
| Cost | `-c` (input) / `--输出-tokens` (输出) |
| Currency | `--currency USD` or `INR` |
