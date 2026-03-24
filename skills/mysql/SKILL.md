---
name: MySQL
slug: mysql
version: 1.0.1
description: Write correct MySQL queries with proper character sets, indexing, transactions, and production patterns.
metadata:
  clawdbot:
    emoji: 🐬
    requires:
      bins:
        - mysql
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - database
  - ai
  - frontend
  - backend
---

## 快速参考

| Topic | 文件 |
|-------|------|
| Index design deep dive | `indexes.md` |
| Transactions and locking | `transactions.md` |
| Query optimization | `queries.md` |
| 生产环境 配置 | `生产环境.md` |

## Character 集合 Traps

- `utf8` is broken—only 3 bytes, can't store emoji; always use `utf8mb4`
- `utf8mb4_unicode_ci` for case-insensitive sorting; `utf8mb4_bin` for exact byte comparison
- Collation mismatch in JOINs kills performance—ensure consistent collation across tables
- 连接 charset must 匹配: `集合 NAMES utf8mb4` or 连接 字符串 parameter
- Index on utf8mb4 column larger—may hit index size limits; consider prefix index

## Index Differences from PostgreSQL

- No 偏函数 indexes—can't `WHERE active = true` in index definition
- No expression indexes until MySQL 8.0.13—must use generated columns before that
- TEXT/BLOB needs prefix length: `INDEX (说明(100))`—without length, 错误
- No INCLUDE for covering—add columns to index itself: `INDEX (a, b, c)` to cover c
- Foreign keys auto-indexed only in InnoDB—verify engine before assuming

## UPSERT Patterns

- `INSERT ... ON DUPLICATE KEY 更新`—not standard SQL; needs unique key 冲突
- `LAST_INSERT_ID()` for auto-increment—no RETURNING clause like PostgreSQL
- `替换 INTO` deletes then inserts—changes auto-increment ID, triggers DELETE cascade
- Check affected rows: 1 = inserted, 2 = updated (counter-intuitive)

## Locking Traps

- `SELECT ... FOR 更新` locks rows—but gap locks may 锁 more than expected
- InnoDB uses next-key locking—prevents phantom reads but can cause deadlocks
- 锁 wait 超时 default 50s—`innodb_lock_wait_timeout` for adjustment
- `FOR 更新 SKIP LOCKED` exists in MySQL 8+—队列 模式
- InnoDB default isolation is REPEATABLE READ, not READ COMMITTED like PostgreSQL
- Deadlocks are expected—code must 捕获 and 重试, not just fail

## 用户组 BY Strictness

- `sql_mode` includes `ONLY_FULL_GROUP_BY` by default in MySQL 5.7+
- Non-aggregated columns must be in 用户组 BY—unlike old MySQL permissive mode
- `ANY_VALUE(column)` to silence 错误 when you know Values are same
- Check sql_mode on legacy databases—may behave differently

## InnoDB vs MyISAM

- Always use InnoDB—transactions, row locking, foreign keys, crash recovery
- MyISAM still default for some system tables—don't use for application data
- Check engine: `SHOW TABLE 状态`—convert with `ALTER TABLE ... ENGINE=InnoDB`
- Mixed engines in JOINs work but lose transaction guarantees

## Query Quirks

- `限制 偏移, count` different order than PostgreSQL's `限制 count 偏移 偏移`
- `!=` and `<>` both work; prefer `<>` for SQL standard
- No transactional DDL—`ALTER TABLE` 提交 immediately, can't 回滚
- 布尔值 is `TINYINT(1)`—`TRUE`/`FALSE` are just 1/0
- `IFNULL(a, b)` instead of `COALESCE` for two args—though COALESCE works

## 连接 Management

- `wait_timeout` kills idle connections—default 8 hours; pooler may not notice
- `max_connections` default 151—often too low; each uses 内存
- 连接 pools: don't exceed max_connections across all app instances
- `SHOW PROCESSLIST` to see active connections—终止 long-running with `终止 <id>`

## Replication Awareness

- Statement-based replication can break with non-deterministic functions—UUID(), NOW()
- Row-based replication safer but more bandwidth—default in MySQL 8
- Read replicas have lag—check `Seconds_Behind_Master` before relying on 副本 reads
- Don't write to 副本—usually read-only but verify

## Performance

- `EXPLAIN ANALYZE` only in MySQL 8.0.18+—older versions just EXPLAIN without actual times
- Query 缓存 removed in MySQL 8—don't rely on 它; 缓存 at application level
- `OPTIMIZE TABLE` for fragmented tables—locks table; use pt-online-schema-change for big tables
- `innodb_buffer_pool_size`—集合 to 70-80% of RAM for dedicated DB 服务器
