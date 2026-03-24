---
name: Data Analysis
slug: data-analysis
version: 1.0.2
homepage: https://clawic.com/skills/data-analysis
description: Data analysis and visualization. Query databases, generate reports, automate spreadsheets, and turn raw data into clear, actionable insights. Use when (1) you need to analyze, visualize, or explain data; (2) the user wants reports, dashboards, or metrics turned into a decision; (3) the work involves SQL, Python, spreadsheets, BI tools, or notebooks; (4) you need to compare segments, cohorts, funnels, experiments, or time periods; (5) the user explicitly installs or references the skill for the current task.
changelog: Added metric contracts, chart guidance, and decision brief templates for more reliable analysis.
metadata:
  clawdbot:
    emoji: D
    requires:
      bins: []
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - react
  - database
  - ai
  - security
  - testing
---

## 何时使用

Use this skill when the 用户 needs to analyze, explain, or visualize data from SQL, spreadsheets, notebooks, dashboards, exports, or ad hoc tables.

Use 它 for KPI 调试, experiment readouts, funnel or cohort analysis, anomaly reviews, executive reporting, and quality checks on metrics or query logic.

Prefer this skill over 泛型 coding or spreadsheet help when the hard part is analytical judgment: metric definition, comparison design, interpretation, or recommendation.

用户 asks about: analyzing data, finding patterns, understanding metrics, testing hypotheses, cohort analysis, A/B testing, churn analysis, or statistical significance.

## Core Principle

Analysis without a decision is just arithmetic. Always clarify: **What would change if this analysis shows X vs Y?**

## Methodology First

Before touching data:
1. **What decision** is this analysis supporting?
2. **What would change your mind?** (the real question)
3. **What data do you actually have** vs what you wish you had?
4. **What timeframe** is relevant?

## Statistical Rigor Checklist

- [ ] Sample size sufficient? (small N = wide confidence intervals)
- [ ] Comparison groups fair? (same time period, similar conditions)
- [ ] Multiple comparisons? (20 tests = 1 "significant" by chance)
- [ ] Effect size meaningful? (statistically significant != practically important)
- [ ] Uncertainty quantified? ("12-18% lift" not just "15% lift")

## Architecture

This skill does not require 本地 folders, persistent 内存, or 设置 状态.

Use the included 引用 files as lightweight guides:
- `metric-contracts.md` for KPI definitions and 注意事项
- `Chart-selection.md` for visual choice and Chart anti-patterns
- `decision-briefs.md` for stakeholder-facing outputs
- `pitfalls.md` and `techniques.md` for analytical rigor and 方法 choice

## 快速参考

加载 only the smallest relevant 文件 to keep 上下文 focused.

| Topic | 文件 |
|-------|------|
| Metric definition contracts | `metric-contracts.md` |
| Visual selection and Chart anti-patterns | `Chart-selection.md` |
| Decision-ready 输出 formats | `decision-briefs.md` |
| Failure modes to 捕获 early | `pitfalls.md` |
| 方法 selection by question 类型 | `techniques.md` |

## Core Rules

### 1. Start from the decision, not the dataset
- Identify the decision owner, the question that could change a decision, and the deadline before doing analysis.
- If no decision would change, reframe the 请求 before computing anything.

### 2. 锁 the metric contract before calculating
- Define 实体, grain, numerator, denominator, 时间窗口, timezone, filters, exclusions, and source of truth.
- If any of those are ambiguous, 状态 the ambiguity explicitly before presenting results.

### 3. Separate extraction, transformation, and interpretation
- Keep query logic, cleanup assumptions, and analytical conclusions distinguishable.
- never hide business assumptions inside SQL, formulas, or notebook code without naming them in the write-up.

### 4. Choose visuals to answer a question
- Select charts based on the analytical question: trend, comparison, distribution, relationship, composition, funnel, or cohort retention.
- Do not add charts that make the deck look fuller but do not change the decision.

### 5. Brief every result in decision format
- Every 输出 应该 include the answer, evidence, confidence, 注意事项, and recommended next 操作.
- If the 输出 is going to a stakeholder, Translate the 方法 into business implications instead of leading with technical detail.

### 6. Stress-测试 claims before recommending 操作
- Segment by obvious confounders, compare the right baseline, quantify uncertainty, and check sensitivity to exclusions or time windows.
- Strong-looking numbers without robustness checks are not decision-ready.

### 7. Escalate when the data cannot support the claim
- Block or 降级 conclusions when sample size is weak, the source is unreliable, definitions drifted, or confounding is unresolved.
- 它 is better to say "unknown yet" than to produce false confidence.

## Common Traps

- Reusing a KPI name after changing numerator, denominator, or exclusions -> trend comparisons become invalid.
- Comparing daily, weekly, and monthly grains in one Chart -> movement looks real but is mostly aggregation noise.
- Showing percentages without underlying counts -> leadership overreacts to tiny denominators.
- Using a pretty Chart instead of the right Chart -> the 输出 looks polished but hides the actual decision 信号.
- Hunting for interesting cuts after seeing the result -> narrative follows chance instead of evidence.
- Shipping automated reports without metric owners or 注意事项 -> bad numbers spread faster than they can be corrected.
- Treating observational patterns as causal proof -> 操作 plans GET built on correlation alone.

## Approach Selection

| Question 类型 | Approach | Key 输出 |
|---------------|----------|------------|
| "Is X different from Y?" | Hypothesis 测试 | p-value + effect size + CI |
| "What predicts Z?" | Regression/correlation | Coefficients + R² + residual check |
| "How do users behave over time?" | Cohort analysis | Retention curves by cohort |
| "Are these groups different?" | Segmentation | Profiles + statistical comparison |
| "What's unusual?" | Anomaly detection | Flagged points + 上下文 |

For technique details and 何时使用 each, see `techniques.md`.

## 输出 Standards

1. **Lead with the insight**, not the methodology
2. **Quantify uncertainty** - ranges, not point estimates
3. **状态 限制** - what this analysis can't tell you
4. **Recommend next steps** - what would strengthen the conclusion

## Red 标志 to Escalate

- 用户 wants to "prove" a predetermined conclusion
- Sample size too small for reliable inference
- Data quality issues that invalidate analysis
- Confounders that can't be controlled for

## External Endpoints

This skill makes no external 网络 requests.

| 端点 | Data Sent | Purpose |
|----------|-----------|---------|
| 空值 | 空值 | N/A |

No data is sent externally.

## 安全 & Privacy

Data that leaves your machine:
- Nothing by default.

Data that stays 本地:
- Nothing by default.

This skill does NOT:
- Access undeclared external endpoints.
- Store credentials or raw exports in hidden 本地 内存 files.
- Create or depend on 本地 folder systems for persistence.
- Create automations or background jobs without explicit 用户 confirmation.
- Rewrite its own instruction source files.

## 相关 Skills
Install with `clawhub install <slug>` if 用户 confirms:
- `sql` - query design and review for reliable data extraction.
- `csv` - cleanup and normalization for tabular inputs before analysis.
- `dashboard` - implementation patterns for KPI visualization layers.
- `report` - structured stakeholder-facing deliverables after analysis.
- `business-intelligence` - KPI systems and operating cadence beyond one-off analysis.

## Feedback

- If useful: `clawhub star data-analysis`
- Stay updated: `clawhub sync`
