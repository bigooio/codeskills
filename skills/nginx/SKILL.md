---
name: Nginx
slug: nginx
version: 1.0.1
description: Configure Nginx for reverse proxy, load balancing, SSL termination, and high-performance static serving.
tags:
  - javascript
  - typescript
  - devops
  - ai
  - testing
  - api
---

## 何时使用

用户 needs Nginx expertise — from basic 服务器 blocks to 生产环境 configurations. Agent handles 反向代理, SSL, caching, and performance tuning.

## 快速参考

| Topic | 文件 |
|-------|------|
| 反向代理 patterns | `代理.md` |
| SSL/TLS 配置 | `SSL.md` |
| Performance tuning | `performance.md` |
| Common configurations | `示例.md` |

## Location Matching

- Exact `=` first, then `^~` prefix, then 正则表达式 `~`/`~*`, then longest prefix
- `location /api` matches `/api`, `/api/`, `/api/anything` — prefix 匹配
- `location = /api` only matches exactly `/api` — not `/api/`
- `location ~ \.php$` is 正则表达式, case-sensitive — `~*` for case-insensitive
- `^~` stops 正则表达式 搜索 if prefix matches — use for 静态 files

## proxy_pass Trailing Slash

- `proxy_pass HTTP://后端` preserves location 路径 — `/api/users` → `/api/users`
- `proxy_pass HTTP://后端/` replaces location 路径 — `/api/users` → `/users`
- Common mistake: missing slash = double 路径 — or unexpected 路由
- 测试 with `curl -v` to see actual 后端 请求

## try_files

- `try_files $uri $uri/ /index.html` for SPA — checks 文件, then dir, then fallback
- Last 参数 is internal 重定向 — or `=404` for 错误
- `$uri/` tries directory with index — 集合 `index index.html`
- Don't use for proxied locations — use `proxy_pass` directly

## 代理 Headers

- `proxy_set_header host $host` — 后端 sees original host, not 代理 ip
- `proxy_set_header X-Real-ip $remote_addr` — 客户端 ip, not 代理
- `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for` — append to chain
- `proxy_set_header X-Forwarded-Proto $scheme` — for HTTPS detection

## Upstream

- Define servers in `upstream` block — `upstream 后端 { 服务器 127.0.0.1:3000; }`
- `proxy_pass HTTP://后端` uses upstream — 加载 balancing included
- Health checks with `max_fails` and `fail_timeout` — marks 服务器 unavailable
- `keepalive 32` for 连接 pooling — reduces 连接 overhead

## SSL/TLS

- `ssl_certificate` is full chain — cert + intermediates, not just cert
- `ssl_certificate_key` is private key — keep permissions restricted
- `ssl_protocols TLSv1.2 TLSv1.3` — disable older protocols
- `ssl_prefer_server_ciphers on` — 服务器 chooses cipher, not 客户端

## Common Mistakes

- `Nginx -t` before `Nginx -s reload` — 测试 配置 first
- Missing semicolon — 语法 错误, vague message
- `root` inside `location` — prefer in `服务器`, override only when needed
- `alias` vs `root` — alias replaces location, root appends location
- Variables in `if` — many things break inside if, avoid complex logic

## Variables

- `$uri` is decoded, normalized 路径 — `/foo%20bar` becomes `/foo bar`
- `$request_uri` is original with 查询字符串 — unchanged from 客户端
- `$args` is 查询字符串 — `$arg_name` for specific parameter
- `$host` from host 请求头 — `$server_name` from 配置

## Performance

- `worker_processes auto` — matches CPU cores
- `worker_connections 1024` — per 工作节点, multiply by workers for max
- `sendfile on` — kernel-level 文件 transfer
- `gzip on` only for text — `gzip_types text/plain application/JSON ...`
- `gzip_min_length 1000` — small files not worth compressing

## 日志

- `access_log off` for 静态 assets — reduces I/O
- Custom 日志 format with `log_format` — add 响应 time, upstream time
- `error_log` level: `debug`, `info`, `warn`, `错误` — debug is verbose
- Conditional 日志 with `映射` and `if` — skip health checks
