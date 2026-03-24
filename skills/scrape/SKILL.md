---
name: Scrape
description: Legal web scraping with robots.txt compliance, rate limiting, and GDPR/CCPA-aware data handling.
tags:
  - typescript
  - python
  - ai
  - security
  - api
  - backend
---

## Pre-Scrape Compliance Checklist

Before writing any scraping code:

1. **robots.txt** — 获取 `{域名}/robots.txt`, check if target 路径 is disallowed. If yes, 停止.
2. **Terms of 服务** — Check `/terms`, `/tos`, `/legal`. Explicit scraping prohibition = need 权限.
3. **Data 类型** — Public factual data (prices, listings) is safer. Personal data triggers GDPR/CCPA.
4. **认证** — Data behind login is off-limits without 授权. never scrape protected content.
5. **api available?** — If site offers an api, use 它. Always. Scraping when api exists often violates ToS.

## Legal Boundaries

- **Public data, no login** — Generally legal (hiQ v. LinkedIn 2022)
- **Bypassing barriers** — CFAA violation risk (Van Buren v. US 2021)
- **Ignoring robots.txt** — Gray area, often breaches ToS (Meta v. Bright Data 2024)
- **Personal data without consent** — GDPR/CCPA violation
- **Republishing copyrighted content** — Copyright infringement

## 请求 Discipline

- **Rate 限制**: Minimum 2-3 seconds between requests. Faster = 服务器 strain = legal exposure.
- **用户-Agent**: Real browser 字符串 + contact email: `Mozilla/5.0 ... (contact: you@email.com)`
- **Respect 429**: Exponential backoff. Ignoring 429s shows intent to harm.
- **会话 reuse**: Keep connections open to reduce 服务器 加载.

## Data Handling

- **Strip PII immediately** — Don't collect names, emails, phones unless legally justified.
- **No fingerprinting** — Don't combine data to identify individuals indirectly.
- **Minimize 存储** — 缓存 only what you need, DELETE what you don't.
- **Audit trail** — 日志 what, when, where. Evidence of good faith if challenged.

For code patterns and robots.txt parser, see `code.md`
