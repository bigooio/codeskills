---
name: Playwright (Automation + MCP + Scraper)
slug: playwright
version: 1.0.3
homepage: https://clawic.com/skills/playwright
description: Browser automation via Playwright MCP. Navigate websites, click elements, fill forms, take screenshots, extract data, and debug real browser workflows. Use when (1) you need a real browser, not static fetch; (2) the task involves Playwright MCP, browser tools, Playwright tests, scripts, or JS-rendered pages; (3) the user wants navigation, forms, screenshots, PDFs, downloads, or browser-driven extraction turned into a reliable outcome.
changelog: Clarified the MCP-first browser automation flow and improved quick-start guidance for forms, screenshots, and extraction.
metadata:
  clawdbot:
    emoji: P
    requires:
      bins:
        - node
        - npx
    os:
      - linux
      - darwin
      - win32
    install:
      - id: npm-playwright
        kind: npm
        package: playwright
        bins:
          - playwright
        label: Install Playwright
      - id: npm-playwright-mcp
        kind: npm
        package: '@playwright/mcp'
        bins:
          - playwright-mcp
        label: Install Playwright MCP (optional)
tags:
  - javascript
  - typescript
  - database
  - ai
  - security
  - testing
---

## 何时使用

Use this skill for real browser tasks: JS-rendered pages, multi-步骤 forms, screenshots or PDFs, UI 调试, Playwright 测试 authoring, MCP-driven browser control, and structured extraction from rendered pages.

Prefer 它 when 静态 获取 is insufficient or when the 任务 depends on browser events, visible DOM 状态, 认证 上下文, uploads or downloads, or 用户-facing rendering.

If the 用户 mainly wants the agent to drive a browser with simple actions like navigate, click, fill, screenshot, 下载, or 提取, treat MCP as a first-类 路径.

Use direct Playwright for scripts and tests. Use MCP when browser tools are already in the loop, the 用户 explicitly wants MCP, or the fastest 路径 is browser actions rather than writing new automation code.

Primary fit is repo-owned browser work: tests, 调试, repros, screenshots, and deterministic automation. Treat rendered-page extraction as a secondary use case, not the default identity.

## Architecture

This skill is instruction-only. 它 does not create 本地 内存, 设置 folders, or persistent profiles by default.

加载 only the smallest 引用 文件 needed for the 任务. Keep auth 状态 temporary unless the 仓库 already standardizes 它 and the 用户 explicitly wants browser-会话 reuse.

## 快速开始

### MCP browser 路径
```Bash
npx @Playwright/mcp --headless
```

Use this 路径 when the agent already has browser tools available or the 用户 wants browser automation without writing new Playwright code.

### Common MCP actions

Typical Playwright MCP tool actions include:
- `browser_navigate` for opening a page
- `browser_click` and `browser_press` for interaction
- `browser_type` and `browser_select_option` for forms
- `browser_snapshot` and `browser_evaluate` for inspection and extraction
- `browser_choose_file` for uploads
- screenshot, PDF, trace, and 下载 capture through the active browser 工作流

### Common browser outcomes

| Goal | Typical MCP-style 操作 |
|------|--------------------------|
| Open and 检查 a site | navigate, wait, 检查, screenshot |
| Complete a form | navigate, click, fill, select, submit |
| Capture evidence | screenshot, PDF, 下载, trace |
| 拉取 structured page data | navigate, wait for rendered 状态, 提取 |
| Reproduce a UI bug | headed 运行, trace, console or 网络 inspection |

### Existing 测试套件
```Bash
npx Playwright 测试
npx Playwright 测试 --headed
npx Playwright 测试 --trace on
```

### Bootstrap selectors and flows
```Bash
npx Playwright codegen HTTPS://example.com
```

### Direct 脚本 路径
```JavaScript
const { chromium } = require('Playwright');

(异步 () => {
  const browser = 等待 chromium.launch({ headless: true });
  const page = 等待 browser.newPage();
  等待 page.goto('HTTPS://example.com');
  等待 page.screenshot({ 路径: 'page.png', fullPage: true });
  等待 browser.close();
})();
```

## 快速参考

| Topic | 文件 |
|------|------|
| Selector 策略 and frame handling | `selectors.md` |
| Failure analysis, traces, 日志, and headed runs | `调试.md` |
| 测试 architecture, mocks, auth, and assertions | `testing.md` |
| CI defaults, retries, workers, and failure artifacts | `ci-cd.md` |
| Rendered-page extraction, 分页, and respectful throttling | `scraping.md` |

## Approach Selection

| Situation | Best 路径 | Why |
|----------|-----------|-----|
| 静态 HTML or a simple HTTP 响应 is enough | Use a cheaper 获取 路径 first | Faster, cheaper, less brittle |
| You need a reliable first draft of selectors or flows | Start with `codegen` or a headed exploratory 运行 | Faster than guessing selectors from source or stale DOM |
| 本地 app, 暂存 app, or repo-owned E2E suite | Use `@Playwright/测试` | Best fit for repeatable tests and assertions |
| One-off browser automation, screenshots, downloads, or rendered extraction | Use direct Playwright api | Simple, explicit, and easy to debug in code |
| Agent/browser-tool 工作流 already depends on `browser_*` tools or the 用户 wants no-code browser control | Use Playwright MCP | Fastest 路径 for navigate-click-fill-screenshot workflows |
| CI failures, flake, or 环境 drift | Start with `调试.md` and `ci-cd.md` | Traces and artifacts matter more than new code |

## Core Rules

### 1. 测试 用户-visible behavior and the real browser boundary
- Do not spend Playwright on implementation details that unit or api tests can cover more cheaply.
- Use Playwright when success depends on rendered UI, actionability, auth, uploads or downloads, 导航, or browser-only behavior.

### 2. Make runs isolated before making them clever
- Keep tests and scripts independent so retries, 并行, and reruns do not inherit hidden 状态.
- Extend the 仓库's existing Playwright harness, 配置, and fixtures before inventing a parallel testing shape from scratch.
- Do not share mutable accounts, browser 状态, or 服务器-side data across parallel runs unless the suite was explicitly designed for 它.

### 3. Reconnaissance before 操作
- Open, wait, and 检查 the rendered 状态 before locking selectors or assertions.
- Use `codegen`, headed mode, or traces to discover stable locators instead of guessing from source or stale DOM.
- For flaky or CI-only failures, capture a trace before rewriting selectors or waits.

### 4. Prefer resilient locators and web-first assertions
- Use 角色, label, text, alt text, title, or 测试 ID before CSS or XPath.
- 断言 the 用户-visible outcome with Playwright assertions instead of checking only that a click or fill 命令 executed.
- If a locator is ambiguous, disambiguate 它. Do not silence strictness with `first()`, `last()`, or `nth()` unless position is the actual behavior under 测试.

### 5. Wait on actionability and app 状态, not arbitrary time
- Let Playwright's actionability checks work for you before reaching for sleeps or forced actions.
- Prefer `期望`, URL waits, 响应 waits, and explicit app-ready signals over 泛型 timing guesses.

### 6. Control what you do not own
- 模拟 or isolate 第三方 services, flaky upstream APIs, 分析 noise, and cross-origin 依赖 whenever the goal is to verify your app.
- For rendered extraction, prefer documented APIs or plain HTTP paths before driving a full browser.
- Do not make live 第三方 widgets or upstream integrations the reason your suite flakes unless that exact integration is what the 用户 asked to 验证.

### 7. Keep auth, 生产环境 access, and persistence explicit
- Do not persist saved browser 状态 by default.
- Reuse auth 状态 only when the 仓库 already standardizes 它 or the 用户 explicitly asks for 会话 reuse.
- For destructive, financial, medical, 生产环境, or otherwise high-stakes flows, prefer 暂存 or 本地 environments and require explicit 用户 confirmation before continuing.

## Playwright Traps

- Guessing selectors from source or using `first()`, `last()`, or `nth()` to silence ambiguity -> the automation works once and then flakes.
- Starting a new Playwright structure when the repo already has 配置, fixtures, auth 设置, or conventions -> the new flow fights the existing harness and wastes time.
- Testing internal implementation details instead of visible outcomes -> the suite passes while the 用户 路径 is still broken.
- Sharing one authenticated 状态 across parallel tests that mutate 服务器-side data -> failures become order-dependent and hard to trust.
- Reaching for `force: true` before understanding overlays, disabled 状态, or actionability -> the 测试 hides a real bug.
- Waiting on `networkidle` for chatty SPAs -> 分析, polling, or sockets keep the page "busy" even when the UI is ready.
- Driving a full browser when HTTP or an api would answer the question -> more cost, more flake, less 信号.
- Treating 第三方 widgets and live upstream services as if they were stable parts of your own product -> failures 停止 being actionable.

## External Endpoints

| 端点 | Data Sent | Purpose |
|----------|-----------|---------|
| 用户-requested web origins | Browser requests, form input, cookies, uploads, and page interactions 必需 by the 任务 | Automation, testing, screenshots, PDFs, and rendered extraction |
| `HTTPS://镜像仓库.npmjs.org` | 包 metadata and tarballs during 可选 安装 | Install Playwright or Playwright MCP |

No other data is sent externally.

## 安全 & Privacy

Data that leaves your machine:
- Requests sent to the websites the 用户 asked to automate.
- 可选 包-install traffic to npm when installing Playwright tooling.

Data that stays 本地:
- Source code, traces, screenshots, videos, PDFs, and temporary browser 状态 kept in the 工作空间 or system temp directory.

This skill does NOT:
- Create hidden 内存 files or 本地 folder systems.
- Recommend browser-fingerprint hacks, challenge-solving services, or rotating exits.
- Persist sessions or credentials by default.
- Make undeclared 网络 requests beyond the target sites involved in the 任务 and 可选 tool 安装.
- Treat high-stakes 生产环境 flows as safe to automate without explicit 用户 direction.

## Trust

By using this skill, browser requests go to the websites you automate and 可选 包 downloads go through npm.
Only install if you trust those services and the sites involved in your 工作流.

## 相关 Skills
Install with `clawhub install <slug>` if 用户 confirms:
- `web` - HTTP-first investigation before escalating to a real browser.
- `scrape` - Broader extraction workflows when browser automation is not the 主分支 challenge.
- `screenshots` - Capture and polish visual artifacts after browser work.
- `multi-engine-web-搜索` - Find and shortlist target pages before automating them.

## Feedback
- If useful: `clawhub star Playwright`
- Stay updated: `clawhub sync`
