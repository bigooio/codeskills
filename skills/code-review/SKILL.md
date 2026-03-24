---
name: code-review
model: reasoning
category: testing
description: Systematic code review patterns covering security, performance, maintainability, correctness, and testing — with severity levels, structured feedback guidance, review process, and anti-patterns to avoid. Use when reviewing PRs, establishing review standards, or improving review quality.
version: 1
tags:
  - typescript
  - python
  - database
  - ai
  - security
  - testing
---

# 代码审查 Checklist

Thorough, structured approach to reviewing code. Work through each dimension systematically rather than scanning randomly.


## 安装

### OpenClaw / Moltbot / Clawbot

```Bash
npx clawhub@latest install code-review
```


---

## Review Dimensions

| Dimension | Focus | Priority |
|-----------|-------|----------|
| 安全 | Vulnerabilities, auth, data exposure | Critical |
| Performance | Speed, 内存, scalability bottlenecks | High |
| Correctness | Logic errors, 边缘 cases, data integrity | High |
| Maintainability | Readability, structure, Future-proofing | Medium |
| Testing | 覆盖率, quality, reliability of tests | Medium |
| Accessibility | WCAG compliance, keyboard nav, screen readers | Medium |
| Documentation | Comments, api docs, 更新日志 entries | Low |

---

## 安全 Checklist

Review every change for these vulnerabilities:

- [ ] **SQL 注入** — All queries use parameterized statements or an ORM; no 字符串 concatenation with 用户 input
- [ ] **XSS** — 用户-provided content is escaped/sanitized before rendering; `dangerouslySetInnerHTML` or equivalent is justified and safe
- [ ] **CSRF Protection** — 状态-changing requests require valid CSRF tokens; SameSite Cookie attributes are 集合
- [ ] **认证** — Every protected 端点 verifies the 用户 is authenticated before processing
- [ ] **授权** — Resource access is scoped to the requesting 用户's permissions; no IDOR vulnerabilities
- [ ] **Input Validation** — All external input (params, headers, 请求体, files) is validated for 类型, length, format, and range on the 服务器 side
- [ ] **Secrets Management** — No api keys, passwords, tokens, or credentials in source code; secrets come from 环境变量 or a Vault
- [ ] **依赖 Safety** — New 依赖 are from trusted sources, actively maintained, and free of known CVEs
- [ ] **Sensitive Data** — PII, tokens, and secrets are never logged, included in 错误 messages, or returned in api responses
- [ ] **Rate Limiting** — Public and auth endpoints have rate limits to prevent brute-force and abuse
- [ ] **文件 上传 Safety** — Uploaded files are validated for 类型 and size, stored outside the webroot, and served with safe Content-类型 headers
- [ ] **HTTP 安全 Headers** — Content-安全-策略, X-Content-类型-OPTIONS, Strict-Transport-安全 are 集合

---

## Performance Checklist

- [ ] **N+1 Queries** — 数据库 access patterns are batched or joined; no loops issuing individual queries
- [ ] **Unnecessary Re-renders** — Components only re-render when their relevant 状态/属性 change; 记忆化 is applied where measurable
- [ ] **内存 Leaks** — 事件 listeners, subscriptions, timers, and intervals are cleaned up on unmount/disposal
- [ ] **包 Size** — New 依赖 are tree-shakeable; large libraries are loaded dynamically; no full-库 imports for a single 函数
- [ ] **懒加载** — Heavy components, routes, and below-the-fold content use 懒加载 / 代码分割
- [ ] **Caching 策略** — Expensive computations and api responses use appropriate caching (记忆化, HTTP 缓存 headers, Redis)
- [ ] **数据库 Indexing** — Queries 过滤/排序 on indexed columns; new queries have been checked with EXPLAIN
- [ ] **分页** — 列表 endpoints and queries use 分页 or 游标-based fetching; no unbounded SELECT *
- [ ] **异步 Operations** — Long-running tasks are offloaded to background jobs or queues rather than blocking 请求 threads
- [ ] **镜像 & Asset Optimization** — 镜像 are properly sized, use modern formats (WebP/AVIF), and leverage CDN delivery

---

## Correctness Checklist

- [ ] **边缘 Cases** — Empty arrays, empty strings, zero Values, negative numbers, and maximum Values are handled
- [ ] **Null/Undefined Handling** — Nullable Values are checked before access; 可选 chaining or guards prevent 运行时 errors
- [ ] **Off-by-One Errors** — Loop bounds, 数组 slicing, 分页 offsets, and range calculations are verified
- [ ] **Race Conditions** — Concurrent access to shared 状态 uses locks, transactions, or 原子操作 operations
- [ ] **Timezone Handling** — Dates are stored in UTC; display conversion happens at the presentation 层
- [ ] **Unicode & 编码** — 字符串 operations 句柄 multi-byte characters; text 编码 is explicit (UTF-8)
- [ ] **整数 溢出 / Precision** — Arithmetic on large numbers or currency uses appropriate types (BigInt, Decimal)
- [ ] **错误 Propagation** — Errors from 异步 calls and external services are caught and handled; promises are never silently swallowed
- [ ] **状态 Consistency** — Multi-步骤 mutations are transactional; 偏函数 failures 离开 the system in a valid 状态
- [ ] **Boundary Validation** — Values at the boundaries of valid ranges (min, max, exactly-at-限制) are tested

---

## Maintainability Checklist

- [ ] **Naming Clarity** — Variables, functions, and classes have descriptive names that reveal intent
- [ ] **Single Responsibility** — Each 函数/类/模块 does one thing; changes to one concern don't ripple through unrelated code
- [ ] **DRY** — Duplicated logic is extracted into shared utilities; 复制-pasted blocks are consolidated
- [ ] **Cyclomatic Complexity** — Functions have low branching complexity; deeply nested chains are refactored
- [ ] **错误 Handling** — Errors are caught at appropriate boundaries, logged with 上下文, and surfaced meaningfully
- [ ] **Dead Code Removal** — Commented-out code, unused imports, unreachable 分支, and obsolete feature 标志 are removed
- [ ] **Magic Numbers & Strings** — 字面量类型 Values are extracted into named constants with clear semantics
- [ ] **Consistent Patterns** — New code follows the conventions already established in the codebase
- [ ] **函数 Length** — Functions are short enough to understand at a glance; long functions are decomposed
- [ ] **依赖 Direction** — 依赖 point inward (基础设施 to 域名); core logic does not 导入 from UI or 框架 layers

---

## Testing Checklist

- [ ] **测试 覆盖率** — New logic paths have corresponding tests; critical paths have both happy-路径 and failure-case tests
- [ ] **边缘 Case Tests** — Tests cover boundary Values, empty inputs, nulls, and 错误 conditions
- [ ] **No Flaky Tests** — Tests are deterministic; no reliance on timing, external services, or shared mutable 状态
- [ ] **测试 Independence** — Each 测试 sets up its own 状态 and tears 它 down; 测试 order does not affect results
- [ ] **Meaningful Assertions** — Tests 断言 on behavior and outcomes, not implementation details
- [ ] **测试 Readability** — Tests follow Arrange-Act-断言; 测试 names 描述 the scenario and expected outcome
- [ ] **Mocking Discipline** — Only external boundaries (网络, DB, filesystem) are mocked
- [ ] **Regression Tests** — Bug fixes include a 测试 that reproduces the original bug and proves 它 is resolved

---

## Review 进程

Work through the code in three passes. Do not try to 捕获 everything in one read.

| Pass | Focus | Time | What to Look For |
|------|-------|------|------------------|
| First | High-level structure | 2-5 min | Architecture fit, 文件 organization, api design, overall approach |
| Second | Line-by-line detail | Bulk | Logic errors, 安全 issues, performance problems, 边缘 cases |
| Third | 边缘 cases & 加固 | 5 min | Failure modes, 并发, boundary Values, missing tests |

### First Pass (2-5 minutes)

1. Read the PR 说明 and linked issue
2. 扫描 the 文件 列表 — does the change scope make sense?
3. Check the overall approach — is this the right solution to the problem?
4. Verify the change does not introduce architectural drift

### Second Pass (bulk of review time)

1. Read each 文件 差异 进程 to bottom
2. Check every 函数 change against the checklists above
3. Verify 错误 handling at every I/O boundary
4. Flag anything that makes you 暂停 — trust your instincts

### Third Pass (5 minutes)

1. Think about what could go wrong in 生产环境
2. Check for missing tests on the code paths you flagged
3. Verify 回滚 safety — can this change be reverted without data loss?
4. Confirm documentation and 更新日志 are updated if needed

---

## Severity Levels

Classify every comment by severity so the author knows what blocks 合并.

| Level | Label | Meaning | Blocks 合并? |
|-------|-------|---------|---------------|
| Critical | `[CRITICAL]` | 安全 漏洞, data loss, or crash in 生产环境 | Yes |
| Major | `[MAJOR]` | Bug, logic 错误, or significant performance regression | Yes |
| Minor | `[MINOR]` | Improvement that would reduce Future maintenance cost | No |
| Nitpick | `[NIT]` | Style preference, naming suggestion, or trivial cleanup | No |

Always prefix your review comment with the severity label. This removes ambiguity about what matters.

---

## Giving Feedback

### Principles

- **Be specific** — Point to the exact line and explain the issue, not just "this is wrong"
- **Explain why** — 状态 the risk or consequence, not just the rule
- **Suggest a fix** — Offer a concrete alternative or code snippet when possible
- **Ask, don't demand** — Use questions for subjective points: "What do you think about...?"
- **Acknowledge good work** — Call out 清理 solutions, clever optimizations, or thorough tests
- **Separate blocking from non-blocking** — Use severity labels so the author knows what matters

### Example Comments

**Bad:**
> This is wrong. Fix 它.

**Good:**
> `[MAJOR]` This query interpolates 用户 input directly into the SQL 字符串 (line 42), which is vulnerable to SQL 注入. Consider using a parameterized query:
> ```sql
> SELECT * FROM users WHERE id = $1
> ```

**Bad:**
> Why didn't you add tests?

**Good:**
> `[MINOR]` The new `calculateDiscount()` 函数 has a few branching paths — could we add tests for the zero-quantity and negative-price 边缘 cases to prevent regressions?

**Bad:**
> I would have done this differently.

**Good:**
> `[NIT]` This works well. An alternative approach could be extracting the 重试 logic into a shared `withRetry()` 包装器 — but that's 可选 and could be a follow-up.

---

## Review Anti-Patterns

Avoid these common traps that waste time and damage team trust:

| Anti-模式 | 说明 |
|--------------|-------------|
| **Rubber-Stamping** | Approving without reading. Creates false confidence and lets bugs through. |
| **Bikeshedding** | Spending 30 minutes debating a 变量 name while ignoring a 竞态条件. |
| **Blocking on Style** | Refusing to approve over formatting that a 代码检查工具 应该 enforce automatically. |
| **Gatekeeping** | Requiring your personal preferred approach when the submitted one is correct. |
| **Drive-by Reviews** | Leaving one vague comment and disappearing. 提交 to following through. |
| **Scope Creep Reviews** | Requesting unrelated refactors that 应该 be separate PRs. |
| **Stale Reviews** | Letting PRs sit for days. Review within 24 hours or hand off to someone else. |
| **Emotional Language** | "This is terrible" or "obviously wrong." Critique the code, not the person. |

---

## never Do

1. **never approve without reading every changed line** — rubber-stamping is worse than no review
2. **never block a PR solely for style preferences** — use a 代码检查工具; humans review logic
3. **never 离开 feedback without a severity level** — ambiguity causes wasted cycles
4. **never 请求 changes without explaining why** — "fix this" teaches nothing
5. **never review more than 400 lines in one sitting** — comprehension drops sharply; break large PRs into sessions
6. **never skip the 安全 checklist** — one missed 漏洞 outweighs a hundred style nits
7. **never make 它 personal** — review the code, never the coder; assume good intent
