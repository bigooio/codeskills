---
name: Django
slug: django
version: 1.0.1
description: Build secure Django apps avoiding ORM pitfalls, N+1 queries, and common security traps.
metadata:
  clawdbot:
    emoji: 🌿
    requires:
      bins:
        - python3
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - database
  - ai
  - security
  - frontend
---

## 快速参考

| Topic | 文件 |
|-------|------|
| QuerySet 懒惰 eval, N+1, transactions | `orm.md` |
| 请求 handling, 中间件, 上下文 | `views.md` |
| Validation, CSRF, 文件 uploads | `forms.md` |
| Migrations, signals, managers | `models.md` |
| XSS, CSRF, SQL 注入, auth | `安全.md` |
| 异步 views, ORM in 异步, channels | `异步.md` |

## Critical Rules

- QuerySets are 懒惰 — iterating twice hits DB twice, use `列表()` to 缓存
- `select_related` for FK/O2O, `prefetch_related` for M2M — or N+1 queries
- `更新()` skips `保存()` — no signals fire, no `auto_now` 更新
- `F()` for 原子操作 updates — `F('count') + 1` avoids race conditions
- `GET()` raises `DoesNotExist` or `MultipleObjectsReturned` — use `过滤().first()` for safe
- `DEBUG=False` requires `ALLOWED_HOSTS` — 400 Bad 请求 without 它
- Forms need `{% csrf_token %}` — or 403 Forbidden on POST
- `auto_now` can't be overridden — use `default=timezone.now` if need manual 集合
- `exclude(field=空值)` excludes NULL — use `过滤(field__isnull=True)` for NULL
- Circular imports in models — use 字符串 引用: `ForeignKey('app.Model')`
- `transaction.原子操作()` doesn't 捕获 exceptions — errors still propagate
- `sync_to_async` for ORM in 异步 views — ORM is sync-only
