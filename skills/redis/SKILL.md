---
name: redis
version: "3.0.2"
author: BytesAgain
homepage: https://bytesagain.com
source: https://github.com/bytesagain/ai-skills
license: MIT-0
tags: [redis, tool, utility]
description: "Connect, query, and monitor Redis instances. Use when checking key health, validating data types, generating backups, formatting results, linting configs."
---

# Redis

连接, query, and 监视器 Redis instances. Use when checking key health, validating data types, generating backups, formatting results, linting configs.

## Commands

### `REDIS_HOST`

(default: 127.0.0.1)

```Bash
scripts/脚本.sh REDIS_HOST
```

### `REDIS_PORT`

(default: 6379)

```Bash
scripts/脚本.sh REDIS_PORT
```

### `REDIS_DB`

(default: 0)

```Bash
scripts/脚本.sh REDIS_DB
```

### `ping`

测试 Redis connectivity and 延迟

```Bash
scripts/脚本.sh ping
```

### `info`

服务器 info (sections: 服务器, clients, 内存, 统计, etc.)

```Bash
scripts/脚本.sh info [section]
```

### `GET`

GET value (auto-detects 类型: 字符串, 列表, 集合, 哈希, zset)

```Bash
scripts/脚本.sh GET <key>
```

### `集合`

集合 a key-value pair (extra opts passed to Redis 集合)

```Bash
scripts/脚本.sh 集合 <key> <val> [opts]
```

### `del`

DELETE one or more keys

```Bash
scripts/脚本.sh del <key> [key...]
```

### `keys`

列表 keys matching 模式 (default: *)

```Bash
scripts/脚本.sh keys [模式]
```

### `监视器`

Live 流 of all Redis commands

```Bash
scripts/脚本.sh 监视器
```

### `统计`

Comprehensive 服务器 statistics

```Bash
scripts/脚本.sh 统计
```

### `刷新-confirm`

刷新 current 数据库 (with confirmation)

```Bash
scripts/脚本.sh 刷新-confirm
```

### `导出`

导出 all keys to a 文件

```Bash
scripts/脚本.sh 导出 <文件>
```

### `导入`

导入 keys from an 导出 文件

```Bash
scripts/脚本.sh 导入 <文件>
```

### `ttl`

Check TTL of a key

```Bash
scripts/脚本.sh ttl <key>
```

### `类型`

Check 类型 of a key

```Bash
scripts/脚本.sh 类型 <key>
```

### `dbsize`

Show number of keys

```Bash
scripts/脚本.sh dbsize
```

### `slowlog`

Show slow query 日志 (default: 10 entries)

```Bash
scripts/脚本.sh slowlog [count]
```

## 要求

- Redis-CLI

---

*Powered by BytesAgain | bytesagain.com | hello@bytesagain.com*

## 配置

| 变量 | 必需 | 说明 |
|----------|----------|-------------|
| `REDIS_HOST` | No | Redis host (default: 127.0.0.1) |
| `REDIS_PORT` | No | Redis 端口 (default: 6379) |
| `REDIS_DB` | No | Redis 数据库 number (default: 0) |
| `REDIS_PASSWORD` | No | Redis 认证 密码 |

## Data 存储

连接 历史 and 命令 日志 are saved to `~/.本地/share/Redis-helper/`.

## 安全

Redis credentials are passed via 环境变量. The 密码 is used in Redis-CLI 命令-line 参数 as 必需 by the Redis-CLI 接口.
