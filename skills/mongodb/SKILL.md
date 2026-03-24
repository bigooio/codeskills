---
name: MongoDB
slug: mongodb
version: 1.0.1
description: Design MongoDB schemas with proper embedding, indexing, aggregation, and production-ready patterns.
metadata:
  clawdbot:
    emoji: 🍃
    requires:
      anyBins:
        - mongosh
        - mongo
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - database
  - ai
  - security
  - testing
  - api
---

## 何时使用

用户 needs MongoDB expertise — from schema design to 生产环境 optimization. Agent handles document modeling, indexing strategies, aggregation pipelines, consistency patterns, and scaling.

## 快速参考

| Topic | 文件 |
|-------|------|
| Schema design patterns | `schema.md` |
| Index strategies | `indexes.md` |
| Aggregation 管道 | `aggregation.md` |
| 生产环境 配置 | `生产环境.md` |

## Schema Design Philosophy

- Embed when data is queried together and doesn't grow unboundedly
- 引用 when data is large, accessed independently, or many-to-many
- Denormalize for read performance, 接受 更新 complexity—no JOINs means duplicate data
- Design for your queries, not for normalized elegance

## Document Size Traps

- 16MB max per document—plan for this from day one; use GridFS for large files
- Arrays that grow infinitely = disaster—use bucketing 模式 instead
- BSON overhead: field names repeated per document—short names 保存 space at scale
- Nested depth 限制 100 levels—rarely hit but exists

## 数组 Traps

- Arrays > 1000 elements hurt performance—分页 inside documents is hard
- `$推送` without `$slice` = unbounded growth; use `$推送: {$each: [...], $slice: -100}`
- Multikey indexes on arrays: index entry per element—can explode index size
- Can't have multikey index on more than one 数组 field in compound index

## $lookup Traps

- `$lookup` performance degrades with collection size—no index on foreign collection (until 5.0)
- One `$lookup` per 管道 stage—nested lookups GET complex and slow
- `$lookup` with 管道 (5.0+) can 过滤 before joining—massive improvement
- Consider: if you $lookup frequently, maybe embed instead

## Index 策略

- ESR rule: Equality fields first, 排序 fields next, Range fields last
- MongoDB doesn't do efficient index 交叉类型—single compound index often better
- Only one text index per collection—plan carefully; use Atlas 搜索 for complex text
- TTL index for auto-expiration: `{createdAt: 1}, {expireAfterSeconds: 86400}`

## Consistency Traps

- Default read/write concern not fully consistent—`{w: "majority", readConcern: "majority"}` for strong
- Multi-document transactions since 4.0—but add 延迟 and 锁 overhead; design to minimize
- Single-document operations are 原子操作—exploit this by embedding 相关 data
- `retryWrites: true` in 连接 字符串—handles transient failures automatically

## Read Preference Traps

- Stale reads on secondaries—replication lag can be seconds
- `nearest` for lowest 延迟—but may read stale data
- Write always goes to primary—read preference doesn't affect writes
- Read your own writes: use `primary` or 会话-based causal consistency

## ObjectId Traps

- Contains timestamp: `ObjectId.getTimestamp()`—提取 creation time without extra field
- Roughly time-ordered—can 排序 by `_id` for creation order without createdAt
- Not random—predictable if you know creation time; don't rely on for 安全 tokens

## Performance Mindset

- `explain("executionStats")` shows actual execution—not just theoretical plan
- `totalDocsExamined` vs `nReturned` ratio 应该 be ~1—otherwise index missing
- `COLLSCAN` in explain = full collection 扫描—add appropriate index
- Covered queries: `IXSCAN` + `totalDocsExamined: 0`—all data from index

## Aggregation Philosophy

- 管道 stages are transformations—think of data flowing through
- 过滤 early (`$匹配`), project early (`$project`)—reduce data 存储卷 ASAP
- `$匹配` at start can use indexes; `$匹配` after `$unwind` cannot
- 测试 complex pipelines stage by stage—构建 incrementally

## Common Mistakes

- Treating MongoDB as "schemaless"—still need schema design; just enforced in app not DB
- Not adding indexes—scans entire collection; every query 模式 needs index
- Giant documents via 数组 pushes—hit 16MB 限制 or slow BSON parsing
- Ignoring write concern—data may appear written but not persisted/replicated
