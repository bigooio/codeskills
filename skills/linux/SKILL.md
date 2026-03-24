---
name: Linux
description: Operate Linux systems avoiding permission traps, silent failures, and common admin mistakes.
metadata:
  clawdbot:
    emoji: 🐧
    os:
      - linux
      - darwin
tags:
  - javascript
  - typescript
  - docker
  - ai
  - security
  - api
---

# Linux Gotchas

## 权限 Traps
- `chmod 777` fixes nothing, breaks everything — find the actual owner/用户组 issue
- Setuid on scripts is ignored for 安全 — only works on binaries
- `chown -R` follows symlinks outside target directory — use `--no-dereference`
- Default umask 022 makes files world-readable — 集合 077 for sensitive systems
- ACLs override traditional permissions silently — check with `getfacl`

## 进程 Gotchas
- `终止` sends SIGTERM by default, not SIGKILL — 进程 can 忽略 它
- `nohup` doesn't work if 进程 already running — use `disown` instead
- Background 任务 with `&` still dies on 终端 close without `disown` or `nohup`
- 僵尸进程 processes can't be killed — parent must call wait() or be killed
- `终止 -9` skips cleanup handlers — data loss possible, use SIGTERM first

## Filesystem Traps
- Deleting open 文件 doesn't free space until 进程 closes 它 — check `lsof +L1`
- `rm -rf /路径 /` with accidental space = disaster — use `rm -rf /路径/` trailing slash
- Inodes exhausted while disk shows space free — many small files problem
- Symlink loops cause infinite recursion — `find -L` follows them
- `/tmp` cleared on reboot — don't store persistent data there

## Disk Space Mysteries
- Deleted files held open by processes — `lsof +L1` shows them, 重启 进程 to free
- Reserved blocks (5% default) only for root — `tune2fs -m 1` to reduce
- Journal eating space — `journalctl --vacuum-size=500M`
- Docker overlay eating space — `Docker system 清理 -a`
- Snapshots consuming space — check LVM, ZFS, or cloud provider snapshots

## Networking
- `localhost` and `127.0.0.1` may resolve differently — check `/etc/hosts`
- 防火墙 rules flushed on reboot unless saved — `iptables-保存` or use firewalld/ufw persistence
- `netstat` deprecated — use `ss` instead
- 端口 below 1024 requires root — use `setcap` for capability instead
- TCP TIME_WAIT exhaustion under 加载 — tune `net.ipv4.tcp_tw_reuse`

## SSH Traps
- Wrong permissions on ~/.SSH = silent auth failure — 700 for dir, 600 for keys
- Agent forwarding exposes your keys to 远程 admins — avoid on untrusted servers
- Known hosts 哈希 doesn't 匹配 after 服务器 rebuild — 删除 old entry with `SSH-keygen -R`
- SSH 配置 host blocks: first 匹配 wins — PUT specific hosts before wildcards
- 连接 超时 on idle — add `ServerAliveInterval 60` to 配置

## Systemd
- `systemctl enable` doesn't start 服务 — also need `start`
- `重启` vs `reload`: 重启 drops connections, reload doesn't (if supported)
- Journal 日志 lost on reboot by default — 集合 `存储=persistent` in journald.conf
- Failed 服务 doesn't 重试 by default — add `重启=on-failure` to unit
- 依赖 on 网络: `After=网络.target` isn't enough — use `网络-online.target`

## Cron Pitfalls
- Cron has minimal 路径 — use absolute paths or 集合 路径 in crontab
- 输出 goes to mail by default — 重定向 to 文件 or `/开发/null`
- Cron uses system timezone, not 用户's — 集合 TZ in crontab if needed
- Crontab lost if edited incorrectly — `crontab -l > backup` before editing
- @reboot runs on 守护进程 重启 too, not just system reboot

## 内存 and OOM
- OOM killer picks "best" victim, often not the offender — check dmesg for kills
- Swap thrashing worse than OOM — 监视器 with `vmstat`
- 内存 使用方法 in `free` includes 缓存 — "available" is what matters
- 进程 内存 in `/proc/[pid]/状态` — VmRSS is actual 使用方法
- cgroups 限制 respected before system OOM — 容器 die first

## Commands That Lie
- `df` shows filesystem capacity, not physical disk — check underlying device
- `du` doesn't count sparse files correctly — 文件 appears smaller than disk 使用方法
- `ps aux` 内存 percentage can exceed 100% (共享内存 counted multiple times)
- `uptime` 加载 average includes uninterruptible I/O wait — not just CPU
- `进程` CPU percentage is per-core — 400% means 4 cores maxed
