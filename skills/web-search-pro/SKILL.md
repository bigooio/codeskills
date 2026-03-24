---
name: web-search-pro
description: |
  Agent-first web search and retrieval for live web search, news search, docs lookup, code
  lookup, company research, site crawl, site map, and structured evidence packs.
  Includes a no-key baseline plus optional Tavily, Exa, Querit, Serper, Brave, SerpAPI, You.com,
  SearXNG, and Perplexity / Sonar providers for wider coverage and answer-first routing.
homepage: https://github.com/Zjianru/web-search-pro
metadata:
  openclaw:
    emoji: 🔎
    requires:
      bins:
        - node
      config:
        - config.json
      env:
        TAVILY_API_KEY: optional — premium deep search, news, and extract
        EXA_API_KEY: optional — semantic search and extract fallback
        QUERIT_API_KEY: optional — multilingual AI search with native geo and language filters
        SERPER_API_KEY: optional — Google-like search and news
        BRAVE_API_KEY: optional — structured web search aligned with existing OpenClaw setups
        SERPAPI_API_KEY: optional — multi-engine search including Baidu
        YOU_API_KEY: optional — LLM-ready web search with freshness and locale support
        PERPLEXITY_API_KEY: optional — native Perplexity Sonar access
        OPENROUTER_API_KEY: optional — gateway access to Perplexity/Sonar via OpenRouter
        KILOCODE_API_KEY: optional — gateway access to Perplexity/Sonar via Kilo
        PERPLEXITY_GATEWAY_API_KEY: optional — custom gateway key for Perplexity/Sonar models
        PERPLEXITY_BASE_URL: optional — required with PERPLEXITY_GATEWAY_API_KEY
        SEARXNG_INSTANCE_URL: optional — self-hosted privacy-first metasearch endpoint
      note: No API key is required for the baseline. Optional provider credentials or endpoints widen retrieval coverage.
  clawdbot:
    emoji: 🔎
    requires:
      bins:
        - node
      config:
        - config.json
      note: No API key is required for the baseline. Optional provider credentials or endpoints widen retrieval coverage.
    install:
      - kind: node
        label: Bundled Node skill runtime
        bins:
          - node
    config:
      stateDirs:
        - .cache/web-search-pro
      example: |-
        {
          env = {
            WEB_SEARCH_PRO_CONFIG = "./config.json";
          };
        }
    cliHelp: node {baseDir}/scripts/search.mjs --help
tags:
  - javascript
  - typescript
  - python
  - database
  - ai
  - testing
---

# Web 搜索 Pro 2.1 Core Profile

This ClawHub 包 publishes the core retrieval profile of `web-搜索-pro`.
它 is a code-backed 节点 运行时 包, not an instruction-only 包.

## Use This Skill When

- the caller needs live web 搜索 or news 搜索
- the caller needs docs lookup or code lookup
- the caller may continue from 搜索 into 提取, crawl, 映射, or research
- the agent needs explainable 路由 and visible federated-搜索 gains
- the first 运行 needs a real no-key baseline

## 快速开始

The shortest successful 路径 is:

- Option A: No-key baseline
- Option B: Add one premium provider
- Then try docs, news, and research

### Option A: No-key baseline

No api key is 必需 for the first successful 运行.

```Bash
节点 {baseDir}/scripts/doctor.mjs --JSON
节点 {baseDir}/scripts/bootstrap.mjs --JSON
节点 {baseDir}/scripts/搜索.mjs "OpenAI Responses api docs" --JSON
```

### Option B: Add one premium provider

If you only add one premium provider, start with `TAVILY_API_KEY`.

```Bash
导出 TAVILY_API_KEY=tvly-xxxxx
节点 {baseDir}/scripts/doctor.mjs --JSON
节点 {baseDir}/scripts/搜索.mjs "latest OpenAI news" --类型 news --JSON
```

### First successful searches

```Bash
节点 {baseDir}/scripts/搜索.mjs "OpenClaw web 搜索" --JSON
节点 {baseDir}/scripts/搜索.mjs "OpenAI Responses api docs" --preset docs --plan --JSON
节点 {baseDir}/scripts/提取.mjs "HTTPS://platform.openai.com/docs" --JSON
```

### Then try docs, news, and research

```Bash
节点 {baseDir}/scripts/搜索.mjs "OpenAI Responses api docs" --preset docs --JSON
节点 {baseDir}/scripts/搜索.mjs "latest OpenAI news" --类型 news --JSON
节点 {baseDir}/scripts/research.mjs "OpenClaw 搜索 skill landscape" --plan --JSON
```

## Install Model

ClawHub installs this 包 directly as a code-backed 节点 skill pack.

- hard 运行时 requirement: `节点`
- no 远程 installer, curl-to-Shell bootstrap, or Python helper transport in the baseline 路径
- 可选 运行时 配置 文件: `配置.JSON`
- 本地 状态 directory: `.缓存/web-搜索-pro`

## Why Federated 搜索 Matters

Federation is not just "more providers". 它 exposes compact gain metrics:

- `federated.value.additionalProvidersUsed`
- `federated.value.resultsRecoveredByFanout`
- `federated.value.resultsCorroboratedByFanout`
- `federated.value.duplicateSavings`
- `routingSummary.federation.value`

## 运行时 Contract

- `selectedProvider`
  The planner's primary 路由.
- `routingSummary`
  Compact 路由 explanation with confidence and federation 概要.
- `路由.diagnostics`
  Full 路由 diagnostics exposed by `--explain-路由` or `--plan`.
- `federated.providersUsed`
  The providers that actually returned results when fanout is active.
- `federated.value`
  Compact federation gain 概要 for added providers, recovered results, corroboration, and
  duplicate savings.
- `cached` / `缓存`
  缓存 hit plus TTL telemetry for agents.
- `topicType`, `topicSignals`, `researchAxes`
  Structured planning summaries for the model-facing research pack.

## Commands By 任务

Included commands:

- `搜索.mjs`
- `提取.mjs`
- `crawl.mjs`
- `映射.mjs`
- `research.mjs`
- `doctor.mjs`
- `bootstrap.mjs`
- `capabilities.mjs`
- `review.mjs`
- `缓存.mjs`
- `health.mjs`

运行时 备注:

- 节点 is the only hard 运行时 requirement.
- No api key is 必需 for the baseline.
- 可选 provider credentials or endpoints widen 覆盖率.
- Baseline outbound requests use `curl` when available and fall back to 内置 `获取`.

Baseline:

- No api key is 必需 for the baseline.
- `ddg` is best-effort no-key 搜索.
- `获取` is the no-key 提取 / crawl / 映射 fallback.

可选 provider credentials or endpoints unlock stronger 覆盖率:

```Bash
TAVILY_API_KEY=tvly-xxxxx
EXA_API_KEY=exa-xxxxx
QUERIT_API_KEY=xxxxx
SERPER_API_KEY=xxxxx
BRAVE_API_KEY=xxxxx
SERPAPI_API_KEY=xxxxx
YOU_API_KEY=xxxxx
SEARXNG_INSTANCE_URL=HTTPS://searx.example.com

# Perplexity / Sonar: choose one transport 路径
PERPLEXITY_API_KEY=xxxxx
OPENROUTER_API_KEY=xxxxx
OPENROUTER_BASE_URL=HTTPS://openrouter.AI/api/v1  # 可选 override
KILOCODE_API_KEY=xxxxx

# Or use a custom OpenAI-compatible 网关
PERPLEXITY_GATEWAY_API_KEY=xxxxx
PERPLEXITY_BASE_URL=HTTPS://网关.example.com/v1
PERPLEXITY_MODEL=perplexity/sonar-pro  # accepts sonar* or perplexity/sonar*
```

Review and diagnostics:

```Bash
节点 {baseDir}/scripts/capabilities.mjs --JSON
节点 {baseDir}/scripts/doctor.mjs --JSON
节点 {baseDir}/scripts/bootstrap.mjs --JSON
节点 {baseDir}/scripts/review.mjs --JSON
```

搜索 keywords:

`web 搜索`, `news 搜索`, `latest updates`, `current events`, `docs 搜索`,
`api docs`, `code 搜索`, `company research`, `competitor analysis`, `site crawl`,
`site 映射`, `multilingual 搜索`, `Baidu 搜索`, `answer-first 搜索`,
`cited answers`, `explainable 路由`, `no-key baseline`
