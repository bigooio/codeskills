---
name: docker-debug-container
description: Docker 容器调试技巧。适用于排查容器问题、检查日志、进入容器内部、网络诊断、监控资源等场景。
compatibility: 需要 Docker 已安装并运行
tags:
  - typescript
  - docker
  - ai
  - api
  - backend
  - bash
---

# Docker 容器调试技巧

容器化应用出问题怎么办？这些命令帮你快速定位。

## 进入容器

```Bash
# 进入运行中的容器（Bash）
Docker 执行 -它 <container_id> /bin/Bash

# 进入运行中的容器（sh，适合轻量镜像）
Docker 执行 -它 <container_id> /bin/sh

# 以 root 身份进入
Docker 执行 -它 --特权模式 <container_id> /bin/Bash

# 在容器中执行单个命令
Docker 执行 <container_id> ls -la /app
```

## 查看日志

```Bash
# 查看实时日志
Docker 日志 -f <container_id>

# 查看最近 100 行
Docker 日志 --tail 100 <container_id>

# 查看时间戳
Docker 日志 -t <container_id>

# 查看最近 1 小时的日志
Docker 日志 --since "1h" <container_id>

# 查看错误日志
Docker 日志 <container_id> 2>&1 | grep -i 错误
```

## 网络诊断

```Bash
# 检查容器网络
Docker 网络 检查 <network_name>

# 查看容器 ip
Docker 检查 -f '{{range .NetworkSettings.网络}}{{.IPAddress}}{{end}}' <container_id>

# 测试容器间网络
Docker 执行 <container1> ping <container2_ip>

# 查看端口映射
Docker 端口 <container_id>
```

## 资源监控

```Bash
# 实时查看资源使用
Docker 统计

# 查看所有容器资源（只显示一次）
Docker 统计 --no-流

# 查看特定容器
Docker 统计 <container_id>

# 检查容器配置
Docker 检查 <container_id>
```

## 文件操作

```Bash
# 从容器复制文件到主机
Docker cp <container_id>:/路径/in/容器/文件.txt ./

# 从主机复制文件到容器
Docker cp ./文件.txt <container_id>:/路径/in/容器/

# 查看容器文件系统变化
Docker 差异 <container_id>
```

## 常见问题排查

### 容器无法启动

```Bash
# 查看详细错误
Docker 日志 <container_id>

# 检查配置
Docker 检查 <container_id>

# 查看事件
Docker events --since "10m"
```

### 性能问题

```Bash
# 检查 CPU、内存
Docker 统计 --no-流

# 进入容器检查进程
Docker 执行 -它 <container_id> 进程

# 检查磁盘
Docker 执行 -它 <container_id> df -h
```

### 网络问题

```Bash
# 测试 DNS
Docker 执行 -它 <container_id> nslookup google.com

# 检查连接
Docker 执行 -它 <container_id> curl -v HTTP://api:端口/health

# 查看路由表
Docker 执行 -它 <container_id> netstat -r
```

## 最佳实践

1. `Docker 日志 -f` 实时追踪问题
2. `Docker 执行` 进入容器调试
3. `Docker 统计` 快速定位资源问题
4. `Docker 网络 检查` 排查网络配置
5. 先看日志再看配置，逐层排查
