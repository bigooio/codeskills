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

```bash
# 进入运行中的容器（bash）
docker exec -it <container_id> /bin/bash

# 进入运行中的容器（sh，适合轻量镜像）
docker exec -it <container_id> /bin/sh

# 以 root 身份进入
docker exec -it --privileged <container_id> /bin/bash

# 在容器中执行单个命令
docker exec <container_id> ls -la /app
```

## 查看日志

```bash
# 查看实时日志
docker logs -f <container_id>

# 查看最近 100 行
docker logs --tail 100 <container_id>

# 查看时间戳
docker logs -t <container_id>

# 查看最近 1 小时的日志
docker logs --since "1h" <container_id>

# 查看错误日志
docker logs <container_id> 2>&1 | grep -i error
```

## 网络诊断

```bash
# 检查容器网络
docker network inspect <network_name>

# 查看容器 IP
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_id>

# 测试容器间网络
docker exec <container1> ping <container2_ip>

# 查看端口映射
docker port <container_id>
```

## 资源监控

```bash
# 实时查看资源使用
docker stats

# 查看所有容器资源（只显示一次）
docker stats --no-stream

# 查看特定容器
docker stats <container_id>

# 检查容器配置
docker inspect <container_id>
```

## 文件操作

```bash
# 从容器复制文件到主机
docker cp <container_id>:/path/in/container/file.txt ./

# 从主机复制文件到容器
docker cp ./file.txt <container_id>:/path/in/container/

# 查看容器文件系统变化
docker diff <container_id>
```

## 常见问题排查

### 容器无法启动

```bash
# 查看详细错误
docker logs <container_id>

# 检查配置
docker inspect <container_id>

# 查看事件
docker events --since "10m"
```

### 性能问题

```bash
# 检查 CPU、内存
docker stats --no-stream

# 进入容器检查进程
docker exec -it <container_id> top

# 检查磁盘
docker exec -it <container_id> df -h
```

### 网络问题

```bash
# 测试 DNS
docker exec -it <container_id> nslookup google.com

# 检查连接
docker exec -it <container_id> curl -v http://api:port/health

# 查看路由表
docker exec -it <container_id> netstat -r
```

## 最佳实践

1. `docker logs -f` 实时追踪问题
2. `docker exec` 进入容器调试
3. `docker stats` 快速定位资源问题
4. `docker network inspect` 排查网络配置
5. 先看日志再看配置，逐层排查
