---
name: data-analyst
version: 1.0.0
description: Data visualization, report generation, SQL queries, and spreadsheet automation. Transform your AI agent into a data-savvy analyst that turns raw data into actionable insights.
author: openclaw
tags:
  - javascript
  - typescript
  - python
  - database
  - ai
  - security
---

# Data Analyst Skill 📊

**Turn your AI agent into a data analysis powerhouse.**

Query databases, analyze spreadsheets, create visualizations, and generate insights that drive decisions.

---

## What This Skill Does

✅ **SQL Queries** — Write and execute queries against databases
✅ **Spreadsheet Analysis** — 进程 CSV, Excel, Google Sheets data
✅ **Data Visualization** — Create charts, graphs, and dashboards
✅ **Report Generation** — Automated reports with insights
✅ **Data Cleaning** — 句柄 missing data, outliers, formatting
✅ **Statistical Analysis** — Descriptive 统计, trends, correlations

---

## 快速开始

1. Configure your data sources in `TOOLS.md`:
```markdown
### Data Sources
- Primary DB: [连接 字符串 or 说明]
- Spreadsheets: [Google Sheets URL / 本地 路径]
- 数据仓库: [BigQuery/Snowflake/etc.]
```

2. 集合 up your 工作空间:
```Bash
./scripts/data-init.sh
```

3. Start analyzing!

---

## SQL Query Patterns

### Common Query Templates

**Basic Data Exploration**
```sql
-- Row count
SELECT COUNT(*) FROM table_name;

-- Sample data
SELECT * FROM table_name 限制 10;

-- Column statistics
SELECT 
    column_name,
    COUNT(*) as count,
    COUNT(DISTINCT column_name) as unique_values,
    MIN(column_name) as min_val,
    MAX(column_name) as max_val
FROM table_name
用户组 BY column_name;
```

**Time-Based Analysis**
```sql
-- Daily aggregation
SELECT 
    DATE(created_at) as date,
    COUNT(*) as daily_count,
    SUM(amount) as daily_total
FROM transactions
用户组 BY DATE(created_at)
ORDER BY date DESC;

-- Month-over-month comparison
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as count,
    LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) as prev_month,
    (COUNT(*) - LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at))) / 
        NULLIF(LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)), 0) * 100 as growth_pct
FROM transactions
用户组 BY DATE_TRUNC('month', created_at)
ORDER BY month;
```

**Cohort Analysis**
```sql
-- 用户 cohort by signup month
SELECT 
    DATE_TRUNC('month', u.created_at) as cohort_month,
    DATE_TRUNC('month', o.created_at) as activity_month,
    COUNT(DISTINCT u.id) as users
FROM users u
LEFT 加入 orders o ON u.id = o.user_id
用户组 BY cohort_month, activity_month
ORDER BY cohort_month, activity_month;
```

**Funnel Analysis**
```sql
-- Conversion funnel
with funnel as (
    SELECT
        COUNT(DISTINCT CASE WHEN 事件 = 'page_view' THEN user_id END) as views,
        COUNT(DISTINCT CASE WHEN 事件 = 'signup' THEN user_id END) as signups,
        COUNT(DISTINCT CASE WHEN 事件 = 'purchase' THEN user_id END) as purchases
    FROM events
    WHERE date >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT 
    views,
    signups,
    ROUND(signups * 100.0 / NULLIF(views, 0), 2) as signup_rate,
    purchases,
    ROUND(purchases * 100.0 / NULLIF(signups, 0), 2) as purchase_rate
FROM funnel;
```

---

## Data Cleaning

### Common Data Quality Issues

| Issue | Detection | Solution |
|-------|-----------|----------|
| **Missing Values** | `IS NULL` or empty 字符串 | Impute, drop, or flag |
| **Duplicates** | `用户组 BY` with `HAVING COUNT(*) > 1` | Deduplicate with rules |
| **Outliers** | Z-score > 3 or IQR 方法 | Investigate, cap, or exclude |
| **Inconsistent formats** | Sample and 模式 匹配 | Standardize with transforms |
| **Invalid Values** | Range checks, referential integrity | 验证 and correct |

### Data Cleaning SQL Patterns

```sql
-- Find duplicates
SELECT email, COUNT(*)
FROM users
用户组 BY email
HAVING COUNT(*) > 1;

-- Find nulls
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END) as null_emails,
    SUM(CASE WHEN name IS NULL THEN 1 ELSE 0 END) as null_names
FROM users;

-- Standardize text
更新 products
集合 category = LOWER(TRIM(category));

-- 删除 outliers (IQR 方法)
with 统计 as (
    SELECT 
        PERCENTILE_CONT(0.25) WITHIN 用户组 (ORDER BY value) as q1,
        PERCENTILE_CONT(0.75) WITHIN 用户组 (ORDER BY value) as q3
    FROM data
)
SELECT * FROM data, 统计
WHERE value BETWEEN q1 - 1.5*(q3-q1) AND q3 + 1.5*(q3-q1);
```

### Data Cleaning Checklist

```markdown
# Data Quality Audit: [Dataset]

## Row-Level Checks
- [ ] Total row count: [X]
- [ ] Duplicate rows: [X]
- [ ] Rows with any null: [X]

## Column-Level Checks
| Column | 类型 | Nulls | Unique | Min | Max | Issues |
|--------|------|-------|--------|-----|-----|--------|
| [col] | [类型] | [n] | [n] | [v] | [v] | [备注] |

## Data Lineage
- Source: [Where data came from]
- Last updated: [Date]
- Known issues: [列表]

## Cleaning Actions Taken
1. [操作 and reason]
2. [操作 and reason]
```

---

## Spreadsheet Analysis

### CSV/Excel Processing with Python

```Python
导入 pandas as pd

# 加载 data
df = pd.read_csv('data.csv')  # or pd.read_excel('data.xlsx')

# Basic exploration
print(df.shape)  # (rows, columns)
print(df.info())  # Column types and nulls
print(df.描述())  # Numeric statistics

# Data cleaning
df = df.drop_duplicates()
df['date'] = pd.to_datetime(df['date'])
df['amount'] = df['amount'].fillna(0)

# Analysis
概要 = df.groupby('category').agg({
    'amount': ['sum', 'mean', 'count'],
    'quantity': 'sum'
}).round(2)

# 导出
概要.to_csv('analysis_output.csv')
```

### Common Pandas Operations

```Python
# Filtering
filtered = df[df['状态'] == 'active']
filtered = df[df['amount'] > 1000]
filtered = df[df['date'].between('2024-01-01', '2024-12-31')]

# Aggregation
by_category = df.groupby('category')['amount'].sum()
pivot = df.pivot_table(Values='amount', index='month', columns='category', aggfunc='sum')

# 窗口 functions
df['running_total'] = df['amount'].cumsum()
df['pct_change'] = df['amount'].pct_change()
df['rolling_avg'] = df['amount'].rolling(窗口=7).mean()

# 合并中
merged = pd.合并(df1, df2, on='id', how='left')
```

---

## Data Visualization

### Chart Selection Guide

| Data 类型 | Best Chart | Use When |
|-----------|------------|----------|
| Trend over time | Line Chart | Showing patterns/changes over time |
| Category comparison | Bar Chart | Comparing discrete categories |
| Part of whole | Pie/Donut | Showing proportions (≤5 categories) |
| Distribution | Histogram | Understanding data spread |
| Correlation | Scatter plot | Relationship between two variables |
| Many categories | Horizontal bar | Ranking or comparing many items |
| Geographic | 映射 | Location-based data |

### Python Visualization with Matplotlib/Seaborn

```Python
导入 matplotlib.pyplot as plt
导入 seaborn as SNS

# 集合 style
plt.style.use('seaborn-v0_8-whitegrid')
SNS.set_palette("husl")

# Line Chart (trends)
plt.figure(figsize=(10, 6))
plt.plot(df['date'], df['value'], marker='o')
plt.title('Trend Over Time')
plt.xlabel('Date')
plt.ylabel('Value')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('trend.png', dpi=150)

# Bar Chart (comparisons)
plt.figure(figsize=(10, 6))
SNS.barplot(data=df, x='category', y='amount')
plt.title('Amount by Category')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('comparison.png', dpi=150)

# Heatmap (correlations)
plt.figure(figsize=(10, 8))
SNS.heatmap(df.corr(), annot=True, cmap='coolwarm', center=0)
plt.title('Correlation Matrix')
plt.tight_layout()
plt.savefig('correlation.png', dpi=150)
```

### ASCII Charts (Quick 终端 Visualization)

When you can't generate 镜像, use ASCII:

```
Revenue by Month (in $K)
========================
Jan: ████████████████ 160
Feb: ██████████████████ 180
Mar: ████████████████████████ 240
Apr: ██████████████████████ 220
May: ██████████████████████████ 260
Jun: ████████████████████████████ 280
```

---

## Report Generation

### Standard Report 模板

```markdown
# [Report Name]
**Period:** [Date range]
**Generated:** [Date]
**Author:** [Agent/Human]

## Executive 概要
[2-3 sentences with key findings]

## Key Metrics

| Metric | Current | Previous | Change |
|--------|---------|----------|--------|
| [Metric] | [Value] | [Value] | [+/-X%] |

## Detailed Analysis

### [Section 1]
[Analysis with supporting data]

### [Section 2]
[Analysis with supporting data]

## Visualizations
[Insert charts]

## Insights
1. **[Insight]**: [Supporting evidence]
2. **[Insight]**: [Supporting evidence]

## Recommendations
1. [Actionable recommendation]
2. [Actionable recommendation]

## Methodology
- Data source: [Source]
- Date range: [Range]
- Filters applied: [Filters]
- Known 限制: [限制]

## Appendix
[Supporting data tables]
```

### Automated Report 脚本

```Bash
#!/bin/Bash
# generate-report.sh

# 拉取 latest data
Python scripts/extract_data.py --输出 data/latest.csv

# 运行 analysis
Python scripts/analyze.py --input data/latest.csv --输出 reports/

# Generate report
Python scripts/format_report.py --模板 weekly --输出 reports/weekly-$(date +%Y-%m-%d).md

echo "Report generated: reports/weekly-$(date +%Y-%m-%d).md"
```

---

## Statistical Analysis

### Descriptive Statistics

| Statistic | What 它 Tells You | Use Case |
|-----------|-------------------|----------|
| **Mean** | Average value | Central tendency |
| **Median** | Middle value | Robust to outliers |
| **Mode** | Most common | Categorical data |
| **Std 开发** | Spread around mean | Variability |
| **Min/Max** | Range | Data boundaries |
| **Percentiles** | Distribution shape | Benchmarking |

### Quick 统计 with Python

```Python
# Full descriptive statistics
统计 = df['amount'].描述()
print(统计)

# Additional 统计
print(f"Median: {df['amount'].median()}")
print(f"Mode: {df['amount'].mode()[0]}")
print(f"Skewness: {df['amount'].skew()}")
print(f"Kurtosis: {df['amount'].kurtosis()}")

# Correlation
correlation = df['sales'].corr(df['marketing_spend'])
print(f"Correlation: {correlation:.3f}")
```

### Statistical Tests 快速参考

| 测试 | Use Case | Python |
|------|----------|--------|
| T-测试 | Compare two means | `scipy.统计.ttest_ind(a, b)` |
| Chi-square | Categorical independence | `scipy.统计.chi2_contingency(table)` |
| ANOVA | Compare 3+ means | `scipy.统计.f_oneway(a, b, c)` |
| Pearson | Linear correlation | `scipy.统计.pearsonr(x, y)` |

---

## Analysis 工作流

### Standard Analysis 进程

1. **Define the Question**
   - What are we trying to answer?
   - What decisions will this inform?

2. **Understand the Data**
   - What data is available?
   - What's the structure and quality?

3. **清理 and Prepare**
   - 句柄 missing Values
   - Fix data types
   - 删除 duplicates

4. **Explore**
   - Descriptive statistics
   - Initial visualizations
   - Identify patterns

5. **Analyze**
   - Deep dive into findings
   - Statistical tests if needed
   - 验证 hypotheses

6. **Communicate**
   - Clear visualizations
   - Actionable insights
   - Recommendations

### Analysis 请求 模板

```markdown
# Analysis 请求

## Question
[What are we trying to answer?]

## 上下文
[Why does this matter? What decision will 它 inform?]

## Data Available
- [Dataset 1]: [说明]
- [Dataset 2]: [说明]

## Expected 输出
- [Deliverable 1]
- [Deliverable 2]

## Timeline
[When is this needed?]

## 备注
[any constraints or considerations]
```

---

## Scripts

### data-init.sh
Initialize your data analysis 工作空间.

### query.sh
Quick SQL query execution.

```Bash
# 运行 query from 文件
./scripts/query.sh --文件 queries/daily-report.sql

# 运行 inline query
./scripts/query.sh "SELECT COUNT(*) FROM users"

# 保存 输出 to 文件
./scripts/query.sh --文件 queries/导出.sql --输出 data/导出.csv
```

### analyze.py
Python analysis toolkit.

```Bash
# Basic analysis
Python scripts/analyze.py --input data/sales.csv

# with specific analysis 类型
Python scripts/analyze.py --input data/sales.csv --类型 cohort

# Generate report
Python scripts/analyze.py --input data/sales.csv --report weekly
```

---

## Integration Tips

### with Other Skills

| Skill | Integration |
|-------|-------------|
| **Marketing** | Analyze campaign performance, content metrics |
| **Sales** | 管道 分析, conversion analysis |
| **Business 开发** | Market research data, competitor analysis |

### Common Data Sources

- **Databases:** PostgreSQL, MySQL, SQLite
- **Warehouses:** BigQuery, Snowflake, Redshift
- **Spreadsheets:** Google Sheets, Excel, CSV
- **APIs:** REST endpoints, GraphQL
- **Files:** JSON, Parquet, XML

---

## 最佳实践

1. **Start with the question** — Know what you're trying to answer
2. **验证 your data** — Garbage in = garbage out
3. **Document everything** — Queries, assumptions, decisions
4. **Visualize appropriately** — Right Chart for right data
5. **Show your work** — Methodology matters
6. **Lead with insights** — Not just data dumps
7. **Make 它 actionable** — "So what?" → "Now what?"
8. **版本 your queries** — Track changes over time

---

## Common Mistakes

❌ **Confirmation bias** — Looking for data to support a conclusion
❌ **Correlation ≠ causation** — Be careful with claims
❌ **Cherry-picking** — Using only favorable data
❌ **Ignoring outliers** — Investigate before removing
❌ **Over-complicating** — Simple analysis often wins
❌ **No 上下文** — Numbers without comparison are meaningless

---

## 许可

**许可:** MIT — use freely, modify, distribute.

---

*"The goal is to turn data into information, and information into insight." — Carly Fiorina*
