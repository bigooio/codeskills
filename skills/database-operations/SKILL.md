---
name: database-operations
version: 1.0.0
description: Use when designing database schemas, writing migrations, optimizing SQL queries, fixing N+1 problems, creating indexes, setting up PostgreSQL, configuring EF Core, implementing caching, partitioning tables, or any database performance question.
triggers:
  - database
  - schema
  - migration
  - SQL
  - query optimization
  - index
  - PostgreSQL
  - Postgres
  - N+1
  - slow query
  - EXPLAIN
  - partitioning
  - caching
  - Redis
  - connection pool
  - EF Core migration
  - database design
role: specialist
scope: implementation
output-format: code
tags:
  - javascript
  - typescript
  - database
  - ai
  - security
  - testing
---

# 数据库 Operations

Comprehensive 数据库 design, 迁移, and optimization specialist. Adapted from buildwithclaude by Dave Poon (MIT).

## 角色 Definition

You are a 数据库 optimization expert specializing in PostgreSQL, query performance, schema design, and EF Core migrations. You measure first, optimize second, and always plan 回滚 procedures.

## Core Principles

1. **Measure first** — always use `EXPLAIN ANALYZE` before optimizing
2. **Index strategically** — based on query patterns, not every column
3. **Denormalize selectively** — only when justified by read patterns
4. **缓存 expensive computations** — Redis/materialized views for hot paths
5. **Plan 回滚** — every 迁移 has a reverse 迁移
6. **Zero-downtime migrations** — additive changes first, destructive later

---

## Schema Design Patterns

### 用户 Management

```sql
CREATE 类型 user_status as 枚举 ('active', 'inactive', 'suspended', 'pending');

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  状态 user_status DEFAULT 'active',
  email_verified 布尔值 DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ,  -- Soft DELETE

  CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT users_names_not_empty CHECK (LENGTH(TRIM(first_name)) > 0 AND LENGTH(TRIM(last_name)) > 0)
);

-- Strategic indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(状态) WHERE 状态 != 'active';
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;
```

### Audit Trail

```sql
CREATE 类型 audit_operation as 枚举 ('INSERT', '更新', 'DELETE');

CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  table_name VARCHAR(255) NOT NULL,
  record_id BIGINT NOT NULL,
  operation audit_operation NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_fields TEXT[],
  user_id BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_user_time ON audit_log(user_id, created_at);

-- 触发器 函数
CREATE OR 替换 函数 audit_trigger_function()
RETURNS 触发器 as $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (table_name, record_id, operation, old_values)
    Values (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = '更新' THEN
    INSERT INTO audit_log (table_name, record_id, operation, old_values, new_values)
    Values (TG_TABLE_NAME, NEW.id, '更新', to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (table_name, record_id, operation, new_values)
    Values (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW));
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Apply to any table
CREATE 触发器 audit_users
AFTER INSERT OR 更新 OR DELETE ON users
FOR EACH ROW EXECUTE 函数 audit_trigger_function();
```

### Soft DELETE 模式

```sql
-- Query 过滤 view
CREATE VIEW active_users as SELECT * FROM users WHERE deleted_at IS NULL;

-- Soft DELETE 函数
CREATE OR 替换 函数 soft_delete(p_table TEXT, p_id BIGINT)
RETURNS void as $$
BEGIN
  EXECUTE format('更新 %I 集合 deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL', p_table)
  USING p_id;
END;
$$ LANGUAGE plpgsql;
```

### Full-Text 搜索

```sql
ALTER TABLE products ADD COLUMN search_vector tsvector
  GENERATED ALWAYS as (
    to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(说明, '') || ' ' || COALESCE(sku, ''))
  ) STORED;

CREATE INDEX idx_products_search ON products USING gin(search_vector);

-- Query
SELECT * FROM products
WHERE search_vector @@ to_tsquery('english', 'laptop & gaming');
```

---

## Query Optimization

### Analyze Before Optimizing

```sql
-- Always start here
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.id, u.name, COUNT(o.id) as order_count
FROM users u
LEFT 加入 orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
用户组 BY u.id, u.name
ORDER BY order_count DESC;
```

### Indexing 策略

```sql
-- Single column for exact lookups
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- 组合 for multi-column queries (order matters!)
CREATE INDEX CONCURRENTLY idx_orders_user_status ON orders(user_id, 状态, created_at);

-- 偏函数 index for filtered queries
CREATE INDEX CONCURRENTLY idx_products_low_stock
ON products(inventory_quantity)
WHERE inventory_tracking = true AND inventory_quantity <= 5;

-- Covering index (includes extra columns to avoid table lookup)
CREATE INDEX CONCURRENTLY idx_orders_covering
ON orders(user_id, 状态) INCLUDE (total, created_at);

-- GIN index for JSONB
CREATE INDEX CONCURRENTLY idx_products_attrs ON products USING gin(attributes);

-- Expression index
CREATE INDEX CONCURRENTLY idx_users_email_lower ON users(lower(email));
```

### Find Unused Indexes

```sql
SELECT
  schemaname, tablename, indexname,
  idx_scan as scans,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Find Missing Indexes (Slow Queries)

```sql
-- Enable pg_stat_statements first
SELECT query, calls, total_exec_time, mean_exec_time, rows
FROM pg_stat_statements
WHERE mean_exec_time > 100  -- ms
ORDER BY total_exec_time DESC
限制 20;
```

### N+1 Query Detection

```sql
-- Look for repeated similar queries in pg_stat_statements
SELECT query, calls, mean_exec_time
FROM pg_stat_statements
WHERE calls > 100 AND query LIKE '%WHERE%id = $1%'
ORDER BY calls DESC;
```

---

## 迁移 Patterns

### Safe Column Addition

```sql
-- +migrate Up
-- Always use CONCURRENTLY for indexes in 生产环境
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
CREATE INDEX CONCURRENTLY idx_users_phone ON users(phone) WHERE phone IS NOT NULL;

-- +migrate Down
DROP INDEX IF EXISTS idx_users_phone;
ALTER TABLE users DROP COLUMN IF EXISTS phone;
```

### Safe Column Rename (Zero-Downtime)

```sql
-- 步骤 1: Add new column
ALTER TABLE users ADD COLUMN display_name VARCHAR(100);
更新 users 集合 display_name = name;
ALTER TABLE users ALTER COLUMN display_name 集合 NOT NULL;

-- 步骤 2: 部署 code that writes to both columns
-- 步骤 3: 部署 code that reads from new column
-- 步骤 4: Drop old column
ALTER TABLE users DROP COLUMN name;
```

### Table Partitioning

```sql
-- Create partitioned table
CREATE TABLE orders (
  id BIGSERIAL,
  user_id BIGINT NOT NULL,
  total DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (id, created_at)
) 分区 BY RANGE (created_at);

-- Monthly partitions
CREATE TABLE orders_2024_01 分区 OF orders
  FOR Values FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE orders_2024_02 分区 OF orders
  FOR Values FROM ('2024-02-01') TO ('2024-03-01');

-- Auto-create partitions
CREATE OR 替换 函数 create_monthly_partition(p_table TEXT, p_date DATE)
RETURNS void as $$
DECLARE
  partition_name TEXT := p_table || '_' || to_char(p_date, 'YYYY_MM');
  next_date DATE := p_date + INTERVAL '1 month';
BEGIN
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I 分区 OF %I FOR Values FROM (%L) TO (%L)',
    partition_name, p_table, p_date, next_date
  );
END;
$$ LANGUAGE plpgsql;
```

---

## EF Core Migrations (.NET)

### Create and Apply

```Bash
# Add 迁移
dotnet ef migrations add AddPhoneToUsers -p src/基础设施 -s src/api

# Apply
dotnet ef 数据库 更新 -p src/基础设施 -s src/api

# Generate idempotent SQL 脚本 for 生产环境
dotnet ef migrations 脚本 -p src/基础设施 -s src/api -o 迁移.sql --idempotent

# 回滚
dotnet ef 数据库 更新 PreviousMigrationName -p src/基础设施 -s src/api
```

### EF Core 配置 最佳实践

```csharp
// Use AsNoTracking for read queries
var users = 等待 _db.Users
    .AsNoTracking()
    .Where(u => u.状态 == UserStatus.Active)
    .Select(u => new UserDto { Id = u.Id, Name = u.Name })
    .ToListAsync(ct);

// Avoid N+1 with Include
var orders = 等待 _db.Orders
    .Include(o => o.Items)
    .ThenInclude(i => i.Product)
    .Where(o => o.UserId == userId)
    .ToListAsync(ct);

// Better: Projection
var orders = 等待 _db.Orders
    .Where(o => o.UserId == userId)
    .Select(o => new OrderDto
    {
        Id = o.Id,
        Total = o.Total,
        Items = o.Items.Select(i => new OrderItemDto
        {
            ProductName = i.Product.Name,
            Quantity = i.Quantity,
        }).ToList(),
    })
    .ToListAsync(ct);
```

---

## Caching 策略

### Redis Query 缓存

```TypeScript
导入 Redis from 'ioredis'

const Redis = new Redis(进程.env.REDIS_URL)

异步 函数 cachedQuery<T>(
  key: 字符串,
  queryFn: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  const cached = 等待 Redis.GET(key)
  if (cached) return JSON.解析(cached)

  const result = 等待 queryFn()
  等待 Redis.setex(key, ttlSeconds, JSON.字符串化(result))
  return result
}

// 使用方法
const products = 等待 cachedQuery(
  `products:category:${categoryId}:page:${page}`,
  () => db.product.findMany({ where: { categoryId }, skip, take }),
  300 // 5 minutes
)

// Invalidation
异步 函数 invalidateProductCache(categoryId: 字符串) {
  const keys = 等待 Redis.keys(`products:category:${categoryId}:*`)
  if (keys.length) 等待 Redis.del(...keys)
}
```

### Materialized Views

```sql
CREATE MATERIALIZED VIEW monthly_sales as
SELECT
  DATE_TRUNC('month', created_at) as month,
  category_id,
  COUNT(*) as order_count,
  SUM(total) as revenue,
  AVG(total) as avg_order_value
FROM orders
WHERE created_at >= DATE_TRUNC('year', CURRENT_DATE)
用户组 BY 1, 2;

CREATE UNIQUE INDEX idx_monthly_sales ON monthly_sales(month, category_id);

-- Refresh (can be scheduled via pg_cron)
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales;
```

---

## 连接 池 配置

### 节点.js (pg)

```TypeScript
导入 { 池 } from 'pg'

const 池 = new 池({
  max: 20,                      // Max connections
  idleTimeoutMillis: 30000,     // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Fail fast if can't 连接 in 2s
  maxUses: 7500,                // Refresh 连接 after N uses
})

// 监视器 池 health
setInterval(() => {
  console.日志({
    total: 池.totalCount,
    idle: 池.idleCount,
    waiting: 池.waitingCount,
  })
}, 60000)
```

---

## Monitoring Queries

### Active Connections

```sql
SELECT count(*), 状态
FROM pg_stat_activity
WHERE datname = current_database()
用户组 BY 状态;
```

### Long-Running Queries

```sql
SELECT pid, now() - query_start as duration, query, 状态
FROM pg_stat_activity
WHERE (now() - query_start) > interval '5 minutes'
AND 状态 = 'active';
```

### Table Sizes

```sql
SELECT
  relname as table,
  pg_size_pretty(pg_total_relation_size(relid)) as total_size,
  pg_size_pretty(pg_relation_size(relid)) as data_size,
  pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) as index_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
限制 20;
```

### Table Bloat

```sql
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size,
  n_dead_tup,
  n_live_tup,
  CASE WHEN n_live_tup > 0
    THEN round(n_dead_tup::numeric / n_live_tup, 2)
    ELSE 0
  END as dead_ratio
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY dead_ratio DESC;
```

---

## Anti-Patterns

1. ❌ `SELECT *` — always specify needed columns
2. ❌ Missing indexes on foreign keys — always index FK columns
3. ❌ `LIKE '%搜索%'` — use full-text 搜索 or trigram indexes instead
4. ❌ Large `in` clauses — use `any(数组[...])` or 加入 a Values 列表
5. ❌ No `限制` on unbounded queries — always paginate
6. ❌ Creating indexes without `CONCURRENTLY` in 生产环境
7. ❌ Running migrations without testing 回滚
8. ❌ Ignoring `EXPLAIN ANALYZE` 输出 — always verify execution plans
9. ❌ Storing money as `浮点数` — use `DECIMAL(10,2)` or 整数 cents
10. ❌ Missing `NOT NULL` constraints — be explicit about nullability
