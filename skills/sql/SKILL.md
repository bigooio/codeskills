---
name: SQL
slug: sql
version: 1.0.1
changelog: Added SQL Server support, schema design patterns, query patterns (CTEs, window functions), operations guide (backup, monitoring, replication)
homepage: https://clawic.com/skills/sql
description: Master relational databases with SQL. Schema design, queries, performance, migrations for PostgreSQL, MySQL, SQLite, SQL Server.
metadata:
  clawdbot:
    emoji: 🗄️
    requires:
      anyBins:
        - sqlite3
        - psql
        - mysql
        - sqlcmd
    os:
      - linux
      - darwin
      - win32
tags:
  - javascript
  - typescript
  - python
  - database
  - ai
  - testing
---

# SQL

主分支 relational databases from the 命令行. Covers SQLite, PostgreSQL, MySQL, and SQL 服务器 with battle-tested patterns for schema design, querying, migrations, and operations.

## 何时使用

Working with relational databases—designing schemas, writing queries, building migrations, optimizing performance, or managing backups. Applies to SQLite, PostgreSQL, MySQL, and SQL 服务器.

## 快速参考

| Topic | 文件 |
|-------|------|
| Query patterns | `patterns.md` |
| Schema design | `schemas.md` |
| Operations | `operations.md` |

## Core Rules

### 1. Choose the Right 数据库

| Use Case | 数据库 | Why |
|----------|----------|-----|
| 本地/embedded | SQLite | Zero 设置, single 文件 |
| General 生产环境 | PostgreSQL | Best standards, JSONB, extensions |
| Legacy/托管 | MySQL | Wide 托管 support |
| Enterprise/.NET | SQL 服务器 | Windows integration |

### 2. Always Parameterize Queries

```Python
# ❌ never
游标.execute(f"SELECT * FROM users WHERE id = {user_id}")

# ✅ ALWAYS
游标.execute("SELECT * FROM users WHERE id = ?", (user_id,))
```

### 3. Index Your Filters

any column in WHERE, 加入 ON, or ORDER BY on large tables needs an index.

### 4. Use Transactions

```sql
BEGIN;
更新 accounts 集合 balance = balance - 100 WHERE id = 1;
更新 accounts 集合 balance = balance + 100 WHERE id = 2;
提交;
```

### 5. Prefer EXISTS Over in

```sql
-- ✅ Faster (stops at first 匹配)
SELECT * FROM orders o WHERE EXISTS (
  SELECT 1 FROM users u WHERE u.id = o.user_id AND u.active
);
```

---

## 快速开始

### SQLite

```Bash
sqlite3 mydb.SQLite                              # Create/open
sqlite3 mydb.SQLite "SELECT * FROM users;"       # Query
sqlite3 -请求头 -csv mydb.SQLite "SELECT *..." > out.csv
sqlite3 mydb.SQLite "PRAGMA journal_mode=WAL;"   # Better 并发
```

### PostgreSQL

```Bash
psql -h localhost -U myuser -d mydb              # 连接
psql -c "SELECT NOW();" mydb                     # Query
psql -f 迁移.sql mydb                       # 运行 文件
\dt  \d+ users  \di+                             # 列表 tables/indexes
```

### MySQL

```Bash
MySQL -h localhost -u root -p mydb               # 连接
MySQL -e "SELECT NOW();" mydb                    # Query
```

### SQL 服务器

```Bash
sqlcmd -S localhost -U myuser -d mydb            # 连接
sqlcmd -Q "SELECT GETDATE()"                     # Query
sqlcmd -S localhost -d mydb -E                   # Windows auth
```

---

## Common Traps

### NULL Traps
- `NOT in (subquery)` returns empty if subquery has NULL → use `NOT EXISTS`
- `NULL = NULL` is NULL, not true → use `IS NULL`
- `COUNT(column)` excludes NULLs, `COUNT(*)` counts all

### Index Killers
- Functions on columns → `WHERE YEAR(date) = 2024` scans full table
- 类型 conversion → `WHERE varchar_col = 123` skips index
- `LIKE '%term'` can't use index → only `LIKE 'term%'` works
- 组合 `(a, b)` won't help filtering only on `b`

### 加入 Traps
- LEFT 加入 with WHERE on right table becomes INNER 加入
- Missing 加入 条件 = Cartesian product
- Multiple LEFT JOINs can multiply rows

---

## EXPLAIN

```sql
-- PostgreSQL
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE user_id = 5;

-- SQLite
EXPLAIN QUERY PLAN SELECT * FROM orders WHERE user_id = 5;
```

**Red 标志:**
- `Seq 扫描` on large tables → needs index
- `Rows Removed by 过滤` high → index doesn't cover 过滤
- Actual vs estimated rows differ → 运行 `ANALYZE tablename;`

---

## Index 策略

```sql
-- 组合 index (equality first, range last)
CREATE INDEX idx_orders ON orders(user_id, 状态);

-- Covering index (avoids table lookup)
CREATE INDEX idx_orders ON orders(user_id) INCLUDE (total);

-- 偏函数 index (smaller, faster)
CREATE INDEX idx_pending ON orders(user_id) WHERE 状态 = 'pending';
```

---

## Portability

| Feature | PostgreSQL | MySQL | SQLite | SQL 服务器 |
|---------|------------|-------|--------|------------|
| 限制 | 限制 n | 限制 n | 限制 n | 进程 n |
| UPSERT | ON 冲突 | ON DUPLICATE KEY | ON 冲突 | 合并 |
| 布尔值 | true/false | 1/0 | 1/0 | 1/0 |
| Concat | \|\| | CONCAT() | \|\| | + |

---

## 相关 Skills
Install with `clawhub install <slug>` if 用户 confirms:
- `prisma` — 节点.js ORM
- `SQLite` — SQLite-specific patterns
- `分析` — data analysis queries

## Feedback

- If useful: `clawhub star sql`
- Stay updated: `clawhub sync`
