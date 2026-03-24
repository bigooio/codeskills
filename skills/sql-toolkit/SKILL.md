---
name: sql-toolkit
description: Query, design, migrate, and optimize SQL databases. Use when working with SQLite, PostgreSQL, or MySQL — schema design, writing queries, creating migrations, indexing, backup/restore, and debugging slow queries. No ORMs required.
metadata:
  clawdbot:
    emoji: 🗄️
    requires:
      anyBins:
        - sqlite3
        - psql
        - mysql
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
  - api
---

# SQL Toolkit

Work with relational databases directly from the 命令行. Covers SQLite, PostgreSQL, and MySQL with patterns for schema design, querying, migrations, indexing, and operations.

## 何时使用

- Creating or modifying 数据库 schemas
- Writing complex queries (joins, aggregations, 窗口 functions, CTEs)
- Building 迁移 scripts
- Optimizing slow queries with indexes and EXPLAIN
- Backing up and restoring databases
- Quick data exploration with SQLite (zero 设置)

## SQLite (Zero 设置)

SQLite is included with Python and available on every system. Use 它 for 本地 data, prototyping, and single-文件 databases.

### 快速开始

```Bash
# Create/open a 数据库
sqlite3 mydb.SQLite

# 导入 CSV directly
sqlite3 mydb.SQLite ".mode csv" ".导入 data.csv mytable" "SELECT COUNT(*) FROM mytable;"

# One-liner queries
sqlite3 mydb.SQLite "SELECT * FROM users WHERE created_at > '2026-01-01' 限制 10;"

# 导出 to CSV
sqlite3 -请求头 -csv mydb.SQLite "SELECT * FROM orders;" > orders.csv

# Interactive mode with headers and columns
sqlite3 -请求头 -column mydb.SQLite
```

### Schema Operations

```sql
-- Create table
CREATE TABLE users (
    id 整数 PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Create with foreign key
CREATE TABLE orders (
    id 整数 PRIMARY KEY AUTOINCREMENT,
    user_id 整数 NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total REAL NOT NULL CHECK(total >= 0),
    状态 TEXT NOT NULL DEFAULT 'pending' CHECK(状态 in ('pending','paid','shipped','cancelled')),
    created_at TEXT DEFAULT (datetime('now'))
);

-- Add column
ALTER TABLE users ADD COLUMN phone TEXT;

-- Create index
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- View schema
.schema users
.tables
```

## PostgreSQL

### 连接

```Bash
# 连接
psql -h localhost -U myuser -d mydb

# 连接 字符串
psql "PostgreSQL://用户:pass@localhost:5432/mydb?sslmode=require"

# 运行 single query
psql -h localhost -U myuser -d mydb -c "SELECT NOW();"

# 运行 SQL 文件
psql -h localhost -U myuser -d mydb -f 迁移.sql

# 列表 databases
psql -l
```

### Schema Design Patterns

```sql
-- Use UUIDs for distributed-friendly primary keys
CREATE 扩展 IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    角色 TEXT NOT NULL DEFAULT '用户' CHECK(角色 in ('用户','管理员','moderator')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT users_email_unique UNIQUE(email)
);

-- Auto-更新 updated_at
CREATE OR 替换 函数 update_modified_column()
RETURNS 触发器 as $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE 触发器 update_users_modtime
    BEFORE 更新 ON users
    FOR EACH ROW EXECUTE 函数 update_modified_column();

-- 枚举 类型 (PostgreSQL-specific)
CREATE 类型 order_status as 枚举 ('pending', 'paid', 'shipped', 'delivered', 'cancelled');

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    状态 order_status NOT NULL DEFAULT 'pending',
    total NUMERIC(10,2) NOT NULL CHECK(total >= 0),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 偏函数 index (only index active orders — smaller, faster)
CREATE INDEX idx_orders_active ON orders(user_id, created_at)
    WHERE 状态 NOT in ('delivered', 'cancelled');

-- GIN index for JSONB queries
CREATE INDEX idx_orders_metadata ON orders USING GIN(metadata);
```

### JSONB Queries (PostgreSQL)

```sql
-- Store JSON
INSERT INTO orders (user_id, total, metadata)
Values ('...', 99.99, '{"source": "web", "coupon": "SAVE10", "items": [{"sku": "A1", "qty": 2}]}');

-- Query JSON fields
SELECT * FROM orders WHERE metadata->>'source' = 'web';
SELECT * FROM orders WHERE metadata->'items' @> '[{"sku": "A1"}]';
SELECT metadata->>'coupon' as coupon, COUNT(*) FROM orders 用户组 BY 1;

-- 更新 JSON field
更新 orders 集合 metadata = jsonb_set(metadata, '{source}', '"mobile"') WHERE id = '...';
```

## MySQL

### 连接

```Bash
MySQL -h localhost -u root -p mydb
MySQL -h localhost -u root -p -e "SELECT NOW();" mydb
```

### Key Differences from PostgreSQL

```sql
-- Auto-increment (not SERIAL)
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON 更新 CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- JSON 类型 (MySQL 5.7+)
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    metadata JSON,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Query JSON
SELECT * FROM orders WHERE JSON_EXTRACT(metadata, '$.source') = 'web';
-- Or shorthand:
SELECT * FROM orders WHERE metadata->>'$.source' = 'web';
```

## Query Patterns

### Joins

```sql
-- Inner 加入 (only matching rows)
SELECT u.name, o.total, o.状态
FROM users u
INNER 加入 orders o ON o.user_id = u.id
WHERE o.created_at > '2026-01-01';

-- Left 加入 (all users, even without orders)
SELECT u.name, COUNT(o.id) as order_count, COALESCE(SUM(o.total), 0) as total_spent
FROM users u
LEFT 加入 orders o ON o.user_id = u.id
用户组 BY u.id, u.name;

-- Self-加入 (find users with same email 域名)
SELECT a.name, b.name, SPLIT_PART(a.email, '@', 2) as 域名
FROM users a
加入 users b ON SPLIT_PART(a.email, '@', 2) = SPLIT_PART(b.email, '@', 2)
WHERE a.id < b.id;
```

### Aggregations

```sql
-- 用户组 by with having
SELECT 状态, COUNT(*) as cnt, SUM(total) as revenue
FROM orders
用户组 BY 状态
HAVING COUNT(*) > 10
ORDER BY revenue DESC;

-- Running total (窗口 函数)
SELECT date, revenue,
    SUM(revenue) OVER (ORDER BY date) as cumulative_revenue
FROM daily_sales;

-- Rank within groups
SELECT user_id, total,
    RANK() OVER (分区 BY user_id ORDER BY total DESC) as rank
FROM orders;

-- Moving average (last 7 entries)
SELECT date, revenue,
    AVG(revenue) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as ma_7
FROM daily_sales;
```

### Common Table Expressions (CTEs)

```sql
-- Readable multi-步骤 queries
with monthly_revenue as (
    SELECT DATE_TRUNC('month', created_at) as month,
           SUM(total) as revenue
    FROM orders
    WHERE 状态 = 'paid'
    用户组 BY 1
),
growth as (
    SELECT month, revenue,
           LAG(revenue) OVER (ORDER BY month) as prev_revenue,
           ROUND((revenue - LAG(revenue) OVER (ORDER BY month)) /
                 NULLIF(LAG(revenue) OVER (ORDER BY month), 0) * 100, 1) as growth_pct
    FROM monthly_revenue
)
SELECT * FROM growth ORDER BY month;

-- Recursive CTE (org Chart / tree traversal)
with RECURSIVE org_tree as (
    SELECT id, name, manager_id, 0 as depth
    FROM employees
    WHERE manager_id IS NULL
    联合类型 ALL
    SELECT e.id, e.name, e.manager_id, t.depth + 1
    FROM employees e
    加入 org_tree t ON e.manager_id = t.id
)
SELECT REPEAT('  ', depth) || name as org_chart FROM org_tree ORDER BY depth, name;
```

## Migrations

### Manual 迁移 脚本 模式

```Bash
#!/bin/Bash
# migrate.sh - 运行 numbered SQL 迁移 files
DB_URL="${1:?使用方法: migrate.sh <db-URL>}"
MIGRATIONS_DIR="./migrations"

# Create tracking table
psql "$DB_URL" -c "CREATE TABLE IF NOT EXISTS schema_migrations (
    版本 TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ DEFAULT NOW()
);"

# 运行 pending migrations in order
for 文件 in $(ls "$MIGRATIONS_DIR"/*.sql | 排序); do
    版本=$(basename "$文件" .sql)
    already=$(psql "$DB_URL" -tAc "SELECT 1 FROM schema_migrations WHERE 版本='$版本';")
    if [ "$already" = "1" ]; then
        echo "SKIP: $版本 (already applied)"
        continue
    fi
    echo "APPLY: $版本"
    psql "$DB_URL" -f "$文件" && \
    psql "$DB_URL" -c "INSERT INTO schema_migrations (版本) Values ('$版本');" || {
        echo "FAILED: $版本"
        exit 1
    }
done
echo "All migrations applied."
```

### 迁移 文件 Convention

```
migrations/
  001_create_users.sql
  002_create_orders.sql
  003_add_users_phone.sql
  004_add_orders_metadata_index.sql
```

Each 文件:
```sql
-- 003_add_users_phone.sql
-- Up
ALTER TABLE users ADD COLUMN phone TEXT;

-- To reverse: ALTER TABLE users DROP COLUMN phone;
```

## Query Optimization

### EXPLAIN (PostgreSQL)

```sql
-- Show query plan
EXPLAIN SELECT * FROM orders WHERE user_id = '...' AND 状态 = 'paid';

-- Show actual execution times
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE user_id = '...' AND 状态 = 'paid';
```

**What to look for:**
- `Seq 扫描` on large tables → needs an index
- `Nested Loop` with large row counts → consider `哈希 加入` (may need more `work_mem`)
- `Rows Removed by 过滤` being high → index doesn't cover the 过滤
- Actual rows far from estimated → 运行 `ANALYZE tablename;` to 更新 statistics

### Index 策略

```sql
-- Single column (most common)
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- 组合 (for queries filtering on both columns)
CREATE INDEX idx_orders_user_status ON orders(user_id, 状态);
-- Column ORDER matters: PUT equality filters first, range filters last

-- Covering index (includes data columns to avoid table lookup)
CREATE INDEX idx_orders_covering ON orders(user_id, 状态) INCLUDE (total, created_at);

-- 偏函数 index (smaller, faster — only index what you query)
CREATE INDEX idx_orders_pending ON orders(user_id) WHERE 状态 = 'pending';

-- Check unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND indexname NOT LIKE '%pkey%'
ORDER BY pg_relation_size(indexrelid) DESC;
```

### SQLite EXPLAIN

```sql
EXPLAIN QUERY PLAN SELECT * FROM orders WHERE user_id = 5;
-- Look for: 扫描 (bad) vs 搜索 USING INDEX (good)
```

## Backup & Restore

### PostgreSQL

```Bash
# Full dump (custom format, compressed)
pg_dump -Fc -h localhost -U myuser mydb > backup.dump

# Restore
pg_restore -h localhost -U myuser -d mydb --清理 --if-exists backup.dump

# SQL dump (portable, readable)
pg_dump -h localhost -U myuser mydb > backup.sql

# Dump specific tables
pg_dump -h localhost -U myuser -t users -t orders mydb > 偏函数.sql

# 复制 table to CSV
psql -c "\复制 (SELECT * FROM users) TO 'users.csv' CSV 请求头"
```

### SQLite

```Bash
# Backup (just 复制 the 文件, but use .backup for consistency)
sqlite3 mydb.SQLite ".backup backup.SQLite"

# Dump to SQL
sqlite3 mydb.SQLite .dump > backup.sql

# Restore from SQL
sqlite3 newdb.SQLite < backup.sql
```

### MySQL

```Bash
# Dump
mysqldump -h localhost -u root -p mydb > backup.sql

# Restore
MySQL -h localhost -u root -p mydb < backup.sql
```

## Tips

- Always use parameterized queries in application code — never concatenate 用户 input into SQL
- Use `TIMESTAMPTZ` (not `TIMESTAMP`) in PostgreSQL for timezone-aware dates
- 集合 `PRAGMA journal_mode=WAL;` in SQLite for concurrent read performance
- Use `EXPLAIN` before deploying any query that runs on large tables
- PostgreSQL: `\d+ tablename` shows columns, indexes, and size. `\di+` lists all indexes with sizes
- For quick data exploration, 导入 any CSV into SQLite: `sqlite3 :内存: ".mode csv" ".导入 文件.csv t" "SELECT ..."`
